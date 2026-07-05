import type { Metadata } from "next";

import NameImpressionFlow from "./NameImpressionFlow";

export const metadata: Metadata = {
  title: "名前の印象チェック | Yorisou",
  description:
    "名前から受ける印象をきっかけに、今の自分らしさの見え方を5問で軽く整理する入口です。運命や相性を占うものではありません。",
};

export default function NameImpressionPage() {
  return <NameImpressionFlow />;
}
