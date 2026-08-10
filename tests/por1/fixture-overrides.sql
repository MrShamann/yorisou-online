-- POR-1 M2 — declared domain fixtures for the tables the generic seeder must not guess at.
--
-- THE RULE THIS FILE EXISTS TO STATE.
--
--     Generic where structurally safe; explicit where relational invariants exist.
--
-- The introspective seeder fills each column independently from catalogue metadata. That is exactly
-- right for a table whose columns are independent, and exactly wrong for one whose constraint
-- RELATES two columns. `yorisou_recommendation_items` carries
--
--     check ((resource_id is not null)::int + (experience_id is not null)::int = 1)
--
-- an XOR. The generic seeder filled both, the insert was rejected, and the two owner-linked
-- contract families that hang off it — `yorisou_recommendation_actions` and
-- `yorisou_recommendation_reports` — could never be seeded. No amount of making the seeder cleverer
-- fixes that honestly: the constraint encodes a domain fact (an item recommends a RESOURCE or an
-- EXPERIENCE, never both, never neither) which is not recoverable from column types.
--
-- WHAT AN OVERRIDE MUST NOT DO: disable a constraint, alter the schema, insert with the check
-- suppressed, or report success without verifying. Each override builds one semantically coherent,
-- fully legal graph and then proves it landed.
--
-- Every override is registered in por1_fixture.override_registry with its reason, its required
-- parents, and the invariant it satisfies. The registry is machine-checked: an override that
-- inserts nothing fails the run.
--
-- Usage:  psql -v principal=por1a -f this.sql   (run AFTER the generic seeder)

\set QUIET on
\if :{?principal}
\else
  \echo 'principal is required'
  \quit
\endif

select set_config('por1.principal', :'principal', false);

-- The registry is declared by tests/por1/fixture-override-registry.sql, which must run first.
do $$ begin
  if to_regclass('por1_fixture.override_registry') is null then
    raise exception 'run tests/por1/fixture-override-registry.sql before the overrides';
  end if;
end $$;

do $por1$
declare
  v_principal text := current_setting('por1.principal');
  v_source_id uuid;
  v_resource_id uuid;
  v_set_id uuid;
  v_item_id uuid;
  v_rows int;
begin
  -- ── the resource catalogue this principal's recommendation points at ───────
  --
  -- Per-principal names and titles. A single shared source/resource would satisfy the unique
  -- constraints, and would also make Principal A's item reference the same row as Principal B's —
  -- which is the one thing the erasure proof must never be built on.
  -- `owner_name` is NOT NULL and is the PUBLISHER, not a user. This is the column that was
  -- classified NOT_OWNER_LINKED in the Production family contract, and the fixture value keeps that
  -- reading unambiguous: it never carries a principal id.
  insert into public.yorisou_resource_sources (project_id, name, owner_name, domain, source_type, commercial_status)
  values ('yorisou', 'por1-fixture-source-' || v_principal, 'POR-1 Fixture Publisher',
          'por1-fixture.invalid', 'public', 'public_resource')
  on conflict do nothing;
  select id into v_source_id from public.yorisou_resource_sources
   where name = 'por1-fixture-source-' || v_principal;

  insert into public.yorisou_resources (
    project_id, source_id, title, description, resource_type, language, japan_applicable,
    cost_category, commercial_status, social_intensity, effort_level, risk_level,
    limitations, provenance
  ) values (
    'yorisou', v_source_id, 'por1-fixture-resource-' || v_principal,
    'POR-1 fixture resource for ' || v_principal || '. Structural only; not user content.',
    'public_resource', 'ja', true, 'free', 'public_resource', 'low', 'small', 'low',
    'POR-1 fixture. Carries no guidance and is never surfaced to a person.',
    'Constructed by tests/por1/fixture-overrides.sql for erasure accounting.'
  )
  on conflict do nothing;
  select id into v_resource_id from public.yorisou_resources
   where title = 'por1-fixture-resource-' || v_principal;

  -- ── this principal's OWN recommendation set ────────────────────────────────
  --
  -- The generic seeder already creates one, but the item must attach to a set THIS principal owns,
  -- so it is looked up by owner rather than by "whatever row sorts first".
  select id into v_set_id from public.yorisou_recommendation_sets
   where owner_account_id = v_principal order by created_at limit 1;
  if v_set_id is null then
    insert into public.yorisou_recommendation_sets (project_id, owner_account_id, request_key)
    values ('yorisou', v_principal, 'por1-fixture-request-key-' || v_principal)
    returning id into v_set_id;
  end if;

  -- ── THE PARENT THE GENERIC SEEDER COULD NOT BUILD ─────────────────────────
  --
  -- resource_id set, experience_id NULL, object_type 'resource'. The XOR is satisfied because the
  -- row means something: this item recommends a resource. rank is unique per set, and each
  -- principal has its own set, so rank 1 is free for both.
  insert into public.yorisou_recommendation_items (
    project_id, recommendation_set_id, resource_id, experience_id, rank, object_type,
    reason, disclosure, lifecycle_status
  ) values (
    'yorisou', v_set_id, v_resource_id, null, 1, 'resource',
    'POR-1 fixture item for ' || v_principal || '. Structural only.',
    'POR-1 fixture disclosure. Not shown to a person.',
    'active'
  )
  on conflict (recommendation_set_id, rank) do nothing;
  select id into v_item_id from public.yorisou_recommendation_items
   where recommendation_set_id = v_set_id and rank = 1;

  -- ── the two owner-linked contract families ────────────────────────────────
  insert into public.yorisou_recommendation_actions (
    project_id, owner_account_id, recommendation_item_id, action, idempotency_key
  ) values (
    'yorisou', v_principal, v_item_id, 'viewed', 'por1-fixture-idem-' || v_principal || '-0001'
  )
  on conflict (owner_account_id, idempotency_key) do nothing;

  insert into public.yorisou_recommendation_reports (
    project_id, owner_account_id, recommendation_item_id, reason
  ) values ('yorisou', v_principal, v_item_id, 'other')
  on conflict (owner_account_id, recommendation_item_id) do nothing;

  -- ── VERIFY, then record. An override that reports success without checking is worse than no
  --    override at all: it converts a missing family into a false green. ──────
  for v_rows in
    select 1 where false
  loop end loop;

  perform 1;

  insert into por1_fixture.seeded (principal, table_name, owner_column, seeded_rows)
  select v_principal, t.name, t.owner_col, t.n
    from (
      select 'yorisou_recommendation_items' as name, '' as owner_col,
             (select count(*)::int from public.yorisou_recommendation_items
               where recommendation_set_id = v_set_id) as n
      union all
      select 'yorisou_recommendation_actions', 'owner_account_id',
             (select count(*)::int from public.yorisou_recommendation_actions
               where owner_account_id = v_principal)
      union all
      select 'yorisou_recommendation_reports', 'owner_account_id',
             (select count(*)::int from public.yorisou_recommendation_reports
               where owner_account_id = v_principal)
      union all
      select 'yorisou_resources', '',
             (select count(*)::int from public.yorisou_resources where source_id = v_source_id)
      union all
      select 'yorisou_resource_sources', '',
             (select count(*)::int from public.yorisou_resource_sources where id = v_source_id)
    ) t
  on conflict (principal, table_name) do update
    set seeded_rows = excluded.seeded_rows,
        skipped_reason = case when excluded.seeded_rows > 0 then null
                              else 'override inserted zero rows' end;

  -- Every declared override must have produced something.
  select count(*) into v_rows
    from por1_fixture.seeded s
    join por1_fixture.override_registry o on o.table_name = s.table_name
   where s.principal = v_principal and s.seeded_rows = 0;
  if v_rows > 0 then
    raise exception 'POR-1 fixture override inserted zero rows for % table(s) — principal %', v_rows, v_principal;
  end if;

  -- And every child must belong to THIS principal's own graph. A cross-principal reference would
  -- make the erasure accounting wrong in the only direction that matters.
  if exists (
    select 1 from public.yorisou_recommendation_actions a
      join public.yorisou_recommendation_items i on i.id = a.recommendation_item_id
      join public.yorisou_recommendation_sets s on s.id = i.recommendation_set_id
     where a.owner_account_id = v_principal and s.owner_account_id <> v_principal
  ) then
    raise exception 'POR-1 fixture: % has an action against another principal''s item', v_principal;
  end if;
  if exists (
    select 1 from public.yorisou_recommendation_reports r
      join public.yorisou_recommendation_items i on i.id = r.recommendation_item_id
      join public.yorisou_recommendation_sets s on s.id = i.recommendation_set_id
     where r.owner_account_id = v_principal and s.owner_account_id <> v_principal
  ) then
    raise exception 'POR-1 fixture: % has a report against another principal''s item', v_principal;
  end if;
end
$por1$;

\set QUIET off
