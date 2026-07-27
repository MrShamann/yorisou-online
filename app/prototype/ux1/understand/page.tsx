import Link from "next/link";

import Ux1Shell from "../_lib/Ux1Shell";
import { INTENTS, LENSES, NOT_AVAILABLE_NOTE_JA, type Lens } from "../_lib/ux1";

// Surface 2 — "知りたいこと" (intent-based entry).
//
// Entry is organised by what the person wants to understand, not by a catalog of
// methods. Every lens states its real status from the governed registry: what is
// usable today, what is Founder/Admin private pilot only, and (as an honest
// boundary, never as a teaser) what is registered but not usable.

function statusChip(lens: Lens) {
  if (lens.status === "active_public") {
    return (
      <span className="inline-flex items-center rounded-[var(--yorisou-radius-pill)] bg-[var(--yorisou-color-accent-100)] px-2.5 py-1 text-[11px] font-bold text-[#0f7d72]">
        いま使えます
      </span>
    );
  }
  if (lens.status === "active_private_pilot") {
    return (
      <span className="inline-flex items-center rounded-[var(--yorisou-radius-pill)] bg-[var(--yorisou-color-primary-100)] px-2.5 py-1 text-[11px] font-bold text-[var(--yorisou-color-primary-700)]">
        限定公開中（運営のみ）
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-[var(--yorisou-radius-pill)] border border-[var(--yorisou-color-neutral-200)] px-2.5 py-1 text-[11px] font-bold text-[var(--yorisou-color-neutral-500)]">
      まだ使えません
    </span>
  );
}

export default function Ux1UnderstandPage() {
  return (
    <Ux1Shell register="open">
      <header className="max-w-[46rem]">
        <p className="m-0 text-[12px] font-bold uppercase tracking-[0.14em] text-[var(--yorisou-color-primary-600)]">
          知りたいことから
        </p>
        <h1 className="mt-3 text-[26px] font-bold leading-[1.35] tracking-[-0.01em] text-[var(--yorisou-color-neutral-800)] md:text-[32px]">
          いま、何を知っておきたいですか。
        </h1>
        <p className="mt-3 text-[14.5px] leading-[1.85] text-[var(--yorisou-color-neutral-500)]">
          一覧から選ぶのではなく、知りたいことから入ります。どの入口も、かかる時間・受け取るもの・残り方を先に書いています。
        </p>
      </header>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {INTENTS.map((intent) => {
          const lenses = intent.lensIds
            .map((id) => LENSES.find((l) => l.id === id))
            .filter((l): l is Lens => Boolean(l));
          const anyUsable = lenses.some((l) => l.status === "active_public");
          return (
            <section
              key={intent.id}
              className="rounded-[var(--yorisou-radius-hero)] border border-[var(--yorisou-color-neutral-100)] bg-[var(--yorisou-color-surface-card)] p-5 shadow-[var(--yorisou-shadow-card)]"
            >
              <h2 className="m-0 text-[17px] font-bold leading-[1.5] text-[var(--yorisou-color-neutral-800)]">{intent.labelJa}</h2>
              <p className="m-0 mt-1 text-[13px] leading-[1.7] text-[var(--yorisou-color-neutral-500)]">{intent.subJa}</p>

              <ul className="mt-4 grid list-none gap-3 p-0">
                {lenses.map((lens) => (
                  <li
                    key={lens.id}
                    className="rounded-[var(--yorisou-radius-card)] border border-[var(--yorisou-color-neutral-100)] bg-[var(--yorisou-color-surface-bg)] p-3.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[13.5px] font-bold text-[var(--yorisou-color-neutral-800)]">{lens.nameJa}</span>
                      {statusChip(lens)}
                    </div>
                    <p className="m-0 mt-1.5 text-[12.5px] leading-[1.7] text-[var(--yorisou-color-neutral-500)]">{lens.looksAtJa}</p>
                    <dl className="m-0 mt-2.5 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[11.5px] leading-[1.6]">
                      <dt className="m-0 font-semibold text-[var(--yorisou-color-neutral-800)]">受け取るもの</dt>
                      <dd className="m-0 text-[var(--yorisou-color-neutral-500)]">{lens.producesJa}</dd>
                      <dt className="m-0 font-semibold text-[var(--yorisou-color-neutral-800)]">目安</dt>
                      <dd className="m-0 text-[var(--yorisou-color-neutral-500)]">
                        {lens.minutes ? `約${lens.minutes}分` : "時間はまちまちです"}
                        {lens.loginRequired ? " ／ ログインが必要です" : " ／ ログインなしで始められます"}
                      </dd>
                      <dt className="m-0 font-semibold text-[var(--yorisou-color-neutral-800)]">残り方</dt>
                      <dd className="m-0 text-[var(--yorisou-color-neutral-500)]">
                        {lens.privateByDefault ? "最初は残りません。残すかどうかはあとで選べます。" : "—"}
                      </dd>
                    </dl>
                  </li>
                ))}
              </ul>

              <div className="mt-4">
                {anyUsable ? (
                  <Link
                    href="/prototype/ux1/result"
                    className="inline-flex min-h-[46px] items-center rounded-[var(--yorisou-radius-pill)] bg-[var(--yorisou-color-primary-500)] px-5 text-[13.5px] font-bold text-white no-underline transition hover:bg-[var(--yorisou-color-primary-600)]"
                  >
                    ここから始める
                  </Link>
                ) : (
                  <p className="m-0 text-[12px] leading-[1.7] text-[var(--yorisou-color-neutral-500)]">
                    この入口はいま運営のみが使えます。一般公開はまだしていません。
                  </p>
                )}
              </div>
            </section>
          );
        })}
      </div>

      {/* Honest boundary — never a teaser. */}
      <section className="mt-8 rounded-[var(--yorisou-radius-card)] border border-dashed border-[var(--yorisou-color-neutral-200)] p-5">
        <h2 className="m-0 text-[13.5px] font-bold text-[var(--yorisou-color-neutral-800)]">ここに出していないもの</h2>
        <p className="m-0 mt-2 max-w-[52rem] text-[12.5px] leading-[1.8] text-[var(--yorisou-color-neutral-500)]">{NOT_AVAILABLE_NOTE_JA}</p>
      </section>
    </Ux1Shell>
  );
}
