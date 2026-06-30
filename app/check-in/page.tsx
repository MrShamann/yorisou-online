import type { Metadata } from "next";

import MiniTestFlow from "./MiniTestFlow";

export const metadata: Metadata = {
  title: "チェックインをはじめる | Yorisou",
  description:
    "120問の今の状態チェックから、今のあなたに近い結果準備状態へ進む Yorisou のチェックインページです。",
};

export default function CheckInPage() {
  return <MiniTestFlow />;
}
