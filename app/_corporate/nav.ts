/**
 * CORP-P5 — the corporate information architecture, in one place.
 *
 * HOME is the company narrative. PROJECTS are the real things being built under YORISOU LLC, each
 * with its own route. COMPANY carries identity and the approach. CONTACT is the way in.
 *
 * `/company` and `/contact` remain crawl-blocked and carry designed pending states while
 * COMPANY_REGISTRATION_SOURCE_REQUIRED and VERIFIED_CORPORATE_CONTACT_REQUIRED are open. They are in
 * the navigation on purpose: hiding them would misrepresent the site as complete.
 */
export type NavItem = { href: string; label: string };

export const CORPORATE_NAV: readonly NavItem[] = [
  { href: "/mirai-move", label: "Mirai Move" },
  { href: "/kakari", label: "Kakari" },
  { href: "/about", label: "私たちについて" },
  { href: "/company", label: "会社情報" },
  { href: "/contact", label: "お問い合わせ" },
];

export const ROUTES = {
  home: "/",
  miraiMove: "/mirai-move",
  kakari: "/kakari",
  about: "/about",
  company: "/company",
  contact: "/contact",
} as const;
