import { ImageResponse } from "next/og";

import { getTemporary120QResultCompatibility } from "../check-in/resultCompatibility";

export const runtime = "edge";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function readParam(params: Record<string, string | string[] | undefined>, key: string) {
  const value = params[key];
  return typeof value === "string" ? value : null;
}

export default async function Image({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const params = (await searchParams) || {};
  const resultId = readParam(params, "resultId");
  const overlayId = readParam(params, "overlayId");
  const payloadKey = readParam(params, "payloadKey");
  const compatibility = getTemporary120QResultCompatibility({
    resultId,
    overlayId,
    payloadKey,
  });
  const traits = ["120問ベース", "分類保留"] as const;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px",
          background:
            "radial-gradient(circle at top left, rgba(255,255,255,0.98) 0%, rgba(247,244,238,0.98) 38%, rgba(239,244,236,0.98) 100%)",
          color: "#22302c",
          fontFamily: '"Noto Sans JP", "Hiragino Sans", "Yu Gothic", sans-serif',
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "820px" }}>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {["Public result", "Share-safe", "Public only"].map((label) => (
              <div
                key={label}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  borderRadius: "999px",
                  border: "1px solid rgba(114,132,109,0.22)",
                  padding: "8px 14px",
                  fontSize: "22px",
                  letterSpacing: "0.18em",
                  color: "#567063",
                  background: "rgba(255,255,255,0.76)",
                }}
              >
                {label}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div style={{ fontSize: "28px", letterSpacing: "0.16em", color: "#7a897d" }}>RESULT TYPE</div>
            <div style={{ fontSize: "80px", lineHeight: 1.02, fontWeight: 700 }}>120Q Placeholder Result</div>
            <div style={{ fontSize: "36px", lineHeight: 1.45, color: "#31413c", maxWidth: "920px" }}>
              {compatibility.placeholderText}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {traits.map((trait) => (
              <div
                key={trait}
                style={{
                  borderRadius: "18px",
                  border: "1px solid rgba(114,132,109,0.18)",
                  background: "rgba(255,255,255,0.86)",
                  padding: "18px 24px",
                  fontSize: "28px",
                  color: "#31413c",
                }}
              >
                {trait}
              </div>
            ))}
          </div>
          <div style={{ fontSize: "24px", color: "#597065", letterSpacing: "0.1em" }}>{compatibility.taxonomyStatus}</div>
        </div>
      </div>
    ),
    size,
  );
}
