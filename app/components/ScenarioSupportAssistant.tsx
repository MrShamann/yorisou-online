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
    { value: "product_guidance" as const, label: "製品について知りたい" },
    { value: "consultation_booking" as const, label: "導入相談をしたい" },
    { value: "institutional_inquiry" as const, label: "協業・導入について聞きたい" },
  ],
  en: [
    { value: "mobility_anxiety" as const, label: "Mobility concern" },
    { value: "family_mobility_support" as const, label: "Family support" },
    { value: "product_guidance" as const, label: "Product guidance" },
    { value: "consultation_booking" as const, label: "Consultation" },
    { value: "institutional_inquiry" as const, label: "Implementation inquiry" },
  ],
};

const copy = {
  ja: {
    badge: "AI相談案内",
    title: "ご相談内容をお聞かせください",
    description:
      "移動の不安から暮らしのことまで、ひなたが順番にお話をうかがいます。うまくまとまっていなくても、そのままで大丈夫です。",
    step1: "どなたについてのご相談ですか",
    step2: "いま近い内容を選んでください",
    step3: "気になっていることを、ひとことでも",
    placeholder: "たとえば、最近の外出で不安なことや、ご家族として気になっていることをお書きください。",
    submit: "ひなたに相談する",
    loading: "内容を確認しています...",
    summaryTitle: "ひなたが受け取った内容",
    actionsTitle: "このあと選べること",
    emptyPrompt: "選択だけでも大丈夫です。お気軽にご相談ください。ひなたがやさしくお話をうかがいます。",
    error: "ご案内の準備に失敗しました。時間をおいてもう一度お試しください。",
    assistantLabel: "AI相談員 ひなた",
    userLabel: "ご相談内容",
    helper: "まずは近いものを選ぶだけでも大丈夫です。必要なことは、ひなたが少しずつ一緒に整理します。",
    introTitle: "まずは、いま気になっていることから。",
    conversationTitle: "ひなたからのご案内",
    conversationEmpty: "ご相談者と内容を選んだあと、気になっていることをひとこと添えてみてください。ひなたが落ち着いてご案内します。",
    selectionLabel: "選択中",
    personaLabel: "ご相談者",
    scenarioLabel: "ご相談内容",
    guidanceLabel: "ご案内の進め方",
    guidanceFallback: "内容を確認しながら、やさしくご案内します。",
  },
  en: {
    badge: "AI consultation",
    title: "Tell us about your situation",
    description: "We guide you calmly and help organize the next step.",
    step1: "1. Choose who you are",
    step2: "2. Choose the topic",
    step3: "3. Share your situation",
    placeholder: "Share what feels difficult right now.",
    submit: "Start consultation",
    loading: "Preparing guidance...",
    summaryTitle: "Consultation summary",
    actionsTitle: "Recommended next steps",
    emptyPrompt: "You can start with the selections only.",
    error: "We could not prepare guidance. Please try again.",
    assistantLabel: "AI consultation guide",
    userLabel: "Your message",
    helper: "You can begin with a simple selection first. We help organize the rest calmly.",
    introTitle: "Start with what feels important today.",
    conversationTitle: "Hinata's guidance",
    conversationEmpty: "Choose who you are and the topic, then share your situation in a few words.",
    selectionLabel: "Current selection",
    personaLabel: "Persona",
    scenarioLabel: "Topic",
    guidanceLabel: "Guidance",
    guidanceFallback: "We guide you calmly while organizing the next step.",
  },
} as const;

export default function ScenarioSupportAssistant({ locale }: ScenarioSupportAssistantProps) {
  const t = copy[locale];
  const [identity, setIdentity] = useState<SupportIdentity>("self");
  const [issueType, setIssueType] = useState<SupportIssueType>("mobility_anxiety");
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<SupportConversationMessage[]>([]);
  const [scenarioResult, setScenarioResult] = useState<SupportScenarioResult | null>(null);
  const [recommendedActions, setRecommendedActions] = useState<SupportRecommendedAction[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const identityLabel = useMemo(
    () => identityOptions[locale].find((option) => option.value === identity)?.label || "",
    [identity, locale],
  );
  const issueLabel = useMemo(
    () => issueOptions[locale].find((option) => option.value === issueType)?.label || "",
    [issueType, locale],
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
        headers: {
          "Content-Type": "application/json",
        },
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
      setScenarioResult(result.scenarioResult);
      setRecommendedActions(result.recommendedActions);
      setDraft("");
    } catch {
      setError(t.error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      id="scenario-assistant"
      className="rounded-[2.2rem] border border-[#D6C3A3]/20 bg-white/78 p-6 shadow-[0_16px_38px_rgba(59,47,47,0.04)] md:p-8"
    >
      <div className="service-kicker">{t.badge}</div>
      <h2 className="mt-3 max-w-[18em] text-[2rem] font-light leading-[1.36] text-[#3B2F2F] md:text-[2.4rem]">
        {t.title}
      </h2>
      <p className="mt-4 max-w-2xl text-sm leading-8 text-[#5A4B3E] md:text-base">{t.description}</p>

      <form className="mt-7 space-y-6" onSubmit={handleSubmit}>
        <div className="rounded-[2rem] border border-[#E0D2C4]/72 bg-[#FFFBF6] px-5 py-6 md:px-7">
          <div className="text-sm font-medium text-[#312321]">{t.introTitle}</div>
          <p className="mt-2 text-sm leading-7 text-[#6B5A4A]">{t.helper}</p>

          <div className="mt-6">
            <div className="text-sm font-medium text-[#312321]">{t.step1}</div>
            <div className="mt-3 flex flex-wrap gap-3">
              {identityOptions[locale].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setIdentity(option.value)}
                  className={`rounded-full px-4 py-3 text-sm transition ${
                    identity === option.value
                      ? "bg-[#312321] text-white shadow-[0_10px_24px_rgba(47,35,33,0.12)]"
                      : "border border-[#D6C3A3]/42 bg-white text-[#5A4B3E]"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <div className="text-sm font-medium text-[#312321]">{t.step2}</div>
            <div className="mt-3 flex flex-wrap gap-3">
              {issueOptions[locale].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setIssueType(option.value)}
                  className={`rounded-full px-4 py-3 text-sm transition ${
                    issueType === option.value
                      ? "bg-[#F3E8D6] text-[#312321] shadow-[0_10px_24px_rgba(47,35,33,0.06)]"
                      : "border border-[#D6C3A3]/40 bg-white text-[#5A4B3E]"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-[1.6rem] bg-[#FCF7F0] px-4 py-4 text-sm leading-7 text-[#5A4B3E]">
            <div className="text-xs tracking-[0.12em] text-[#8A7764]">{t.selectionLabel}</div>
            <div className="mt-2">
              {identityLabel} / {issueLabel}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-[#312321]">
              <span>{t.step3}</span>
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={t.placeholder}
                className="mt-3 min-h-[150px] w-full rounded-[1.4rem] border border-[#D6C3A3]/38 bg-white px-4 py-4 text-sm leading-7 text-[#3B2F2F] outline-none transition focus:border-[#6B5A4A]"
              />
            </label>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-7 text-[#6B5A4A]">{t.emptyPrompt}</p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-[1.2rem] bg-[#312321] px-6 py-4 text-sm text-white shadow-[0_16px_30px_rgba(47,35,33,0.14)] transition hover:translate-y-[-1px] hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? t.loading : t.submit}
            </button>
          </div>
          {error && <p className="mt-4 text-sm text-[#9A3B2F]">{error}</p>}
        </div>

        <div className="rounded-[2rem] border border-[#E0D2C4]/62 bg-white/72 px-5 py-6 md:px-7">
          <div className="text-sm font-medium text-[#312321]">{t.conversationTitle}</div>
          {scenarioResult && (
            <div className="mt-4 rounded-[1.5rem] bg-[#FCF7F0] px-4 py-4 text-sm leading-7 text-[#5A4B3E]">
              <div className="text-xs tracking-[0.12em] text-[#8A7764]">{t.summaryTitle}</div>
              <div className="mt-2">
                {t.personaLabel}: {scenarioResult.labels.persona || identityLabel}
              </div>
              <div>
                {t.scenarioLabel}: {scenarioResult.labels.scenario || issueLabel}
              </div>
              <div>
                {t.guidanceLabel}: {scenarioResult.labels.risk || t.guidanceFallback}
              </div>
            </div>
          )}

          <div className="mt-4 space-y-3">
            {messages.length === 0 ? (
              <div className="rounded-[1.5rem] bg-[#FCFAF6] px-4 py-5 text-sm leading-7 text-[#6B5A4A]">
                {t.conversationEmpty}
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`max-w-[92%] rounded-[1.5rem] px-4 py-4 text-sm leading-7 ${
                    message.role === "assistant"
                      ? "border border-[#E0D2C4]/60 bg-[#FFFBF6] text-[#3B2F2F]"
                      : "ml-auto bg-[#F3E8D6] text-[#5A4B3E]"
                  }`}
                >
                  <div className="text-xs tracking-[0.12em] text-[#8A7764]">
                    {message.role === "assistant" ? t.assistantLabel : t.userLabel}
                  </div>
                  <div className="mt-2 whitespace-pre-wrap">{message.content}</div>
                </div>
              ))
            )}
          </div>

          {recommendedActions.length > 0 && (
            <div className="mt-6 border-t border-[#E6D8CA] pt-6">
              <div className="text-sm font-medium text-[#314236]">{t.actionsTitle}</div>
              <div className="mt-4 space-y-3">
                {recommendedActions.map((action) => (
                  <div
                    key={action.id}
                    className="rounded-[1.5rem] border border-[#C7D7C1]/72 bg-[linear-gradient(180deg,#F7FBF6_0%,#F1F7EF_100%)] px-4 py-4"
                  >
                    <div className="text-sm font-medium text-[#243329]">{action.title}</div>
                    <p className="mt-2 text-sm leading-7 text-[#4D5642]">{action.description}</p>
                    <div className="mt-4">
                      <Link href={action.href} className="btn btn-secondary">
                        {action.label}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </form>
    </section>
  );
}
