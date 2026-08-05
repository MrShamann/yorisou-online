// POR-1 — evidence records OUTCOMES, never identities.
//
// The harnesses capture a slice of each HTTP response body into a `detail` field so a failure can be
// diagnosed without re-running the stack. That is genuinely useful and it is also how a full account
// id and a synthetic email reached tracked evidence: the response body contains them, and slicing a
// string does not remove what is inside it.
//
// So detail is redacted at the point of capture. A digest keeps two records correlatable without
// either of them naming anyone.

import { createHash } from "node:crypto";

const digest = (value) => `sha256:${createHash("sha256").update(String(value)).digest("hex").slice(0, 12)}`;

/**
 * Replace identity-bearing substrings with one-way digests.
 *
 * Deliberately conservative: it rewrites the specific shapes this project produces rather than
 * attempting to recognise "anything sensitive", because a redactor that tries to be clever fails
 * open on the case nobody anticipated.
 */
export function redact(text) {
  if (typeof text !== "string" || text.length === 0) return text;
  return text
    // email addresses, synthetic or otherwise
    .replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, (m) => `<email:${digest(m)}>`)
    // account / session / attempt identifiers
    .replace(/\b(acct|sess|att)_[A-Za-z0-9_]{8,}/g, (m) => `<${m.split("_")[0]}:${digest(m)}>`)
    // uuids
    .replace(/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi, (m) => `<uuid:${digest(m)}>`)
    // anything in a credential-named JSON field
    .replace(/("(?:password|passphrase|secret|token|apiKey|api_key|accessKey|access_key)"\s*:\s*)"[^"]*"/gi,
      (_, key) => `${key}"<redacted>"`);
}
