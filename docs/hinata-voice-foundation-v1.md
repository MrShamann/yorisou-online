# Hinata Voice Foundation v1

## Why This Exists
- Hinata support must work for older adults who may speak slowly, hesitantly, or unclearly.
- Voice input is useful, but blind submission is unsafe when speech recognition is imperfect.
- This foundation keeps text support intact while preparing voice as a cautious, staged extension.

## Responsibility Split
- `Yorisou / yorisou-online / Dash online`
  - microphone capture
  - upload handoff to backend
  - transcript draft preview
  - confirm / edit / retry / send
  - optional Hinata reply playback
- `OpenClaw`
  - STT orchestration
  - Hinata runtime continuation
  - memory / reflection / needs-signal hooks
  - TTS orchestration
  - voice-quality / correction logging

## Cross-Project Ops Boundary
- `Yorisou / yorisou-online / Dash online` is the Amplify frontend layer.
- Public `/support` and `/en/support`, voice entry UI, transcript confirmation, and playback UX belong here.
- `OpenClaw` is the EC2 backend layer.
- Ohio OpenClaw is the operational truth for backend voice endpoints, gateway/runtime, and artifact behavior.
- Before debugging, decide first whether the issue belongs to frontend presentation or backend runtime.

## Rollout Phases
- Phase 1
  - push-to-talk recording
  - STT
  - transcript confirmation before send
  - Hinata text reply with optional TTS playback
- Phase 2
  - elderly-friendly playback pacing
  - better retry / correction handling
  - domain vocabulary tuning
- Phase 3
  - lower-latency voice interaction only if warranted later

## Voice Confirmation Rule
- Show recognized text before send.
- Allow quick edit and re-record.
- Do not assume high ASR certainty.
- If recognition is weak, guide the user back to short segmented utterances or text fallback.

## Insight Loop Hook
- Voice events should capture:
  - transcript confidence when available
  - retry count
  - transcript correction
  - voice-to-text fallback
  - playback usage
- These signals later feed product, service, vocabulary, and elder-needs review without treating recognition output as certain.
