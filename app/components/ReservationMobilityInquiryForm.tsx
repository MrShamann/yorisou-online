"use client";

import { FormEvent, useMemo, useState } from "react";

type Locale = "ja" | "en";
type InquiryMode = "family" | "pilot";

type FormState = {
  mode: InquiryMode;
  name: string;
  email: string;
  message: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const copy = {
  ja: {
    modeFamily: "ご家族の相談",
    modePilot: "導入・実証の相談",
    name: "お名前",
    email: "メールアドレス",
    message: "ひとこと",
    helper:
      "お名前、メールアドレス、ひとことだけで大丈夫です。予約前の不安や、導入前の確認したい点をそのまま書いてください。",
    submit: "送る",
    sending: "送信中...",
    success: "ありがとうございます。内容を受け取りました。順次ご連絡します。",
    error: "送信できませんでした。少し時間をおいてから再度お試しください。",
    validation: "お名前、メールアドレス、ひとことを確認してください。",
    emailPlaceholder: "example@example.com",
    messagePlaceholder: "例: 予約前に家族で確認したいことがある / 小さく試せるか知りたい",
  },
  en: {
    modeFamily: "Family consultation",
    modePilot: "Pilot discussion",
    name: "Name",
    email: "Email",
    message: "Short note",
    helper:
      "A name, an email address, and one short note are enough. Please share the concern before booking, or the point you want to confirm first.",
    submit: "Send",
    sending: "Sending...",
    success: "Thank you. We received your message and will follow up.",
    error: "We could not send the message. Please try again in a moment.",
    validation: "Please check your name, email, and short note.",
    emailPlaceholder: "name@example.com",
    messagePlaceholder: "Example: We want to confirm family coordination before booking / We want to discuss a small pilot",
  },
} as const;

export default function ReservationMobilityInquiryForm({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [state, setState] = useState<FormState>({
    mode: "family",
    name: "",
    email: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = useMemo(() => {
    return Boolean(state.name.trim() && EMAIL_PATTERN.test(state.email.trim()) && state.message.trim().length >= 10);
  }, [state.email, state.message, state.name]);

  const organizationType =
    state.mode === "family"
      ? locale === "ja"
        ? "ご家族"
        : "Family member"
      : locale === "ja"
        ? "自治体・事業者・施設"
        : "Municipality / operator / institution";

  const inquiryType =
    state.mode === "family"
      ? locale === "ja"
        ? "予約型移動の相談"
        : "Reservation mobility consultation"
      : locale === "ja"
        ? "パイロット相談"
        : "Pilot discussion";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) {
      setError(t.validation);
      setSent(false);
      return;
    }

    setSending(true);
    setError("");
    setSent(false);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: state.name.trim(),
          organizationType,
          email: state.email.trim(),
          inquiryType,
          message: state.message.trim(),
          locale,
        }),
      });

      if (!response.ok) {
        throw new Error("request_failed");
      }

      setSent(true);
      setState((current) => ({ ...current, name: "", email: "", message: "" }));
    } catch {
      setError(t.error);
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[1.7rem] border border-[color:var(--line-soft)] bg-[rgba(255,253,249,0.88)] p-6 shadow-[0_12px_28px_rgba(47,35,33,0.04)]">
      <div className="text-xs tracking-[0.18em] text-[var(--accent-sage-text)]">{locale === "ja" ? "問い合わせ" : "Inquiry"}</div>
      <h3 className="mt-3 text-2xl font-light text-[var(--text)]">{locale === "ja" ? "ひとことから始められます。" : "You can start with one short note."}</h3>
      <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{t.helper}</p>

      <div className="mt-5 flex flex-wrap gap-3">
        <ModeButton
          active={state.mode === "family"}
          onClick={() => setState((current) => ({ ...current, mode: "family" }))}
          label={t.modeFamily}
        />
        <ModeButton
          active={state.mode === "pilot"}
          onClick={() => setState((current) => ({ ...current, mode: "pilot" }))}
          label={t.modePilot}
        />
      </div>

      <div className="mt-6 grid gap-4">
        <label className="grid gap-2 text-sm text-[var(--text)]">
          <span>{t.name}</span>
          <input
            value={state.name}
            onChange={(event) => setState((current) => ({ ...current, name: event.target.value }))}
            className="rounded-[1rem] border border-[color:var(--line-soft)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[color:var(--line-sage)]"
            autoComplete="name"
          />
        </label>

        <label className="grid gap-2 text-sm text-[var(--text)]">
          <span>{t.email}</span>
          <input
            type="email"
            value={state.email}
            onChange={(event) => setState((current) => ({ ...current, email: event.target.value }))}
            placeholder={t.emailPlaceholder}
            className="rounded-[1rem] border border-[color:var(--line-soft)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[color:var(--line-sage)]"
            autoComplete="email"
          />
        </label>

        <label className="grid gap-2 text-sm text-[var(--text)]">
          <span>{t.message}</span>
          <textarea
            value={state.message}
            onChange={(event) => setState((current) => ({ ...current, message: event.target.value }))}
            placeholder={t.messagePlaceholder}
            rows={5}
            className="rounded-[1rem] border border-[color:var(--line-soft)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[color:var(--line-sage)]"
          />
        </label>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={sending}
          className="btn btn-primary disabled:opacity-70"
        >
          {sending ? t.sending : t.submit}
        </button>
      </div>

      {sent ? <p className="mt-4 text-sm leading-7 text-[var(--accent-sage-text)]">{t.success}</p> : null}
      {error ? <p className="mt-4 text-sm leading-7 text-[#8B3A2E]">{error}</p> : null}
    </form>
  );
}

function ModeButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-full border px-4 py-2 text-sm transition",
        active
          ? "border-[color:var(--line-sage)] bg-[rgba(225,232,219,0.82)] text-[var(--accent-sage-text)]"
          : "border-[color:var(--line-soft)] bg-white text-[var(--text)] hover:border-[color:var(--line-sage)] hover:bg-[rgba(225,232,219,0.38)]",
      ].join(" ")}
    >
      {label}
    </button>
  );
}
