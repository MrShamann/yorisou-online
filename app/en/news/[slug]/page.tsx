import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getNewsBySlug, getSortedNews } from "../../../content/news";

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
    return { title: "News" };
  }

  return {
    title: `${post.title.en} | News | YORISOU`,
    description: post.summary.en,
  };
}

export default async function NewsDetailPageEn({ params }: Props) {
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
          <h1 style={{ margin: "8px 0 16px", fontSize: "clamp(28px, 4vw, 40px)", lineHeight: 1.4 }}>{post.title.en}</h1>
          <p className="muted" style={{ margin: 0 }}>{post.summary.en}</p>
          <div className="card" style={{ marginTop: 22 }}>
            {post.content.en.map((line) => (
              <p key={line} style={{ margin: "0 0 12px" }}>{line}</p>
            ))}
          </div>
          <Link href="/en/news" className="btn btn-secondary" style={{ marginTop: 16 }}>
            Back to News
          </Link>
        </div>
      </section>
    </main>
  );
}
