import { ImageResponse } from "next/og";

import { getTemporary120QResultCompatibility } from "../../check-in/resultCompatibility";

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
            "radial-gradient(circle at top, rgba(10,16,15,0.98) 0%, rgba(23,34,30,0.97) 40%, rgba(242,246,239,1) 100%)",
          color: "#ffffff",
          fontFamily: '"Noto Sans JP", "Hiragino Sans", "Yu Gothic", sans-serif',
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "22px", maxWidth: "860px" }}>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {["Share card", compatibility.brandedTestName, "Public only"].map((label) => (
              <div
                key={label}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  borderRadius: "999px",
                  border: "1px solid rgba(255,255,255,0.14)",
                  padding: "8px 14px",
                  fontSize: "22px",
                  letterSpacing: "0.18em",
                  color: "rgba(255,255,255,0.86)",
                  background: "rgba(255,255,255,0.08)",
                }}
              >
                {label}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div style={{ fontSize: "28px", letterSpacing: "0.16em", color: "rgba(255,255,255,0.66)" }}>
              {compatibility.currentStateNote}
            </div>
            <div style={{ fontSize: "78px", lineHeight: 1.02, fontWeight: 700 }}>{compatibility.shareLine}</div>
            {compatibility.codeLine ? (
              <div style={{ fontSize: "30px", lineHeight: 1.2, color: "rgba(255,255,255,0.86)", fontWeight: 600 }}>
                {compatibility.codeLine}
              </div>
            ) : null}
            <div style={{ fontSize: "36px", lineHeight: 1.45, color: "rgba(255,255,255,0.8)", maxWidth: "920px" }}>
              {compatibility.assignment ? compatibility.globalNote : compatibility.placeholderText}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {compatibility.heroChips.map((trait) => (
              <div
                key={trait}
                style={{
                  borderRadius: "18px",
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: "rgba(255,255,255,0.08)",
                  padding: "18px 24px",
                  fontSize: "28px",
                  color: "rgba(255,255,255,0.92)",
                }}
              >
                {trait}
              </div>
            ))}
          </div>
          <div style={{ fontSize: "24px", color: "rgba(255,255,255,0.72)", letterSpacing: "0.1em" }}>
            {compatibility.taxonomyStatus}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
