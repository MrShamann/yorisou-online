export default function ProgressPageEn() {
  return (
    <main style={{ background: "#f6f3ec", minHeight: "100vh" }}>
      <section style={{ padding: "64px 0 28px", borderBottom: "1px solid #e4dfd6" }}>
        <div className="container">
          <h1 style={{ margin: 0, fontSize: "clamp(30px, 4vw, 46px)", lineHeight: 1.35 }}>
            Project Progress (Jan 2026 – Present)
          </h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Work Completed to Date</h2>
          <p style={{ marginTop: 16 }}>
            After entering Japan on January 7, 2026, Yorisou began preparing a community-based mobility pilot in Fukuoka.
          </p>
          <p>
            Key progress to date includes:
          </p>
          <ul className="list-clean" style={{ display: "grid", gap: 8 }}>
            <li>Initiated company setup as a GK (Godo Kaisha)</li>
            <li>Secured a shared office base in Imajuku, Nishi Ward, Fukuoka</li>
            <li>Launched the official website</li>
            <li>Organized the pilot’s basic design and operational structure</li>
            <li>Conducted initial research on mobility challenges in an aging society</li>
          </ul>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <h2 className="section-title">Key Plan Through July 2026</h2>
          <p style={{ marginTop: 16 }}>
            Yorisou will proceed with phased preparation through July 2026.
          </p>

          <h3 style={{ marginTop: 20, marginBottom: 8 }}>Phase 1 (March)</h3>
          <ul className="list-clean" style={{ display: "grid", gap: 8 }}>
            <li>Complete company establishment</li>
            <li>Set up the operating foundation (bank account, contracts)</li>
          </ul>

          <h3 style={{ marginTop: 20, marginBottom: 8 }}>Phase 2 (April–May)</h3>
          <ul className="list-clean" style={{ display: "grid", gap: 8 }}>
            <li>Conduct local interviews and select candidate pilot fields</li>
            <li>Design a small-scale pilot model (3–5 vehicles)</li>
            <li>Establish safety management and insurance policy</li>
          </ul>

          <h3 style={{ marginTop: 20, marginBottom: 8 }}>Phase 3 (June)</h3>
          <ul className="list-clean" style={{ display: "grid", gap: 8 }}>
            <li>Finalize the pilot execution plan</li>
            <li>Finalize the business plan package</li>
            <li>Coordinate with local government and community stakeholders</li>
          </ul>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <h2 className="section-title">Principles</h2>
          <p style={{ marginTop: 16 }}>
            Yorisou aims to build a sustainable community mobility model through small-scale pilots without relying on government budgets.
            We will validate practical operations aligned with local daily routes, emphasizing safety and continuity.
          </p>
        </div>
      </section>
    </main>
  );
}
