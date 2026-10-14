// PDF progress report for one student and a date range.
// The report is laid out as A4-sized HTML pages (so Chinese text and the Kairos fonts render exactly as in the app),
// each page is captured with html2canvas and placed into a jsPDF document. Libraries load only when a report is made.
import { t, subName, withLang, getLang } from './i18n.js';
import { h, fmtDate, pct, today, modal, field, select, toast, trendChart, syllabusMap, mistakeBars } from './ui.js';
import { levelName, levelValue, itemLabel, mistakeSplit, withDefaults } from './logic.js';
import { studentView } from './model.js';

const PAGE_W = 794, PAGE_H = 1123, PAD = 48; // A4 at 96 dpi

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement('script');
    s.src = src; s.onload = resolve; s.onerror = () => reject(new Error(`Could not load ${src}`));
    document.head.append(s);
  });
}
async function libs() {
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
  return { html2canvas: window.html2canvas, jsPDF: window.jspdf.jsPDF };
}

/** The student's progress as it stood on `to`, plus what happened between `from` and `to`. */
export function reportData(app, studentId, from, to) {
  const d = app.data;
  const end = `${to}T23:59:59`;
  const attempts = d.attempts.filter((a) => a.student_id === studentId && a.date <= to);
  const ids = new Set(attempts.map((a) => a.id));
  const responses = d.responses.filter((r) => ids.has(r.attempt_id));
  const view = studentView(app.index, {
    student: app.student(studentId),
    attempts,
    responses,
    taughtSubs: d.lessons.filter((l) => l.student_id === studentId && l.date <= to).flatMap((l) => l.subs || []),
    overrides: Object.fromEntries(d.mastery_overrides.filter((o) => o.student_id === studentId).map((o) => [o.sub, o.state])),
    settings: d.settings,
    now: Date.parse(end),
  });
  const inPeriod = view.attempts.filter((a) => a.date >= from && a.date <= to);
  const periodIds = new Set(inPeriod.map((a) => a.id));
  const school = d.school_results.filter((r) => r.student_id === studentId && r.predicted_grade && (!r.date || r.date <= to))
    .sort((a, b) => (a.date < b.date ? 1 : -1))[0] || null;
  return {
    view,
    inPeriod,
    mistakes: mistakeSplit(app.index, responses.filter((r) => periodIds.has(r.attempt_id)), withDefaults(d.settings).mistakeTypes.map((m) => m.key)),
    school,
    from,
    to,
  };
}

/** Report sections as a list of blocks; long lists are split into one block per row so pages break cleanly. */
function blocks(app, rd) {
  const { view: v, inPeriod, mistakes, school } = rd;
  const s = v.student;
  const hide = new Set(['E1', 'E2'].filter((e) => s.elective && e !== s.elective));
  const out = [];

  out.push(h('div.r-head',
    h('img', { src: 'assets/lockup-horizontal-navy-transparent.svg', alt: 'Kairos｜DSE 經濟' }),
    h('div.r-title', h('h1', t('reportTitle')), h('p', `${fmtDate(rd.from)} – ${fmtDate(rd.to)}`))));
  out.push(h('div.r-student', h('h2', s.name), h('p.muted', [s.form, s.school, s.dse_year ? `DSE ${s.dse_year}` : null].filter(Boolean).join(' · '))));

  out.push(h('div.r-levels',
    h('div', h('span.label', t('predicted')), v.predicted ? h('div.big', `L${v.predicted.level}`) : h('div.big.muted', '—'),
      h('span.hint', v.predicted ? `${t('basedOn')(v.predicted.basedOn)} · ${t('asOf')(fmtDate(rd.to))}` : t('noPrediction'))),
    h('div', h('span.label', t('schoolPredicted')), h('div.big', school ? school.predicted_grade : '—'),
      h('span.hint', school ? `${school.exam} · ${fmtDate(school.date)}` : ''))));

  if (v.attempts.some((a) => a.pct != null)) out.push(h('section.r-sec', h('h3', t('trend')), trendChart(v.attempts, v.settings)));

  if (mistakes.total) {
    out.push(h('section.r-sec', h('h3', t('mistakes')),
      mistakeBars(mistakes, v.settings.mistakeTypes)));
  }

  if (v.next.length) {
    out.push(h('section.r-sec', h('h3', t('nextPractice')),
      v.next.map((n) => {
        const sub = app.index.subs.get(n.sub);
        return h('div.next', h('b', `${n.sub} ${subName(sub)}`), n.pct != null ? h('span.muted', ` ${pct(n.pct)}`) : null,
          h('div.next-items', n.items.map((i) => h('span.tag', itemLabel(i)))));
      })));
  }
  // the heading travels with the first paper so it is never stranded at the foot of a page
  const heading = h('h3.r-h', t('papersInPeriod'));
  if (!inPeriod.length) out.push(h('div', heading, h('p.muted', t('noneInPeriod'))));
  [...inPeriod].reverse().forEach((a, i) => {
    const lv = a.full ? levelName(levelValue(a.pct, a.year, v.settings.cutoffs)) : null;
    const card = h('div.r-paper',
      h('div.row.spread', h('b', a.label, a.timed ? ' ⏱' : ''), h('span.score', pct(a.pct, 1), lv ? h('span.level', ` L${lv}`) : null)),
      h('div.muted', fmtDate(a.date), a.p1 ? ` · P1 ${a.p1.earned}/${a.p1.max}` : '', a.p2 ? ` · P2 ${a.p2.earned}/${a.p2.max}` : ''),
      a.comment ? h('p.comment', h('span.label', t('tutorComment')), ' ', a.comment) : null);
    out.push(i === 0 ? h('div.stack', heading, card) : card);
  });

  out.push('pagebreak');
  out.push(h('section.r-sec', h('h3', `${t('map')} · ${t('asOf')(fmtDate(rd.to))}`),
    syllabusMap(app.index, v.mastery, v.taught, v.overrides, v.settings, { hide })));

  return out;
}

export function previewPages(app, studentId, from, to, lang, holder) {
  return withLang(lang, () => paginate(holder, blocks(app, reportData(app, studentId, from, to))));
}

/** Pack blocks into A4 pages inside an off-screen holder. Returns the page elements. */
function paginate(holder, items) {
  const pages = [];
  const footer = (n) => h('div.r-foot', h('span', t('preparedBy')), h('span', String(n)));
  let page, body;
  const newPage = () => {
    body = h('div.r-body');
    page = h('div.report-page', body);
    holder.append(page);
    pages.push(page);
  };
  newPage();
  const limit = PAGE_H - 2 * PAD - 28;
  for (const b of items) {
    if (b === 'pagebreak') { if (body.children.length) newPage(); continue; }
    body.append(b);
    if (body.offsetHeight > limit && body.children.length > 1) {
      b.remove();
      newPage();
      body.append(b);
    }
  }
  pages.forEach((p, i) => p.append(footer(i + 1)));
  return pages;
}

export async function makeReport(app, studentId, from, to, lang) {
  const { html2canvas, jsPDF } = await libs();
  const holder = h('div.report-holder');
  document.body.append(holder);
  try {
    const pages = await withLang(lang, async () => {
      const rd = reportData(app, studentId, from, to);
      return paginate(holder, blocks(app, rd));
    });
    await document.fonts?.ready;
    await Promise.all([...holder.querySelectorAll('img')].map((img) => (img.complete ? null : new Promise((r) => { img.onload = img.onerror = r; }))));
    const pdf = new jsPDF({ unit: 'pt', format: 'a4', compress: true });
    const W = pdf.internal.pageSize.getWidth(), H = pdf.internal.pageSize.getHeight();
    for (let i = 0; i < pages.length; i++) {
      const canvas = await html2canvas(pages[i], { scale: 2, backgroundColor: '#ffffff', useCORS: true, logging: false });
      if (i) pdf.addPage();
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, W, H);
    }
    const name = app.student(studentId).name.replace(/[^\w一-鿿 ()-]/g, '').trim();
    const file = `Kairos report - ${name} - ${to}.pdf`;
    return { blob: pdf.output('blob'), file };
  } finally {
    holder.remove();
  }
}

/** The dialog behind the Report button: dates + language, then share (phones) or download. */
export async function reportDialog(app, studentId) {
  const s = app.student(studentId);
  const monthAgo = new Date(Date.now() - 30 * 864e5).toLocaleDateString('en-CA');
  const opts = await modal(t('reportTitle'), (close) => {
    const from = h('input', { type: 'date', value: monthAgo });
    const to = h('input', { type: 'date', value: today() });
    const lang = select([['zh', '中文'], ['en', 'English']], s.language || getLang());
    return h('form.stack', { onsubmit: (e) => { e.preventDefault(); close({ from: from.value, to: to.value, lang: lang.value }); } },
      h('div.grid2', field(t('from'), from), field(t('to'), to)),
      field(t('reportLang'), lang),
      h('button.primary', { type: 'submit' }, t('makePdf')));
  });
  if (!opts) return;
  if (opts.from > opts.to) [opts.from, opts.to] = [opts.to, opts.from];
  toast(t('making'));
  try {
    const { blob, file } = await makeReport(app, studentId, opts.from, opts.to, opts.lang);
    const pdfFile = new File([blob], file, { type: 'application/pdf' });
    if (navigator.canShare?.({ files: [pdfFile] }) && matchMedia('(pointer: coarse)').matches) {
      await navigator.share({ files: [pdfFile], title: file }).catch(() => {});
    } else {
      const a = h('a', { href: URL.createObjectURL(blob), download: file });
      document.body.append(a);
      a.click();
      a.remove();
    }
  } catch (e) {
    toast(e.message || String(e), 'err');
  }
}
