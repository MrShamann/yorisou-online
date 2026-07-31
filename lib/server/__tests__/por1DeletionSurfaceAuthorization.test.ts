// POR-1 WS-F — the deletion-surface authorization boundary.
//
// THE DEFECT THESE EXIST TO PREVENT RETURNING.
//
// `GET /api/account/deletion-status` answered 200 to a person who had been erased, because the
// viewer resolver fell back to the encrypted `yorisou_account` cookie whenever the store record was
// missing — which, after a completed deletion, is always. The only check applied to that fallback
// was `sessionMayActAsAccount`, which reads `deletionLockedAt`: a field that was `null` when the
// cookie was minted and that the server can never update in a cookie it no longer writes.
//
// Two requirements had to survive the repair, and they pull in opposite directions:
//
//   A. A person whose account is held, or whose identity objects are being erased right now, must
//      still be able to see the deletion they asked for.
//   B. After it completes, no combination of surviving cookies may authenticate that identity.
//
// The rule below is what separates them, and these tests exercise it directly rather than a
// restatement of it.

import assert from "node:assert/strict";
import test from "node:test";

import {
  decideCookieRestoredViewer,
  sessionMayActAsAccount,
  type ViewerSurface,
} from "../accountDeletionLock";

/** What a cookie minted before the deletion carries: no marker at all. */
const STALE_COOKIE_MARKER = null;

const ERASING = [
  "locked",
  "database_erasure",
  "storage_erasure",
  "identity_erasure",
  "verifying",
] as const;

function decide(input: {
  surface: ViewerSurface;
  durableDeletionState: string | null;
  irreversibleStarted?: boolean;
  deletionLockedAt?: string | null;
}) {
  return decideCookieRestoredViewer({
    surface: input.surface,
    deletionLockedAt: input.deletionLockedAt ?? STALE_COOKIE_MARKER,
    durableDeletionState: input.durableDeletionState,
    irreversibleStarted: input.irreversibleStarted ?? false,
  });
}

// ── THE NEGATIVE CONTROL ─────────────────────────────────────────────────────
//
// Reproduces the pre-fix 200 and shows exactly which check was missing. Without this the suite
// could pass against a repair that never actually addressed the reported defect.

test("NEGATIVE CONTROL — the only pre-fix check passes an erased account, which is why it answered 200", () => {
  // This is the entire authorization the surviving cookie used to face. It says yes.
  assert.equal(
    sessionMayActAsAccount(STALE_COOKIE_MARKER),
    true,
    "a cookie minted before the deletion carries no marker, so the marker check cannot refuse it",
  );

  // And this is what now stands behind it. It says no.
  assert.deepEqual(decide({ surface: "deletion_surface", durableDeletionState: "completed" }), {
    resolves: false,
    reason: "account_deleted",
  });
});

// ── REQUIREMENT B — post-deletion denial ─────────────────────────────────────

test("a completed deletion is refused on EVERY surface, whatever the cookie carries", () => {
  for (const surface of ["ordinary", "deletion_surface"] as const) {
    for (const deletionLockedAt of [null, undefined, "2026-07-31T00:00:00.000Z"]) {
      for (const irreversibleStarted of [true, false]) {
        assert.deepEqual(
          decideCookieRestoredViewer({
            surface,
            deletionLockedAt,
            durableDeletionState: "completed",
            irreversibleStarted,
          }),
          { resolves: false, reason: "account_deleted" },
          `${surface} / marker=${String(deletionLockedAt)} / crossed=${irreversibleStarted}`,
        );
      }
    }
  }
});

test("completion is reachable at all only because the status read falls back to the fingerprint", () => {
  // Finalization sets `owner_account_id = null`, so a lookup by account id finds nothing. If the
  // durable read reported "no job" instead of "completed", the rule below would allow the cookie —
  // which is precisely the store-blip case it is meant to tolerate. The distinction is the whole
  // repair, so it is asserted rather than assumed.
  assert.deepEqual(decide({ surface: "ordinary", durableDeletionState: null }), { resolves: true });
  assert.deepEqual(decide({ surface: "ordinary", durableDeletionState: "completed" }), {
    resolves: false,
    reason: "account_deleted",
  });
});

test("an erased account cannot act on ordinary surfaces once erasure has crossed", () => {
  for (const state of ERASING) {
    assert.deepEqual(
      decide({ surface: "ordinary", durableDeletionState: state, irreversibleStarted: true }),
      { resolves: false, reason: "account_deleted" },
      state,
    );
  }
});

test("a job that failed TERMINALLY past the crossing is still an erased account", () => {
  // The gap the state string alone could not see: `failed_terminal` is neither `ERASED_OR_ERASING`
  // nor `HELD`, so before the recorded fact was consulted this read as "allow" — handing back an
  // account whose identity had already been destroyed.
  assert.deepEqual(
    decide({ surface: "ordinary", durableDeletionState: "failed_terminal", irreversibleStarted: true }),
    { resolves: false, reason: "account_deleted" },
  );
});

// ── REQUIREMENT A — in-flight visibility ─────────────────────────────────────

test("a held account can still read its own in-flight deletion", () => {
  assert.deepEqual(decide({ surface: "deletion_surface", durableDeletionState: "locked" }), {
    resolves: true,
  });
});

test("the deletion surface survives the window where the account record is ALREADY gone", () => {
  // `identity_erasure` and `verifying` run after the primary identity is deleted. The durable job is
  // the only thing left that can speak for the person, and a refresh here must not black out.
  for (const state of ERASING) {
    assert.deepEqual(
      decide({ surface: "deletion_surface", durableDeletionState: state, irreversibleStarted: true }),
      { resolves: true },
      state,
    );
  }
});

test("a held account cannot use non-deletion surfaces", () => {
  assert.deepEqual(decide({ surface: "ordinary", durableDeletionState: "locked" }), {
    resolves: false,
    reason: "account_deletion_in_progress",
  });
});

test("a retryable failure before the crossing leaves the account usable everywhere", () => {
  // Nothing has been destroyed, so this is an ordinary account that happens to have a stalled job.
  for (const surface of ["ordinary", "deletion_surface"] as const) {
    assert.deepEqual(
      decide({ surface, durableDeletionState: "failed_retryable", irreversibleStarted: false }),
      { resolves: true },
      surface,
    );
  }
});

// ── THE FALLBACK'S ORIGINAL PURPOSE MUST SURVIVE ─────────────────────────────

test("a store miss with no deletion job still resolves — deletion must not log everyone out", () => {
  // The isolated Preview transport genuinely serves stale reads. Refusing every store miss would
  // trade this defect for a worse one.
  for (const surface of ["ordinary", "deletion_surface"] as const) {
    assert.deepEqual(decide({ surface, durableDeletionState: null }), { resolves: true }, surface);
  }
});

test("a cancelled deletion returns the person to ordinary treatment", () => {
  for (const surface of ["ordinary", "deletion_surface"] as const) {
    assert.deepEqual(decide({ surface, durableDeletionState: "cancelled" }), { resolves: true }, surface);
  }
});

test("the deletion surface is not a general-purpose bypass", () => {
  // It relaxes exactly two things — the hold, and the missing record during a live erasure — and
  // nothing else. A completed job is refused here as firmly as anywhere.
  assert.deepEqual(decide({ surface: "deletion_surface", durableDeletionState: "completed" }), {
    resolves: false,
    reason: "account_deleted",
  });
});

test("the cookie's own marker never GRANTS anything, on either surface", () => {
  // A forged or replayed cookie claiming `deletionLockedAt: null` gains nothing from saying so: the
  // durable state decides. The marker can only ever refuse.
  assert.deepEqual(
    decideCookieRestoredViewer({
      surface: "ordinary",
      deletionLockedAt: null,
      durableDeletionState: "locked",
      irreversibleStarted: false,
    }),
    { resolves: false, reason: "account_deletion_in_progress" },
  );
});
