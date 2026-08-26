import type { Metadata } from "next";

import Shell from "@/app/_corporate/Shell";
import HomeView from "@/app/_corporate/HomeView";

/** CORP-P5 — YORISOU LLC corporate route. PREVIEW ONLY; this branch is never deployed to Production. */
export const metadata: Metadata = {
  title: "Yorisou — 人と社会のあいだに、次のよりそいをつくる。",
  description: "Yorisouは、暮らし・仕事・地域にある複雑さを見つめ、人が理解し、選び、前に進めるプロダクトをつくる会社です。Mirai Move と Kakari を開発しています。",
  openGraph: { title: "Yorisou — 人と社会のあいだに、次のよりそいをつくる。", description: "Yorisouは、暮らし・仕事・地域にある複雑さを見つめ、人が理解し、選び、前に進めるプロダクトをつくる会社です。Mirai Move と Kakari を開発しています。", type: "website", locale: "ja_JP", siteName: "Yorisou" },
};

export default function Page() {
  return (
    <Shell current="/">
      <HomeView />
    </Shell>
  );
}
