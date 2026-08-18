import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  EXPERIENCE_PRIVACY,
  INTERNAL_HANDLING,
  LIFE_OS_PRIVACY,
  NOT_VISIBLE_TO_OTHER_USERS,
  PROHIBITED_ABSOLUTE_VISIBILITY_CLAIMS,
  SAFETY_REVIEW_TRIGGER,
} from "@/lib/life-os/privacyCopy";

// OSF-1 §4 — the visibility promises, asserted rather than reviewed.
//
// privacyCopy.ts already named this file as the thing that would enforce it. The file did not
// exist: a comment claiming a guarantee that nothing checked. It exists now.

// Every surface a person can write into, plus the ones that repeat the promise.
const WRITE_SURFACES = [
  "app/life/reflect/ReflectionFlow.tsx",
  "app/life/experience/ExperienceForm.tsx",
  "app/experiences/view.tsx",
  "app/today/check-in/CurrentStateCheckIn.tsx",
  "app/life/SignInRequired.tsx",
  "app/life/MemoryConfirmation.tsx",
];

test("no surface makes an absolute user-only visibility claim", () => {
  // This is the exact wording that shipped and had to be corrected. The cheapest way for it to come
  // back is someone reaching for the shorter, warmer sentence in a hurry.
  for (const surface of WRITE_SURFACES) {
    const source = readFileSync(surface, "utf8");
    for (const claim of PROHIBITED_ABSOLUTE_VISIBILITY_CLAIMS) {
      assert.ok(!source.includes(claim), `${surface} claims 「${claim}」, which the product cannot keep`);
    }
  }
});

test("the promise is about other USERS, and internal handling is stated separately", () => {
  // "not shown to other users" is a statement about other users, which the code enforces.
  // "only you can see it" is a statement about everyone, which it does not.
  assert.ok(NOT_VISIBLE_TO_OTHER_USERS.includes("ほかの利用者"));
  assert.ok(!NOT_VISIBLE_TO_OTHER_USERS.includes("あなただけ"));
  // Separate sentence, not a qualifier folded into the reassurance where nobody reads it.
  assert.ok(INTERNAL_HANDLING.includes("運営"), "internal handling must name the operator");
  assert.ok(LIFE_OS_PRIVACY.startsWith(NOT_VISIBLE_TO_OTHER_USERS));
  assert.ok(LIFE_OS_PRIVACY.includes(INTERNAL_HANDLING));
});

test("experience cards name the specific trigger, because a vague hint would not help", () => {
  // Someone deciding whether to write about a diagnosis deserves to know the trigger before they
  // type it — trustFlags() routes exactly that text to a human, PRIVATE or not.
  assert.ok(SAFETY_REVIEW_TRIGGER.includes("診断"));
  assert.ok(EXPERIENCE_PRIVACY.includes(SAFETY_REVIEW_TRIGGER));
  // And the trigger the copy names must be the one the code actually uses.
  const cards = readFileSync("lib/server/experienceCards.ts", "utf8");
  assert.ok(cards.includes("診断"), "the copy names a trigger the code does not implement");
});

test("EVERY experience surface carries the experience promise — parity, not one good page", () => {
  // The Life OS form and the older hub write to the SAME table through the same trustFlags path, so
  // a promise made on one and omitted on the other is not a smaller problem, it is the same one.
  for (const surface of ["app/life/experience/ExperienceForm.tsx", "app/experiences/view.tsx"]) {
    assert.match(readFileSync(surface, "utf8"), /EXPERIENCE_PRIVACY/, `${surface} makes no disclosure`);
  }
});

test("the disclosure appears BEFORE the person types, on every write surface", () => {
  // The one property that makes a disclosure useful. Telling someone where their words went after
  // they have written them is the single moment it cannot inform a decision — and that is exactly
  // what the reflection flow used to do, showing it only on the finished screen.
  const flow = readFileSync("app/life/reflect/ReflectionFlow.tsx", "utf8");
  const disclosureAt = flow.indexOf("ここに書いたものが{LIFE_OS_PRIVACY}");
  const doneScreenAt = flow.indexOf('if (phase === "done")');
  assert.ok(disclosureAt > 0, "the reflection flow must disclose before the questions");
  assert.ok(disclosureAt > doneScreenAt, "sanity: the pre-question disclosure is not the done-screen one");
  assert.match(flow, /index === 0 && \(/, "the disclosure must be on the first question");

  // The older hub: the promise must precede the input grid, not sit beside the visibility control
  // at the bottom of the form.
  const hub = readFileSync("app/experiences/view.tsx", "utf8");
  assert.ok(
    hub.indexOf("EXPERIENCE_PRIVACY}</p>") < hub.indexOf("{fields.map("),
    "the disclosure must precede the input fields",
  );
});

test("the trust model in the copy matches the trust model in the code", () => {
  // The claim is that a PRIVATE card with a safety flag CAN reach an operator. If that ever stops
  // being true the copy is over-warning; if the queue widens, the copy is under-warning. Either way
  // the two must be checked against each other rather than drifting independently.
  const cards = readFileSync("lib/server/experienceCards.ts", "utf8");
  assert.match(cards, /moderation_status/, "the moderation state must exist for the warning to be true");
  assert.match(cards, /limited/, "the flagged state named by the disclosure must exist");
});
