import type { Metadata } from "next";

import LineRecoveryView from "./LineRecoveryView";

export const metadata: Metadata = {
  title: "LINE連携の再開 | YORISOU",
  description: "LINE連携が完了しなかったときの、安全な再開の入口。連携は任意で、この端末の記録はそのまま残ります。",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

// Only a small, known set of outcome codes is honored; anything else falls back
// to the neutral message. The `retry` path is validated to a same-site relative
// route so this surface can never be used as an open redirect.
const KNOWN_CODES = new Set([
  "cancelled",
  "invalid_signature",
  "state_mismatch",
  "nonce_mismatch",
  "expired",
  "replay",
  "missing_consent",
  "malformed",
]);

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function safeRetryHref(raw: string | undefined): string {
  if (typeof raw !== "string") return "/api/line/auth/start";
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.includes("\\") || raw.includes("://")) {
    return "/api/line/auth/start";
  }
  return raw;
}

export default async function LineRecoveryPage({ searchParams }: { searchParams?: SearchParams }) {
  const params = (await searchParams) || {};
  const rawCode = firstValue(params.code) ?? "";
  const code = KNOWN_CODES.has(rawCode) ? rawCode : "malformed";
  const retryHref = safeRetryHref(firstValue(params.retry));

  return <LineRecoveryView code={code} retryHref={retryHref} />;
}
