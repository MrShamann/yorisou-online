import type { Metadata } from "next";

import StartRouter from "./StartRouter";

// SR-1 — the primary start experience (/start). A deterministic, anonymous-first
// service router: it begins from an ORDINARY need (not a test name), asks one
// minimal pace signal, and routes to a real, working destination — explaining
// why, how long, what you receive, that data stays on the device, and that login
// is optional. No login is ever required to reach a real destination.

export const metadata: Metadata = {
  title: "始める | Yorisou",
  description:
    "今の必要から始めましょう。ふだんの言葉で選ぶと、理由つきの入口へご案内します。無料・ログインなし、この端末だけで完結します。",
};

export default function StartPage() {
  return <StartRouter />;
}
