// Data access. Two backends with the same shape:
//   supabaseStore() — the real database (login required)
//   demoStore()     — in-memory sample data for trying the app (open index.html#demo); nothing is saved

import { SUPABASE_URL, SUPABASE_KEY } from './config.js';

export const TABLES = ['students', 'attempts', 'responses', 'mastery_overrides', 'lessons', 'homework', 'school_results'];

let clientPromise;
async function client() {
  clientPromise ||= import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.49.4/+esm')
    .then(({ createClient }) => createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: true } }));
  return clientPromise;
}

const must = ({ data, error }) => { if (error) throw new Error(error.message); return data; };

export function supabaseStore() {
  return {
    demo: false,
    async session() { const sb = await client(); return (await sb.auth.getSession()).data.session; },
    async signIn(email, password) { const sb = await client(); must(await sb.auth.signInWithPassword({ email, password })); },
    async signOut() { const sb = await client(); await sb.auth.signOut(); },
    async resetPassword(email) {
      const sb = await client();
      must(await sb.auth.resetPasswordForEmail(email, { redirectTo: location.href.split('#')[0] }));
    },
    async loadAll() {
      const sb = await client();
      const out = {};
      await Promise.all(TABLES.map(async (t) => { out[t] = must(await sb.from(t).select('*')); }));
      const s = must(await sb.from('settings').select('data').maybeSingle());
      out.settings = s?.data || {};
      return out;
    },
    async insert(table, row) { const sb = await client(); return must(await sb.from(table).insert(row).select().single()); },
    async update(table, id, patch) { const sb = await client(); return must(await sb.from(table).update(patch).eq('id', id).select().single()); },
    async remove(table, id) { const sb = await client(); must(await sb.from(table).delete().eq('id', id)); },
    async setOverride(student_id, sub, state) {
      const sb = await client();
      if (!state) must(await sb.from('mastery_overrides').delete().eq('student_id', student_id).eq('sub', sub));
      else must(await sb.from('mastery_overrides').upsert({ student_id, sub, state }));
    },
    async saveSettings(data) {
      const sb = await client();
      const { data: { user } } = await sb.auth.getUser();
      must(await sb.from('settings').upsert({ tutor_id: user.id, data }));
    },
    /** Insert or replace an attempt together with its responses. */
    async saveAttempt(attempt, responses) {
      const sb = await client();
      const { id, ...fields } = attempt;
      const saved = id ? must(await sb.from('attempts').update(fields).eq('id', id).select().single())
        : must(await sb.from('attempts').insert(fields).select().single());
      if (id) must(await sb.from('responses').delete().eq('attempt_id', id));
      const rows = responses.map((r) => ({ attempt_id: saved.id, qid: r.qid, choice: r.choice ?? null,
        mark: r.mark ?? null, mistakes: r.mistakes || [] }));
      const savedResponses = rows.length ? must(await sb.from('responses').insert(rows).select()) : [];
      return { attempt: saved, responses: savedResponses };
    },
    async family(token) { const sb = await client(); return must(await sb.rpc('family_view', { p_token: token })); },
  };
}

// ---------- demo ----------

const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2));
export const newToken = () => {
  const b = new Uint8Array(24);
  crypto.getRandomValues(b);
  return btoa(String.fromCharCode(...b)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

export function demoStore(seed) {
  const db = structuredClone(seed);
  const table = (t) => (db[t] ||= []);
  return {
    demo: true,
    async session() { return { user: { email: 'demo@example.com' } }; },
    async signIn() {}, async signOut() {}, async resetPassword() {},
    async loadAll() { return structuredClone(db); },
    async insert(t, row) { const r = { ...row, id: row.id || uid() }; if (t === 'students') r.family_token ||= newToken(); table(t).push(r); return structuredClone(r); },
    async update(t, id, patch) { const r = table(t).find((x) => x.id === id); Object.assign(r, patch); return structuredClone(r); },
    async remove(t, id) {
      db[t] = table(t).filter((x) => x.id !== id);
      if (t === 'attempts') db.responses = table('responses').filter((x) => x.attempt_id !== id);
      if (t === 'students') for (const k of TABLES) db[k] = table(k).filter((x) => x.student_id !== id);
    },
    async setOverride(student_id, sub, state) {
      db.mastery_overrides = table('mastery_overrides').filter((o) => !(o.student_id === student_id && o.sub === sub));
      if (state) db.mastery_overrides.push({ student_id, sub, state });
    },
    async saveSettings(data) { db.settings = structuredClone(data); },
    async saveAttempt(attempt, responses) {
      const a = attempt.id ? Object.assign(table('attempts').find((x) => x.id === attempt.id), attempt) : { ...attempt, id: uid() };
      if (!attempt.id) table('attempts').push(a);
      db.responses = table('responses').filter((r) => r.attempt_id !== a.id);
      const rs = responses.map((r) => ({ mistakes: [], ...r, id: uid(), attempt_id: a.id }));
      db.responses.push(...rs);
      return { attempt: structuredClone(a), responses: structuredClone(rs) };
    },
    async family(token) {
      const s = table('students').find((x) => x.family_token === token && x.status !== 'Left');
      if (!s) return null;
      const attempts = table('attempts').filter((a) => a.student_id === s.id)
        .map(({ private_note, tutor_id, ...a }) => ({ ...a, responses: table('responses').filter((r) => r.attempt_id === a.id)
          .map(({ qid, choice, mark, mistakes }) => ({ qid, choice, mark, mistakes })) }));
      return {
        student: { name: s.name, form: s.form, dse_year: s.dse_year, elective: s.elective, language: s.language },
        attempts,
        overrides: Object.fromEntries(table('mastery_overrides').filter((o) => o.student_id === s.id).map((o) => [o.sub, o.state])),
        taught: [...new Set(table('lessons').filter((l) => l.student_id === s.id).flatMap((l) => l.subs))],
        school: table('school_results').filter((r) => r.student_id === s.id)
          .map(({ date, exam, mark, max, predicted_grade }) => ({ date, exam, mark, max, predicted_grade })),
        settings: db.settings || {},
      };
    },
  };
}
