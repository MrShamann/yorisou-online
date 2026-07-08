import type { Metadata } from "next";

import { OmikujiFlow } from "../_components/SpecAssessmentFlow";
import { s01Runtime } from "@/lib/yorisou-tests/s01";

export const metadata: Metadata = {
  title: "今日のおみくじ | Yorisou",
  description: "今日の気分に合わせて軽いヒントをひとつ受け取る公開おみくじです。",
};

export default function S01Page() {
  return <OmikujiFlow runtime={s01Runtime} />;
}
