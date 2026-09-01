import type { Metadata } from "next";

import NotFoundBody, { NOT_FOUND_TITLE } from "@/app/_notFound/NotFoundBody";

/**
 * CORP-P4AR2 — the SECONDARY 404 entry point. See app/_notFound/NotFoundBody.tsx for why two exist.
 *
 * `app/global-not-found.tsx` handles the normal 404 path and renders outside the root layout. This
 * file exists only for the internal-error path that dynamically rendered routes take when they call
 * `notFound()`. Measured: without it, `/share/<bad-id>`, `/connect/invite/<bad-id>` and
 * `/reports/self-understanding/<bad-code>` served the ROOT layout's title — the archived consumer
 * product's marketing title — on a 404.
 *
 * It shares its body with the global document, so the two cannot say different things.
 */
export const metadata: Metadata = {
  title: NOT_FOUND_TITLE,
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return <NotFoundBody />;
}
