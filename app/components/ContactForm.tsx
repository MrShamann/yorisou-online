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

const RECIPIENT = "shigeru.nagano1111@gmail.com";

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
    formTitle: "ご相談フォーム",
    validation: "入力内容をご確認ください。本文は10文字以上でご入力ください。",
    success: "メール作成画面を起動しました。起動しない場合は下記メールアドレスへ直接ご連絡ください。",
    mailLink: "メールで直接問い合わせる",
    orgOptions: ["自治体", "介護施設", "医療機関", "地域企業", "その他"],
    inquiryOptions: ["実証実験のご相談", "連携のご相談", "資料請求", "その他"],
    choose: "選択してください",
  },
  en: {
    name: "Name",
    orgType: "Organization Type",
    email: "Email",
    inquiryType: "Inquiry Type",
    message: "Message",
    submit: "Send",
    formTitle: "Inquiry Form",
    validation: "Please check your input. Message must be at least 10 characters.",
    success: "Your email client was triggered. If it does not open, please contact us directly via email below.",
    mailLink: "Contact by email",
    orgOptions: ["Municipality", "Care Facility", "Medical Institution", "Regional Company", "Other"],
    inquiryOptions: ["Pilot Program", "Partnership", "Document Request", "Other"],
    choose: "Please select",
  },
};

export default function ContactForm({ locale = "ja" }: { locale?: Locale }) {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string>("");
  const t = labels[locale];

  const canSubmit = useMemo(() => {
    return Boolean(
      form.name.trim() &&
      form.organizationType.trim() &&
      form.email.includes("@") &&
      form.inquiryType.trim() &&
      form.message.trim().length >= 10
    );
  }, [form]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit) {
      setError(t.validation);
      setSubmitted(false);
      return;
    }

    const subjectPrefix = locale === "ja" ? "【YORISOU お問い合わせ】" : "[YORISOU Inquiry]";
    const body = [
      `${t.name}: ${form.name}`,
      `${t.orgType}: ${form.organizationType}`,
      `${t.email}: ${form.email}`,
      `${t.inquiryType}: ${form.inquiryType}`,
      "",
      `${t.message}:`,
      form.message,
    ].join("\n");

    const mailto = `mailto:${RECIPIENT}?subject=${encodeURIComponent(
      `${subjectPrefix} ${form.inquiryType}`
    )}&body=${encodeURIComponent(body)}`;

    setError("");
    setSubmitted(true);
    window.location.href = mailto;
    setForm(initialState);
  };

  return (
    <div className="card" style={{ maxWidth: 860 }}>
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
                <option key={option} value={option}>{option}</option>
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
                <option key={option} value={option}>{option}</option>
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

        <button type="submit" className="btn btn-primary" style={{ marginTop: 14 }}>
          {t.submit}
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

      <p style={{ marginTop: 8 }}>
        <a href={`mailto:${RECIPIENT}`} style={{ color: "var(--accent)", fontWeight: 700 }}>
          {t.mailLink}: {RECIPIENT}
        </a>
      </p>
    </div>
  );
}

const inputStyle: CSSProperties = {
  width: "100%",
  border: "1px solid var(--line)",
  borderRadius: 8,
  marginTop: 6,
  padding: "10px 12px",
  fontSize: 14,
  fontFamily: "inherit",
  background: "#fff",
};
