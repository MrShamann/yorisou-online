import type { Metadata } from "next";

import LocalLifeFlow from "./LocalLifeFlow";

export const metadata: Metadata = {
  title: "暮らしの困りごとチェック | Yorisou",
  description:
    "移動、買い物や通院、家族を支える負担、地域とのつながりを、関心の入口として軽く整理するチェックです。サービス提供の約束ではありません。",
};

export default function LocalLifePage() {
  return <LocalLifeFlow />;
}
