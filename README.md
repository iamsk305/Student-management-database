# Kairos Student Tracker

Past-paper tracking for Kairos｜DSE 經濟: per-question logging, A–J syllabus map, predicted level, PDF progress reports.
Only Lawrence uses the app; parents get a PDF (student page → ⤓ Report → dates + language → share to WhatsApp).
Static web app (`app/`) on GitHub Pages + Supabase (database + login). No build step.

## Folders

| Path | What |
| --- | --- |
| `app/` | The website. `index.html` = the app, `family.html` = family page (switched off, see below) |
| `app/data/bank.json` | Question bank exported from the Word booklets — regenerate, don't edit |
| `supabase/schema.sql` | Database tables, security rules, family function. Safe to re-run |
| `supabase/add-school-subs.sql` | One-off (15 Oct 2026): adds “taught at school” to students. Run once in the SQL Editor |
| `supabase/seed-my-students.sql` | One-time import of current students (private — not committed) |
| `tools/build_bank.py` | Word booklets → `bank.json` |
| `tools/fix_mc_bank.py`, `build_elective.py` | The Oct 2026 MC fixes and elective booklets (kept for reference) |
| `data/` | Official MC keys, cut-off table |
| `tests/` | Logic, bank and database tests |

## Everyday

- **Changed a Word booklet?** `python3 tools/build_bank.py "/Users/sk305/Desktop/Economic Resources"` then publish `app/`.
  Needs `python-docx` (`pip3 install python-docx`).
- **Try it without touching real data:** open the app with `?demo` (e.g. `index.html?demo`) — sample students, nothing saved.
- **Run locally:** `python3 -m http.server 8765 --directory app` → http://localhost:8765

## Tests

`./run_tests.sh` — logic (JavaScriptCore, built into macOS), bank checks (Python), and the database schema
(needs a local PostgreSQL: `brew install postgresql@16`).

## How the numbers work

- **Full paper %** = 30% × P1% + 70% × P2%. P2 is out of 120 (104 in 2021–2023, when there was no elective section).
- **Predicted level** — timed full papers only; each paper is placed on its own year's cut-offs, newest three weighted 3 : 2 : 1.
- **Sub-topic mastery** — share of marks earned, older work counting less (half weight after 60 days). Under 6 marks of evidence shows as an outline.
- **"Not in topic bank"** — P2 marks on questions the by-topic booklets don't cover (mostly the final multi-topic question). They count toward the paper score but not the map.

## Family links (switched off)

The read-only family page is kept but off: `FAMILY_LINKS = false` in `app/js/config.js`, and
`supabase/family-links-off.sql` blocks it in the database. To bring it back, set `true` and run `family-links-on.sql`.

## Security

The publishable key in `app/js/config.js` is meant to be public. Every table has row-level security: only the logged-in tutor's
own rows are visible. Families never touch tables — `family_view(token)` returns one student's progress for a valid link
token and leaves out contacts and private notes.
