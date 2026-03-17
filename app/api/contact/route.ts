import { NextResponse } from "next/server";

type ContactPayload = {
  name?: string;
  organizationType?: string;
  email?: string;
  inquiryType?: string;
  message?: string;
  locale?: "ja" | "en";
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidPayload(payload: ContactPayload) {
  return Boolean(
    payload.name?.trim() &&
      payload.organizationType?.trim() &&
      payload.email?.trim() &&
      EMAIL_PATTERN.test(payload.email.trim()) &&
      payload.inquiryType?.trim() &&
      payload.message?.trim() &&
      payload.message.trim().length >= 10
  );
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as ContactPayload;

    if (!isValidPayload(payload)) {
      return NextResponse.json({ success: false, error: "invalid_payload" }, { status: 400 });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const contactToEmail = process.env.CONTACT_TO_EMAIL;
    const contactFromEmail = process.env.CONTACT_FROM_EMAIL;

    if (!resendApiKey || !contactToEmail || !contactFromEmail) {
      console.error("Contact form is not configured. Missing RESEND_API_KEY, CONTACT_TO_EMAIL, or CONTACT_FROM_EMAIL.");
      return NextResponse.json({ success: false, error: "contact_not_configured" }, { status: 503 });
    }

    const locale = payload.locale === "en" ? "en" : "ja";
    const normalizedEmail = payload.email!.trim();
    const subject =
      locale === "ja"
        ? `【YORISOU お問い合わせ】${payload.inquiryType}`
        : `[YORISOU Inquiry] ${payload.inquiryType}`;

    const textBody = [
      `Name: ${payload.name}`,
      `Organization Type: ${payload.organizationType}`,
      `Email: ${normalizedEmail}`,
      `Inquiry Type: ${payload.inquiryType}`,
      "",
      "Message:",
      payload.message,
    ].join("\n");

    const htmlBody = `
      <div>
        <p><strong>Name:</strong> ${escapeHtml(payload.name || "")}</p>
        <p><strong>Organization Type:</strong> ${escapeHtml(payload.organizationType || "")}</p>
        <p><strong>Email:</strong> ${escapeHtml(normalizedEmail)}</p>
        <p><strong>Inquiry Type:</strong> ${escapeHtml(payload.inquiryType || "")}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(payload.message || "").replace(/\n/g, "<br />")}</p>
      </div>
    `;

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: contactFromEmail,
        to: [contactToEmail],
        reply_to: normalizedEmail,
        subject,
        text: textBody,
        html: htmlBody,
      }),
    });

    if (!resendResponse.ok) {
      const errorBody = await resendResponse.text();
      console.error("Resend email delivery failed:", errorBody);
      return NextResponse.json({ success: false, error: "delivery_failed" }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ success: false, error: "unexpected_error" }, { status: 500 });
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
