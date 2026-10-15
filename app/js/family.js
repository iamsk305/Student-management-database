// Read-only family page: family.html#t=<token>. The token lives in the URL fragment, so it is never sent to
// the web server or leaked in referrers; only the family_view() database function sees it.
import { supabaseStore, demoStore } from './store.js';
import { indexBank, levelName, levelValue } from './logic.js';
import { studentView } from './model.js';
import { t, getLang, setLang, initLang } from './i18n.js';
import { h, fmtDate, pct, trendChart, syllabusMap } from './ui.js';
import { FAMILY_LINKS } from './config.js';

const params = new URLSearchParams(location.hash.slice(1));
const token = params.get('t');
const isDemo = new URLSearchParams(location.search).has('demo') || params.has('demo');
let bankIndex, data;

async function boot() {
  initLang('zh', 'kairos-lang-family');
  const bank = await fetch('data/bank.json', { cache: 'no-cache' }).then((r) => r.json());
  bankIndex = indexBank(bank);
  let store;
  if (isDemo) {
    const { demoSeed } = await import('./demo.js');
    store = demoStore(demoSeed(bankIndex));
  } else store = supabaseStore();
  data = token && (FAMILY_LINKS || isDemo) ? await store.family(token) : null;
  render();
}

function render() {
  const root = document.getElementById('app');
  const head = h('header.top.family-top',
    h('img.family-logo', { src: 'assets/lockup-horizontal-paper-transparent.svg', alt: 'Kairos｜DSE 經濟' }),
    h('button.lang', { type: 'button', onclick: () => { setLang(getLang() === 'en' ? 'zh' : 'en'); render(); } }, getLang() === 'en' ? '中文' : 'EN'));
  if (!data) {
    root.replaceChildren(head, h('main.page', h('p.error', t('linkInvalid'))));
    return;
  }
  const s = data.student;
  const v = studentView(bankIndex, {
    student: s,
    attempts: data.attempts,
    responses: data.attempts.flatMap((a) => a.responses.map((r) => ({ ...r, attempt_id: a.id }))),
    taughtSubs: data.taught,
    overrides: data.overrides,
    settings: data.settings,
  });
  const school = [...data.school].filter((r) => r.predicted_grade).sort((a, b) => (a.date < b.date ? 1 : -1))[0];
  const hide = new Set(['E1', 'E2'].filter((e) => s.elective && e !== s.elective));
  document.title = `${s.name} · ${t('familyTitle')} · Kairos`;

  root.replaceChildren(head, h('main.page',
    h('div.page-head', h('div', h('h1', s.name), h('p.muted', [s.form, s.dse_year ? `DSE ${s.dse_year}` : null].filter(Boolean).join(' · '), ' · ', t('familyIntro')))),
    h('div.grid2',
      h('section.card.level-card',
        h('div', h('span.label', t('predicted')),
          v.predicted ? h('div.big', `L${v.predicted.level}`) : h('div.big.muted', '—'),
          h('span.hint', v.predicted ? t('basedOn')(v.predicted.basedOn) : t('noPrediction'))),
        h('div', h('span.label', t('schoolPredicted')), h('div.big', school ? school.predicted_grade : '—'),
          h('span.hint', school ? `${school.exam} · ${fmtDate(school.date)}` : ''))),
      h('section.card', h('h2', t('trend')), trendChart(v.attempts, v.settings))),
    h('section.card', h('h2', t('map')), syllabusMap(bankIndex, v.mastery, v.taught, v.overrides, v.settings, { hide })),
    h('section.card', h('h2', t('ppRecord')),
      v.attempts.length ? h('ul.list.cards', v.attempts.map((a) => {
        const lv = a.full ? levelName(levelValue(a.pct, a.year, v.settings.cutoffs)) : null;
        return h('li',
          h('div.row.spread', h('b', a.label, a.timed ? ' ⏱' : ''), h('span', pct(a.pct, 1), lv ? h('span.level', ` L${lv}`) : null)),
          h('div.muted', fmtDate(a.date), a.p1 ? ` · P1 ${a.p1.earned}/${a.p1.max}` : '', a.p2 ? ` · P2 ${a.p2.earned}/${a.p2.max}` : ''),
          a.comment ? h('p.comment', h('span.label', t('tutorComment')), ' ', a.comment) : null);
      })) : h('p.muted', t('noAttempts')))));
}

boot().catch((e) => {
  console.error(e);
  document.getElementById('app').replaceChildren(h('p.error', t('linkInvalid')));
});
