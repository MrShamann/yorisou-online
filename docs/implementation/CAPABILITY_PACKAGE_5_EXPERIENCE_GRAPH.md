# Capability Package 5 — structured experiences

The Experience Card is an owner-scoped, structured record. It is separate from private state and raw test answers. The active visibility modes are `PRIVATE`, `INVITE_ONLY`, `ANONYMOUS_SHARED`, and `SIMILAR_STATE_ONLY`; `PSEUDONYMOUS_SHARED` and `PUBLIC_SAFE` are recognized by the database but cannot be published or indexed.

All data access is server-side through the deployment service role. Every table has RLS enabled, no user-facing policies, and no PUBLIC/anon/authenticated privileges. Application routes resolve the owner from the existing YORISOU session. Discovery returns at most 20 eligible cards, strips owner identifiers, excludes blocked owners, and provides a non-sensitive reason for appearance.

Publishing requires a preview confirmation and a new consent record. Visibility changes create immutable consent, visibility, revision, and event records. Withdrawal removes a card from discovery; deletion is a soft deletion that preserves bounded audit evidence. Invite tokens are random, stored only as SHA-256 hashes, expire after seven days, and expose only the selected card.

AI structuring is explicit, bounded, and uses the existing YORISOU provider resolver. It receives only the selected draft, returns a schema-constrained candidate, records provenance, and never publishes. User edits and rejection remain available. Automated trust checks block common contact identifiers from shared cards and label clinical or absolute claims for review.

There are no followers, comments, direct messages, popularity scores, infinite scroll, outbound LINE messages, schedules, Mirai Move, Shigeru, or OpenClaw activation in this package.
