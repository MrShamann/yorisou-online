"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

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
    { value: "self" as const, label: "ご本人について" },
    { value: "family" as const, label: "ご家族について" },
    { value: "institution" as const, label: "地域・施設について" },
  ],
  en: [
    { value: "self" as const, label: "About myself" },
    { value: "family" as const, label: "About family" },
    { value: "institution" as const, label: "About an organization" },
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
    greeting:
      "こんにちは。AI相談員 ひなたです。移動のことでも、暮らしのことでも、気になっていることをそのままお話しください。",
    quietNote: "うまく整理できていなくても大丈夫です。必要な整理は、ひなたが裏側で少しずつ受け持ちます。",
    promptLabel: "こんな始め方もできます",
    textareaLabel: "気になっていることを、そのままどうぞ",
    placeholder:
      "たとえば「最近の外出が少し不安です」「親の通院をどう支えればよいかわかりません」など、思いつくままで大丈夫です。",
    submit: "ひなたに相談する",
    loading: "ひなたが受け取っています...",
    typing: "ひなたが考えています…",
    detailToggleOpen: "立場を添える",
    detailToggleClose: "立場を閉じる",
    detailHint: "必要なときだけ添えられます。選ばなくても大丈夫です。",
    assistantLabel: "ひなた",
    userLabel: "あなた",
    error: "ご案内の準備に失敗しました。少し時間をおいて、もう一度お試しください。",
    actionsTitle: "このあとできること",
  },
  en: {
    greeting: "Hello, I'm Hinata. Please share what is on your mind about mobility or daily life.",
    quietNote: "You do not need to organize it first. Hinata will quietly help structure it in the background.",
    promptLabel: "You can begin from:",
    textareaLabel: "What is on your mind",
    placeholder: "A short natural message is enough to begin.",
    submit: "Start consultation",
    loading: "Receiving your message...",
    typing: "Hinata is thinking…",
    detailToggleOpen: "Add context",
    detailToggleClose: "Hide context",
    detailHint: "Only if helpful. You can skip this.",
    assistantLabel: "Hinata",
    userLabel: "You",
    error: "We could not prepare guidance. Please try again.",
    actionsTitle: "Next options",
  },
} as const;

const familyHints = ["親", "母", "父", "祖母", "祖父", "家族", "夫", "妻"];
const institutionHints = ["自治体", "施設", "介護", "事業者", "病院", "地域", "導入", "連携"];
const bookingHints = ["相談したい", "予約", "面談", "話を聞いてほしい", "直接"];
const productHints = ["製品", "車いす", "電動", "カート", "何が合う", "比較"];

export default function ScenarioSupportAssistant({ locale }: ScenarioSupportAssistantProps) {
  const t = copy[locale];
  const threadRef = useRef<HTMLDivElement | null>(null);
  const [identity, setIdentity] = useState<SupportIdentity>("self");
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<SupportConversationMessage[]>([
    { role: "assistant", content: t.greeting },
  ]);
  const [recommendedActions, setRecommendedActions] = useState<SupportRecommendedAction[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [identityTouched, setIdentityTouched] = useState(false);
  const [scenarioResult, setScenarioResult] = useState<SupportScenarioResult | null>(null);

  const detailOptions = identityOptions[locale];
  const starterOptions = starters[locale];

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [messages, isSubmitting, recommendedActions.length]);

  function inferIdentityFromMessage(message: string): SupportIdentity {
    if (identityTouched) {
      return identity;
    }

    if (institutionHints.some((keyword) => message.includes(keyword))) {
      return "institution";
    }

    if (familyHints.some((keyword) => message.includes(keyword))) {
      return "family";
    }

    return "self";
  }

  function inferIssueTypeFromMessage(message: string): SupportIssueType {
    if (institutionHints.some((keyword) => message.includes(keyword))) {
      return "institutional_inquiry";
    }
    if (bookingHints.some((keyword) => message.includes(keyword))) {
      return "consultation_booking";
    }
    if (productHints.some((keyword) => message.includes(keyword))) {
      return "product_guidance";
    }
    if (familyHints.some((keyword) => message.includes(keyword))) {
      return "family_mobility_support";
    }
    return "mobility_anxiety";
  }

  async function sendMessage(rawMessage: string, preferredIssueType?: SupportIssueType) {
    const nextUserMessage = rawMessage.trim();
    if (!nextUserMessage || isSubmitting) {
      return;
    }

    setError("");
    setIsSubmitting(true);
    setRecommendedActions([]);
    setScenarioResult(null);

    const resolvedIdentity = inferIdentityFromMessage(nextUserMessage);
    const resolvedIssueType = preferredIssueType || inferIssueTypeFromMessage(nextUserMessage);
    const history = [...messages];
    const nextMessages = [...history, { role: "user" as const, content: nextUserMessage }];

    setMessages(nextMessages);
    setDraft("");

    try {
      const response = await fetch("/api/support/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          identity: resolvedIdentity,
          issueType: resolvedIssueType,
          message: nextUserMessage,
          messages: history,
        }),
      });

      if (!response.ok) {
        throw new Error("request_failed");
      }

      const result = (await response.json()) as SupportChatResponse;
      setMessages((current) => [...current, { role: "assistant", content: result.assistantMessage }]);
      setRecommendedActions(result.recommendedActions);
      setScenarioResult(result.scenarioResult);
      setIdentity(result.scenarioResult.persona);
    } catch {
      setError(t.error);
      setMessages((current) => [...current, { role: "assistant", content: t.error }]);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await sendMessage(draft);
  }

  return (
    <section
      id="scenario-assistant"
      className="rounded-[2rem] border border-[color:var(--line-soft)] bg-[var(--surface)] px-5 py-5 shadow-[0_14px_30px_rgba(47,35,33,0.035)] md:px-6 md:py-6"
    >
      <div ref={threadRef} className="max-h-[34rem] space-y-4 overflow-y-auto pr-1">
        {messages.map((message, index) => {
          const isAssistant = message.role === "assistant";
          const isFirstGreeting = index === 0 && isAssistant;

          return (
            <div key={`${message.role}-${index}`} className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}>
              <div className={`flex max-w-[48rem] gap-3 ${isAssistant ? "" : "flex-row-reverse"}`}>
                <div
                  className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm ${
                    isAssistant
                      ? "bg-[var(--surface-sage)] text-[var(--accent-sage-text)]"
                      : "bg-[var(--surface-soft)] text-[var(--muted)]"
                  }`}
                >
                  {isAssistant ? "ひ" : "話"}
                </div>
                <div
                  className={`rounded-[1.5rem] px-4 py-4 text-sm leading-8 md:px-5 ${
                    isAssistant
                      ? "border border-[color:var(--line-soft)] bg-[rgba(255,253,249,0.8)] text-[var(--text)]"
                      : "bg-[var(--surface-soft)] text-[var(--text)]"
                  }`}
                >
                  <div className="text-[11px] tracking-[0.14em] text-[var(--muted)]">
                    {isAssistant ? t.assistantLabel : t.userLabel}
                  </div>
                  <p className="mt-2 whitespace-pre-wrap">{message.content}</p>

                  {isFirstGreeting && (
                    <>
                      <p className="mt-3 text-sm leading-7 text-[var(--accent-sage-text)]">{t.quietNote}</p>
                      <div className="mt-4">
                        <div className="text-[11px] tracking-[0.14em] text-[var(--muted)]">{t.promptLabel}</div>
                        <div className="mt-3 flex flex-wrap gap-2.5">
                          {starterOptions.map((starter) => (
                            <button
                              key={starter.label}
                              type="button"
                              onClick={() => void sendMessage(starter.message, starter.issueType)}
                              className="rounded-full border border-[color:var(--line-sage)] bg-[rgba(255,253,249,0.88)] px-4 py-2.5 text-sm text-[var(--accent-sage-text)] transition hover:bg-[var(--surface-sage)]"
                            >
                              {starter.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {isAssistant && index === messages.length - 1 && scenarioResult && recommendedActions.length > 0 && !isSubmitting && (
                    <div className="mt-5 rounded-[1.3rem] bg-[var(--surface-sage)]/75 px-4 py-4">
                      <div className="text-[11px] tracking-[0.14em] text-[var(--accent-sage-text)]">{t.actionsTitle}</div>
                      <div className="mt-3 flex flex-col gap-2.5">
                        {recommendedActions.map((action) => (
                          <Link
                            key={action.id}
                            href={action.href}
                            className="rounded-[1rem] border border-[color:var(--line-sage)] bg-[rgba(252,250,245,0.86)] px-4 py-3 text-sm text-[var(--accent-sage-text)] transition hover:bg-white"
                          >
                            <div className="font-medium text-[var(--text)]">{action.title}</div>
                            <div className="mt-1 leading-7">{action.description}</div>
                            <div className="mt-2 text-sm underline underline-offset-4">{action.label}</div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isSubmitting && (
          <div className="flex justify-start">
            <div className="flex max-w-[42rem] gap-3">
              <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--surface-sage)] text-sm text-[var(--accent-sage-text)]">
                ひ
              </div>
              <div className="rounded-[1.5rem] border border-[color:var(--line-soft)] bg-[rgba(255,253,249,0.8)] px-4 py-4 text-sm text-[var(--muted)]">
                {t.typing}
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-5 border-t border-[color:var(--line-soft)] pt-5">
        <div className="flex items-center justify-between gap-3">
          <div className="text-[11px] tracking-[0.14em] text-[var(--muted)]">{t.textareaLabel}</div>
          <button
            type="button"
            onClick={() => setDetailsOpen((value) => !value)}
            className="text-sm text-[var(--accent-sage-text)] underline underline-offset-4"
          >
            {detailsOpen ? t.detailToggleClose : t.detailToggleOpen}
          </button>
        </div>

        {detailsOpen && (
          <div className="mt-3 rounded-[1.2rem] bg-[var(--surface-sage)]/72 px-4 py-4">
            <div className="text-sm leading-7 text-[var(--accent-sage-text)]">{t.detailHint}</div>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {detailOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setIdentityTouched(true);
                    setIdentity(option.value);
                  }}
                  className={`rounded-full px-4 py-2.5 text-sm transition ${
                    identity === option.value
                      ? "bg-[var(--accent)] text-white"
                      : "border border-[color:var(--line-sage)] bg-[rgba(252,250,245,0.86)] text-[var(--accent-sage-text)]"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-3 rounded-[1.4rem] border border-[color:var(--line-soft)] bg-[rgba(255,253,249,0.82)] px-4 py-4">
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={t.placeholder}
            className="min-h-[92px] w-full resize-none bg-transparent text-sm leading-8 text-[var(--text)] outline-none md:text-base"
          />
          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="text-sm text-[var(--muted)]">{identityTouched ? detailOptions.find((option) => option.value === identity)?.label : "\u00A0"}</div>
            <button
              type="submit"
              disabled={isSubmitting || draft.trim().length === 0}
              className="rounded-[1.2rem] bg-[var(--accent)] px-5 py-3 text-sm text-white shadow-[0_12px_24px_rgba(47,35,33,0.12)] transition hover:translate-y-[-1px] hover:bg-[var(--cta-main-hover)] disabled:cursor-not-allowed disabled:opacity-65"
            >
              {isSubmitting ? t.loading : t.submit}
            </button>
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-[#9A3B2F]">{error}</p>}
      </form>
    </section>
  );
}
