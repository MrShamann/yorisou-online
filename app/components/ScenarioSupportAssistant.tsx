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

const issueOptions = {
  ja: [
    { value: "mobility_anxiety" as const, label: "外出が不安" },
    { value: "family_mobility_support" as const, label: "家族の移動が心配" },
    { value: "product_guidance" as const, label: "製品やサービスを知りたい" },
    { value: "consultation_booking" as const, label: "相談や導入について聞きたい" },
  ],
  en: [
    { value: "mobility_anxiety" as const, label: "Mobility concern" },
    { value: "family_mobility_support" as const, label: "Family support" },
    { value: "product_guidance" as const, label: "Products and services" },
    { value: "consultation_booking" as const, label: "Consultation and implementation" },
  ],
};

const copy = {
  ja: {
    badge: "AI相談員 ひなた",
    title: "気になることから、そのまま話しかけてください。",
    description:
      "うまく整理できていなくても大丈夫です。ひなたが内容を受け取りながら、必要なことを静かに整えていきます。",
    promptLabel: "たとえば、こんなことから始められます",
    textareaLabel: "いま気になっていること",
    placeholder:
      "たとえば「最近の外出が不安です」「親の移動をどう支えればいいかわかりません」など、思いつくままにお聞かせください。",
    submit: "ひなたに相談する",
    loading: "ひなたが内容を確認しています...",
    detailsToggleOpen: "相談の立場を添える",
    detailsToggleClose: "立場の選択を閉じる",
    detailLabel: "話しやすいように、必要なら立場も選べます",
    detailsHint: "選ばなくても大丈夫です。ひなたが内容から受け取り方を整えます。",
    assistantLabel: "ひなたからのご案内",
    assistantEmpty: "まずはひとこと話しかけてみてください。必要な整理は、ひなたが少しずつ一緒に進めます。",
    emptyPrompt: "ひとことからでも大丈夫です。気になることをそのままお聞かせください。",
    error: "ご案内の準備に失敗しました。少し時間をおいて、もう一度お試しください。",
    actionsTitle: "このあとできること",
    topicNote: "選んだ内容は、ひなたが裏側で整理の参考にします。",
    userLabel: "ご相談内容",
  },
  en: {
    badge: "AI consultation guide",
    title: "Start with whatever feels important right now.",
    description: "You do not need to organize everything first. We quietly help sort it out behind the scenes.",
    promptLabel: "You can start from:",
    textareaLabel: "What is on your mind",
    placeholder: "Share what feels difficult right now.",
    submit: "Start consultation",
    loading: "Preparing guidance...",
    detailsToggleOpen: "Add who this is about",
    detailsToggleClose: "Hide extra details",
    detailLabel: "Add context only if it helps",
    detailsHint: "You can skip this. We can infer the rest from your message.",
    assistantLabel: "Hinata's guidance",
    assistantEmpty: "Start with a short message and we will gently guide the next step.",
    emptyPrompt: "A short message is enough to begin.",
    error: "We could not prepare guidance. Please try again.",
    actionsTitle: "Next options",
    topicNote: "This helps Hinata quietly organize the response.",
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

  const topicOptions = issueOptions[locale];
  const detailOptions = identityOptions[locale];

  const activeIdentityLabel = useMemo(
    () => detailOptions.find((option) => option.value === identity)?.label || "",
    [detailOptions, identity],
  );
  const activeTopicLabel = useMemo(
    () => topicOptions.find((option) => option.value === issueType)?.label || "",
    [issueType, topicOptions],
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

  const assistantMessage = messages.filter((message) => message.role === "assistant").at(-1);

  return (
    <section id="scenario-assistant" className="rounded-[2rem] bg-[var(--surface)] px-5 py-6 shadow-[0_10px_24px_rgba(59,47,47,0.04)] md:px-8 md:py-8">
      <div className="service-kicker">{t.badge}</div>
      <h2 className="display-serif mt-4 max-w-[15em] text-[2rem] leading-[1.5] text-[var(--text)] md:text-[2.55rem]">
        {t.title}
      </h2>
      <p className="mt-4 max-w-2xl text-sm leading-8 text-[var(--muted)] md:text-base">{t.description}</p>

      <form className="mt-7" onSubmit={handleSubmit}>
        <div className="rounded-[1.8rem] bg-[var(--surface-soft)] px-5 py-5">
          <div className="text-sm font-medium text-[var(--text)]">{t.promptLabel}</div>
          <div className="mt-3 flex flex-wrap gap-2.5">
            {topicOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setIssueType(option.value)}
                className={`rounded-full px-4 py-2.5 text-sm transition ${
                  issueType === option.value
                    ? "bg-[var(--accent-soft)] text-[var(--text)]"
                    : "bg-[rgba(255,253,249,0.84)] text-[var(--muted)]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs leading-6 text-[var(--accent-sage-text)]">{t.topicNote}</p>
        </div>

        <div className="mt-5">
          <label className="block">
            <span className="text-sm font-medium text-[var(--text)]">{t.textareaLabel}</span>
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={t.placeholder}
              className="mt-3 min-h-[168px] w-full rounded-[1.6rem] border border-[color:var(--line-soft)] bg-[rgba(255,253,249,0.94)] px-5 py-5 text-sm leading-8 text-[var(--text)] outline-none transition focus:border-[#867164]"
            />
          </label>
        </div>

        <div className="mt-5">
          <button
            type="button"
            onClick={() => setDetailsOpen((value) => !value)}
            className="text-sm text-[var(--muted)] underline underline-offset-4"
          >
            {detailsOpen ? t.detailsToggleClose : t.detailsToggleOpen}
          </button>
          {detailsOpen && (
            <div className="mt-4 rounded-[1.5rem] bg-[rgba(237,242,234,0.78)] px-5 py-5">
              <div className="text-sm font-medium text-[var(--accent-sage-text)]">{t.detailLabel}</div>
              <p className="mt-2 text-sm leading-7 text-[var(--accent-sage-text)]">{t.detailsHint}</p>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {detailOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setIdentity(option.value)}
                    className={`rounded-full px-4 py-2.5 text-sm transition ${
                      identity === option.value
                        ? "bg-[var(--accent)] text-white"
                        : "bg-[rgba(255,253,249,0.86)] text-[var(--muted)]"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm leading-7 text-[var(--muted)]">
            {detailsOpen ? `${activeIdentityLabel} / ${activeTopicLabel}` : activeTopicLabel}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-[1.2rem] bg-[var(--accent)] px-6 py-4 text-sm text-white shadow-[0_16px_30px_rgba(47,35,33,0.14)] transition hover:translate-y-[-1px] hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? t.loading : t.submit}
          </button>
        </div>
        {error && <p className="mt-4 text-sm text-[#9A3B2F]">{error}</p>}
      </form>

      <div className="mt-8 border-t border-[color:var(--line-soft)] pt-6">
        <div className="text-sm font-medium text-[var(--text)]">{t.assistantLabel}</div>
        <div className="mt-4 rounded-[1.6rem] bg-[var(--surface-soft)] px-5 py-5 text-sm leading-8 text-[var(--muted)]">
          {assistantMessage?.content || t.assistantEmpty}
        </div>

        {scenarioResult && (
          <p className="mt-4 text-sm leading-7 text-[var(--accent-sage-text)]">
            {scenarioResult.labels.persona || activeIdentityLabel}
            {" / "}
            {scenarioResult.labels.scenario || activeTopicLabel}
          </p>
        )}

        {recommendedActions.length > 0 && (
          <div className="mt-6">
            <div className="text-sm font-medium text-[var(--text)]">{t.actionsTitle}</div>
            <div className="mt-3 space-y-3">
              {recommendedActions.map((action) => (
                <Link
                  key={action.id}
                  href={action.href}
                  className="block rounded-[1.4rem] border border-[color:var(--line-soft)] bg-[rgba(255,253,249,0.78)] px-5 py-4 transition hover:bg-[var(--surface-soft)]"
                >
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
