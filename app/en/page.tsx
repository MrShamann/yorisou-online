export default function EnglishPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f6f3ec",
        color: "#2c2c2c",
        fontFamily: "system-ui, -apple-system",
      }}
    >
      <div style={{ padding: "24px 40px", display: "flex", justifyContent: "space-between" }}>
        <div style={{ fontWeight: 700, fontSize: 20 }}>
          Yorisou
        </div>
        <a
          href="/"
          style={{
            textDecoration: "none",
            fontSize: 14,
            padding: "8px 14px",
            borderRadius: 20,
            background: "#e3dfd6",
            color: "#333",
          }}
        >
          日本語
        </a>
      </div>

      <section style={{ padding: "80px 40px", maxWidth: 1100, margin: "0 auto" }}>
        <h1 style={{ fontSize: 42, marginBottom: 20 }}>
          Senior-Friendly Community Mobility from Fukuoka
        </h1>

        <p style={{ fontSize: 18, lineHeight: 1.8, maxWidth: 700 }}>
          Yorisou is a Japan-focused electric mobility initiative designed
          for aging communities. We collaborate with municipalities and
          regional operators to build safe, small-scale pilot programs.
        </p>
      </section>
    </main>
  );
}