import type { Metadata } from "next";

import HomeView from "@/app/prototype/corporate/_views/HomeView";
import { FINAL_ROUTES } from "@/app/prototype/corporate/_content/site";

/**
 * CORP-P4A — final-route candidate. LOCAL ONLY: this branch is never pushed and never deployed.
 * The page is a thin wrapper: the accepted CORP-P3R1 view is rendered with the final URL set, so
 * there is exactly one corporate implementation and `/prototype/corporate/**` stays available for
 * evidence comparison.
 */
export const metadata: Metadata = {
  title: "Yorisou — 人と社会のあいだに、次のよりそいをつくる。",
  description: "Yorisouは、暮らし・仕事・地域にある複雑さを見つめ、人が理解し、選び、前に進めるプロダクトをつくる会社です。",
};

export default function CorporateHome() {
  return <HomeView routes={FINAL_ROUTES} />;
}
