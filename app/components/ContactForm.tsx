"use client";

import { CSSProperties, FormEvent, useMemo, useState } from "react";

type Locale = "ja" | "en";

type FormState = {
  name: string;
  organizationType: string;
  email: string;
  inquiryType: string;
  message: string;
};

type ApiErrorCode =
  | "invalid_payload"
  | "contact_not_configured"
  | "delivery_failed"
  | "unexpected_error";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initialState: FormState = {
  name: "",
  organizationType: "",
  email: "",
  inquiryType: "",
  message: "",
};

const labels = {
  ja: {
    name: "お名前",
    orgType: "組織区分",
    email: "メールアドレス",
    inquiryType: "お問い合わせ種別",
    message: "お問い合わせ内容",
    submit: "送信する",
    sending: "送信中...",
    validation: "入力内容をご確認ください。メールアドレスと本文を含め、必須項目を正しくご入力ください。",
    success: "お問い合わせを受け付けました。内容を確認のうえ、順次ご連絡いたします。",
    error: "送信に失敗しました。恐れ入りますが、時間をおいて再度お試しください。",
    unavailable: "現在、お問い合わせ受付の設定を確認中です。しばらくしてから再度お試しください。",
    orgOptions: ["個人ユーザー", "自治体", "介護施設", "医療機関", "地域企業", "その他"],
    inquiryOptions: ["公開テストの感想・不具合報告", "実証実験のご相談", "連携のご相談", "資料請求", "その他"],
    choose: "選択してください",
  },
  en: {
    name: "Name",
    orgType: "Organization Type",
    email: "Email",
    inquiryType: "Inquiry Type",
    message: "Message",
    submit: "Send",
    sending: "Sending...",
    validation: "Please review your input. Required fields, email format, and a message of at least 10 characters are needed.",
    success: "Your inquiry has been sent. We will get back to you as soon as possible.",
    error: "Submission failed. Please try again in a few moments.",
    unavailable: "The contact service is currently being configured. Please try again shortly.",
    orgOptions: ["Individual User", "Municipality", "Care Facility", "Medical Institution", "Regional Company", "Other"],
    inquiryOptions: ["Open Testing Feedback / Bug Report", "Pilot Program", "Partnership", "Document Request", "Other"],
    choose: "Please select",
  },
};

export default function ContactForm({
  locale = "ja",
  initialInquiryType,
  initialMessage,
  trackingTopic,
}: {
  locale?: Locale;
  initialInquiryType?: string;
  initialMessage?: string;
  trackingTopic?: string;
}) {
  const [form, setForm] = useState<FormState>({
    ...initialState,
    inquiryType: initialInquiryType ?? "",
    message: initialMessage ?? "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const t = labels[locale];

  const canSubmit = useMemo(() => {
    return Boolean(
      form.name.trim() &&
      form.organizationType.trim() &&
      EMAIL_PATTERN.test(form.email.trim()) &&
      form.inquiryType.trim() &&
      form.message.trim().length >= 10
    );
  }, [form]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit) {
      setError(t.validation);
      setSubmitted(false);
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSubmitted(false);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          email: form.email.trim(),
          locale,
          topic: trackingTopic ?? "contact",
          routeContext: typeof window !== "undefined" ? window.location.pathname + window.location.search : "/contact",
        }),
      });

      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as { error?: ApiErrorCode } | null;

        if (result?.error === "contact_not_configured") {
          throw new Error("contact_not_configured");
        }

        throw new Error(result?.error || "request_failed");
      }

      setSubmitted(true);
      setForm(initialState);
    } catch (error) {
      if (error instanceof Error && error.message === "contact_not_configured") {
        setError(t.unavailable);
      } else {
        setError(t.error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 860 }}>
      <form onSubmit={handleSubmit}>
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          <label>
            {t.name}
            <input
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              required
              style={inputStyle}
            />
          </label>
          <label>
            {t.orgType}
            <select
              value={form.organizationType}
              onChange={(event) => setForm({ ...form, organizationType: event.target.value })}
              required
              style={inputStyle}
            >
              <option value="">{t.choose}</option>
              {t.orgOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label>
            {t.email}
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
              style={inputStyle}
            />
          </label>
          <label>
            {t.inquiryType}
            <select
              value={form.inquiryType}
              onChange={(event) => setForm({ ...form, inquiryType: event.target.value })}
              required
              style={inputStyle}
            >
              <option value="">{t.choose}</option>
              {t.inquiryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label style={{ display: "block", marginTop: 14 }}>
          {t.message}
          <textarea
            value={form.message}
            onChange={(event) => setForm({ ...form, message: event.target.value })}
            required
            rows={6}
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </label>

        <button type="submit" className="btn btn-primary" style={{ marginTop: 14, opacity: isSubmitting ? 0.8 : 1 }} disabled={isSubmitting}>
          {isSubmitting ? t.sending : t.submit}
        </button>
      </form>

      {error && (
        <p style={{ marginTop: 12, color: "#9a1c1c", fontWeight: 700 }}>
          {error}
        </p>
      )}

      {submitted && (
        <p style={{ marginTop: 12, color: "#0f4c81", fontWeight: 700 }}>
          {t.success}
        </p>
      )}
    </div>
  );
}

const inputStyle: CSSProperties = {
  width: "100%",
  border: "1px solid var(--line-soft)",
  borderRadius: 14,
  marginTop: 6,
  padding: "12px 14px",
  fontSize: 14,
  fontFamily: "inherit",
  background: "rgba(255,253,249,0.92)",
};
