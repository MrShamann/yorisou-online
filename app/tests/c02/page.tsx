import type { Metadata } from "next";

import { RuleBasedTestFlow } from "../_components/SpecAssessmentFlow";
import { c02Runtime } from "@/lib/yorisou-tests/c02";

export const metadata: Metadata = {
  title: "今のわたしチェック | Yorisou",
  description: "今の内側の温度や人との距離感をやさしく整理する公開チェックです。",
};

export default function C02Page() {
  return <RuleBasedTestFlow runtime={c02Runtime} />;
}
