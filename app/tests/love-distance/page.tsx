import type { Metadata } from "next";

import LoveDistanceFlow from "./LoveDistanceFlow";

export const metadata: Metadata = {
  title: "恋愛距離感チェック | Yorisou",
  description:
    "近づきたい、待っている、伝えたい。今の自分の距離感を18問で小さく整理するチェックです。ログインなし、無料結果あり。相手の気持ちや関係の結論を判断するものではありません。",
};

export default function LoveDistancePage() {
  return <LoveDistanceFlow />;
}
