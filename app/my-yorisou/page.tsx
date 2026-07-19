import type { Metadata } from "next";

import MyYorisouView from "./MyYorisouView";

// SR-1 — Personal Support Home (マイよりそう). The continuing centre of the
// product: a device-local service hub that works anonymously and shows only
// truthful, available device-local information. Not a marketing page.

export const metadata: Metadata = {
  title: "マイよりそう | Yorisou",
  description:
    "この端末で続けられる、あなたの支援ホーム。ログインなしで、今の状態・次の一歩・保存したものを、あなたのペースで見返せます。記録はこの端末だけに残り、いつでも削除できます。",
};

export default function MyYorisouPage() {
  return <MyYorisouView />;
}
