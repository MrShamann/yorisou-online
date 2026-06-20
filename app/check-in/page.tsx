import type { Metadata } from "next";

import MiniTestFlow from "./MiniTestFlow";

export const metadata: Metadata = {
  title: "チェックインをはじめる | Yorisou",
  description:
    "24問の今の状態チェックから、今のあなたに近い無料結果を受け取る Yorisou のチェックインページです。",
};

export default function CheckInPage() {
  return <MiniTestFlow />;
}
