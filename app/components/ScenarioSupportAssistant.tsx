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
  onConversationStateChange?: (started: boolean) => void;
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

export default function ScenarioSupportAssistant({ locale, onConversationStateChange }: ScenarioSupportAssistantProps) {
  const t = copy[locale];
  const threadRef = useRef<HTMLDivElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const [identity, setIdentity] = useState<SupportIdentity>("self");
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<SupportConversationMessage[]>([]);
  const [recommendedActions, setRecommendedActions] = useState<SupportRecommendedAction[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [identityTouched, setIdentityTouched] = useState(false);
  const [scenarioResult, setScenarioResult] = useState<SupportScenarioResult | null>(null);

  const detailOptions = identityOptions[locale];
  const starterOptions = starters[locale];
  const hasStarted = messages.length > 0;

  useEffect(() => {
    onConversationStateChange?.(hasStarted);
  }, [hasStarted, onConversationStateChange]);

  useEffect(() => {
    if (threadRef.current && hasStarted) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
    if (endRef.current && hasStarted) {
      endRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [hasStarted, messages, isSubmitting, recommendedActions.length]);

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
    setDetailsOpen(false);

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

  async function handleComposerKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      await sendMessage(draft);
    }
  }

  return (
    <section
      id="scenario-assistant"
      className="overflow-hidden rounded-[2rem] border border-[color:var(--line-soft)] bg-[var(--surface)] shadow-[0_18px_38px_rgba(47,35,33,0.05)]"
    >
      <div className="border-b border-[color:var(--line-soft)] bg-[rgba(252,250,245,0.95)] px-4 py-4 md:px-6">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--surface-sage)] text-base text-[var(--accent-sage-text)]">
            ひ
          </div>
          <div className="min-w-0">
            <div className="text-[11px] tracking-[0.14em] text-[var(--muted)]">AI相談員</div>
            <div className="mt-1 text-base text-[var(--text)]">{t.assistantLabel}</div>
          </div>
          {hasStarted && <div className="ml-auto text-xs text-[var(--accent-sage-text)]">{locale === "ja" ? "対話中" : "In conversation"}</div>}
        </div>
      </div>

      <div className="flex min-h-[72vh] flex-col md:min-h-[78vh]">
        <div
          ref={threadRef}
          className={`flex-1 overflow-y-auto px-4 py-5 md:px-6 ${
            hasStarted ? "bg-[linear-gradient(180deg,rgba(247,244,238,0.38)_0%,rgba(252,250,245,0.9)_100%)]" : "bg-[linear-gradient(180deg,rgba(255,255,255,0.62)_0%,rgba(247,244,238,0.48)_100%)]"
          }`}
        >
          {hasStarted ? (
            <div className="mx-auto flex max-w-3xl flex-col gap-4 pb-5">
              {messages.map((message, index) => {
                const isAssistant = message.role === "assistant";

                return (
                  <div key={`${message.role}-${index}`} className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}>
                    <div className={`flex max-w-[44rem] gap-3 ${isAssistant ? "" : "flex-row-reverse"}`}>
                      <div
                        className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm ${
                          isAssistant
                            ? "bg-[var(--surface-sage)] text-[var(--accent-sage-text)]"
                            : "bg-[rgba(58,38,33,0.12)] text-[var(--text)]"
                        }`}
                      >
                        {isAssistant ? "ひ" : "あ"}
                      </div>
                      <div
                        className={`rounded-[1.6rem] px-4 py-4 text-sm leading-8 md:px-5 ${
                          isAssistant
                            ? "border border-[color:var(--line-soft)] bg-[rgba(255,253,249,0.96)] text-[var(--text)] shadow-[0_8px_18px_rgba(47,35,33,0.04)]"
                            : "bg-[var(--accent)] text-white shadow-[0_10px_20px_rgba(47,35,33,0.12)]"
                        }`}
                      >
                        <div className={`text-[11px] tracking-[0.14em] ${isAssistant ? "text-[var(--muted)]" : "text-[rgba(255,255,255,0.72)]"}`}>
                          {isAssistant ? t.assistantLabel : t.userLabel}
                        </div>
                        <p className="mt-2 whitespace-pre-wrap">{message.content}</p>

                        {isAssistant && index === messages.length - 1 && scenarioResult && recommendedActions.length > 0 && !isSubmitting && (
                          <div className="mt-4 border-t border-[color:var(--line-soft)] pt-4">
                            <div className="text-[11px] tracking-[0.14em] text-[var(--muted)]">{t.actionsTitle}</div>
                            <div className="mt-3 flex snap-x gap-2 overflow-x-auto pb-1">
                              {recommendedActions.map((action) => (
                                <Link
                                  key={action.id}
                                  href={action.href}
                                  className="min-w-[13.5rem] shrink-0 snap-start rounded-[1rem] border border-[color:var(--line-sage)] bg-[var(--surface-sage)]/72 px-3.5 py-3 text-sm text-[var(--accent-sage-text)] transition hover:bg-[var(--surface-sage)]"
                                >
                                  <div className="font-medium text-[var(--text)]">{action.title}</div>
                                  <div className="mt-1 line-clamp-3 leading-7">{action.description}</div>
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
                    <div className="rounded-[1.5rem] border border-[color:var(--line-soft)] bg-[rgba(255,253,249,0.96)] px-4 py-4 text-sm text-[var(--muted)]">
                      {t.typing}
                    </div>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>
          ) : (
            <div className="mx-auto flex h-full max-w-3xl flex-col justify-center gap-5 pb-4 pt-2">
              <div className="flex justify-start">
                <div className="flex max-w-[44rem] gap-3">
                  <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--surface-sage)] text-sm text-[var(--accent-sage-text)]">
                    ひ
                  </div>
                  <div className="rounded-[1.6rem] border border-[color:var(--line-soft)] bg-[rgba(255,253,249,0.96)] px-4 py-4 text-sm leading-8 text-[var(--text)] shadow-[0_8px_18px_rgba(47,35,33,0.04)] md:px-5">
                    <div className="text-[11px] tracking-[0.14em] text-[var(--muted)]">{t.assistantLabel}</div>
                    <p className="mt-2 whitespace-pre-wrap">{t.greeting}</p>
                    <p className="mt-3 text-[var(--muted)]">{t.quietNote}</p>
                  </div>
                </div>
              </div>
              <div>
                <div className="text-[11px] tracking-[0.14em] text-[var(--muted)]">{t.promptLabel}</div>
                <div className="mt-3 flex flex-wrap gap-2.5">
                  {starterOptions.map((starter) => (
                    <button
                      key={starter.label}
                      type="button"
                      onClick={() => void sendMessage(starter.message, starter.issueType)}
                      className="rounded-full border border-[color:var(--line-sage)] bg-[rgba(255,253,249,0.92)] px-4 py-2.5 text-sm text-[var(--accent-sage-text)] transition hover:bg-[var(--surface-sage)]"
                    >
                      {starter.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="border-t border-[color:var(--line-soft)] bg-[rgba(252,250,245,0.98)] px-4 py-4 backdrop-blur-sm md:px-6">
          <div className="mx-auto max-w-3xl">
            {detailsOpen && (
              <div className="mb-3 rounded-[1.2rem] bg-[var(--surface-sage)]/72 px-4 py-4">
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
                          : "border border-[color:var(--line-sage)] bg-[rgba(252,250,245,0.9)] text-[var(--accent-sage-text)]"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-[1.5rem] border border-[color:var(--line-soft)] bg-white/92 px-4 py-4 shadow-[0_10px_22px_rgba(47,35,33,0.04)]">
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => void handleComposerKeyDown(event)}
                placeholder={t.placeholder}
                className="min-h-[88px] w-full resize-none bg-transparent text-sm leading-8 text-[var(--text)] outline-none md:text-base"
              />
              <div className="mt-3 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setDetailsOpen((value) => !value)}
                  className="text-sm text-[var(--accent-sage-text)] underline underline-offset-4"
                >
                  {detailsOpen ? t.detailToggleClose : t.detailToggleOpen}
                </button>
                <div className="flex items-center gap-3">
                  {identityTouched && (
                    <div className="hidden text-sm text-[var(--muted)] md:block">
                      {detailOptions.find((option) => option.value === identity)?.label}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting || draft.trim().length === 0}
                    className="rounded-[1.15rem] bg-[var(--accent)] px-5 py-3 text-sm text-white shadow-[0_12px_24px_rgba(47,35,33,0.12)] transition hover:translate-y-[-1px] hover:bg-[var(--cta-main-hover)] disabled:cursor-not-allowed disabled:opacity-65"
                  >
                    {isSubmitting ? t.loading : t.submit}
                  </button>
                </div>
              </div>
            </div>

            {error && <p className="mt-3 text-sm text-[#9A3B2F]">{error}</p>}
          </div>
        </form>
      </div>
    </section>
  );
}
