// POR-1 — tracked evidence must never carry a credential or a full identity.
//
// WHY GITLEAKS WAS NOT ENOUGH.
//
// A plaintext synthetic password was committed into
// `docs/ux2r/evidence/por1-m3-principal-c-journey.json` and every gitleaks run on this branch
// reported "no leaks found". It was right by its own rules: the value matched no provider pattern —
// it was not an AWS key, a JWT, or an `sk-` token. It was just a password-shaped string in a field
// literally named `password`.
//
// That is the gap this closes. Generic scanners look for the SHAPE of known secrets; evidence files
// need a scanner that looks for the SHAPE OF EVIDENCE — a credential field, a full synthetic email,
// an unmasked account id — regardless of what the value looks like.
//
// The account in question was local-only on a destroyed disposable database and the domain is RFC
// 2606 reserved, so nothing was reachable. The pattern would have been identical had the target not
// been localhost, which is the whole reason for a permanent guard rather than a one-time cleanup.
//
//   node scripts/por1/evidence-secret-guard.mjs

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const SCANNED_PATHS = ["docs/ux2r/evidence", "docs/ux2r", "supabase/contracts"];

/**
 * Each rule names something that must never appear in tracked evidence, and says why in the
 * failure message — a guard whose output is just a regex teaches nobody what to do instead.
 */
const RULES = [
  {
    id: "credential-field",
    // A JSON field named like a credential, holding anything non-empty.
    pattern: /"(password|passphrase|secret|token|apiKey|api_key|accessKey|access_key|serviceRoleKey|bearer)"\s*:\s*"[^"]+"/i,
    why: "a credential field with a value. Evidence may carry a one-way digest, never the value.",
  },
  {
    id: "authorization-header",
    pattern: /"?authorization"?\s*[:=]\s*"?(Bearer|Basic)\s+\S+/i,
    why: "an Authorization header. Record the outcome, never the credential that produced it.",
  },
  {
    id: "full-synthetic-email",
    // The reserved synthetic domains this project uses. A digest is fine; the address is not.
    pattern: /[A-Za-z0-9._%+-]+@(synthetic-preview\.invalid|example\.test|example\.com)/,
    why: "a full synthetic email address. Use a digest — a real address in the same field shape would be indistinguishable.",
  },
  {
    id: "unmasked-account-id",
    // `acct_…` ids are 31 chars here; anything that long is the whole identifier, not a prefix.
    pattern: /"[a-zA-Z]*[Oo]wner[a-zA-Z]*(AccountId|Id)"\s*:\s*"acct_[A-Za-z0-9]{12,}"/,
    why: "an unmasked account id. Truncate to a prefix or store a digest.",
  },
  {
    id: "session-cookie",
    pattern: /"(yorisou_session|yorisou_account)"\s*:\s*"[^"]+"/,
    why: "a session or account cookie value. These are credentials.",
  },
  {
    id: "known-retired-credential",
    // The exact value that was committed, so a revert or a cherry-pick cannot quietly restore it.
    // Expressed as a pattern rather than the literal so this file is not itself an occurrence.
    pattern: /Por1-C-Str0ng-Pass/,
    why: "the retired fixed synthetic password. Credentials are generated per run and never persisted.",
  },
];

const tracked = execFileSync("git", ["ls-files", ...SCANNED_PATHS], { encoding: "utf8" })
  .split("\n")
  .map((f) => f.trim())
  .filter(Boolean);

const findings = [];
for (const file of tracked) {
  let content;
  try { content = readFileSync(file, "utf8"); } catch { continue; }
  for (const rule of RULES) {
    const match = rule.pattern.exec(content);
    if (!match) continue;
    // The matched text is NEVER printed — reporting a secret to prove it exists defeats the point.
    const line = content.slice(0, match.index).split("\n").length;
    findings.push({ file, line, rule: rule.id, why: rule.why });
  }
}

console.log(JSON.stringify({ scanned: tracked.length, paths: SCANNED_PATHS, findings: findings.length }));
for (const f of findings) {
  console.error(`  ${f.file}:${f.line}  [${f.rule}] ${f.why}`);
}
if (findings.length > 0) {
  console.error("\nEvidence must carry outcomes and digests, not identities and credentials.");
  process.exit(1);
}
console.log("no credential or full identity in tracked evidence");
