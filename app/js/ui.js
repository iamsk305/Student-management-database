// Tiny DOM helpers + the two shared visuals (score trend, syllabus map).
import { t, subName, getLang } from './i18n.js';
import { levelName, levelValue, withDefaults, masteryState } from './logic.js';

/** h('div.card', {onclick}, child, ...) — tag with optional .classes, attributes/props, children. */
export function h(sel, attrs, ...kids) {
  const [tagId, ...cls] = sel.split('.');
  const [tag, id] = tagId.split('#');
  const el = document.createElement(tag || 'div');
  if (id) el.id = id;
  if (cls.length) el.className = cls.join(' ');
  if (attrs && (typeof attrs !== 'object' || attrs instanceof Node || Array.isArray(attrs))) { kids.unshift(attrs); attrs = null; }
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else if (k === 'value' || (k in el && k !== 'list' && typeof v !== 'string')) el[k] = v;
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const k of kids.flat(Infinity)) if (k != null && k !== false) el.append(k instanceof Node ? k : String(k));
  return el;
}

export const fmtDate = (d) => (d ? new Date(d + (d.length === 10 ? 'T00:00' : '')).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '');
export const today = () => new Date().toLocaleDateString('en-CA');
export const pct = (v, dp = 0) => (v == null ? '—' : `${v.toFixed(dp)}%`);

export function toast(msg, kind = '') {
  const el = h(`div.toast.${kind}`, msg);
  document.body.append(el);
  setTimeout(() => el.classList.add('show'));
  setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 300); }, 2600);
}

/** Modal dialog; resolves with the value passed to close(), or undefined on cancel. */
export function modal(title, build) {
  return new Promise((resolve) => {
    const dlg = h('dialog.modal');
    const close = (v) => { dlg.close(); dlg.remove(); resolve(v); };
    dlg.append(h('div.modal-head', h('h3', title), h('button.icon', { type: 'button', 'aria-label': t('close'), onclick: () => close() }, '×')),
      build(close));
    dlg.addEventListener('cancel', (e) => { e.preventDefault(); close(); });
    document.body.append(dlg);
    dlg.showModal();
  });
}

export function field(label, input, hint) {
  return h('label.field', h('span.label', label), input, hint ? h('span.hint', hint) : null);
}

export function select(options, value, attrs = {}) {
  return h('select', attrs, options.map(([v, l]) => h('option', { value: v, selected: String(v) === String(value ?? '') }, l)));
}

/** A grade as the app shows it everywhere: "L3", "L5**", or "—". Accepts "3" or an already-prefixed "L3". */
export function gradeLabel(g) {
  return g == null || g === '' ? '—' : `L${String(g).replace(/^L/i, '')}`;
}

// ---------- mistakes ----------

/** Bars for where marks are lost: active types in list order, plus any older tag that still has marks. */
export function mistakeBars(split, types) {
  const label = (k) => { const m = types.find((x) => x.key === k); return m ? (m[getLang()] || m.en) : k; };
  const keys = [...types.filter((m) => !m.hidden).map((m) => m.key),
    ...Object.keys(split.share).filter((k) => split.share[k] > 0 && !types.some((m) => m.key === k && !m.hidden))];
  return h('div.bars', [...new Set(keys)].map((k) => h('div.bar-row',
    h('span', label(k)), h('div.bar', h('i', { style: { width: `${100 * (split.share[k] || 0)}%` } })), h('b', pct(100 * (split.share[k] || 0))))));
}

// ---------- score trend ----------

/**
 * SVG line of attempt % over time. Full papers are solid dots, sections/sets hollow.
 * Faint bands mark the level cut-offs of the newest paper year shown.
 */
export function trendChart(points, settings) {
  const s = withDefaults(settings);
  const NS = 'http://www.w3.org/2000/svg';
  const W = 860, H = 260, L = 44, R = 40, T = 14, B = 28;
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('class', 'trend');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', t('trend'));
  const el = (tag, attrs, text) => {
    const e = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
    if (text != null) e.textContent = text;
    svg.append(e);
    return e;
  };
  const data = points.filter((p) => p.pct != null).sort((a, b) => (a.date < b.date ? -1 : 1));
  if (!data.length) return h('p.muted', t('noAttempts'));
  const t0 = Date.parse(data[0].date), t1 = Date.parse(data.at(-1).date);
  const span = Math.max(t1 - t0, 86400000 * 14);
  const X = (d) => L + (W - L - R) * (data.length === 1 ? 0.5 : (Date.parse(d) - t0) / span);
  const Y = (v) => T + (H - T - B) * (1 - v / 100);

  const year = Math.max(...data.map((p) => p.year || 0)) || Math.max(...Object.keys(s.cutoffs).map(Number));
  const cut = s.cutoffs[year];
  if (cut) {
    let lastY = Infinity;
    ['2', '3', '4', '5', '5*', '5**'].forEach((lv, i) => {
      const y = Y(cut[i]);
      el('line', { x1: L, x2: W - R, y1: y, y2: y, class: 'cut' });
      if (lastY - y >= 12) { el('text', { x: W - R + 6, y: y + 4, class: 'cut-label' }, `L${lv}`); lastY = y; }
    });
  }
  for (const v of [0, 50, 100]) el('text', { x: L - 6, y: Y(v) + 4, class: 'axis', 'text-anchor': 'end' }, `${v}%`);
  el('line', { x1: L, x2: W - R, y1: Y(0), y2: Y(0), class: 'base' });
  const fmt = (d) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  el('text', { x: X(data[0].date), y: H - 8, class: 'axis', 'text-anchor': data.length === 1 ? 'middle' : 'start' }, fmt(data[0].date));
  if (data.length > 1) el('text', { x: X(data.at(-1).date), y: H - 8, class: 'axis', 'text-anchor': 'end' }, fmt(data.at(-1).date));

  const full = data.filter((p) => p.full);
  if (full.length > 1) el('polyline', { points: full.map((p) => `${X(p.date)},${Y(p.pct)}`).join(' '), class: 'line' });
  for (const p of data) {
    const c = el('circle', { cx: X(p.date), cy: Y(p.pct), r: p.full ? 5 : 4, class: p.full ? 'dot full' : 'dot' });
    const lv = p.full ? ` · L${levelName(levelValue(p.pct, p.year, s.cutoffs))}` : '';
    const title = document.createElementNS(NS, 'title');
    title.textContent = `${p.label} — ${p.pct.toFixed(1)}%${lv}`;
    c.append(title);
  }
  return h('div.chart', svg, h('div.legend', h('span.k.full', t('fullPaper')), h('span.k', t('section'))));
}

// ---------- syllabus map ----------

export const STATES = ['untaught', 'thin', 'red', 'amber', 'green'];

/**
 * Topic rows of sub-topic chips coloured by mastery. onPick(sub, currentState) makes chips clickable.
 * hide = Set of topic codes to leave out (e.g. the elective the student doesn't take).
 */
/** Sub-topics grouped by topic row, one chip each. only(sub) picks which to show; topics with none are left out. */
export function subChips(index, { hide = new Set(), only = () => true, chip }) {
  const wrap = h('div.map');
  for (const topic of index.bank.topics) {
    const subs = hide.has(topic.code) ? [] : topic.subtopics.filter(only);
    if (subs.length) wrap.append(h('div.map-row', h('div.map-topic', h('b', topic.code), ' ', subName(topic)), h('div.map-chips', subs.map(chip))));
  }
  return wrap;
}

export function syllabusMap(index, masteryMap, taught, overrides, settings, { onPick, hide = new Set() } = {}) {
  const wrap = h('div.map');
  for (const topic of index.bank.topics) {
    if (hide.has(topic.code)) continue;
    const row = h('div.map-row', h('div.map-topic', h('b', topic.code), ' ', subName(topic)));
    const chips = h('div.map-chips');
    for (const sub of topic.subtopics) {
      const m = masteryMap.get(sub.id);
      const st = masteryState(sub.id, m, taught, overrides, settings);
      const label = `${sub.id} ${subName(sub)}`;
      const detail = [label, st.pct != null ? pct(st.pct) : null, m ? t('marksOf')(m.evidence) : null, st.manual ? t('setByTutor') : null]
        .filter(Boolean).join(' · ');
      chips.append(h(onPick ? 'button.chip' : 'span.chip', {
        class: `chip s-${st.state}${st.manual ? ' manual' : ''}`, title: detail, type: onPick ? 'button' : null,
        onclick: onPick ? () => onPick(sub, st) : null,
      }, h('span.chip-id', sub.id), h('span.chip-name', subName(sub)), st.pct != null && st.state !== 'untaught' ? h('span.chip-pct', pct(st.pct)) : null));
    }
    row.append(chips);
    wrap.append(row);
  }
  const legend = h('div.legend.map-legend', STATES.map((s) => h(`span.k.s-${s}`, t('mapLegend')[s])));
  return h('div', legend, wrap);
}
