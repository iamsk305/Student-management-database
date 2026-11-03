// Home and student list.
import { t } from './i18n.js';
import { h, fmtDate, today, modal, gradeLabel, sparkline, pct } from './ui.js';
import { levelName, combineSplitPapers } from './logic.js';
import { studentForm } from './views-student.js';

const daysSince = (d) => (d ? Math.floor((Date.parse(today()) - Date.parse(d)) / 86400000) : Infinity);

export function homeView(app) {
  const d = app.data;
  const active = d.students.filter((s) => s.status === 'Active' || s.status === 'Trial');
  const name = (id) => app.student(id)?.name || '?';

  const todays = d.lessons.filter((l) => l.date === today());
  const due = d.homework
    .filter((hw) => hw.status === 'set' && hw.due_date && daysSince(hw.due_date) >= -2 && app.student(hw.student_id))
    .sort((a, b) => (a.due_date < b.due_date ? -1 : 1));
  const quiet = active.filter((s) => daysSince(app.viewOf(s.id).lastDate) >= 14);

  const week = d.attempts.filter((a) => daysSince(a.date) <= 7 && app.student(a.student_id))
    .map((a) => ({ a, v: app.viewOf(a.student_id).attempts.find((x) => x.id === a.id) }))
    .sort((x, y) => (x.a.date < y.a.date ? 1 : -1));

  const list = (items, row) => (items.length ? h('ul.list', items.map(row)) : h('p.muted', t('allClear')));
  return h('div.page',
    h('div.page-head', h('h1', t('home')), h('a.button.primary', { href: '#/log' }, '+ ', t('log'))),
    h('div.home',
      h('div.home-main', studentCards(app, active)),
      h('aside.home-side',
        h('section', h('h2', t('today')),
          list(todays, (l) => h('li', h('a', { href: `#/s/${l.student_id}/lessons` }, name(l.student_id)), ' · ', l.minutes ? `${l.minutes} min` : '', ' ', l.note || ''))),
        h('section', h('h2', t('dueSoon')),
          list(due, (hw) => h('li', { class: daysSince(hw.due_date) > 0 ? 'overdue' : '' },
            h('a', { href: `#/s/${hw.student_id}/homework` }, name(hw.student_id)), ' · ', hw.title, ' · ', fmtDate(hw.due_date)))),
        h('section', h('h2', t('thisWeek')),
          list(week, ({ a, v }) => h('li', h('a', { href: `#/s/${a.student_id}/attempts` }, name(a.student_id)), ' · ',
            v?.label || '', v?.pct != null ? h('span.muted', ` ${pct(v.pct)}`) : null))),
        h('section', h('h2', t('quiet')),
          list(quiet, (s) => h('li', h('a', { href: `#/s/${s.id}` }, s.name), ' · ',
            app.viewOf(s.id).lastDate ? fmtDate(app.viewOf(s.id).lastDate) : t('noAttempts')))))));
}

const GRADES = ['1', '2', '3', '4', '5', '5*', '5**'];
const gradeRank = (g) => GRADES.indexOf(String(g ?? '').replace(/^L/i, ''));

/** Full papers only, newest first, with a year's separately logged P1 and P2 counted as one. */
function fullPapers(v) {
  const pairs = combineSplitPapers(v.attempts, v.settings, { timedOnly: false });
  return [...v.attempts.filter((a) => a.full), ...pairs].sort((a, b) => (a.date < b.date ? 1 : -1));
}

/** One card per student: big predicted level, recent scores, and a flag when school's grade disagrees. */
function studentCards(app, students) {
  if (!students.length) return h('p.muted', t('none'));
  return h('div.student-cards', students.map((s) => {
    const v = app.viewOf(s.id);
    const school = app.data.school_results.filter((r) => r.student_id === s.id && r.predicted_grade).sort((a, b) => (a.date < b.date ? 1 : -1))[0];
    const ours = v.predicted ? gradeRank(v.predicted.level) : -1, theirs = school ? gradeRank(school.predicted_grade) : -1;
    const gap = ours >= 0 && theirs >= 0 && ours !== theirs;
    return h(s.status === 'Left' ? 'a.student-card.left' : 'a.student-card', { href: `#/s/${s.id}` },
      h('div.sc-top', h('b.sc-name', s.name), h('span.muted', [s.form, s.status !== 'Active' ? s.status : null].filter(Boolean).join(' · '))),
      h('div.sc-mid',
        v.predicted ? h('span.sc-level', `L${v.predicted.level}`) : h('span.sc-level.none', '—'),
        sparkline(fullPapers(v))),
      h('div.sc-foot',
        gap ? h(theirs > ours ? 'span.flag.up' : 'span.flag.down', t('schoolSays')(gradeLabel(school.predicted_grade)))
          : h('span.muted', school ? `${t('school')} ${gradeLabel(school.predicted_grade)}` : ''),
        h('span.muted', v.lastDate ? fmtDate(v.lastDate) : t('noAttempts'))));
  }));
}

export function studentsView(app) {
  const showLeft = new URLSearchParams(location.hash.split('?')[1] || '').has('all');
  const list = app.data.students.filter((s) => showLeft || s.status !== 'Left').sort((a, b) => a.name.localeCompare(b.name));
  return h('div.page',
    h('div.page-head', h('h1', t('students')),
      h('button.primary', { type: 'button', onclick: async () => {
        const row = await modal(t('addStudent'), (close) => studentForm({}, close));
        if (row) {
          const s = await app.mutate((st) => st.insert('students', row));
          app.go(`#/s/${s.id}`);
        }
      } }, '+ ', t('addStudent'))),
    studentCards(app, list),
    h('label.check', h('input', { type: 'checkbox', checked: showLeft, onchange: (e) => app.go(e.target.checked ? '#/students?all' : '#/students') }), t('showLeft')));
}

export { levelName };
