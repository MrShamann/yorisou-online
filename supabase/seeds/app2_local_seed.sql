-- APP-2 WS-D — deterministic LOCAL seed (test-only). Fixed UUIDs so runs are
-- reproducible. Apply against LOCAL Supabase only; never production. Safe to
-- re-run: uses on-conflict-do-nothing / stable keys.
--
--   psql "$LOCAL_DB_URL" -f supabase/seeds/app2_local_seed.sql
--
-- Cleanup (see docs/app2): truncate the eight yorisou_* app2 tables.

begin;

-- Two distinct accounts to exercise user isolation.
insert into public.yorisou_guest_migration_jobs
  (id, idempotency_key, account_id, guest_ref, provenance, status, saved_item_count)
values
  ('11111111-1111-1111-1111-111111111111', 'seed-idem-key-account-a', 'acct_alpha', 'guest_alpha', 'device_local', 'pending', 3),
  ('22222222-2222-2222-2222-222222222222', 'seed-idem-key-account-b', 'acct_beta',  'guest_beta',  'device_local', 'succeeded', 1)
on conflict (idempotency_key) do nothing;

insert into public.yorisou_guest_migration_events
  (job_id, account_id, event_type, to_status, detail)
values
  ('11111111-1111-1111-1111-111111111111', 'acct_alpha', 'created', 'pending', 'seed event')
on conflict do nothing;

insert into public.yorisou_adaptation_state
  (account_id, need, pace, last_result_family, saved_item_ids, tried_item_ids, hidden_item_ids)
values
  ('acct_alpha', 'organize-self', 'quick', 'imairo', '{grounding-reflection}', '{}', '{}'),
  ('acct_beta',  'find-fit',      'deep',  'relationship-fatigue', '{}', '{grounding-reflection}', '{}')
on conflict (account_id) do nothing;

insert into public.yorisou_service_feedback
  (account_id, item_id, signal)
values
  ('acct_alpha', 'grounding-reflection', 'useful'),
  ('acct_beta',  'work-rhythm-check',    'not_now')
on conflict do nothing;

insert into public.yorisou_service_incidents
  (incident_type, severity, status, safe_summary, occurrence_count)
values
  ('line_callback_failure', 'medium', 'open', 'signed-callback rejected (invalid_signature) — safe summary only', 2)
on conflict do nothing;

commit;
