"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type {
  SupportAssistantLocale,
  SupportConversationMessage,
  SupportIdentity,
  SupportIssueType,
  SupportScenarioResult,
} from "@/lib/ai/support/scenario-engine";
import type { SupportRecommendedAction } from "@/lib/ai/support/action-router";

type ScenarioSupportAssistantProps = {
  locale: SupportAssistantLocale;
};

type SupportChatResponse = {
  success: true;
  assistantMessage: string;
  scenarioResult: SupportScenarioResult;
  recommendedActions: SupportRecommendedAction[];
  modelUsage?: {
    provider: string;
    model: string;
  };
};

const identityOptions = {
  ja: [
    { value: "self" as const, label: "ご本人" },
    { value: "family" as const, label: "ご家族" },
    { value: "institution" as const, label: "自治体・介護関係者" },
  ],
  en: [
    { value: "self" as const, label: "Self" },
    { value: "family" as const, label: "Family" },
    { value: "institution" as const, label: "Organization" },
  ],
};

const starters = {
  ja: [
    {
      label: "最近の外出が少し不安です",
      issueType: "mobility_anxiety" as const,
      message: "最近の外出が少し不安です。",
    },
    {
      label: "親の移動をどう支えればいいですか",
      issueType: "family_mobility_support" as const,
      message: "親の移動をどう支えればいいか相談したいです。",
    },
    {
      label: "何が合うのか知りたいです",
      issueType: "product_guidance" as const,
      message: "どの製品やサービスが合うのか知りたいです。",
    },
  ],
  en: [
    {
      label: "Going out feels difficult",
      issueType: "mobility_anxiety" as const,
      message: "Going out has started to feel difficult.",
    },
    {
      label: "I need help supporting a parent",
      issueType: "family_mobility_support" as const,
      message: "I want help supporting a parent's mobility.",
    },
    {
      label: "I want to know what fits",
      issueType: "product_guidance" as const,
      message: "I want to understand which services or products fit.",
    },
  ],
};

const copy = {
  ja: {
    badge: "AI相談員 ひなた",
    title: "話しかけるように、ひとことから始められます。",
    description:
      "うまく整理できていなくても大丈夫です。移動や暮らしのことをそのまま受け取り、必要な整理はひなたが静かに進めます。",
    promptLabel: "こんな始め方もできます",
    textareaLabel: "気になっていることを、そのままどうぞ",
    placeholder:
      "たとえば「最近の外出が少し不安です」「親の移動をどう支えればいいかわかりません」など、思いつくままにお聞かせください。",
    submit: "ひなたに相談する",
    loading: "ひなたが受け取っています...",
    detailToggleOpen: "立場を添える",
    detailToggleClose: "立場を閉じる",
    detailLabel: "必要なときだけ、立場も添えられます",
    detailHint: "選ばなくても大丈夫です。内容から受け取り方を整えます。",
    assistantLabel: "ひなたからのご案内",
    assistantEmpty: "まずはひとことからで大丈夫です。ひなたが内容を受け取りながら、次の整理を進めます。",
    emptyPrompt: "気になっていることを、そのままお聞かせください。",
    error: "ご案内の準備に失敗しました。少し時間をおいて、もう一度お試しください。",
    actionsTitle: "このあとできること",
    userLabel: "ご相談内容",
  },
  en: {
    badge: "AI consultation guide",
    title: "Start with a natural message.",
    description: "You do not need to organize everything first. Hinata quietly handles the structure in the background.",
    promptLabel: "You can begin from:",
    textareaLabel: "What is on your mind",
    placeholder: "Share whatever feels important right now.",
    submit: "Start consultation",
    loading: "Preparing guidance...",
    detailToggleOpen: "Add who this is about",
    detailToggleClose: "Hide extra detail",
    detailLabel: "Add context only if it helps",
    detailHint: "You can skip this. Hinata can infer the rest from your message.",
    assistantLabel: "Hinata's guidance",
    assistantEmpty: "A short message is enough to begin.",
    emptyPrompt: "Please share what is on your mind.",
    error: "We could not prepare guidance. Please try again.",
    actionsTitle: "Next options",
    userLabel: "Your message",
  },
} as const;

export default function ScenarioSupportAssistant({ locale }: ScenarioSupportAssistantProps) {
  const t = copy[locale];
  const [identity, setIdentity] = useState<SupportIdentity>("self");
  const [issueType, setIssueType] = useState<SupportIssueType>("mobility_anxiety");
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<SupportConversationMessage[]>([]);
  const [recommendedActions, setRecommendedActions] = useState<SupportRecommendedAction[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [scenarioResult, setScenarioResult] = useState<SupportScenarioResult | null>(null);

  const detailOptions = identityOptions[locale];
  const starterOptions = starters[locale];

  const activeIdentityLabel = useMemo(
    () => detailOptions.find((option) => option.value === identity)?.label || "",
    [detailOptions, identity],
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const nextUserMessage = draft.trim() || t.emptyPrompt;
    const nextMessages = [...messages, { role: "user" as const, content: nextUserMessage }];

    try {
      const response = await fetch("/api/support/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          identity,
          issueType,
          message: draft.trim(),
          messages,
        }),
      });

      if (!response.ok) {
        throw new Error("request_failed");
      }

      const result = (await response.json()) as SupportChatResponse;
      setMessages([...nextMessages, { role: "assistant", content: result.assistantMessage }]);
      setRecommendedActions(result.recommendedActions);
      setScenarioResult(result.scenarioResult);
      setDraft("");
    } catch {
      setError(t.error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="scenario-assistant" className="rounded-[1.9rem] border border-[color:var(--line-soft)] bg-[var(--surface)] px-5 py-6 md:px-7 md:py-7">
      <div className="service-kicker">{t.badge}</div>
      <h2 className="display-serif mt-4 max-w-[15em] text-[1.85rem] leading-[1.58] text-[var(--text)] md:text-[2.3rem]">
        {t.title}
      </h2>
      <p className="mt-4 max-w-3xl text-sm leading-8 text-[var(--muted)] md:text-base">{t.description}</p>

      <form className="mt-7" onSubmit={handleSubmit}>
        <div className="rounded-[1.6rem] bg-[var(--surface-soft)] px-5 py-5">
          <div className="text-sm font-medium text-[var(--text)]">{t.promptLabel}</div>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {starterOptions.map((starter) => (
              <button
                key={starter.label}
                type="button"
                onClick={() => {
                  setIssueType(starter.issueType);
                  setDraft(starter.message);
                }}
                className="rounded-full bg-[rgba(255,253,249,0.9)] px-4 py-2.5 text-sm text-[var(--muted)] transition hover:bg-white hover:text-[var(--text)]"
              >
                {starter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-[1.6rem] border border-[color:var(--line-soft)] bg-[rgba(255,253,249,0.92)] px-5 py-5">
          <label className="block">
            <span className="text-sm font-medium text-[var(--text)]">{t.textareaLabel}</span>
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={t.placeholder}
              className="mt-3 min-h-[156px] w-full resize-none bg-transparent text-sm leading-8 text-[var(--text)] outline-none md:text-base"
            />
          </label>
        </div>

        <div className="mt-4">
          <button type="button" onClick={() => setDetailsOpen((value) => !value)} className="text-sm text-[var(--muted)] underline underline-offset-4">
            {detailsOpen ? t.detailToggleClose : t.detailToggleOpen}
          </button>

          {detailsOpen && (
            <div className="panel-sage mt-4 rounded-[1.5rem] px-5 py-5">
              <div className="text-sm font-medium">{t.detailLabel}</div>
              <p className="mt-2 text-sm leading-7">{t.detailHint}</p>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {detailOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setIdentity(option.value)}
                    className={`rounded-full px-4 py-2.5 text-sm transition ${
                      identity === option.value ? "bg-[var(--accent)] text-white" : "bg-[rgba(255,253,249,0.9)] text-[var(--accent-sage-text)]"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm leading-7 text-[var(--muted)]">{detailsOpen && activeIdentityLabel ? activeIdentityLabel : "\u00A0"}</div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-[1.2rem] bg-[var(--accent)] px-6 py-4 text-sm text-white shadow-[0_14px_28px_rgba(47,35,33,0.14)] transition hover:translate-y-[-1px] hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? t.loading : t.submit}
          </button>
        </div>

        {error && <p className="mt-4 text-sm text-[#9A3B2F]">{error}</p>}
      </form>

      <div className="mt-8 border-t border-[color:var(--line-soft)] pt-6">
        <div className="text-sm font-medium text-[var(--text)]">{t.assistantLabel}</div>

        {messages.length === 0 ? (
          <div className="mt-4 rounded-[1.5rem] bg-[var(--surface-soft)] px-5 py-5 text-sm leading-8 text-[var(--muted)]">{t.assistantEmpty}</div>
        ) : (
          <div className="mt-4 space-y-3">
            {messages.slice(-2).map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`rounded-[1.5rem] px-5 py-5 text-sm leading-8 ${
                  message.role === "user" ? "bg-[var(--surface-soft)] text-[var(--muted)]" : "panel-sage text-[var(--accent-sage-text)]"
                }`}
              >
                <div className="mb-2 text-xs tracking-[0.14em] opacity-75">{message.role === "user" ? t.userLabel : t.assistantLabel}</div>
                {message.content}
              </div>
            ))}
          </div>
        )}

        {scenarioResult && (
          <p className="mt-4 text-sm leading-7 text-[var(--accent-sage-text)]">
            {scenarioResult.labels.persona || activeIdentityLabel}
            {scenarioResult.labels.scenario ? ` / ${scenarioResult.labels.scenario}` : ""}
          </p>
        )}

        {recommendedActions.length > 0 && (
          <div className="mt-6">
            <div className="text-sm font-medium text-[var(--text)]">{t.actionsTitle}</div>
            <div className="mt-3 space-y-3">
              {recommendedActions.map((action) => (
                <Link key={action.id} href={action.href} className="block rounded-[1.4rem] border border-[color:var(--line-soft)] bg-[rgba(255,253,249,0.74)] px-5 py-4 transition hover:bg-[var(--surface-soft)]">
                  <div className="text-sm font-medium text-[var(--text)]">{action.title}</div>
                  <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{action.description}</p>
                  <div className="mt-3 text-sm text-[var(--accent-sage-text)]">{action.label}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
