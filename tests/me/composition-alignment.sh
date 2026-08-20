#!/usr/bin/env bash
# ARCH-P7 — run the Me composition proofs on the OSF-1 timeline stack.
#
# Reuses tests/life-os/timeline-pagination.sh rather than standing up a second PostgreSQL +
# PostgREST + proxy: that harness already builds the full migration lineage with hosted-parity
# grants and takes its runner as a parameter. What differs here is the runner, the extra seed for
# the parts the timeline fixture does not create (memory, values, a saved Imairo result), and the
# grants those need.
# PORTS ARE CLEAR OF 55610-55642 ON PURPOSE. The a11y steps in osf1-life-ci.yml occupy that
# range, and the PostgREST container binds with --network host, so one that has not finished
# tearing down still holds its port. This harness bound 55642 and failed in CI with
# `Network.Socket.bind: resource busy` while passing locally, which is the whole failure mode.
set -euo pipefail
cd "$(dirname "$0")/../.."
export YORISOU_CONTINUITY_SCHEMA_READY=true

read -r -d '' EXTRA_SQL <<'SQL' || true
grant insert, update, delete on
  public.yorisou_experience_cards,
  public.yorisou_goals,
  public.yorisou_current_state_records,
  public.yorisou_life_reflections,
  public.yorisou_explicit_memories,
  public.yorisou_values_assessments,
  public.yorisou_test_results
to service_role;
insert into public.yorisou_explicit_memories
  (owner_account_id, memory_type, content, source, confirmation_digest, user_confirmed, lifecycle_state)
values
  ('acct_tl','preference','おぼえておいてほしいこと','user_statement', encode(sha256(convert_to('m1','utf8')),'hex'), true, 'active'),
  ('acct_tl_other','preference','ほかの人の記憶','user_statement', encode(sha256(convert_to('m2','utf8')),'hex'), true, 'active');
insert into public.yorisou_values_assessments
  (owner_account_id, method_version, bank_version, scoring_version, result_schema_version,
   bank_content_hash, answers, result_id, confirmation, produced_at)
values
  ('acct_tl','v1','v1','v1','v1','hash','{}'::jsonb,'r-values','confirmed', now());
insert into public.yorisou_test_results
  (owner_account_id, test_id, test_version, scoring_version, result_id, result_title,
   public_summary, score_summary, answers)
values
  ('acct_tl','IMAIRO-120Q','v1.0','yorisou-rule-based-v1','res-1','いろ','summary','{}'::jsonb,'{}'::jsonb);
SQL

OSF1_TL_RUNNER="tests/me/composition-alignment.ts" \
OSF1_TL_EXTRA_SQL="$EXTRA_SQL" \
OSF1_TL_PG_PORT="${P7_PG_PORT:-55660}" \
OSF1_TL_REST_PORT="${P7_REST_PORT:-55661}" \
OSF1_TL_PROXY_PORT="${P7_PROXY_PORT:-55662}" \
OSF1_TL_WORK="${P7_WORK:-/tmp/p7-me-alignment}" \
  bash tests/life-os/timeline-pagination.sh
