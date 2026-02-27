import Link from "next/link";
import { getLatestNews, Locale } from "../content/news";

export default function NewsTeaser({ limit = 3, locale = "ja" }: { limit?: number; locale?: Locale }) {
  const items = getLatestNews(limit);
  const isJa = locale === "ja";

  return (
    <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
      {items.map((item) => (
        <article key={item.slug} className="card">
          <p className="muted" style={{ margin: 0, fontSize: 13 }}>
            {item.date}
          </p>
          <h3 style={{ margin: "8px 0", fontSize: 19 }}>{item.title[locale]}</h3>
          <p className="muted" style={{ margin: 0 }}>{item.summary[locale]}</p>
          <Link
            href={`${isJa ? "" : "/en"}/news/${item.slug}`}
            style={{ marginTop: 14, display: "inline-block", color: "var(--accent)", fontWeight: 700 }}
          >
            {isJa ? "詳細を見る" : "Read more"}
          </Link>
        </article>
      ))}
    </div>
  );
}
