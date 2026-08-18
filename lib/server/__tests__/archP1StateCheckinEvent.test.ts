// ARCH-P1 — the first typed-event seam, proven rather than described.
//
// What must stay true, forever, about `state.checkin_completed.v1`:
//
//   A. it is built from the canonical governed contract (name, parsed version, module, permission,
//      provenance, data class, every envelope field present);
//   B. its payload is privacy-minimal — a reference, a bounded source, a count; never content;
//   C. it translates into exactly ONE existing asynchronous audit write, preserving the record
//      reference and carrying safe trace metadata;
//   D. sink unavailability does not fail a persisted check-in (asynchronous semantics inherited);
//   E. only the Today check-in is eligible — `manual` (and anything future) is refused by the
//      builder itself, so a caller cannot mislabel arbitrary state creation;
//   F. the adopted route path cannot double-audit: the direct `state.created` call survives only
//      in the non-check-in branch (structural proof over the route source, in the
//      osf1Boundaries.test.ts tradition);
//   G. the platform tier still imports no product code (covered by test:platform-contracts, which
//      runs alongside this file in CI).

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { DOMAIN_EVENT_ENVELOPE_FIELDS, parseEventVersion } from "@/lib/platform/events";
import { createDomainEvent } from "@/lib/platform/domainEvent";
import {
  deliverStateCheckinCompleted,
  stateCheckinCompletedEvent,
} from "@/lib/server/platform/stateCheckinEvent";

const OWNER = "acct_arch_p1_test_owner";
const RECORD = "3f2b8a1c-9d4e-4f6a-8b2c-1a5d7e9f0b3c";

function buildEvent() {
  const event = stateCheckinCompletedEvent({
    ownerAccountId: OWNER,
    stateRecordId: RECORD,
    source: "today_check_in",
    tagCount: 3,
  });
  assert.ok(event, "today_check_in must be eligible");
  return event;
}

// ── A. canonical event creation ─────────────────────────────────────────────

test("the completion event is canonical: name, version, module, permission, provenance, class", () => {
  const event = buildEvent();
  assert.equal(event.name, "state.checkin_completed.v1");
  assert.equal(event.event_version, parseEventVersion(event.name));
  assert.equal(event.event_version, 1);
  assert.equal(event.source_module, "state.core");
  assert.equal(event.permission_context, "write:own_state");
  assert.equal(event.provenance, "user_action");
  assert.equal(event.data_class, "life_history");
});

test("the envelope carries every governed field", () => {
  const event = buildEvent();
  for (const field of DOMAIN_EVENT_ENVELOPE_FIELDS) {
    assert.ok(field in event, `envelope field missing: ${field}`);
  }
  assert.ok(event.event_id.length > 0, "event_id must exist before the first seam (idempotency anchor)");
  assert.ok(event.occurred_at <= event.recorded_at, "recorded_at must not precede occurred_at");
  assert.equal(event.correlation_id, null, "no parent workflow exists — none may be invented");
  assert.equal(event.causation_id, null, "no parent domain event exists — none may be invented");
  assert.equal(event.actor_ref, null, "actor is the subject, so actor_ref stays null");
});

test("subject_ref is an opaque fingerprint, never the raw account id", () => {
  const event = buildEvent();
  assert.match(event.subject_ref ?? "", /^[0-9a-f]{64}$/, "subject_ref must be a sha256 hex fingerprint");
  assert.notEqual(event.subject_ref, OWNER);
  assert.ok(!JSON.stringify(event).includes(OWNER), "the raw account id must not appear anywhere in the envelope");
});

test("the factory refuses a non-canonical event name", () => {
  assert.throws(
    () =>
      createDomainEvent({
        // Force a name outside the canonical list through the type system on purpose.
        name: "state.checkin_exploded.v1" as never,
        source_module: "state.core",
        permission_context: "write:own_state",
        provenance: "user_action",
        data_class: "operational",
        subject_ref: null,
        payload: {},
      }),
    /not a canonical domain event/,
  );
});

// ── B. privacy-minimal payload ──────────────────────────────────────────────

test("the payload is exactly {state_record_ref, source, tag_count} — content never crosses", () => {
  const event = buildEvent();
  assert.deepEqual(Object.keys(event.payload).sort(), ["source", "state_record_ref", "tag_count"]);
  assert.equal(event.payload.state_record_ref, RECORD);
  assert.equal(event.payload.source, "today_check_in");
  assert.equal(event.payload.tag_count, 3);
  const serialized = JSON.stringify(event.payload);
  assert.ok(!/[぀-ヿ一-鿿]/.test(serialized), "no Japanese product copy in the payload");
  assert.ok(!serialized.includes(OWNER), "no account identity in the payload");
});

// ── C + F(unit half). event → existing audit, exactly once ──────────────────

test("delivery produces exactly one state.created audit write with trace metadata", async () => {
  const calls: Array<Record<string, unknown>> = [];
  const event = buildEvent();
  await deliverStateCheckinCompleted(event, OWNER, (async (input: Record<string, unknown>) => {
    calls.push(input);
  }) as never);
  assert.equal(calls.length, 1, "exactly ONE audit write for the adopted path");
  const call = calls[0] as {
    ownerAccountId: string;
    action: string;
    entityKind: string;
    entityRef: string;
    reason: string;
    detail: Record<string, string | number | boolean>;
  };
  assert.equal(call.action, "yorisou.life.state.created");
  assert.equal(call.entityKind, "current_state");
  assert.equal(call.entityRef, RECORD, "the record reference must be preserved");
  assert.equal(call.reason, "today_check_in");
  assert.equal(call.detail.tags, 3, "the established tag-count detail survives");
  assert.equal(call.detail.event, "state.checkin_completed.v1");
  assert.equal(call.detail.event_version, 1);
  assert.equal(call.detail.event_id, event.event_id, "trace metadata carries the idempotency anchor");
  for (const value of Object.values(call.detail)) {
    assert.ok(["string", "number", "boolean"].includes(typeof value), "audit detail stays flat scalars");
  }
});

// ── D. failure semantics unchanged ──────────────────────────────────────────

test("sink unavailability does not fail a persisted check-in (asynchronous class inherited)", async () => {
  // The real auditLifeOs with NO store configured returns without throwing — the same best-effort
  // behavior the direct call always had. Delivery must inherit it, adding no semantics of its own.
  const priorUrl = process.env.SUPABASE_URL;
  const priorKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  try {
    await assert.doesNotReject(deliverStateCheckinCompleted(buildEvent(), OWNER));
  } finally {
    if (priorUrl !== undefined) process.env.SUPABASE_URL = priorUrl;
    if (priorKey !== undefined) process.env.SUPABASE_SERVICE_ROLE_KEY = priorKey;
  }
});

// ── E. semantic eligibility ─────────────────────────────────────────────────

test("a manual state record is NOT a check-in completion", () => {
  const event = stateCheckinCompletedEvent({
    ownerAccountId: OWNER,
    stateRecordId: RECORD,
    source: "manual",
    tagCount: 2,
  });
  assert.equal(event, null, "only source=today_check_in may produce state.checkin_completed.v1");
});

test("failed persistence cannot produce an event: the builder requires a persisted record id", () => {
  // The timing invariant is structural: the route constructs the event FROM the id that
  // createCurrentStateRecord returned. No id, no event — proven over the route source below, and
  // here by the builder's own contract (it has no side channel to a record that does not exist).
  const source = readFileSync(join(process.cwd(), "app", "api", "life", "state", "route.ts"), "utf8");
  const createIndex = source.indexOf("await createCurrentStateRecord(");
  const eventIndex = source.indexOf("stateCheckinCompletedEvent({");
  assert.ok(createIndex >= 0 && eventIndex >= 0, "both seam calls must exist in the route");
  assert.ok(createIndex < eventIndex, "the event is constructed only AFTER persistence succeeds");
});

// ── F(structural half). the route cannot double-audit the adopted path ──────

test("route structure: event path and direct audit are exclusive branches, one audit each", () => {
  const source = readFileSync(join(process.cwd(), "app", "api", "life", "state", "route.ts"), "utf8");
  const createdMatches = source.match(/yorisou\.life\.state\.created/g) ?? [];
  assert.equal(
    createdMatches.length,
    1,
    "the direct state.created call exists exactly once — the non-check-in fallback branch",
  );
  assert.match(
    source,
    /if \(completion\) \{\s*await deliverStateCheckinCompleted\(completion, gate\.viewer\.accountId\);\s*\} else \{/,
    "the event delivery and the direct audit are mutually exclusive branches",
  );
  assert.ok(
    !source.includes('"state.checkin_completed.v1"'),
    "the route never hand-assembles the canonical event — only the adapter builds it",
  );
});
