import type { Metadata } from "next";
import Link from "next/link";

import { MvpActionLink, MvpCard, MvpPill } from "../../components/MvpSurface";
import { buildPublicResultHref, getTemporary120QResultCompatibility } from "../../check-in/resultCompatibility";

export const metadata: Metadata = {
  title: "いま色シェアカード | Yorisou",
  description:
    "いま色テスト by よりそう の公開結果カードを、スクリーンショットして共有できるページです。",
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
  const resultId = readParam(params, "resultId");
  const overlayId = readParam(params, "overlayId");
  const confidenceBand = readParam(params, "confidence") === "medium" ? "medium" : "low";
  const payloadKey = readParam(params, "payloadKey");
  const isStoryMode = readParam(params, "story") === "1";
  const routeContext = { resultId, overlayId, confidenceBand, payloadKey } as const;
  const compatibility = getTemporary120QResultCompatibility(routeContext);
  const resultHref = buildPublicResultHref("/result", routeContext);

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
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "28px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.42)", fontSize: "10px", letterSpacing: "0.24em" }}>
              {compatibility.brandedTestName.toUpperCase()}
            </p>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.56)", fontSize: "12px" }}>
              {compatibility.currentStateNote}
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <h1
              className="display-serif"
              style={{
                margin: 0,
                color: "#ffffff",
                fontSize: "clamp(2rem, 7vw, 3rem)",
                lineHeight: 1.12,
              }}
            >
              {compatibility.shareLine}
            </h1>
            {compatibility.codeLine ? (
              <p style={{ margin: 0, color: "rgba(255,255,255,0.78)", fontSize: "16px", letterSpacing: "0.06em" }}>
                {compatibility.codeLine}
              </p>
            ) : null}
            <p style={{ margin: 0, color: "rgba(255,255,255,0.72)", fontSize: "14px", lineHeight: 1.8 }}>
              {compatibility.assignment ? compatibility.globalNote : compatibility.placeholderText}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {compatibility.heroChips.map((chip) => (
                <span
                  key={chip}
                  style={{
                    border: "1px solid rgba(255,255,255,0.18)",
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

          <p style={{ margin: 0, color: "rgba(255,255,255,0.26)", fontSize: "10px", letterSpacing: "0.12em" }}>
            yorisou.online
          </p>
        </div>

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

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,20,19,0.98)_0%,_rgba(28,40,36,0.96)_26%,_rgba(243,246,239,1)_100%)] px-4 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[42rem] items-center">
        <MvpCard className="w-full space-y-5 border-white/10 bg-[linear-gradient(180deg,rgba(10,16,15,0.98)_0%,rgba(23,34,30,0.98)_56%,rgba(242,246,239,0.99)_100%)] text-white shadow-[0_24px_52px_rgba(10,16,14,0.18)]">
          <div className="flex flex-wrap gap-2">
            <MvpPill>{compatibility.brandedTestName}</MvpPill>
            <MvpPill>公開結果カード</MvpPill>
          </div>

          <div className="space-y-3">
            <p
              className="service-kicker"
              style={{ color: "rgba(255,255,255,0.58)" }}
            >
              {compatibility.currentStateNote}
            </p>
            <h1 className="display-serif text-[2.2rem] leading-[1.04] text-white md:text-[2.7rem]">
              {compatibility.shareLine}
            </h1>
            {compatibility.codeLine ? (
              <p
                className="text-[15px] font-semibold leading-8"
                style={{ color: "rgba(255,255,255,0.82)" }}
              >
                {compatibility.codeLine}
              </p>
            ) : null}
            <p
              className="text-[15px] leading-8"
              style={{ color: "rgba(255,255,255,0.76)" }}
            >
              {compatibility.assignment ? compatibility.globalNote : compatibility.placeholderText}
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
              {compatibility.heroChips.map((chip) => (
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
              公開カードには、内部の採点情報や感度ルーティングは含めません。
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <MvpActionLink
              href={`${resultHref}${resultHref.includes("?") ? "&" : "?"}story=1`}
              label="ストーリーズ用に開く"
              tone="primary"
              className="rounded-full"
            />
            <MvpActionLink
              href={resultHref}
              label="結果ページに戻る"
              tone="ghost"
              className="rounded-full !text-white"
            />
          </div>
        </MvpCard>
      </div>
    </main>
  );
}
