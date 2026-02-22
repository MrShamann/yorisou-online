export default function SiteHeader({ subtitle }: { subtitle?: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 20,
        padding: "28px 0",
      }}
    >
      <img
        src="/images/yorisou-logo.png"
        alt="Yorisou"
        style={{
          height: 96,
          width: "auto",
        }}
      />

      <div>
        <div
          style={{
            fontWeight: 800,
            fontSize: 30,
            letterSpacing: 1,
          }}
        >
          寄り添う – Yorisou
        </div>

        {subtitle && (
          <div
            style={{
              marginTop: 6,
              fontSize: 16,
              opacity: 0.75,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}
