"use client";

// APP-2 — Shared nine-family deeper-report view (device-local, public-safe).
//
// Renders one APPROVED FamilyReport as a calm dark reading surface, plus honest,
// user-owned controls. All persistence is DEVICE-LOCAL and TRUTHFUL:
//   - 保存 writes the RTR-1 public-safe save record (app/result/saveState.ts) and
//     the SR-1 guest-journey public result identity (lib/sr1/guestJourney.ts).
//   - フィードバック writes only a coarse signal on this report.
// It NEVER stores raw answers, notes, scoring internals, or account identity,
// and it never implies login / LINE. It assumes an `.aix2` dark-surface ancestor.

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";

import type { FamilyReport } from "@/app/data/app2/familyReports";
import { readSavedResultRecord, saveResultRecord, subscribeSavedResult } from "@/app/result/saveState";
import { recordFeedback, recordResult } from "@/lib/sr1/guestJourney";

const COMPACT_FOCUS =
  "focus-visible:[outline:2px_solid_var(--jade-bright)] focus-visible:[outline-offset:2px]";

// Compact pill for the report-level feedback signals (not a toggle).
const COMPACT_ACTION =
  `inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-full border border-[var(--hair-2)] bg-[rgba(228,240,233,0.05)] px-5 text-[13px] font-semibold text-[color:var(--tx)] transition hover:border-[var(--hair-jade)] hover:bg-[rgba(228,240,233,0.09)] ${COMPACT_FOCUS}`;

// The family's own re-take flow route. imairo is the 120Q check-in; every other
// retained family is a per-test flow under /tests/<slug>.
function retestPath(family: string): string {
  return family === "imairo" ? "/check-in" : `/tests/${family}`;
}

// A calm labelled reading section: eyebrow heading + prose.
function ReportSection({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="aix2-panel space-y-3 p-5">
      <p id={id} className="aix2-eyebrow">
        {label}
      </p>
      {children}
    </section>
  );
}

export default function FamilyReportView({ report }: { report: FamilyReport }) {
  const { family, title, testLabel } = report;
  const resultPath = `/reports/family/${family}`;

  // Device-local save reflection (RTR-1 store) — null on the server / first
  // paint, so this is SSR-safe and re-evaluates after mount.
  const savedRecord = useSyncExternalStore(subscribeSavedResult, readSavedResultRecord, () => null);
  const hasLocalSave = Boolean(savedRecord && savedRecord.resultType === family);

  const [feedbackAck, setFeedbackAck] = useState(false);

  const handleSave = () => {
    const savedAt = new Date().toISOString();
    saveResultRecord({
      savedAt,
      resultType: family,
      resultLabel: title,
      source: "local-browser",
      version: "v0.2",
      resultPath,
      continuePath: resultPath,
      context: "public-result",
    });
    recordResult({ family, label: title, resultPath, savedAt });
  };

  const sendFeedback = (signal: "useful" | "not_now") => {
    recordFeedback({ itemId: `report:${family}`, signal });
    setFeedbackAck(true);
  };

  return (
    <div className="space-y-5">
      {/* Header — title + testLabel */}
      <header className="space-y-2.5">
        <p className="aix2-eyebrow">{testLabel} · 深掘りレポート</p>
        <h1 className="aix2-serif text-[1.9rem] leading-[1.25] text-[color:var(--tx)]">{title}</h1>
        <p className="text-[13px] leading-7 aix2-mut">
          今の答えから見えている傾向を、ことばにして返しています。ログインなしで、この端末に残せます。
        </p>
      </header>

      <ReportSection id="fr-understand" label="今わかっていること">
        <p className="aix2-serif text-[16px] leading-8 text-[color:var(--tx)]">{report.whatWeUnderstand}</p>
      </ReportSection>

      <ReportSection id="fr-pattern" label="今のパターン">
        <p className="text-[14px] leading-8 aix2-mut">{report.currentPattern}</p>
      </ReportSection>

      <ReportSection id="fr-tension" label="見えている緊張">
        <p className="text-[14px] leading-8 aix2-mut">{report.tension}</p>
      </ReportSection>

      <ReportSection id="fr-support" label="支えになる条件">
        <p className="text-[14px] leading-8 aix2-mut">{report.supportingConditions}</p>
      </ReportSection>

      <ReportSection id="fr-friction" label="つまずきやすいところ">
        <p className="text-[14px] leading-8 aix2-mut">{report.likelyFriction}</p>
      </ReportSection>

      <ReportSection id="fr-reflection" label="ふり返り">
        <p className="text-[14px] leading-8 text-[color:var(--tx)]">{report.reflection}</p>
      </ReportSection>

      <ReportSection id="fr-next" label="次の一歩">
        <ul className="m-0 grid list-none gap-2.5 p-0">
          {report.nextSteps.map((step) => (
            <li
              key={step}
              className="flex gap-2.5 rounded-[14px] border border-[var(--hair)] bg-[rgba(26,32,29,0.45)] p-4 text-[13.5px] leading-7 text-[color:var(--tx)]"
            >
              <span aria-hidden className="mt-0.5 text-[color:var(--jade-bright)]">
                —
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ul>
      </ReportSection>

      <ReportSection id="fr-method" label="考え方について">
        <p className="text-[13px] leading-7 aix2-mut">{report.methodology}</p>
      </ReportSection>

      <ReportSection id="fr-limits" label="この結果でできないこと">
        <p className="text-[13px] leading-7 aix2-faint">{report.limits}</p>
      </ReportSection>

      {/* Controls — save + continue routes (all device-local, no login/LINE) */}
      <section aria-labelledby="fr-controls" className="aix2-panel space-y-4 p-5">
        <p id="fr-controls" className="aix2-eyebrow">
          この結果をどうする
        </p>
        <p className="text-[12.5px] leading-6 aix2-mut">
          保存はこの端末のブラウザ内にだけ残します。ログインやLINE連携ではありません。いつでも削除できます。
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            aria-pressed={hasLocalSave}
            className="aix2-btn aix2-btn-primary !min-h-[46px] !text-[14px]"
          >
            {hasLocalSave ? "保存済み" : "保存"}
          </button>
          <Link href="/recommendations" className="aix2-btn aix2-btn-ghost !min-h-[46px] !text-[13px]">
            おすすめを見る
          </Link>
          <Link
            href="/experiences/guided/grounding-reflection"
            className="aix2-btn aix2-btn-ghost !min-h-[46px] !text-[13px]"
          >
            試せる体験
          </Link>
        </div>
        <div className="aix2-hair-top flex flex-wrap items-center gap-4 pt-4">
          <Link href="/my-yorisou" className="aix2-link text-[13px]">
            マイよりそうへ →
          </Link>
          <Link href={retestPath(family)} className="aix2-link text-[13px]">
            もう一度チェックする →
          </Link>
        </div>
      </section>

      {/* フィードバック — report-level signal */}
      <section aria-labelledby="fr-feedback" className="aix2-panel space-y-3 p-5">
        <p id="fr-feedback" className="aix2-eyebrow">
          フィードバック
        </p>
        <p className="text-[12.5px] leading-6 aix2-mut">
          このレポートは役に立ちましたか。あなたの合図が、次のおすすめに反映されます。
        </p>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => sendFeedback("useful")} className={COMPACT_ACTION}>
            役に立った
          </button>
          <button type="button" onClick={() => sendFeedback("not_now")} className={COMPACT_ACTION}>
            今は違う
          </button>
        </div>
        {feedbackAck ? (
          <p role="status" className="text-[12.5px] leading-6 aix2-faint">
            ありがとうございます。次のおすすめに反映します。
          </p>
        ) : null}
      </section>
    </div>
  );
}
