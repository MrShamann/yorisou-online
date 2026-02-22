import React from "react";

export default function PilotEN() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f6f3ec",
        color: "#2c2c2c",
        fontFamily: "system-ui, -apple-system",
      }}
    >
      <div
        style={{
          padding: "24px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <img
            src="/images/yorisou-logo.png"
            alt="Yorisou"
            style={{ height: 90, width: "auto" }}
          />
          <div style={{ lineHeight: 1.1 }}>
            <div style={{ fontWeight: 800, fontSize: 24 }}>Yorisou</div>
            <div style={{ fontSize: 13, opacity: 0.7 }}>
              Community Mobility Initiative
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <a
            href="/pilot"
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
          <a
            href="/en"
            style={{
              textDecoration: "none",
              fontSize: 14,
              padding: "8px 14px",
              borderRadius: 20,
              background: "#e3dfd6",
              color: "#333",
            }}
          >
            Home
          </a>
        </div>
      </div>

      <section style={{ padding: "60px 40px", maxWidth: 1100, margin: "0 auto" }}>
        <h1 style={{ fontSize: 40, lineHeight: 1.3, marginBottom: 14 }}>
          Pilot Proposal for Fukuoka: Senior-Friendly Community Mobility
        </h1>

        <p style={{ fontSize: 18, lineHeight: 1.8, maxWidth: 860 }}>
          We propose a 30–90 day small-scale pilot using low-speed electric mobility
          to support everyday independence for seniors. Together with municipalities
          and local operators, we validate safety, resident satisfaction, and
          operational efficiency.
        </p>

        <div
          style={{
            marginTop: 28,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 16,
          }}
        >
          {[
            { t: "Duration", v: "30–90 days" },
            { t: "Use areas", v: "Residential / commercial / healthcare & public routes" },
            { t: "Target users", v: "Seniors: shopping, clinic visits, last-mile access" },
            { t: "KPIs", v: "Trips, satisfaction, incidents, operating cost" },
          ].map((x) => (
            <div
              key={x.t}
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: 18,
                boxShadow: "0 6px 24px rgba(0,0,0,0.06)",
              }}
            >
              <div style={{ fontSize: 12, opacity: 0.7 }}>{x.t}</div>
              <div style={{ fontSize: 18, fontWeight: 800, marginTop: 6 }}>
                {x.v}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 34 }}>
          <h2 style={{ fontSize: 26, marginBottom: 10 }}>Pilot Design</h2>
          <div style={{ display: "grid", gap: 10, lineHeight: 1.8 }}>
            <div>1) Define routes, rules, speed cap, and operating hours</div>
            <div>2) Operations: simple booking, pick-up points, daily checks</div>
            <div>3) Safety: training, usage rules, optional protective equipment</div>
            <div>4) Data collection: usage logs, surveys, near-miss reports</div>
            <div>5) Improvement loop: weekly report → adjust rules and routes</div>
          </div>
        </div>

        <div style={{ marginTop: 34 }}>
          <h2 style={{ fontSize: 26, marginBottom: 10 }}>Roles & Responsibilities</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 16,
            }}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: 18,
                boxShadow: "0 6px 24px rgba(0,0,0,0.06)",
              }}
            >
              <div style={{ fontWeight: 900, fontSize: 16 }}>Municipality</div>
              <ul style={{ marginTop: 10, lineHeight: 1.8 }}>
                <li>Coordinate pilot area and stakeholders</li>
                <li>Agree on safety and operating requirements</li>
                <li>Support local outreach and participant recruitment</li>
              </ul>
            </div>

            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: 18,
                boxShadow: "0 6px 24px rgba(0,0,0,0.06)",
              }}
            >
              <div style={{ fontWeight: 900, fontSize: 16 }}>Yorisou</div>
              <ul style={{ marginTop: 10, lineHeight: 1.8 }}>
                <li>Provide vehicles, operating design, and safety training</li>
                <li>Provide SOPs, daily checks, and a lightweight dashboard</li>
                <li>Weekly reporting and improvement proposals</li>
              </ul>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 34 }}>
          <h2 style={{ fontSize: 26, marginBottom: 10 }}>Next Steps</h2>
          <div style={{ lineHeight: 1.8 }}>
            1) Select 2–3 candidate areas → 2) Site check (routes, surface, curb cuts) →
            3) Agree on operating rules → 4) Recruit participants → 5) Launch the pilot
          </div>

          <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a
              href="/en#contact"
              style={{
                textDecoration: "none",
                padding: "12px 16px",
                borderRadius: 10,
                background: "#8ca79c",
                color: "#fff",
                fontWeight: 700,
              }}
            >
              Contact
            </a>
            <a
              href="/pilot"
              style={{
                textDecoration: "none",
                padding: "12px 16px",
                borderRadius: 10,
                background: "#e3dfd6",
                color: "#333",
                fontWeight: 700,
              }}
            >
              日本語版
            </a>
          </div>
        </div>

        <div style={{ marginTop: 50, opacity: 0.65, fontSize: 12 }}>
          * This page is a draft. Details (vehicle specs, insurance, formal documents)
          will be finalized with stakeholders.
        </div>
      </section>
    </main>
  );
}
