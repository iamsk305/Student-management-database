// Fictional sample data for demo mode (index.html?demo, family.html?demo#t=demo-family-link-alex-000001).
// Deterministic, so screenshots and tests look the same every time.
import { paperItems } from './logic.js';

function rng(seed) {
  let x = seed;
  return () => ((x = (x * 1664525 + 1013904223) % 4294967296) / 4294967296);
}
const day = (offset) => new Date(Date.now() + offset * 864e5).toLocaleDateString('en-CA');

export function demoSeed(index) {
  const rand = rng(7);
  const students = [
    { id: 'st-alex', name: 'Alex Chan (demo)', form: 'F6', dse_year: 2027, school: 'Demo College', elective: 'E2', language: 'en',
      status: 'Active', source: 'Carousell', parent_name: 'Mrs Chan', parent_phone: '', family_token: 'demo-family-link-alex-000001' },
    { id: 'st-bella', name: 'Bella Wong (demo)', form: 'F5', dse_year: 2028, school: 'Sample Secondary', elective: 'E1', language: 'zh',
      status: 'Active', source: 'Referral', family_token: 'demo-family-link-bella-00002' },
    { id: 'st-calvin', name: 'Calvin Lee (demo)', form: 'F4', dse_year: 2029, school: 'Demo College', status: 'Trial',
      source: 'Instagram', family_token: 'demo-family-link-calvin-0003' },
  ];
  const attempts = [], responses = [], lessons = [], homework = [], school_results = [], mastery_overrides = [];
  let n = 0;
  const addAttempt = (student, ability, a, items) => {
    const id = `at-${++n}`;
    attempts.push({ id, student_id: student.id, ...a });
    for (const it of items) {
      // ability varies by sub-topic so the map shows a spread
      const bias = it.subs.length ? (it.subs[0].charCodeAt(0) % 5) / 10 - 0.2 : 0;
      const p = Math.min(0.97, Math.max(0.05, ability + bias));
      if (it.kind === 'mc') {
        const right = rand() < p;
        const wrong = ['A', 'B', 'C', 'D'].filter((l) => l !== it.key);
        responses.push({ id: `r-${n}-${it.id}`, attempt_id: id, qid: it.id, choice: it.key ? (right ? it.key : wrong[Math.floor(rand() * 3)]) : null, mistakes: [] });
      } else {
        const mark = Math.round(it.max * Math.min(1, Math.max(0, p + (rand() - 0.5) * 0.4)) * 2) / 2;
        const lost = mark < it.max ? ['concept', 'expression', 'diagram', 'careless', 'incomplete'].filter(() => rand() < 0.35) : [];
        responses.push({ id: `r-${n}-${it.id}`, attempt_id: id, qid: it.id, mark, mistakes: lost.length ? lost : mark < it.max ? ['expression'] : [] });
      }
    }
  };

  // Alex: F6, three timed full papers, improving.
  const alex = students[0];
  [[2019, -56, 0.48, 'Section B timing slipped — finish Q9 before the essay.'], [2021, -28, 0.56, 'Elasticity answers much clearer.'],
    [2023, -6, 0.63, 'Best paper yet. Diagrams now labelled every time.']].forEach(([year, d, ab, comment]) => {
    const items = [...paperItems(index, year, 'P1'), ...paperItems(index, year, 'P2', alex.elective)];
    addAttempt(alex, ab, { date: day(d), year, paper: 'FULL', scope: 'full', timed: true, elective: alex.elective, comment,
      private_note: 'Parent asked about mock exam timing.' }, items);
  });
  addAttempt(alex, 0.55, { date: day(-12), year: null, paper: 'P2', scope: 'questions', timed: false, comment: 'Topic C homework set.' },
    [...index.items.values()].filter((i) => i.kind === 'lq' && i.subs.includes('C.6')).slice(0, 4));
  school_results.push({ id: 'sr-1', student_id: alex.id, date: day(-40), exam: 'F6 Mock', mark: 61, max: 100, predicted_grade: '3' });

  // Bella: F5, topic sets only.
  const bella = students[1];
  for (const [sub, d, ab] of [['C.1', -35, 0.7], ['C.3', -21, 0.45], ['C.6', -9, 0.35], ['B.8', -3, 0.6]]) {
    addAttempt(bella, ab, { date: day(d), year: null, paper: 'FULL', scope: 'questions', timed: false, comment: `${sub} practice.` },
      [...index.items.values()].filter((i) => i.subs.includes(sub) && i.max > 0).slice(0, 8));
  }
  mastery_overrides.push({ student_id: bella.id, sub: 'A.3', state: 'green' });

  const order = index.bank.teachingOrder;
  const teach = (s, upto, start) => order.slice(0, upto).forEach((sub, i) => {
    if (i % 3 === 0) lessons.push({ id: `l-${s.id}-${i}`, student_id: s.id, date: day(start + i * 2), minutes: 90, subs: order.slice(i, i + 3), note: null });
  });
  teach(alex, 50, -100);
  teach(bella, 22, -50);
  lessons.push({ id: 'l-today', student_id: bella.id, date: day(0), minutes: 90, subs: ['C.6'], note: 'Elasticity diagrams' });
  homework.push({ id: 'hw-1', student_id: bella.id, set_date: day(-5), due_date: day(1), title: 'C.6 Elasticity — 4 LQ',
    qids: [...index.items.values()].filter((i) => i.kind === 'lq' && i.subs.includes('C.6')).slice(4, 8).map((i) => i.id), status: 'set', attempt_id: null });

  return { students, attempts, responses, lessons, homework, school_results, mastery_overrides, settings: {} };
}
