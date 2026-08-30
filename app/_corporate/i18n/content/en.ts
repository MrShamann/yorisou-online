import type { SiteCopy } from "../types";

/**
 * CORP-P5R2 — ENGLISH. Editorially reviewed, translated from the Japanese canonical source.
 *
 * This is an adapted sibling, not a literal rendering: it is written to read as natural
 * international corporate English. It may never be stronger than the Japanese. No customer,
 * partner, metric, revenue, funding, market-position, team-size or capability claim appears here
 * that the Japanese does not already make.
 *
 * On the representative: "Harvard Business School Executive Education" is stated precisely. It is
 * NOT a Harvard University degree and NOT an HBS MBA, and must never be shortened in a way that
 * implies either. No endorsement by IESE, Harvard, Ficosa, or any government body is implied.
 */
export const en: SiteCopy = {
  chrome: {
    skip: "Skip to content",
    menu: "Menu",
    menuToggle: "Open and close the menu",
    close: "Close",
    navLabel: "Site navigation",
    navLabelMobile: "Site navigation (mobile)",
    langLabel: "Display language",
    langHeading: "Choose a language",
    langSearch: "Search languages",
    langCurrent: "Current language",
    previewBadge: "Preview — not published",
    nav: { home: "Home", miraiMove: "Mirai Move", kakari: "Kakari", about: "About", company: "Company", contact: "Contact" },
    footerTagline: "Between people and society, we build the next way to stand alongside.",
    footerProjects: "Projects",
    footerCompany: "Company",
    footerLegalNote: "Everything stated here rests on a record we can verify.",
    backToTop: "Back to top",
  },

  meta: {
    home: { title: "Yorisou LLC — Between people and society, we build the next way to stand alongside.", description: "Yorisou LLC looks closely at the complexity in daily life, work and local communities, and builds products that help people understand it, choose, and move forward. We are building Mirai Move and Kakari." },
    miraiMove: { title: "Mirai Move — Yorisou LLC", description: "A platform for information, matching and business development in Japan's mobility sector. The public site is live; platform features are in development." },
    kakari: { title: "Kakari — Yorisou LLC", description: "Multilingual support for administrative procedures and documents, for people living in Japan and those starting a business here. In development, not yet generally available." },
    about: { title: "About — Yorisou LLC", description: "Why Yorisou exists, how it thinks, and how it builds. We do not write what we cannot verify." },
    company: { title: "Company — Yorisou LLC", description: "Company overview, representative profile, representative message and business areas of Yorisou LLC." },
    contact: { title: "Contact — Yorisou LLC", description: "Enquiries about our work, partnerships and press." },
  },

  common: {
    readMore: (name) => `More on ${name}`,
    backHome: "Back to the company overview",
    stageLabel: "Current stage",
    boundaryLabel: "What we do not take on",
  },

  home: {
    eyebrow: "Yorisou LLC",
    thesis: ["Between people and society,", "we build the next way", "to stand alongside."],
    lead: ["Yorisou looks closely at the complexity in daily life, work and local communities,", "and builds products that help people understand it, choose, and move forward."],
    humanSide: "People",
    humanItems: ["Daily life", "Work", "Community"],
    systemSide: "Systems",
    systemItems: ["Mobility", "Public procedures"],
    fieldCaption: "People — daily life, work, community  /  Systems — mobility, public procedures",
    fieldRelation: "Relationships",

    whyEyebrow: "The problems we work on",
    whyHeading: ["Complexity is not solved", "by individual effort alone."],
    whyBeats: [
      { no: "01", title: "“I don’t know” stops people at the door.", body: "A system that exists but cannot be reached is the same as one that does not." },
      { no: "02", title: "The path to a professional is long.", body: "Before the point where human judgement is genuinely required, there is ground a system could cover." },
      { no: "03", title: "The frontline and the system do not mesh.", body: "In mobility, welfare and public administration there are options that have not yet reached the people doing the work." },
    ],

    buildEyebrow: "What we build",
    buildHeading: ["We build the next way to stand alongside,", "one at a time."],

    howEyebrow: "How we build",
    howHeading: ["We take on the complexity", "and turn it into something usable."],
    howBeats: [
      { no: "01", title: "Start from the language of the frontline", body: "We do not design from the technology. We work backwards from the actual steps of someone who is stuck." },
      { no: "02", title: "Own the problem as far as understanding", body: "Presenting information is not the end. Knowing what to do next is inside the scope of the design." },
      { no: "03", title: "State the boundary", body: "We do not step into work that belongs to a licensed professional. What we cover, and where we hand over, is written into the product itself." },
      { no: "04", title: "Say only what can be verified", body: "Results, figures and partnerships appear only where there is evidence. What cannot be confirmed is not written." },
    ],
    howDisclose: "What these principles mean in practice",

    founderEyebrow: "Representative",
    founderHeading: ["Built by someone who has spent", "twenty years inside complex industries."],
    founderTeaser: "Twenty years across automotive, mobility, manufacturing and international business, standing between the technology, the implementation and the commercial reality. The same thing kept happening: a well-built system stalling before it reached the person who needed it.",
    founderRole: "Representative, Yorisou LLC",
    founderCta: "About the representative",

    messageEyebrow: "Message",
    messageHeading: ["We judge by whether it arrives,", "not by whether it is advanced."],
    messageTeaser: "What we work on is not novelty. Systems and options already exist — they simply stop before they reach the people who need them. We are building a company that closes that distance, one step at a time.",
    messageCta: "Read the full message",

    originEyebrow: "Where we are",
    originHeading: ["Starting from Fukuoka."],
    originBody: "Yorisou LLC is building the company from Fukuoka, Japan — a place where daily life, work and community sit close together, and where design can begin from the steps people actually take.",

    proofEyebrow: "Company",
    proofHeading: ["What we can state,", "and only that."],

    ctaEyebrow: "Contact",
    ctaHeading: ["There may be room", "to work on this together."],
    ctaBody: "We welcome enquiries about our work, potential partnerships and press. We reply in turn, according to what is asked.",
    ctaButton: "Get in touch",
  },

  mirai: {
    eyebrow: "Project 01",
    heading: ["A platform for information, matching", "and business development", "in Japan’s mobility sector."],
    stage: "Public site live / platform features in development",
    lead: "Mirai Move aims to connect government and municipalities, companies, community and care settings, overseas suppliers and domestic partners, so that information and opportunity around mobility can be handled as a single flow. The public information site is live today; the platform features are in development.",
    domain: "Japan’s mobility sector",
    networkEyebrow: "Who it connects",
    networkHeading: ["Parties who stand in different places", "are looking at the same opportunity", "in different words."],
    centre: "Mobility opportunity",
    parties: [
      { no: "01", title: "Government and municipalities", body: "Holds the rules and the budget" },
      { no: "02", title: "Companies", body: "Supplies and implements" },
      { no: "03", title: "Community, care and welfare settings", body: "Where the movement actually happens" },
      { no: "04", title: "Overseas suppliers and domestic partners", body: "Brings the options" },
    ],
    boundaryTitle: "On development status",
    boundaryBody: "The platform itself is in development. Autonomous agent execution is not enabled. Any action that reaches outside the system is designed to require human confirmation. It is not offered as a completed, full-featured platform.",
    detail: [
      { heading: "The problem it addresses", body: "Mobility options exist separately by region, by scheme and by operator. The person who needs one and the option that already exists do not meet in the same place." },
      { heading: "Who it works with", body: "Government and municipalities, companies, community and care settings, overseas suppliers and domestic partners. Parties with different positions and different criteria are looking at the same opportunity in different words." },
      { heading: "What is running today", body: "The public information site is live. The platform's information, matching and business-development capabilities are at the stage of building foundations and architecture." },
    ],
    siteLabel: "Public site",
    siteUrl: "https://www.miraimove.com",
  },

  kakari: {
    eyebrow: "Project 02",
    heading: ["Multilingual support for procedures", "and documents, for people living in Japan", "and those starting a business here."],
    stage: "In development (not yet generally available)",
    lead: "When language and prior knowledge are the barrier, people cannot reach systems they are entitled to use. Kakari supports finding the relevant information, preparing documents, completing forms and following the submission process — in the user's own language. It is in development and not yet generally available.",
    domain: "Administrative procedures and documents / multilingual",
    procedureEyebrow: "The procedure it supports",
    procedureHeading: ["From finding out,", "to submitting."],
    steps: [
      { no: "01", title: "Find out", body: "Identify which procedures apply to you" },
      { no: "02", title: "Gather documents", body: "Work out the documents and attachments required" },
      { no: "03", title: "Prepare", body: "Complete the forms in your language and check the content" },
      { no: "04", title: "Submit", body: "Guidance on where, how and by what postal process to submit" },
    ],
    boundaryTitle: "Where a professional takes over",
    boundaryBody: "We do not act as a licensed professional on your behalf. Legal, tax and official determinations are stated as work a professional handles. Judgements or representation that require a licence — such as an attorney, tax accountant or administrative scrivener — are not part of Kakari's functions.",
    detail: [
      { heading: "The problem it addresses", body: "How to complete a procedure is public information. Even so, people cannot reach the system simply because the language and the assumed knowledge are missing. That is not a failure of ability." },
      { heading: "Who it works with", body: "People living in Japan, and people about to start a business here — those for whom completing a procedure alone, in Japanese, is difficult." },
      { heading: "What is running today", body: "The authentication foundation has been built in an isolated verification environment, where permissions and storage are being verified. External integrations remain disabled and it is not publicly available." },
    ],
  },

  about: {
    eyebrow: "About",
    heading: ["How we build", "is the promise we make."],
    lead: "Yorisou looks closely at the complexity in daily life, work and local communities, and builds products that help people understand it, choose, and move forward.",
    whyHeading: ["Why this company exists."],
    whyBody: [
      "Systems, technology and options already exist in large numbers. They still stop before they reach the person who needs them. That last distance is what we work on.",
      "This distance is usually described as a matter of individual effort or information. In practice, complexity that the system could have absorbed is simply handed to the individual instead.",
    ],
    thinkHeading: ["How we think."],
    thinkBody: [
      "We do not design from the technology. We begin by loosening the one move that is currently stuck: read the person's situation, organise it as a set of relationships, and carry it to the point where the next step is clear. That is the scope of the design.",
      "AI is used for that understanding and structuring — not to make the decision. Its role is to put the material a person needs into a usable form. The judgement, and the responsibility, stay with the person.",
    ],
    buildHeading: ["How we build."],
    principles: [
      { no: "01", title: "Start from the language of the frontline", body: "We do not design from the technology. We work backwards from the actual steps of someone who is stuck." },
      { no: "02", title: "Own the problem as far as understanding", body: "Presenting information is not the end. Knowing what to do next is inside the scope of the design." },
      { no: "03", title: "State the boundary", body: "We do not step into work that belongs to a licensed professional. What we cover, and where we hand over, is written into the product itself." },
      { no: "04", title: "Say only what can be verified", body: "Results, figures and partnerships appear only where there is evidence. What cannot be confirmed is not written." },
    ],
    principlesLong: [
      { no: "01", title: "Start from the language of the frontline", long: "No system reaches anyone until it has been translated into the steps the person in front of it actually takes. We begin from the real application, the real journey, the real exchange — not from an abstract problem statement, but from the single move that is currently stuck." },
      { no: "02", title: "Own the problem as far as understanding", long: "Listing search results is not support. What a person needs is to know what to do next. The scope of the product runs to the point where the next step is understood, not to the point where information has been displayed." },
      { no: "03", title: "State the boundary", long: "Letting someone use a product without being clear about what it cannot do is the most dangerous design there is. What we handle, and where a professional takes over, is written into the screen itself. The boundary is a feature, not a disclaimer." },
      { no: "04", title: "Say only what can be verified", long: "We do not describe results we cannot confirm, or features that are not yet running. Every fact we publish has a record behind it. In periods when there is little we can say, we publish little." },
    ],
    orderHeading: ["One at a time,", "all the way through."],
    orderBody: "We do not start many things at once. We would rather carry one area all the way to the point where it reaches the steps people actually take.",
    claimsHeading: ["We do not write", "what we cannot verify."],
    claimsBody: "Every fact we publish has a record behind it. In periods when there is little we can say, we publish little.",
  },

  company: {
    eyebrow: "Company",
    heading: ["Yorisou LLC"],
    intro: "Yorisou LLC builds products that turn the complexity of daily life, work and local communities into something a person can understand, choose from, and act on. Based in Fukuoka, we are developing two projects: Mirai Move and Kakari.",

    messageEyebrow: "Message from the representative",
    messageHeading: ["We judge by whether it arrives,", "not by whether it is advanced."],
    message: [
      "What we work on is not novelty.",
      "For more than twenty years, in automotive, mobility and manufacturing, I stood between the technology, the implementation and the commercial reality. The same thing kept happening: a well-built system stalling before it reached the person who needed it. Not because the technology was lacking, but because it had never been translated into the steps that person actually takes.",
      "Systems and options already exist in large numbers. But if someone cannot tell whether it applies to them, or what to do next, it is the same as their not existing at all. Closing that last distance — having the system absorb it, rather than the individual — is why Yorisou exists.",
      "We do not use AI to make the decision. We use it to read the situation, organise it as relationships, and put it into a usable form so that a person can decide. The judgement and the responsibility stay with the person. What we handle, and where we hand over to a professional, is written into the screen itself.",
      "We are still a small company, and there is not a great deal we can yet claim. That is exactly why we write only what we can verify. What should grow is not the claim, but the record of having actually arrived.",
    ],
    messageSignature: "Jin Yang",
    messageRole: "Representative, Yorisou LLC",

    profileEyebrow: "Representative",
    profileHeading: ["About the representative"],
    profileName: "Jin Yang",
    profileNameLatin: "Jin Yang / Edward Jin",
    profileRole: "Representative, Yorisou LLC",
    profileBody: [
      "More than twenty years of professional experience across automotive, mobility, manufacturing, industrial project development, supply chain, commercial development, product development, and cross-border international business.",
    ],
    profileBackgroundLabel: "Background",
    profileBackground: [
      "Held senior commercial and industrial project responsibilities at Ficosa, an international automotive supplier, including work connected with global industrial projects and Asian commercial activities.",
      "Later founded and operated technology and manufacturing businesses in China, including work involving automotive electronics, control systems, precision manufacturing and AI-enabled product and system development.",
      "Has worked across multiple markets, including Europe, China and Japan.",
      "Now serves as representative of Yorisou LLC in Japan, building the company from Fukuoka.",
    ],
    profileEducationLabel: "Education",
    profileEducation: [
      "MBA, IESE Business School",
      "General Management Program, Harvard Business School Executive Education",
    ],
    profileRelevanceLabel: "Why this background matters here",
    profileRelevance: [
      "Long experience operating across complex, real-world industries.",
      "Standing where technology, manufacturing, commercial execution and international markets meet.",
      "Direct exposure to the gap between what a system can do and what a person or organisation can actually use.",
      "And so the reason for building products that turn complexity into something understandable and actionable.",
    ],

    overviewEyebrow: "Company overview",
    overviewHeading: ["Company overview"],
    facts: [
      { label: "Name", value: "Yorisou LLC (Yorisou GK)" },
      { label: "Representative", value: "Jin Yang" },
      { label: "Location", value: "Fukuoka City, Fukuoka, Japan" },
      { label: "Business", value: "Planning, development and operation of Mirai Move and Kakari" },
    ],

    businessEyebrow: "Business areas",
    businessHeading: ["Business areas"],
    businessBody: "Information, matching and business development in the mobility sector; and multilingual support for administrative procedures and documents, for people living in Japan and those starting a business here. Both follow the same principle: absorb the complexity, and return something usable.",

    projectsEyebrow: "Projects",
    projectsHeading: ["What we are building"],

    originEyebrow: "Where we are",
    originHeading: ["Starting from Fukuoka."],
    originBody: [
      "Yorisou LLC is building the company from Fukuoka City, Japan.",
      "It is a place where daily life, work and community sit close together — and where design can begin from the steps people actually take.",
    ],

    ctaHeading: ["Contact"],
    ctaBody: "We welcome enquiries about our work, potential partnerships and press.",
  },

  contact: {
    eyebrow: "Contact",
    heading: ["Contact"],
    lead: "We welcome enquiries about our work, potential partnerships and press. We reply in turn, according to what is asked.",
    channelsHeading: ["What you can ask about"],
    channels: [
      { title: "General enquiries", body: "Questions about Yorisou as a company and the projects we are building." },
      { title: "Business and partnerships", body: "Collaboration or commercial discussions in mobility or administrative procedures." },
      { title: "Press and media", body: "Interview requests and questions about the company or its representative." },
    ],
    formHeading: ["Send us a message"],
    formIntro: "Use the form below. We read every enquiry and reply in turn.",
    fields: {
      name: "Name", namePlaceholder: "Your name",
      email: "Email", emailPlaceholder: "you@example.com",
      org: "Company or organisation", orgPlaceholder: "Optional",
      type: "Type of enquiry",
      message: "Message", messagePlaceholder: "Tell us the background, and what you would like to confirm.",
    },
    types: [
      { value: "general", label: "General enquiry" },
      { value: "business", label: "Business and partnerships" },
      { value: "media", label: "Press and media" },
    ],
    submit: "Send",
    sending: "Sending…",
    successTitle: "Message sent",
    successBody: "We have received your enquiry. We will review it and reply in turn.",
    errorTitle: "Could not send",
    errorBody: "Please wait a moment and try again.",
    required: "Required",
    privacyNote: "Personal information you provide is used only to respond to your enquiry.",
  },
};
