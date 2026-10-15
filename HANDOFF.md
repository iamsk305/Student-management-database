# Handoff — Kairos Student Tracker (as of 15 Oct 2026)

Read this first in a new chat, then README.md.

## Where things are
- Live app: https://iamsk305.github.io/Student-management-database/ (repo iamsk305/Student-management-database, auto-publishes `app/` on every push to main)
- Code: this folder (`student-tracker/`). Tests: `./run_tests.sh`
- Database: Supabase project `rinrnnpygkocuygwfqqr` (schema in `supabase/schema.sql`, already installed; public sign-up is off)
- Question banks (Word, master copy): `/Users/sk305/Desktop/Economic Resources/PP by-topic question Bank/`
  - MC banks fixed 14 Oct (backup in `_backup_before_fix_2026-10-14`); Elective 1/2 LQ booklets added
  - After editing a booklet: `python3 tools/build_bank.py "/Users/sk305/Desktop/Economic Resources"`, then commit + push
- Spec doc: https://claude.ai/code/artifact/440047fb-bf6f-46a9-ab3b-b44d8886803a

## Decisions made
- Only Lawrence uses the app. Family links are switched OFF (code kept; `FAMILY_LINKS = false`). Parents get a **PDF report** instead (student page → ⤓ Report).
- Full paper % = 30% P1 + 70% P2; predicted level from timed full papers only, using Lawrence's cut-off table.
- Haywood 2022 recorded as P1 40/44, P2 65/120 (as on the script).
- Mistake reasons are editable in Settings; added "Definition not memorised", "Left blank" and (15 Oct, another session) "Careless mistake"; "Misapplied" retired.
- 15 Oct (another session): old "not in topic bank" lines on saved attempts are split back into the tagged Paper 2 parts.
- 15 Oct (another session): school predicted grades shown as "L3" like the app's own. Syllabus map tab is now three cards: taught in my lessons / taught at school (ticked by hand, `students.school_subs`) / past-paper performance (weakest five on top). School-taught topics count as taught for next practice. Both "taught" cards are editable (Edit → tick, with Tick all / Untick all); "Taught in my lessons" follows lesson records until edited (`students.my_subs`), then later lessons add to it. All F6 students existing on 15 Oct marked as taught everything on both cards (via `supabase/f6-taught-all.sql`).
- Paper 2 questions missing from the topic booklets were tagged by Claude (list `EXTRA` in `tools/build_bank.py`); every year's P2 is now fully covered.

## Not yet confirmed by Lawrence
- [ ] Created the login user in Supabase and ran `supabase/seed-my-students.sql` (6 students + Haywood's paper)
- [ ] Ran `supabase/family-links-off.sql`
- [ ] Set Supabase Authentication → URL Configuration → Site URL to the live app link
- [ ] Ran `supabase/f6-taught-all.sql` in the SQL Editor (adds the taught lists; marks current F6 students as taught everything)
- [ ] Logged one real paper on the live site to check the latest changes

## Open items
- Lawrence started describing a problem when **editing a student's PP record**, but the message cut off. Ask what went wrong.
- Lawrence said there are more improvements to come — ask for the list.
- Roadmap (later): trial → enrol pipeline, schedule & attendance, materials issued, parent contact log, billing merge from Finance-Tracker-v2.xlsx.
