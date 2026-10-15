-- Kairos Student Tracker — database schema.
-- Run once in Supabase: Dashboard → SQL Editor → New query → paste this whole file → Run.
-- Safe to re-run: it only creates what is missing and replaces the functions/policies.

create extension if not exists pgcrypto;

-- Every row belongs to the tutor who created it (tutor_id = their login). Hired tutors later get their own rows.

create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  tutor_id uuid not null default auth.uid() references auth.users on delete cascade,
  name text not null,
  form text,                       -- F1 … F6
  dse_year int,
  school text,
  elective text check (elective in ('E1', 'E2')),
  language text check (language in ('en', 'zh')),
  status text not null default 'Active' check (status in ('Active', 'Paused', 'Left', 'Trial', 'Drop-in')),
  source text,
  parent_name text,
  parent_phone text,
  notes text,
  school_subs text[] not null default '{}',  -- sub-topics the school has taught (ticked on the syllabus map)
  my_subs text[],                  -- sub-topics Lawrence has taught, once edited by hand (null = follow lesson records)
  family_token text unique not null default replace(replace(replace(encode(gen_random_bytes(24), 'base64'), '+', '-'), '/', '_'), '=', ''),
  -- billing fields: empty until Finance-Tracker-v2 merges in
  format text, rate_basis text, rate numeric, lesson_hours numeric,
  created_at timestamptz not null default now()
);
-- added 15 Oct 2026; for databases made before then
alter table students add column if not exists school_subs text[] not null default '{}';
alter table students add column if not exists my_subs text[];

create table if not exists attempts (
  id uuid primary key default gen_random_uuid(),
  tutor_id uuid not null default auth.uid() references auth.users on delete cascade,
  student_id uuid not null references students on delete cascade,
  date date not null default current_date,
  year int,                        -- paper year; null for a mixed-year question set
  paper text not null check (paper in ('FULL', 'P1', 'P2')),
  scope text not null check (scope in ('full', 'questions', 'score')),
  timed boolean not null default false,
  elective text check (elective in ('E1', 'E2')),
  p1_score numeric, p1_max numeric,  -- only for score-only entries (history)
  p2_score numeric, p2_max numeric,
  comment text,                    -- shown to the family
  private_note text,               -- never leaves the admin app
  created_at timestamptz not null default now()
);
create index if not exists attempts_student on attempts (student_id, date desc);

create table if not exists responses (
  id uuid primary key default gen_random_uuid(),
  tutor_id uuid not null default auth.uid() references auth.users on delete cascade,
  attempt_id uuid not null references attempts on delete cascade,
  qid text not null,               -- bank id: '2019-P1-29' or '2022-Q10(a)'
  choice text check (choice in ('A', 'B', 'C', 'D')),
  mark numeric,
  mistakes text[] not null default '{}',
  unique (attempt_id, qid)
);

create table if not exists mastery_overrides (
  student_id uuid not null references students on delete cascade,
  sub text not null,
  tutor_id uuid not null default auth.uid() references auth.users on delete cascade,
  state text not null check (state in ('untaught', 'thin', 'red', 'amber', 'green')),
  updated_at timestamptz not null default now(),
  primary key (student_id, sub)
);

create table if not exists lessons (
  id uuid primary key default gen_random_uuid(),
  tutor_id uuid not null default auth.uid() references auth.users on delete cascade,
  student_id uuid not null references students on delete cascade,
  date date not null default current_date,
  minutes int,
  subs text[] not null default '{}',
  note text
);

create table if not exists homework (
  id uuid primary key default gen_random_uuid(),
  tutor_id uuid not null default auth.uid() references auth.users on delete cascade,
  student_id uuid not null references students on delete cascade,
  set_date date not null default current_date,
  due_date date,
  title text not null,
  qids text[] not null default '{}',
  status text not null default 'set' check (status in ('set', 'on_time', 'late', 'missing')),
  attempt_id uuid references attempts on delete set null
);

create table if not exists school_results (
  id uuid primary key default gen_random_uuid(),
  tutor_id uuid not null default auth.uid() references auth.users on delete cascade,
  student_id uuid not null references students on delete cascade,
  date date,
  exam text not null,
  mark numeric, max numeric,
  predicted_grade text,
  note text
);

create table if not exists settings (
  tutor_id uuid primary key default auth.uid() references auth.users on delete cascade,
  data jsonb not null default '{}'
);

-- Row-level security: a tutor sees and edits only their own rows. Nobody else (including families) can touch the tables.
do $$
declare t text;
begin
  foreach t in array array['students', 'attempts', 'responses', 'mastery_overrides', 'lessons', 'homework', 'school_results', 'settings'] loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists own_rows on %I', t);
    execute format('create policy own_rows on %I for all to authenticated using (tutor_id = auth.uid()) with check (tutor_id = auth.uid())', t);
    execute format('revoke all on %I from anon', t);
  end loop;
end $$;

-- The family page: one private link token in, one student's progress out. No contacts, no private notes,
-- no other students. Runs with owner rights so it can read past RLS, but only ever for the matching token.
create or replace function family_view(p_token text)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'student', jsonb_build_object('name', s.name, 'form', s.form, 'dse_year', s.dse_year, 'elective', s.elective, 'language', s.language),
    'attempts', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id, 'date', a.date, 'year', a.year, 'paper', a.paper, 'scope', a.scope, 'timed', a.timed,
        'elective', a.elective, 'p1_score', a.p1_score, 'p1_max', a.p1_max, 'p2_score', a.p2_score, 'p2_max', a.p2_max,
        'comment', a.comment,
        'responses', coalesce((select jsonb_agg(jsonb_build_object('qid', r.qid, 'choice', r.choice, 'mark', r.mark, 'mistakes', r.mistakes))
                               from responses r where r.attempt_id = a.id), '[]'::jsonb))
        order by a.date desc)
      from attempts a where a.student_id = s.id), '[]'::jsonb),
    'overrides', coalesce((select jsonb_object_agg(o.sub, o.state) from mastery_overrides o where o.student_id = s.id), '{}'::jsonb),
    'taught', coalesce((select jsonb_agg(distinct x) from lessons l, unnest(l.subs) x where l.student_id = s.id), '[]'::jsonb),
    'school', coalesce((select jsonb_agg(jsonb_build_object('date', r.date, 'exam', r.exam, 'mark', r.mark, 'max', r.max,
                                                            'predicted_grade', r.predicted_grade) order by r.date)
                        from school_results r where r.student_id = s.id), '[]'::jsonb),
    'settings', coalesce((select st.data from settings st where st.tutor_id = s.tutor_id), '{}'::jsonb)
  )
  from students s
  where s.family_token = p_token and length(p_token) >= 24 and s.status <> 'Left';
$$;

revoke all on function family_view(text) from public;
grant execute on function family_view(text) to anon, authenticated;
