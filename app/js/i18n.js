// UI strings in English and Traditional Chinese (Cantonese register, Econ terms kept in English where natural).

const STRINGS = {
  en: {
    appName: 'Student Tracker', home: 'Home', students: 'Students', log: 'Log attempt', classView: 'Class', bank: 'Question bank',
    settings: 'Settings', signOut: 'Sign out', signIn: 'Sign in', email: 'Email', password: 'Password', forgot: 'Forgot password?',
    resetSent: 'Password reset email sent.', demoBanner: 'Demo mode — sample data, nothing is saved.',
    loading: 'Loading…', save: 'Save', saved: 'Saved', cancel: 'Cancel', delete: 'Delete', edit: 'Edit', add: 'Add', close: 'Close',
    confirmDelete: 'Delete this? This cannot be undone.', back: 'Back', none: 'None yet', optional: 'optional',
    // students
    addStudent: 'Add student', name: 'Name', form: 'Form', dseYear: 'DSE year', school: 'School', elective: 'Elective',
    electiveNone: 'Not chosen', language: 'Answers in', langEn: 'English', langZh: 'Chinese', status: 'Status', source: 'Source',
    parentName: 'Parent name', parentPhone: 'Parent WhatsApp', notes: 'Learning notes', lastAttempt: 'Last attempt',
    noAttempts: 'No attempts yet', predicted: 'Predicted level', schoolPredicted: 'School predicted', level: 'Level',
    basedOn: (n) => `from ${n} timed full paper${n === 1 ? '' : 's'}`, noPrediction: 'Needs a timed full paper',
    showLeft: 'Show students who left',
    // tabs
    overview: 'Overview', map: 'Syllabus map', attempts: 'PP record', lessons: 'Lessons', homework: 'Homework',
    schoolResults: 'School results', profile: 'Profile',
    // overview
    trend: 'Score trend', mistakes: 'Where marks are lost', nextPractice: 'Next practice', assign: 'Assign as homework',
    familyLink: 'Family link', copyLink: 'Copy link', resetLink: 'Reset link', linkCopied: 'Link copied',
    resetConfirm: 'Reset the family link? The old link stops working immediately.', whatsapp: 'WhatsApp parent',
    mistakeNone: 'No mistakes tagged yet.', fullPaper: 'Full paper', section: 'Section / set',
    // map
    mapLegend: { untaught: 'Not taught', thin: 'Taught, little evidence', red: 'Below 50%', amber: '50–69%', green: '70%+' },
    setByTutor: 'set by tutor', clearOverride: 'Back to automatic', marksOf: (e) => `${e} marks of evidence`,
    // log attempt
    student: 'Student', date: 'Date', paperYear: 'Paper', what: 'What was done', timed: 'Timed, exam conditions',
    whatFull: 'Full paper (P1 + P2)', whatP1: 'Paper 1 (MC) only', whatP2: 'Paper 2 (LQ) only',
    whatQuestions: 'Selected questions', whatScore: 'Score only (history)', p1Score: 'P1 score', p2Score: 'P2 score', outOf: 'out of',
    mcEntry: 'Paper 1 — tap the student’s answers', entered: 'entered', lqEntry: 'Paper 2 — marks per part', undo: 'Undo', clearAll: 'Clear',
    mistakeTypes: 'Why were marks lost?', comment: 'Comment for the family', privateNote: 'Private note (never shown)',
    pickSub: 'Add questions by sub-topic', pickItems: 'Questions in this set', saveAttempt: 'Save attempt',
    deleted: 'deleted', notInBank: 'not in topic bank', electiveQ: 'Elective', blankMeans: 'Blank = not answered (0)',
    missingStudentElective: 'Set this student’s elective on their profile to include Section C.',
    legacyOther: (m, max) => `This paper was logged before the last Paper 2 parts were tagged: they were saved as one line, ${m} / ${max}. Enter the highlighted parts below and save — the single line is then replaced. Leave them empty to keep ${m} / ${max}.`,
    // lessons & homework
    minutes: 'Minutes', covered: 'Sub-topics covered', note: 'Note', addLesson: 'Add lesson',
    title: 'What was set', due: 'Due', addHomework: 'Set homework', hwStatus: { set: 'Set', on_time: 'On time', late: 'Late', missing: 'Missing' },
    exam: 'Exam', mark: 'Mark', addResult: 'Add result', predictedGrade: 'Predicted grade',
    // home
    today: 'Today', dueSoon: 'Homework due or overdue', quiet: 'No attempt in 14+ days', allClear: 'Nothing here.',
    // class / bank / settings
    classHint: 'Active students × sub-topics. Tap a student to open them.', attemptedBy: 'Attempted', avgScore: 'Average',
    wrongPicks: 'Wrong answers chosen', cutoffs: 'Level cut-offs (% of full mark)', weights: 'Paper weights',
    bands: 'Map colours', red: 'Red below', green: 'Green from', minEvidence: 'Min. marks of evidence', halfLife: 'Half-life (days)',
    exportAll: 'Export everything (Excel)', exportHint: 'One file, one sheet per table. Keep it as your backup.',
    bankBuilt: (d) => `Question bank exported from the Word booklets on ${d}.`,
    mistake: { concept: 'Concept wrong', careless: 'Careless mistake', expression: 'Weak expression', diagram: 'Diagram error', incomplete: 'Incomplete / time' },
    // family page
    familyTitle: 'Progress report', familyIntro: 'Updated after every marked paper.', ppRecord: 'Past-paper record',
    mistakeTypesTitle: 'Reasons marks are lost', hide: 'Hide',
    mistakeTypesHint: 'Rename, add or hide reasons. Hidden reasons disappear from logging; old papers keep their tags.',
    report: 'Report', reportTitle: 'Progress report', reportPeriod: 'Period', from: 'From', to: 'To', makePdf: 'Create PDF',
    making: 'Creating PDF…', reportLang: 'Report language', papersInPeriod: 'Past papers in this period',
    noneInPeriod: 'No past papers logged in this period.', asOf: (d) => `as of ${d}`, preparedBy: 'Prepared by Lawrence · Kairos｜DSE 經濟',
    tutorComment: 'Tutor’s comment', linkInvalid: 'This page is not available.',
  },
  zh: {
    appName: '學生進度', home: '主頁', students: '學生', log: '記錄練習', classView: '全班', bank: '題庫',
    settings: '設定', signOut: '登出', signIn: '登入', email: '電郵', password: '密碼', forgot: '忘記密碼？',
    resetSent: '已寄出重設密碼電郵。', demoBanner: '示範模式 — 範例資料，不會儲存。',
    loading: '載入中…', save: '儲存', saved: '已儲存', cancel: '取消', delete: '刪除', edit: '修改', add: '新增', close: '關閉',
    confirmDelete: '確定刪除？刪除後不能復原。', back: '返回', none: '暫時未有', optional: '可選',
    addStudent: '新增學生', name: '姓名', form: '年級', dseYear: 'DSE 年份', school: '學校', elective: '選修',
    electiveNone: '未揀', language: '作答語言', langEn: '英文', langZh: '中文', status: '狀態', source: '來源',
    parentName: '家長稱呼', parentPhone: '家長 WhatsApp', notes: '學習備註', lastAttempt: '最近練習',
    noAttempts: '未有練習紀錄', predicted: '預計等級', schoolPredicted: '學校預測', level: 'Level',
    basedOn: (n) => `根據 ${n} 份限時全卷`, noPrediction: '需要一份限時全卷', showLeft: '顯示已離開的學生',
    overview: '總覽', map: '課程進度圖', attempts: '練習紀錄', lessons: '課堂', homework: '功課', schoolResults: '學校成績', profile: '資料',
    trend: '分數走勢', mistakes: '失分原因', nextPractice: '下一步練習', assign: '設為功課',
    familyLink: '家長連結', copyLink: '複製連結', resetLink: '重設連結', linkCopied: '已複製',
    resetConfirm: '重設家長連結？舊連結會即時失效。', whatsapp: 'WhatsApp 家長',
    mistakeNone: '未有標記失分原因。', fullPaper: '全卷', section: '部分 / 題目',
    mapLegend: { untaught: '未教', thin: '已教，數據未夠', red: '低於 50%', amber: '50–69%', green: '70% 或以上' },
    setByTutor: '導師設定', clearOverride: '改回自動', marksOf: (e) => `${e} 分數據`,
    student: '學生', date: '日期', paperYear: '試卷', what: '做咗咩', timed: '限時（考試模式）',
    whatFull: '全卷（P1 + P2）', whatP1: '只做 Paper 1（MC）', whatP2: '只做 Paper 2（LQ）',
    whatQuestions: '指定題目', whatScore: '只記總分（舊紀錄）', p1Score: 'P1 分數', p2Score: 'P2 分數', outOf: '滿分',
    mcEntry: 'Paper 1 — 逐題按學生答案', entered: '已入', lqEntry: 'Paper 2 — 逐部分入分', undo: '還原', clearAll: '清除',
    mistakeTypes: '點解失分？', comment: '俾家長嘅評語', privateNote: '私人備註（唔會顯示）',
    pickSub: '按課題加題目', pickItems: '今次練習嘅題目', saveAttempt: '儲存練習',
    deleted: '已刪除', notInBank: '題庫以外部分', electiveQ: '選修', blankMeans: '留空 = 冇答（0 分）',
    missingStudentElective: '請先喺學生資料揀選修，先可以計 Section C。',
    legacyOther: (m, max) => `呢份卷係喺 Paper 2 最後幾部分分題之前記錄嘅：嗰幾部分當時合埋一行，${m} / ${max}。請喺下面螢光嘅部分逐題入分再儲存，嗰一行就會被取代。全部留空就會保留 ${m} / ${max}。`,
    minutes: '分鐘', covered: '教咗嘅課題', note: '備註', addLesson: '新增課堂',
    title: '功課內容', due: '限期', addHomework: '新增功課', hwStatus: { set: '已派', on_time: '準時交', late: '遲交', missing: '欠交' },
    exam: '考試', mark: '分數', addResult: '新增成績', predictedGrade: '預測等級',
    today: '今日', dueSoon: '就到期 / 已過期功課', quiet: '超過 14 日未有練習', allClear: '冇嘢要跟。',
    classHint: '在讀學生 × 課題。撳學生名打開。', attemptedBy: '做過', avgScore: '平均',
    wrongPicks: '揀錯嘅答案', cutoffs: '等級分數線（佔滿分 %）', weights: '試卷比重',
    bands: '進度圖顏色', red: '紅色：低於', green: '綠色：由', minEvidence: '最少數據（分）', halfLife: '半衰期（日）',
    exportAll: '匯出全部資料（Excel）', exportHint: '一個檔案，每個表一頁。可以當備份。',
    bankBuilt: (d) => `題庫於 ${d} 由 Word 檔匯出。`,
    mistake: { concept: '概念錯', careless: '粗心', expression: '表達弱', diagram: '圖錯', incomplete: '未完成／夠鐘' },
    familyTitle: '學習進度報告', familyIntro: '每份改好嘅試卷都會即時更新。', ppRecord: '歷屆試題紀錄',
    mistakeTypesTitle: '失分原因', hide: '隱藏',
    mistakeTypesHint: '可以改名、新增或隱藏。隱藏咗嘅原因唔會再出現喺記錄頁，但舊紀錄會保留。',
    report: '報告', reportTitle: '學習進度報告', reportPeriod: '報告期間', from: '由', to: '至', makePdf: '製作 PDF',
    making: '製作中…', reportLang: '報告語言', papersInPeriod: '期間內完成嘅歷屆試題',
    noneInPeriod: '期間內未有歷屆試題紀錄。', asOf: (d) => `截至 ${d}`, preparedBy: '導師 Lawrence · Kairos｜DSE 經濟',
    tutorComment: '導師評語', linkInvalid: '此頁面暫不開放。',
  },
};

let KEY = 'kairos-lang';
let lang = 'en';

export const getLang = () => lang;
export function setLang(l) {
  lang = l;
  try { localStorage.setItem(KEY, l); } catch { /* ignore */ }
  document.documentElement.lang = l === 'zh' ? 'zh-HK' : 'en';
}
/** key: separate memory per page (the family page defaults to Chinese whatever the admin app last used). */
export function initLang(fallback, key = 'kairos-lang') {
  KEY = key;
  try { lang = localStorage.getItem(KEY) || fallback || lang; } catch { lang = fallback || lang; }
  document.documentElement.lang = lang === 'zh' ? 'zh-HK' : 'en';
}
/** Run fn with another language active, without touching the saved preference (used for PDF reports). */
export async function withLang(l, fn) {
  const before = lang;
  lang = l;
  try { return await fn(); } finally { lang = before; }
}
export const t = (key) => STRINGS[lang][key] ?? STRINGS.en[key] ?? key;
export const subName = (sub) => (sub ? sub[lang] || sub.en : '');
