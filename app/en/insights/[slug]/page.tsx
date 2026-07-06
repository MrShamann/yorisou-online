import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return [];
}

export const dynamicParams = false;

export default function InsightDetailPageEn() {
  notFound();
}
