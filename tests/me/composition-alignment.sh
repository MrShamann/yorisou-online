#!/usr/bin/env bash
# ARCH-P7 — run the Me composition alignment proof on the OSF-1 timeline stack.
set -euo pipefail
cd "$(dirname "$0")/../.."
export YORISOU_CONTINUITY_SCHEMA_READY=true
OSF1_TL_RUNNER="tests/me/composition-alignment.ts" \
OSF1_TL_EXTRA_SQL="grant insert, update, delete on public.yorisou_experience_cards, public.yorisou_goals, public.yorisou_current_state_records, public.yorisou_life_reflections to service_role;" \
OSF1_TL_PG_PORT="${P7_PG_PORT:-55641}" \
OSF1_TL_REST_PORT="${P7_REST_PORT:-55642}" \
OSF1_TL_PROXY_PORT="${P7_PROXY_PORT:-55643}" \
OSF1_TL_WORK="${P7_WORK:-/tmp/p7-me-alignment}" \
  bash tests/life-os/timeline-pagination.sh
