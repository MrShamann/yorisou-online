-- POR-1 M2 — Principals C and D.
--
-- A and B are populated fixtures: rows that stand in for existing people so the promotion and the
-- erasure can be measured against something. C and D are different, and the difference is the point.
--
-- PRINCIPAL C IS DELIBERATELY ALMOST EMPTY.
--
-- C is the person who arrives AFTER the promotion and goes through the real product. Everything that
-- matters about C — the account, the session binding, the canonical identity link, the interpretation
-- consent, the claim — has to be produced by the real journey in M3, because the whole question is
-- whether the real journey produces them correctly. Pre-creating any of it would be fabricating the
-- evidence and then measuring it.
--
-- So this asserts C's ABSENCE rather than creating C. If a later run finds C already present, the
-- journey is being measured against something it did not build.
--
-- PRINCIPAL D IS A DELIBERATE DEAD END.
--
-- D is a deletion that failed terminally and can never be resumed: `failed_terminal`, no frozen
-- manifest, nothing destroyed yet, and still naming its owner. That combination is what makes D the
-- one shape eligible for terminal de-identification — a record that must stop naming someone without
-- ever claiming the deletion succeeded.
--
-- Every eligibility clause is satisfied here ON PURPOSE, so M4 can prove the transition accepts it,
-- and the negative controls in M4 can prove it refuses every neighbouring shape.
--
-- Usage:  psql -v ON_ERROR_STOP=1 -f tests/por1/principals-c-and-d.sql

\set QUIET on

create schema if not exists por1_fixture;

create table if not exists por1_fixture.principals (
  principal   text primary key,
  role        text not null,
  prepared_at timestamptz not null default now(),
  note        text not null
);

-- ─────────────────────────────────────────────────────────────────────────────
-- PRINCIPAL C — assert absence. Do not create.
-- ─────────────────────────────────────────────────────────────────────────────
do $por1$
declare
  r record;
  v_count int;
  v_found text[] := array[]::text[];
begin
  -- If any owner-linked family already names C, something fabricated it, and the M3 journey would be
  -- measuring its own fixture rather than the product.
  for r in
    select c.relname as table_name
      from pg_class c
      join pg_namespace n on n.oid = c.relnamespace
     where n.nspname = 'public' and c.relkind = 'r' and c.relname like 'yorisou%'
       and exists (
         select 1 from pg_attribute a
          where a.attrelid = c.oid and a.attnum > 0 and not a.attisdropped
            and a.attname = 'owner_account_id'
       )
     order by c.relname
  loop
    execute format('select count(*) from public.%I where owner_account_id = %L', r.table_name, 'por1c')
      into v_count;
    if v_count > 0 then
      v_found := v_found || r.table_name;
    end if;
  end loop;

  if array_length(v_found, 1) > 0 then
    raise exception 'POR-1: Principal C already has rows in % — the journey must create them, not the fixture',
      array_to_string(v_found, ', ');
  end if;

  insert into por1_fixture.principals (principal, role, note)
  values ('por1c', 'new-journey',
          'Absence asserted, nothing created. Account, session binding, canonical identity link, '
          'interpretation consent and claim must all be produced by the real M3 journey.')
  on conflict (principal) do update set prepared_at = now(), note = excluded.note;
end
$por1$;

-- ─────────────────────────────────────────────────────────────────────────────
-- PRINCIPAL D — the one shape terminal de-identification is allowed to touch.
-- ─────────────────────────────────────────────────────────────────────────────
do $por1$
declare
  v_job_id uuid;
  v_state text;
begin
  if to_regclass('public.yorisou_account_deletion_jobs') is null then
    raise exception 'POR-1: the deletion lifecycle is not promoted into this database yet';
  end if;

  delete from public.yorisou_account_deletion_jobs where owner_account_id = 'por1d';

  -- The eligibility clauses, each satisfied deliberately:
  --   state = failed_terminal          → terminal, not resumable, not completed
  --   owner_account_id is present      → it still names someone; that is the problem to solve
  --   irreversible_started_at is null  → NOTHING was destroyed, so minimising loses no audit trail
  --   execution_cursor is null         → the second, independent witness agrees nothing was crossed
  --   NO frozen manifest               → it cannot be resumed, so minimising is the only way forward
  --   no live executor claim           → nobody is driving it right now
  insert into public.yorisou_account_deletion_jobs (
    owner_account_id, owner_fingerprint, state, execution_cursor,
    irreversible_started_at, last_error_code
  ) values (
    'por1d',
    encode(digest('por1d-owner-fingerprint', 'sha256'), 'hex'),
    'failed_terminal',
    null,
    null,
    'account_deletion_manifest_missing'
  )
  returning id into v_job_id;

  -- Prove the fixture is what it claims rather than trusting the insert.
  select state into v_state from public.yorisou_account_deletion_jobs where id = v_job_id;
  if v_state is distinct from 'failed_terminal' then
    raise exception 'POR-1: Principal D is % , not failed_terminal', v_state;
  end if;
  if exists (select 1 from public.yorisou_account_deletion_manifests where job_id = v_job_id) then
    raise exception 'POR-1: Principal D must have NO frozen manifest — a manifest means it is resumable';
  end if;
  if (select irreversible_started_at from public.yorisou_account_deletion_jobs where id = v_job_id) is not null then
    raise exception 'POR-1: Principal D must be pre-irreversible';
  end if;
  if (select owner_account_id from public.yorisou_account_deletion_jobs where id = v_job_id) is null then
    raise exception 'POR-1: Principal D must still name its owner — that is what M4 removes';
  end if;
  if (select terminal_deidentified_at from public.yorisou_account_deletion_jobs where id = v_job_id) is not null then
    raise exception 'POR-1: Principal D must NOT be de-identified yet — that is the M4 proof, not the fixture';
  end if;

  insert into por1_fixture.principals (principal, role, note)
  values ('por1d', 'terminal-failed-deletion',
          'failed_terminal, owner named, no frozen manifest, pre-irreversible, no live claim. '
          'Eligible for terminal de-identification; M4 performs it, this fixture does not.')
  on conflict (principal) do update set prepared_at = now(), note = excluded.note;
end
$por1$;

\set QUIET off
select principal, role, note from por1_fixture.principals order by principal;
