// Home and student list.
import { t } from './i18n.js';
import { h, fmtDate, today, modal, gradeLabel } from './ui.js';
import { levelName } from './logic.js';
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

  const list = (items, row) => (items.length ? h('ul.list', items.map(row)) : h('p.muted', t('allClear')));
  return h('div.page',
    h('div.page-head', h('h1', t('home')), h('a.button.primary', { href: '#/log' }, '+ ', t('log'))),
    h('div.grid3',
      h('section.card', h('h2', t('today')),
        list(todays, (l) => h('li', h('a', { href: `#/s/${l.student_id}/lessons` }, name(l.student_id)), ' · ', l.minutes ? `${l.minutes} min` : '', ' ', l.note || ''))),
      h('section.card', h('h2', t('dueSoon')),
        list(due, (hw) => h('li', { class: daysSince(hw.due_date) > 0 ? 'overdue' : '' },
          h('a', { href: `#/s/${hw.student_id}/homework` }, name(hw.student_id)), ' · ', hw.title, ' · ', fmtDate(hw.due_date)))),
      h('section.card', h('h2', t('quiet')),
        list(quiet, (s) => h('li', h('a', { href: `#/s/${s.id}` }, s.name), ' · ',
          app.viewOf(s.id).lastDate ? fmtDate(app.viewOf(s.id).lastDate) : t('noAttempts'))))),
    h('section.card', h('h2', t('students')), studentTable(app, active)));
}

function studentTable(app, students) {
  if (!students.length) return h('p.muted', t('none'));
  return h('div.table-wrap', h('table.data',
    h('thead', h('tr', [t('name'), t('form'), t('predicted'), t('schoolPredicted'), t('lastAttempt'), t('status')].map((x) => h('th', x)))),
    h('tbody', students.map((s) => {
      const v = app.viewOf(s.id);
      const school = app.data.school_results.filter((r) => r.student_id === s.id && r.predicted_grade).sort((a, b) => (a.date < b.date ? 1 : -1))[0];
      return h('tr', { onclick: () => app.go(`#/s/${s.id}`), class: 'clickable' },
        h('td', h('a', { href: `#/s/${s.id}` }, s.name)),
        h('td', s.form || ''),
        h('td', v.predicted ? h('span.level', `L${v.predicted.level}`) : h('span.muted', '—')),
        h('td', school ? h('span.level', gradeLabel(school.predicted_grade)) : h('span.muted', '—')),
        h('td', v.lastDate ? fmtDate(v.lastDate) : h('span.muted', t('noAttempts'))),
        h('td', h(`span.pill.st-${s.status}`, s.status)));
    }))));
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
    studentTable(app, list),
    h('label.check', h('input', { type: 'checkbox', checked: showLeft, onchange: (e) => app.go(e.target.checked ? '#/students?all' : '#/students') }), t('showLeft')));
}

export { levelName };
