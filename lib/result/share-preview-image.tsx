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
          "linear-gradient(135deg, rgba(25, 44, 39, 1) 0%, rgba(44, 72, 63, 0.98) 28%, rgba(246, 242, 234, 1) 100%)",
        color: "rgba(24, 24, 22, 1)",
        fontFamily: "Inter, Noto Sans JP, sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "-10%",
          background:
            "radial-gradient(circle at 16% 18%, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0) 28%), radial-gradient(circle at 88% 14%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 24%), radial-gradient(circle at 84% 82%, rgba(180,106,72,0.22) 0%, rgba(180,106,72,0) 30%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: -70,
          top: 84,
          width: 250,
          height: 250,
          borderRadius: 999,
          border: "1px solid rgba(255,255,255,0.18)",
          background: "rgba(255,255,255,0.06)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 40,
          top: 150,
          width: 140,
          height: 140,
          borderRadius: 999,
          border: "1px solid rgba(255,255,255,0.12)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -60,
          bottom: -50,
          width: 220,
          height: 220,
          borderRadius: 999,
          background: "rgba(255,255,255,0.14)",
          filter: "blur(24px)",
        }}
      />

      <div
        style={{
          position: "relative",
          display: "flex",
          width: "100%",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 56,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.22)",
                background: "rgba(255,255,255,0.12)",
                padding: "10px 16px",
                color: "rgba(255,255,255,0.95)",
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: "0.16em",
              }}
            >
              {brandLabel}
            </div>
            <div
              style={{
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.22)",
                background: "rgba(255,255,255,0.14)",
                padding: "10px 16px",
                color: "rgba(255,255,255,0.92)",
                fontSize: 18,
                fontWeight: 700,
              }}
            >
              あなたの結果
            </div>
          </div>

          {publicSign || currentModeLabel ? (
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
              {publicSign ? (
                <div
                  style={{
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.14)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    color: "rgba(255,255,255,0.94)",
                    padding: "10px 14px",
                    fontSize: 18,
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
                    background: "rgba(255,255,255,0.14)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    color: "rgba(255,255,255,0.94)",
                    padding: "10px 14px",
                    fontSize: 18,
                    fontWeight: 700,
                  }}
                >
                  モード: {currentModeLabel}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22, maxWidth: 850 }}>
          <div
            style={{
              color: "rgba(255,255,255,0.9)",
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: "0.18em",
            }}
          >
            結果を保存して、送れる。
          </div>
          <div
            style={{
              color: "rgba(255,255,255,1)",
              fontSize: 72,
              fontWeight: 800,
              lineHeight: 1.0,
              letterSpacing: "-0.05em",
            }}
          >
            {personaName}
          </div>
          {socialLine ? (
            <div
              style={{
                maxWidth: 760,
                borderRadius: 28,
                background: "rgba(255,255,255,0.18)",
                border: "1px solid rgba(255,255,255,0.22)",
                color: "rgba(255,255,255,0.96)",
                padding: "18px 22px",
                fontSize: 30,
                fontWeight: 700,
                lineHeight: 1.28,
              }}
            >
              {socialLine}
            </div>
          ) : null}
          {subtitle ? (
            <div
              style={{
                maxWidth: 760,
                color: "rgba(255,255,255,0.84)",
                fontSize: 24,
                lineHeight: 1.45,
              }}
            >
              {subtitle}
            </div>
          ) : null}
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 28 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 780 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {chips.map((trait) => (
                <div
                  key={trait}
                  style={{
                    borderRadius: 999,
                    border: "1px solid rgba(255,255,255,0.22)",
                    background: "rgba(255,255,255,0.14)",
                    color: "rgba(255,255,255,0.96)",
                    padding: "10px 16px",
                    fontSize: 18,
                    fontWeight: 700,
                  }}
                >
                  {trait}
                </div>
              ))}
            </div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                borderRadius: 999,
                background: "rgba(18,20,19,0.82)",
                color: "rgba(255,255,255,0.96)",
                padding: "14px 20px",
                fontSize: 20,
                fontWeight: 700,
                width: "fit-content",
              }}
            >
              あなたも診断する
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
            <div style={{ letterSpacing: "0.12em" }}>{urlLabel}</div>
            <div style={{ letterSpacing: "0.2em", opacity: 0.86 }}>Yorisou / LINE</div>
          </div>
        </div>
      </div>
    </div>
  );
}
