#!/usr/bin/env bash
# POR-1 — the operator recovery tool's READ PATH, against the real schema.
#
# THE DEFECT THIS EXISTS FOR
#
# The recovery tool selected `link_subject` from `yorisou_canonical_identity_links`. That column has
# never existed in any migration: the registry stores a sha256 in `link_digest` and no plaintext
# subject at all. So the read returned nothing, every candidate was classified
# `synthetic_classification_unproven`, and the tool was inert in precisely the incident it was
# written for. No test caught it, because every test fed the classifier hand-built rows — the query
# string was never once shown a database.
#
# So this shows it one. Every (table, column) the tool names is asked of a real PostgreSQL 17 with
# the real migration lineage applied, and then the actual predicates are run against a seeded
# stranded incident to prove they resolve and return it.
#
# WHY THERE IS A NEGATIVE CONTROL. A schema check that finds nothing to check passes. So the old
# query is reconstructed and fed through the same extractor, and this test FAILS unless that old
# query is caught. A green result here has to mean the check works, not that it ran.
#
#   bash tests/por1/incident-recovery-executable-path.sh

set -euo pipefail
cd "$(dirname "$0")/../.."

# TWO WAYS TO GET A DATABASE, one behaviour.
#   • CI hands us a server in DATABASE_URL. We create our OWN database on it rather than sharing the
#     resume-engine one, whose preview-only lineage would collide with the promoted lineage here.
#   • Locally we spin a disposable PostgreSQL 17, matching Production.
# The PG17 pin is deliberately only on the local path: this test asks whether columns exist and
# whether predicates resolve, and neither answer differs between 16 and 17. The suites that DO
# depend on engine semantics keep their own pin.
WORK="${POR1_WORK:-/tmp/por1-incident-recovery}"
DB=por1_incident_recovery
export LC_ALL=C

FAILURES=0
LOCAL_SERVER=0
cleanup() {
  set +e
  if [ "$LOCAL_SERVER" = "1" ]; then pg_ctl -D "$WORK/pg" stop >/dev/null 2>&1; rm -rf "$WORK";
  else psql "$ADMIN_URL_BASE/postgres" -X -q -c "drop database if exists $DB;" >/dev/null 2>&1; fi
}
trap cleanup EXIT

ok()   { echo "[ok]   $1"; }
bad()  { echo "[FAIL] $1"; FAILURES=$((FAILURES + 1)); }
want() { # want <expected> <actual> <label>
  if [ "$1" = "$2" ]; then ok "$3"; else bad "$3 (expected '$1', got '$2')"; fi
}

if [ -n "${DATABASE_URL:-}" ]; then
  case "$DATABASE_URL" in
    *supabase.co*) echo "refusing: DATABASE_URL must not be a hosted project" >&2; exit 1 ;;
    *@localhost:*) ;;
    *) echo "refusing: DATABASE_URL must be a local server" >&2; exit 1 ;;
  esac
  ADMIN_URL_BASE="${DATABASE_URL%/*}"
  psql "$ADMIN_URL_BASE/postgres" -X -q -c "drop database if exists $DB;" >/dev/null 2>&1 || true
  psql "$ADMIN_URL_BASE/postgres" -X -q -v ON_ERROR_STOP=1 -c "create database $DB;" >/dev/null
  D="$ADMIN_URL_BASE/$DB"
  echo "[ir] using the CI-provided server, on a dedicated database"
else
  PGBIN="${POR1_POSTGRES_BIN:-/opt/homebrew/opt/postgresql@17/bin}"
  PORT="${POR1_POSTGRES_PORT:-55558}"
  export PATH="$PGBIN:$PATH"
  [ "$("$PGBIN/postgres" --version | awk '{print $3}' | cut -d. -f1)" = "17" ] || {
    echo "refusing: without DATABASE_URL this runs on a local PostgreSQL 17, as Production does" >&2; exit 1; }
  LOCAL_SERVER=1
  rm -rf "$WORK"; mkdir -p "$WORK/pg"
  initdb -D "$WORK/pg" -U postgres -A trust --no-locale -E UTF8 >/dev/null 2>&1
  pg_ctl -D "$WORK/pg" -o "-p $PORT -c unix_socket_directories=''" -l "$WORK/pg/log" start >/dev/null
  sleep 1
  createdb -h localhost -p "$PORT" -U postgres "$DB"
  D="postgres://postgres@localhost:$PORT/$DB"
  echo "[ir] using a disposable local PostgreSQL $("$PGBIN/postgres" --version | awk '{print $3}')"
fi

Q="psql $D -t -A -X -v ON_ERROR_STOP=1"

$Q -q -c "create extension if not exists pgcrypto; create extension if not exists \"uuid-ossp\";
  do \$\$ begin create role service_role bypassrls; exception when duplicate_object then null; end \$\$;
  do \$\$ begin create role anon; exception when duplicate_object then null; end \$\$;
  do \$\$ begin create role authenticated; exception when duplicate_object then null; end \$\$;
  grant usage on schema public to anon, authenticated, service_role;" >/dev/null
for f in supabase/migrations/*.sql; do
  case "$(basename "$f")" in 2026080101*) continue ;; esac
  $Q -q -f "$f" >/dev/null 2>&1
done
$Q -q -c "grant all on all tables in schema public to service_role;
          grant all on all sequences in schema public to service_role;" >/dev/null
for f in supabase/migrations/2026080101*.sql; do $Q -q -f "$f" >/dev/null; done
echo "[ir] $(ls supabase/migrations/*.sql | wc -l | tr -d ' ') migrations applied"

# ── 1. every column the read path names must exist ──────────────────────────

EXTRACT=$(node scripts/por1/extract-recovery-query-columns.mjs)
PAIRS=$(printf '%s' "$EXTRACT" | node -e '
  let s=""; process.stdin.on("data",d=>s+=d).on("end",()=>{
    for (const e of JSON.parse(s)) for (const c of e.columns) console.log(`${e.table} ${c}`);
  });')

PAIR_COUNT=$(printf '%s\n' "$PAIRS" | grep -c . || true)
if [ "$PAIR_COUNT" -lt 12 ]; then
  bad "extractor found only $PAIR_COUNT (table, column) pairs — refusing to pass vacuously"
else
  ok "extractor found $PAIR_COUNT (table, column) pairs across $(printf '%s\n' "$PAIRS" | awk '{print $1}' | sort -u | wc -l | tr -d ' ') tables"
fi

MISSING=0
while read -r TABLE COLUMN; do
  [ -n "${TABLE:-}" ] || continue
  EXISTS=$($Q -c "select count(*) from information_schema.columns
                   where table_schema='public' and table_name='$TABLE' and column_name='$COLUMN';")
  if [ "$EXISTS" != "1" ]; then bad "$TABLE.$COLUMN does not exist in the real schema"; MISSING=$((MISSING+1)); fi
done <<< "$PAIRS"
[ "$MISSING" -eq 0 ] && ok "every column the recovery read path names exists in the real schema"

# ── 2. the specific column that broke it, asserted absent ───────────────────

want "0" "$($Q -c "select count(*) from information_schema.columns
                    where table_schema='public' and table_name='yorisou_canonical_identity_links'
                      and column_name='link_subject';")" \
     "yorisou_canonical_identity_links has NO link_subject column"
want "1" "$($Q -c "select count(*) from information_schema.columns
                    where table_schema='public' and table_name='yorisou_canonical_identity_links'
                      and column_name='link_digest';")" \
     "yorisou_canonical_identity_links stores link_digest instead"
if grep -q 'link_subject' <<< "$PAIRS"; then
  bad "the shipped read path still names link_subject"
else
  ok "the shipped read path does not name link_subject"
fi

# ── 3. NEGATIVE CONTROL — the old query must be caught by this same check ───

mkdir -p "$WORK/control"
sed 's/select=link_kind,link_digest,owner_fingerprint/select=link_subject/' \
  scripts/por1-production-deletion-recovery.ts > "$WORK/control/old.ts"
if cmp -s scripts/por1-production-deletion-recovery.ts "$WORK/control/old.ts"; then
  bad "negative control did not change anything — it is not reconstructing the old query"
else
  OLD_PAIRS=$(node scripts/por1/extract-recovery-query-columns.mjs "$WORK/control/old.ts" | node -e '
    let s=""; process.stdin.on("data",d=>s+=d).on("end",()=>{
      for (const e of JSON.parse(s)) for (const c of e.columns) console.log(`${e.table} ${c}`);
    });')
  if grep -q '^yorisou_canonical_identity_links link_subject$' <<< "$OLD_PAIRS"; then
    ok "negative control: the extractor reports link_subject on the old query"
    CONTROL_EXISTS=$($Q -c "select count(*) from information_schema.columns
                             where table_schema='public' and table_name='yorisou_canonical_identity_links'
                               and column_name='link_subject';")
    want "0" "$CONTROL_EXISTS" "negative control: that column is absent, so this check WOULD have failed the old tool"
  else
    bad "negative control: the extractor did NOT report link_subject — the check proves nothing"
  fi
fi

# ── 4. the real predicates, against a seeded stranded incident ──────────────

OWNER='acct_1700000000000_executablepath'
JOB=$($Q -c "
  insert into public.yorisou_account_deletion_jobs
    (owner_account_id, owner_fingerprint, state, execution_cursor,
     irreversible_started_at, mutation_gate_closed_at, requested_at, executor_generation)
  values ('$OWNER', encode(digest('$OWNER','sha256'),'hex'), 'failed_retryable', 'database_erasure',
          now() - interval '1 hour', now() - interval '1 hour', now() - interval '1 hour', 1)
  returning id;" | head -1)
$Q -q -c "
  insert into public.yorisou_account_deletion_manifests (job_id, payload)
  values ('$JOB', '{\"sessionIds\":[],\"lineEventIds\":[],\"consultationIds\":[],
                    \"passwordResetHashes\":[],\"supportConversationIds\":[],
                    \"recentSubjectFingerprints\":[],\"canonicalIdentityLinkCount\":1,
                    \"primaryAccountKey\":\"phase1/accounts/by-id/$OWNER.json\",
                    \"emailLookupKey\":null,\"lineLookupKey\":null,\"identityLookupKeys\":[],
                    \"foundationUserProfileId\":\"$OWNER\",\"foundationAuthIdentityIds\":[]}'::jsonb);
  insert into public.yorisou_account_mutation_leases
    (owner_account_id, gate_generation, operation_code, issued_at, expires_at, released_at)
  values ('$OWNER', 1, 'account_registration', now() - interval '1 hour' - interval '26 seconds',
          now() - interval '1 hour', now() - interval '1 hour');
  insert into public.yorisou_canonical_identity_links
    (owner_account_id, owner_fingerprint, link_kind, link_digest, link_state)
  values ('$OWNER', encode(digest('$OWNER','sha256'),'hex'), 'email',
          encode(digest('someone@example.invalid','sha256'),'hex'), 'active');" >/dev/null

want "1" "$($Q -c "select count(*) from public.yorisou_account_deletion_jobs
                    where state='failed_retryable' and execution_cursor='database_erasure'
                      and irreversible_started_at is not null and owner_account_id is not null;")" \
     "the structural job predicate resolves and selects the stranded job"

want "1" "$($Q -c "select count(*) from public.yorisou_account_deletion_manifests
                    where job_id='$JOB' and payload is not null;")" \
     "the manifest read resolves job_id and payload"

want "1" "$($Q -c "select count(*) from public.yorisou_account_mutation_leases
                    where owner_account_id='$OWNER' and operation_code='account_registration'
                      and issued_at is not null;")" \
     "the registration-lease read resolves operation_code and issued_at"

# The columns the old code could not read. Both non-null is the whole repair.
want "t" "$($Q -c "select (link_digest is not null and owner_fingerprint is not null)
                     from public.yorisou_canonical_identity_links
                    where owner_account_id='$OWNER' and link_kind='email' and link_state='active';")" \
     "the identity-link read returns a non-null link_digest AND owner_fingerprint"

want "t" "$($Q -c "select owner_fingerprint = encode(digest('$OWNER','sha256'),'hex')
                     from public.yorisou_canonical_identity_links where owner_account_id='$OWNER';")" \
     "owner_fingerprint is sha256(account id), which is what identityOwnerFingerprint computes"

# ── 5. the ambiguity the classifier now refuses is REAL, not hypothetical ───
#
# An independent audit observed that the executable path took the FIRST active email link. The claim
# under test is that the schema permits an owner to have more than one, so "there can only be one" was
# never a fact the code was entitled to assume. Asserted twice: no constraint exists, AND the database
# actually accepts the second row.

want "0" "$($Q -c "select count(*) from pg_constraint c
                     join pg_class t on t.oid = c.conrelid
                    where t.relname = 'yorisou_canonical_identity_links'
                      and c.contype in ('u','p')
                      and pg_get_constraintdef(c.oid) ilike '%owner_account_id%'
                      and pg_get_constraintdef(c.oid) ilike '%link_kind%';")" \
     "no UNIQUE/PRIMARY constraint pins (owner_account_id, link_kind)"

want "0" "$($Q -c "select count(*) from pg_indexes
                    where tablename = 'yorisou_canonical_identity_links'
                      and indexdef ilike '%unique%'
                      and indexdef ilike '%owner_account_id%'
                      and indexdef ilike '%link_kind%';")" \
     "no UNIQUE INDEX pins (owner_account_id, link_kind) either"

if $Q -q -c "
  insert into public.yorisou_canonical_identity_links
    (owner_account_id, owner_fingerprint, link_kind, link_digest, link_state)
  values ('$OWNER', encode(digest('$OWNER','sha256'),'hex'), 'email',
          encode(digest('second-address@example.invalid','sha256'),'hex'), 'active');" >/dev/null 2>&1; then
  ok "the real schema ACCEPTS a second active email link for the same owner"
  want "2" "$($Q -c "select count(*) from public.yorisou_canonical_identity_links
                      where owner_account_id='$OWNER' and link_kind='email' and link_state='active';")" \
       "the owner now genuinely holds two active email links"
  # Two DIFFERENT digests, so picking either would have been an arbitrary choice between identities.
  want "2" "$($Q -c "select count(distinct link_digest) from public.yorisou_canonical_identity_links
                      where owner_account_id='$OWNER' and link_kind='email' and link_state='active';")" \
       "and they carry different digests, so first-row selection was a coin toss"
else
  bad "the schema refused a second active email link — the ambiguity guard would be untestable"
fi

# ── 6. the old read could not have worked, run as SQL rather than asserted in prose ──
if $Q -c "select link_subject from public.yorisou_canonical_identity_links limit 1;" >/dev/null 2>&1; then
  bad "selecting link_subject unexpectedly succeeded"
else
  ok "selecting link_subject fails against the real schema, as the shipped tool used to"
fi

echo
if [ "$FAILURES" -eq 0 ]; then echo "[ir] PASS"; else echo "[ir] $FAILURES FAILURE(S)"; exit 1; fi
