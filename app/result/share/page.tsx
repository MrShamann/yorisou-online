import type { Metadata } from "next";
import Link from "next/link";

import { MvpActionLink, MvpCard, MvpPill } from "../../components/MvpSurface";
import { currentStateCheckV1, getCurrentStateOverlay, getCurrentStateResult } from "../../check-in/currentStateCheckV1";

export const metadata: Metadata = {
  title: "Instagramカード | Yorisou",
  description:
    "公開結果カードをスクリーンショットしてInstagramストーリーズに投稿できます。",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function readParam(params: Record<string, string | string[] | undefined>, key: string) {
  const value = params[key];
  return typeof value === "string" ? value : null;
}

export default async function ResultSharePage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const params = (await searchParams) || {};
  const resultId = readParam(params, "resultId") ?? currentStateCheckV1.scoring.fallbackResultId;
  const overlayId = readParam(params, "overlayId");
  const confidenceBand = readParam(params, "confidence") === "medium" ? "medium" : "low";
  const isStoryMode = readParam(params, "story") === "1";

  const result = getCurrentStateResult(resultId) ?? currentStateCheckV1.fallbackResult;
  const overlay =
    getCurrentStateOverlay(overlayId) ??
    currentStateCheckV1.overlays.find((item) => item.id === "balancing")!;

  // Public-safe back link — no payloadKey
  const resultHref = `/result?resultId=${encodeURIComponent(result.id)}&overlayId=${encodeURIComponent(overlay.id)}&confidence=${confidenceBand}`;

  // ── Story mode ──────────────────────────────────────────────────────────────
  // Full-screen fixed overlay covers any site header/footer chrome.
  // User screenshots the phone to get the Story card image.
  if (isStoryMode) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 50,
          background: "#0F2B26",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          WebkitOverflowScrolling: "touch" as React.CSSProperties["WebkitOverflowScrolling"],
        }}
      >
        {/* ── Instruction strip (subtle, sits above card) ── */}
        <div
          style={{
            paddingTop: "max(env(safe-area-inset-top, 0px), 14px)",
            paddingLeft: "20px",
            paddingRight: "20px",
            paddingBottom: "8px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "rgba(255,255,255,0.4)",
              fontSize: "11px",
              letterSpacing: "0.03em",
              lineHeight: 1.6,
            }}
          >
            このカードをスクリーンショットして
            <br />
            Instagramストーリーズに投稿できます
          </p>
        </div>

        {/* ── Card body — fills remaining viewport height ── */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "24px 28px 20px",
          }}
        >
          {/* Top: wordmark + kicker */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <p
              style={{
                margin: 0,
                color: "rgba(255,255,255,0.36)",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
              }}
            >
              YORISOU
            </p>
            <p
              style={{
                margin: 0,
                color: "rgba(255,255,255,0.46)",
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              公開結果カード
            </p>
          </div>

          {/* Center: title + share line + chips */}
          <div style={{ padding: "28px 0" }}>
            <h1
              className="display-serif"
              style={{
                margin: 0,
                color: "#ffffff",
                fontSize: "clamp(1.9rem, 6.5vw, 2.7rem)",
                lineHeight: 1.12,
              }}
            >
              {result.publicName}
            </h1>
            <p
              style={{
                margin: "18px 0 0",
                color: "rgba(255,255,255,0.68)",
                fontSize: "14px",
                lineHeight: 1.88,
              }}
            >
              {result.shareLine}
            </p>
            <div
              style={{
                marginTop: "20px",
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              {result.traitChips.map((chip) => (
                <span
                  key={chip}
                  style={{
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "999px",
                    padding: "6px 14px",
                    fontSize: "12px",
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom: domain */}
          <p
            style={{
              margin: 0,
              color: "rgba(255,255,255,0.26)",
              fontSize: "10px",
              letterSpacing: "0.12em",
            }}
          >
            yorisou.online
          </p>
        </div>

        {/* ── Footer: back link ── */}
        <div
          style={{
            padding: "8px 20px",
            paddingBottom: "max(env(safe-area-inset-bottom, 0px), 16px)",
            textAlign: "center",
          }}
        >
          <Link
            href={resultHref}
            style={{
              color: "rgba(255,255,255,0.3)",
              fontSize: "12px",
              textDecoration: "none",
            }}
          >
            ← 結果に戻る
          </Link>
        </div>
      </div>
    );
  }

  // ── Normal mode ─────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,20,19,0.98)_0%,_rgba(28,40,36,0.96)_26%,_rgba(243,246,239,1)_100%)] px-4 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[42rem] items-center">
        <MvpCard className="w-full space-y-5 border-white/10 bg-[linear-gradient(180deg,rgba(10,16,15,0.98)_0%,rgba(23,34,30,0.98)_56%,rgba(242,246,239,0.99)_100%)] text-white shadow-[0_24px_52px_rgba(10,16,14,0.18)]">
          <div className="flex flex-wrap gap-2">
            <MvpPill>{result.publicName}</MvpPill>
            <MvpPill>公開結果のみ</MvpPill>
          </div>

          <div className="space-y-3">
            <p
              className="service-kicker"
              style={{ color: "rgba(255,255,255,0.58)" }}
            >
              公開結果カード
            </p>
            <h1 className="display-serif text-[2.2rem] leading-[1.04] text-white md:text-[2.7rem]">
              {result.publicName}
            </h1>
            <p
              className="text-[15px] leading-8"
              style={{ color: "rgba(255,255,255,0.76)" }}
            >
              {result.shareLine}
            </p>
          </div>

          <div
            className="rounded-[1.2rem] p-4"
            style={{
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.05)",
            }}
          >
            <div className="flex flex-wrap gap-2">
              {result.traitChips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full px-3 py-1.5 text-[13px]"
                  style={{
                    border: "1px solid rgba(255,255,255,0.16)",
                    color: "rgba(255,255,255,0.8)",
                  }}
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          <div
            className="rounded-[1.1rem] p-4"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <p
              className="text-[13px] leading-7"
              style={{ color: "rgba(255,255,255,0.56)" }}
            >
              公開結果だけを静かに渡します。自分だけのヒント、回答内容、詳しいレポートは含みません。
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <MvpActionLink href={resultHref} label="結果へ戻る" />
          </div>
        </MvpCard>
      </div>
    </main>
  );
}
