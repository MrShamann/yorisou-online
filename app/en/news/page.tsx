import Link from "next/link";
import Hero from "../../components/Hero";
import { getSortedNews } from "../../content/news";

export default function NewsPageEn() {
  const posts = getSortedNews();

  return (
    <main>
      <Hero title="News" subtitle="Latest updates on pilot programs, local collaboration, and operational improvement." />

      <section className="section">
        <div className="container">
          <div className="grid" style={{ gridTemplateColumns: "1fr", gap: 12 }}>
            {posts.map((post) => (
              <article key={post.slug} className="card">
                <p className="muted" style={{ margin: 0, fontSize: 13 }}>{post.date}</p>
                <h2 style={{ margin: "8px 0", fontSize: 22 }}>{post.title.en}</h2>
                <p className="muted" style={{ margin: 0 }}>{post.summary.en}</p>
                <Link href={`/en/news/${post.slug}`} style={{ marginTop: 10, display: "inline-block", color: "var(--accent)", fontWeight: 700 }}>
                  Read more
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
