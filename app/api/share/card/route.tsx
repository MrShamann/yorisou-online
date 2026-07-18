import { ImageResponse } from "next/og";

import { SHARE_FORMATS, parseShareImageParams, type ShareCardModel, type ShareCardFormat } from "@/app/lib/share/shareCard";

// AIX-4 — real generated result-share images (Founder Finding B). One route, one
// architecture, three public-safe formats (square 1080², story 1080×1920, OG
// 1200×630). Public-safe by construction: it only ever reads the whitelisted
// share-model query params (see shareCard.ts) — no private data can reach it.
// Deterministic output for the same params; graceful fallback for invalid input.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Fetch a Japanese-capable font once per server instance (cached). ImageResponse
// (satori) needs an embedded ttf/otf for non-latin glyphs; if the fetch fails we
// fall back to the system fontFamily stack (Hiragino / Yu Gothic render locally).
let cachedFont: ArrayBuffer | null | undefined;
async function loadJpFont(): Promise<ArrayBuffer | null> {
  const cached = cachedFont;
  if (cached !== undefined) return cached;
  try {
    const css = await fetch(
      "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@700&display=swap",
      { headers: { "User-Agent": "Mozilla/5.0 (X11; Linux x86_64)" }, signal: AbortSignal.timeout(4000) },
    ).then((r) => r.text());
    const url = css.match(/src:\s*url\(([^)]+)\)\s*format\('(?:truetype|opentype|woff)'\)/)?.[1] ||
      css.match(/url\((https:\/\/[^)]+\.(?:ttf|otf|woff))\)/)?.[1];
    if (!url) {
      cachedFont = null;
      return null;
    }
    const data = await fetch(url, { signal: AbortSignal.timeout(6000) }).then((r) => r.arrayBuffer());
    cachedFont = data;
    return data;
  } catch {
    cachedFont = null;
    return null;
  }
}

const FONT_STACK = '"Noto Sans JP", "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Yu Gothic", "Meiryo", sans-serif';

function BrandMark({ size, accent }: { size: number; accent: string }) {
  const s = size / 40;
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path d="M6 30.5C6 16.4 13.9 8.5 27.5 8.5" stroke="#ECF3EE" strokeWidth={2.4 * s} strokeLinecap="round" opacity={0.85} />
      <path d="M13.5 31.5C13.5 22 18.4 16.5 27.8 16.5" stroke={accent} strokeWidth={2.4 * s} strokeLinecap="round" />
      <circle cx={29.4} cy={12.2} r={3.1 * s} fill={accent} />
    </svg>
  );
}

function Card({ model, format }: { model: ShareCardModel; format: ShareCardFormat }) {
  const { width, height } = SHARE_FORMATS[format];
  const accent = "#37e0ac";
  const hue = model.seedNumber;
  const isStory = format === "story";
  const isOg = format === "og";
  const pad = isOg ? 64 : isStory ? 96 : 84;
  const titleSize = isOg ? 68 : isStory ? 96 : 88;
  const labelSize = isOg ? 26 : 34;
  const lineSize = isOg ? 30 : 40;
  const traitSize = isOg ? 24 : 32;
  const markSize = isOg ? 54 : 78;

  return (
    <div
      style={{
        width,
        height,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: `${pad}px`,
        fontFamily: FONT_STACK,
        color: "#eef4ef",
        background: `radial-gradient(120% 55% at 18% -6%, hsla(${hue}, 60%, 45%, 0.22), transparent 55%), radial-gradient(90% 45% at 92% 4%, rgba(47,197,150,0.14), transparent 50%), linear-gradient(160deg, #0f1613 0%, #0c0e0d 46%, #08100c 100%)`,
      }}
    >
      {/* Brand lockup */}
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <BrandMark size={markSize} accent={accent} />
        <div style={{ display: "flex", fontSize: markSize * 0.5, fontWeight: 700, letterSpacing: "0.16em", color: "#ecf3ee" }}>
          YORISOU
        </div>
      </div>

      {/* Result identity */}
      <div style={{ display: "flex", flexDirection: "column", gap: isStory ? 34 : 22, maxWidth: width - pad * 2 }}>
        <div style={{ display: "flex", fontSize: labelSize, letterSpacing: "0.14em", color: "#8fd8bd" }}>
          {model.testLabel}
        </div>
        <div style={{ display: "flex", fontSize: titleSize, lineHeight: 1.08, fontWeight: 700, color: "#f4f9f5" }}>
          {model.title}
        </div>
        {model.line ? (
          <div style={{ display: "flex", fontSize: lineSize, lineHeight: 1.5, color: "#c8dcd1", maxWidth: width - pad * 2 }}>
            {model.line}
          </div>
        ) : null}
        {model.traits.length ? (
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 4 }}>
            {model.traits.map((t) => (
              <div
                key={t}
                style={{
                  display: "flex",
                  borderRadius: 16,
                  border: "1px solid rgba(140,216,189,0.34)",
                  background: "rgba(47,197,150,0.10)",
                  padding: `${isOg ? 12 : 16}px ${isOg ? 20 : 26}px`,
                  fontSize: traitSize,
                  color: "#d7ede2",
                }}
              >
                {t}
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div style={{ display: "flex", fontSize: isOg ? 22 : 30, color: "#8ba79a", letterSpacing: "0.12em" }}>
          yorisou.online
        </div>
        <div style={{ display: "flex", fontSize: isOg ? 20 : 26, color: "#6f8a7d" }}>
          {model.locale === "en" ? "state-to-life platform" : "今の状態から、次の選択まで。"}
        </div>
      </div>
    </div>
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const { format, model } = parseShareImageParams(searchParams);
  const { width, height } = SHARE_FORMATS[format];
  const font = await loadJpFont();

  return new ImageResponse(<Card model={model} format={format} />, {
    width,
    height,
    ...(font
      ? { fonts: [{ name: "Noto Sans JP", data: font, weight: 700 as const, style: "normal" as const }] }
      : {}),
  });
}
