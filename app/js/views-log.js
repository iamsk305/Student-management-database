// Log (or edit) an attempt: student → paper → what was done → MC keypad / LQ marks → comment → save.
import { t, subName, getLang } from './i18n.js';
import { h, today, field, select, toast } from './ui.js';
import { paperItems, itemLabel, withDefaults } from './logic.js';

const YEARS = (index) => Object.keys(index.bank.papers).map(Number).sort((a, b) => b - a);

/** Routes: #/log, #/log/<studentId>, #/log/<studentId>/hw-<homeworkId>, #/log/edit/<attemptId> */
export function logView(app, a, b) {
  let attempt = null, responses = [], homework = null;
  if (a === 'edit') {
    attempt = app.data.attempts.find((x) => x.id === b);
    responses = app.data.responses.filter((r) => r.attempt_id === b);
  } else if (b?.startsWith('hw-')) {
    homework = app.data.homework.find((x) => x.id === b.slice(3));
  }
  const studentId = attempt?.student_id || (a !== 'edit' ? a : null) || '';
  const st = {
    student_id: studentId,
    date: attempt?.date || today(),
    year: attempt?.year ?? (homework ? null : YEARS(app.index)[0]),
    what: attempt ? (attempt.scope === 'score' ? 'score' : attempt.scope === 'questions' ? 'questions' : attempt.paper) : homework ? 'questions' : 'FULL',
    timed: attempt?.timed ?? true,
    elective: attempt?.elective || app.student(studentId)?.elective || '',
    picked: attempt?.scope === 'questions' ? responses.map((r) => r.qid) : homework ? [...homework.qids] : [],
    answers: new Map(responses.map((r) => [r.qid, { choice: r.choice, mark: r.mark, mistakes: r.mistakes || [] }])),
    scores: { p1_score: attempt?.p1_score ?? '', p1_max: attempt?.p1_max ?? '', p2_score: attempt?.p2_score ?? '', p2_max: attempt?.p2_max ?? '' },
    comment: attempt?.comment || '', private_note: attempt?.private_note || '',
  };

  const root = h('div.page');
  const draw = () => root.replaceChildren(...build(app, st, attempt, homework, draw));
  draw();
  return root;
}

function items(app, st) {
  if (st.what === 'score') return [];
  if (st.what === 'questions') return st.picked.map((id) => app.index.items.get(id)).filter(Boolean);
  const out = [];
  if (st.what === 'FULL' || st.what === 'P1') out.push(...paperItems(app.index, st.year, 'P1'));
  if (st.what === 'FULL' || st.what === 'P2') out.push(...paperItems(app.index, st.year, 'P2', st.elective || '__none__'));
  return out;
}

function build(app, st, attempt, homework, draw) {
  const students = app.data.students.filter((s) => s.status !== 'Left' || s.id === st.student_id).sort((x, y) => x.name.localeCompare(y.name));
  const paper = app.index.bank.papers[st.year];
  const list = items(app, st);
  const mc = list.filter((i) => i.kind === 'mc');
  const lq = list.filter((i) => i.kind === 'lq');

  const setup = h('section.card.stack',
    h('div.grid3',
      field(t('student'), select([['', '—'], ...students.map((s) => [s.id, s.name])], st.student_id, { onchange: (e) => {
        st.student_id = e.target.value; st.elective = app.student(st.student_id)?.elective || st.elective; draw();
      } })),
      field(t('date'), h('input', { type: 'date', value: st.date, onchange: (e) => { st.date = e.target.value; } })),
      st.what === 'questions' ? h('div') : field(t('paperYear'), select(YEARS(app.index).map((y) => [y, `DSE ${y}`]), st.year, {
        onchange: (e) => { st.year = +e.target.value; st.answers.clear(); draw(); } }))),
    field(t('what'), h('div.seg', [['FULL', t('whatFull')], ['P1', t('whatP1')], ['P2', t('whatP2')], ['questions', t('whatQuestions')], ['score', t('whatScore')]]
      .map(([k, l]) => h('button', { type: 'button', class: st.what === k ? 'on' : '', onclick: () => {
        st.what = k;
        if (k !== 'questions' && !st.year) st.year = YEARS(app.index)[0];
        draw();
      } }, l)))),
    h('div.row',
      h('label.check', h('input', { type: 'checkbox', checked: st.timed, onchange: (e) => { st.timed = e.target.checked; } }), t('timed')),
      (st.what === 'FULL' || st.what === 'P2' || st.what === 'score') && paper?.hasElective ? field(t('elective'),
        select([['', t('electiveNone')], ['E1', 'Elective 1'], ['E2', 'Elective 2']], st.elective, { onchange: (e) => { st.elective = e.target.value; draw(); } })) : null));

  const parts = [h('div.page-head', h('h1', attempt ? `${t('edit')} · ${t('log')}` : t('log')), homework ? h('span.pill', homework.title) : null), setup];
  if ((st.what === 'FULL' || st.what === 'P2') && paper?.hasElective && !st.elective) parts.push(h('p.warn', t('missingStudentElective')));
  if (st.what === 'questions') parts.push(questionPicker(app, st, draw));
  if (st.what === 'score') parts.push(scoreOnly(app, st));
  if (mc.length) parts.push(mcPad(st, mc));
  const legacy = legacyLine(app, st, lq);
  if (legacy) parts.push(h('p.warn', t('legacyOther')(legacy.mark, legacy.max)));
  if (lq.length) parts.push(lqTable(app, st, lq));
  parts.push(finish(app, st, attempt, homework, list));
  return parts;
}

// ---------- MC keypad ----------

function mcPad(st, mc) {
  const scoring = mc.filter((i) => i.key);
  let cur = Math.max(0, scoring.findIndex((i) => !st.answers.get(i.id)?.choice));
  const grid = h('div.mc-grid');
  const total = h('b');
  const paint = () => {
    grid.replaceChildren(...mc.map((it) => {
      const a = st.answers.get(it.id)?.choice;
      const idx = scoring.indexOf(it);
      const cls = !it.key ? 'del' : !a ? '' : a === it.key ? 'right' : 'wrong';
      return h('button', { type: 'button', class: `mc ${cls}${idx === cur ? ' cur' : ''}`, disabled: !it.key, title: itemLabel(it),
        onclick: () => { cur = idx; paint(); } },
      h('small', it.n), h('span', it.key ? (a || '·') : t('deleted')));
    }));
    const right = scoring.filter((i) => st.answers.get(i.id)?.choice === i.key).length;
    const done = scoring.filter((i) => st.answers.get(i.id)?.choice).length;
    total.textContent = `${right} / ${scoring.length} · ${done} ${t('entered')}`;
  };
  const press = (letter) => {
    const it = scoring[cur];
    if (!it) return;
    const prev = st.answers.get(it.id) || {};
    st.answers.set(it.id, { ...prev, choice: letter });
    cur = Math.min(scoring.length - 1, cur + 1);
    paint();
  };
  const keys = h('div.keypad',
    ['A', 'B', 'C', 'D'].map((l) => h('button.key', { type: 'button', onclick: () => press(l) }, l)),
    h('button.key.alt', { type: 'button', title: t('blankMeans'), onclick: () => press(null) }, '–'),
    h('button.key.alt', { type: 'button', onclick: () => { cur = Math.max(0, cur - 1); paint(); } }, '←'));
  const onKey = (e) => {
    if (!document.body.contains(grid)) { document.removeEventListener('keydown', onKey); return; }
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
    const k = e.key.toUpperCase();
    if ('ABCD'.includes(k) && k.length === 1) { press(k); e.preventDefault(); }
    else if (e.key === 'Backspace') { cur = Math.max(0, cur - 1); paint(); e.preventDefault(); }
  };
  document.addEventListener('keydown', onKey);
  paint();
  return h('section.card', h('div.row.spread', h('h2', t('mcEntry')), total), keys, grid);
}

// ---------- LQ marks ----------

/** An old full-paper entry whose untagged parts were saved as one "not in topic bank" line (see LEGACY_OTHER). */
function legacyLine(app, st, lq) {
  if (st.what !== 'FULL' && st.what !== 'P2') return null;
  const item = app.index.items.get(`${st.year}-other`);
  const a = st.answers.get(item?.id);
  if (!item?.legacy || !a || !lq.some((it) => it.fromOther)) return null;
  return { id: item.id, mark: Math.min(+a.mark || 0, item.max), max: item.max, mistakes: a.mistakes || [] };
}

function lqTable(app, st, lq) {
  const total = h('b');
  const sum = () => {
    const got = lq.reduce((a, it) => a + Math.min(+(st.answers.get(it.id)?.mark || 0), it.max), 0);
    total.textContent = `${got} / ${lq.reduce((a, it) => a + it.max, 0)}`;
  };
  const rows = lq.map((it) => {
    const ans = st.answers.get(it.id) || { mistakes: [] };
    let tags;
    const input = h('input.mark', { type: 'number', min: 0, max: it.max, step: 0.5, inputMode: 'decimal', value: ans.mark ?? '',
      oninput: (e) => {
        const cur = st.answers.get(it.id) || { mistakes: [] };
        st.answers.set(it.id, { ...cur, mark: e.target.value === '' ? null : Math.min(+e.target.value, it.max) });
        showTags(); sum();
      } });
    const types = withDefaults(app.data.settings).mistakeTypes.filter((m) => !m.hidden || ans.mistakes?.includes(m.key));
    tags = h('div.mistakes', types.map(({ key: k, ...names }) => {
      const b = h('button', { type: 'button', class: `chip small${ans.mistakes?.includes(k) ? ' on' : ''}`, onclick: () => {
        const cur = st.answers.get(it.id) || { mistakes: [] };
        const set = new Set(cur.mistakes || []);
        set.has(k) ? set.delete(k) : set.add(k);
        const next = { ...cur, mistakes: [...set] };
        if (k === 'blank' && set.has(k)) { next.mark = 0; input.value = 0; sum(); }
        st.answers.set(it.id, next);
        b.classList.toggle('on');
        showTags();
      } }, names[getLang()] || names.en);
      b.dataset.key = k;
      return b;
    }));
    // No mark yet: only "Left blank" is offered. Lost marks: every reason. Full marks: none (unless already tagged).
    const showTags = () => {
      const a = st.answers.get(it.id);
      const empty = a?.mark === undefined || a?.mark === null || a?.mark === '';
      const tagged = a?.mistakes?.length > 0;
      tags.hidden = !tagged && !empty && +a.mark >= it.max;
      for (const c of tags.children) c.hidden = empty && !tagged && c.dataset.key !== 'blank';
    };
    showTags();
    const subs = it.subs.map((s) => app.index.subs.get(s)).filter(Boolean);
    return h(it.fromOther && st.answers.has(`${st.year}-other`) ? 'div.lq-row.split' : 'div.lq-row',
      h('div.lq-label', h('b', it.q == null ? t('notInBank') : `Q${it.q}${it.label}`),
        it.elective ? h('span.pill', `${t('electiveQ')} ${it.elective.slice(1)}`) : null,
        st.what === 'questions' ? h('span.muted', ` ${it.year}`) : null,
        h('div.muted.small', subs.map((s) => `${s.id} ${subName(s)}`).join(' · '))),
      h('div.lq-mark', input, h('span', `/ ${it.max}`)),
      tags);
  });
  sum();
  return h('section.card', h('div.row.spread', h('h2', t('lqEntry')), total), h('p.hint', t('blankMeans')), rows);
}

// ---------- selected questions ----------

function questionPicker(app, st, draw) {
  const subSel = select([['', '—'], ...app.index.bank.topics.flatMap((tp) => tp.subtopics.map((s) => [s.id, `${s.id} ${subName(s)}`]))], '');
  const pool = h('div.pool');
  subSel.onchange = () => {
    const sub = subSel.value;
    const found = [...app.index.items.values()].filter((i) => i.subs.includes(sub) && i.max > 0).sort((x, y) => y.year - x.year || x.kind.localeCompare(y.kind));
    pool.replaceChildren(...found.map((it) => h('button', { type: 'button', class: `chip${st.picked.includes(it.id) ? ' on' : ''}`, onclick: () => {
      if (st.picked.includes(it.id)) st.picked = st.picked.filter((x) => x !== it.id); else st.picked.push(it.id);
      draw();
    } }, itemLabel(it), it.kind === 'lq' ? ` (${it.max})` : '')));
  };
  return h('section.card.stack',
    field(t('pickSub'), subSel), pool,
    h('div', h('span.label', t('pickItems')), ' ',
      st.picked.length ? st.picked.map((id) => h('span.tag', itemLabel(app.index.items.get(id)), ' ',
        h('button.x', { type: 'button', onclick: () => { st.picked = st.picked.filter((x) => x !== id); draw(); } }, '×'))) : h('span.muted', t('none'))));
}

// ---------- score only ----------

function scoreOnly(app, st) {
  const paper = app.index.bank.papers[st.year];
  if (st.scores.p1_max === '' && paper) st.scores.p1_max = paper.p1.filter((q) => q.key).length;
  if (st.scores.p2_max === '' && paper) st.scores.p2_max = paper.p2Total;
  const num = (k) => h('input', { type: 'number', step: 0.5, min: 0, value: st.scores[k], oninput: (e) => { st.scores[k] = e.target.value; } });
  return h('section.card', h('div.grid4',
    field(t('p1Score'), num('p1_score')), field(t('outOf'), num('p1_max')),
    field(t('p2Score'), num('p2_score')), field(t('outOf'), num('p2_max'))));
}

// ---------- save ----------

function finish(app, st, attempt, homework, list) {
  const comment = h('textarea', { rows: 2, value: st.comment, oninput: (e) => { st.comment = e.target.value; } });
  const note = h('textarea', { rows: 2, value: st.private_note, oninput: (e) => { st.private_note = e.target.value; } });
  const save = async () => {
    if (!st.student_id) { toast(t('student'), 'err'); return; }
    const paper = st.what === 'FULL' || st.what === 'score' ? 'FULL' : st.what === 'questions'
      ? (list.every((i) => i.kind === 'mc') ? 'P1' : list.every((i) => i.kind === 'lq') ? 'P2' : 'FULL') : st.what;
    const row = {
      id: attempt?.id, student_id: st.student_id, date: st.date, paper,
      year: st.what === 'questions' ? (new Set(list.map((i) => i.year)).size === 1 ? list[0]?.year ?? null : null) : st.year,
      scope: st.what === 'score' ? 'score' : st.what === 'questions' ? 'questions' : 'full',
      timed: st.timed, elective: st.elective || null, comment: st.comment || null, private_note: st.private_note || null,
      p1_score: null, p1_max: null, p2_score: null, p2_max: null,
    };
    if (st.what === 'score') {
      for (const k of Object.keys(st.scores)) row[k] = st.scores[k] === '' ? null : +st.scores[k];
      if (row.p1_score == null) { row.p1_max = null; row.paper = 'P2'; }
      if (row.p2_score == null) { row.p2_max = null; row.paper = row.p1_score == null ? 'FULL' : 'P1'; }
    }
    // Full papers keep a row for every item (blank = 0); question sets keep only the picked items.
    // An old single "not in topic bank" line is replaced by its parts once any of them has a mark; until then it is kept.
    const legacy = legacyLine(app, st, list.filter((i) => i.kind === 'lq'));
    const entered = (it) => { const m = st.answers.get(it.id)?.mark; return m !== undefined && m !== null && m !== ''; };
    const keepLegacy = legacy && !list.some((it) => it.fromOther && entered(it));
    const responses = list.filter((it) => !(keepLegacy && it.fromOther)).map((it) => {
      const a = st.answers.get(it.id) || {};
      return it.kind === 'mc' ? { qid: it.id, choice: a.choice || null } : { qid: it.id, mark: a.mark ?? 0, mistakes: a.mistakes || [] };
    });
    if (keepLegacy) responses.push({ qid: legacy.id, mark: legacy.mark, mistakes: legacy.mistakes });
    const saved = await app.mutate((store) => store.saveAttempt(row, responses));
    if (homework) {
      const late = homework.due_date && st.date > homework.due_date;
      await app.mutate((store) => store.update('homework', homework.id, { attempt_id: saved.attempt.id, status: late ? 'late' : 'on_time' }), null);
    }
    app.go(`#/s/${st.student_id}/attempts`);
  };
  return h('section.card.stack',
    field(t('comment'), comment), field(t('privateNote'), note),
    h('div.row.end', h('button.primary.big', { type: 'button', onclick: save }, t('saveAttempt'))));
}
