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
    `${IDENTITY_KEY_LITERALS.length} identity key families)`,
);
