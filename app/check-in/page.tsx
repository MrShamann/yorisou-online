import type { Metadata } from "next";

import MiniTestFlow from "./MiniTestFlow";

export const metadata: Metadata = {
  title: "いま色テスト by よりそう | Yorisou",
  description:
    "今の動き方を、24の色と名前で見てみるテスト。120Qをもとにしています。",
};

export default function CheckInPage() {
  return <MiniTestFlow />;
}
