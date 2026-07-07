import type { Metadata } from "next";

import LocalLifeFlow from "./LocalLifeFlow";

export const metadata: Metadata = {
  title: "暮らしの関心チェック | Yorisou",
  description:
    "暮らし方や身近な関心を、次に見たい入口として軽く整理するチェックです。サービス提供の約束ではありません。",
};

export default function LocalLifePage() {
  return <LocalLifeFlow />;
}
