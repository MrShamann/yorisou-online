# OpenClaw & Hermes Integration Architecture

## Ownership Model

Yorisou does **not** own or run the OpenClaw or Hermes runtimes.
Yorisou can **trigger** them through webhook endpoints and read artifacts they produce.

```
Yorisou repo                OpenClaw runtime           Hermes runtime
─────────────               ────────────────           ──────────────
lib/server/openclaw*    →   webhook endpoint      →    task execution
automation/yorisou/     →   artifact read token   →    results → S3
scripts/openclaw-*      →   smoke ping only
```

## What Yorisou Can Do

| Action | Mechanism | Safe to automate |
|---|---|---|
| Send task to OpenClaw | POST to OPENCLAW_WEBHOOK_URL | Yes, with token |
| Read OpenClaw artifacts | S3 via OPENCLAW_ARTIFACT_READ_TOKEN | Yes, read-only |
| Use OpenClaw voice bridge | OPENCLAW_VOICE_BASE_URL | Yes, per request |
| Send task to Hermes | POST to HERMES_WEBHOOK_URL | Yes, with approval |
| Trigger Telegram notification | TELEGRAM_BOT_TOKEN | Yes |
| Request Telegram approval | TELEGRAM_BOT_TOKEN + chat | Yes, human gate |

## What Yorisou Must NOT Do

- Execute destructive actions without Telegram approval
- Call production webhook endpoints from CI without explicit opt-in (`*_SMOKE_ENABLED=true`)
- Store secrets in files or commit them to the repo
- Modify OpenClaw source code
- Modify Hermes source code
- Trigger OpenClaw/Hermes from automated tasks that haven't been human-reviewed

## Recommended Workflow

### Standard automation task

```
1. Scheduler or GitHub Action triggers Yorisou script
2. Yorisou script validates env vars
3. Yorisou posts structured task payload to OpenClaw webhook
4. OpenClaw processes and writes result to S3
5. Yorisou reads result artifact
6. Yorisou sends Telegram notification with summary
```

### Approval-gated task (risky or external-facing)

```
1. Yorisou script assembles task and posts to Telegram for review
2. Operator reviews in Telegram and approves
3. Yorisou posts to OpenClaw/Hermes webhook with approval reference
4. OpenClaw/Hermes executes
5. Telegram receives result confirmation
```

## Webhook Payload Contract

Yorisou automation scripts send structured JSON:

```json
{
  "type": "task | ping | status_check",
  "source": "yorisou",
  "timestamp": "ISO8601",
  "task": {
    "id": "unique-task-id",
    "kind": "...",
    "payload": {}
  },
  "meta": {
    "destructive": false,
    "approval_ref": "telegram-message-id or null",
    "environment": "local | staging | production"
  }
}
```

The `destructive` flag must be `true` for any task that modifies external state.
Tasks with `destructive: true` require `approval_ref` to be set.

## Current Integration Status

| Integration | Status | Env var needed |
|---|---|---|
| OpenClaw voice bridge | Active in production | `OPENCLAW_VOICE_BASE_URL` + `OPENCLAW_VOICE_TOKEN` |
| OpenClaw artifact read | Active in production | `OPENCLAW_ARTIFACT_READ_TOKEN` |
| OpenClaw task webhook | **Placeholder — not yet wired** | `OPENCLAW_WEBHOOK_URL` |
| Hermes task webhook | **Placeholder — not yet wired** | `HERMES_WEBHOOK_URL` |
| Telegram notifications | **Placeholder — not yet wired** | `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` |
| Shigeru / AgentBots | **Future target** | TBD |

## Next Steps to Activate

1. Obtain `OPENCLAW_WEBHOOK_URL` from OpenClaw operator
2. Set `OPENCLAW_WEBHOOK_URL` + `OPENCLAW_WEBHOOK_TOKEN` in `.env.local`
3. Run `npm run smoke:openclaw` to confirm reachability
4. Define first real task payload shape with OpenClaw operator
5. Repeat for Hermes

For Telegram approval layer:
1. Create a bot via @BotFather
2. Set `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID`
3. Implement `scripts/telegram-notify.mjs` (future)
