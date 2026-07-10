import type { Metadata } from "next";
import SavedTestResultView from "./view";
export const metadata: Metadata = { title: "保存した結果 | Yorisou" };
export default async function SavedTestResultPage({ params }: { params: Promise<{ id: string }> }) { return <SavedTestResultView id={(await params).id} />; }
