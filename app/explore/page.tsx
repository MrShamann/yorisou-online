import type { Metadata } from "next";

import ExploreRecommendations from "./ExploreRecommendations";

export const metadata: Metadata = {
  title: "探す | Yorisou",
  description: "今の自分に合いそうなものを、時間や深さから探せます。",
};

// 探す — discovery, not a catalogue.
//
// The list itself is a client island because whether anything here can honestly be called personal
// depends on device-local history. The server renders the same frame for everyone; the island adds
// the reason, or admits there isn't one. Nothing above the list claims to know the reader.
export default function ExplorePage() {
  return (
    <main className="mx-auto w-full max-w-[var(--pxr-content-width)] px-5 pb-28 pt-8 md:pt-14">
      <h1 className="text-[26px] font-semibold leading-[1.45] tracking-[-0.01em] text-[var(--pxr-text-primary)]">
        探す
      </h1>
      <p className="mt-2 text-[15px] leading-[var(--pxr-leading-body)] text-[var(--pxr-text-secondary)]">
        時間と深さから、次にできそうなものを。
      </p>

      <ExploreRecommendations />
    </main>
  );
}
