import type { Metadata } from "next";

import C02SavedResultView from "./view";

export const metadata: Metadata = { title: "保存したC02結果 | Yorisou" };

export default async function C02SavedResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <C02SavedResultView id={id} />;
}
