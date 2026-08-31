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
    ventures: { title: string; description: string };
    buildWithUs: { title: string; description: string };
    chigamo: { title: string; description: string };
  };

  /* ── shared ─────────────────────────────────────────────────────────── */
  common: {
    readMore: (name: string) => string;
    backHome: string;
    stageLabel: string;
    boundaryLabel: string;
    /* CORP-v1.2R2 — shared column labels for the venture state triad. */
    nowLabel: string;
    nextLabel: string;
    whoLabel: string;

  };

  /* ── HOME ───────────────────────────────────────────────────────────── */
  home: {
    eyebrow: string;
    /**
     * CORP-v1.2R3 — the display hook. Deliberately shorter and blunter than `thesis`, which stays
     * as the supporting line. A visitor reading for three seconds reads this and nothing else.
     */
    hook: readonly string[];
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
    /* ── CORP-v1.2: Foundry story order ────────────────────────────────
     * The homepage must answer, in order: what YORISOU is, which ventures exist now, how it
     * builds, what shared infrastructure sits underneath, and how to engage. The first four
     * already had fields; the Asterion layer and the engagement layer are new. */
    asterionEyebrow: string;
    asterionHeading: readonly string[];
    asterionBody: string;
    asterionNote: string;
    engageEyebrow: string;
    engageHeading: readonly string[];
    engageBody: string;
    engageCta: string;
    /* CORP-v1.2R2 — the homepage participation layer. Lane labels come from buildWithUs.lanes. */
    engageNote: string;
    /* CORP-v1.2R2 — the "30 seconds" explainer affordance. */
    explainerLabel: string;
    explainerHeading: readonly string[];
    explainerClose: string;
    /* CORP-v1.2R2.1 — guided-explainer transport controls. */
    explainerPlay: string;
    explainerPause: string;
    explainerRestart: string;
    explainerStepLabel: string;
  };

  /* ── VENTURES INDEX (CORP-v1.2) ─────────────────────────────────────── */
  ventures: {
    eyebrow: string;
    heading: readonly string[];
    lead: string;
    cards: readonly {
      name: string;
      href: string;
      thesis: string;
      problem: string;
      building: string;
      /** Public-safe maturity in ordinary language. Never a metric, never a claim of traction. */
      status: string;
    }[];
    /** States plainly what inclusion on this page does and does not mean. */
    noteHeading: readonly string[];
    noteBody: readonly string[];
  };

  /* ── CHIGAMO (CORP-v1.2) ────────────────────────────────────────────── */
  chigamo: {
    /* ── CORP-v1.2R2 ────────────────────────────────────────────────────────
     * The state triad. `now` is what is true today, `next` is an evidenced next step (never a
     * roadmap wish), `who` is who it would genuinely help to hear from at this stage. A venture
     * with no evidenced next step says so rather than inventing one.
     */
    now: string;
    next: string;
    who: string;
    /**
     * The venture's OWN canonical Japanese line, shown beside the Latin wordmark on Japanese
     * surfaces.
     *
     * Deliberately NOT a katakana transliteration. Kakari's own localisation glossary forbids one
     * ("ASCII wordmark only. Never transliterated") and enforces it in CI; Mirai Move's brand.ts —
     * its stated single source of truth for public identity — carries a Latin wordmark and a
     * Japanese slogan, with no reading anywhere; Chigamo has no canonical source at all. Inventing
     * readings would be creating names against two projects' governance. Pairing each wordmark with
     * its own Japanese line makes the Japanese site read as Japanese without doing that.
     */
    reading: string;
    /** Participation for THIS venture. Roles must make sense for this venture specifically. */
    join: {
      title: string;
      body: string;
      roles: readonly string[];
      /** The weakest truthful state — never "applications open" unless a process exists. */
      state: string;
    };
    eyebrow: string;
    heading: readonly string[];
    stage: string;
    lead: string;
    domain: string;
    conceptEyebrow: string;
    conceptHeading: readonly string[];
    conceptBody: readonly string[];
    boundaryTitle: string;
    boundaryBody: string;
    detail: readonly { heading: string; body: string }[];
  };

  /* ── HOW WE BUILD / FOUNDRY (CORP-v1.2) ─────────────────────────────── */
  foundry: {
    eyebrow: string;
    heading: readonly string[];
    lead: string;
    stagesEyebrow: string;
    stagesHeading: readonly string[];
    stages: readonly { no: string; name: string; body: string }[];
    independenceHeading: readonly string[];
    independenceBody: readonly string[];
    asterionEyebrow: string;
    asterionHeading: readonly string[];
    asterionBody: readonly string[];
    asterionBoundaryTitle: string;
    asterionBoundaryBody: string;
    economicsHeading: readonly string[];
    economicsBody: readonly string[];
    maturityTitle: string;
    maturityBody: string;
  };

  /* ── BUILD WITH US (CORP-v1.2) ──────────────────────────────────────── */
  buildWithUs: {
    eyebrow: string;
    heading: readonly string[];
    lead: string;
    /**
     * CORP-v1.2R2 — the participation matrix.
     *
     * Six relationship classes in natural language, never internal governance vocabulary. Each lane
     * states what Yorisou can actually offer today AND what it cannot promise, because an invitation
     * that only lists upside is a recruitment pitch, not an honest one. `state` carries the weakest
     * truthful status, so nothing reads as an open application process while none exists.
     *
     * Home renders `label` from this same array, so the homepage participation layer and this page
     * can never drift apart or contradict each other.
     */
    lanes: readonly {
      key: string;
      /** Short label for the homepage participation grid. */
      label: string;
      title: string;
      body: string;
      invites: readonly string[];
      /** What Yorisou can genuinely provide today. */
      offers: string;
      /** What Yorisou explicitly cannot promise. */
      cannot: string;
      /** Names of current ventures this lane may be relevant to. Empty when none specifically. */
      ventures: readonly string[];
      state: string;
      cta: string;
    }[];
    /** Honest statement of what intake currently is. No "Apply now" while no programme runs. */
    intakeTitle: string;
    intakeBody: string;
    /* CORP-v1.2R2 — the founding-team idea, without inventing a team. */
    foundingTeamEyebrow: string;
    foundingTeamHeading: readonly string[];
    foundingTeamBody: readonly string[];
    ctaHeading: readonly string[];
    ctaBody: string;
  };

  /* ── PROJECTS ───────────────────────────────────────────────────────── */
  mirai: {
    /* ── CORP-v1.2R2 ────────────────────────────────────────────────────────
     * The state triad. `now` is what is true today, `next` is an evidenced next step (never a
     * roadmap wish), `who` is who it would genuinely help to hear from at this stage. A venture
     * with no evidenced next step says so rather than inventing one.
     */
    now: string;
    next: string;
    who: string;
    /**
     * The venture's OWN canonical Japanese line, shown beside the Latin wordmark on Japanese
     * surfaces.
     *
     * Deliberately NOT a katakana transliteration. Kakari's own localisation glossary forbids one
     * ("ASCII wordmark only. Never transliterated") and enforces it in CI; Mirai Move's brand.ts —
     * its stated single source of truth for public identity — carries a Latin wordmark and a
     * Japanese slogan, with no reading anywhere; Chigamo has no canonical source at all. Inventing
     * readings would be creating names against two projects' governance. Pairing each wordmark with
     * its own Japanese line makes the Japanese site read as Japanese without doing that.
     */
    reading: string;
    /** Participation for THIS venture. Roles must make sense for this venture specifically. */
    join: {
      title: string;
      body: string;
      roles: readonly string[];
      /** The weakest truthful state — never "applications open" unless a process exists. */
      state: string;
    };
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
    /* ── CORP-v1.2R2 ────────────────────────────────────────────────────────
     * The state triad. `now` is what is true today, `next` is an evidenced next step (never a
     * roadmap wish), `who` is who it would genuinely help to hear from at this stage. A venture
     * with no evidenced next step says so rather than inventing one.
     */
    now: string;
    next: string;
    who: string;
    /**
     * The venture's OWN canonical Japanese line, shown beside the Latin wordmark on Japanese
     * surfaces.
     *
     * Deliberately NOT a katakana transliteration. Kakari's own localisation glossary forbids one
     * ("ASCII wordmark only. Never transliterated") and enforces it in CI; Mirai Move's brand.ts —
     * its stated single source of truth for public identity — carries a Latin wordmark and a
     * Japanese slogan, with no reading anywhere; Chigamo has no canonical source at all. Inventing
     * readings would be creating names against two projects' governance. Pairing each wordmark with
     * its own Japanese line makes the Japanese site read as Japanese without doing that.
     */
    reading: string;
    /** Participation for THIS venture. Roles must make sense for this venture specifically. */
    join: {
      title: string;
      body: string;
      roles: readonly string[];
      /** The weakest truthful state — never "applications open" unless a process exists. */
      state: string;
    };
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
