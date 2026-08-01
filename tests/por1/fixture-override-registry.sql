-- POR-1 M2 — the fixture override REGISTRY, declared once before any seeding runs.
--
-- Split out from the override itself so the GENERIC seeder can read it and skip these tables
-- entirely. Without that separation the two seeders raced: the generic pass, running for Principal B
-- after Principal A's override had created an item, happily attached B's recommendation action to
-- A's item. The cross-principal assertion caught it — but a fixture whose two halves can produce a
-- cross-owner reference at all is not a fixture worth trusting.
--
-- Each entry states why generic construction is unsafe, what must exist first, and the invariant the
-- override upholds. The rehearsal fails if any registered override inserts zero rows.

create schema if not exists por1_fixture;

create table if not exists por1_fixture.override_registry (
  table_name       text primary key,
  reason           text not null,
  required_parents text not null,
  invariant        text not null
);

insert into por1_fixture.override_registry (table_name, reason, required_parents, invariant) values
  ('yorisou_resource_sources',
   'unique(project_id, name) — one shared row would make both principals point at the same source',
   '(none)',
   'name is per-principal'),
  ('yorisou_resources',
   'unique(project_id, title); NOT NULL source_id; six independent enum columns',
   'yorisou_resource_sources',
   'title is per-principal; every enum value is drawn from its own CHECK list'),
  ('yorisou_recommendation_items',
   'CROSS-COLUMN check: exactly one of resource_id / experience_id may be set',
   'yorisou_recommendation_sets, yorisou_resources',
   '(resource_id is not null)::int + (experience_id is not null)::int = 1, and object_type agrees with which one'),
  ('yorisou_recommendation_actions',
   'owner-linked contract family; unique(owner_account_id, idempotency_key); key length 16..200',
   'yorisou_recommendation_items',
   'the action owner is the same principal that owns the item''s set'),
  ('yorisou_recommendation_reports',
   'owner-linked contract family; unique(owner_account_id, recommendation_item_id)',
   'yorisou_recommendation_items',
   'the report owner is the same principal that owns the item''s set')
on conflict (table_name) do update
  set reason = excluded.reason,
      required_parents = excluded.required_parents,
      invariant = excluded.invariant;

