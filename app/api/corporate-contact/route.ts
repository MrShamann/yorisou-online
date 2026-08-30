import { NextResponse } from "next/server";

/**
 * CORP-P5R2 — corporate contact intake. PREVIEW ONLY.
 *
 * Everything secret stays here. The browser posts a plain JSON body; this route decides the
 * destination. The Founder's private mailbox is read from server-only configuration and is never
 * returned to the client, never logged, and never present in the client bundle.
 *
 * Delivery is deliberately fail-closed and quiet: if the transport is not configured, the route logs
 * a configuration notice WITHOUT any address or key and returns a generic failure. It never reveals
 * why to the visitor, and it never falls back to some other address.
 */

export const runtime = "nodejs";

const MAX = { name: 200, email: 320, org: 200, message: 8000 } as const;
const TYPES = new Set(["general", "business", "media"]);

/** Small in-process limiter. Enough to blunt casual abuse on a Preview; not a security boundary. */
const hits = new Map<string, { n: number; t: number }>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const win = 10 * 60_000;
  const rec = hits.get(ip);
  if (!rec || now - rec.t > win) {
    hits.set(ip, { n: 1, t: now });
    return false;
  }
  rec.n += 1;
  return rec.n > 5;
}

function isEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) && v.length <= MAX.email;
}

function escapeHtml(v: string): string {
  return v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const s = (k: string) => (typeof body[k] === "string" ? (body[k] as string).trim() : "");
  const name = s("name").slice(0, MAX.name);
  const email = s("email");
  const org = s("org").slice(0, MAX.org);
  const message = s("message").slice(0, MAX.message);
  const type = TYPES.has(s("type")) ? s("type") : "general";
  const locale = s("locale").slice(0, 12) || "ja";

  // Honeypot: a real person never fills this. Answer 200 so a bot learns nothing.
  if (s("company_website")) {
    return NextResponse.json({ ok: true });
  }

  if (!name || !isEmail(email) || message.length < 2) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CORPORATE_CONTACT_TO || process.env.CONTACT_TO_EMAIL;
  const from = process.env.CORPORATE_CONTACT_FROM || process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    // No address, no key, no message body in the log.
    console.error("[corporate-contact] transport not configured; enquiry not delivered");
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  const subject = `[Yorisou] ${type} enquiry from ${name}`;
  const html = [
    `<p><strong>Type:</strong> ${escapeHtml(type)}</p>`,
    `<p><strong>Name:</strong> ${escapeHtml(name)}</p>`,
    `<p><strong>Email:</strong> ${escapeHtml(email)}</p>`,
    org ? `<p><strong>Organisation:</strong> ${escapeHtml(org)}</p>` : "",
    `<p><strong>Locale:</strong> ${escapeHtml(locale)}</p>`,
    `<hr /><p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>`,
  ].join("");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], reply_to: email, subject, html }),
    });
    if (!res.ok) {
      console.error("[corporate-contact] transport rejected the message");
      return NextResponse.json({ ok: false }, { status: 502 });
    }
  } catch {
    console.error("[corporate-contact] transport unreachable");
    return NextResponse.json({ ok: false }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
