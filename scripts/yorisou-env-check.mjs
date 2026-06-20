#!/usr/bin/env node
/**
 * Yorisou environment variable validator.
 * Checks required and optional vars without printing secret values.
 * Safe to run in CI — never prints secret contents, never calls external services.
 */

const VARS = {
  required: [
    { key: "YORISOU_SHARED_STORE_BUCKET", note: "S3 bucket for shared data store" },
    { key: "YORISOU_SHARED_STORE_REGION", note: "AWS region (default: us-east-2)", default: "us-east-2" },
  ],
  aws: [
    { key: "AWS_ACCESS_KEY_ID", note: "S3 auth — required when not using IAM role" },
    { key: "AWS_SECRET_ACCESS_KEY", note: "S3 auth — required when not using IAM role" },
  ],
  line: [
    { key: "LINE_CHANNEL_ID", note: "LINE Login channel" },
    { key: "LINE_CHANNEL_SECRET", note: "LINE Login secret" },
    { key: "LINE_MESSAGING_CHANNEL_SECRET", note: "LINE Messaging API secret" },
    { key: "LINE_MESSAGING_CHANNEL_ACCESS_TOKEN", note: "LINE Messaging API token" },
    { key: "LINE_REDIRECT_URI", note: "LINE OAuth callback URL" },
  ],
  ai: [
    { key: "OPENAI_API_KEY", note: "OpenAI API key" },
    { key: "OPENAI_MODEL", note: "Model ID (default: gpt-4.1-mini)", default: "gpt-4.1-mini" },
    { key: "MISTRAL_API_KEY", note: "Mistral API key" },
    { key: "MISTRAL_MODEL", note: "Model ID (default: mistral-small-latest)", default: "mistral-small-latest" },
    { key: "AI_GATEWAY_API_KEY", note: "AI gateway key (optional)" },
  ],
  openclaw: [
    { key: "OPENCLAW_VOICE_BASE_URL", note: "OpenClaw voice service endpoint" },
    { key: "OPENCLAW_VOICE_TOKEN", note: "OpenClaw voice auth token" },
    { key: "OPENCLAW_ARTIFACT_READ_TOKEN", note: "OpenClaw artifact read token" },
    { key: "OPENCLAW_WEBHOOK_URL", note: "OpenClaw automation webhook (future)" },
    { key: "OPENCLAW_WEBHOOK_TOKEN", note: "OpenClaw webhook auth token (future)" },
    { key: "OPENCLOUD_SUPPORT_CHAT_URL", note: "OpenCloud support chat endpoint" },
    { key: "OPENCLOUD_SUPPORT_CHAT_TOKEN", note: "OpenCloud support chat token" },
  ],
  hermes: [
    { key: "HERMES_WEBHOOK_URL", note: "Hermes automation webhook (future)" },
    { key: "HERMES_WEBHOOK_TOKEN", note: "Hermes webhook auth token (future)" },
  ],
  telegram: [
    { key: "TELEGRAM_BOT_TOKEN", note: "Telegram bot token for notifications/approvals" },
    { key: "TELEGRAM_CHAT_ID", note: "Telegram chat/channel ID for operator alerts" },
  ],
  email: [
    { key: "RESEND_API_KEY", note: "Resend email service key" },
    { key: "PASSWORD_RESET_FROM_EMAIL", note: "From address for password reset emails" },
    { key: "CONTACT_FROM_EMAIL", note: "From address for contact form emails" },
  ],
};

const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const GRAY = "\x1b[90m";
const RED = "\x1b[31m";
const BOLD = "\x1b[1m";
const NC = "\x1b[0m";

let missing = 0;
let present = 0;

function checkGroup(label, vars, isRequired = false) {
  console.log(`\n${BOLD}${label}${NC}`);
  for (const { key, note, default: def } of vars) {
    const val = process.env[key];
    if (val) {
      // Never print the actual value
      console.log(`  ${GREEN}✔${NC} ${key} — set`);
      present++;
    } else if (def !== undefined) {
      console.log(`  ${GRAY}○${NC}  ${key} — not set, will use default: ${def}`);
    } else if (isRequired) {
      console.log(`  ${RED}✘${NC} ${key} — MISSING (${note})`);
      missing++;
    } else {
      console.log(`  ${GRAY}○${NC}  ${key} — not set (${note})`);
    }
  }
}

console.log(`\n${"═".repeat(50)}`);
console.log(`  Yorisou Env Check`);
console.log(`  NODE_ENV: ${process.env.NODE_ENV || "(not set)"}`);
console.log(`${"═".repeat(50)}`);

checkGroup("Core / S3", VARS.required, true);
checkGroup("AWS Credentials", VARS.aws);
checkGroup("LINE", VARS.line);
checkGroup("AI / Models", VARS.ai);
checkGroup("OpenClaw", VARS.openclaw);
checkGroup("Hermes", VARS.hermes);
checkGroup("Telegram", VARS.telegram);
checkGroup("Email", VARS.email);

console.log(`\n${"═".repeat(50)}`);
console.log(`  ${present} set  |  ${missing} required missing`);

if (missing > 0) {
  console.log(`  ${YELLOW}⚠${NC}  S3 shared store disabled — using local data fallback`);
  console.log(`  Set missing vars in .env.local for full functionality`);
} else {
  console.log(`  ${GREEN}✔${NC} All required vars present`);
}

console.log(`${"═".repeat(50)}\n`);

// Exit 0 even when vars are missing — this check is informational, not a gate.
// CI can use exit code if needed: change to `if (missing > 0) process.exit(1);`
process.exit(0);
