import type { Metadata } from "next";

import SavedResultView from "./SavedResultView";
import SavedTestList from "./SavedTestList";

export const metadata: Metadata = {
  title: "保存した結果 | Yorisou",
  description: "この端末に保存した Yorisou の結果を、あとで静かに見返すためのページです。",
};

export default function SavedPage() {
  return <><SavedResultView /><SavedTestList /></>;
}
