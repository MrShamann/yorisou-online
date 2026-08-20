import Link from "next/link";

import { composeYorisouMe } from "@/lib/server/me/composition";
import { ME_COMPOSITION_PARTS, type MeCompositionPart, type MePart } from "@/lib/platform/meComposition";

// ARCH-P7 — わたし, as the five-part composition the reference architecture describes.
//
// §4: Me "shows, SEPARATELY: current state · Imairo · user-confirmed durable context · Yorisou
// observations/patterns · user-confirmed values". Separately is the design. One blended portrait
// would be an identity claim, and this product does not make those — Imairo's own contract calls
// its result a Recognition Moment rather than a declaration about who someone is.
//
// EACH ROW NAMES A PART AND POINTS AT IT. It does not restate what the part contains. That is not
// minimalism for its own sake: repeating a person's own sentences here would make わたし a second
// copy of records that already live somewhere with their own controls, and the surface that owns a
// record is the surface where it can be corrected or deleted.
//
// NO COUNTS. No "3 memories", no completeness meter, no "2 of 5 complete". A screen that scores how
// filled-in a person is can make them feel behind on themselves, which is the opposite of what
// わたし is for.

const LABELS: Record<MeCompositionPart, string> = {
  current_state: "いまの状態",
  assessment_recognition: "Imairo",
  confirmed_durable_context: "覚えていること",
  observations: "気づいたこと",
  confirmed_values: "いま大事にしたいこと",
};

/** Where the part lives. The composition points; the owning surface holds. */
const HREF: Record<MeCompositionPart, string> = {
  current_state: "/today/check-in",
  assessment_recognition: "/tests/ima-iro",
  confirmed_durable_context: "/life/memories",
  observations: "",
  confirmed_values: "/tests/yorisou-values",
};

/** What each state says. `absent` and `not_ready` are different sentences on purpose. */
function line(part: MePart): { text: string; action: string | null } {
  switch (part.state) {
    case "present":
      return { text: "残っています。", action: "ひらく" };
    case "absent":
      return { text: "まだありません。", action: "はじめる" };
    case "deferred":
      // Honest silence. Pattern observation is a later capability; saying "まだありません" here would
      // tell someone there is nothing to see, when the truth is that this product does not yet look.
      return { text: "いまはまだ、見ていません。", action: null };
    case "not_ready":
      // Never "you have none" during an outage.
      return { text: "いまは読み込めませんでした。", action: null };
  }
}

const HEADING = "text-[13px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]";
const ROW =
  "flex items-baseline justify-between gap-4 border-b border-[var(--pxr-border-subtle)] py-4 last:border-b-0";

export default async function MeComposition({ accountId }: { accountId: string }) {
  // One failing module must not blank the picture — the service turns a failed read into that
  // part's own `not_ready`, so the rest still renders.
  const composition = await composeYorisouMe(accountId).catch(() => null);
  if (!composition) return null;

  const byPart = new Map(composition.parts.map((part) => [part.part, part]));

  return (
    <section className="mt-10">
      <h2 className={HEADING}>いまの、わたし</h2>
      <div className="mt-2">
        {ME_COMPOSITION_PARTS.map((id) => {
          const part = byPart.get(id);
          if (!part) return null;
          const { text, action } = line(part);
          const href = HREF[id];
          return (
            <div key={id} className={ROW}>
              <div>
                <p className="text-[15px] font-medium leading-[1.6] text-[var(--pxr-text-primary)]">
                  {LABELS[id]}
                </p>
                <p className="mt-1 text-[13.5px] leading-[1.85] text-[var(--pxr-text-secondary)]">{text}</p>
              </div>
              {action && href ? (
                <Link
                  href={href}
                  className="shrink-0 text-[14px] font-medium text-[var(--pxr-accent)]"
                >
                  {action}
                </Link>
              ) : null}
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-[12.5px] leading-[1.9] text-[var(--pxr-text-muted)]">
        ここは、それぞれの場所にあるものを並べているだけです。書き直したり消したりは、それぞれの場所からできます。
      </p>
    </section>
  );
}
