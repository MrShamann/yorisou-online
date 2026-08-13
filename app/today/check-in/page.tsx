import type { Metadata } from "next";

import CurrentStateCheckIn from "./CurrentStateCheckIn";

export const metadata: Metadata = {
  title: "今の気配を見る | Yorisou",
  description: "1〜2分で、いまの状態を短い言葉に。診断ではありません。",
};

// ROUTE NOTE. This deliberately does not live at `/check-in`. That path has already meant two
// different products in this codebase's life, and every shared link, saved link and LINE return
// pointing at it was created with the 120Q in mind. Reusing it would keep the URL alive while
// swapping the product underneath — a semantic break, and a worse one than a 404 because nothing
// warns the person. `/check-in` therefore keeps redirecting to the Deep Dive.
export default function TodayCheckInPage() {
  return (
    <main className="mx-auto w-full max-w-[var(--pxr-content-width)] px-5 pb-28 pt-10">
      <CurrentStateCheckIn />
    </main>
  );
}
