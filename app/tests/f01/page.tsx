import type { Metadata } from "next";

import { RuleBasedTestFlow } from "../_components/SpecAssessmentFlow";
import { f01Runtime } from "@/lib/yorisou-tests/f01";

export const metadata: Metadata = {
  title: "向いている働き方診断 | Yorisou",
  description: "進みやすい働き方や集中しやすい条件を見つめる公開診断です。",
};

export default function F01Page() {
  return <RuleBasedTestFlow runtime={f01Runtime} />;
}
