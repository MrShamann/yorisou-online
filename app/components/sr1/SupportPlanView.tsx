"use client";

// SR-1 — Personalized Support Plan view (device-local, public-safe).
//
// Renders a deterministic SupportPlan (from lib/sr1/supportPlan.ts) as a calm
// reading surface: what we understood, one primary "help now", a prioritized
// "help next", why each appeared — plus honest, user-owned controls. All
// persistence is DEVICE-LOCAL and TRUTHFUL: the "keep on this device" control
// writes only the RTR-1 public-safe save record and the SR-1 guest-journey
// public result identity; the per-item saves and plan feedback write only
// service-catalogue ids and coarse signals. It NEVER stores raw answers, notes,
// scoring internals, or account identity, and it never implies login / LINE.
//
// It assumes an `.aix2` dark-surface ancestor (the shared design system),
// matching the existing reveal / domain components.

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";

import { readSavedResultRecord, saveResultRecord, subscribeSavedResult } from "@/app/result/saveState";
import { recordFeedback, recordResult, toggleSavedItem } from "@/lib/sr1/guestJourney";
import type { SupportPlan, SupportPlanItem } from "@/lib/sr1/supportPlan";
import { useGuestJourney } from "@/lib/sr1/useGuestJourney";

type SupportPlanViewProps = {
  plan: SupportPlan;
  // Fields to persist a device-local RTR-1 save (minus auto/derived fields).
  save: {
    resultType: string;
    resultLabel: string;
    context: "public-result" | "private-insight";
    recognitionLine?: string;
    traitChips?: [string, string, string];
    resultPath: string;
    continuePath: string;
    baseResultId?: string;
    overlayId?: string;
    confidenceBand?: "low" | "medium";
    payloadKey?: string;
  };
  // Public result identity recorded into the SR-1 guest journey.
  journeyResult: {
    family: string;
    resultId?: string;
    label?: string;
    resultPath?: string;
  };
  className?: string;
};

// Small jade "prototype" chip — status honesty for pre-release catalogue items.
function PrototypeChip() {
  return (
    <span className="inline-flex items-center rounded-full border border-[var(--hair-2)] bg-[rgba(126,224,182,0.07)] px-3 py-1.5 text-[11px] text-[color:var(--jade-bright)]">
      プロトタイプ
    </span>
  );
}

// A quiet metadata row: estimated time, and the prototype chip when relevant.
function ItemMeta({ item }: { item: SupportPlanItem }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {item.status === "prototype" ? <PrototypeChip /> : null}
      {item.estimatedTime ? <span className="text-[11.5px] aix2-faint">{item.estimatedTime}</span> : null}
    </div>
  );
}

const COMPACT_FOCUS =
  "focus-visible:[outline:2px_solid_var(--jade-bright)] focus-visible:[outline-offset:2px]";

// Compact pill for the plan-level feedback signals (not a toggle).
const COMPACT_ACTION =
  `inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-full border border-[var(--hair-2)] bg-[rgba(228,240,233,0.05)] px-5 text-[13px] font-semibold text-[color:var(--tx)] transition hover:border-[var(--hair-jade)] hover:bg-[rgba(228,240,233,0.09)] ${COMPACT_FOCUS}`;

// Compact toggle pill (saved / not saved) — jade-tinted while pressed.
function toggleClass(active: boolean): string {
  const base = `inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-full border px-4 text-[12.5px] font-semibold transition ${COMPACT_FOCUS}`;
  return active
    ? `${base} border-[var(--hair-jade)] bg-[rgba(126,224,182,0.10)] text-[color:var(--jade-bright)]`
    : `${base} border-[var(--hair-2)] bg-[rgba(228,240,233,0.05)] text-[color:var(--tx)] hover:border-[var(--hair-jade)] hover:bg-[rgba(228,240,233,0.09)]`;
}

export default function SupportPlanView({ plan, save, journeyResult, className = "" }: SupportPlanViewProps) {
  const { whatWeUnderstood, whatMayHelpNow, whatMayHelpNext, whyThese } = plan;

  // Device-local save reflection (RTR-1 store) — null on the server/first paint.
  const savedRecord = useSyncExternalStore(subscribeSavedResult, readSavedResultRecord, () => null);
  const hasLocalSave = Boolean(savedRecord && savedRecord.resultLabel === save.resultLabel);

  // Guest-journey state drives the per-item saved toggles.
  const journey = useGuestJourney();
  const savedItemIds = journey.savedItemIds;

  const [feedbackAck, setFeedbackAck] = useState(false);

  const handleLocalSave = () => {
    saveResultRecord({
      ...save,
      savedAt: new Date().toISOString(),
      source: "local-browser",
      version: "v0.2",
    });
    recordResult({ ...journeyResult, savedAt: new Date().toISOString() });
  };

  const sendFeedback = (signal: "useful" | "not_now") => {
    recordFeedback({ itemId: `plan:${plan.family}`, signal });
    setFeedbackAck(true);
  };

  return (
    <div className={`space-y-5 ${className}`.trim()}>
      {/* 今わかったこと */}
      <section aria-labelledby="sp-understood-h" className="aix2-panel space-y-3 p-5">
        <p id="sp-understood-h" className="aix2-eyebrow">
          今わかったこと
        </p>
        <p className="aix2-serif text-[16px] leading-8 text-[color:var(--tx)]">{whatWeUnderstood.line}</p>
        {whatWeUnderstood.traits.length > 0 ? (
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
            {whatWeUnderstood.traits.map((trait) => (
              <li
                key={trait}
                className="rounded-full border border-[var(--hair-2)] bg-[rgba(126,224,182,0.07)] px-3 py-1.5 text-[11px] text-[color:var(--jade-bright)]"
              >
                {trait}
              </li>
            ))}
          </ul>
        ) : null}
        <p className="text-[12.5px] leading-6 aix2-mut">{whatWeUnderstood.confidenceNote}</p>
        <p className="text-[11.5px] leading-6 aix2-faint">{whatWeUnderstood.boundary}</p>
      </section>

      {/* いま役立ちそうなこと — one primary card */}
      <section aria-labelledby="sp-now-h" className="aix2-panel aix2-panel--now space-y-3 p-5">
        <p id="sp-now-h" className="aix2-eyebrow">
          いま役立ちそうなこと
        </p>
        <ItemMeta item={whatMayHelpNow} />
        <p className="text-[16px] font-bold leading-7 text-[color:var(--tx)]">{whatMayHelpNow.title}</p>
        <p className="text-[13px] leading-7 aix2-mut">{whatMayHelpNow.why}</p>
        <div className="pt-1">
          <Link
            href={whatMayHelpNow.href}
            className="aix2-btn aix2-btn-primary !min-h-[48px] !px-6 !text-[15px]"
          >
            開いてみる
          </Link>
        </div>
      </section>

      {/* 次に役立ちそうなこと — prioritized list */}
      {whatMayHelpNext.length > 0 ? (
        <section aria-labelledby="sp-next-h" className="aix2-panel space-y-3 p-5">
          <p id="sp-next-h" className="aix2-eyebrow">
            次に役立ちそうなこと
          </p>
          <ul className="m-0 grid list-none gap-3 p-0">
            {whatMayHelpNext.map((item) => {
              const isSaved = savedItemIds.includes(item.itemId);
              return (
                <li
                  key={item.itemId}
                  className="rounded-[14px] border border-[var(--hair)] bg-[rgba(26,32,29,0.45)] p-4"
                >
                  <ItemMeta item={item} />
                  <p className="mt-1.5 text-[14px] font-semibold leading-7 text-[color:var(--tx)]">{item.title}</p>
                  <p className="mt-1 text-[12.5px] leading-6 aix2-mut">{item.why}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      aria-pressed={isSaved}
                      onClick={() => toggleSavedItem(item.itemId)}
                      className={toggleClass(isSaved)}
                    >
                      {isSaved ? "保存済み" : "保存"}
                    </button>
                    <Link href={item.href} className="aix2-link text-[13px]">
                      開く →
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {/* なぜこれが出たか */}
      <section aria-labelledby="sp-why-h" className="aix2-panel space-y-2 p-5">
        <p id="sp-why-h" className="aix2-eyebrow">
          なぜこれが出たか
        </p>
        <p className="text-[13px] leading-7 aix2-mut">{whyThese}</p>
      </section>

      {/* この端末に残す — device-local save (RTR-1 + guest journey) */}
      <section aria-labelledby="sp-keep-h" className="aix2-panel space-y-3 p-5">
        <p id="sp-keep-h" className="aix2-eyebrow">
          この端末に残す
        </p>
        <p className="text-[12.5px] leading-6 aix2-mut">
          この端末のブラウザ内にだけ残します。ログインやLINE連携ではありません。いつでも削除できます。
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={handleLocalSave} className="aix2-btn aix2-btn-ghost !min-h-[46px] !text-[14px]">
            {hasLocalSave ? "この端末に残しています" : "この端末に残す"}
          </button>
          {hasLocalSave ? (
            <span className="flex flex-wrap items-center gap-4">
              <Link href="/my-yorisou" className="aix2-link text-[13px]">
                わたしのYORISOU →
              </Link>
              <Link href="/saved" className="aix2-link text-[13px]">
                保存した結果 →
              </Link>
            </span>
          ) : null}
        </div>
      </section>

      {/* フィードバック — plan-level signal */}
      <section aria-labelledby="sp-feedback-h" className="aix2-panel space-y-3 p-5">
        <p id="sp-feedback-h" className="aix2-eyebrow">
          フィードバック
        </p>
        <p className="text-[12.5px] leading-6 aix2-mut">
          この整理は役に立ちましたか。あなたの合図が、次のおすすめに反映されます。
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
