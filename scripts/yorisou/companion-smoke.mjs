#!/usr/bin/env node

const baseUrl = process.argv[2] || process.env.YORISOU_BASE_URL || "http://127.0.0.1:3000";

const smokeMetadata = {
  __local_smoke_test: true,
  smokeSuite: "companion-return-loop",
};

const cases = [
  {
    name: "valid companion_card_viewed",
    endpoint: "/api/open-testing/signals",
    body: {
      source: "companion_card",
      signalType: "companion_card_viewed",
      testId: "work-rhythm",
      companionArchetypeId: "sleepy-penguin",
      pagePath: "/tests/work-rhythm",
      metadata: smokeMetadata,
    },
    expectStatus: 200,
  },
  {
    name: "valid not_now with archetype + intent",
    endpoint: "/api/open-testing/signals",
    body: {
      source: "line_mini_app",
      signalType: "companion_subscription_not_now_clicked",
      testId: "current-state",
      companionArchetypeId: "rain-bird",
      companionIntentType: "free_only_for_now",
      recommendationMode: "return_session",
      pagePath: "/line/mini-app",
      metadata: smokeMetadata,
    },
    expectStatus: 200,
  },
  {
    name: "missing archetype rejected",
    endpoint: "/api/open-testing/signals",
    body: {
      source: "line_mini_app",
      signalType: "companion_subscription_not_now_clicked",
      testId: "current-state",
      companionIntentType: "free_only_for_now",
      recommendationMode: "return_session",
      pagePath: "/line/mini-app",
      metadata: smokeMetadata,
    },
    expectStatus: 400,
    expectError: "invalid_companion_archetype_id",
  },
  {
    name: "invalid archetype rejected",
    endpoint: "/api/open-testing/signals",
    body: {
      source: "line_mini_app",
      signalType: "companion_subscription_not_now_clicked",
      testId: "current-state",
      companionArchetypeId: "not-a-real-companion",
      companionIntentType: "free_only_for_now",
      recommendationMode: "return_session",
      pagePath: "/line/mini-app",
      metadata: smokeMetadata,
    },
    expectStatus: 400,
    expectError: "invalid_companion_archetype_id",
  },
  {
    name: "invalid companion intent rejected",
    endpoint: "/api/open-testing/signals",
    body: {
      source: "line_mini_app",
      signalType: "companion_subscription_interest_clicked",
      testId: "current-state",
      companionArchetypeId: "rain-bird",
      companionIntentType: "not-real-intent",
      recommendationMode: "return_session",
      pagePath: "/line/mini-app",
      metadata: smokeMetadata,
    },
    expectStatus: 400,
    expectError: "invalid_companion_intent_type",
  },
  {
    name: "oversized note rejected",
    endpoint: "/api/open-testing/signals",
    body: {
      source: "line_mini_app",
      signalType: "companion_subscription_interest_clicked",
      testId: "current-state",
      companionArchetypeId: "rain-bird",
      companionIntentType: "weekly_reflection_interest",
      recommendationMode: "return_session",
      note: "x".repeat(501),
      pagePath: "/line/mini-app",
      metadata: smokeMetadata,
    },
    expectStatus: 400,
    expectError: "invalid_note",
  },
];

async function runCase(testCase) {
  const response = await fetch(new URL(testCase.endpoint, baseUrl), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(testCase.body),
    signal: AbortSignal.timeout(15000),
  });

  const payload = await response.json().catch(() => null);
  const statusMatches = response.status === testCase.expectStatus;
  const errorMatches = testCase.expectError ? payload?.error === testCase.expectError : true;

  if (!statusMatches || !errorMatches) {
    throw new Error(
      `${testCase.name} failed: expected ${testCase.expectStatus}${
        testCase.expectError ? `/${testCase.expectError}` : ""
      }, received ${response.status}/${payload?.error || "ok"}`,
    );
  }

  console.log(`PASS ${testCase.name} -> ${response.status}${payload?.error ? ` ${payload.error}` : ""}`);
}

async function main() {
  console.log(`Companion smoke target: ${baseUrl}`);

  for (const testCase of cases) {
    await runCase(testCase);
  }

  console.log(`PASS companion smoke complete (${cases.length} checks)`);
}

main().catch((error) => {
  console.error(`FAIL ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
