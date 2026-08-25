import type { Metadata } from "next";

import HomeView from "./_views/HomeView";
import { PROTOTYPE_ROUTES } from "./_content/site";

export const metadata: Metadata = {
  title: "Yorisou — 人と社会のあいだに、次のよりそいをつくる。",
  description:
    "Yorisouは、暮らし・仕事・地域にある複雑さを見つめ、人が理解し、選び、前に進めるプロダクトをつくる会社です。",
  robots: { index: false, follow: false },
};

/** Evidence-comparison surface. Same view as the final-route candidate, prototype URLs. */
export default function CorporatePrototypeHome() {
  return <HomeView routes={PROTOTYPE_ROUTES} />;
}
