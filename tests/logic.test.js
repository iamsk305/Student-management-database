// Run from the student-tracker folder:  jsc -m tests/logic.test.js
// (jsc = macOS JavaScriptCore: /System/Library/Frameworks/JavaScriptCore.framework/Versions/A/Helpers/jsc)
import {
  indexBank, paperItems, markMC, attemptScore, levelValue, levelName, predictLevel, mastery, masteryState,
  mistakeSplit, wrongLetters, nextPractice, itemLabel, DEFAULT_CUTOFFS, withDefaults,
} from '../app/js/logic.js';

let passed = 0, failed = 0;
function test(name, fn) {
  try { fn(); passed++; } catch (e) { failed++; print(`FAIL ${name}\n   ${e.message}`); }
}
const eq = (a, b, msg = '') => { if (a !== b) throw new Error(`${msg} expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`); };
const near = (a, b, tol = 1e-6, msg = '') => { if (Math.abs(a - b) > tol) throw new Error(`${msg} expected ≈${b}, got ${a}`); };

const fixture = {
  topics: [{ code: 'C', en: 'Market and Price', zh: '市場與價格', subtopics: [
    { id: 'C.1', en: 'Demand', zh: '需求' }, { id: 'C.6', en: 'Elasticity', zh: '彈性' }] }],
  papers: {
    2022: { p1: [{ n: 1, key: 'A', sub: 'C.1' }, { n: 2, key: null, sub: 'C.1' }, { n: 3, key: 'C', sub: 'C.6' }],
      p2: [{ id: '2022-Q1(a)', q: 1, label: '(a)', marks: 4, subs: ['C.1'], elective: null },
           { id: '2022-Q1(b)', q: 1, label: '(b)', marks: 6, subs: ['C.6', 'C.1'], elective: null },
           { id: '2022-other', q: null, label: 'not in topic bank', marks: 10, subs: [], elective: null }],
      p2Total: 20, hasElective: false },
    2019: { p1: [{ n: 1, key: 'B', sub: 'C.6' }],
      p2: [{ id: '2019-Q13(a)', q: 13, label: '(a)', marks: 8, subs: ['C.1'], elective: 'E1' },
           { id: '2019-Q14(a)', q: 14, label: '(a)', marks: 8, subs: ['C.6'], elective: 'E2' }],
      p2Total: 120, hasElective: true },
  },
};
const ix = indexBank(fixture);

test('MC marking ignores HKEAA-deleted items', () => {
  eq(markMC(ix.items.get('2022-P1-1'), 'A').earned, 1);
  eq(markMC(ix.items.get('2022-P1-1'), 'B').earned, 0);
  eq(markMC(ix.items.get('2022-P1-2'), 'A').max, 0);
});

test('paper P2 keeps only the student elective', () => {
  eq(paperItems(ix, 2019, 'P2', 'E2').map((i) => i.id).join(), '2019-Q14(a)');
  eq(paperItems(ix, 2022, 'P1').length, 3);
});

test('full paper score uses 30/70 weighting', () => {
  const a = { id: 'a', paper: 'FULL', scope: 'full' };
  const rs = [{ qid: '2022-P1-1', choice: 'A' }, { qid: '2022-P1-2', choice: 'B' }, { qid: '2022-P1-3', choice: 'D' },
    { qid: '2022-Q1(a)', mark: 4 }, { qid: '2022-Q1(b)', mark: 3 }, { qid: '2022-other', mark: 5 }];
  const s = attemptScore(ix, a, rs);
  eq(s.p1.earned, 1); eq(s.p1.max, 2);
  eq(s.p2.earned, 12); eq(s.p2.max, 20);
  near(s.pct, 100 * (0.3 * 0.5 + 0.7 * 0.6));
  eq(s.full, true);
});

test('LQ mark is capped at the part maximum', () => {
  const s = attemptScore(ix, { paper: 'P2', scope: 'questions' }, [{ qid: '2022-Q1(a)', mark: 9 }]);
  eq(s.p2.earned, 4);
});

test("Haywood 2022: score-only 40/44 + 65/104 is Level 3", () => {
  const s = attemptScore(ix, { paper: 'FULL', scope: 'score', p1_score: 40, p1_max: 44, p2_score: 65, p2_max: 104 }, []);
  near(s.pct, 100 * (0.3 * 40 / 44 + 0.7 * 65 / 104), 1e-9);
  const v = levelValue(s.pct, 2022, DEFAULT_CUTOFFS);
  eq(levelName(v), '3');
  near(v, 3 + (s.pct - 63) / (73 - 63), 1e-9);
});

test('Haywood 2022 as written on the script (65/120 → 65.19%) is also Level 3', () => {
  const pct = 100 * (0.3 * 40 / 44 + 0.7 * 65 / 120);
  near(pct, 65.19, 0.01);
  eq(levelName(levelValue(pct, 2022, DEFAULT_CUTOFFS)), '3');
});

test('level boundaries', () => {
  const c = DEFAULT_CUTOFFS;
  eq(levelName(levelValue(95, 2022, c)), '5**');
  eq(levelName(levelValue(94.9, 2022, c)), '5*');
  eq(levelName(levelValue(45, 2022, c)), '2');
  eq(levelName(levelValue(44.9, 2022, c)), '1');
  eq(levelValue(0, 2022, c), 1);
  eq(levelName(levelValue(70, 2030, c)), levelName(levelValue(70, 2026, c)), 'unknown year falls back to nearest');
});

test('predicted level: timed full papers only, newest weighted 3:2:1', () => {
  const papers = [
    { full: true, timed: true, pct: 80, year: 2022, date: '2026-10-01' },   // 4.7
    { full: true, timed: true, pct: 63, year: 2022, date: '2026-09-01' },   // 3.0
    { full: true, timed: true, pct: 45, year: 2022, date: '2026-08-01' },   // 2.0
    { full: true, timed: true, pct: 99, year: 2022, date: '2026-07-01' },   // 4th newest: ignored
    { full: true, timed: false, pct: 99, year: 2022, date: '2026-10-05' },  // untimed: ignored
    { full: false, timed: true, pct: 99, year: 2022, date: '2026-10-06' },  // section only: ignored
  ];
  const p = predictLevel(papers);
  near(p.value, (4.5 * 3 + 3 * 2 + 2 * 1) / 6, 1e-9);
  eq(p.level, '3');
  eq(p.basedOn, 3);
  eq(predictLevel([{ full: true, timed: false, pct: 90, year: 2022, date: '2026-01-01' }]), null);
});

test('mastery decays with age and splits multi-topic parts', () => {
  const now = Date.parse('2026-10-14');
  const attempts = [{ id: 'new', date: '2026-10-14' }, { id: 'old', date: '2026-08-15' }]; // 60 days = half weight
  const rs = new Map([
    ['new', [{ qid: '2022-Q1(a)', mark: 4 }]],                 // C.1 4/4
    ['old', [{ qid: '2022-Q1(b)', mark: 0 }]],                 // C.6 + C.1 0/6, half weight
  ]);
  const m = mastery(ix, attempts, rs, null, now);
  near(m.get('C.1').pct, 100 * 4 / (4 + 0.5 * 6), 1e-9);
  eq(m.get('C.1').evidence, 10);
  eq(m.get('C.6').pct, 0);
});

test('mastery ignores "not in topic bank" marks', () => {
  const m = mastery(ix, [{ id: 'a', date: '2026-10-14' }], new Map([['a', [{ qid: '2022-other', mark: 10 }]]]));
  eq(m.size, 0);
});

test('map states: override, untaught, thin evidence, bands', () => {
  const set = withDefaults();
  const none = new Map();
  eq(masteryState('C.1', undefined, new Set(), none, set).state, 'untaught');
  eq(masteryState('C.1', undefined, new Set(['C.1']), none, set).state, 'thin');
  eq(masteryState('C.1', { pct: 90, evidence: 3 }, new Set(), none, set).state, 'thin');
  eq(masteryState('C.1', { pct: 49.9, evidence: 6 }, new Set(), none, set).state, 'red');
  eq(masteryState('C.1', { pct: 50, evidence: 6 }, new Set(), none, set).state, 'amber');
  eq(masteryState('C.1', { pct: 70, evidence: 6 }, new Set(), none, set).state, 'green');
  const o = masteryState('C.1', { pct: 20, evidence: 9 }, new Set(), new Map([['C.1', 'green']]), set);
  eq(o.state, 'green'); eq(o.manual, true);
});

test('mistake split shares lost marks evenly across tags', () => {
  const r = mistakeSplit(ix, [
    { qid: '2022-Q1(a)', mark: 2, mistakes: ['concept'] },                 // 2 lost
    { qid: '2022-Q1(b)', mark: 2, mistakes: ['expression', 'diagram'] },   // 4 lost, 2 each
    { qid: '2022-Q1(b)', mark: 6, mistakes: ['concept'] },                 // full marks: ignored
  ]);
  eq(r.total, 6);
  near(r.share.concept, 2 / 6); near(r.share.expression, 2 / 6); near(r.share.diagram, 2 / 6);
});

test('wrong letters are counted per MC question', () => {
  const w = wrongLetters(ix, [{ qid: '2022-P1-1', choice: 'C' }, { qid: '2022-P1-1', choice: 'C' }, { qid: '2022-P1-1', choice: 'A' }]);
  eq(w.get('2022-P1-1').C, 2);
  eq(w.get('2022-P1-1').A, undefined);
});

test('next practice: weakest first, skips attempted, alternates LQ/MC', () => {
  const m = new Map([['C.1', { pct: 30 }], ['C.6', { pct: 60 }]]);
  const out = nextPractice(ix, m, new Set(), new Set(['2022-Q1(a)']), { topics: 2, perTopic: 3, elective: 'E2' });
  eq(out[0].sub, 'C.1');
  eq(out[0].items.map((i) => i.id).join(), '2022-Q1(b),2022-P1-1');
  eq(out[1].sub, 'C.6');
  eq(nextPractice(ix, new Map([['C.1', { pct: 95 }]]), new Set(), new Set()).length, 0, 'strong topics are not suggested');
  const e1 = nextPractice(ix, m, new Set(), new Set(['2022-Q1(a)']), { topics: 1, perTopic: 3, elective: 'E1' });
  eq(e1[0].items.map((i) => i.id).join(), '2022-Q1(b),2022-P1-1,2019-Q13(a)', 'own elective included');
});

test('next practice puts tested weak topics before untested ones', () => {
  const out = nextPractice(ix, new Map([['C.6', { pct: 65 }]]), new Set(['C.1']), new Set(), { topics: 2, perTopic: 1 });
  eq(out.map((o) => o.sub).join(), 'C.6,C.1');
  eq(out[1].pct, null);
});

test('item labels', () => {
  eq(itemLabel(ix.items.get('2022-P1-3')), '2022 P1 Q3');
  eq(itemLabel(ix.items.get('2022-Q1(b)')), '2022 P2 Q1(b)');
  eq(itemLabel(ix.items.get('2022-other')), '2022 P2 not in topic bank');
});

// ---- the real exported bank ----
const real = indexBank(JSON.parse(readFile('app/data/bank.json')));
test('real bank: every year has a full P1 and P2 adds up to the paper total', () => {
  for (const [y, p] of Object.entries(real.bank.papers)) {
    eq(p.p1.length, +y <= 2013 ? 40 : 45, `${y} P1`);
    const core = p.p2.filter((x) => !x.elective).reduce((a, x) => a + x.marks, 0);
    eq(core + (p.hasElective ? 16 : 0), p.p2Total, `${y} P2`);
    if (p.hasElective) for (const e of ['E1', 'E2']) eq(p.p2.filter((x) => x.elective === e).reduce((a, x) => a + x.marks, 0), 16, `${y} ${e}`);
  }
});
test('real bank: every tagged item points at a known sub-topic', () => {
  for (const it of real.items.values()) for (const s of it.subs) if (!real.subs.has(s)) throw new Error(`${it.id} -> ${s}`);
});
test('real bank: 2022 has 44 scoring MC questions (Q2 deleted)', () => {
  eq(paperItems(real, 2022, 'P1').filter((i) => i.max).length, 44);
});

print(`${passed} passed, ${failed} failed`);
if (failed) throw new Error('tests failed');
