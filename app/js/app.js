// Admin app shell: login, data loading, routing, header. Views live in views-*.js.
import { supabaseStore, demoStore } from './store.js';
import { indexBank } from './logic.js';
import { studentView } from './model.js';
import { t, getLang, setLang, initLang } from './i18n.js';
import { h, toast, today, fmtDate } from './ui.js';
import { homeView, studentsView } from './views-home.js';
import { studentPage } from './views-student.js';
import { logView } from './views-log.js';
import { classView, bankView, settingsView } from './views-misc.js';

// Demo mode: index.html?demo, or #demo in the address bar (switches to sample data for this tab).
if (location.hash === '#demo') { sessionStorage.setItem('kairos-demo', '1'); location.hash = '#/'; }
const isDemo = new URLSearchParams(location.search).has('demo') || sessionStorage.getItem('kairos-demo') === '1';

export const app = {
  store: null,
  index: null,
  data: null,       // { students, attempts, responses, mastery_overrides, lessons, homework, school_results, settings }
  views: new Map(), // student id -> studentView (cleared on every change)

  student(id) { return this.data.students.find((s) => s.id === id); },
  viewOf(id) {
    if (!this.views.has(id)) {
      const d = this.data;
      const attempts = d.attempts.filter((a) => a.student_id === id);
      const ids = new Set(attempts.map((a) => a.id));
      this.views.set(id, studentView(this.index, {
        student: this.student(id),
        attempts,
        responses: d.responses.filter((r) => ids.has(r.attempt_id)),
        taughtSubs: d.lessons.filter((l) => l.student_id === id).flatMap((l) => l.subs || []),
        overrides: Object.fromEntries(d.mastery_overrides.filter((o) => o.student_id === id).map((o) => [o.sub, o.state])),
        settings: d.settings,
      }));
    }
    return this.views.get(id);
  },
  /** Run a store call, then reload everything and re-render. Small data, so a full reload keeps things simple. */
  async mutate(fn, okMsg = t('saved')) {
    try {
      const out = await fn(this.store);
      await this.reload();
      if (okMsg) toast(okMsg, 'ok');
      return out;
    } catch (e) {
      toast(e.message || String(e), 'err');
      throw e;
    }
  },
  async reload() {
    this.data = await this.store.loadAll();
    this.data.settings ||= {};
    this.views.clear();
    render();
  },
  go(hash) { if (location.hash === hash) render(); else location.hash = hash; },
};

const main = () => document.getElementById('main');

function header() {
  const links = [['#/', t('home')], ['#/students', t('students')], ['#/log', t('log')], ['#/class', t('classView')],
    ['#/bank', t('bank')], ['#/settings', t('settings')]];
  const here = location.hash || '#/';
  return h('header.top',
    h('a.brand', { href: '#/' }, h('img', { src: 'assets/mark-paper-on-navy.svg', alt: '' }),
      h('span.brand-text', h('b', 'Kairos'), h('span', '｜DSE 經濟')), h('span.brand-app', t('appName'))),
    h('nav', links.map(([href, label]) => h('a', { href, class: here === href || (href !== '#/' && here.startsWith(href)) ? 'on' : '' }, label))),
    h('div.top-tools',
      h('button.lang', { type: 'button', onclick: () => { setLang(getLang() === 'en' ? 'zh' : 'en'); app.views.clear(); render(); } },
        getLang() === 'en' ? '中文' : 'EN'),
      app.store.demo ? null : h('button.link', { type: 'button', onclick: async () => { await app.store.signOut(); location.reload(); } }, t('signOut'))));
}

export function render() {
  const root = document.getElementById('app');
  root.replaceChildren();
  if (!app.data) return;
  root.append(header());
  if (app.store.demo) root.append(h('div.demo-banner', t('demoBanner')));
  const m = h('main#main');
  root.append(m);
  const [, rawRoute, a, b] = (location.hash || '#/').split('/');
  const route = (rawRoute || '').split('?')[0];
  try {
    if (!route) m.append(homeView(app));
    else if (route === 'students') m.append(studentsView(app));
    else if (route === 's' && app.student(a)) m.append(studentPage(app, a, b || 'overview'));
    else if (route === 'log') m.append(logView(app, a, b));
    else if (route === 'class') m.append(classView(app));
    else if (route === 'bank') m.append(bankView(app, a));
    else if (route === 'settings') m.append(settingsView(app));
    else m.append(homeView(app));
  } catch (e) {
    console.error(e);
    m.append(h('p.error', e.message));
  }
  window.scrollTo?.(0, 0);
}

function loginView() {
  const email = h('input', { type: 'email', autocomplete: 'username', required: true });
  const password = h('input', { type: 'password', autocomplete: 'current-password', required: true });
  const msg = h('p.muted');
  const form = h('form.login', {
    onsubmit: async (e) => {
      e.preventDefault();
      msg.textContent = t('loading');
      try { await app.store.signIn(email.value, password.value); await start(); } catch (err) { msg.textContent = err.message; }
    },
  },
  h('img.login-logo', { src: 'assets/lockup-stacked-navy-transparent.svg', alt: 'Kairos｜DSE 經濟' }),
  h('h1', t('appName')),
  h('label.field', h('span.label', t('email')), email),
  h('label.field', h('span.label', t('password')), password),
  h('button.primary', { type: 'submit' }, t('signIn')),
  h('button.link', { type: 'button', onclick: async () => {
    if (!email.value) { email.focus(); return; }
    try { await app.store.resetPassword(email.value); msg.textContent = t('resetSent'); } catch (err) { msg.textContent = err.message; }
  } }, t('forgot')),
  msg);
  document.getElementById('app').replaceChildren(h('div.login-wrap', form));
}

async function start() {
  document.getElementById('app').replaceChildren(h('p.loading', t('loading')));
  const [bank] = await Promise.all([fetch('data/bank.json').then((r) => r.json())]);
  app.index = indexBank(bank);
  await app.reload();
}

async function boot() {
  initLang('en');
  if (isDemo) {
    const { demoSeed } = await import('./demo.js');
    const bank = await fetch('data/bank.json').then((r) => r.json());
    app.store = demoStore(demoSeed(indexBank(bank)));
  } else {
    app.store = supabaseStore();
  }
  window.addEventListener('hashchange', render);
  if (await app.store.session()) await start();
  else loginView();
}

boot().catch((e) => {
  console.error(e);
  document.getElementById('app').replaceChildren(h('p.error', e.message));
});

export { today, fmtDate };
