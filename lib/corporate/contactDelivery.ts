/**
 * CORP-v1.3 — is the contact transport actually configured?
 *
 * The release blockers have said since v1.2 that "the form must not claim a delivery it cannot
 * perform", and the page went on saying "we read every enquiry and reply in turn" while the
 * transport had no credential and the API route returned 503 to every submission. A visitor was
 * told their message had been received when nothing had been sent.
 *
 * This is the ONE place that answers the question, and both the page and the route read it, so the
 * promise on the page and the behaviour of the endpoint cannot disagree. It reads server-only
 * configuration and returns a boolean: no address, key or value is exposed to the client, logged or
 * returned. The moment the credential and the two addresses exist, the form appears and the promise
 * becomes true — no code change, no copy change.
 *
 * Configuration alone is NOT proof of delivery. An end-to-end send still has to be verified before
 * `/contact` is crawlable; that gate lives in CORP_V13_PRODUCTION_LAUNCH_GATE.md.
 */
export function contactDeliveryConfigured(): boolean {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CORPORATE_CONTACT_TO || process.env.CONTACT_TO_EMAIL;
  const from = process.env.CORPORATE_CONTACT_FROM || process.env.CONTACT_FROM_EMAIL;
  return Boolean(apiKey && to && from);
}
