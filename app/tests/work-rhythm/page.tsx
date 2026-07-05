import type { Metadata } from "next";

import WorkRhythmFlow from "./WorkRhythmFlow";

export const metadata: Metadata = {
  title: "仕事のリズム診断 | Yorisou",
  description:
    "集中しやすい環境、疲れやすい関わり方、動き出しやすいペースを6問で軽く整理する入口です。適職を断定するものではありません。",
};

export default function WorkRhythmPage() {
  return <WorkRhythmFlow />;
}
