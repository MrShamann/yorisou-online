import { notFound } from "next/navigation";

import { readAdvisorEntries } from "@/lib/yorisouAdvisorStorage";

export default async function DevAiAdvisorEntriesPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  const entries = await readAdvisorEntries();

  return (
    <main className="min-h-screen bg-[#F5F1E8] px-6 py-12 text-[#3B2F2F] md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <div className="text-sm tracking-[0.18em] text-[#8A7764]">DEV VIEW</div>
          <h1 className="mt-3 text-4xl font-light">AI Advisor Entries</h1>
          <p className="mt-4 text-sm leading-7 text-[#5A4B3E]">
            Local development view of saved advisor leads and structured answers.
          </p>
        </div>

        <div className="space-y-6">
          {entries.length === 0 ? (
            <div className="rounded-[1.75rem] border border-[#D6C3A3]/35 bg-white p-6 shadow-sm">
              No entries saved yet.
            </div>
          ) : (
            entries.map((entry) => (
              <article key={entry.id} className="rounded-[1.75rem] border border-[#D6C3A3]/35 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-2 text-sm text-[#8A7764] md:flex-row md:items-center md:justify-between">
                  <span>{entry.createdAt}</span>
                  <span>{entry.id}</span>
                </div>
                <h2 className="mt-4 text-2xl font-light">{entry.lead.name}</h2>
                <p className="mt-2 text-sm leading-7 text-[#5A4B3E]">
                  {entry.lead.city} · {entry.lead.phone} · {entry.lead.email}
                </p>
                <div className="mt-4 rounded-2xl bg-[#FCFAF6] p-4 text-sm leading-7 text-[#5A4B3E]">
                  <strong>Recommended:</strong> {entry.recommendation.recommendedCategory}
                  <br />
                  <strong>Secondary:</strong> {entry.recommendation.secondaryRecommendation}
                  <br />
                  <strong>Test ride:</strong> {entry.lead.interestedInTestRide}
                  <br />
                  <strong>Contact:</strong> {entry.lead.preferredContactMethod}
                </div>
                <pre className="mt-4 overflow-x-auto rounded-2xl bg-[#2D2623] p-4 text-xs leading-6 text-[#F8F4EC]">
                  {JSON.stringify(entry, null, 2)}
                </pre>
              </article>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
