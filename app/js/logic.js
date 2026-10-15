// Pure scoring logic shared by the admin app, the family page and the tests. No DOM, no network.

export const LEVELS = ['1', '2', '3', '4', '5', '5*', '5**'];
// Why marks were lost. Editable in Settings (renamed, added, hidden); keys never change so old tags keep counting.
export const DEFAULT_MISTAKES = [
  { key: 'concept', en: 'Concept wrong', zh: '概念錯' },
  { key: 'definition', en: 'Definition not memorised', zh: '定義未背熟' },
  { key: 'careless', en: 'Careless mistake', zh: '粗心' },
  { key: 'misapplied', en: 'Misapplied', zh: '應用錯', hidden: true }, // retired 15 Oct 2026; kept so old tags keep their name
  { key: 'expression', en: 'Weak expression', zh: '表達弱' },
  { key: 'diagram', en: 'Diagram error', zh: '圖錯' },
  { key: 'incomplete', en: 'Incomplete / ran out of time', zh: '未完成／夠鐘' },
  { key: 'blank', en: 'Left blank', zh: '留空冇答' },
];
export const MISTAKES = DEFAULT_MISTAKES.map((m) => m.key);

// Lawrence's cut-off table (% of full mark), level 2 … 5**. Editable in Settings.
export const DEFAULT_CUTOFFS = {
  2012: [44, 64, 72, 84, 89, 93], 2013: [38, 55, 68, 78, 83, 90], 2014: [44, 65, 66, 82, 89, 93],
  2015: [40, 58, 65, 81, 88, 91], 2016: [39, 57, 64, 79, 88, 91], 2017: [42, 60, 70, 83, 88, 92],
  2018: [41, 59, 65, 79, 86, 91], 2019: [41, 57, 65, 79, 86, 91], 2020: [43, 60, 68, 82, 89, 93],
  2021: [43, 59, 75, 80, 90, 92], 2022: [45, 63, 73, 87, 92, 95], 2023: [41, 56, 65, 84, 90, 95],
  2024: [38, 52, 60, 78, 87, 93], 2025: [39, 53, 58, 76, 86, 90], 2026: [38, 47, 61, 79, 87, 93],
};

export const DEFAULT_SETTINGS = {
  weights: { p1: 0.3, p2: 0.7 },
  mastery: { red: 50, green: 70, minEvidence: 6, halfLifeDays: 60 },
  predictWeights: [3, 2, 1],
  cutoffs: DEFAULT_CUTOFFS,
};

/** Lists saved before 15 Oct 2026: add "Careless mistake" and hide "Misapplied" (once — afterwards Settings decides). */
function withCareless(types) {
  if (types.some((m) => m.key === 'careless')) return types;
  const out = types.map((m) => (m.key === 'misapplied' ? { ...m, hidden: true } : m));
  const at = out.findIndex((m) => m.key === 'misapplied');
  out.splice(at < 0 ? out.length : at, 0, DEFAULT_MISTAKES.find((m) => m.key === 'careless'));
  return out;
}

export function withDefaults(settings) {
  const s = settings || {};
  return {
    weights: { ...DEFAULT_SETTINGS.weights, ...s.weights },
    mastery: { ...DEFAULT_SETTINGS.mastery, ...s.mastery },
    predictWeights: s.predictWeights || DEFAULT_SETTINGS.predictWeights,
    cutoffs: { ...DEFAULT_CUTOFFS, ...s.cutoffs },
    mistakeTypes: s.mistakeTypes?.length ? withCareless(s.mistakeTypes) : DEFAULT_MISTAKES,
  };
}

// ---------- bank lookups ----------

/** Marks on each year's old single "not in topic bank" line (bank of 14 Oct 2026, before those parts were tagged). */
export const LEGACY_OTHER = { 2017: 6, 2019: 22, 2020: 43, 2021: 30, 2022: 28, 2023: 30, 2024: 26, 2025: 28 };

/** Index the bank once: every MC question and LQ part by id. */
export function indexBank(bank) {
  const items = new Map();
  for (const [year, paper] of Object.entries(bank.papers)) {
    for (const q of paper.p1) {
      items.set(`${year}-P1-${q.n}`, { id: `${year}-P1-${q.n}`, kind: 'mc', year: +year, n: q.n, key: q.key,
        subs: q.sub ? [q.sub] : [], max: q.key ? 1 : 0 });
    }
    for (const p of paper.p2) {
      items.set(p.id, { id: p.id, kind: 'lq', year: +year, q: p.q, label: p.label, max: p.marks,
        subs: p.subs, elective: p.elective, fromOther: !!p.fromOther });
    }
  }
  // Papers logged before 14 Oct 2026 put every untagged P2 part on one "not in topic bank" line. Those parts are now
  // tagged one by one (fromOther in the bank), but old responses still point at the single line, so it stays
  // scoreable here; it is never offered for new logging and goes away once the paper is re-entered part by part.
  for (const [year, max] of Object.entries(LEGACY_OTHER)) {
    const id = `${year}-other`;
    if (bank.papers[year] && !items.has(id)) {
      items.set(id, { id, kind: 'lq', year: +year, q: null, label: 'not in topic bank', max, subs: [], elective: null, legacy: true });
    }
  }
  const subs = new Map();
  for (const t of bank.topics) for (const s of t.subtopics) subs.set(s.id, { ...s, topic: t.code });
  return { bank, items, subs };
}

/** Items that make up one paper for a student (P2 keeps only their elective). */
export function paperItems(index, year, paper, elective) {
  const p = index.bank.papers[year];
  if (!p) return [];
  if (paper === 'P1') return p.p1.map((q) => index.items.get(`${year}-P1-${q.n}`));
  return p.p2.filter((x) => !x.elective || x.elective === elective).map((x) => index.items.get(x.id));
}

export function p2Max(index, year) {
  const p = index.bank.papers[year];
  return p ? p.p2Total : null;
}

// ---------- marking ----------

/** Mark typed MC letters against the key. Deleted items never count. */
export function markMC(item, choice) {
  if (!item.key) return { earned: 0, max: 0 };
  return { earned: choice === item.key ? 1 : 0, max: 1 };
}

export function responseScore(item, r) {
  if (!item) return { earned: Number(r.mark) || 0, max: 0 };
  if (item.kind === 'mc') return markMC(item, r.choice);
  return { earned: Math.min(Number(r.mark) || 0, item.max), max: item.max };
}

/**
 * Score one attempt. Score-only attempts carry their own totals; otherwise totals come from responses,
 * split by paper. Returns { p1: {earned, max}|null, p2: ..., pct, full }.
 */
export function attemptScore(index, attempt, responses, settings) {
  const s = withDefaults(settings);
  let p1 = null, p2 = null;
  if (attempt.scope === 'score') {
    if (attempt.p1_max) p1 = { earned: +attempt.p1_score, max: +attempt.p1_max };
    if (attempt.p2_max) p2 = { earned: +attempt.p2_score, max: +attempt.p2_max };
  } else {
    for (const r of responses) {
      const item = index.items.get(r.qid);
      if (!item) continue;
      const sc = responseScore(item, r);
      const bucket = item.kind === 'mc' ? (p1 ||= { earned: 0, max: 0 }) : (p2 ||= { earned: 0, max: 0 });
      bucket.earned += sc.earned;
      bucket.max += sc.max;
    }
  }
  const full = attempt.paper === 'FULL' && p1 && p2 && p1.max > 0 && p2.max > 0;
  let pct = null;
  if (full) pct = 100 * (s.weights.p1 * p1.earned / p1.max + s.weights.p2 * p2.earned / p2.max);
  else {
    const tot = [p1, p2].filter(Boolean).reduce((a, b) => ({ earned: a.earned + b.earned, max: a.max + b.max }), { earned: 0, max: 0 });
    if (tot.max > 0) pct = 100 * tot.earned / tot.max;
  }
  return { p1, p2, pct, full };
}

// ---------- levels ----------

function cutoffsFor(cutoffs, year) {
  if (cutoffs[year]) return cutoffs[year];
  const years = Object.keys(cutoffs).map(Number).sort((a, b) => a - b);
  if (!years.length) return null;
  const nearest = years.reduce((best, y) => (Math.abs(y - year) < Math.abs(best - year) ? y : best), years[0]);
  return cutoffs[nearest];
}

/**
 * Continuous level value for a % on a given year's paper: 2.0 = just reached Level 2, 2.5 = halfway to 3,
 * 7.0 = 5**. Below the Level 2 cut it runs from 1.0 (0%) to 2.0.
 */
export function levelValue(pct, year, cutoffs) {
  const c = cutoffsFor(cutoffs, year);
  if (pct == null || !c) return null;
  if (pct < c[0]) return 1 + Math.max(0, pct) / c[0];
  for (let i = c.length - 1; i >= 0; i--) {
    if (pct >= c[i]) {
      if (i === c.length - 1) return 7;
      return 2 + i + (pct - c[i]) / (c[i + 1] - c[i]);
    }
  }
  return 1;
}

export const levelName = (v) => (v == null ? '—' : LEVELS[Math.min(6, Math.max(0, Math.floor(v) - 1))]);

/**
 * Predicted level from timed full papers only: the newest papers weighted 3 : 2 : 1.
 * Each paper is placed on its own year's cut-offs first, so papers from different years compare fairly.
 */
export function predictLevel(papers, settings) {
  const s = withDefaults(settings);
  const usable = papers.filter((p) => p.full && p.timed && p.pct != null && p.year)
    .sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, s.predictWeights.length);
  if (!usable.length) return null;
  let num = 0, den = 0;
  usable.forEach((p, i) => {
    const v = levelValue(p.pct, p.year, s.cutoffs);
    if (v == null) return;
    num += v * s.predictWeights[i];
    den += s.predictWeights[i];
  });
  if (!den) return null;
  const value = num / den;
  return { value, level: levelName(value), basedOn: usable.length };
}

// ---------- mastery ----------

const DAY = 86400000;

/**
 * Sub-topic mastery from every scored response, older work counting less (weight halves every halfLifeDays).
 * evidence = unweighted marks available, used for the "not enough evidence yet" state.
 */
export function mastery(index, attempts, responsesByAttempt, settings, now = Date.now()) {
  const s = withDefaults(settings);
  const acc = new Map();
  for (const a of attempts) {
    const age = Math.max(0, (now - Date.parse(a.date)) / DAY);
    const w = Math.pow(0.5, age / s.mastery.halfLifeDays);
    for (const r of responsesByAttempt.get(a.id) || []) {
      const item = index.items.get(r.qid);
      if (!item || !item.subs.length) continue;
      const sc = responseScore(item, r);
      if (!sc.max) continue;
      for (const sub of item.subs) {
        const m = acc.get(sub) || { num: 0, den: 0, evidence: 0, attempts: 0 };
        m.num += w * sc.earned;
        m.den += w * sc.max;
        m.evidence += sc.max;
        m.attempts += 1;
        acc.set(sub, m);
      }
    }
  }
  const out = new Map();
  for (const [sub, m] of acc) out.set(sub, { pct: m.den ? 100 * m.num / m.den : null, evidence: m.evidence, attempts: m.attempts });
  return out;
}

/** Colour state for the map: override > not taught > thin evidence > bands. */
export function masteryState(sub, m, taught, overrides, settings) {
  const s = withDefaults(settings);
  const o = overrides.get(sub);
  if (o) return { state: o, manual: true, pct: m?.pct ?? null };
  if (!m && !taught.has(sub)) return { state: 'untaught', manual: false, pct: null };
  if (!m || m.evidence < s.mastery.minEvidence) return { state: 'thin', manual: false, pct: m?.pct ?? null };
  const state = m.pct < s.mastery.red ? 'red' : m.pct < s.mastery.green ? 'amber' : 'green';
  return { state, manual: false, pct: m.pct };
}

/**
 * Share of lost LQ marks by mistake type; marks lost on a part with several tags are split evenly.
 * keys = the types to report on; tags outside it (e.g. from an older list) are still counted.
 */
export function mistakeSplit(index, responses, keys = MISTAKES) {
  const lost = Object.fromEntries(keys.map((k) => [k, 0]));
  let total = 0;
  for (const r of responses) {
    const item = index.items.get(r.qid);
    if (!item || item.kind !== 'lq' || !r.mistakes?.length) continue;
    const gap = item.max - Math.min(Number(r.mark) || 0, item.max);
    if (gap <= 0) continue;
    for (const k of r.mistakes) lost[k] = (lost[k] || 0) + gap / r.mistakes.length;
    total += gap;
  }
  return { total, share: Object.fromEntries(Object.entries(lost).map(([k, v]) => [k, total ? v / total : 0])) };
}

/** MC distractors: how often each wrong letter was chosen, per question id. */
export function wrongLetters(index, responses) {
  const out = new Map();
  for (const r of responses) {
    const item = index.items.get(r.qid);
    if (!item || item.kind !== 'mc' || !item.key || !r.choice || r.choice === item.key) continue;
    const m = out.get(r.qid) || {};
    m[r.choice] = (m[r.choice] || 0) + 1;
    out.set(r.qid, m);
  }
  return out;
}

/**
 * Next practice: the weakest taught sub-topics (lowest mastery first; untested-but-taught count as 0),
 * each with unattempted DSE items, newest year first, alternating MC and LQ.
 */
export function nextPractice(index, masteryMap, taught, attemptedIds, { topics = 3, perTopic = 5, elective = null } = {}) {
  // Weak topics with evidence come first (lowest score first); taught-but-untested topics follow.
  const candidates = [...new Set([...taught, ...masteryMap.keys()])]
    .map((sub) => ({ sub, pct: masteryMap.get(sub)?.pct ?? null }))
    .filter((c) => c.pct == null || c.pct < 70)
    .sort((a, b) => (a.pct == null) - (b.pct == null) || (a.pct ?? 0) - (b.pct ?? 0) || a.sub.localeCompare(b.sub))
    .slice(0, topics);
  return candidates.map(({ sub, pct }) => {
    const pool = [...index.items.values()]
      .filter((it) => it.subs.includes(sub) && it.max > 0 && !attemptedIds.has(it.id)
        && (!it.elective || it.elective === elective))
      .sort((a, b) => b.year - a.year || (a.n || a.q || 0) - (b.n || b.q || 0));
    const mc = pool.filter((i) => i.kind === 'mc'), lq = pool.filter((i) => i.kind === 'lq');
    const picks = [];
    while (picks.length < perTopic && (mc.length || lq.length)) {
      if (lq.length) picks.push(lq.shift());
      if (picks.length < perTopic && mc.length) picks.push(mc.shift());
    }
    return { sub, pct, items: picks };
  });
}

/** Human label for an item: "2019 P1 Q29" / "2022 P2 Q10(a)". */
export function itemLabel(item) {
  if (!item) return '?';
  if (item.kind === 'mc') return `${item.year} P1 Q${item.n}`;
  return item.q == null ? `${item.year} P2 ${item.label}` : `${item.year} P2 Q${item.q}${item.label}`;
}
