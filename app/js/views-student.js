// One student: overview, syllabus map, PP record, lessons, homework, school results, profile.
import { t, subName } from './i18n.js';
import { h, fmtDate, today, pct, modal, field, select, toast, trendChart, syllabusMap, STATES } from './ui.js';
import { MISTAKES, levelName, levelValue, itemLabel } from './logic.js';
import { newToken } from './store.js';

const TABS = ['overview', 'map', 'attempts', 'lessons', 'homework', 'school', 'profile'];
const TAB_LABEL = { overview: 'overview', map: 'map', attempts: 'attempts', lessons: 'lessons', homework: 'homework', school: 'schoolResults', profile: 'profile' };

export function familyUrl(token) {
  return new URL(`family.html#t=${token}`, location.href.split('#')[0].replace(/[^/]*$/, '')).href;
}

export function studentPage(app, id, tab) {
  const s = app.student(id);
  const v = app.viewOf(id);
  const body = { overview, map: mapTab, attempts: attemptsTab, lessons: lessonsTab, homework: homeworkTab, school: schoolTab, profile: profileTab }[tab] || overview;
  return h('div.page',
    h('div.page-head',
      h('div', h('h1', s.name), h('p.muted', [s.form, s.school, s.elective ? `${t('elective')} ${s.elective.replace('E', '')}` : null, s.status].filter(Boolean).join(' · '))),
      h('a.button.primary', { href: `#/log/${id}` }, '+ ', t('log'))),
    h('nav.tabs', TABS.map((k) => h('a', { href: `#/s/${id}/${k}`, class: k === tab ? 'on' : '' }, t(TAB_LABEL[k])))),
    body(app, s, v));
}

// ---------- overview ----------

function overview(app, s, v) {
  const school = app.data.school_results.filter((r) => r.student_id === s.id && r.predicted_grade).sort((a, b) => (a.date < b.date ? 1 : -1))[0];
  const levelCard = h('section.card.level-card',
    h('div', h('span.label', t('predicted')),
      v.predicted ? h('div.big', `L${v.predicted.level}`, h('small', ` ${v.predicted.value.toFixed(1)}`)) : h('div.big.muted', '—'),
      h('span.hint', v.predicted ? t('basedOn')(v.predicted.basedOn) : t('noPrediction'))),
    h('div', h('span.label', t('schoolPredicted')), h('div.big', school ? school.predicted_grade : '—'),
      h('span.hint', school ? `${school.exam} · ${fmtDate(school.date)}` : '')));

  const mis = v.mistakes;
  const mistakes = h('section.card', h('h2', t('mistakes')),
    mis.total ? h('div.bars', MISTAKES.map((k) => h('div.bar-row',
      h('span', t('mistake')[k]), h('div.bar', h('i', { style: { width: `${100 * mis.share[k]}%` } })), h('b', pct(100 * mis.share[k]))))) : h('p.muted', t('mistakeNone')));

  const next = h('section.card', h('h2', t('nextPractice')),
    v.next.length ? v.next.map((n) => {
      const sub = app.index.subs.get(n.sub);
      return h('div.next',
        h('div.next-head', h('b', `${n.sub} ${subName(sub)}`), h('span.muted', ` ${pct(n.pct)}`),
          n.items.length ? h('button.small', { type: 'button', onclick: () => app.mutate((st) => st.insert('homework', {
            student_id: s.id, title: `${n.sub} ${sub.en}`, qids: n.items.map((i) => i.id),
            due_date: new Date(Date.now() + 7 * 864e5).toLocaleDateString('en-CA') })) }, t('assign')) : null),
        h('div.next-items', n.items.map((i) => h('span.tag', itemLabel(i)))));
    }) : h('p.muted', t('allClear')));

  return h('div.stack',
    h('div.grid2', levelCard, familyCard(app, s)),
    h('section.card', h('h2', t('trend')), trendChart(v.attempts, v.settings)),
    h('div.grid2', mistakes, next));
}

function familyCard(app, s) {
  const url = familyUrl(s.family_token);
  const phone = (s.parent_phone || '').replace(/\D/g, '');
  return h('section.card', h('h2', t('familyLink')),
    h('input.mono', { readOnly: true, value: url, onclick: (e) => e.target.select() }),
    h('div.row',
      h('button.small', { type: 'button', onclick: async () => { await navigator.clipboard.writeText(url); toast(t('linkCopied'), 'ok'); } }, t('copyLink')),
      phone ? h('a.button.small', { href: `https://wa.me/${phone.length === 8 ? '852' + phone : phone}?text=${encodeURIComponent(url)}`, target: '_blank', rel: 'noopener' }, t('whatsapp')) : null,
      h('a.button.small', { href: url, target: '_blank', rel: 'noopener' }, '↗'),
      h('button.small.danger', { type: 'button', onclick: () => {
        if (confirm(t('resetConfirm'))) app.mutate((st) => st.update('students', s.id, { family_token: newToken() }));
      } }, t('resetLink'))));
}

// ---------- map ----------

function mapTab(app, s, v) {
  const hide = new Set(['E1', 'E2'].filter((e) => s.elective && e !== s.elective));
  return h('section.card', syllabusMap(app.index, v.mastery, v.taught, v.overrides, v.settings, {
    hide,
    onPick: async (sub, st) => {
      const choice = await modal(`${sub.id} ${subName(sub)}`, (close) => h('div.stack',
        h('p.muted', st.manual ? t('setByTutor') : ''),
        h('div.chip-picker', STATES.map((k) => h('button', { type: 'button', class: `chip s-${k}${st.state === k ? ' on' : ''}`, onclick: () => close(k) }, t('mapLegend')[k]))),
        st.manual ? h('button.link', { type: 'button', onclick: () => close('') }, t('clearOverride')) : null));
      if (choice !== undefined) app.mutate((store) => store.setOverride(s.id, sub.id, choice || null));
    },
  }));
}

// ---------- attempts ----------

function attemptsTab(app, s, v) {
  if (!v.attempts.length) return h('p.muted', t('noAttempts'));
  return h('div.stack', v.attempts.map((a) => {
    const lv = a.full ? levelName(levelValue(a.pct, a.year, v.settings.cutoffs)) : null;
    return h('section.card.attempt',
      h('div.attempt-head',
        h('div', h('b', a.label), ' ', a.timed ? h('span.pill', '⏱') : null, h('span.muted', ` · ${fmtDate(a.date)}`)),
        h('div.score', pct(a.pct, 1), lv ? h('span.level', ` L${lv}`) : null)),
      h('p.muted', [a.p1 ? `P1 ${a.p1.earned}/${a.p1.max}` : null, a.p2 ? `P2 ${a.p2.earned}/${a.p2.max}` : null].filter(Boolean).join(' · ')),
      a.comment ? h('p', '💬 ', a.comment) : null,
      a.private_note ? h('p.private', '🔒 ', a.private_note) : null,
      h('div.row',
        h('a.button.small', { href: `#/log/edit/${a.id}` }, t('edit')),
        h('button.small.danger', { type: 'button', onclick: () => { if (confirm(t('confirmDelete'))) app.mutate((st) => st.remove('attempts', a.id)); } }, t('delete'))));
  }));
}

// ---------- lessons ----------

export function subPicker(index, chosen = [], hideTopics = new Set()) {
  const picked = new Set(chosen);
  const wrap = h('div.sub-picker');
  for (const topic of index.bank.topics) {
    if (hideTopics.has(topic.code)) continue;
    const n = topic.subtopics.filter((x) => picked.has(x.id)).length;
    wrap.append(h('details', { open: n > 0 }, h('summary', `${topic.code} ${subName(topic)}`, n ? ` (${n})` : ''),
      h('div.chip-picker', topic.subtopics.map((sub) => {
        const b = h('button', { type: 'button', class: `chip${picked.has(sub.id) ? ' on' : ''}`, onclick: () => {
          picked.has(sub.id) ? picked.delete(sub.id) : picked.add(sub.id);
          b.classList.toggle('on');
        } }, `${sub.id} ${subName(sub)}`);
        return b;
      }))));
  }
  wrap.value = () => [...picked];
  return wrap;
}

function lessonsTab(app, s) {
  const rows = app.data.lessons.filter((l) => l.student_id === s.id).sort((a, b) => (a.date < b.date ? 1 : -1));
  const hide = new Set(['E1', 'E2'].filter((e) => e !== s.elective));
  const edit = async (l = {}) => {
    const row = await modal(t('addLesson'), (close) => {
      const date = h('input', { type: 'date', value: l.date || today() });
      const minutes = h('input', { type: 'number', min: 0, step: 15, value: l.minutes ?? 90 });
      const subs = subPicker(app.index, l.subs, hide);
      const note = h('textarea', { rows: 2, value: l.note || '' });
      return h('form.stack', { onsubmit: (e) => { e.preventDefault(); close({ student_id: s.id, date: date.value, minutes: +minutes.value || null, subs: subs.value(), note: note.value || null }); } },
        h('div.grid2', field(t('date'), date), field(t('minutes'), minutes)), field(t('covered'), subs), field(t('note'), note),
        h('button.primary', { type: 'submit' }, t('save')));
    });
    if (row) app.mutate((st) => (l.id ? st.update('lessons', l.id, row) : st.insert('lessons', row)));
  };
  return h('div.stack',
    h('div', h('button.primary', { type: 'button', onclick: () => edit() }, '+ ', t('addLesson'))),
    rows.length ? h('ul.list.cards', rows.map((l) => h('li',
      h('div.row.spread', h('b', fmtDate(l.date)), h('span.muted', l.minutes ? `${l.minutes} min` : '')),
      h('div', (l.subs || []).map((x) => h('span.tag', x))),
      l.note ? h('p', l.note) : null,
      h('div.row', h('button.small', { type: 'button', onclick: () => edit(l) }, t('edit')),
        h('button.small.danger', { type: 'button', onclick: () => { if (confirm(t('confirmDelete'))) app.mutate((st) => st.remove('lessons', l.id)); } }, t('delete')))))) : h('p.muted', t('none')));
}

// ---------- homework ----------

function homeworkTab(app, s) {
  const rows = app.data.homework.filter((x) => x.student_id === s.id).sort((a, b) => (a.set_date < b.set_date ? 1 : -1));
  const add = async () => {
    const row = await modal(t('addHomework'), (close) => {
      const title = h('input', { required: true });
      const due = h('input', { type: 'date', value: new Date(Date.now() + 7 * 864e5).toLocaleDateString('en-CA') });
      return h('form.stack', { onsubmit: (e) => { e.preventDefault(); close({ student_id: s.id, title: title.value, due_date: due.value || null }); } },
        field(t('title'), title), field(t('due'), due), h('button.primary', { type: 'submit' }, t('save')));
    });
    if (row) app.mutate((st) => st.insert('homework', row));
  };
  return h('div.stack',
    h('div', h('button.primary', { type: 'button', onclick: add }, '+ ', t('addHomework'))),
    rows.length ? h('ul.list.cards', rows.map((hw) => h('li',
      h('div.row.spread', h('b', hw.title), h('span.muted', `${t('due')} ${fmtDate(hw.due_date)}`)),
      hw.qids?.length ? h('div', hw.qids.map((q) => h('span.tag', itemLabel(app.index.items.get(q))))) : null,
      h('div.row',
        ['set', 'on_time', 'late', 'missing'].map((k) => h('button.small', { type: 'button', class: `small${hw.status === k ? ' on' : ''}`,
          onclick: () => app.mutate((st) => st.update('homework', hw.id, { status: k }), null) }, t('hwStatus')[k])),
        hw.qids?.length && !hw.attempt_id ? h('a.button.small.primary', { href: `#/log/${s.id}/hw-${hw.id}` }, t('log')) : null,
        h('button.small.danger', { type: 'button', onclick: () => { if (confirm(t('confirmDelete'))) app.mutate((st) => st.remove('homework', hw.id)); } }, t('delete')))))) : h('p.muted', t('none')));
}

// ---------- school results ----------

function schoolTab(app, s) {
  const rows = app.data.school_results.filter((r) => r.student_id === s.id).sort((a, b) => (a.date < b.date ? 1 : -1));
  const edit = async (r = {}) => {
    const row = await modal(t('addResult'), (close) => {
      const exam = h('input', { required: true, value: r.exam || '', placeholder: 'UT1 / Term exam / Mock' });
      const date = h('input', { type: 'date', value: r.date || today() });
      const mark = h('input', { type: 'number', step: 0.5, value: r.mark ?? '' });
      const max = h('input', { type: 'number', step: 0.5, value: r.max ?? 100 });
      const grade = select([['', '—'], ...['1', '2', '3', '4', '5', '5*', '5**'].map((g) => [g, g])], r.predicted_grade);
      return h('form.stack', { onsubmit: (e) => { e.preventDefault(); close({ student_id: s.id, exam: exam.value, date: date.value || null,
        mark: mark.value === '' ? null : +mark.value, max: max.value === '' ? null : +max.value, predicted_grade: grade.value || null }); } },
      field(t('exam'), exam), field(t('date'), date), h('div.grid2', field(t('mark'), mark), field(t('outOf'), max)),
      field(t('predictedGrade'), grade), h('button.primary', { type: 'submit' }, t('save')));
    });
    if (row) app.mutate((st) => (r.id ? st.update('school_results', r.id, row) : st.insert('school_results', row)));
  };
  return h('div.stack',
    h('div', h('button.primary', { type: 'button', onclick: () => edit() }, '+ ', t('addResult'))),
    rows.length ? h('div.table-wrap', h('table.data',
      h('thead', h('tr', [t('date'), t('exam'), t('mark'), t('predictedGrade'), ''].map((x) => h('th', x)))),
      h('tbody', rows.map((r) => h('tr',
        h('td', fmtDate(r.date)), h('td', r.exam), h('td', r.mark != null ? `${r.mark}${r.max ? ' / ' + r.max : ''}` : '—'),
        h('td', r.predicted_grade || '—'),
        h('td.row', h('button.small', { type: 'button', onclick: () => edit(r) }, t('edit')),
          h('button.small.danger', { type: 'button', onclick: () => { if (confirm(t('confirmDelete'))) app.mutate((st) => st.remove('school_results', r.id)); } }, t('delete')))))))) : h('p.muted', t('none')));
}

// ---------- profile ----------

export function studentForm(s, close) {
  const f = {
    name: h('input', { required: true, value: s.name || '' }),
    form: select(['', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6'].map((x) => [x, x || '—']), s.form),
    dse_year: h('input', { type: 'number', min: 2026, max: 2035, value: s.dse_year ?? '' }),
    school: h('input', { value: s.school || '' }),
    elective: select([['', t('electiveNone')], ['E1', 'Elective 1'], ['E2', 'Elective 2']], s.elective),
    language: select([['', '—'], ['en', t('langEn')], ['zh', t('langZh')]], s.language),
    status: select(['Active', 'Trial', 'Paused', 'Drop-in', 'Left'].map((x) => [x, x]), s.status || 'Active'),
    source: h('input', { value: s.source || '', list: 'sources' }),
    parent_name: h('input', { value: s.parent_name || '' }),
    parent_phone: h('input', { type: 'tel', value: s.parent_phone || '' }),
    notes: h('textarea', { rows: 3, value: s.notes || '' }),
  };
  const sources = h('datalist#sources', ['Carousell', 'Instagram', 'Referral', 'Returning student', 'Walk-in', 'Meta ad', 'Unknown / original student'].map((x) => h('option', { value: x })));
  return h('form.stack', { onsubmit: (e) => {
    e.preventDefault();
    const row = {};
    for (const [k, el] of Object.entries(f)) row[k] = el.value === '' ? null : k === 'dse_year' ? +el.value : el.value;
    close(row);
  } },
  field(t('name'), f.name),
  h('div.grid3', field(t('form'), f.form), field(t('dseYear'), f.dse_year), field(t('status'), f.status)),
  h('div.grid3', field(t('school'), f.school), field(t('elective'), f.elective), field(t('language'), f.language)),
  h('div.grid3', field(t('parentName'), f.parent_name), field(t('parentPhone'), f.parent_phone), field(t('source'), f.source)),
  field(t('notes'), f.notes), sources,
  h('button.primary', { type: 'submit' }, t('save')));
}

function profileTab(app, s) {
  return h('div.stack',
    h('section.card', studentForm(s, (row) => app.mutate((st) => st.update('students', s.id, row)))),
    h('button.danger', { type: 'button', onclick: async () => {
      if (confirm(`${t('confirmDelete')}\n${s.name}`)) { await app.mutate((st) => st.remove('students', s.id)); app.go('#/students'); }
    } }, `${t('delete')} ${s.name}`));
}
