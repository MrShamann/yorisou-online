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
    description: "内容を確認しながらご案内します。わからないことも一緒に整理します。",
    step1: "1. ご相談者を選ぶ",
    step2: "2. ご相談内容を選ぶ",
    step3: "3. 気になっていることを書く",
    placeholder: "たとえば、最近の外出で不安なことや、ご家族として気になっていることをお書きください。",
    submit: "ひなたに相談する",
    loading: "内容を確認しています...",
    summaryTitle: "ご相談の整理",
    actionsTitle: "おすすめの進み方",
    emptyPrompt: "選択だけでも大丈夫です。お気軽にご相談ください。",
    error: "ご案内の準備に失敗しました。時間をおいてもう一度お試しください。",
    assistantLabel: "AI相談員 ひなた",
    userLabel: "ご相談内容",
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
      className="rounded-[2rem] border border-[#D6C3A3]/28 bg-white/86 p-7 shadow-[0_20px_48px_rgba(59,47,47,0.05)]"
    >
      <div className="service-kicker">{t.badge}</div>
      <h2 className="mt-3 text-3xl font-light leading-tight text-[#3B2F2F]">{t.title}</h2>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-[#5A4B3E]">{t.description}</p>

      <form className="mt-6 grid gap-6" onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="grid gap-5">
            <div className="rounded-[1.4rem] border border-[#E0D2C4] bg-[#FCFAF6] px-5 py-5">
              <div className="text-sm font-medium text-[#312321]">{t.step1}</div>
              <div className="mt-4 flex flex-wrap gap-3">
                {identityOptions[locale].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setIdentity(option.value)}
                    className={`rounded-full px-4 py-3 text-sm transition ${
                      identity === option.value
                        ? "bg-[#312321] text-white shadow-[0_10px_24px_rgba(47,35,33,0.16)]"
                        : "border border-[#D6C3A3]/45 bg-white text-[#5A4B3E]"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[1.4rem] border border-[#E0D2C4] bg-[#FCFAF6] px-5 py-5">
              <div className="text-sm font-medium text-[#312321]">{t.step2}</div>
              <div className="mt-4 grid gap-3">
                {issueOptions[locale].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setIssueType(option.value)}
                    className={`rounded-[1.2rem] px-4 py-4 text-left text-sm leading-7 transition ${
                      issueType === option.value
                        ? "bg-[#F3E8D6] text-[#312321] shadow-[0_10px_24px_rgba(47,35,33,0.08)]"
                        : "border border-[#D6C3A3]/40 bg-white text-[#5A4B3E]"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[1.4rem] border border-[#E0D2C4] bg-[#FCFAF6] px-5 py-5">
              <div className="text-sm font-medium text-[#312321]">{t.step3}</div>
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={t.placeholder}
                className="mt-4 min-h-[160px] w-full rounded-[1.2rem] border border-[#D6C3A3]/45 bg-white px-4 py-4 text-sm leading-7 text-[#3B2F2F] outline-none transition focus:border-[#6B5A4A]"
              />
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-[1.2rem] bg-[#312321] px-6 py-4 text-sm text-white shadow-[0_16px_30px_rgba(47,35,33,0.18)] transition hover:translate-y-[-1px] hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? t.loading : t.submit}
                </button>
              </div>
              {error && <p className="mt-4 text-sm text-[#9A3B2F]">{error}</p>}
            </div>
          </div>

          <div className="grid gap-5">
            <div className="rounded-[1.4rem] border border-[#E0D2C4] bg-[#FFF9F2] px-5 py-5">
              <div className="text-sm font-medium text-[#312321]">{t.summaryTitle}</div>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <div className="rounded-[1.1rem] border border-[#E0D2C4] bg-white px-4 py-4">
                  <div className="text-xs tracking-[0.12em] text-[#8A7764]">{locale === "ja" ? "ご相談者" : "Persona"}</div>
                  <div className="mt-2 text-sm leading-7 text-[#3B2F2F]">{scenarioResult?.labels.persona || identityLabel}</div>
                </div>
                <div className="rounded-[1.1rem] border border-[#E0D2C4] bg-white px-4 py-4">
                  <div className="text-xs tracking-[0.12em] text-[#8A7764]">{locale === "ja" ? "ご相談テーマ" : "Scenario"}</div>
                  <div className="mt-2 text-sm leading-7 text-[#3B2F2F]">{scenarioResult?.labels.scenario || issueLabel}</div>
                </div>
                <div className="rounded-[1.1rem] border border-[#E0D2C4] bg-white px-4 py-4">
                  <div className="text-xs tracking-[0.12em] text-[#8A7764]">{locale === "ja" ? "ご案内の進め方" : "Guidance"}</div>
                  <div className="mt-2 text-sm leading-7 text-[#3B2F2F]">
                    {scenarioResult?.labels.risk || (locale === "ja" ? "内容を確認しながらご案内" : "Calm guidance")}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[1.4rem] border border-[#E0D2C4] bg-[#FCFAF6] px-5 py-5">
              <div className="text-sm font-medium text-[#312321]">{locale === "ja" ? "ご案内内容" : "Conversation"}</div>
              <div className="mt-4 grid gap-3">
                {messages.length === 0 ? (
                  <div className="rounded-[1.1rem] border border-dashed border-[#D6C3A3]/55 bg-white px-4 py-5 text-sm leading-7 text-[#6B5A4A]">
                    {locale === "ja"
                      ? "ご相談者と内容を選んだあと、気になっていることをお書きください。内容を確認しながらご案内します。"
                      : "Choose who you are and the topic, then share your situation."}
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <div
                      key={`${message.role}-${index}`}
                      className={`rounded-[1.1rem] px-4 py-4 text-sm leading-7 ${
                        message.role === "assistant"
                          ? "border border-[#D6C3A3]/35 bg-white text-[#3B2F2F]"
                          : "bg-[#F3E8D6] text-[#5A4B3E]"
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
            </div>

            {recommendedActions.length > 0 && (
              <div className="rounded-[1.4rem] border border-[#C7D7C1] bg-[linear-gradient(180deg,#F4F9F3_0%,#EDF6EB_100%)] px-5 py-5">
                <div className="text-sm font-medium text-[#314236]">{t.actionsTitle}</div>
                <div className="mt-4 grid gap-3">
                  {recommendedActions.map((action) => (
                    <div key={action.id} className="rounded-[1.1rem] border border-[#C7D7C1] bg-white/85 px-4 py-4">
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
        </div>
      </form>
    </section>
  );
}
