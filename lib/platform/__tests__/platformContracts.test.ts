// Platform contract guards.
//
// The properties the reference architecture and the review remediation make binding, enforced
// mechanically so none of them is ever a matter of review vigilance:
//
//   1. The registry declares exactly the twelve canonical capabilities, well-formed, with the
//      three state axes (adoption / governance lifecycle / verification) distinct and coherent.
//   2. The Module Contract schema is a compatible SUPERSET of the active v0.7.0 Module Contract
//      Standard: every normative governance field maps losslessly onto a real schema field, and
//      every one of the twelve documented contracts carries every schema field.
//   3. Event names obey the `family.event.vN` grammar, are unique, no universal event exists, and
//      the governed envelope structurally supports every v0.7.0 traceability field, with the
//      event NAME as the single semantic source of the version.
//   4. The platform tier is brand-free (iron rule 3) — including no Japanese product copy — and
//      imports nothing from the product application tier (no core→product inversion).
//   5. Consent/permission declarations are coherent, discovery keeps its no-memory-write default,
//      and D-03 remains OPEN in the canon.
//
// Follows the osf1Boundaries.test.ts precedent: boundaries are asserted over data and file
// contents, so drift fails a test instead of surviving a review.

import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import {
  DOMAIN_EVENTS_V1,
  DOMAIN_EVENT_ENVELOPE_FIELDS,
  parseEventVersion,
} from "../events";
import { MODULE_CONTRACT_FIELDS, V070_FIELD_MAPPING } from "../moduleContract";
import { CAPABILITY_MODULES, getCapabilityModule } from "../registry";

const CANONICAL_IDS = [
  "state.core",
  "assessment.core",
  "discovery.core",
  "experience.core",
  "reflection.core",
  "continuity.core",
  "comparison.core",
  "sharing.core",
  "connection.core",
  "community.core",
  "matching.core",
  "recommendation.core",
];

// The v0.7.0 Module Contract Standard §4 normative schema plus the annex rule-2 "dependencies"
// requirement — stated here verbatim as the reference the mapping must cover completely.
const V070_NORMATIVE_FIELDS = [
  "module_id",
  "name",
  "version",
  "category",
  "description",
  "purpose",
  "user_problem",
  "target_users",
  "input_schema",
  "output_schema",
  "required_kernel_services",
  "memory_access",
  "memory_write_scope",
  "permission_scope",
  "agent_requirements",
  "localization_requirements",
  "regional_adapters",
  "external_dependencies",
  "data_owner",
  "privacy_class",
  "risk_class",
  "commercial_status",
  "revenue_model",
  "dependencies",
  "lifecycle_state",
  "verification_state",
  "rollback_method",
];

// The v0.7.0 API/Event Architecture §7.1 governed-envelope fields. `event_type` is carried by the
// envelope's `name` (the canonical event name IS the type) — the one declared naming difference.
const V070_ENVELOPE_FIELDS = [
  "event_id",
  "event_type",
  "event_version",
  "occurred_at",
  "recorded_at",
  "subject_ref",
  "actor_ref",
  "source_module",
  "correlation_id",
  "causation_id",
  "data_class",
  "permission_context",
  "payload",
  "provenance",
];
const ENVELOPE_NAME_MAPPING: Record<string, string> = { event_type: "name" };

const PLATFORM_DIR = join(process.cwd(), "lib", "platform");
const CONTRACTS_DOC = join(process.cwd(), "docs", "architecture", "YORISOU_MODULE_CONTRACTS_V1.md");

function platformSourceFiles(): string[] {
  return readdirSync(PLATFORM_DIR)
    .filter((entry) => entry.endsWith(".ts"))
    .map((entry) => join(PLATFORM_DIR, entry));
}

/** The twelve per-module yaml blocks from the contracts document (schema block excluded). */
function moduleContractBlocks(): Map<string, string> {
  const doc = readFileSync(CONTRACTS_DOC, "utf8");
  const blocks = new Map<string, string>();
  for (const match of doc.matchAll(/```yaml\n([\s\S]*?)```/g)) {
    const id = /^module_id: ([a-z]+\.core)$/m.exec(match[1])?.[1];
    if (id) blocks.set(id, match[1]);
  }
  return blocks;
}

// ── registry ─────────────────────────────────────────────────────────────────

test("the registry declares exactly the twelve canonical capabilities", () => {
  const ids = CAPABILITY_MODULES.map((entry) => entry.module_id);
  assert.deepEqual([...ids].sort(), [...CANONICAL_IDS].sort());
  assert.equal(new Set(ids).size, ids.length, "duplicate module_id in the registry");
});

test("every registry entry is well-formed across the three distinct state axes", () => {
  const LIFECYCLES = ["IDEA", "DEFINED", "PROTOTYPE", "VALIDATED", "INSTALLED", "ENABLED", "SUSPENDED", "RETIRED"];
  const VERIFICATIONS = ["not_verified", "validated", "founder_approved"];
  const ADOPTIONS = ["declared", "partial", "implemented", "deprecated"];
  const PRIVACY = ["personal_sensitive", "personal", "operational", "public_derivative"];
  for (const entry of CAPABILITY_MODULES) {
    assert.match(entry.module_id, /^[a-z]+\.core$/, `${entry.module_id}: id grammar`);
    assert.match(entry.version, /^\d+\.\d+\.\d+$/, `${entry.module_id}: contract semver`);
    assert.ok(ADOPTIONS.includes(entry.adoption_status), `${entry.module_id}: adoption_status`);
    assert.ok(LIFECYCLES.includes(entry.lifecycle_state), `${entry.module_id}: lifecycle_state vocabulary`);
    assert.ok(VERIFICATIONS.includes(entry.verification_state), `${entry.module_id}: verification_state vocabulary`);
    assert.ok(PRIVACY.includes(entry.privacy_class), `${entry.module_id}: privacy_class vocabulary`);
    assert.ok(entry.purpose.length > 0, `${entry.module_id}: purpose is empty`);
  }
});

test("lifecycle and verification stay truthful while no module is implemented", () => {
  // Validation and activation are separate gates (v0.7.0 annex rule 7). While a module's adoption
  // is only declared/partial, its governance lifecycle can honestly be no further than DEFINED and
  // it cannot claim verification.
  for (const entry of CAPABILITY_MODULES) {
    if (entry.adoption_status === "declared" || entry.adoption_status === "partial") {
      assert.equal(entry.lifecycle_state, "DEFINED", `${entry.module_id}: lifecycle overstates adoption`);
      assert.equal(entry.verification_state, "not_verified", `${entry.module_id}: verification overstates evidence`);
    }
  }
});

test("registry lookup answers for canonical ids and refuses unknown ids", () => {
  assert.equal(getCapabilityModule("state.core")?.module_id, "state.core");
  assert.equal(getCapabilityModule("not-a-module"), null);
  assert.equal(getCapabilityModule(""), null);
});

// ── schema compatibility (the superset rule) ────────────────────────────────

test("the contract schema is a compatible superset of the v0.7.0 normative schema", () => {
  const fieldSet = new Set<string>(MODULE_CONTRACT_FIELDS);
  for (const governanceField of V070_NORMATIVE_FIELDS) {
    const mapped = (V070_FIELD_MAPPING as Record<string, string>)[governanceField];
    assert.ok(mapped, `v0.7.0 field "${governanceField}" has no mapping — the superset rule is broken`);
    assert.ok(fieldSet.has(mapped), `v0.7.0 field "${governanceField}" maps to "${mapped}", which is not a schema field`);
  }
  assert.equal(new Set(MODULE_CONTRACT_FIELDS).size, MODULE_CONTRACT_FIELDS.length, "duplicate schema field");
});

test("all twelve documented contracts carry every schema field", () => {
  const blocks = moduleContractBlocks();
  assert.deepEqual([...blocks.keys()].sort(), [...CANONICAL_IDS].sort(), "doc blocks != canonical modules");
  for (const [id, block] of blocks) {
    for (const field of MODULE_CONTRACT_FIELDS) {
      assert.ok(new RegExp(`^${field}:`, "m").test(block), `${id}: missing schema field "${field}"`);
    }
  }
});

// ── events ───────────────────────────────────────────────────────────────────

test("event names obey the family.event.vN grammar and are unique", () => {
  for (const name of DOMAIN_EVENTS_V1) {
    assert.match(name, /^[a-z][a-z_]*\.[a-z][a-z_]*\.v[0-9]+$/, `event grammar: ${name}`);
  }
  assert.equal(new Set(DOMAIN_EVENTS_V1).size, DOMAIN_EVENTS_V1.length, "duplicate event name");
});

test("no meaningless universal event exists", () => {
  // An event that means everything carries no contract at all. The architecture forbids the
  // `user_intelligence_updated` shape by name; the guard refuses any family-free catch-all.
  for (const name of DOMAIN_EVENTS_V1) {
    assert.ok(!/intelligence/.test(name), `universal-event shape: ${name}`);
    assert.ok(!/^user\./.test(name), `events name a capability family, not "user": ${name}`);
  }
});

test("every event family traces to a declaring contract", () => {
  const capabilityFamilies = new Set(CAPABILITY_MODULES.map((entry) => entry.module_id.split(".")[0]));
  const kernelFamilies = new Set(["memory", "public_result"]);
  const declaredAliases = new Set([
    "share", // sharing.core's event family
    "weekly_reflection", // reflection.core (weekly artifact)
    "pattern", // continuity.core (pattern candidates)
    "return", // continuity.core (return references)
  ]);
  for (const name of DOMAIN_EVENTS_V1) {
    const family = name.split(".")[0];
    assert.ok(
      capabilityFamilies.has(family) || kernelFamilies.has(family) || declaredAliases.has(family),
      `event family "${family}" (${name}) has no declaring contract`,
    );
  }
});

test("the envelope structurally supports every v0.7.0 governed-event field", () => {
  const envelope = new Set<string>(DOMAIN_EVENT_ENVELOPE_FIELDS);
  for (const field of V070_ENVELOPE_FIELDS) {
    const carried = ENVELOPE_NAME_MAPPING[field] ?? field;
    assert.ok(envelope.has(carried), `governed envelope is missing "${field}" (as "${carried}")`);
  }
});

test("the event NAME is the single semantic source of the version", () => {
  for (const name of DOMAIN_EVENTS_V1) {
    const parsed = parseEventVersion(name);
    assert.ok(Number.isInteger(parsed) && parsed >= 1, `unparseable version: ${name}`);
    assert.ok(name.endsWith(`.v${parsed}`), `parser disagrees with name: ${name}`);
  }
  assert.throws(() => parseEventVersion("state.checkin_completed" as never), "a name without .vN must be rejected");
});

// ── brand isolation + inversion ─────────────────────────────────────────────

test("the platform tier is brand-free (iron rule 3), including no Japanese product copy", () => {
  // The product name, the protected assessment's name, and its route slug must not appear in
  // platform sources; nor may any Japanese product copy (all consumer copy arrives via packs).
  // Brand strings are assembled from char codes so this test file itself stays clean under its
  // own rule when it moves or is copied.
  const forbidden = [
    String.fromCharCode(121, 111, 114, 105, 115, 111, 117), // the product name
    String.fromCharCode(105, 109, 97, 105, 114, 111), // the protected assessment
    String.fromCharCode(105, 109, 97, 45, 105, 114, 111), // its route slug
  ];
  for (const file of platformSourceFiles()) {
    const source = readFileSync(file, "utf8");
    const lower = source.toLowerCase();
    for (const word of forbidden) {
      assert.ok(!lower.includes(word), `${file} contains the brand string "${word}"`);
    }
    assert.ok(
      !/[぀-ヿ一-鿿]/.test(source),
      `${file} contains Japanese text — product copy never lives in the platform tier`,
    );
  }
});

test("the platform tier imports nothing from the product application tier", () => {
  // No core→product inversion: platform sources may import only same-directory siblings and node
  // builtins. Anything else — app/, lib/server/, product libs, packages — is a boundary violation.
  const importPattern = /(?:from\s+|import\s*\(\s*)["']([^"']+)["']/g;
  for (const file of platformSourceFiles()) {
    const source = readFileSync(file, "utf8");
    for (const match of source.matchAll(importPattern)) {
      const specifier = match[1];
      assert.ok(
        specifier.startsWith("./") || specifier.startsWith("node:"),
        `${file} imports "${specifier}" — the platform tier imports only same-directory siblings and node builtins`,
      );
    }
  }
});

// ── consent/permission coherence + governed-memory posture ──────────────────

test("permission and consent declarations are coherent in every contract", () => {
  for (const [id, block] of moduleContractBlocks()) {
    const kernelServices = /^required_kernel_services: \[([^\]]*)\]/m.exec(block)?.[1] ?? "";
    const permissionsRequired = /^permissions_required: \[([^\]]*)\]/m.exec(block)?.[1] ?? "";
    if (permissionsRequired.trim().length > 0) {
      assert.ok(
        /\bpermissions\b/.test(kernelServices),
        `${id}: declares permissions_required but not the "permissions" kernel service`,
      );
    }
    const externalReads = /^readable_external_data: \[([^\]]*)\]/m.exec(block)?.[1] ?? "";
    if (/consent|grant/i.test(externalReads)) {
      assert.ok(
        /\bconsent\b/.test(kernelServices),
        `${id}: reads consented/granted external data but not the "consent" kernel service`,
      );
    }
  }
});

test("governed-memory posture holds: no writes, discovery defaults, candidates stay candidates", () => {
  const blocks = moduleContractBlocks();
  for (const [id, block] of blocks) {
    assert.ok(/^memory_write_scope: none$/m.test(block), `${id}: memory_write_scope must be "none" in V1`);
  }
  const discovery = blocks.get("discovery.core") ?? "";
  assert.ok(discovery.includes("memory_write = false"), "discovery.core lost its memory_write = false default");
  assert.ok(discovery.includes("life_graph_write = false"), "discovery.core lost its life_graph_write = false default");
  const doc = readFileSync(CONTRACTS_DOC, "utf8");
  assert.ok(/D-03 OPEN/.test(doc), "the contracts document no longer states that D-03 is OPEN");
  assert.ok(
    /`PossibleMemoryCandidate` is not a\s+`ConfirmedMemory`/.test(doc),
    "the candidate-vs-confirmed-memory rule is no longer stated",
  );
});
