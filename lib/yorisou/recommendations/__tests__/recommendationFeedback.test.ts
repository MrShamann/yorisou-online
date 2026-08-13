// PXR-1 — 保存する / 今は違う must be real, reversible, and free of judgement.
import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(HERE, "..", "recommendationFeedback.ts"), "utf8");
const code = source.replace(/\/\/[^\n]*/g, " ").replace(/\/\*[\s\S]*?\*\//g, " ");

const KEY = "yorisou.pxr1.recommendationFeedback.v1";

/** Installs a minimal window with a working localStorage, then loads a FRESH module instance. */
async function withStore(run: (mod: typeof import("../recommendationFeedback")) => Promise<void> | void) {
  const store = new Map<string, string>();
  const g = globalThis as unknown as { window?: unknown };
  const previous = g.window;
  g.window = {
    localStorage: {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
    },
    dispatchEvent: () => true,
    addEventListener: () => {},
    removeEventListener: () => {},
  };
  try {
    // Cache-busted so each case starts with an empty module-level snapshot cache.
    const mod = (await import(`../recommendationFeedback.ts?case=${store.size}-${Math.random()}`)) as typeof import("../recommendationFeedback");
    await run(mod);
  } finally {
    if (previous === undefined) delete g.window;
    else g.window = previous;
  }
}

test("the snapshot is referentially stable, so useSyncExternalStore cannot loop", async () => {
  // Same defect class that shipped in the check-in store and crashed Today: a reader that
  // re-parses on every call is never equal to itself, and React loops until it throws.
  await withStore((mod) => {
    const empty = mod.readRecommendationFeedback();
    assert.equal(mod.readRecommendationFeedback(), empty, "empty reads must be the SAME object");
    assert.equal(empty, mod.EMPTY_RECOMMENDATION_FEEDBACK);

    mod.saveRecommendation("a");
    const first = mod.readRecommendationFeedback();
    assert.equal(mod.readRecommendationFeedback(), first, "repeat reads must be the SAME object");
    assert.deepEqual(first.saved, ["a"]);

    mod.saveRecommendation("b");
    assert.notEqual(mod.readRecommendationFeedback(), first, "a real change must be observed");
  });
});

test("saving and setting aside are mutually exclusive, and both reverse", async () => {
  await withStore((mod) => {
    mod.saveRecommendation("a");
    assert.deepEqual(mod.readRecommendationFeedback().saved, ["a"]);

    // 今は違う on a saved item removes it from saved rather than holding both states at once.
    mod.dismissRecommendation("a");
    let now = mod.readRecommendationFeedback();
    assert.deepEqual(now.saved, []);
    assert.deepEqual(now.dismissed, ["a"]);

    // 「今は」 has to be undoable, or the copy is a lie.
    mod.restoreRecommendation("a");
    now = mod.readRecommendationFeedback();
    assert.deepEqual(now.dismissed, []);

    // Saving something set aside brings it back in one step.
    mod.dismissRecommendation("a");
    mod.saveRecommendation("a");
    now = mod.readRecommendationFeedback();
    assert.deepEqual(now.saved, ["a"]);
    assert.deepEqual(now.dismissed, []);

    mod.unsaveRecommendation("a");
    assert.deepEqual(mod.readRecommendationFeedback().saved, []);
  });
});

test("saving the same thing twice does not duplicate it", async () => {
  await withStore((mod) => {
    mod.saveRecommendation("a");
    mod.saveRecommendation("a");
    assert.deepEqual(mod.readRecommendationFeedback().saved, ["a"]);
  });
});

test("a foreign or older record is ignored, never guessed at", async () => {
  await withStore((mod) => {
    const g = globalThis as unknown as { window: { localStorage: { setItem(k: string, v: string): void } } };
    g.window.localStorage.setItem(KEY, JSON.stringify({ version: "something-else", saved: ["x"] }));
    assert.deepEqual(mod.readRecommendationFeedback().saved, []);
    g.window.localStorage.setItem(KEY, "not json");
    assert.deepEqual(mod.readRecommendationFeedback().saved, []);
  });
});

test("it is device-local, and records nothing about the person", async () => {
  assert.ok(code.includes("localStorage"), "device-local only");
  for (const forbidden of ["fetch(", "accountId", "email", "supabase", "/api/", "navigator.sendBeacon"]) {
    assert.ok(!code.includes(forbidden), `no server sync or identity: ${forbidden}`);
  }
  // No scoring, no streaks, no accumulation into a judgement — 今は違う is not a rating.
  for (const forbidden of ["score", "streak", "rating", "thumbsDown", "weight", "affinity"]) {
    assert.ok(!code.includes(forbidden), `feedback must not become a model input: ${forbidden}`);
  }
});
