# YORISOU — Local App & Runtime Foundation 1

Status: **IMPLEMENTED — PR open / unmerged / pending audit.**

What this delivers: a real `YORISOU.app` in `~/Applications` that a person double-clicks to get their
own Yorisou window, served by a commit-bound runtime on the AI-Work SSD. No terminal, no typing a
localhost URL, no browser tab that makes the product look like a web page.

The Yorisou product is unchanged. This is a container for it.

---

## 1. Architecture

```
~/Applications/YORISOU.app          native shell (AppKit + WKWebView)
        │  runs
        ▼
/Volumes/AI-Work/Runtimes/yorisou/  the runtime, on the SSD
    releases/<sha>/                 detached git worktrees, one per commit
    current -> releases/<sha>        atomic symlink to the accepted release
    config/                          local.env (0600) — optional
    data/                            runtime-owned local data
    logs/                            app.log, server.log (rotated)
    cache/                           npm cache
    state/                           server.pid, active-release.sha
    snapshots/                       bounded operational snapshots (latest 5)
        │  serves
        ▼
127.0.0.1:3210                       loopback only
```

### Why the runtime is at `Runtimes/yorisou`

The package specified `/Volumes/AI-Work/Yorisou/runtime`. The volume root is `root:wheel`
`drwxrwxr-x`, so creating a new top-level directory there requires `sudo`, and this install must not
depend on a password prompt.

`Runtimes/` is already this machine's convention for exactly this kind of thing — `colima`,
`android` and `docker-desktop` all live there — it is user-owned, and it is on the same SSD. Every
guarantee the package actually asks for is unchanged: SSD residency, hard dependency, fail-closed, no
internal-disk copy. Moving to the volume root later is one `sudo mkdir` plus one constant in
`runtime-lib.sh`.

### Why releases are git worktrees

A detached worktree shares the development repository's object store, has no independent remote, and
is pinned to an exact commit. The Founder's app therefore does not change because someone checked out
a feature branch in the development repo — which is precisely the failure the release model exists to
prevent, and the reason a second long-lived clone was not created.

---

## 2. Commands

| command | what it does |
|---|---|
| `npm run local-app:install` | prepare tree → build release → build app → **atomically** activate → install app |
| `npm run local-app:start` | start the owned runtime (no build, ever) |
| `npm run local-app:stop` | stop **only** the process it can prove it owns |
| `npm run local-app:restart` | owned stop, then owned start |
| `npm run local-app:doctor` | one diagnostic, safe metadata only |
| `npm run local-app:snapshot` | one bounded operational snapshot |
| `npm run local-app:test` | 42 contract tests that execute the real scripts |

Normal use needs none of these: the Founder opens `YORISOU.app`.

---

## 3. The two rules that shape everything

### Launch never builds

Double-clicking runs no `npm ci`, no `next build`, no `git fetch`, no migrations. Those belong to
install/update. A launcher that builds turns a two-second app into a two-minute one and — worse — can
change what the Founder is looking at without them asking for it.

### Port occupancy is not identity

"Something is listening on 3210" is not "Yorisou is running". A different Next app, a second
checkout, or a script returning plausible JSON all satisfy it. Treating the port as identity is how a
launcher ends up killing someone else's work.

Six facts must **all** hold before anything is reused or stopped:

1. exactly one process owns `127.0.0.1:3210`
2. the candidate PID is alive
3. it is that port owner
4. its command line is a Node/Next server
5. its working directory is the **active release**
6. it is the recorded PID or its child, **and** `/api/build-identity` reports a `localRelease.sha`
   equal to the recorded active release

`stop` re-proves ownership before `SIGTERM` and **again** before escalating to `SIGKILL`, because a
PID can be recycled in between. There is no `pkill`, no `killall`, and no "kill whatever owns the
port" anywhere in this package.

---

## 4. Build identity

`/api/build-identity` gained one block:

```json
"localRelease": { "sha": "<commit>", "path": "<release path>" }
```

Fed by `YORISOU_LOCAL_RELEASE_SHA` / `YORISOU_LOCAL_RELEASE_PATH`, which `start.sh` exports.

These are **local** variables deliberately. Setting `VERCEL_*` on a laptop to make the response look
hosted would forge the one field acceptance uses to refuse running against production. `environment`
stays `"development"`, truthfully. On every hosted deployment `localRelease` is `null`, so nothing
about hosted identity changes.

---

## 5. Local data truth

**`LOCAL_DB_UNAVAILABLE`**, and the app works anyway.

Measured fresh, not assumed from PR #127: the local Supabase project pins its own ports
(`55341`/`55342`, deliberately not the default `54321`/`54322` so a tool never talks to whatever
happened to own the port). Nothing is listening on them, and Docker/Colima is not running.

The core product does not need it. With no shared-store bucket configured, `resolveSharedStoreMode`
returns `disabled` and the POR-1 store boundary resolves to `local-development` — so Today, 気づく,
the light check-in, the 120Q, 探す, わたし and the Result all render from device-local state with **no
credentials at all**. That is why this package retrieves no credentials and copies no Production
values: it does not need any, and a local app that depends on Production credentials is not local.

Surfaces that genuinely need a hosted backend fail honestly rather than being routed to Production.

**Not claimed:** that a live PostgreSQL data volume sits on the SSD. Docker/Colima owns its own disk
image, and moving it is the later LAB VM package's job. What is SSD-resident here is release code,
runtime config, logs, cache, runtime-owned data and snapshots.

---

## 6. Security boundary

- binds `127.0.0.1` only — never `0.0.0.0`, so the app is not reachable from the LAN
- no secret is passed into the client bundle, logged, or printed by any script; `doctor` reports that
  `local.env` exists, never its contents, and `snapshot` fingerprints it rather than copying it
- no web page can instruct the native shell to run a command — the shell executes exactly two fixed
  scripts and passes no arguments
- navigation outside `127.0.0.1:3210` is cancelled and handed to the real browser. Embedding
  arbitrary external sites in app chrome the user cannot inspect is how a webview shell becomes a
  phishing surface, and provider flows such as LINE OAuth stay browser-mediated on purpose
- `local.env` lives outside the repository at `config/local.env` (0600, parent 0700) and is never
  committed

---

## 7. Update and rollback

`install.sh` is idempotent and doubles as the update path: it builds and **validates** the new
release before `current` moves. If any step fails, `current` still points at the last accepted
release and the installed app keeps working. That is the entire rollback story — no backup library,
just *don't switch until it's proven*. Three releases are kept so a previous target always exists.

Updates are explicit. The app never pulls from GitHub on launch.

---

## 8. What the tests actually do

`npm run local-app:test` — 42 checks that **execute** the scripts. A foreign server is started on the
port and the launcher must refuse it and leave it alive; a fake `/api/build-identity` responder must
still fail the contract; a stale PID must be cleared rather than killed; a broken `current` symlink
must refuse rather than guess.

Two defects the suite caught in this package's own work, recorded because they are the kind that get
quietly dropped:

1. **The source-audit checks matched their own comments.** `start.sh`'s comment says "no npm ci";
   `stop.sh`'s says "there is no `pkill node` here"; the test file names every pattern it searches
   for. An audit a comment can satisfy — or break — is not an audit. The checks now strip full-line
   comments and never audit the suite itself.
2. **The SSD-missing failure path created the fallback it was refusing.** `yr_die` logged, and
   logging did `mkdir -p "$YR_LOGS"` — so at the exact moment the guard refused to use the internal
   disk, it created a directory tree there. Logging no longer creates anything; only the installer
   does.

---

## 9. Deferred

* **The runtime is not at the volume root.** See §1. One `sudo mkdir` away if that path is wanted.
* **Docker/Colima's VM disk is not on the SSD.** Out of scope by §27; belongs to the LAB VM package.
* **Local Supabase is not running**, so backend-dependent surfaces are unavailable locally. Bringing
  it up is guarded work under the repo's existing local-DB tooling and was not in scope here.
* **The app bundle is unsigned.** It is built and run locally by the person who owns the machine;
  Gatekeeper signing is a distribution concern, not a local-install one.
* **No auto-update UI.** Updates are `npm run local-app:install`, deliberately explicit.
* **PR #127 can be closed as superseded** once this is accepted. It was read as archaeology only —
  its six-fact ownership model is the direct ancestor of §3, with the anchor changed from "the
  development repository" to "the active release".
