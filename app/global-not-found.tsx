import type { Metadata } from "next";
import { Inter, Noto_Sans_JP } from "next/font/google";

import NotFoundBody, { NOT_FOUND_TITLE } from "@/app/_notFound/NotFoundBody";

import "./globals.css";

/**
 * CORP-P4AR2 — the single 404 document. LOCAL CANDIDATE ONLY.
 *
 * WHY THIS FILE REPLACES `app/not-found.tsx`.
 *
 * CORP-P4AR1 decided shell ownership from the pathname: `shellOwner()` asked whether a path LOOKED
 * like a route it knew. That inference is invalid, because whether a route resolves is decided by
 * the route handler at request time, not by the shape of the URL. `/insights/does-not-exist` matches
 * the `/insights/[slug]` pattern, so the policy answered CONSUMER, but the page calls `notFound()`.
 * Measured on the production build at 29fce73, that path served TWO headers, TWO footers and FOUR
 * navs: the consumer chrome from the root layout wrapping the corporate 404 inside it. The prior
 * claim that "every unknown path is clean" was false — it held only for paths that matched no
 * dynamic pattern.
 *
 * `global-not-found.tsx` is the framework's own answer. Next.js renders it INSTEAD OF the root
 * layout — it owns `<html>` and `<body>` itself — so no layout, and therefore no `AppShell`, can
 * wrap a 404. Shell isolation stops being a policy decision that pathname logic could get wrong and
 * becomes a structural property of where the file sits. A 404 has no consumer chrome because there
 * is no code path by which it could acquire any.
 *
 * CORP-P4AR2R1 CORRECTION. An earlier version of this comment claimed that rendering as its own
 * document also fixed the blank 404 on `/share/[publicId]`, `/connect/invite/[publicId]` and
 * `/reports/self-understanding/[publicCode]`. IT DID NOT, and the CORP-P4AR2 verdict that shipped
 * alongside that claim was withdrawn.
 *
 * Those routes — and `/connect/pair/[pairId]`, which CORP-P4AR2 never tested — still serve
 * `<html id="__next_error__">` with an EMPTY body. This file cannot fix them. In Next.js 16.2.10 a
 * `notFound()` raised during a DYNAMIC render is served by `getErrorRSCPayload`, which emits an
 * empty seed document and defers the 404 UI to the client; the branch that server-renders a
 * not-found boundary exists only on the prerender path, under `experimental.cacheComponents`.
 * Reproduced in a minimal stock Next.js app containing none of this repository's code.
 *
 * Worse, after hydration those routes render the 404 INSIDE the root layout, so `AppShell` mounts
 * around it and the page carries two headers and two footers — the very defect this file was
 * introduced to remove, still present where the server never renders.
 *
 * See docs/yorisou/corporate/CORP_P4AR2R1_DYNAMIC_404_FRAMEWORK_BLOCK.md. Do not re-state this file
 * as a complete 404 solution until that document's contract tests pass.
 *
 * REJECTED ALTERNATIVES.
 *
 *  1. Another pathname exception list (e.g. "treat a dynamic segment as unresolved unless the id
 *     validates"). Rejected on principle: it is the same invalid inference that produced the defect,
 *     one level more detailed. The shell would still be guessing what the route handler will decide,
 *     and every new dynamic route would need a matching guess.
 *  2. Route groups — move all 117 consumer routes into `app/(consumer)/` so the shell lives in a
 *     group layout and the root layout stays bare. Architecturally correct and fully stable, but it
 *     relocates every consumer route directory in the repository for a 404 fix, and this package is
 *     explicitly forbidden from restructuring consumer routes. Reconsider under CORP-P4B, where the
 *     route transition is the actual subject.
 *  3. Hiding the consumer chrome with CSS on 404, or removing it from the DOM after hydration.
 *     Rejected: both leave the consumer chrome in the server-rendered HTML, so the markup a crawler
 *     reads still contains it. That is concealment, not isolation.
 *  4. Reading the response status in the root layout to decide the shell. Not available — a layout
 *     renders above the boundary that sets the 404 status and cannot observe it.
 *
 * COST, RECORDED HONESTLY. `global-not-found` is gated behind `experimental.globalNotFound` in
 * Next.js 16.2.10 (see `next.config.ts`). It is a supported App Router convention in this exact
 * installed version — `FILE_TYPES` in the app loader lists it — but it is opt-in and may change
 * before it stabilises. It is accepted here because this branch is a local Preview that is never
 * pushed or deployed, and because the alternative that does not depend on the flag (2) is out of
 * scope for this package. CORP-P4B must re-confirm the flag before any publication decision.
 *
 * Because this file owns the document, it must restate what the root layout would have provided:
 * the two font variables and `globals.css`. It deliberately does NOT restate the locale cookie or
 * the release marker — a 404 has no session and no release surface to expose.
 */

const notoSansJp = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-jp",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: NOT_FOUND_TITLE,
  robots: { index: false, follow: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="ja" className={`${notoSansJp.variable} ${inter.variable}`}>
      <body>
        <NotFoundBody />
      </body>
    </html>
  );
}
