"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

import type { AdvisorAnswers, AdvisorRecommendation, Locale } from "@/lib/ai/yorisouAdvisor";
import { getAnswerLabels } from "@/lib/ai/yorisouAdvisor";
import { markConsultationLeadSubmitted, saveConsultationSnapshot } from "@/lib/mvpAccountStorage";
import type { AdvisorLead } from "@/lib/yorisouAdvisorStorage";

type AdvisorFlowProps = {
  locale: Locale;
};

type StepDefinition = {
  key: keyof AdvisorAnswers;
  title: string;
  description: string;
};

type ResultResponse = {
  success: true;
  recommendation: AdvisorRecommendation;
};

type LeadResponse = {
  success: true;
  entryId: string;
};

const initialAnswers: AdvisorAnswers = {
  userType: "self",
  ageRange: "65to74",
  walkingAbility: "somewhat_limited",
  primaryScenario: "shopping",
  usageEnvironment: "outdoor",
  needFoldable: "not_sure",
  carTrunkFit: "no",
  useFrequency: "weekly",
  budgetRange: "200kto400k",
  safetyNote: "",
};

const initialLead: AdvisorLead = {
  name: "",
  phone: "",
  email: "",
  city: "",
  preferredContactMethod: "either",
  interestedInTestRide: "yes",
  additionalNotes: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const copy = {
  ja: {
    badge: "Yorisou 相談案内",
    heroTitle: "まずは一問、\nこれからの移動を一緒に整理しましょう",
    heroText: "ご本人やご家族の移動状況を順番にうかがい、いま合いやすい候補と、次に相談したいことを静かに整理します。",
    estimate: "所要時間 約2分",
    progressLabel: "進行状況",
    start: "相談を始める",
    startSubtext: "",
    next: "次へ",
    back: "戻る",
    review: "結果を見る",
    restart: "最初から見直す",
    loading: "整理しています...",
    recommendationTitle: "おすすめ結果",
    secondaryTitle: "次点候補",
    whyTitle: "おすすめ理由",
    cautionTitle: "確認しておきたい点",
    summaryTitle: "ご相談内容の整理",
    answersTitle: "ご入力内容",
    leadTitle: "ご相談内容を送る",
    leadText:
      "試乗や個別相談をご希望の場合は、連絡先をご入力ください。送信した内容はサポートページでも確認できます。",
    leadSubmit: "相談内容を送信する",
    leadSubmitting: "送信中...",
    leadSuccess: "送信を受け付けました。内容を確認のうえ、順次ご連絡いたします。サポートページにも反映しました。",
    leadError: "送信に失敗しました。時間をおいて再度お試しください。",
    disclaimer:
      "本結果は一般的なご案内です。実際の適合性・安全性は、個別相談や試乗での確認をおすすめします。",
    devNote: "開発中は /dev/ai-advisor で保存内容を確認できます。",
    supportTitle: "このあとのご相談",
    supportCards: [
      "おすすめ内容を見返しながら、試乗や個別相談に進めます。",
      "ご家族へ伝えたい要点を整理しながら、相談を続けられます。",
      "相談結果はサポートページにも残せます。",
    ],
    nextStepTitle: "このあとの進め方",
    fields: {
      name: "お名前",
      phone: "電話番号",
      email: "メールアドレス",
      city: "お住まいの地域",
      preferredContactMethod: "希望連絡方法",
      interestedInTestRide: "試乗希望",
      additionalNotes: "追加メモ",
      safetyNote: "安全面の心配や特記事項",
    },
    contactMethods: {
      phone: "電話",
      email: "メール",
      either: "どちらでも可",
    },
    yesNo: {
      yes: "はい",
      no: "いいえ",
    },
    validation: {
      lead: "お名前、電話番号、メールアドレス、お住まいの地域を確認してください。",
    },
    stepDescriptions: {
      userType: "どなたが利用される予定ですか。",
      ageRange: "主に使う方の年齢帯を教えてください。",
      walkingAbility: "歩行のご様子に近いものをお選びください。",
      primaryScenario: "どのような移動が多いですか。",
      usageEnvironment: "利用場所のイメージを教えてください。",
      needFoldable: "収納や折りたたみの必要性はありますか。",
      carTrunkFit: "車のトランクに載せたいですか。",
      useFrequency: "どのくらいの頻度で使う想定ですか。",
      budgetRange: "ご予算の目安を教えてください。",
      safetyNote: "最後に、気になっていることがあればご記入ください。",
    },
  },
  en: {
    badge: "Yorisou Mobility Advisor",
    heroTitle: "Start with one question,\nand we will calmly map the next steps",
    heroText:
      "We ask a few structured questions and organize a recommendation that fits the user and family situation, while preparing for consultation and follow-up.",
    estimate: "About 2 minutes",
    progressLabel: "Progress",
    start: "Start consultation",
    startSubtext: "Mostly tap selections.",
    next: "Next",
    back: "Back",
    review: "See recommendation",
    restart: "Start over",
    loading: "Preparing recommendation...",
    recommendationTitle: "Recommendation",
    secondaryTitle: "Secondary option",
    whyTitle: "Why this fits",
    cautionTitle: "Points to confirm",
    summaryTitle: "Summary",
    answersTitle: "Your answers",
    leadTitle: "Send this consultation",
    leadText:
      "If you would like a test ride or direct consultation, leave your contact details and the result will also remain visible in the support page.",
    leadSubmit: "Submit consultation",
    leadSubmitting: "Submitting...",
    leadSuccess: "Your consultation has been received. We will review it and contact you as the next step in support.",
    leadError: "Submission failed. Please try again shortly.",
    disclaimer:
      "This result is general guidance only. Real suitability and safety should be confirmed during consultation or a test ride.",
    devNote: "During local development, saved entries can be reviewed at /dev/ai-advisor.",
    supportTitle: "What comes next",
    supportCards: [
      "Use the recommendation as a starting point for a test ride or a direct consultation.",
      "Keep key points easy to share with family members before a decision.",
      "Review the saved result again in the support page.",
    ],
    nextStepTitle: "Next steps from here",
    fields: {
      name: "Name",
      phone: "Phone",
      email: "Email",
      city: "City / Area",
      preferredContactMethod: "Preferred contact method",
      interestedInTestRide: "Interested in test ride",
      additionalNotes: "Additional notes",
      safetyNote: "Safety concern or special note",
    },
    contactMethods: {
      phone: "Phone",
      email: "Email",
      either: "Either",
    },
    yesNo: {
      yes: "Yes",
      no: "No",
    },
    validation: {
      lead: "Please confirm name, phone, email, and city/area.",
    },
    stepDescriptions: {
      userType: "Who will use the mobility product?",
      ageRange: "What is the main age range?",
      walkingAbility: "How would you describe walking ability?",
      primaryScenario: "What is the main usage scenario?",
      usageEnvironment: "Where will it mainly be used?",
      needFoldable: "Is foldable or compact storage important?",
      carTrunkFit: "Does it need to fit in a car trunk?",
      useFrequency: "How often will it likely be used?",
      budgetRange: "What is the expected budget range?",
      safetyNote: "Any safety concern or special note?",
    },
  },
} as const;

const questionOptions = {
  ja: {
    userType: [
      { value: "self", label: "ご本人" },
      { value: "parent", label: "親御さま" },
      { value: "family", label: "ご家族" },
      { value: "facility", label: "施設・事業所" },
    ],
    ageRange: [
      { value: "under65", label: "65歳未満" },
      { value: "65to74", label: "65〜74歳" },
      { value: "75to84", label: "75〜84歳" },
      { value: "85plus", label: "85歳以上" },
    ],
    walkingAbility: [
      { value: "normal", label: "通常どおり歩ける" },
      { value: "somewhat_limited", label: "少し不安がある" },
      { value: "difficult_long_distance", label: "長距離歩行が負担" },
    ],
    primaryScenario: [
      { value: "shopping", label: "買い物" },
      { value: "hospital", label: "通院" },
      { value: "neighborhood", label: "近隣移動" },
      { value: "commuting", label: "通勤・通所" },
      { value: "mixed", label: "複数用途" },
    ],
    usageEnvironment: [
      { value: "outdoor", label: "屋外中心" },
      { value: "mixed", label: "屋内外の併用" },
      { value: "indoor_community", label: "屋内・敷地内中心" },
    ],
    needFoldable: [
      { value: "yes", label: "必要" },
      { value: "no", label: "不要" },
      { value: "not_sure", label: "まだわからない" },
    ],
    carTrunkFit: [
      { value: "yes", label: "載せたい" },
      { value: "no", label: "特に不要" },
    ],
    useFrequency: [
      { value: "occasional", label: "たまに使う" },
      { value: "weekly", label: "週1回程度" },
      { value: "several_times_week", label: "週に数回" },
      { value: "daily", label: "ほぼ毎日" },
    ],
    budgetRange: [
      { value: "under200k", label: "20万円未満" },
      { value: "200kto400k", label: "20万〜40万円" },
      { value: "400kto700k", label: "40万〜70万円" },
      { value: "700kplus", label: "70万円以上" },
    ],
  },
  en: {
    userType: [
      { value: "self", label: "Self" },
      { value: "parent", label: "Parent" },
      { value: "family", label: "Family member" },
      { value: "facility", label: "Facility" },
    ],
    ageRange: [
      { value: "under65", label: "Under 65" },
      { value: "65to74", label: "65-74" },
      { value: "75to84", label: "75-84" },
      { value: "85plus", label: "85+" },
    ],
    walkingAbility: [
      { value: "normal", label: "Mostly normal" },
      { value: "somewhat_limited", label: "Some limitation" },
      { value: "difficult_long_distance", label: "Long distances are difficult" },
    ],
    primaryScenario: [
      { value: "shopping", label: "Shopping" },
      { value: "hospital", label: "Hospital visits" },
      { value: "neighborhood", label: "Neighborhood trips" },
      { value: "commuting", label: "Commuting" },
      { value: "mixed", label: "Mixed use" },
    ],
    usageEnvironment: [
      { value: "outdoor", label: "Outdoor only" },
      { value: "mixed", label: "Mixed indoor/outdoor" },
      { value: "indoor_community", label: "Mostly indoor/community" },
    ],
    needFoldable: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "not_sure", label: "Not sure" },
    ],
    carTrunkFit: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
    useFrequency: [
      { value: "occasional", label: "Occasional" },
      { value: "weekly", label: "Weekly" },
      { value: "several_times_week", label: "Several times a week" },
      { value: "daily", label: "Daily" },
    ],
    budgetRange: [
      { value: "under200k", label: "Under JPY 200k" },
      { value: "200kto400k", label: "JPY 200k-400k" },
      { value: "400kto700k", label: "JPY 400k-700k" },
      { value: "700kplus", label: "JPY 700k+" },
    ],
  },
} as const;

export default function AdvisorFlow({ locale }: AdvisorFlowProps) {
  const [hasStarted, setHasStarted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<AdvisorAnswers>(initialAnswers);
  const [recommendation, setRecommendation] = useState<AdvisorRecommendation | null>(null);
  const [lead, setLead] = useState<AdvisorLead>(initialLead);
  const [isLoadingRecommendation, setIsLoadingRecommendation] = useState(false);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [advisorError, setAdvisorError] = useState("");
  const [leadError, setLeadError] = useState("");
  const [leadSuccess, setLeadSuccess] = useState("");
  const [savedEntryId, setSavedEntryId] = useState<string | null>(null);

  const t = copy[locale];
  const supportHref = locale === "ja" ? "/support" : "/en/support";
  const loginHref = locale === "ja" ? "/login" : "/en/login";
  const steps: StepDefinition[] = [
    { key: "userType", title: t.stepDescriptions.userType, description: t.stepDescriptions.userType },
    { key: "ageRange", title: t.stepDescriptions.ageRange, description: t.stepDescriptions.ageRange },
    { key: "walkingAbility", title: t.stepDescriptions.walkingAbility, description: t.stepDescriptions.walkingAbility },
    { key: "primaryScenario", title: t.stepDescriptions.primaryScenario, description: t.stepDescriptions.primaryScenario },
    { key: "usageEnvironment", title: t.stepDescriptions.usageEnvironment, description: t.stepDescriptions.usageEnvironment },
    { key: "needFoldable", title: t.stepDescriptions.needFoldable, description: t.stepDescriptions.needFoldable },
    { key: "carTrunkFit", title: t.stepDescriptions.carTrunkFit, description: t.stepDescriptions.carTrunkFit },
    { key: "useFrequency", title: t.stepDescriptions.useFrequency, description: t.stepDescriptions.useFrequency },
    { key: "budgetRange", title: t.stepDescriptions.budgetRange, description: t.stepDescriptions.budgetRange },
    { key: "safetyNote", title: t.stepDescriptions.safetyNote, description: t.stepDescriptions.safetyNote },
  ];

  const progress = Math.round((stepIndex / steps.length) * 100);
  const answerLabels = useMemo(() => getAnswerLabels(answers, locale), [answers, locale]);
  const currentStep = steps[stepIndex];

  const handleOptionChange = (key: keyof AdvisorAnswers, value: string) => {
    setAnswers((current) => ({ ...current, [key]: value }));
  };

  const handleGenerateRecommendation = async () => {
    setIsLoadingRecommendation(true);
    setAdvisorError("");
    setRecommendation(null);

    try {
      const response = await fetch("/api/ai-advisor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          locale,
          answers,
        }),
      });

      if (!response.ok) {
        throw new Error("request_failed");
      }

      const result = (await response.json()) as ResultResponse;
      setRecommendation(result.recommendation);
      const entryId = saveConsultationSnapshot({
        locale,
        recommendation: result.recommendation,
        answerLabels: getAnswerLabels(answers, locale),
      });
      setSavedEntryId(entryId);
    } catch {
      setAdvisorError(locale === "ja" ? "おすすめの整理に失敗しました。時間をおいて再度お試しください。" : "Failed to prepare recommendation. Please try again.");
    } finally {
      setIsLoadingRecommendation(false);
    }
  };

  const handleLeadSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!recommendation) {
      return;
    }

    if (!lead.name.trim() || !lead.phone.trim() || !EMAIL_PATTERN.test(lead.email.trim()) || !lead.city.trim()) {
      setLeadError(t.validation.lead);
      setLeadSuccess("");
      return;
    }

    setIsSubmittingLead(true);
    setLeadError("");
    setLeadSuccess("");

    try {
      const response = await fetch("/api/ai-advisor/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          locale,
          answers,
          recommendation,
          lead: {
            ...lead,
            email: lead.email.trim(),
          },
        }),
      });

      if (!response.ok) {
        throw new Error("submit_failed");
      }

      await response.json() as LeadResponse;
      if (savedEntryId) {
        markConsultationLeadSubmitted(savedEntryId);
      }
      setLeadSuccess(t.leadSuccess);
      setLead(initialLead);
    } catch {
      setLeadError(t.leadError);
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const showResults = Boolean(recommendation);
  const currentRecommendation = recommendation;
  const phaseLabels = locale === "ja" ? ["開始", "整理", "ご相談"] : ["Start", "Review", "Consult"];
  const currentPhase = showResults ? 3 : hasStarted ? Math.min(3, Math.floor(stepIndex / 4) + 2) : 1;

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-16">
      {!hasStarted && !showResults ? (
        <section className="mx-auto max-w-3xl">
          <div className="shell-card p-9 text-center md:p-14">
            <h1 className="text-4xl font-light leading-tight text-[#3B2F2F] md:text-5xl">
              {locale === "ja" ? "まずは話してみましょう" : "Start with a calm first conversation"}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#5A4B3E] md:text-lg">
              {locale === "ja"
                ? "ご本人でも、ご家族でも大丈夫です。いまの移動のことを、短く整理するところから始められます。"
                : "We ask a few simple questions and calmly organize the next mobility options for the user and family."}
            </p>
            <div className="mt-8">
              <button
                type="button"
                onClick={() => setHasStarted(true)}
                className="rounded-full bg-[#3B2F2F] px-7 py-3 text-sm text-white shadow-sm transition hover:opacity-90"
              >
                {t.start}
              </button>
            </div>
          </div>
        </section>
      ) : (
      <section className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
        <div className="rounded-[2rem] border border-[#D6C3A3]/40 bg-white/75 p-6 shadow-[0_20px_60px_rgba(59,47,47,0.06)] backdrop-blur md:p-8">
          <div className="inline-flex items-center rounded-full border border-[#D6C3A3]/50 bg-[#F7F2E9] px-4 py-2 text-xs tracking-[0.18em] text-[#8A7764]">
            {t.badge}
          </div>
          <h1 className="mt-5 whitespace-pre-line text-4xl font-light leading-tight text-[#3B2F2F] md:text-5xl">
            {t.heroTitle}
          </h1>
          <p className="mt-5 text-base leading-8 text-[#5A4B3E] md:text-lg">{t.heroText}</p>

          {(hasStarted || showResults) && (
            <div className="mt-8 rounded-[1.5rem] border border-[#D6C3A3]/30 bg-[#FCFAF6] p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-xs tracking-[0.18em] text-[#8A7764]">{t.progressLabel}</div>
                  <div className="mt-2 text-base text-[#5A4B3E]">
                    {showResults ? "100%" : `${progress}%`} / {t.estimate}
                  </div>
                </div>
                <div className="flex gap-2 text-xs">
                  {phaseLabels.map((label, index) => (
                    <div
                      key={label}
                      className={`rounded-full px-3 py-2 ${index + 1 <= currentPhase ? "bg-[#6B5A4A] text-white" : "bg-white text-[#8A7764]"}`}
                    >
                      {label}
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#E8DED0]">
                <div className="h-full rounded-full bg-[#6B5A4A] transition-all" style={{ width: `${showResults ? 100 : progress}%` }} />
              </div>
            </div>
          )}

          <p className="mt-6 text-sm leading-7 text-[#6B5A4A]">{t.disclaimer}</p>
          {process.env.NODE_ENV === "development" && <p className="mt-3 text-xs leading-6 text-[#8A7764]">{t.devNote}</p>}
        </div>

        <div className="rounded-[2rem] border border-[#D6C3A3]/40 bg-white/80 p-6 shadow-[0_20px_60px_rgba(59,47,47,0.06)] backdrop-blur md:p-8">
          {!showResults ? (
            <>
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="text-sm tracking-[0.18em] text-[#8A7764]">
                    STEP {stepIndex + 1} / {steps.length}
                  </div>
                  <h2 className="mt-3 text-3xl font-light leading-tight text-[#3B2F2F]">{currentStep.title}</h2>
                </div>
                <div className="rounded-full border border-[#D6C3A3]/45 bg-[#FCFAF6] px-4 py-2 text-sm text-[#6B5A4A]">
                  {locale === "ja" ? "選択中心で進められます" : "Mostly simple tap selections"}
                </div>
              </div>
              <p className="mt-3 text-sm leading-7 text-[#5A4B3E]">{currentStep.description}</p>

              {currentStep.key === "safetyNote" ? (
                <div className="mt-8">
                  <label className="block text-sm font-medium text-[#5A4B3E]">
                    {t.fields.safetyNote}
                    <textarea
                      value={answers.safetyNote}
                      onChange={(event) => setAnswers((current) => ({ ...current, safetyNote: event.target.value }))}
                      rows={6}
                      className="mt-3 w-full rounded-[1.25rem] border border-[#D6C3A3]/45 bg-[#FCFAF6] px-4 py-4 text-base text-[#3B2F2F] outline-none transition focus:border-[#6B5A4A]"
                      placeholder={locale === "ja" ? "例：段差が不安、操作を簡単にしたい など" : "Example: worried about curbs, wants simpler controls"}
                    />
                  </label>
                </div>
              ) : (
                <div className="mt-8 grid gap-4 md:grid-cols-2">
                  {questionOptions[locale][currentStep.key as Exclude<keyof AdvisorAnswers, "safetyNote">].map((option) => {
                    const selected = answers[currentStep.key] === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleOptionChange(currentStep.key, option.value)}
                        className={`w-full rounded-[1.5rem] border px-5 py-5 text-left transition ${
                          selected
                            ? "border-[#6B5A4A] bg-[#F7F2E9] shadow-sm"
                            : "border-[#D6C3A3]/35 bg-[#FCFAF6] hover:border-[#B9A48A]"
                        }`}
                      >
                        <div className="text-lg font-light text-[#3B2F2F]">{option.label}</div>
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  onClick={() => setStepIndex((current) => Math.max(current - 1, 0))}
                  className="rounded-full border border-[#D6C3A3]/60 px-6 py-3 text-sm text-[#5A4B3E] transition hover:bg-[#FCFAF6]"
                  disabled={stepIndex === 0}
                >
                  {t.back}
                </button>

                {stepIndex < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setStepIndex((current) => Math.min(current + 1, steps.length - 1))}
                    className="rounded-full bg-[#3B2F2F] px-6 py-3 text-sm text-white shadow-sm transition hover:opacity-90"
                  >
                    {t.next}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleGenerateRecommendation}
                    className="rounded-full bg-[#3B2F2F] px-6 py-3 text-sm text-white shadow-sm transition hover:opacity-90"
                    disabled={isLoadingRecommendation}
                  >
                    {isLoadingRecommendation ? t.loading : t.review}
                  </button>
                )}
              </div>

              {advisorError && <p className="mt-4 text-sm font-medium text-[#9A3B2F]">{advisorError}</p>}

              <div className="mt-8 rounded-[1.5rem] border border-[#D6C3A3]/30 bg-[#FCFAF6] p-5">
                <div className="text-xs tracking-[0.18em] text-[#8A7764]">{t.supportTitle}</div>
                <div className="mt-3 grid gap-3">
                  {t.supportCards.map((item) => (
                    <div key={item} className="rounded-2xl bg-white/88 px-4 py-3 text-sm leading-7 text-[#5A4B3E]">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : currentRecommendation ? (
            <div className="space-y-8">
              <div className="rounded-[1.75rem] border border-[#D6C3A3]/35 bg-[#FCFAF6] p-6">
                <div className="text-sm tracking-[0.18em] text-[#8A7764]">{t.recommendationTitle}</div>
                <h2 className="mt-3 text-3xl font-light text-[#3B2F2F]">{currentRecommendation.recommendedCategory}</h2>
                <p className="mt-4 text-base leading-8 text-[#5A4B3E]">{currentRecommendation.summary}</p>
                <div className="mt-5 rounded-[1.25rem] border border-[#D6C3A3]/30 bg-white/80 px-4 py-4">
                  <div className="text-xs tracking-[0.18em] text-[#8A7764]">{t.secondaryTitle}</div>
                  <div className="mt-2 text-lg font-light text-[#3B2F2F]">{currentRecommendation.secondaryRecommendation}</div>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-[1.75rem] border border-[#D6C3A3]/35 bg-white p-6">
                  <div className="text-sm tracking-[0.18em] text-[#8A7764]">{t.whyTitle}</div>
                  <ul className="mt-4 space-y-3 text-sm leading-7 text-[#5A4B3E]">
                    {currentRecommendation.whyItFits.map((item) => (
                      <li key={item} className="rounded-2xl bg-[#FCFAF6] px-4 py-3">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-[1.75rem] border border-[#D6C3A3]/35 bg-white p-6">
                  <div className="text-sm tracking-[0.18em] text-[#8A7764]">{t.cautionTitle}</div>
                  <ul className="mt-4 space-y-3 text-sm leading-7 text-[#5A4B3E]">
                    {currentRecommendation.cautionPoints.map((item) => (
                      <li key={item} className="rounded-2xl bg-[#FCFAF6] px-4 py-3">
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 rounded-[1.25rem] border border-[#D6C3A3]/30 bg-[#F7F2E9] px-4 py-4 text-sm leading-7 text-[#5A4B3E]">
                    {currentRecommendation.suggestedNextAction}
                  </div>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                <div className="rounded-[1.75rem] border border-[#D6C3A3]/35 bg-white p-6">
                  <div className="text-sm tracking-[0.18em] text-[#8A7764]">{t.summaryTitle}</div>
                  <p className="mt-4 text-sm leading-7 text-[#5A4B3E]">{currentRecommendation.summary}</p>
                </div>

                <div className="rounded-[1.75rem] border border-[#D6C3A3]/35 bg-white p-6">
                  <div className="text-sm tracking-[0.18em] text-[#8A7764]">{t.answersTitle}</div>
                  <dl className="mt-4 grid gap-3 text-sm leading-7 text-[#5A4B3E]">
                    {Object.entries(answerLabels).map(([key, value]) => (
                      <div key={key} className="flex flex-col rounded-2xl bg-[#FCFAF6] px-4 py-3 sm:flex-row sm:justify-between sm:gap-4">
                        <dt className="text-[#8A7764]">{labelForAnswerKey(key, locale)}</dt>
                        <dd className="text-[#3B2F2F]">{value || (locale === "ja" ? "未入力" : "Not provided")}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-[#D6C3A3]/35 bg-[#FCFAF6] p-6">
                <div className="text-sm tracking-[0.18em] text-[#8A7764]">{t.nextStepTitle}</div>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  {t.supportCards.map((item) => (
                    <div key={item} className="rounded-2xl border border-[#D6C3A3]/30 bg-white/85 px-4 py-4 text-sm leading-7 text-[#5A4B3E]">
                      {item}
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Link href={supportHref} className="btn btn-secondary">
                    {locale === "ja" ? "サポートページで確認する" : "Open support page"}
                  </Link>
                  <Link href={loginHref} className="btn btn-secondary">
                    {locale === "ja" ? "ログインする" : "Log in"}
                  </Link>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-[#D6C3A3]/35 bg-white p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-sm tracking-[0.18em] text-[#8A7764]">{t.leadTitle}</div>
                    <p className="mt-3 max-w-3xl text-sm leading-7 text-[#5A4B3E]">{t.leadText}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setRecommendation(null);
                      setLeadSuccess("");
                      setLeadError("");
                      setHasStarted(false);
                      setStepIndex(0);
                      setSavedEntryId(null);
                    }}
                    className="rounded-full border border-[#D6C3A3]/60 px-6 py-3 text-sm text-[#5A4B3E] transition hover:bg-[#FCFAF6]"
                  >
                    {t.restart}
                  </button>
                </div>

                <form className="mt-8 grid gap-5 md:grid-cols-2" onSubmit={handleLeadSubmit}>
                  <Field label={t.fields.name}>
                    <input value={lead.name} onChange={(event) => setLead((current) => ({ ...current, name: event.target.value }))} className={inputClassName} />
                  </Field>
                  <Field label={t.fields.phone}>
                    <input value={lead.phone} onChange={(event) => setLead((current) => ({ ...current, phone: event.target.value }))} className={inputClassName} />
                  </Field>
                  <Field label={t.fields.email}>
                    <input type="email" value={lead.email} onChange={(event) => setLead((current) => ({ ...current, email: event.target.value }))} className={inputClassName} />
                  </Field>
                  <Field label={t.fields.city}>
                    <input value={lead.city} onChange={(event) => setLead((current) => ({ ...current, city: event.target.value }))} className={inputClassName} />
                  </Field>
                  <Field label={t.fields.preferredContactMethod}>
                    <select
                      value={lead.preferredContactMethod}
                      onChange={(event) => setLead((current) => ({ ...current, preferredContactMethod: event.target.value as AdvisorLead["preferredContactMethod"] }))}
                      className={inputClassName}
                    >
                      <option value="phone">{t.contactMethods.phone}</option>
                      <option value="email">{t.contactMethods.email}</option>
                      <option value="either">{t.contactMethods.either}</option>
                    </select>
                  </Field>
                  <Field label={t.fields.interestedInTestRide}>
                    <select
                      value={lead.interestedInTestRide}
                      onChange={(event) => setLead((current) => ({ ...current, interestedInTestRide: event.target.value as AdvisorLead["interestedInTestRide"] }))}
                      className={inputClassName}
                    >
                      <option value="yes">{t.yesNo.yes}</option>
                      <option value="no">{t.yesNo.no}</option>
                    </select>
                  </Field>
                  <div className="md:col-span-2">
                    <Field label={t.fields.additionalNotes}>
                      <textarea
                        value={lead.additionalNotes}
                        onChange={(event) => setLead((current) => ({ ...current, additionalNotes: event.target.value }))}
                        rows={5}
                        className={`${inputClassName} resize-y`}
                      />
                    </Field>
                  </div>

                  <div className="md:col-span-2">
                    <button type="submit" className="rounded-full bg-[#3B2F2F] px-6 py-3 text-sm text-white shadow-sm transition hover:opacity-90" disabled={isSubmittingLead}>
                      {isSubmittingLead ? t.leadSubmitting : t.leadSubmit}
                    </button>
                    {leadError && <p className="mt-4 text-sm font-medium text-[#9A3B2F]">{leadError}</p>}
                    {leadSuccess && <p className="mt-4 text-sm font-medium text-[#2E5B3C]">{leadSuccess}</p>}
                  </div>
                </form>
              </div>
            </div>
          ) : null}
        </div>
      </section>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium text-[#5A4B3E]">
      <span>{label}</span>
      <div className="mt-3">{children}</div>
    </label>
  );
}

function labelForAnswerKey(key: string, locale: Locale) {
  const labels = {
    ja: {
      userType: "利用者",
      ageRange: "年齢帯",
      walkingAbility: "歩行のご様子",
      primaryScenario: "主な用途",
      usageEnvironment: "利用環境",
      needFoldable: "折りたたみ・収納性",
      carTrunkFit: "車載",
      useFrequency: "利用頻度",
      budgetRange: "予算帯",
      safetyNote: "特記事項",
    },
    en: {
      userType: "User",
      ageRange: "Age range",
      walkingAbility: "Walking ability",
      primaryScenario: "Primary scenario",
      usageEnvironment: "Environment",
      needFoldable: "Foldable / compact need",
      carTrunkFit: "Car trunk fit",
      useFrequency: "Frequency",
      budgetRange: "Budget",
      safetyNote: "Special note",
    },
  } as const;

  return labels[locale][key as keyof typeof labels.en];
}

const inputClassName =
  "w-full rounded-[1.25rem] border border-[#D6C3A3]/45 bg-[#FCFAF6] px-4 py-4 text-base text-[#3B2F2F] outline-none transition focus:border-[#6B5A4A]";
