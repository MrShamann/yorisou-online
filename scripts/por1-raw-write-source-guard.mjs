// POR-1 — THE RAW-WRITE SOURCE GUARD.
//
// The account mutation fence is enforced at runtime by write contexts: the low-level writers demand
// one, and only `accountMutationLease.ts` can mint one. That is the mechanism, and it holds.
//
// This guard defends the OTHER half — the part a runtime check cannot see. A future change could
// export the minting function more widely, add a second unfenced writer beside a fenced one, or
// simply call a raw write from a route because the fenced path was inconvenient. None of those fail
// at runtime; they fail silently, months later, as an account that came back after being deleted.
//
// So the rule is stated as EXACT PATH + SYMBOL ALLOWLISTS. Not directory prefixes: exempting a whole
// directory is how a guard becomes a formality, because the next file added to that directory is
// exempt by default and nobody decided that. Adding a caller here is a deliberate, reviewable act.
//
// Read-only. No database, no network. Exit 0 on success, 1 on any violation.

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();

// ─────────────────────────────────────────────────────────────────────────────
// The guarded symbols, and the EXACT files permitted to use each one.
//
// A path appears here because someone reasoned about that specific call site. `lib/server/**` is
// deliberately NOT a permitted value.
// ─────────────────────────────────────────────────────────────────────────────
const GUARDED = [
  {
    symbol: "mintAccountWriteContext",
    why: "Mints the only thing that authorises an account-linked write. One module may call it.",
    allow: ["lib/server/accountMutationLease.ts", "lib/server/accountWriteContext.ts"],
  },
  {
    symbol: "upsertAccountRecord",
    why: "The primary-identity read-modify-upsert. THE resurrection primitive.",
    allow: [
      "lib/server/yorisouData.ts",
      "lib/server/yorisouAuth.ts",
      "lib/server/foundation/identityService.ts",
    ],
  },
  {
    symbol: "putSharedAccountRecord",
    why: "Writes the account record plus every index that resolves to it.",
    allow: ["lib/server/yorisouData.ts"],
  },
  {
    symbol: "putSharedSessionRecord",
    why: "An account-linked session record is a credential for that account.",
    allow: ["lib/server/yorisouData.ts"],
  },
  {
    symbol: "foundationUserProfileRepository.save",
    why: "The canonical profile is half of the canonical login identity.",
    allow: ["lib/server/foundation/repositories.ts", "lib/server/foundation/identityService.ts"],
  },
  {
    symbol: "foundationAuthIdentityRepository.save",
    why: "A bound AuthIdentity IS the email or LINE login route.",
    allow: ["lib/server/foundation/repositories.ts", "lib/server/foundation/identityService.ts"],
  },
  {
    symbol: "touchSession",
    why: "Binds an account to a session. Must never happen on a read path.",
    allow: ["lib/server/yorisouData.ts", "lib/server/yorisouAuth.ts"],
  },
  {
    symbol: "sharedWriteJson",
    why: "The raw object-store write. Identity paths must go through the fenced writers.",
    allow: [
      // Each of these owns a DIFFERENT store namespace and defines its own local `sharedWriteJson`.
      // Identity keys live only in yorisouData; the rest never touch an account-linked path.
      "lib/server/yorisouData.ts",
      "lib/server/hinataMemory.ts",
      "lib/server/dteLaunchEventStore.ts",
      "lib/server/dynamicTestCompletionStore.ts",
    ],
  },
  {
    symbol: "insertSessionRecordIfAbsent",
    why:
      "Creates a session row for an existing id. Insert-only, but on the table whose deletion ends " +
      "a session — a second caller is a second way a stale cookie could get its row back.",
    allow: ["lib/server/yorisouData.ts", "lib/server/identityProvisioning.ts"],
  },
  {
    symbol: "recordCanonicalLineEvent",
    why:
      "The canonical LINE activity write. It crosses the subject-erasure barrier, so a second " +
      "caller is a second place the barrier could be forgotten.",
    allow: ["lib/server/canonicalLineActivity.ts", "lib/server/yorisouData.ts"],
  },
  {
    symbol: "provisionRegistration",
    why:
      "Creates an account and its canonical identity. ONE route may drive it; a second caller is a " +
      "second registration path, and the swallow this replaced lived in exactly such a path.",
    allow: ["lib/server/identityProvisioning.ts", "app/api/auth/register/route.ts"],
  },
  {
    symbol: "purgeProvisioningForOwner",
    why: "Deletes provisioning state, which releases an email address. Governed deletion only.",
    allow: ["lib/server/identityProvisioning.ts", "lib/server/accountDeletionOrchestrator.ts"],
  },
  {
    symbol: "eraseCanonicalLineSubjects",
    why:
      "Terminally erases a LINE subject. It is the deletion path's operation and nothing else's; a " +
      "second caller would be a way to bar a living person's activity.",
    allow: ["lib/server/canonicalLineActivity.ts", "lib/server/yorisouData.ts"],
  },
  {
    symbol: "withLegacyBootstrapContext",
    why: "The one-time file→store migration. Never a request path.",
    allow: ["lib/server/accountMutationLease.ts", "lib/server/yorisouData.ts"],
  },
];

// Identity-bearing store namespaces. A raw write to one of these from anywhere is a violation
// regardless of which helper it used — this catches a NEW helper that the symbol list cannot know
// about yet.
const IDENTITY_KEY_LITERALS = [
  "/accounts/by-id/",
  "/accounts/by-email/",
  "/accounts/by-line-user/",
  "/sessions/",
  "/password-resets/",
];
const IDENTITY_KEY_WRITERS_ALLOW = ["lib/server/yorisouData.ts", "lib/server/accountIdentityDeletion.ts"];

// RPC names that were superseded by a STRONGER operation and must not be reachable from application
// code again. A symbol allowlist cannot express this: the danger is not who calls it but that it is
// called at all, because each of these still exists in the database and still does something — just
// something weaker than the invariant now requires.
//
// `yorisou_line_activity_erase` tombstones the event rows that exist right now. That protects
// redelivery of THOSE events and nothing else: a brand-new event id for the same subject is inserted
// as live activity for a person who no longer exists. It survives in the database delegating to the
// subject erasure, so an un-updated caller gets the stronger guarantee — but new code must address
// the subject, and this is what says so at review time rather than after a deletion has silently
// held back less than it claimed.
const RETIRED_RPCS = [
  {
    name: "yorisou_line_activity_erase",
    instead: "yorisou_line_subject_erase (application: eraseCanonicalLineSubjects)",
  },
  {
    name: "yorisou_line_activity_residue",
    instead:
      "yorisou_line_subject_erasure_residue (application: canonicalLineActivityResidue) — the " +
      "event-only count reports zero for a subject that is still active and one webhook from live",
  },
  {
    name: "yorisou_account_deletion_mark_cursor",
    instead: "yorisou_account_deletion_complete_step, which validates ownership and legality",
  },
];

const GUARD_SELF = "scripts/por1-raw-write-source-guard.mjs";

const SCAN_DIRS = ["app", "lib", "scripts", "components"];
const SCAN_EXT = [".ts", ".tsx", ".mjs", ".js"];
// Tests exercise the guarded surface on purpose — that is what a test is. They are excluded by exact
// suffix rather than by directory so a non-test file cannot hide inside a `__tests__` folder name.
const TEST_SUFFIXES = [".test.ts", ".test.tsx", ".test.mjs", ".spec.ts", ".spec.tsx"];

const failures = [];

function walk(dir) {
  const abs = join(ROOT, dir);
  let entries;
  try {
    entries = readdirSync(abs, { withFileTypes: true });
  } catch {
    return [];
  }
  const out = [];
  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
    const rel = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(rel));
    else if (SCAN_EXT.some((ext) => entry.name.endsWith(ext))) out.push(rel.split("\\").join("/"));
  }
  return out;
}

const files = SCAN_DIRS.flatMap(walk);
if (files.length === 0) {
  console.error("FAIL: the guard scanned no files — the scan roots are wrong, not the code");
  process.exit(1);
}

/** Strip line and block comments so a symbol named in prose is not reported as a call. */
function stripComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
}

for (const file of files) {
  if (TEST_SUFFIXES.some((suffix) => file.endsWith(suffix))) continue;
  if (file === "scripts/por1-raw-write-source-guard.mjs") continue;

  const raw = readFileSync(join(ROOT, file), "utf8");
  const source = stripComments(raw);

  for (const rule of GUARDED) {
    if (rule.allow.includes(file)) continue;
    // Match a USE — a call or an import — not a mention. The trailing `(` catches calls; a named
    // import is caught by the `import { … }` form.
    const callPattern = new RegExp(`\\b${rule.symbol.replace(".", "\\.")}\\s*\\(`);
    const importPattern = new RegExp(`import\\s*\\{[^}]*\\b${rule.symbol.split(".")[0]}\\b[^}]*\\}`);
    const usesCall = callPattern.test(source);
    const usesImport = rule.symbol.includes(".") ? false : importPattern.test(source);
    if (usesCall || usesImport) {
      failures.push(
        `${file}: uses guarded symbol \`${rule.symbol}\` outside its allowlist.\n` +
          `    why it is guarded: ${rule.why}\n` +
          `    permitted files: ${rule.allow.join(", ")}\n` +
          `    fix: go through the fenced API (withAccountMutationLease / withAccountProvisioningLease /\n` +
          `         withAccountDeletionContext), or add this exact path to the allowlist with a reason.`,
      );
    }
  }

  if (!IDENTITY_KEY_WRITERS_ALLOW.includes(file)) {
    for (const literal of IDENTITY_KEY_LITERALS) {
      // Only flag a literal that is being BUILT into a key — a bare mention in a type or a comparison
      // is not a write. The template-literal form is how every key in this codebase is constructed.
      const pattern = new RegExp(`\`[^\`]*${literal.replace(/\//g, "\\/")}[^\`]*\\$\\{`);
      if (pattern.test(source)) {
        failures.push(
          `${file}: constructs an identity-store key (\`${literal}\`) outside the fenced writers.\n` +
            `    permitted files: ${IDENTITY_KEY_WRITERS_ALLOW.join(", ")}`,
        );
      }
    }
  }
}

// Retired RPC names. Scanned across every file with no allowlist at all — there is no legitimate
// application caller, which is the point of retiring them. Comments are stripped first, so a note
// explaining WHY a name was retired is allowed to say the name; only a use is a violation.
//
// This file is excluded from its own scan: it is the one place the names must appear as data.
for (const file of files) {
  if (file === GUARD_SELF) continue;
  const source = stripComments(readFileSync(join(ROOT, file), "utf8"));
  for (const retired of RETIRED_RPCS) {
    if (source.includes(retired.name)) {
      failures.push(
        `${file} references the RETIRED rpc \`${retired.name}\`.\n` +
          `    use instead: ${retired.instead}`,
      );
    }
  }
}

// The retired names must still EXIST in the migrations, or this list is describing a world that no
// longer matches the database and would pass forever without meaning anything.
{
  const migrationDirs = [
    "supabase/migrations",
    "supabase/preview-only-migrations",
    "supabase/local-only-migrations",
  ];
  const sql = [];
  const collect = (dir) => {
    let entries;
    try {
      entries = readdirSync(join(ROOT, dir), { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const rel = join(dir, entry.name);
      if (entry.isDirectory()) collect(rel);
      else if (entry.name.endsWith(".sql")) sql.push(readFileSync(join(ROOT, rel), "utf8"));
    }
  };
  for (const dir of migrationDirs) collect(dir);
  const allSql = sql.join("\n");
  for (const retired of RETIRED_RPCS) {
    if (!allSql.includes(retired.name)) {
      failures.push(
        `retired-rpc rule for \`${retired.name}\` matches nothing in any migration — the name is ` +
          `gone, so this rule is decorative. Update or delete it.`,
      );
    }
  }
}

// Object-store DELETE paths must classify absence from the BODY, never from the status alone.
//
// This rule exists because the same defect was written twice, in two files, with the same correct
// INTENT and the same wrong check: `if (!res.ok && res.status !== 404) throw`. Supabase Storage
// answers 400 — not 404 — for an object that is already gone, so a resumable erasure failed on every
// key a previous attempt had successfully deleted, and one hosted deletion job reached attempt 42
// stuck at `storage_erasure`. Fixing both instances is not enough: a third writer would reach for
// `!== 404` for exactly the same plausible reason.
//
// The rule is deliberately shaped as "if you issue a DELETE to the object store, you must reference
// the shared classifier" rather than as a forbidden pattern. A forbidden-pattern rule is trivially
// evaded by rephrasing the comparison; this one requires the decision to go through the one place
// where it is documented and tested.
const DELETE_CLASSIFIER = "classifySharedStoreDelete";
const DELETE_CLASSIFIER_HOME = "lib/server/sharedStoreDeleteClassification.ts";
for (const file of files) {
  if (file === DELETE_CLASSIFIER_HOME || file === GUARD_SELF) continue;
  if (!file.startsWith("lib/server/")) continue;
  const source = stripComments(readFileSync(join(ROOT, file), "utf8"));
  const issuesObjectDelete =
    /method:\s*["']DELETE["']/.test(source) && /\/object\/|sharedRestBase|restBase/.test(source);
  if (issuesObjectDelete && !source.includes(DELETE_CLASSIFIER)) {
    failures.push(
      `${file} issues an object-store DELETE without \`${DELETE_CLASSIFIER}\`.\n` +
        `    Supabase Storage answers 400, not 404, for an object that is already gone. Classifying ` +
        `absence\n    from the status alone makes a resumable erasure fail on every key a previous ` +
        `attempt removed —\n    and the fail-open version (any 400 means gone) lets a deletion ` +
        `finalize over data it never removed.`,
    );
  }
}

// ...and the classifier must still be reachable from the paths that need it, or the rule above is
// satisfied by a file that imports it and never calls it.
{
  let wired = 0;
  for (const file of files) {
    if (file === DELETE_CLASSIFIER_HOME) continue;
    const source = stripComments(readFileSync(join(ROOT, file), "utf8"));
    if (new RegExp(`\\b${DELETE_CLASSIFIER}\\s*\\(`).test(source)) wired += 1;
  }
  if (wired < 2) {
    failures.push(
      `\`${DELETE_CLASSIFIER}\` is CALLED in ${wired} file(s); both object-store delete paths ` +
        `(the identity store and the foundation transport) must use it, or one of them has silently ` +
        `gone back to classifying absence by status.`,
    );
  }
}

// A guard that silently matches nothing is worse than no guard: it reports success forever. Prove
// the rules still bind to real code by requiring each guarded symbol to exist somewhere it is allowed.
for (const rule of GUARDED) {
  const definedSomewhere = rule.allow.some((allowed) => {
    try {
      const source = readFileSync(join(ROOT, allowed), "utf8");
      return source.includes(rule.symbol.split(".").pop());
    } catch {
      return false;
    }
  });
  if (!definedSomewhere) {
    failures.push(
      `guard rule for \`${rule.symbol}\` matches nothing in its own allowlist — the symbol was ` +
        `renamed or removed, and this rule is now decorative. Update or delete it.`,
    );
  }
}

if (failures.length) {
  console.error("POR-1 raw-write source guard FAILED\n");
  for (const failure of failures) console.error(`  • ${failure}\n`);
  process.exit(1);
}

console.log(
  `POR-1 raw-write source guard: OK (${files.length} files, ${GUARDED.length} guarded symbols, ` +
    `${IDENTITY_KEY_LITERALS.length} identity key families, ${RETIRED_RPCS.length} retired rpcs)`,
);
