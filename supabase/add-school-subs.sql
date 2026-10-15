-- 15 Oct 2026: lets the syllabus map remember what each student's school has taught.
-- Paste into Supabase → SQL Editor → Run. Safe to run more than once.
alter table students add column if not exists school_subs text[] not null default '{}';
