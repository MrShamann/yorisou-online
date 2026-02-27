import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getNewsBySlug, getSortedNews } from "../../content/news";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getSortedNews().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getNewsBySlug(slug);

  if (!post) {
    return { title: "お知らせ" };
  }

  return {
    title: `${post.title} | お知らせ | YORISOU`,
    description: post.summary,
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = getNewsBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main>
      <section className="section">
        <div className="container" style={{ maxWidth: 860 }}>
          <p className="muted" style={{ margin: 0, fontSize: 13 }}>{post.date}</p>
          <h1 style={{ margin: "8px 0 16px", fontSize: "clamp(28px, 4vw, 40px)", lineHeight: 1.4 }}>
            {post.title}
          </h1>
          <p className="muted" style={{ margin: 0 }}>{post.summary}</p>
          <div className="card" style={{ marginTop: 22 }}>
            {post.content.map((line) => (
              <p key={line} style={{ margin: "0 0 12px" }}>{line}</p>
            ))}
          </div>
          <Link href="/news" className="btn btn-secondary" style={{ marginTop: 16 }}>
            お知らせ一覧へ戻る
          </Link>
        </div>
      </section>
    </main>
  );
}
