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
      <div className="rounded-[1.35rem] border border-[var(--yr-hair)] bg-[var(--yr-panel)] p-5 space-y-3">
        <div className="space-y-0.5">
          <p className="text-[11px] font-semibold tracking-[0.12em] text-[color:var(--yr-kicker)]">必要なら、もう少し深く</p>
          <p className="text-[15px] font-semibold leading-6 text-[color:var(--yr-text)]">{reportPreview.headline}</p>
        </div>
        <p className="text-[13px] leading-7 text-[color:var(--yr-text-mut)]">{reportPreview.teaserText}</p>
        {reportTeaser && (
          <p className="text-[13px] leading-6 text-[color:var(--yr-text-mut)]">{reportTeaser}</p>
        )}
        <div className="rounded-[0.9rem] border border-[var(--yr-hair)] bg-[var(--yr-panel-2)] px-4 py-3">
          <p className="text-[12px] font-semibold text-[color:var(--yr-kicker)]">レポートに含まれること</p>
          <ul className="mt-1.5 space-y-1 text-[13px] leading-7 text-[color:var(--yr-text-mut)]">
            {reportPreview.lockedSections.map((s) => (
              <li key={s}>· {s}</li>
            ))}
          </ul>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={reportHref}
            className="inline-flex rounded-full border border-[var(--yr-hair-2)] bg-[var(--yr-panel)] px-4 py-2 text-[13px] font-semibold text-[color:var(--yr-accent-text)] transition hover:-translate-y-0.5 hover:bg-[var(--yr-panel-2)]"
          >
            読めることを見る →
          </Link>
          <span className="text-[12px] text-[color:var(--yr-text-faint)]">無料結果だけで終えても大丈夫です。</span>
        </div>
        <p className="text-[11px] leading-5 text-[color:var(--yr-text-faint)]">
          {reportPreview.limitationNote}
        </p>
      </div>

      {/* ── 2. Community voices ── */}
      <div className="rounded-[1.35rem] border border-[var(--yr-hair)] bg-[var(--yr-panel)] p-5 space-y-3.5">
        <div className="space-y-0.5">
          <p className="text-[11px] font-semibold tracking-[0.12em] text-[color:var(--yr-kicker)]">同じような人の声</p>
          <p className="text-[12px] leading-6 text-[color:var(--yr-text-faint)]">
            見るだけでも大丈夫です。ここは投稿や相談の場所ではありません。
          </p>
        </div>
        <div className="space-y-2">
          {communityVoices.map((voice, i) => (
            <div
              key={i}
              className="rounded-[1rem] border border-[var(--yr-hair)] bg-[var(--yr-panel-2)] px-4 py-3"
            >
              <p className="text-[13px] leading-7 text-[color:var(--yr-text)]">「{voice.text}」</p>
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
                ? "border-[var(--yr-accent)] bg-[var(--yr-panel-2)] text-[color:var(--yr-accent-text)] cursor-default"
                : "border-[var(--yr-hair-2)] bg-[var(--yr-panel)] text-[color:var(--yr-kicker)] hover:-translate-y-0.5 hover:bg-[var(--yr-panel-2)]"
            }`}
          >
            {nearClicked ? "✓ 近い感覚として受け取りました" : "私も近い"}
          </button>
          <span className="text-[12px] text-[color:var(--yr-text-faint)]">今は見るだけでも大丈夫です。</span>
        </div>
        <p className="text-[11px] leading-5 text-[color:var(--yr-text-faint)]">
          表示される声は編集されたサンプルです。個人の投稿ではありません。
        </p>
      </div>

      {/* ── 3. LINE save ── */}
      <div className="rounded-[1.25rem] border border-[rgba(217,130,86,0.12)] bg-[var(--yr-accent-soft)] px-5 py-4 space-y-1.5">
        <p className="text-[13px] font-semibold text-[#6B4E3F]">LINEで{lineSaveCopy}</p>
        <p className="text-[12px] leading-6 text-[color:var(--yr-text-faint)]">
          今の結果は、あとから見返すと少し違って見えることがあります。
          LINEでの保存・通知・見返しには、それぞれ確認と同意が必要です。
        </p>
      </div>

      {/* ── 4. Next checks ── */}
      {nextChecks.length > 0 && (
        <div className="space-y-2">
          <p className="text-[11px] font-semibold tracking-[0.1em] text-[color:var(--yr-kicker)]">別の角度から整理する</p>
          <div className="flex flex-wrap gap-2">
            {nextChecks.map((nc) => (
              <Link
                key={nc.href}
                href={nc.href}
                className="inline-flex flex-col rounded-[1rem] border border-[var(--yr-hair-2)] bg-[var(--yr-panel)] px-4 py-2.5 transition hover:-translate-y-0.5 hover:bg-[var(--yr-panel-2)]"
              >
                <span className="text-[13px] font-semibold text-[color:var(--yr-accent-text)]">{nc.label}</span>
                <span className="text-[11px] leading-5 text-[color:var(--yr-text-faint)]">{nc.hint}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── 5. Soft exit ── */}
      <p className="text-[12px] leading-6 text-[color:var(--yr-text-faint)] text-center pt-1">
        今日はここまでにして、また必要なときに戻ってこられます。
      </p>

    </div>
  );
}
