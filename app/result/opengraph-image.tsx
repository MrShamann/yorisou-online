import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const traits = ["静かな整理型", "一人で抱えやすい", "判断は慎重で深い"];

export default function Image() {
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
            <div style={{ fontSize: "80px", lineHeight: 1.02, fontWeight: 700, letterSpacing: "-0.05em" }}>整え直しの入口</div>
            <div style={{ fontSize: "36px", lineHeight: 1.45, color: "#31413c", maxWidth: "920px" }}>
              いまは、答えを急ぐより整え直すほうが合っています。
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {traits.slice(0, 2).map((trait) => (
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
          <div style={{ fontSize: "24px", color: "#597065", letterSpacing: "0.1em" }}>Yorisou v0.2 / Public-safe result</div>
        </div>
      </div>
    ),
    size,
  );
}
