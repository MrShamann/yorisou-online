# LOCAL-LAUNCHER-REFRESH-1 — the macOS YORISOU.app local launcher

**Scope:** local developer/founder launcher only. Not Production deployment, not
APP-SHELL-1, not native App Store packaging. It serves the **current checked-out
commit** of the local repository on `http://127.0.0.1:3210` and owns nothing else.

## What exists after install

| Artifact | Path |
| --- | --- |
| Launch app (Dock icon) | `~/Applications/YORISOU.app` (`jp.yorisou.local.app`) |
| Stop app | `~/Applications/Stop YORISOU.app` (`jp.yorisou.local.stop`) |
| Launcher scripts | `~/Library/Application Support/YORISOU/bin/` |
| Local env (0600, never committed) | `~/Library/Application Support/YORISOU/yorisou.env.local` |
| Logs (2 MB rotation each) | `~/Library/Logs/YORISOU/{launcher,server,migration,stop}.log` |
| Run state (PID, build identity, lock) | `~/Library/Application Support/YORISOU/run/` |

Repository sources: `scripts/local-app/` (installer, start, stop, verify, lib,
env template, icon asset). Reinstall or repair at any time with:

```bash
scripts/local-app/install-yorisou-launcher.sh
```

An existing `yorisou.env.local` is never overwritten (it may hold local-only
secrets); on first run after this refresh the installer comments out the retired
`feat/aix-1-ai-native-experience` branch pin and the fixed-HEAD pin.

## Launch sequence (fail-closed)

1. acquire the launcher lock (atomic `mkdir`; a stale lock older than 30 min is self-repaired)
2. validate the repository (`.git`, `package.json`, resolvable HEAD — branch mismatch **warns**, never blocks)
3. validate runtime dependencies (node, npm, usable `node_modules`) and enforce
   **native architecture**: a Finder/Dock launch can land under Rosetta, and a
   translated node builds against the wrong native binaries (x64 swc /
   lightningcss on an arm64 `node_modules` — a reproduced failure). On Apple
   Silicon (`hw.optional.arm64`, which is Rosetta-proof) every node/npm
   invocation is wrapped in `/usr/bin/arch -arm64`, and the launcher fails
   closed if node cannot run natively; machine/translation/node arch are logged
   each launch
4. start or verify Colima and Docker
5. start or verify the local Supabase stack (`supabase_db_yorisou-online`, db port 55342)
6. **validate the database schema — fatal on failure.** Every migration file
   version in `supabase/migrations/` must be recorded as applied in
   `supabase_migrations.schema_migrations`, and the canonical POR-1 tables must
   exist. With `YORISOU_AUTO_MIGRATE=1` the launcher applies pending migrations
   itself (Supabase CLI, ON_ERROR_STOP, logged to `migration.log`); by default
   it refuses to start and names the missing versions.
7. build when the **build identity** is stale (recorded built-SHA ≠ current HEAD,
   or no build exists). The built SHA is recorded in `run/build-identity.json`
   at build time — a label supplied at start is never proof of what was built.
8. port safety under the **ownership contract** below: refuse to start if 3210
   is owned by a process the launcher cannot prove is its own (it never signals
   a foreign process); gracefully replace a server that is provably ours but
   stale; self-repair a dead recorded PID
9. start `next start -H 127.0.0.1 -p 3210` (`NODE_ENV=production`); the runtime
   reports the *built* SHA through `/api/build-identity` via
   `VERCEL_GIT_COMMIT_SHA`
10. poll `GET /` for up to 90 s, failing fast if the server process dies
11. **only after readiness AND a passing identity check**, open the standalone
    Chrome app window — HTTP readiness is a transport fact and never, on its
    own, authorizes opening the window
12. persist PID + build identity, release the lock

## Ownership contract

**HTTP success is not application identity.** `yr_http_ok` proves only that
something answered on the port. A service is accepted as the launcher's own only
when every one of these facts holds, each a separate testable helper:

| Fact | Helper |
| --- | --- |
| exactly one process owns 127.0.0.1:3210 | `yr_port_owner` (singleton check) |
| that process is a Node/Next production server | `yr_pid_is_next_shape` |
| its working directory resolves to `$YORISOU_REPO` | `yr_pid_cwd_matches_repo` |
| it is the recorded launcher PID or its child | `yr_pid_lineage_matches_recorded` |
| `/api/build-identity` answers and parses | `yr_runtime_identity` |
| runtime `commitSha` == the **recorded built SHA** | `yr_runtime_identity_matches_build` |
| all of the above together (stop grade) | `yr_runtime_is_ours` |
| plus recorded SHA == repository HEAD and consistent `commitRef` (current grade) | `yr_runtime_is_current` |

The recorded built SHA is written at build time into `run/build-identity.json`;
a caller-supplied environment label is never accepted as proof. Process **name
alone proves nothing** — a `next-server` that owns the port but runs from
another repository fails on cwd and lineage.

Consequences, by case:

- **Foreign service answering 200** — no window, no "healthy" claim, no PID-file
  overwrite, no signal; the launcher fails closed naming every failed check.
- **Provably ours but stale** (runtime or recorded SHA ≠ HEAD) — never silently
  reused and never reported as current; replaced only because ownership was
  independently proven, then rebuilt.
- **Genuine current service** — only this case takes the
  `already healthy — opening window` fast path.

`Stop YORISOU.app` signals a PID only under the full stop-grade contract. When
ownership fails it records the exact failed checks, leaves the process alone,
exits non-zero, and **preserves** the live PID record and lock as diagnostic
evidence (a dead PID file is still cleaned up).

`verify-yorisou-launcher.sh --health` reports HTTP reachability, port-owner PID,
process shape, repository cwd, PID lineage, recorded build identity, runtime
build identity, repository HEAD, and an overall identity verdict — and exits
non-zero when HTTP works but identity does not.

The contract is regression-tested by `scripts/local-app/test-launcher-contract.sh`
(hermetic; stubs the process/HTTP probes, starts and signals nothing).

Every launch logs: timestamp, launcher version, repo path, branch, commit SHA,
node/npm versions, PostgreSQL version, migration readiness, build result,
server PID, health result, browser-open result. Secrets, tokens, cookie values
and personal data are never logged.

## Stop contract

`Stop YORISOU.app` reads the recorded PID and stops a process **only after
proving ownership** (a node `next start` bound to port 3210 / this repo). It
SIGTERMs, waits up to 20 s, force-kills with a 10 s bound only if needed, and
removes stale PID/lock files. It never stops ports 3220/3230, unrelated node
processes, Colima, or the shared local Supabase containers.

## Boundaries

- **Local only.** The launcher never connects to Production or Preview; the
  database it validates/migrates is the local Docker Supabase stack only.
- The launcher owns exactly `127.0.0.1:3210`. Anything else on any other port
  is out of its jurisdiction.
- Gatekeeper: the bundles are intentionally unsigned local script bundles; no
  ad-hoc signing is added (no launch block has been reproduced).

## Verification

```bash
"$HOME/Library/Application Support/YORISOU/bin/verify-yorisou-launcher.sh" --health
```

Evidence for the refresh package: `docs/local-app/evidence/local-launcher-refresh-1.json`.

## Known finding recorded by this package (for POR-1)

Applying the canonical lineage to a real Supabase stack tripped the
`202608010108` promotion-contract assertion: `202608010104` revokes the lock
helper `yorisou_line_subject_lock` from `public`/`anon`/`authenticated` but not
from `service_role`, while Supabase default privileges grant `service_role`
EXECUTE on every new public function directly. Plain-Postgres harnesses skip the
assertion's `service_role` branch because the role does not exist there. This
package applied the contract's asserted end-state locally (a documented
`revoke ... from service_role`) without modifying any POR-1 migration file; the
hosted promotion path should expect the same trip-wire.
