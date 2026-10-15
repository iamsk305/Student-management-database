-- 15 Oct 2026, one-off: the syllabus map's two "taught" lists, and every current F6 student marked as having
-- learnt the whole syllabus (in lessons and at school). Students added later are not touched.
-- Paste into Supabase → SQL Editor → Run. Running it again does nothing new.
alter table students add column if not exists school_subs text[] not null default '{}';
alter table students add column if not exists my_subs text[];

update students
set my_subs = array['A.1', 'A.2', 'A.3', 'A.4', 'A.5', 'A.6', 'A.7', 'A.8', 'B.1', 'B.2', 'B.3', 'B.4', 'B.5', 'B.6', 'B.7', 'B.8', 'B.9', 'B.10', 'B.11', 'B.12', 'C.1', 'C.2', 'C.3', 'C.4', 'C.5', 'C.6', 'C.7', 'C.8', 'C.9', 'D.1', 'E.1', 'E.2', 'E.3', 'F.1', 'F.2', 'G.1', 'G.2', 'G.3', 'G.4', 'H.1', 'H.2', 'H.3', 'H.4', 'H.5', 'I.1', 'I.2', 'I.3', 'I.4', 'I.5', 'I.6', 'I.7', 'I.8', 'J.1', 'J.2', 'J.3', 'J.4', 'E1.1', 'E1.2', 'E1.3', 'E2.1', 'E2.2'],
    school_subs = array['A.1', 'A.2', 'A.3', 'A.4', 'A.5', 'A.6', 'A.7', 'A.8', 'B.1', 'B.2', 'B.3', 'B.4', 'B.5', 'B.6', 'B.7', 'B.8', 'B.9', 'B.10', 'B.11', 'B.12', 'C.1', 'C.2', 'C.3', 'C.4', 'C.5', 'C.6', 'C.7', 'C.8', 'C.9', 'D.1', 'E.1', 'E.2', 'E.3', 'F.1', 'F.2', 'G.1', 'G.2', 'G.3', 'G.4', 'H.1', 'H.2', 'H.3', 'H.4', 'H.5', 'I.1', 'I.2', 'I.3', 'I.4', 'I.5', 'I.6', 'I.7', 'I.8', 'J.1', 'J.2', 'J.3', 'J.4', 'E1.1', 'E1.2', 'E1.3', 'E2.1', 'E2.2']
where form = 'F6' and created_at < '2026-10-16 00:00+08';

select name, form, cardinality(my_subs) as taught_by_me, cardinality(school_subs) as taught_at_school
from students order by form, name;
