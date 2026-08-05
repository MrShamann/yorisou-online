#!/usr/bin/env bash
# POR-1 — the FINAL promoted contract: the effective state after 101…111, not after 108.
#
# WHY THIS EXISTS SEPARATELY FROM THE GENERATED CONTRACT.
#
# `supabase/contracts/por1-promotion-contract.json` is the COMPILER's output. It is derived from the
# Preview catalogue and describes what 101…108 create, and the `--check` drift gate exists to prove
# the checked-in SQL still matches it. That contract is correct for what it covers, and it must not
# be hand-edited.
#
# But 109, 110 and 111 are hand-written overlays applied AFTER the generated set, and they change the
# end state on purpose:
#
#   111  drops  yorisou_account_deletion_erase_database(text)      — the weak, owner-only signature
#   111  drops  yorisou_account_deletion_erase_database(uuid,text)
#   110  replaces the body of yorisou_account_deletion_executor_claim(...)
#
# Verifying a database that has had all eleven applied against a contract that stops at eight
# therefore reports a missing function and a differing body — and both reports are correct about the
# comparison while being wrong about reality. That is the structural gap this closes: the promotion
# gate now has a contract that represents the state a promoted database actually ends in.
#
# HOW IT IS DERIVED (never hand-written).
#
# Two disposable PostgreSQL 17 clusters are built from repository SQL alone — one with the Production
# baseline only, one with the baseline plus 101…111 — and the delta between their catalogues is the
# promoted object set in its final form. Rebuilding must be byte-reproducible; `--check` fails on any
# drift.
#
# The clusters carry the Supabase-equivalent PLATFORM ROLES (`anon`, `authenticated`, `service_role`),
# because the promotion's grant blocks are role-conditional and would otherwise be skipped entirely.
#
# They deliberately do NOT install Supabase's default privileges. This contract records the end state
# established by the REPOSITORY MIGRATIONS, not by the platform: see the note in prepare() for what
# happens if you add them. Environment-level default-privilege behaviour is asserted where it belongs
# — by the assertions inside the migrations themselves (202608010108) and by Supabase-shaped
# rehearsals that install those defaults on purpose.
#
#   scripts/por1/build-final-contract.sh [--check]
#
# Local only. Both clusters are destroyed on exit.

set -euo pipefail

CHECK=0
[ "${1:-}" = "--check" ] && CHECK=1

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"
OUT="supabase/contracts/por1-final-promoted-contract.json"

PGBIN="${POR1_PG_BIN:-/opt/homebrew/opt/postgresql@17/bin}"
PORT="${POR1_FINAL_PORT:-55583}"
WORK="${POR1_FINAL_WORK:-/tmp/por1-final-contract}"
export LC_ALL=C PATH="$PGBIN:$PATH"

cleanup() { set +e; pg_ctl -D "$WORK/pg" stop -m immediate >/dev/null 2>&1; rm -rf "$WORK"; }
trap cleanup EXIT

[ "$("$PGBIN/postgres" --version | awk '{print $3}' | cut -d. -f1)" = "17" ] || {
  echo "refusing: Production runs PostgreSQL 17" >&2; exit 1; }

rm -rf "$WORK"; mkdir -p "$WORK/pg"
initdb -D "$WORK/pg" -U postgres -A trust --no-locale -E UTF8 >/dev/null 2>&1
pg_ctl -D "$WORK/pg" -o "-p $PORT -c unix_socket_directories=''" -l "$WORK/pg/log" start >/dev/null
sleep 1

prepare() {  # db
  local db="$1" dsn="postgres://postgres@localhost:$PORT/$1"
  createdb -h localhost -p "$PORT" -U postgres "$db"
  psql "$dsn" -q -X -v ON_ERROR_STOP=1 -c "
    create extension if not exists pgcrypto; create extension if not exists \"uuid-ossp\";
    do \$\$ begin create role service_role bypassrls nologin; exception when duplicate_object then null; end \$\$;
    do \$\$ begin create role anon nologin; exception when duplicate_object then null; end \$\$;
    do \$\$ begin create role authenticated nologin; exception when duplicate_object then null; end \$\$;
    grant usage on schema public to anon, authenticated, service_role;
  " >/dev/null
  # DELIBERATELY NO `alter default privileges … grant execute on functions`.
  #
  # Supabase does carry it, and that is a real property — it is exactly what defeated the
  # revoke-from-public in 202608010104. But it is a property of the ENVIRONMENT, not of the
  # migrations, and it is asserted where it belongs: inside 202608010108, which runs in whatever
  # environment the promotion is applied to.
  #
  # This contract describes what the MIGRATIONS establish. Deriving it with default privileges on
  # would bake five environment-granted helpers (yorisou_ct_eq, the two erasure predicates and the
  # two version-mutation triggers) into the contract as service_role-executable, and then no
  # repository gate could ever satisfy it: rehearse-promotion.sh and populated-lineage-rehearsal.sh
  # both create the platform roles WITHOUT default privileges. A contract that its own gates cannot
  # reproduce is not a contract. Same reasoning as the deliberate exclusion of `owner`.
}

baseline() {  # db — every non-POR-1 migration, i.e. what Production already has
  local dsn="postgres://postgres@localhost:$PORT/$1"
  for f in supabase/migrations/*.sql; do
    case "$(basename "$f")" in 2026080101*) continue ;; esac
    psql "$dsn" -q -X -v ON_ERROR_STOP=1 -f "$f" >/dev/null
  done
  psql "$dsn" -q -X -c "grant all on all tables in schema public to service_role;" >/dev/null
}

promote() {  # db — 101…111 in order, every one required to apply cleanly
  local dsn="postgres://postgres@localhost:$PORT/$1"
  for f in supabase/migrations/2026080101*.sql; do
    psql "$dsn" -q -X -v ON_ERROR_STOP=1 -f "$f" >/dev/null \
      || { echo "FAILED to apply $(basename "$f")" >&2; exit 1; }
  done
}

echo "  building baseline cluster…"
prepare base; baseline base
node scripts/por1/extract-catalogue.mjs --dsn "postgres://postgres@localhost:$PORT/base" --out "$WORK/base.json" >/dev/null

echo "  building post-P111 cluster…"
prepare final; baseline final; promote final
node scripts/por1/extract-catalogue.mjs --dsn "postgres://postgres@localhost:$PORT/final" --out "$WORK/final.json" >/dev/null

echo "  deriving the delta…"
node - "$WORK/base.json" "$WORK/final.json" "$OUT" "$CHECK" <<'NODE'
import { readFileSync, writeFileSync, existsSync } from "node:fs";
const [, , basePath, finalPath, outPath, checkFlag] = process.argv;
const base = JSON.parse(readFileSync(basePath, "utf8"));
const final = JSON.parse(readFileSync(finalPath, "utf8"));

// Owner is excluded for the same reason the generated contract excludes it: Supabase owns everything
// as `postgres`, a disposable rehearsal owns it as whoever ran the migrations, and pinning it would
// fail the gate for a reason unrelated to the contract.
const strip = (o, keys) => Object.fromEntries(Object.entries(o).filter(([k]) => !keys.includes(k)));

const baseTables = new Set(base.tables.map((t) => t.name));
const baseFunctions = new Set(base.functions.map((f) => f.signature));
const baseSequences = new Set(base.sequences.map((s) => s.name));
const baseTriggers = new Set(base.triggers.map((t) => `${t.table}.${t.name}`));

const contract = {
  note:
    "POR-1 FINAL promoted contract — the effective state after 202608010101…202608010111. " +
    "Derived, never hand-written: scripts/por1/build-final-contract.sh diffs two disposable " +
    "PostgreSQL 17 clusters built from repository SQL. Owner and environment are deliberately excluded. " +
    "The compiler's own output (por1-promotion-contract.json) covers 101…108 and is a different artifact.",
  tables: final.tables.filter((t) => !baseTables.has(t.name)).map((t) => strip(t, ["owner"])),
  functions: final.functions.filter((f) => !baseFunctions.has(f.signature)).map((f) => strip(f, ["owner"])),
  sequences: final.sequences.filter((s) => !baseSequences.has(s.name)).map((s) => strip(s, ["owner", "usage_grants"])),
  triggers: final.triggers.filter((t) => !baseTriggers.has(`${t.table}.${t.name}`)),
};
contract.counts = {
  tables: contract.tables.length,
  functions: contract.functions.length,
  sequences: contract.sequences.length,
  triggers: contract.triggers.length,
};
const text = `${JSON.stringify(contract, null, 2)}\n`;
const existing = existsSync(outPath) ? readFileSync(outPath, "utf8") : null;

if (checkFlag === "1") {
  if (existing !== text) {
    console.error(`DRIFT: ${outPath} ${existing === null ? "is missing" : "differs from the rebuilt final contract"}`);
    process.exit(1);
  }
  console.log(JSON.stringify({ mode: "check", drift: 0, ...contract.counts }));
} else {
  writeFileSync(outPath, text);
  console.log(JSON.stringify({ mode: "emit", written: outPath, ...contract.counts }));
}
NODE
