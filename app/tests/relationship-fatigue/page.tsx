import type { Metadata } from "next";

import RelationshipFatigueFlow from "./RelationshipFatigueFlow";

export const metadata: Metadata = {
  title: "人間関係の疲れチェック | Yorisou",
  description:
    "会う・返す・合わせる。今どこに負担が出ているかを24問で小さく整理するチェックです。ログインなし、無料結果あり。医療・心理診断ではありません。",
};

export default function RelationshipFatiguePage() {
  return <RelationshipFatigueFlow />;
}
