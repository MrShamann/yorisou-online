-- CPV1-R1 §7/§8/§9 — schema hardening (additive, reversible, RLS-preserving).
--   §7 relation model on observations; §8 exact-object identity + data-rights
--   event types + deletion tombstone; §9 independent consent purposes + visibility.
-- LOCAL Supabase verification only — never production. Depends on 202607200002.
--
-- ROLLBACK CLASSIFICATION: LOCAL_DISPOSABLE_SCHEMA_ROLLBACK (structurally + data destructive).
--   Dropping these columns/constraints DESTROYS the data stored in them. It is safe
--   ONLY in an isolated disposable local/test database, and is NOT approved for any
--   persistent environment. No production migration is authorized; a persistent
--   environment would require a separately approved, data-preserving forward
--   correction. Rollback (disposable local DB only):
--   alter table public.yorisou_cpv1_observations
--     drop column if exists visibility, drop column if exists theme_key,
--     drop column if exists relation, drop column if exists corrected_relation,
--     drop column if exists result_id;
--   alter table public.yorisou_cpv1_method_consent
--     drop column if exists visibility, drop column if exists report_use,
--     drop column if exists public_share, drop column if exists archive_inclusion,
--     drop column if exists legacy_designation, drop column if exists legacy_recipients;
--   alter table public.yorisou_cpv1_history_events
--     drop column if exists object_kind, drop column if exists prior_version_confirmed;
--   alter table public.yorisou_cpv1_history_events drop constraint if exists yorisou_cpv1_hist_event_type_r1;
--   -- (restore the original event_type check from 202607200002 if fully reverting)

-- ── §7 — relation model on observations ─────────────────────────────────────
alter table public.yorisou_cpv1_observations
  add column if not exists result_id text,
  add column if not exists theme_key text,
  add column if not exists relation text not null default 'supports'
    check (relation in ('supports', 'opposes', 'unrelated', 'uncertain')),
  add column if not exists corrected_relation text
    check (corrected_relation is null or corrected_relation in ('supports', 'opposes', 'unrelated', 'uncertain')),
  -- §9 — independent visibility, separate from downstream-purpose grants.
  add column if not exists visibility text not null default 'private'
    check (visibility in ('private', 'shared', 'public_safe'));
-- permitted_downstream stays an independent array; document the R1 purpose set.
comment on column public.yorisou_cpv1_observations.permitted_downstream is
  'CPV1-R1 §9 independent purposes: report|companion|recommendation|community|public|archive|legacy. Membership is the only grant; no purpose implies another.';

-- ── §9 — independent consent purposes + visibility on method consent ─────────
alter table public.yorisou_cpv1_method_consent
  add column if not exists visibility text not null default 'private'
    check (visibility in ('private', 'shared', 'public_safe')),
  add column if not exists report_use boolean not null default false,
  add column if not exists public_share boolean not null default false,
  add column if not exists archive_inclusion boolean not null default false,
  add column if not exists legacy_designation boolean not null default false,
  add column if not exists legacy_recipients text[] not null default '{}';
-- (companion_use / recommendation_use / community_use already exist from 202607200002)

-- ── §8 — exact-object identity + data-rights events + tombstone ──────────────
alter table public.yorisou_cpv1_history_events
  add column if not exists object_kind text
    check (object_kind is null or object_kind in ('result', 'observation', 'action', 'permission', 'recipient')),
  add column if not exists prior_version_confirmed boolean not null default false;
comment on column public.yorisou_cpv1_history_events.object_ref is
  'CPV1-R1 §8 EXACT object identity (result/observation/action id) — never a method id. Confirmation targets this, not the method.';

-- Expand the event_type check to include the data-rights / audit events. The old
-- inline check from 202607200002 is a table constraint; add a superseding named
-- constraint that permits the full R1 set, then drop the original if present.
do $$
declare c_name text;
begin
  -- find + drop the original anonymous check constraint on event_type (if any)
  for c_name in
    select conname from pg_constraint
    where conrelid = 'public.yorisou_cpv1_history_events'::regclass and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%event_type%method_completed%'
  loop
    execute format('alter table public.yorisou_cpv1_history_events drop constraint %I', c_name);
  end loop;
end $$;

alter table public.yorisou_cpv1_history_events
  add constraint yorisou_cpv1_hist_event_type_r1 check (event_type in (
    'method_completed','result_created','user_confirmed','user_corrected','user_rejected',
    'reflection_recorded','action_saved','action_tried','action_completed','marked_helpful',
    'marked_not_helpful','hidden','not_for_me','companion_interaction','community_participation','recommendation_outcome',
    -- §8 data-rights / audit events:
    'user_forgot','user_deleted','user_exported','downstream_revoked','method_consent_changed',
    'companion_permission_changed','recommendation_permission_changed','community_permission_changed',
    'archive_permission_changed','legacy_designation_changed'
  ));

-- The append-only guard + RLS from 202607200002 remain in force on these tables.
