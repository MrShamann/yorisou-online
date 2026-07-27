"use client";

import Link from "next/link";
import { useState } from "react";

import UnderstandingField from "../_lib/UnderstandingField";
import {
  LENSES,
  READING_CORRECTED,
  READING_PRIMARY,
  SOURCE_LABEL,
  SUGGESTIONS_FOR,
  TRAJECTORY,
  type Reading,
} from "../_lib/ux1";

type Mode = "primary" | "corrected";

const ALTERNATIVES = [
  { id: "corrected", labelJa: "あたたかさを近くに置きたい時期", hintJa: "人との距離のほうが、いまは近い" },
  { id: "pace", labelJa: "自分のペースを守りたい時期", hintJa: "進め方を自分で決めておきたい" },
  { id: "none", labelJa: "どれも違う", hintJa: "いまは、置かないでおく" },
] as const;

function SourceChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-[var(--yorisou-radius-pill)] border border-[rgba(255,255,255,0.22)] px-2.5 py-1 text-[11px] font-semibold text-[rgba(255,255,255,0.78)]">
      {label}
    </span>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[var(--yorisou-radius-card)] border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.04)] p-4">
      <h3 className="m-0 text-[12px] font-bold tracking-[0.04em] text-[rgba(255,255,255,0.62)]">{title}</h3>
      <div className="mt-2">{children}</div>
    </section>
  );
}

export default function ReadingSurface() {
  const [mode, setMode] = useState<Mode>("primary");
  const [confirmed, setConfirmed] = useState(false);
  const [correcting, setCorrecting] = useState(false);
  const [withheld, setWithheld] = useState(false);
  const [saved, setSaved] = useState(false);

  const reading: Reading = mode === "corrected" ? READING_CORRECTED : READING_PRIMARY;
  const suggestions = SUGGESTIONS_FOR[mode === "corrected" ? "corrected" : "primary"];
  const lens = LENSES.find((l) => l.id === reading.lensId);
  const trail = mode === "corrected" ? TRAJECTORY.map((t) => t.position) : TRAJECTORY.slice(0, 2).map((t) => t.position);

  function applyCorrection(id: (typeof ALTERNATIVES)[number]["id"]) {
    setCorrecting(false);
    setConfirmed(false);
    if (id === "none") {
      setWithheld(true);
      return;
    }
    setWithheld(false);
    setMode("corrected");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.02fr)_minmax(340px,0.98fr)] lg:gap-12">
      {/* ── the field, reorganising ─────────────────────────────────────── */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <UnderstandingField
          lenses={LENSES}
          position={reading.position}
          trail={trail}
          reorganizing={correcting}
          description={`いまの読み「${reading.periodJa}」が、場のなかに置かれている図。訂正すると、この点が動きます。`}
          markLabel={mode === "corrected" ? "あなたの訂正にあわせて置き直しました" : "いまの読みの位置"}
        />
        <p
          aria-live="polite"
          className="mt-2 min-h-[1.5rem] text-center text-[12px] text-[rgba(255,255,255,0.66)]"
        >
          {withheld
            ? "いまは置かないことにしました。場には残していません。"
            : mode === "corrected"
              ? "訂正を受け取り、読みと次の一歩を置き直しました。"
              : confirmed
                ? "この読みで合っている、と受け取りました。"
                : ""}
        </p>
      </div>

      {/* ── the reading ─────────────────────────────────────────────────── */}
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <SourceChip label={lens ? lens.nameJa : "—"} />
          <SourceChip label={SOURCE_LABEL[reading.source]} />
          <span className="inline-flex items-center rounded-[var(--yorisou-radius-pill)] border border-[rgba(255,255,255,0.22)] px-2.5 py-1 text-[11px] font-semibold text-[rgba(255,255,255,0.78)]">
            あなただけに表示
          </span>
        </div>

        <h1 className="mt-4 text-[27px] font-bold leading-[1.35] tracking-[-0.01em] text-white md:text-[33px]">
          {withheld ? "いまは、置かないでおきます。" : reading.periodJa}
        </h1>
        <p className="mt-3 max-w-[36rem] text-[15px] leading-[1.9] text-[rgba(255,255,255,0.82)]">
          {withheld
            ? "どれも違う、と受け取りました。無理に当てはめずに、そのままにしておきます。次に何か残したくなったときに、また置けます。"
            : reading.recognitionJa}
        </p>

        {!withheld ? (
          <>
            {/* confirm / correct — the person has the last word */}
            <div className="mt-6 rounded-[var(--yorisou-radius-card)] border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.05)] p-4">
              <p className="m-0 text-[13px] font-semibold text-white">この読みは、いまの感じに合っていますか。</p>
              <p className="m-0 mt-1 text-[12px] leading-[1.7] text-[rgba(255,255,255,0.66)]">
                違うと感じたなら、その「違う」がいちばん確かな情報です。
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setConfirmed(true);
                    setCorrecting(false);
                  }}
                  aria-pressed={confirmed}
                  className={`inline-flex min-h-[44px] items-center rounded-[var(--yorisou-radius-pill)] px-4 text-[13px] font-bold transition ${
                    confirmed
                      ? "bg-[var(--yorisou-color-accent-500)] text-[var(--yorisou-color-deep-950)]"
                      : "border border-[rgba(255,255,255,0.28)] text-white hover:border-white"
                  }`}
                >
                  だいたい合っている
                </button>
                <button
                  type="button"
                  onClick={() => setCorrecting((v) => !v)}
                  aria-expanded={correcting}
                  className="inline-flex min-h-[44px] items-center rounded-[var(--yorisou-radius-pill)] border border-[rgba(255,255,255,0.28)] px-4 text-[13px] font-bold text-white transition hover:border-white"
                >
                  少し違う
                </button>
              </div>

              {correcting ? (
                <fieldset className="mt-4 border-0 p-0">
                  <legend className="mb-2 p-0 text-[12px] font-semibold text-[rgba(255,255,255,0.78)]">
                    いまの感じに近いのは、どれですか。
                  </legend>
                  <div className="grid gap-2">
                    {ALTERNATIVES.map((alt) => (
                      <button
                        key={alt.id}
                        type="button"
                        onClick={() => applyCorrection(alt.id)}
                        className="rounded-[var(--yorisou-radius-card)] border border-[rgba(255,255,255,0.18)] px-4 py-3 text-left transition hover:border-[var(--yorisou-color-accent-500)]"
                      >
                        <span className="block text-[13.5px] font-semibold text-white">{alt.labelJa}</span>
                        <span className="mt-0.5 block text-[12px] text-[rgba(255,255,255,0.66)]">{alt.hintJa}</span>
                      </button>
                    ))}
                  </div>
                </fieldset>
              ) : null}
            </div>

            <div className="mt-5 grid gap-3">
              <Panel title="どうしてこの読みになったか">
                <p className="m-0 text-[13px] leading-[1.8] text-[rgba(255,255,255,0.82)]">
                  {mode === "corrected"
                    ? "あなたが「あたたかさを近くに置きたい」と言い直したためです。前の読みより、あなたの訂正を優先しています。"
                    : "「いま大事にしたいこと」への答えのなかで、先の見通しに関する選び方が続けて選ばれたためです。"}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <SourceChip label={SOURCE_LABEL[reading.source]} />
                  {mode === "corrected" ? <SourceChip label="前の読みは履歴に残ります" /> : null}
                </div>
              </Panel>

              <Panel title="どのくらい確かか">
                <p className="m-0 text-[13px] leading-[1.8] text-[rgba(255,255,255,0.82)]">{reading.certaintyJa}</p>
                <p className="m-0 mt-1 text-[12px] text-[rgba(255,255,255,0.6)]">パーセントや点数では出しません。</p>
              </Panel>

              <Panel title="これは、こういう意味ではありません">
                <p className="m-0 text-[13px] leading-[1.8] text-[rgba(255,255,255,0.82)]">{reading.notMeaningJa}</p>
              </Panel>

              <Panel title="次に試せること（任意）">
                <ul className="m-0 grid list-none gap-2 p-0">
                  {suggestions.map((s) => (
                    <li key={s.titleJa} className="rounded-[var(--yorisou-radius-card)] border border-[rgba(255,255,255,0.12)] p-3">
                      <span className="block text-[13px] font-semibold text-white">{s.titleJa}</span>
                      <span className="mt-1 block text-[12px] leading-[1.7] text-[rgba(255,255,255,0.7)]">{s.whyJa}</span>
                      <span className="mt-2 inline-block text-[11px] text-[rgba(255,255,255,0.55)]">
                        {SOURCE_LABEL[s.source]}／やらなくても構いません
                      </span>
                    </li>
                  ))}
                </ul>
              </Panel>

              <Panel title="残す・見せる">
                <p className="m-0 text-[13px] leading-[1.8] text-[rgba(255,255,255,0.82)]">
                  この読みは、まだどこにも残っていません。残すと「わたしの今」から見返せます。人に見える場所には出ません。
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSaved((v) => !v)}
                    aria-pressed={saved}
                    className={`inline-flex min-h-[44px] items-center rounded-[var(--yorisou-radius-pill)] px-4 text-[13px] font-bold transition ${
                      saved
                        ? "bg-[var(--yorisou-color-accent-500)] text-[var(--yorisou-color-deep-950)]"
                        : "border border-[rgba(255,255,255,0.28)] text-white hover:border-white"
                    }`}
                  >
                    {saved ? "自分だけに残しました（取り消せます）" : "自分だけに残す"}
                  </button>
                  <Link
                    href="/prototype/ux1/continuity"
                    className="text-[12.5px] font-semibold text-[var(--yorisou-color-accent-500)] underline-offset-4"
                  >
                    「わたしの今」を見る
                  </Link>
                </div>
              </Panel>
            </div>
          </>
        ) : (
          <div className="mt-6">
            <button
              type="button"
              onClick={() => {
                setWithheld(false);
                setMode("primary");
              }}
              className="inline-flex min-h-[44px] items-center rounded-[var(--yorisou-radius-pill)] border border-[rgba(255,255,255,0.28)] px-4 text-[13px] font-bold text-white transition hover:border-white"
            >
              もう一度、読みを見てみる
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
