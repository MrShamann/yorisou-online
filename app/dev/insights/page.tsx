import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";

import { readInsightDrafts, updateInsightDraftReviewState } from "@/lib/insights/storage";

type SearchParams = Promise<{
  status?: string;
  category?: string;
  source?: string;
}>;

async function setDraftState(formData: FormData) {
  "use server";

  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  const id = String(formData.get("id") || "");
  const action = String(formData.get("action") || "");

  if (!id || !action) {
    return;
  }

  if (action === "approve") {
    await updateInsightDraftReviewState(id, { reviewStatus: "approved" });
  } else if (action === "reject") {
    await updateInsightDraftReviewState(id, { reviewStatus: "rejected", approvedForPublic: false });
  } else if (action === "draft") {
    await updateInsightDraftReviewState(id, { reviewStatus: "draft", approvedForPublic: false });
  } else if (action === "publish") {
    await updateInsightDraftReviewState(id, { reviewStatus: "approved", approvedForPublic: true });
  } else if (action === "unpublish") {
    await updateInsightDraftReviewState(id, { approvedForPublic: false });
  }

  revalidatePath("/dev/insights");
  revalidatePath("/insights");
  revalidatePath("/en/insights");
}

export default async function DevInsightsPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  const params = (await searchParams) || {};
  const drafts = await readInsightDrafts();
  const filtered = drafts.filter((item) => {
    const statusMatch = !params.status || item.reviewStatus === params.status;
    const categoryMatch = !params.category || item.category === params.category;
    const sourceMatch = !params.source || item.sourceName === params.source;
    return statusMatch && categoryMatch && sourceMatch;
  });

  const sources = [...new Set(drafts.map((item) => item.sourceName))];
  const categories = [...new Set(drafts.map((item) => item.category))];

  return (
    <main className="min-h-screen bg-[#F5F1E8] px-6 py-12 text-[#3B2F2F] md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <div className="text-sm tracking-[0.18em] text-[#8A7764]">DEV REVIEW</div>
          <h1 className="mt-3 text-4xl font-light">Insights Draft Review</h1>
          <p className="mt-4 text-sm leading-7 text-[#5A4B3E]">
            Real ingested news is stored here as draft analysis first. Only approved and public-marked items can appear on the public insights pages.
          </p>
        </div>

        <div className="mb-8 rounded-[1.75rem] border border-[#D6C3A3]/35 bg-white/80 p-6 shadow-sm">
          <div className="text-sm tracking-[0.18em] text-[#8A7764]">Filters</div>
          <div className="mt-4 flex flex-wrap gap-3">
            <FilterLink href="/dev/insights" active={!params.status}>
              All statuses
            </FilterLink>
            <FilterLink href="/dev/insights?status=draft" active={params.status === "draft"}>
              Draft
            </FilterLink>
            <FilterLink href="/dev/insights?status=approved" active={params.status === "approved"}>
              Approved
            </FilterLink>
            <FilterLink href="/dev/insights?status=rejected" active={params.status === "rejected"}>
              Rejected
            </FilterLink>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            {categories.map((category) => (
              <FilterLink
                key={category}
                href={`/dev/insights?category=${category}`}
                active={params.category === category}
              >
                {category}
              </FilterLink>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            {sources.map((source) => (
              <FilterLink
                key={source}
                href={`/dev/insights?source=${encodeURIComponent(source)}`}
                active={params.source === source}
              >
                {source}
              </FilterLink>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {filtered.length === 0 ? (
            <div className="rounded-[1.75rem] border border-[#D6C3A3]/35 bg-white p-6 shadow-sm">No draft items found.</div>
          ) : (
            filtered.map((item) => (
              <article key={item.id} className="rounded-[1.75rem] border border-[#D6C3A3]/35 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap gap-2 text-xs tracking-[0.12em] text-[#8A7764]">
                      <span>{item.sourceName}</span>
                      <span>{item.publishedAt}</span>
                      <span>{item.category}</span>
                    </div>
                    <h2 className="mt-3 text-2xl font-light">{item.rawTitle}</h2>
                    <p className="mt-3 text-sm leading-7 text-[#5A4B3E]">{item.content.ja.summary}</p>
                  </div>
                  <div className="flex flex-col gap-2 text-sm text-[#5A4B3E]">
                    <span>Status: {item.reviewStatus}</span>
                    <span>Public: {item.approvedForPublic ? "yes" : "no"}</span>
                  </div>
                </div>

                <div className="mt-5 grid gap-5 lg:grid-cols-2">
                  <div className="rounded-2xl bg-[#FCFAF6] p-4">
                    <div className="text-xs tracking-[0.18em] text-[#8A7764]">WHY IT MATTERS</div>
                    <p className="mt-3 text-sm leading-7 text-[#5A4B3E]">{item.content.ja.whyItMatters}</p>
                  </div>
                  <div className="rounded-2xl bg-[#FCFAF6] p-4">
                    <div className="text-xs tracking-[0.18em] text-[#8A7764]">YORISOU VIEW</div>
                    <ul className="mt-3 space-y-2 text-sm leading-7 text-[#5A4B3E]">
                      {item.content.ja.yorisouView.map((view) => (
                        <li key={view}>{view}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-[#F7F2E9] px-3 py-1 text-xs text-[#6B5A4A]">
                      #{tag}
                    </span>
                  ))}
                </div>

                <form action={setDraftState} className="mt-6 flex flex-wrap gap-3">
                  <input type="hidden" name="id" value={item.id} />
                  <ActionButton label="Approve" action="approve" />
                  <ActionButton label="Reject" action="reject" />
                  <ActionButton label="Back to Draft" action="draft" />
                  <ActionButton label="Mark Public" action="publish" />
                  <ActionButton label="Unpublish" action="unpublish" />
                </form>
              </article>
            ))
          )}
        </div>
      </div>
    </main>
  );
}

function ActionButton({ label, action }: { label: string; action: string }) {
  return (
    <button
      type="submit"
      name="action"
      value={action}
      className="rounded-full border border-[#D6C3A3]/45 bg-[#FCFAF6] px-4 py-2 text-sm text-[#5A4B3E] transition hover:bg-white"
    >
      {label}
    </button>
  );
}

function FilterLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className={`rounded-full border px-4 py-2 text-sm transition ${
        active ? "border-[#6B5A4A] bg-[#6B5A4A] text-white" : "border-[#D6C3A3]/45 bg-[#FCFAF6] text-[#5A4B3E]"
      }`}
    >
      {children}
    </a>
  );
}
