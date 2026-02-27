import Link from "next/link";
import Hero from "../components/Hero";
import { getSortedNews } from "../content/news";

export default function NewsPage() {
  const posts = getSortedNews();

  return (
    <main>
      <Hero
        title="お知らせ"
        subtitle="実証実験、地域連携、運用改善に関する最新情報を掲載しています。"
      />

      <section className="section">
        <div className="container">
          <div className="grid" style={{ gridTemplateColumns: "1fr", gap: 12 }}>
            {posts.map((post) => (
              <article key={post.slug} className="card">
                <p className="muted" style={{ margin: 0, fontSize: 13 }}>{post.date}</p>
                <h2 style={{ margin: "8px 0", fontSize: 22 }}>{post.title}</h2>
                <p className="muted" style={{ margin: 0 }}>{post.summary}</p>
                <Link href={`/news/${post.slug}`} style={{ marginTop: 10, display: "inline-block", color: "var(--accent)", fontWeight: 700 }}>
                  詳細を見る
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
