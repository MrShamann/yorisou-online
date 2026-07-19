import type { Metadata } from "next";

import SavedResultView from "./SavedResultView";
import SavedTestList from "./SavedTestList";

export const metadata: Metadata = {
  title: "残す・戻る | YORISOU 保存した結果",
  description: "この端末やアカウントに保存した結果を、あとで静かに見返すためのページです。保存はデバイス内の簡易保存で、いつでも見返し・削除できます。",
};

export default function SavedPage() {
  return (
    <main className="aix2">
      <SavedResultView />
      <SavedTestList />
    </main>
  );
}
