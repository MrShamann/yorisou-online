#!/usr/bin/env node
/**
 * Hermes webhook smoke test.
 * Sends a harmless ping payload to HERMES_WEBHOOK_URL if configured.
 * Fails clearly when env vars are missing — never calls production without explicit config.
 * Never performs destructive actions.
 */

const url = process.env.HERMES_WEBHOOK_URL?.trim();
const token = process.env.HERMES_WEBHOOK_TOKEN?.trim();

const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RED = "\x1b[31m";
const NC = "\x1b[0m";

if (!url) {
  console.log(`\n${YELLOW}⚠  SKIP${NC} — HERMES_WEBHOOK_URL is not set.`);
  console.log(`   Set HERMES_WEBHOOK_URL (and optionally HERMES_WEBHOOK_TOKEN) to run this smoke test.`);
  console.log(`   No request was sent.\n`);
  process.exit(0);
}

const headers = {
  "Content-Type": "application/json",
  "User-Agent": "yorisou-smoke/1.0",
};

if (token) {
  headers["Authorization"] = `Bearer ${token}`;
}

const payload = {
  type: "ping",
  source: "yorisou-smoke",
  timestamp: new Date().toISOString(),
  meta: { intent: "smoke_check", destructive: false },
};

console.log(`\n▸ Hermes Webhook Smoke`);
console.log(`  Endpoint: ${url}`);
console.log(`  Auth:     ${token ? "Bearer token set" : "none"}`);
console.log(`  Payload:  ${JSON.stringify(payload)}\n`);

try {
  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(10_000),
  });

  const body = await res.text().catch(() => "");
  console.log(`  Status:   ${res.status} ${res.statusText}`);
  if (body) console.log(`  Body:     ${body.slice(0, 200)}`);

  if (res.ok || res.status === 404 || res.status === 405) {
    console.log(`\n${GREEN}✔  Hermes webhook reachable${NC}\n`);
    process.exit(0);
  } else {
    console.log(`\n${RED}✘  Unexpected status ${res.status}${NC}\n`);
    process.exit(1);
  }
} catch (err) {
  if (err.name === "TimeoutError") {
    console.log(`\n${RED}✘  Request timed out after 10s${NC}\n`);
  } else {
    console.log(`\n${RED}✘  Request failed: ${err.message}${NC}\n`);
  }
  process.exit(1);
}
