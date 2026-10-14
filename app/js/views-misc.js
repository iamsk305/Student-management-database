// Class heat map, question bank browser, settings + Excel export.
import { t, subName } from './i18n.js';
import { h, field, select, pct, toast } from './ui.js';
import { masteryState, withDefaults, itemLabel, responseScore, wrongLetters, LEVELS } from './logic.js';

// ---------- class ----------

export function classView(app) {
  const students = app.data.students.filter((s) => s.status === 'Active' || s.status === 'Trial').sort((a, b) => a.name.localeCompare(b.name));
  const subs = app.index.bank.teachingOrder.map((id) => app.index.subs.get(id)).filter(Boolean);
  const table = h('table.heat',
    h('thead', h('tr', h('th', ''), subs.map((s) => h('th', { title: `${s.id} ${subName(s)}` }, h('span', s.id))))),
    h('tbody', students.map((st) => {
      const v = app.viewOf(st.id);
      return h('tr', h('th', h('a', { href: `#/s/${st.id}/map` }, st.name)), subs.map((s) => {
        const ms = masteryState(s.id, v.mastery.get(s.id), v.taught, v.overrides, v.settings);
        const off = s.topic.startsWith('E') && s.topic.length === 2 && st.elective && st.elective !== s.topic;
        return h('td', { class: off ? 'off' : `s-${ms.state}`, title: `${st.name} · ${s.id} ${subName(s)} · ${pct(ms.pct)}` });
      }));
    })));
  return h('div.page', h('h1', t('classView')), h('p.muted', t('classHint')),
    h('div.legend.map-legend', ['untaught', 'thin', 'red', 'amber', 'green'].map((k) => h(`span.k.s-${k}`, t('mapLegend')[k]))),
    h('div.table-wrap', table));
}

// ---------- question bank ----------

export function bankView(app, subId) {
  const sub = subId ? decodeURIComponent(subId) : app.index.bank.teachingOrder[0];
  const items = [...app.index.items.values()].filter((i) => i.subs.includes(sub) && i.max > 0).sort((a, b) => b.year - a.year || a.kind.localeCompare(b.kind));
  const byQ = new Map();
  for (const r of app.data.responses) {
    if (!byQ.has(r.qid)) byQ.set(r.qid, []);
    byQ.get(r.qid).push(r);
  }
  const studentOf = new Map(app.data.attempts.map((a) => [a.id, a.student_id]));
  const wrong = wrongLetters(app.index, app.data.responses);
  const picker = select(app.index.bank.topics.flatMap((tp) => tp.subtopics.map((s) => [s.id, `${s.id} ${subName(s)}`])), sub,
    { onchange: (e) => app.go(`#/bank/${encodeURIComponent(e.target.value)}`) });
  return h('div.page', h('h1', t('bank')), h('p.muted', t('bankBuilt')(app.index.bank.built)),
    field(t('pickSub'), picker),
    h('div.table-wrap', h('table.data',
      h('thead', h('tr', ['', t('outOf'), t('attemptedBy'), t('avgScore'), t('wrongPicks')].map((x) => h('th', x)))),
      h('tbody', items.map((it) => {
        const rs = byQ.get(it.id) || [];
        const got = rs.map((r) => responseScore(it, r));
        const avg = got.length ? 100 * got.reduce((a, g) => a + g.earned, 0) / got.reduce((a, g) => a + g.max, 0) : null;
        const w = wrong.get(it.id);
        return h('tr',
          h('td', itemLabel(it), it.kind === 'mc' ? h('span.muted', ` (${it.key})`) : null),
          h('td', it.max),
          h('td', new Set(rs.map((r) => studentOf.get(r.attempt_id))).size || ''),
          h('td', avg == null ? '' : pct(avg)),
          h('td', w ? Object.entries(w).sort((a, b) => b[1] - a[1]).map(([l, n]) => `${l}×${n}`).join(' ') : ''));
      })))));
}

// ---------- settings ----------

export function settingsView(app) {
  const s = withDefaults(app.data.settings);
  const years = Object.keys(s.cutoffs).map(Number).sort((a, b) => b - a);
  const cut = {};
  const cutTable = h('table.data.cutoffs',
    h('thead', h('tr', h('th', ''), LEVELS.slice(1).map((l) => h('th', `L${l}`)))),
    h('tbody', years.map((y) => h('tr', h('th', y), s.cutoffs[y].map((v, i) => {
      const inp = h('input', { type: 'number', min: 0, max: 100, step: 1, value: v });
      (cut[y] ||= [])[i] = inp;
      return h('td', inp);
    })))));
  const num = (v, attrs = {}) => h('input', { type: 'number', value: v, ...attrs });
  const p1 = num(s.weights.p1 * 100, { min: 0, max: 100, step: 5 });
  const red = num(s.mastery.red), green = num(s.mastery.green), minEv = num(s.mastery.minEvidence), half = num(s.mastery.halfLifeDays);
  const save = () => {
    const data = {
      weights: { p1: +p1.value / 100, p2: 1 - +p1.value / 100 },
      mastery: { red: +red.value, green: +green.value, minEvidence: +minEv.value, halfLifeDays: +half.value },
      cutoffs: Object.fromEntries(years.map((y) => [y, cut[y].map((i) => +i.value)])),
    };
    for (const [y, c] of Object.entries(data.cutoffs)) {
      if (c.some((v, i) => i && v < c[i - 1])) { toast(`${y}: cut-offs must rise from L2 to L5**`, 'err'); return; }
    }
    app.mutate((st) => st.saveSettings(data));
  };
  return h('div.page', h('h1', t('settings')),
    h('section.card', h('h2', t('weights')), h('div.grid2', field('Paper 1 %', p1), field('Paper 2 %', h('input', { disabled: true, value: 100 - s.weights.p1 * 100 })))),
    h('section.card', h('h2', t('bands')), h('div.grid4', field(`${t('red')} %`, red), field(`${t('green')} %`, green), field(t('minEvidence'), minEv), field(t('halfLife'), half))),
    h('section.card', h('h2', t('cutoffs')), h('div.table-wrap', cutTable)),
    h('button.primary.big', { type: 'button', onclick: save }, t('save')),
    h('section.card', h('h2', t('exportAll')), h('p.muted', t('exportHint')),
      h('button', { type: 'button', onclick: () => exportExcel(app) }, t('exportAll'))));
}

// ---------- Excel export (SpreadsheetML: one file, one sheet per table, opens in Excel) ----------

function exportExcel(app) {
  const esc = (v) => String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const name = (id) => app.student(id)?.name || '';
  const attemptStudent = new Map(app.data.attempts.map((a) => [a.id, a.student_id]));
  const sheets = {
    Students: app.data.students.map(({ tutor_id, family_token, ...r }) => r),
    Attempts: app.data.attempts.map(({ tutor_id, ...r }) => {
      const v = app.viewOf(r.student_id).attempts.find((x) => x.id === r.id);
      return { student: name(r.student_id), ...r, percent: v?.pct?.toFixed(1) ?? '' };
    }),
    Responses: app.data.responses.map(({ tutor_id, ...r }) => ({ student: name(attemptStudent.get(r.attempt_id)), ...r,
      item: itemLabel(app.index.items.get(r.qid)), mistakes: (r.mistakes || []).join(', ') })),
    Lessons: app.data.lessons.map(({ tutor_id, ...r }) => ({ student: name(r.student_id), ...r, subs: (r.subs || []).join(', ') })),
    Homework: app.data.homework.map(({ tutor_id, ...r }) => ({ student: name(r.student_id), ...r, qids: (r.qids || []).join(', ') })),
    'School results': app.data.school_results.map(({ tutor_id, ...r }) => ({ student: name(r.student_id), ...r })),
    'Map overrides': app.data.mastery_overrides.map(({ tutor_id, ...r }) => ({ student: name(r.student_id), ...r })),
  };
  const sheetXml = (title, rows) => {
    const cols = [...new Set(rows.flatMap((r) => Object.keys(r)))];
    const cell = (v) => (typeof v === 'number' ? `<Cell><Data ss:Type="Number">${v}</Data></Cell>` : `<Cell><Data ss:Type="String">${esc(v)}</Data></Cell>`);
    return `<Worksheet ss:Name="${esc(title)}"><Table><Row>${cols.map((c) => cell(c)).join('')}</Row>${
      rows.map((r) => `<Row>${cols.map((c) => cell(r[c])).join('')}</Row>`).join('')}</Table></Worksheet>`;
  };
  const xml = `<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">${
    Object.entries(sheets).map(([k, v]) => sheetXml(k, v)).join('')}</Workbook>`;
  const a = h('a', { href: URL.createObjectURL(new Blob([xml], { type: 'application/vnd.ms-excel' })), download: `kairos-student-tracker-${new Date().toLocaleDateString('en-CA')}.xls` });
  document.body.append(a);
  a.click();
  a.remove();
}
