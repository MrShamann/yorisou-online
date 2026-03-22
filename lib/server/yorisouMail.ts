type PasswordResetMailInput = {
  toEmail: string;
  resetUrl: string;
  locale: "ja" | "en";
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendPasswordResetEmail(input: PasswordResetMailInput) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.PASSWORD_RESET_FROM_EMAIL || process.env.CONTACT_FROM_EMAIL;

  if (!resendApiKey || !fromEmail) {
    return { ok: false as const, reason: "not_configured" as const };
  }

  const subject =
    input.locale === "ja" ? "【YORISOU】パスワード再設定のご案内" : "[YORISOU] Reset your password";
  const text =
    input.locale === "ja"
      ? `YORISOUのパスワード再設定リンクです。\n\n次のリンクを開いて新しいパスワードを設定してください。\n${input.resetUrl}\n\nこのリンクには有効期限があります。心当たりがない場合は、このメールを破棄してください。`
      : `Use the link below to set a new YORISOU password.\n\n${input.resetUrl}\n\nThis link expires. If you did not request it, you can ignore this email.`;
  const html =
    input.locale === "ja"
      ? `<div><p>YORISOUのパスワード再設定リンクです。</p><p><a href="${escapeHtml(input.resetUrl)}">新しいパスワードを設定する</a></p><p>心当たりがない場合は、このメールを破棄してください。</p></div>`
      : `<div><p>Use the link below to set a new YORISOU password.</p><p><a href="${escapeHtml(input.resetUrl)}">Reset password</a></p><p>If you did not request it, you can ignore this email.</p></div>`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [input.toEmail],
      subject,
      text,
      html,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Password reset email delivery failed:", errorBody);
    return { ok: false as const, reason: "delivery_failed" as const };
  }

  return { ok: true as const };
}
