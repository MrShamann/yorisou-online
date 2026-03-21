"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  type AccountProfile,
  type ConsultationSnapshot,
  getConsultationShareText,
  getSignedInAccount,
  listConsultationSnapshots,
  logoutLocalAccount,
} from "@/lib/mvpAccountStorage";

export default function SupportWorkspace({ locale }: { locale: "ja" | "en" }) {
  const [account, setAccount] = useState<AccountProfile | null>(() => getSignedInAccount());
  const [consultations] = useState<ConsultationSnapshot[]>(() => listConsultationSnapshots().filter((entry) => entry.locale === locale));
  const [shareMessage, setShareMessage] = useState("");

  const latest = consultations[0] || null;
  const followups = useMemo(() => consultations.filter((entry) => entry.leadSubmitted), [consultations]);
  const loginHref = locale === "ja" ? "/login" : "/en/login";
  const registerHref = locale === "ja" ? "/register" : "/en/register";
  const advisorHref = locale === "ja" ? "/ai-advisor" : "/en/ai-advisor";
  const productsHref = locale === "ja" ? "/products" : "/en/products";

  async function copyShareText() {
    if (!latest) {
      return;
    }

    const text = getConsultationShareText(latest);

    try {
      await navigator.clipboard.writeText(text);
      setShareMessage(locale === "ja" ? "共有用メモをコピーしました。" : "Share note copied.");
    } catch {
      setShareMessage(locale === "ja" ? "コピーに失敗しました。" : "Failed to copy.");
    }
  }

  if (!account) {
    return (
      <main className="min-h-screen bg-[#F5F1E8] text-[#3B2F2F]">
        <section className="border-b border-[#D6C3A3]/22 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.94),_rgba(245,241,232,0.98)_60%)] px-6 py-16 md:px-10 md:py-22">
          <div className="mx-auto max-w-6xl">
            <div className="shell-card max-w-4xl p-8 md:p-12">
              <h1 className="text-4xl font-light leading-tight md:text-6xl">
                {locale === "ja" ? "サポートページで、相談のつづきを確認できます" : "Review consultations and support in one place"}
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-[#5A4B3E] md:text-lg">
                {locale === "ja"
                  ? "ログインすると、相談履歴、ご提案内容、ご家族への共有メモ、継続相談の入口をまとめて確認できます。"
                  : "After login, Yorisou brings together consultation history, recommendation notes, family-sharing text, and follow-up actions."}
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link href={loginHref} className="btn btn-primary">
                  {locale === "ja" ? "ログインする" : "Log in"}
                </Link>
                <Link href={registerHref} className="btn btn-secondary">
                  {locale === "ja" ? "新規登録する" : "Create account"}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[#D6C3A3]/20 bg-white/58 px-6 py-8 md:px-10">
          <div className="mx-auto max-w-6xl rounded-[1.75rem] border border-[#D6C3A3]/28 bg-white/78 p-6 md:p-8">
            <h2 className="text-2xl font-light leading-tight">{locale === "ja" ? "この端末にある相談内容" : "Consultations on this device"}</h2>
            <p className="mt-3 text-sm leading-7 text-[#5A4B3E] md:text-base">
              {consultations.length > 0
                ? locale === "ja"
                  ? `${consultations.length}件の相談結果が保存されています。ログインすると、このページで見返せます。`
                  : `${consultations.length} consultation result(s) are already saved on this device. Log in to review them here.`
                : locale === "ja"
                  ? "まだ相談結果はありません。まずはAI相談か製品比較から始められます。"
                  : "There are no saved consultations yet. Start with the advisor or product browsing."}
            </p>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row">
              <Link href={advisorHref} className="btn btn-secondary">
                {locale === "ja" ? "相談する" : "Start advisor"}
              </Link>
              <Link href={productsHref} className="btn btn-secondary">
                {locale === "ja" ? "製品を見る" : "Browse products"}
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F1E8] text-[#3B2F2F]">
      <section className="border-b border-[#D6C3A3]/22 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.94),_rgba(245,241,232,0.98)_60%)] px-6 py-16 md:px-10 md:py-22">
        <div className="mx-auto max-w-6xl">
          <div className="shell-card max-w-5xl p-8 md:p-12">
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div>
                <h1 className="text-4xl font-light leading-tight md:text-6xl">
                  {locale === "ja" ? `${account.name}さんのサポートページ` : `${account.name}'s support page`}
                </h1>
                <p className="mt-6 max-w-3xl text-base leading-8 text-[#5A4B3E] md:text-lg">
                  {locale === "ja"
                    ? "相談履歴、ご提案内容、ご家族と共有したい要点、継続相談の入口をひとつにまとめています。"
                    : "Consultation history, recommendation notes, family-sharing text, and follow-up support are collected here."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  logoutLocalAccount();
                  setAccount(null);
                }}
                className="rounded-full border border-[#D6C3A3]/60 px-6 py-3 text-sm text-[#5A4B3E] transition hover:bg-[#FCFAF6]"
              >
                {locale === "ja" ? "ログアウト" : "Log out"}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#D6C3A3]/20 bg-white/58 px-6 py-8 md:px-10">
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
          <StatCard
            label={locale === "ja" ? "相談履歴" : "Consultations"}
            value={String(consultations.length)}
            note={locale === "ja" ? "この端末で保存されている件数" : "Saved on this device"}
          />
          <StatCard
            label={locale === "ja" ? "ご提案内容" : "Recommendation notes"}
            value={latest ? latest.recommendedCategory : locale === "ja" ? "未保存" : "None"}
            note={latest ? formatDate(latest.createdAt, locale) : locale === "ja" ? "最新の相談結果はまだありません" : "No saved recommendation yet"}
          />
          <StatCard
            label={locale === "ja" ? "フォローアップ" : "Follow-up"}
            value={String(followups.length)}
            note={locale === "ja" ? "送信済み相談" : "Submitted consultations"}
          />
        </div>
      </section>

      <section className="bg-[#FBF7F0] px-6 py-16 md:px-10 md:py-18">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-6">
            <Panel title={locale === "ja" ? "相談履歴" : "Consultation history"}>
              {consultations.length > 0 ? (
                <div className="space-y-4">
                  {consultations.map((entry) => (
                    <article key={entry.id} className="rounded-[1.4rem] border border-[#D6C3A3]/24 bg-[#FCFAF6] px-5 py-5">
                      <div className="text-xs tracking-[0.12em] text-[#8A7764]">{formatDate(entry.createdAt, locale)}</div>
                      <h3 className="mt-2 text-xl font-light leading-tight text-[#3B2F2F]">{entry.recommendedCategory}</h3>
                      <p className="mt-3 text-sm leading-7 text-[#5A4B3E]">{entry.summary}</p>
                    </article>
                  ))}
                </div>
              ) : (
                <EmptyState
                  locale={locale}
                  textJa="まだ相談履歴はありません。AI相談から始めると、このページに保存されます。"
                  textEn="No consultation history yet. Start with the advisor and it will appear here."
                />
              )}
            </Panel>

            <Panel title={locale === "ja" ? "ご提案内容" : "Recommendations"}>
              {latest ? (
                <div className="space-y-4">
                  <div className="rounded-[1.4rem] border border-[#D6C3A3]/24 bg-[#FCFAF6] px-5 py-5">
                    <div className="text-sm text-[#8A7764]">{locale === "ja" ? "おすすめ" : "Recommended"}</div>
                    <h3 className="mt-2 text-2xl font-light leading-tight text-[#3B2F2F]">{latest.recommendedCategory}</h3>
                    <p className="mt-3 text-sm leading-7 text-[#5A4B3E]">{latest.summary}</p>
                    <div className="mt-4 rounded-[1.1rem] border border-[#D6C3A3]/24 bg-white/85 px-4 py-4 text-sm leading-7 text-[#6B5A4A]">
                      {locale === "ja" ? "次の動き" : "Next step"}: {latest.suggestedNextAction}
                    </div>
                  </div>
                  <Link href={advisorHref} className="btn btn-secondary">
                    {locale === "ja" ? "相談を続ける" : "Continue consultation"}
                  </Link>
                </div>
              ) : (
                <EmptyState
                  locale={locale}
                  textJa="ご提案内容はまだありません。製品比較だけでなく、AI相談の結果もここに残ります。"
                  textEn="No recommendation is saved yet. Advisor results will appear here."
                />
              )}
            </Panel>
          </div>

          <div className="space-y-6">
            <Panel title={locale === "ja" ? "ご家族共有" : "Family sharing"}>
              {latest ? (
                <>
                  <p className="text-sm leading-7 text-[#5A4B3E]">
                    {locale === "ja"
                      ? "ご家族へ伝えたい要点を、短い共有メモとしてコピーできます。"
                      : "Copy a short summary to share with family members."}
                  </p>
                  <button type="button" onClick={copyShareText} className="mt-4 btn btn-secondary">
                    {locale === "ja" ? "共有用メモをコピー" : "Copy share note"}
                  </button>
                  {shareMessage && <p className="mt-4 text-sm text-[#2E5B3C]">{shareMessage}</p>}
                </>
              ) : (
                <EmptyState
                  locale={locale}
                  textJa="共有する内容はまだありません。相談結果が保存されると、ここからご家族向けの要点をまとめられます。"
                  textEn="No shareable note yet. Once a consultation is saved, key points can be copied here."
                />
              )}
            </Panel>

            <Panel title={locale === "ja" ? "継続相談" : "Ongoing consultation"}>
              <p className="text-sm leading-7 text-[#5A4B3E]">
                {locale === "ja"
                  ? "前回の相談を見返しながら、条件を変えてもう一度相談したり、詳しい相談内容を送ったりできます。"
                  : "Review the last consultation, then continue with a new advisor run or a direct consultation submission."}
              </p>
              <div className="mt-4 flex flex-col gap-3">
                <Link href={advisorHref} className="btn btn-secondary">
                  {locale === "ja" ? "AI相談を続ける" : "Continue with advisor"}
                </Link>
                <Link href={productsHref} className="btn btn-secondary">
                  {locale === "ja" ? "製品を見比べる" : "Browse products"}
                </Link>
              </div>
            </Panel>

            <Panel title={locale === "ja" ? "フォローアップ" : "Follow-up"}>
              {followups.length > 0 ? (
                <div className="space-y-3">
                  {followups.map((entry) => (
                    <div key={entry.id} className="rounded-[1.2rem] border border-[#D6C3A3]/24 bg-[#FCFAF6] px-4 py-4 text-sm leading-7 text-[#5A4B3E]">
                      {formatDate(entry.createdAt, locale)}: {entry.recommendedCategory}
                      {locale === "ja" ? " について相談送信済みです。" : " has already been submitted."}
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  locale={locale}
                  textJa="まだ送信済みのフォローアップはありません。必要になった時点で相談内容を送れます。"
                  textEn="No submitted follow-up yet. You can send the consultation when needed."
                />
              )}
            </Panel>
          </div>
        </div>
      </section>
    </main>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[2rem] border border-[#D6C3A3]/28 bg-white/80 p-7 shadow-[0_20px_48px_rgba(59,47,47,0.05)]">
      <h2 className="text-2xl font-light leading-tight text-[#3B2F2F]">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function StatCard({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-[1.5rem] border border-[#D6C3A3]/24 bg-white/78 px-5 py-5">
      <div className="text-sm text-[#8A7764]">{label}</div>
      <div className="mt-3 text-2xl font-light leading-tight text-[#3B2F2F]">{value}</div>
      <div className="mt-2 text-sm leading-7 text-[#5A4B3E]">{note}</div>
    </div>
  );
}

function EmptyState({
  locale,
  textJa,
  textEn,
}: {
  locale: "ja" | "en";
  textJa: string;
  textEn: string;
}) {
  return <p className="rounded-[1.4rem] border border-[#D6C3A3]/24 bg-[#FCFAF6] px-5 py-5 text-sm leading-7 text-[#5A4B3E]">{locale === "ja" ? textJa : textEn}</p>;
}

function formatDate(value: string, locale: "ja" | "en") {
  return new Intl.DateTimeFormat(locale === "ja" ? "ja-JP" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}
