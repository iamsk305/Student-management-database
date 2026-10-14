// Derived view of one student, shared by the admin app and the family page so both always agree.
import { attemptScore, mastery, predictLevel, mistakeSplit, nextPractice, itemLabel, withDefaults } from './logic.js';

/**
 * attempts: [{id, date, year, paper, scope, timed, ...}], responses: [{attempt_id, qid, ...}]
 * taughtSubs: iterable of sub ids from lessons; overrides: {sub: state} or Map.
 */
export function studentView(index, { student, attempts, responses, taughtSubs = [], overrides = {}, settings }) {
  const s = withDefaults(settings);
  const byAttempt = new Map();
  for (const r of responses) {
    if (!byAttempt.has(r.attempt_id)) byAttempt.set(r.attempt_id, []);
    byAttempt.get(r.attempt_id).push(r);
  }
  const scored = attempts
    .map((a) => {
      const sc = attemptScore(index, a, byAttempt.get(a.id) || [], s);
      return { ...a, ...sc, responses: byAttempt.get(a.id) || [], label: attemptLabel(a) };
    })
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  const masteryMap = mastery(index, attempts, byAttempt, s);
  const ov = overrides instanceof Map ? overrides : new Map(Object.entries(overrides || {}));
  const taught = new Set(taughtSubs);
  for (const [sub, st] of ov) if (st !== 'untaught') taught.add(sub);
  const attempted = new Set(responses.map((r) => r.qid));
  return {
    student,
    attempts: scored,
    mastery: masteryMap,
    taught,
    overrides: ov,
    predicted: predictLevel(scored, s),
    mistakes: mistakeSplit(index, responses),
    next: nextPractice(index, masteryMap, taught, attempted, { elective: student?.elective || null }),
    lastDate: scored[0]?.date || null,
    settings: s,
  };
}

export function attemptLabel(a) {
  const what = { FULL: 'P1 + P2', P1: 'P1', P2: 'P2' }[a.paper];
  if (a.scope === 'questions') return a.year ? `${a.year} ${what} · set` : `${what} · set`;
  return `${a.year || ''} ${what}`.trim();
}

export { itemLabel };
