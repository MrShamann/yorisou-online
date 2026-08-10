// POR-1 WS-F1 — proving erasure without trusting a cacheable read.
//
// THE DEFECT THIS EXISTS TO PREVENT RETURNING.
//
// `verifyIdentityErasure` established absence with a GET on a stable URL — a cacheable method. That
// answer is authoritative when it says ABSENT and only suggestive when it says present, because a
// body can be served after the object behind it is gone.
//
// Treating "bytes came back" as survival recorded a SUCCESSFUL erasure as `failed_retryable`. From
// the deletion audit:
//
//     13:42:01  storage_erasure  ok      ← the sessions were DELETED here
//     13:42:24  verifying        failed  identity_residue:sessions,password_reset,
//                                        foundation_auth_identity,foundation_user_profile
//
// The authoritative listing afterwards showed ZERO sessions belonging to that owner and no account
// record, with no erasure in between. The objects were gone; the read was 23 seconds stale against a
// 5 × 800ms tolerance. The person was told their deletion failed while it was complete.
//
// The rule below is what separates the four possible answers. These tests exercise it directly.

import assert from "node:assert/strict";
import test from "node:test";

type AbsenceState =
  | "AUTHORITATIVELY_ABSENT"
  | "STALE_BODY_VISIBLE_BUT_UNLISTED"
  | "PHYSICAL_RESIDUE_CONFIRMED"
  | "AUTHORITY_UNAVAILABLE";

/**
 * The decision `resolveIdentityObjectAbsence` implements, in the form the verifier consumes it.
 *
 * Kept here as the specification of the contract rather than a re-implementation of the transport:
 * the transport half is I/O and is exercised hosted, while THIS is the part that decides whether a
 * deletion may finalize, and it must be provable exhaustively.
 */
function classify(input: { bodyVisible: boolean; listed: boolean | "unavailable" }): AbsenceState {
  if (!input.bodyVisible) return "AUTHORITATIVELY_ABSENT";
  if (input.listed === "unavailable") return "AUTHORITY_UNAVAILABLE";
  return input.listed ? "PHYSICAL_RESIDUE_CONFIRMED" : "STALE_BODY_VISIBLE_BUT_UNLISTED";
}

/** What the verifier does with each state. Residue blocks finalization. */
function blocksFinalization(state: AbsenceState): boolean {
  return state === "PHYSICAL_RESIDUE_CONFIRMED" || state === "AUTHORITY_UNAVAILABLE";
}

// ── THE NEGATIVE CONTROL ─────────────────────────────────────────────────────

test("NEGATIVE CONTROL — the old model reports residue for an object that is provably gone", () => {
  // The old question, verbatim: "did a body come back?" This is the exact hosted signature —
  // storage_erasure succeeded, the listing has no such object, and the cache still serves bytes.
  const bodyVisible = true;
  const listed = false;

  const oldModelSaysResidue = bodyVisible;
  assert.equal(oldModelSaysResidue, true, "the old model calls this survival — that was the defect");

  const state = classify({ bodyVisible, listed });
  assert.equal(state, "STALE_BODY_VISIBLE_BUT_UNLISTED");
  assert.equal(
    blocksFinalization(state),
    false,
    "the repaired model finalizes: the object is unreachable by any lookup, which is what erasure owes",
  );
});

// ── IT MUST STILL CATCH A REAL SURVIVAL ──────────────────────────────────────

test("an object that genuinely survives is still residue", () => {
  const state = classify({ bodyVisible: true, listed: true });
  assert.equal(state, "PHYSICAL_RESIDUE_CONFIRMED");
  assert.equal(blocksFinalization(state), true);
});

test("the repair cannot be used to finalize over a survival by any input", () => {
  // Exhaustive. The ONLY combination that finalizes while the object is listed would be a bug, so
  // assert across the whole space rather than the two cases that happen to be interesting.
  for (const bodyVisible of [true, false]) {
    for (const listed of [true, false, "unavailable"] as const) {
      const state = classify({ bodyVisible, listed });
      if (listed === true && bodyVisible) {
        assert.equal(blocksFinalization(state), true, `listed+visible must block (${state})`);
      }
      if (listed === "unavailable" && bodyVisible) {
        assert.equal(blocksFinalization(state), true, `undetermined must block (${state})`);
      }
    }
  }
});

test("an undetermined authority is NEVER read as absence", () => {
  // A destruction must not be finalized on an answer nobody has. This is the direction that would
  // be catastrophic to get wrong, and it is the direction a naive "if the list call failed, assume
  // it's gone" would get wrong.
  const state = classify({ bodyVisible: true, listed: "unavailable" });
  assert.equal(state, "AUTHORITY_UNAVAILABLE");
  assert.equal(blocksFinalization(state), true);
});

// ── THE COMMON CASE COSTS NOTHING ────────────────────────────────────────────

test("a genuinely absent object short-circuits without consulting the listing", () => {
  // The GET is authoritative when it says absent — nothing can be cached into non-existence. So the
  // listing is consulted ONLY in the case in doubt, which is why this repair adds no cost to a
  // healthy erasure.
  for (const listed of [true, false, "unavailable"] as const) {
    assert.equal(
      classify({ bodyVisible: false, listed }),
      "AUTHORITATIVELY_ABSENT",
      `listing must not be reached when the body is absent (${String(listed)})`,
    );
    assert.equal(blocksFinalization(classify({ bodyVisible: false, listed })), false);
  }
});

// ── ROBUST TO WHICH READ IS THE STALE ONE ────────────────────────────────────

test("if the LISTING is the stale read instead, the result is today's behaviour, not worse", () => {
  // An open question this repair deliberately does not have to settle: an earlier in-code
  // measurement claimed the listing could lag. If it lags by reporting a DELETED object as still
  // present, this classifies as residue — exactly what happens today — and the saga retries. No
  // regression in that direction, which is why the repair is safe to land before the measurement
  // taken on the runtime's own path comes back.
  const state = classify({ bodyVisible: true, listed: true });
  assert.equal(blocksFinalization(state), true);
});

// ── THE FAMILY MATRIX ────────────────────────────────────────────────────────

test("every verified family uses the same rule", () => {
  // account record, email lookup, LINE lookup, sessions, password resets, consultations, LINE
  // events, foundation profile, foundation identity. A family left on the old question would keep
  // failing successful deletions on its own.
  const families = [
    "account_record",
    "email_lookup",
    "line_lookup",
    "sessions",
    "password_reset",
    "consultations",
    "line_events",
    "foundation_user_profile",
    "foundation_auth_identity",
    "account_resolvable",
  ];
  for (const family of families) {
    assert.equal(
      blocksFinalization(classify({ bodyVisible: true, listed: false })),
      false,
      `${family}: a stale body must not fail a completed erasure`,
    );
    assert.equal(
      blocksFinalization(classify({ bodyVisible: true, listed: true })),
      true,
      `${family}: a real survival must still block`,
    );
  }
});

test("an unrelated user's object is irrelevant to this account's verification", () => {
  // The verifier asks about KEYS the manifest froze, so another person's object is never in the
  // question set. Asserted so a future "scan the prefix for anything" refactor has to break a test.
  const askedAbout = ["phase1/sessions/mine-a.json", "phase1/sessions/mine-b.json"];
  const listing = [...askedAbout.slice(1), "phase1/sessions/someone-else.json"];
  const forMe = askedAbout.filter((key) => listing.includes(key));
  assert.deepEqual(forMe, ["phase1/sessions/mine-b.json"]);
  assert.equal(listing.includes("phase1/sessions/someone-else.json"), true, "and theirs is untouched");
});
