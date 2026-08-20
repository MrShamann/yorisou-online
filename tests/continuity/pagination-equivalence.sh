#!/usr/bin/env bash
# ARCH-P6 §12 — run the equivalence proof on the OSF-1 timeline stack.
#
# Reuses tests/life-os/timeline-pagination.sh verbatim rather than standing up a second copy of
# PostgreSQL + PostgREST + the prefix proxy. That harness already builds exactly the stack this
# needs — the full migration lineage, hosted-parity grants, and a fixture with a deliberate
# cross-kind tie cluster — and it takes the runner as a parameter, so the only thing that differs
# here is which runner walks it and that the projection path is declared ready.
set -euo pipefail
cd "$(dirname "$0")/../.."
export YORISOU_CONTINUITY_SCHEMA_READY=true
OSF1_TL_RUNNER="tests/continuity/pagination-equivalence.ts" \
OSF1_TL_EXTRA_SQL="grant insert, update, delete on public.yorisou_experience_cards, public.yorisou_goals, public.yorisou_current_state_records, public.yorisou_life_reflections to service_role;" \
OSF1_TL_PG_PORT="${CNT1_EQ_PG_PORT:-55631}" \
OSF1_TL_REST_PORT="${CNT1_EQ_REST_PORT:-55632}" \
OSF1_TL_PROXY_PORT="${CNT1_EQ_PROXY_PORT:-55633}" \
OSF1_TL_WORK="${CNT1_EQ_WORK:-/tmp/cnt1-equivalence}" \
  bash tests/life-os/timeline-pagination.sh
