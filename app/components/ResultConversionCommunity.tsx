"use client";

import { useState } from "react";
import Link from "next/link";

import { CONVERSION_DATA, type ModuleId } from "../data/conversionCommunity";

interface Props {
  moduleId: ModuleId;
  reportTeaser?: string;
}

export default function ResultConversionCommunity({ moduleId, reportTeaser }: Props) {
  const { communityVoices, reportPreview, reportHref, nextChecks, lineSaveCopy } = CONVERSION_DATA[moduleId];
  const [nearClicked, setNearClicked] = useState(false);

  return (
    <div className="space-y-5">

      {/* ── 1. Report preview (必要なら、もう少し深く) ── */}
      <div className="rounded-[1.35rem] border border-[rgba(23,59,53,0.1)] bg-white/80 p-5 space-y-3">
        <div className="space-y-0.5">
          <p className="text-[11px] font-semibold tracking-[0.12em] text-[#49615B]">必要なら、もう少し深く</p>
          <p className="text-[15px] font-semibold leading-6 text-[#2F2A28]">{reportPreview.headline}</p>
        </div>
        <p className="text-[13px] leading-7 text-[#5F5750]">{reportPreview.teaserText}</p>
        {reportTeaser && (
          <p className="text-[13px] leading-6 text-[#5F5750]">{reportTeaser}</p>
        )}
        <div className="rounded-[0.9rem] border border-[rgba(23,59,53,0.08)] bg-[#F3FAF6] px-4 py-3">
          <p className="text-[12px] font-semibold text-[#49615B]">レポートに含まれること</p>
          <ul className="mt-1.5 space-y-1 text-[13px] leading-7 text-[#5F5750]">
            {reportPreview.lockedSections.map((s) => (
              <li key={s}>· {s}</li>
            ))}
          </ul>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={reportHref}
            className="inline-flex rounded-full border border-[rgba(23,59,53,0.18)] bg-white px-4 py-2 text-[13px] font-semibold text-[#173B35] transition hover:-translate-y-0.5 hover:bg-[#F3FAF6]"
          >
            読めることを見る →
          </Link>
          <span className="text-[12px] text-[#9A918B]">無料結果だけで終えても大丈夫です。</span>
        </div>
        <p className="text-[11px] leading-5 text-[#9A918B]">
          {reportPreview.limitationNote}
        </p>
      </div>

      {/* ── 2. Community voices ── */}
      <div className="rounded-[1.35rem] border border-[rgba(23,59,53,0.1)] bg-white/80 p-5 space-y-3.5">
        <div className="space-y-0.5">
          <p className="text-[11px] font-semibold tracking-[0.12em] text-[#49615B]">同じような人の声</p>
          <p className="text-[12px] leading-6 text-[#7A7068]">
            見るだけでも大丈夫です。ここは投稿や相談の場所ではありません。
          </p>
        </div>
        <div className="space-y-2">
          {communityVoices.map((voice, i) => (
            <div
              key={i}
              className="rounded-[1rem] border border-[rgba(23,59,53,0.08)] bg-[#F3FAF6] px-4 py-3"
            >
              <p className="text-[13px] leading-7 text-[#2F2A28]">「{voice.text}」</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setNearClicked(true)}
            disabled={nearClicked}
            className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-[13px] font-semibold transition ${
              nearClicked
                ? "border-[#173B35] bg-[#F3FAF6] text-[#173B35] cursor-default"
                : "border-[rgba(23,59,53,0.18)] bg-white text-[#49615B] hover:-translate-y-0.5 hover:bg-[#F3FAF6]"
            }`}
          >
            {nearClicked ? "✓ 近い感覚として受け取りました" : "私も近い"}
          </button>
          <span className="text-[12px] text-[#7A7068]">今は見るだけでも大丈夫です。</span>
        </div>
        <p className="text-[11px] leading-5 text-[#9A918B]">
          表示される声は編集されたサンプルです。個人の投稿ではありません。
        </p>
      </div>

      {/* ── 3. LINE save ── */}
      <div className="rounded-[1.25rem] border border-[rgba(217,130,86,0.12)] bg-[#FFF7EC]/70 px-5 py-4 space-y-1.5">
        <p className="text-[13px] font-semibold text-[#6B4E3F]">LINEで{lineSaveCopy}</p>
        <p className="text-[12px] leading-6 text-[#7A7068]">
          今の結果は、あとから見返すと少し違って見えることがあります。
          LINEでの保存・通知・見返しには、それぞれ確認と同意が必要です。
        </p>
      </div>

      {/* ── 4. Next checks ── */}
      {nextChecks.length > 0 && (
        <div className="space-y-2">
          <p className="text-[11px] font-semibold tracking-[0.1em] text-[#49615B]">別の角度から整理する</p>
          <div className="flex flex-wrap gap-2">
            {nextChecks.map((nc) => (
              <Link
                key={nc.href}
                href={nc.href}
                className="inline-flex flex-col rounded-[1rem] border border-[rgba(23,59,53,0.14)] bg-white/90 px-4 py-2.5 transition hover:-translate-y-0.5 hover:bg-[#F3FAF6]"
              >
                <span className="text-[13px] font-semibold text-[#173B35]">{nc.label}</span>
                <span className="text-[11px] leading-5 text-[#7A7068]">{nc.hint}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── 5. Soft exit ── */}
      <p className="text-[12px] leading-6 text-[#9A918B] text-center pt-1">
        今日はここまでにして、また必要なときに戻ってこられます。
      </p>

    </div>
  );
}
