/**
 * CORP-P5R2 — the shape of the entire corporate site, in one type.
 *
 * Every published locale must satisfy this type completely. There is no optional field and no
 * fallback: a locale either has all of its copy or it fails the completeness check before Founder
 * review. That is what prevents a Japanese string appearing inside a Spanish page.
 */

export type Beat = { no: string; title: string; body: string };
export type Fact = { label: string; value: string };
export type Step = { no: string; title: string; body: string };

export type SiteCopy = {
  /* ── chrome ─────────────────────────────────────────────────────────── */
  chrome: {
    skip: string;
    menu: string;
    menuToggle: string;
    close: string;
    navLabel: string;
    navLabelMobile: string;
    langLabel: string;
    langHeading: string;
    langSearch: string;
    langCurrent: string;
    previewBadge: string;
    nav: { home: string; miraiMove: string; kakari: string; about: string; company: string; contact: string };
    footerTagline: string;
    footerProjects: string;
    footerCompany: string;
    footerLegalNote: string;
    backToTop: string;
  };

  /* ── metadata per route ─────────────────────────────────────────────── */
  meta: {
    home: { title: string; description: string };
    miraiMove: { title: string; description: string };
    kakari: { title: string; description: string };
    about: { title: string; description: string };
    company: { title: string; description: string };
    contact: { title: string; description: string };
  };

  /* ── shared ─────────────────────────────────────────────────────────── */
  common: {
    readMore: (name: string) => string;
    backHome: string;
    stageLabel: string;
    boundaryLabel: string;
  };

  /* ── HOME ───────────────────────────────────────────────────────────── */
  home: {
    eyebrow: string;
    thesis: readonly string[];
    lead: readonly string[];
    humanSide: string;
    humanItems: readonly string[];
    systemSide: string;
    systemItems: readonly string[];
    fieldCaption: string;
    fieldRelation: string;
    whyEyebrow: string;
    whyHeading: readonly string[];
    whyBeats: readonly Beat[];
    buildEyebrow: string;
    buildHeading: readonly string[];
    howEyebrow: string;
    howHeading: readonly string[];
    howBeats: readonly Beat[];
    howDisclose: string;
    founderEyebrow: string;
    founderHeading: readonly string[];
    founderTeaser: string;
    founderRole: string;
    founderCta: string;
    messageEyebrow: string;
    messageHeading: readonly string[];
    messageTeaser: string;
    messageCta: string;
    originEyebrow: string;
    originHeading: readonly string[];
    originBody: string;
    proofEyebrow: string;
    proofHeading: readonly string[];
    ctaEyebrow: string;
    ctaHeading: readonly string[];
    ctaBody: string;
    ctaButton: string;
  };

  /* ── PROJECTS ───────────────────────────────────────────────────────── */
  mirai: {
    eyebrow: string;
    heading: readonly string[];
    stage: string;
    lead: string;
    domain: string;
    networkEyebrow: string;
    networkHeading: readonly string[];
    centre: string;
    parties: readonly Beat[];
    boundaryTitle: string;
    boundaryBody: string;
    detail: readonly { heading: string; body: string }[];
    siteLabel: string;
    siteUrl: string;
  };
  kakari: {
    eyebrow: string;
    heading: readonly string[];
    stage: string;
    lead: string;
    domain: string;
    procedureEyebrow: string;
    procedureHeading: readonly string[];
    steps: readonly Step[];
    boundaryTitle: string;
    boundaryBody: string;
    detail: readonly { heading: string; body: string }[];
  };

  /* ── ABOUT ──────────────────────────────────────────────────────────── */
  about: {
    eyebrow: string;
    heading: readonly string[];
    lead: string;
    whyHeading: readonly string[];
    whyBody: readonly string[];
    thinkHeading: readonly string[];
    thinkBody: readonly string[];
    buildHeading: readonly string[];
    principles: readonly Beat[];
    principlesLong: readonly { no: string; title: string; long: string }[];
    orderHeading: readonly string[];
    orderBody: string;
    claimsHeading: readonly string[];
    claimsBody: string;
  };

  /* ── COMPANY ────────────────────────────────────────────────────────── */
  company: {
    eyebrow: string;
    heading: readonly string[];
    intro: string;
    messageEyebrow: string;
    messageHeading: readonly string[];
    message: readonly string[];
    messageSignature: string;
    messageRole: string;
    profileEyebrow: string;
    profileHeading: readonly string[];
    profileName: string;
    profileNameLatin: string;
    profileRole: string;
    profileBody: readonly string[];
    profileBackgroundLabel: string;
    profileBackground: readonly string[];
    profileEducationLabel: string;
    profileEducation: readonly string[];
    profileRelevanceLabel: string;
    profileRelevance: readonly string[];
    overviewEyebrow: string;
    overviewHeading: readonly string[];
    facts: readonly Fact[];
    businessEyebrow: string;
    businessHeading: readonly string[];
    businessBody: string;
    projectsEyebrow: string;
    projectsHeading: readonly string[];
    originEyebrow: string;
    originHeading: readonly string[];
    originBody: readonly string[];
    ctaHeading: readonly string[];
    ctaBody: string;
  };

  /* ── CONTACT ────────────────────────────────────────────────────────── */
  contact: {
    eyebrow: string;
    heading: readonly string[];
    lead: string;
    channelsHeading: readonly string[];
    channels: readonly { title: string; body: string }[];
    formHeading: readonly string[];
    formIntro: string;
    fields: {
      name: string; namePlaceholder: string;
      email: string; emailPlaceholder: string;
      org: string; orgPlaceholder: string;
      type: string;
      message: string; messagePlaceholder: string;
    };
    types: readonly { value: string; label: string }[];
    submit: string;
    sending: string;
    successTitle: string;
    successBody: string;
    errorTitle: string;
    errorBody: string;
    required: string;
    privacyNote: string;
  };
};
