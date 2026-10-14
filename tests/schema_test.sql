-- Local check of supabase/schema.sql against a stand-in for Supabase's auth layer.
-- Run: psql -v ON_ERROR_STOP=1 -f tests/supabase_stub.sql -f supabase/schema.sql -f tests/schema_test.sql
\set QUIET on
insert into auth.users (id) values ('11111111-1111-1111-1111-111111111111'), ('22222222-2222-2222-2222-222222222222');

-- Tutor A creates a student, an attempt with a private note, a response, a lesson.
set role authenticated;
select set_config('request.jwt.claim.sub', '11111111-1111-1111-1111-111111111111', false);
insert into students (name, form, parent_phone, family_token) values ('Test Student', 'F6', '91234567', 'tok_aaaaaaaaaaaaaaaaaaaaaaaaaaaa');
insert into attempts (student_id, year, paper, scope, timed, comment, private_note)
  select id, 2022, 'FULL', 'full', true, 'Good progress', 'SECRET NOTE' from students;
insert into responses (attempt_id, qid, choice) select id, '2022-P1-1', 'D' from attempts;
insert into lessons (student_id, subs) select id, '{C.1,C.6}' from students;
insert into settings (data) values ('{"weights":{"p1":0.3,"p2":0.7}}');

do $$ begin
  assert (select count(*) from students) = 1, 'tutor A sees own student';
  assert (select tutor_id from students) = '11111111-1111-1111-1111-111111111111', 'tutor_id defaults to the login';
end $$;

-- Tutor B sees nothing of A's and cannot write into A's student.
select set_config('request.jwt.claim.sub', '22222222-2222-2222-2222-222222222222', false);
do $$ begin
  assert (select count(*) from students) = 0, 'tutor B sees no students';
  assert (select count(*) from attempts) = 0, 'tutor B sees no attempts';
  assert (select count(*) from responses) = 0, 'tutor B sees no responses';
end $$;
do $$ begin
  begin
    insert into students (name, tutor_id) values ('Spoof', '11111111-1111-1111-1111-111111111111');
    raise exception 'tutor B wrote a row owned by tutor A';
  exception when insufficient_privilege then null;
  end;
end $$;

-- A family (anon) cannot read tables, only the family function with the right token.
reset role;
set role anon;
do $$ begin
  begin
    perform 1 from students;
    raise exception 'anon could read students';
  exception when insufficient_privilege then null;
  end;
  assert family_view('wrong-token-wrong-token-wrong') is null, 'wrong token returns nothing';
  assert family_view('short') is null, 'short token rejected';
  assert (family_view('tok_aaaaaaaaaaaaaaaaaaaaaaaaaaaa')->'student'->>'name') = 'Test Student', 'right token works';
  assert (family_view('tok_aaaaaaaaaaaaaaaaaaaaaaaaaaaa')::text) not like '%SECRET NOTE%', 'private note never leaves';
  assert (family_view('tok_aaaaaaaaaaaaaaaaaaaaaaaaaaaa')::text) not like '%91234567%', 'parent phone never leaves';
  assert (family_view('tok_aaaaaaaaaaaaaaaaaaaaaaaaaaaa')->'attempts'->0->>'comment') = 'Good progress', 'comment is shown';
  assert jsonb_array_length(family_view('tok_aaaaaaaaaaaaaaaaaaaaaaaaaaaa')->'attempts'->0->'responses') = 1, 'responses included';
  assert jsonb_array_length(family_view('tok_aaaaaaaaaaaaaaaaaaaaaaaaaaaa')->'taught') = 2, 'taught sub-topics included';
  assert (family_view('tok_aaaaaaaaaaaaaaaaaaaaaaaaaaaa')->'settings'->'weights'->>'p1') = '0.3', 'tutor settings included';
end $$;

-- A student who has left drops off their family link; a reset token kills the old link.
reset role;
update students set status = 'Left';
set role anon;
do $$ begin assert family_view('tok_aaaaaaaaaaaaaaaaaaaaaaaaaaaa') is null, 'left students are hidden'; end $$;
reset role;
update students set status = 'Active', family_token = 'tok_bbbbbbbbbbbbbbbbbbbbbbbbbbbb';
set role anon;
do $$ begin assert family_view('tok_aaaaaaaaaaaaaaaaaaaaaaaaaaaa') is null, 'old token dead after reset'; end $$;

-- Deleting a student removes everything under it.
reset role;
delete from students;
do $$ begin
  assert (select count(*) from attempts) = 0 and (select count(*) from responses) = 0 and (select count(*) from lessons) = 0, 'cascade delete';
end $$;

\echo schema tests passed
