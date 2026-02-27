import Link from "next/link";
import { getLatestNews } from "../content/news";

export default function NewsTeaser({ limit = 3 }: { limit?: number }) {
  const items = getLatestNews(limit);

  return (
    <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
      {items.map((item) => (
        <article key={item.slug} className="card">
          <p className="muted" style={{ margin: 0, fontSize: 13 }}>
            {item.date}
          </p>
          <h3 style={{ margin: "8px 0", fontSize: 19 }}>{item.title}</h3>
          <p className="muted" style={{ margin: 0 }}>{item.summary}</p>
          <Link href={`/news/${item.slug}`} style={{ marginTop: 14, display: "inline-block", color: "var(--accent)", fontWeight: 700 }}>
            詳細を見る
          </Link>
        </article>
      ))}
    </div>
  );
}
