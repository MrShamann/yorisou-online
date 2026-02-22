import React from "react";
import SiteHeader from "../components/SiteHeader";

function Card({ title, desc }: { title: string; desc: string }) {
  return (
    <div
      style={{
        borderRadius: 16,
        padding: 18,
        background: "rgba(255,255,255,0.78)",
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 10px 22px rgba(0,0,0,0.04)",
      }}
    >
      <div style={{ fontWeight: 800, fontSize: 15 }}>{title}</div>
      <div style={{ marginTop: 10, fontSize: 13, color: "#5b5b5b", lineHeight: 1.8 }}>
        {desc}
      </div>
    </div>
  );
}

export default function HomeEN() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f6f3ec",
        color: "#222",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
      }}
    >
      <SiteHeader lang="en" />

      <section style={{ padding: "70px 40px 30px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: 34,
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontSize: 12, letterSpacing: "0.14em", color: "#7b7b7b" }}>
              FUKUOKA COMMUNITY MOBILITY
            </div>

            <h1 style={{ marginTop: 18, fontSize: 52, lineHeight: 1.15, letterSpacing: "-0.02em" }}>
              Mobility that stays close.
              <br />
              Reduce mobility anxiety.
            </h1>

            <p style={{ marginTop: 18, fontSize: 16, color: "#4f4f4f", lineHeight: 1.9 }}>
              Yorisou designs and operates <b>small-scale community mobility pilots</b> for
              aging societies in Japan—built for everyday routes like clinics, stations, and shopping streets.
            </p>

            <div style={{ marginTop: 26, display: "flex", gap: 14, flexWrap: "wrap" }}>
              <a
                href="/en/pilot"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "12px 18px",
                  borderRadius: 10,
                  background: "#222",
                  color: "#fff",
                  textDecoration: "none",
                  fontWeight: 800,
                  fontSize: 14,
                }}
              >
                View Pilot
              </a>

              <a
                href="/en/contact"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "12px 18px",
                  borderRadius: 10,
                  background: "#fff",
                  color: "#222",
                  textDecoration: "none",
                  fontWeight: 800,
                  fontSize: 14,
                  border: "1px solid rgba(0,0,0,0.12)",
                }}
              >
                Contact
              </a>
            </div>

            <div
              style={{
                marginTop: 26,
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 12,
              }}
            >
              <Card title="Goal" desc="Reduce mobility anxiety and increase daily outings for seniors" />
              <Card title="Method" desc="30–90 day pilots with data-driven improvement loops" />
              <Card title="Start" desc="Begin in Fukuoka, then scale to other communities" />
            </div>
          </div>

          <div
            style={{
              borderRadius: 18,
              overflow: "hidden",
              border: "1px solid rgba(0,0,0,0.06)",
              background: "rgba(255,255,255,0.78)",
              boxShadow: "0 10px 22px rgba(0,0,0,0.04)",
              padding: 14,
            }}
          >
            <img
              src="/images/yorisou-hero.png"
              alt="Yorisou"
              style={{ width: "100%", height: "auto", borderRadius: 12, display: "block" }}
            />
            <div style={{ marginTop: 10, fontSize: 12, color: "#6b6b6b", lineHeight: 1.6 }}>
              Image path:{" "}
              <code style={{ background: "#fff", padding: "2px 6px", borderRadius: 8 }}>
                public/images/yorisou-hero.png
              </code>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "30px 40px" }}>
        <div style={{ fontSize: 12, letterSpacing: "0.14em", color: "#7b7b7b" }}>WHY YORISOU</div>
        <h2 style={{ marginTop: 12, fontSize: 30, lineHeight: 1.25 }}>
          Pilot-first community mobility design
        </h2>

        <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          <Card title="Safety-first" desc="Rules, daily checks, and training built into the operating model" />
          <Card title="Co-creation" desc="Work with municipalities, facilities, and local operators" />
          <Card title="Evidence-driven" desc="Collect data and feedback to optimize before scaling" />
        </div>
      </section>

      <footer
        style={{
          padding: "22px 40px 34px",
          borderTop: "1px solid rgba(0,0,0,0.06)",
          color: "#6b6b6b",
          fontSize: 12,
          marginTop: 40,
        }}
      >
        <div>© {new Date().getFullYear()} Yorisou</div>
      </footer>
    </main>
  );
}