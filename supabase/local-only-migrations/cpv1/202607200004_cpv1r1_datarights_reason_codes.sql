-- CPV1-R1 Part-B 11A.2 — data-rights audit must not accept personal free text.
-- Schema alignment for lib/cpv1/history.ts recordDataRightsEvent(): every
-- data-rights / audit event MUST carry an enumerated reason_code, and its
-- safe_detail may only be one of the internally-generated fixed non-personal
-- messages (or null). No user / report / memory / relationship text can be stored
-- in a deletion / forget / revocation audit event.
--
-- ADDITIVE only. LOCAL Supabase verification only — never production. Depends on
-- 202607200002 (history table) + 202607200003 (R1 event-type constraint).
--
-- ROLLBACK CLASSIFICATION: LOCAL_DISPOSABLE_SCHEMA_ROLLBACK. Dropping the column /
-- constraint below removes the stored reason codes and the free-text restriction;
-- it is safe ONLY in an isolated disposable local/test database and destroys those
-- stored values. It is NOT approved for any persistent environment. No production
-- migration is authorized. A persistent-environment change would require a
-- separately approved, data-preserving forward correction.
--   Rollback (disposable local DB only):
--     alter table public.yorisou_cpv1_history_events drop constraint if exists yorisou_cpv1_hist_datarights_no_freetext;
--     alter table public.yorisou_cpv1_history_events drop column if exists reason_code;

-- Enumerated reason codes (mirror DataRightsReason in lib/cpv1/history.ts).
alter table public.yorisou_cpv1_history_events
  add column if not exists reason_code text
    check (reason_code is null or reason_code in (
      'user_requested', 'consent_withdrawn', 'retention_expired',
      'policy_enforced', 'export_fulfilled', 'downstream_revoked'
    ));

comment on column public.yorisou_cpv1_history_events.reason_code is
  'CPV1-R1 11A.2 enumerated data-rights reason. Audit detail is generated from this — never caller free text.';

-- For every data-rights / audit event type: a reason code is REQUIRED and
-- safe_detail may ONLY be one of the fixed non-personal messages (or null). This
-- makes personal free text unstorable in an audit event at the schema level.
alter table public.yorisou_cpv1_history_events
  add constraint yorisou_cpv1_hist_datarights_no_freetext check (
    event_type not in (
      'user_forgot', 'user_deleted', 'user_exported', 'downstream_revoked', 'method_consent_changed',
      'companion_permission_changed', 'recommendation_permission_changed', 'community_permission_changed',
      'archive_permission_changed', 'legacy_designation_changed'
    )
    or (
      reason_code is not null
      and (safe_detail is null or safe_detail in (
        'data-rights action performed at user request',
        'consent withdrawn by user',
        'retention window expired',
        'removed by data-retention policy',
        'user data export fulfilled',
        'downstream use revoked by user',
        'personal content deleted at user request'
      ))
    )
  );
