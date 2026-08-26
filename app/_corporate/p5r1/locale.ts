import {
  HEADING_UNITS,
  HERO_LEAD_UNITS,
  KAKARI,
  KAKARI_PROCEDURE,
  METHODS,
  MIRAI_MOVE,
  MIRAI_NETWORK,
  PROBLEM_BEATS,
  THESIS_UNITS,
} from "@/app/prototype/corporate/_content/site";

/**
 * CORP-P5R1-AMD — the corporate homepage in Japanese and English.
 *
 * JAPANESE IS CANONICAL AND DEFAULT. Every `ja` value below is read from the approved CORP-P5
 * content source; none of it is retyped here. English is an ADAPTED SIBLING, written as natural
 * international corporate English rather than a sentence-by-sentence translation — but it may not
 * strengthen any claim. No English string introduces a customer, partner, metric, traction,
 * ownership, market-position or maturity claim that the Japanese does not already make.
 *
 * Where natural English required a judgement call rather than a direct rendering, it is recorded in
 * docs/yorisou/corporate/CORP_P5R1_MULTILINGUAL_REPORT.md rather than changed silently.
 */
export type Locale = "ja" | "en";

export const SUPPORTED: readonly Locale[] = ["ja", "en"];
export const DEFAULT_LOCALE: Locale = "ja";

/** Only `en` switches away from Japanese; anything else falls back to the default. */
export function resolveLocale(raw: string | string[] | undefined): Locale {
  const v = Array.isArray(raw) ? raw[0] : raw;
  return v === "en" ? "en" : DEFAULT_LOCALE;
}

/** The homepage keeps one URL in this Preview; locale routing (`/`, `/en`) is deferred to P6. */
export function homeHref(l: Locale) {
  return l === "en" ? "/?lang=en" : "/";
}

type Beat = { no: string; title: string; body: string };

export type Copy = {
  htmlLang: string;
  skip: string;
  menu: string;
  menuToggle: string;
  navLabel: string;
  navLabelMobile: string;
  langLabel: string;
  eyebrowCorporate: string;
  thesisUnits: readonly string[];
  leadLines: readonly (readonly string[])[];
  humanSide: string;
  humanItems: readonly string[];
  systemSide: string;
  systemItems: readonly string[];
  fieldCaption: string;
  fieldRelation: string;
  eyebrowProblem: string;
  headingProblem: readonly string[];
  problems: readonly Beat[];
  eyebrowProjects: string;
  headingProjects: readonly string[];
  miraiName: string;
  miraiStage: string;
  miraiLine: readonly string[];
  miraiParties: readonly Beat[];
  miraiCentre: string;
  miraiBoundaryTitle: string;
  miraiBoundary: string;
  kakariName: string;
  kakariStage: string;
  kakariLine: readonly string[];
  kakariSteps: readonly Beat[];
  kakariBoundaryTitle: string;
  kakariBoundary: string;
  more: (n: string) => string;
  eyebrowApproach: string;
  headingApproach: readonly string[];
  methods: readonly Beat[];
  methodsLong: readonly { no: string; title: string; long: string }[];
  discloseMethods: string;
  eyebrowCompany: string;
  headingCompany: readonly string[];
  companyBody: string;
  aboutLink: string;
  navItems: readonly { href: string; label: string }[];
  footProjects: string;
  footCompany: string;
  footAbout: string;
  footCompanyInfo: string;
  footContact: string;
  previewBadge: string;
  pendingNote: string;
};

const JA: Copy = {
  htmlLang: "ja",
  skip: "本文へスキップ",
  menu: "メニュー",
  menuToggle: "メニューを開閉する",
  navLabel: "サイト内ナビゲーション",
  navLabelMobile: "サイト内ナビゲーション（モバイル）",
  langLabel: "表示言語",
  eyebrowCorporate: "Yorisou — Corporate",
  thesisUnits: THESIS_UNITS,
  leadLines: HERO_LEAD_UNITS,
  humanSide: "人",
  humanItems: ["暮らし", "仕事", "地域"],
  systemSide: "仕組み",
  systemItems: ["モビリティ", "行政手続き"],
  // Purely structural. Names the two sides using approved labels; makes no capability claim.
  fieldCaption: "人 — 暮らし・仕事・地域　／　仕組み — モビリティ・行政手続き",
  fieldRelation: "関係",
  eyebrowProblem: "取り組む問題",
  headingProblem: HEADING_UNITS.problem,
  problems: PROBLEM_BEATS.map((b) => ({ no: b.no, title: b.title, body: b.body })),
  eyebrowProjects: "事業",
  headingProjects: HEADING_UNITS.future,
  miraiName: MIRAI_MOVE.name,
  miraiStage: MIRAI_MOVE.stage,
  miraiLine: MIRAI_MOVE.lineUnits,
  miraiParties: MIRAI_NETWORK.parties.map((p, i) => ({
    no: String(i + 1).padStart(2, "0"),
    title: p.label,
    body: p.note,
  })),
  miraiCentre: MIRAI_NETWORK.centre,
  miraiBoundaryTitle: MIRAI_MOVE.boundaryTitle,
  miraiBoundary: MIRAI_MOVE.boundary,
  kakariName: KAKARI.name,
  kakariStage: KAKARI.stage,
  kakariLine: KAKARI.lineUnits,
  kakariSteps: KAKARI_PROCEDURE.steps.map((s) => ({ no: s.no, title: s.label, body: s.note })),
  kakariBoundaryTitle: KAKARI_PROCEDURE.boundary.label,
  kakariBoundary: KAKARI_PROCEDURE.boundary.note,
  more: (n) => `${n} について詳しく →`,
  eyebrowApproach: "つくり方",
  headingApproach: HEADING_UNITS.method,
  methods: METHODS.map((m) => ({ no: m.no, title: m.title, body: m.short })),
  methodsLong: METHODS.map((m) => ({ no: m.no, title: m.title, long: m.long })),
  discloseMethods: "この原則が実際に何を意味するか",
  eyebrowCompany: "会社",
  headingCompany: HEADING_UNITS.aboutTitle,
  companyBody:
    "事業の順番、境界の引き方、記載する事実の基準を公開しています。商号・所在地・設立・代表者・法人番号は、登録情報の確認後に掲載します。",
  aboutLink: "私たちについて →",
  navItems: [
    { href: "/mirai-move", label: "Mirai Move" },
    { href: "/kakari", label: "Kakari" },
    { href: "/about", label: "私たちについて" },
    { href: "/company", label: "会社情報" },
    { href: "/contact", label: "お問い合わせ" },
  ],
  footProjects: "事業",
  footCompany: "会社",
  footAbout: "私たちについて",
  footCompanyInfo: "会社情報",
  footContact: "お問い合わせ",
  previewBadge: "Preview — not published",
  pendingNote: "商号・所在地・設立・代表者・法人番号は、登録情報の確認後に掲載します。",
};

const EN: Copy = {
  htmlLang: "en",
  skip: "Skip to content",
  menu: "Menu",
  menuToggle: "Open and close the menu",
  navLabel: "Site navigation",
  navLabelMobile: "Site navigation (mobile)",
  langLabel: "Display language",
  eyebrowCorporate: "Yorisou — Corporate",
  /**
   * The English thesis is a strategic rendering, not a grammatical one. 「よりそい」 — to draw close
   * and stay alongside someone — is the company's own name and has no single English equivalent;
   * "stand alongside" keeps the act rather than flattening it into "support". Alternatives
   * considered are recorded in the multilingual report.
   */
  thesisUnits: ["Between people and society,", "we build the next way", "to stand alongside."],
  leadLines: [
    ["Yorisou looks closely at the complexity", "in daily life, work and local communities,"],
    ["and builds products that help people", "understand it, choose, and move forward."],
  ],
  humanSide: "People",
  humanItems: ["Daily life", "Work", "Community"],
  systemSide: "Systems",
  systemItems: ["Mobility", "Public procedures"],
  fieldCaption:
    "People — daily life, work, community  /  Systems — mobility, public procedures",
  fieldRelation: "Relationships",
  eyebrowProblem: "The problems we work on",
  headingProblem: ["Complexity is not solved", "by individual effort alone."],
  problems: [
    { no: "01", title: "“I don’t know” stops people at the door.", body: "A system that exists but cannot be reached is the same as one that does not." },
    { no: "02", title: "The distance to a professional is long.", body: "Before the point where human judgement is genuinely required, there is ground a system could cover." },
    { no: "03", title: "Practice and process do not meet.", body: "In mobility, welfare and public administration there are options that have not yet reached the people doing the work." },
  ],
  eyebrowProjects: "Projects",
  headingProjects: ["We build the next way to stand alongside,", "one at a time."],
  miraiName: MIRAI_MOVE.name,
  miraiStage: "Public site live / platform features in development",
  miraiLine: ["A platform for information, matching", "and business development", "in Japan’s mobility sector."],
  miraiParties: [
    { no: "01", title: "Government and municipalities", body: "The side that holds the rules and the budget" },
    { no: "02", title: "Companies", body: "The side that supplies and implements" },
    { no: "03", title: "Community, care and welfare settings", body: "Where the movement actually happens" },
    { no: "04", title: "Overseas suppliers and domestic partners", body: "The side that brings options" },
  ],
  miraiCentre: "Mobility opportunity",
  miraiBoundaryTitle: "On development status",
  miraiBoundary:
    "The platform itself is in development. Autonomous agent execution is not enabled. Any action that reaches outside the system is designed to require human confirmation. It is not offered as a completed, full-featured platform.",
  kakariName: KAKARI.name,
  kakariStage: "In development (not yet generally available)",
  kakariLine: ["Multilingual support for administrative", "procedures and documents, for people living", "in Japan and those starting a business here."],
  kakariSteps: [
    { no: "01", title: "Find out", body: "Identify which procedures apply to you" },
    { no: "02", title: "Gather documents", body: "Work out the documents and attachments required" },
    { no: "03", title: "Prepare", body: "Complete the forms in your language and check the content" },
    { no: "04", title: "Submit", body: "Guidance on where, how and by what postal process to submit" },
  ],
  kakariBoundaryTitle: "Where a professional takes over",
  kakariBoundary:
    "We do not act as a licensed professional on your behalf. Legal, tax and official determinations are stated as work a professional handles. Judgements or representation that require a licence — such as an attorney, tax accountant or administrative scrivener — are not part of Kakari’s functions.",
  more: (n) => `More on ${n} →`,
  eyebrowApproach: "How we build",
  headingApproach: ["We take on the complexity", "and turn it into something usable."],
  methods: [
    { no: "01", title: "Start from the language of practice", body: "We do not design from the technology. We work backwards from the actual steps of someone who is stuck." },
    { no: "02", title: "Make understanding part of the product’s responsibility", body: "Presenting information is not the end. Knowing what to do next is inside the scope of the design." },
    { no: "03", title: "State the boundary", body: "We do not step into work that belongs to a licensed professional. What we cover, and where we hand over, is written into the product itself." },
    { no: "04", title: "Say only what can be verified", body: "Results, figures and partnerships appear only where there is evidence. What cannot be confirmed is not written." },
  ],
  methodsLong: [
    { no: "01", title: "Start from the language of practice", long: "No system reaches anyone until it has been translated into the steps the person in front of it actually takes. We begin from the real application, the real journey, the real exchange — not from an abstract problem statement, but from the single move that is currently stuck." },
    { no: "02", title: "Make understanding part of the product’s responsibility", long: "Listing search results is not support. What a person needs is to know what to do next. The scope of the product runs to the point where the next step is understood, not to the point where information has been displayed." },
    { no: "03", title: "State the boundary", long: "Letting someone use a product without being clear about what it cannot do is the most dangerous design there is. What we handle, and where a professional takes over, is written into the screen itself. The boundary is a feature, not a disclaimer." },
    { no: "04", title: "Say only what can be verified", long: "We do not describe results we cannot confirm, or features that are not yet running. Every fact we publish has a record behind it. In periods when there is little we can say, we publish little." },
  ],
  discloseMethods: "What these principles mean in practice",
  eyebrowCompany: "Company",
  headingCompany: ["How we build", "is the promise we make."],
  companyBody:
    "We publish the order in which we build, how we draw boundaries, and the standard for what we state as fact. Trade name, registered address, date of incorporation, representative and corporate number will be published once the registration record has been confirmed.",
  aboutLink: "About us →",
  navItems: [
    { href: "/mirai-move", label: "Mirai Move" },
    { href: "/kakari", label: "Kakari" },
    { href: "/about", label: "About us" },
    { href: "/company", label: "Company information" },
    { href: "/contact", label: "Contact" },
  ],
  footProjects: "Projects",
  footCompany: "Company",
  footAbout: "About us",
  footCompanyInfo: "Company information",
  footContact: "Contact",
  previewBadge: "Preview — not published",
  pendingNote:
    "Trade name, registered address, date of incorporation, representative and corporate number will be published once the registration record has been confirmed.",
};

export const COPY: Record<Locale, Copy> = { ja: JA, en: EN };
