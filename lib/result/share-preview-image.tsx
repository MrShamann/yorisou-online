type SharePreviewImageProps = {
  personaName: string;
  socialLine: string;
  subtitle: string;
  traitChips: string[];
  publicSign?: string | null;
  currentModeLabel?: string | null;
  brandLabel?: string;
  urlLabel?: string;
};

export function renderResultSharePreviewImage({
  personaName,
  socialLine,
  subtitle,
  traitChips,
  publicSign = null,
  currentModeLabel = null,
  brandLabel = "YORISOU",
  urlLabel = "yorisou.online/line/mini-app",
}: SharePreviewImageProps) {
  const chips = traitChips.slice(0, 3);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(135deg, rgba(10,16,15,1) 0%, rgba(24,35,31,0.98) 35%, rgba(45,66,57,0.96) 70%, rgba(239,243,236,1) 100%)",
        color: "rgba(255,255,255,1)",
        fontFamily: "Inter, Noto Sans JP, sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "-12%",
          background:
            "radial-gradient(circle at 14% 16%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 26%), radial-gradient(circle at 84% 18%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 24%), radial-gradient(circle at 84% 82%, rgba(184,112,79,0.16) 0%, rgba(184,112,79,0) 28%)",
        }}
      />

      <div
        style={{
          position: "relative",
          display: "flex",
          width: "100%",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 54,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.18)",
                background: "rgba(255,255,255,0.10)",
                padding: "10px 16px",
                color: "rgba(255,255,255,0.96)",
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: "0.16em",
              }}
            >
              {brandLabel}
            </div>
            <div
              style={{
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.16)",
                background: "rgba(255,255,255,0.08)",
                padding: "10px 16px",
                color: "rgba(255,255,255,0.9)",
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              あなたの結果
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
            {publicSign ? (
              <div
                style={{
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.10)",
                  border: "1px solid rgba(255,255,255,0.16)",
                  color: "rgba(255,255,255,0.94)",
                  padding: "10px 14px",
                  fontSize: 16,
                  fontWeight: 700,
                }}
              >
                しるし: {publicSign}
              </div>
            ) : null}
            {currentModeLabel ? (
              <div
                style={{
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.10)",
                  border: "1px solid rgba(255,255,255,0.16)",
                  color: "rgba(255,255,255,0.94)",
                  padding: "10px 14px",
                  fontSize: 16,
                  fontWeight: 700,
                }}
              >
                モード: {currentModeLabel}
              </div>
            ) : null}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 28, alignItems: "stretch" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 760 }}>
            <div
              style={{
                color: "rgba(255,255,255,0.78)",
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: "0.18em",
              }}
            >
              まっすぐ、持ち帰れる結果。
            </div>
            <div
              style={{
                color: "rgba(255,255,255,1)",
                fontSize: 72,
                fontWeight: 800,
                lineHeight: 0.98,
                letterSpacing: "-0.06em",
              }}
            >
              {personaName}
            </div>
            {socialLine ? (
              <div
                style={{
                  maxWidth: 700,
                  borderRadius: 24,
                  border: "1px solid rgba(255,255,255,0.18)",
                  background: "rgba(255,255,255,0.10)",
                  padding: "18px 22px",
                  fontSize: 28,
                  fontWeight: 700,
                  lineHeight: 1.26,
                  color: "rgba(255,255,255,0.96)",
                }}
              >
                {socialLine}
              </div>
            ) : null}
            {subtitle ? (
              <div
                style={{
                  maxWidth: 720,
                  color: "rgba(255,255,255,0.78)",
                  fontSize: 22,
                  lineHeight: 1.42,
                }}
              >
                {subtitle}
              </div>
            ) : null}
          </div>

          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: 16,
              borderRadius: 32,
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(255,255,255,0.08)",
              padding: 22,
              boxShadow: "0 20px 34px rgba(7, 11, 10, 0.16)",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 16,
                borderRadius: 26,
                border: "1px solid rgba(255,255,255,0.12)",
                background:
                  "radial-gradient(circle at 50% 42%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.08) 28%, rgba(255,255,255,0.02) 58%, rgba(255,255,255,0) 72%)",
                opacity: 0.9,
              }}
            />

            <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ fontSize: 14, letterSpacing: "0.18em", color: "rgba(255,255,255,0.72)" }}>共有カード</div>
              <div style={{ fontSize: 52, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.05em", color: "rgba(255,255,255,0.98)" }}>
                {personaName.slice(0, 3) || "Y"}
              </div>
              <div style={{ fontSize: 16, lineHeight: 1.65, color: "rgba(255,255,255,0.84)" }}>
                {urlLabel}
              </div>
            </div>

            <div style={{ position: "relative", display: "flex", flexWrap: "wrap", gap: 10 }}>
              {chips.map((trait) => (
                <div
                  key={trait}
                  style={{
                    borderRadius: 999,
                    border: "1px solid rgba(255,255,255,0.16)",
                    background: "rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.96)",
                    padding: "10px 16px",
                    fontSize: 16,
                    fontWeight: 700,
                  }}
                >
                  {trait}
                </div>
              ))}
            </div>

            <div
              style={{
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 999,
                background: "rgba(18,20,19,0.88)",
                color: "rgba(255,255,255,0.98)",
                padding: "14px 20px",
                fontSize: 18,
                fontWeight: 800,
                width: "fit-content",
              }}
            >
              あなたも診断する
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 760 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {chips.map((trait) => (
                <div
                  key={trait}
                  style={{
                    borderRadius: 999,
                    border: "1px solid rgba(255,255,255,0.16)",
                    background: "rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.96)",
                    padding: "10px 16px",
                    fontSize: 16,
                    fontWeight: 700,
                  }}
                >
                  {trait}
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 10,
              color: "rgba(255,255,255,0.82)",
              fontSize: 16,
              textAlign: "right",
            }}
          >
            <div style={{ letterSpacing: "0.14em" }}>{urlLabel}</div>
            <div style={{ letterSpacing: "0.2em", opacity: 0.88 }}>Yorisou / LINE</div>
          </div>
        </div>
      </div>
    </div>
  );
}
