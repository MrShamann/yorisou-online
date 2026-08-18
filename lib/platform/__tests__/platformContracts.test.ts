// Platform contract guards.
//
// Three properties the reference architecture makes binding, enforced mechanically from day one so
// they are never a matter of review vigilance:
//
//   1. The registry declares exactly the twelve canonical capabilities, well-formed.
//   2. Event names obey the `family.event.vN` grammar, are unique, and no universal event exists.
//   3. The platform tier is brand-free (iron rule 3) and imports nothing from the product
//      application tier (no core→product inversion).
//
// Follows the osf1Boundaries.test.ts precedent: the boundary is asserted over data and file
// contents, so drift fails a test instead of surviving a review.

import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { DOMAIN_EVENTS_V1 } from "../events";
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

const PLATFORM_DIR = join(process.cwd(), "lib", "platform");

function platformSourceFiles(): string[] {
  return readdirSync(PLATFORM_DIR)
    .filter((entry) => entry.endsWith(".ts"))
    .map((entry) => join(PLATFORM_DIR, entry));
}

test("the registry declares exactly the twelve canonical capabilities", () => {
  const ids = CAPABILITY_MODULES.map((entry) => entry.module_id);
  assert.deepEqual([...ids].sort(), [...CANONICAL_IDS].sort());
  assert.equal(new Set(ids).size, ids.length, "duplicate module_id in the registry");
});

test("every registry entry is well-formed", () => {
  for (const entry of CAPABILITY_MODULES) {
    assert.match(entry.module_id, /^[a-z]+\.core$/, `${entry.module_id}: id grammar`);
    assert.match(entry.version, /^\d+\.\d+\.\d+$/, `${entry.module_id}: contract semver`);
    assert.ok(
      ["declared", "partial", "implemented", "deprecated"].includes(entry.status),
      `${entry.module_id}: status ${entry.status}`,
    );
    assert.ok(entry.purpose.length > 0, `${entry.module_id}: purpose is empty`);
  }
});

test("registry lookup answers for canonical ids and refuses unknown ids", () => {
  assert.equal(getCapabilityModule("state.core")?.module_id, "state.core");
  assert.equal(getCapabilityModule("not-a-module"), null);
  assert.equal(getCapabilityModule(""), null);
});

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
  // Families must trace to a declared capability, a kernel family, or a family alias the contracts
  // document declares — so an event cannot appear for a module that does not exist.
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

test("the platform tier is brand-free (iron rule 3)", () => {
  // The product name, the protected assessment's name, and the production host must not appear in
  // platform sources. Assembled from char codes so this test file itself stays clean under its own
  // rule when it moves or is copied.
  const forbidden = [
    String.fromCharCode(121, 111, 114, 105, 115, 111, 117), // the product name
    String.fromCharCode(105, 109, 97, 105, 114, 111), // the protected assessment
    String.fromCharCode(105, 109, 97, 45, 105, 114, 111), // its route slug
  ];
  for (const file of platformSourceFiles()) {
    const source = readFileSync(file, "utf8").toLowerCase();
    for (const word of forbidden) {
      assert.ok(!source.includes(word), `${file} contains the brand string "${word}"`);
    }
  }
});

test("the platform tier imports nothing from the product application tier", () => {
  // No core→product inversion: platform sources may import only siblings (./ or ../ within
  // lib/platform) and node builtins. An import of app/, lib/server/, product libs, or any package
  // is a boundary violation — the platform tier stays dependency-free by construction.
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
