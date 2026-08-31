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
    home: { title: "Yorisou LLC — From structural problems to companies that stand on their own.", description: "Yorisou LLC is a foundry: we find structural problems, build evidence and venture assets, and form founding teams to turn them into independent companies. Mirai Move, Kakari and Chigamo are underway." },
    miraiMove: { title: "Mirai Move — Yorisou LLC", description: "A platform for information, matching and business development across Japan's mobility sector. The public site is live; platform features are in development." },
    kakari: { title: "Kakari — Yorisou LLC", description: "Multilingual support for administrative procedures and paperwork, for people living in Japan and those starting a business here. In development, not yet publicly released." },
    about: { title: "How we build — Yorisou LLC", description: "Find the problem, verify it, design the business, form a founding team, and carry it to an independent company. How the Yorisou foundry works, and where shared infrastructure sits." },
    company: { title: "Company — Yorisou LLC", description: "Company information, representative profile and message, and the areas Yorisou works in." },
    contact: { title: "Contact — Yorisou LLC", description: "For enquiries about our work, collaboration, or press." },
    ventures: { title: "Ventures — Yorisou LLC", description: "What Yorisou is working on now: Mirai Move, Kakari and Chigamo. Each is at a different stage, and we say which." },
    buildWithUs: { title: "Build with us — Yorisou LLC", description: "Ways in for founders, researchers, public-sector teams and companies. There is no open application programme; we start from a conversation." },
    chigamo: { title: "Chigamo — Yorisou LLC", description: "A concept for making what actually matters in a place discoverable from location and context. At concept stage; nothing is publicly released." },
  },

  common: {
    readMore: (name) => `More on ${name}`,
    backHome: "Back to the company overview",
    stageLabel: "Current stage",
    boundaryLabel: "What we do not take on",
    nowLabel: "Now",
    nextLabel: "Next step",
    whoLabel: "Who we want to hear from",
  },

  home: {
    eyebrow: "Yorisou LLC",
    thesis: ["From structural problems,", "to companies that", "stand on their own."],
    lead: [
      "Yorisou is a foundry: we find structural problems, verify them, design them as businesses,",
      "and team up with the people who will run them as independent companies.",
    ],
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
    buildHeading: ["Three areas,", "underway now."],

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

    /* CORP-v1.2 — Asterion layer and engagement layer on the homepage. */
    asterionEyebrow: "Shared infrastructure",
    asterionHeading: ["Each build", "thickens the floor."],
    asterionBody:
      "Asterion OS is an independent shared technology and execution platform, positioned within Yorisou's foundry architecture. Because the common ground is already there, each venture can spend its effort on the part that is actually its own.",
    asterionNote:
      "Every venture is governed separately, and keeps its own intellectual property, data and operating responsibility. Asterion is not owned by Yorisou.",
    engageEyebrow: "Build with us",
    engageHeading: ["Come in while it is", "still becoming a company."],
    engageBody:
      "Founders, researchers, public-sector teams, companies. Where you can join depends on where you stand. We start from whatever can be discussed now.",
    engageCta: "See the ways in",
    engageNote: "All of them start from a conversation. There is no application process and no selection yet.",
    explainerLabel: "Yorisou in 30 seconds",
    explainerHeading: ["From a problem to a company,", "in thirty seconds."],
    explainerClose: "Close",
    explainerPlay: "Play",
    explainerPause: "Pause",
    explainerRestart: "Restart",
    explainerStepLabel: "Step",
  },

  mirai: {
    reading: "Move regional mobility all the way to a solution.",
    now: "The public site is running, and the system that reads public sources keeps running on its own. Nothing has gone out to anyone yet — not once.",
    next: "On the first substantial case, the open questions left are ones that cannot be settled from the desk. From here it is a person's turn.",
    who: "People who know regional mobility from the inside — municipalities, operators, the actual field — and can describe the real constraints.",
    join: {
      title: "Work on this venture",
      body: "What is needed now is someone who can describe the constraints concretely. This is the checking stage, not the selling stage.",
      roles: [
        "You work in regional transport or mobility — municipality, operator, or the field itself",
        "You could carry this domain as a founder or operator",
        "You know how the operations actually run",
      ],
      state: "We are at the stage of wanting to listen. There is no open position.",
    },
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
    reading: "So that procedures in Japan can be done by the person themselves.",
    now: "A private testing stage. It is not publicly available, and nobody is using it yet.",
    next: "The steps needed for distribution, and settling the company's own registration details. Both need confirmation from outside.",
    who: "People living in Japan on a foreign passport, the people who support them, and licensed specialists.",
    join: {
      title: "Work on this venture",
      body: "We want people who know what these procedures are really like to look at it first. It is not a tool for replacing specialists.",
      roles: [
        "You have actually struggled with a procedure in Japan",
        "You support foreign residents in some capacity",
        "You are a licensed specialist and could help check where the boundary belongs",
        "You could carry this venture as a founder or operator",
      ],
      state: "We are looking for people to show it to. Nothing is public and nothing is open.",
    },
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
      { label: "Corporate Number (hōjin bangō)", value: "2290003018125" },
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

  /* ── VENTURES INDEX (CORP-v1.2) ─────────────────────────────────────── */
  ventures: {
    eyebrow: "What we are building",
    heading: ["Three areas, each", "short of being a company."],
    lead:
      "In every one of them the rules and the systems already exist — and stop just before the people who need them. Yorisou works in that gap, and checks as it goes.",
    cards: [
      {
        name: "Mirai Move",
        href: "/mirai-move",
        thesis: "Connect information, matching and business development across mobility.",
        problem: "Information and opportunity are split apart between operators, regions and government.",
        building: "A platform where parties in and outside Japan can work from the same information.",
        status: "In development and operation. Public site live.",
      },
      {
        name: "Kakari",
        href: "/kakari",
        thesis: "Multilingual support for the procedures of living and starting a business in Japan.",
        problem: "The systems exist, but language and sequence stop people from ever using them.",
        building: "A way to break a procedure into stages and show how far you can get yourself.",
        status: "In development. Preparing for release.",
      },
      {
        name: "Chigamo",
        href: "/chigamo",
        thesis: "Make a place legible from location and context.",
        problem: "The information that would actually help you here is the hardest to find.",
        building: "Discovery for the area you live in, built on location and context.",
        status: "Concept stage. Not yet tested.",
      },
    ],
    noteHeading: ["What this page says,", "and what it does not."],
    noteBody: [
      "These are the ventures and concepts Yorisou is working on now.",
      "They are not incorporated subsidiaries, not investments, and not clients. They sit at different stages, and we have written the stage as it is.",
      "The aim is for each to stand as an independent company. None has reached that point yet.",
    ],
  },

  /* ── CHIGAMO (CORP-v1.2) ────────────────────────────────────────────── */
  chigamo: {
    reading: "Understand a place, from inside it.",
    now: "Concept stage. There is no released product, no users, and no municipal programme.",
    next: "Whether narrowing by location and context actually makes information usable. We intend to test that small, first.",
    who: "People who genuinely know a particular place, and can say where local information stops being useful.",
    join: {
      title: "Work on this venture",
      body: "This is still before the testing stage. So we are less looking for people to build with than for people who will break the hypothesis.",
      roles: [
        "You know a specific area in detail, from living there",
        "You have worked with location or regional data",
        "You do not mind being involved while it is still a concept",
      ],
      state: "Concept stage. What involvement looks like is not yet decided.",
    },
    eyebrow: "Venture",
    heading: ["Understand a place,", "from inside it."],
    stage: "Concept stage",
    lead:
      "A concept: use location and context to surface what is genuinely useful in a particular place. It is still before the testing stage.",
    domain: "Local area / location and context / discovery",
    conceptEyebrow: "The thinking",
    conceptHeading: ["The information exists.", "It just never arrives."],
    conceptBody: [
      "The things you most want to know about a place are the things search returns worst. Not because the information is missing, but because it was never organised against place and situation.",
      "Where you are, when it is, and what you are dealing with. Some information only becomes recognisably yours when all three line up. That is what Chigamo is trying to work on.",
    ],
    boundaryTitle: "Where this stands",
    boundaryBody:
      "Chigamo is at concept stage. There is no released product, no users, and no municipal programme. What is written here is a hypothesis we intend to test.",
    detail: [
      {
        heading: "Why now",
        body: "Maps and search are both mature. Even so, 'what matters to me, in the place I am standing' is still something people work out for themselves.",
      },
      {
        heading: "What we need to check",
        body: "Whether narrowing by location and context actually makes information usable. We intend to test that small, first.",
      },
    ],
  },

  /* ── HOW WE BUILD / FOUNDRY (CORP-v1.2) ─────────────────────────────── */
  foundry: {
    eyebrow: "How we build",
    heading: ["From a problem", "to a company, in order."],
    lead:
      "We do not start from an idea we liked. We find a structural problem, verify it, design it as a business, team up with people who can run it, and carry it to an independent company. Yorisou calls that order the foundry.",
    stagesEyebrow: "Stages",
    stagesHeading: ["Eight stages,", "none of them skipped."],
    stages: [
      { no: "01", name: "Thesis", body: "Set out where the structural problem is — from the shape of the actual work, not from a hunch." },
      { no: "02", name: "Evidence", body: "Check whether the problem is real and who it falls on. Plenty of theses die here." },
      { no: "03", name: "Venture design", body: "Turn the answer into a business: who uses it, and where value is actually exchanged." },
      { no: "04", name: "Build", body: "Make it. Use shared ground where it exists, and spend the effort on what is specific to this venture." },
      { no: "05", name: "Venture ready", body: "Get the assets and the procedures to a state where someone outside can pick them up and run them." },
      { no: "06", name: "Founder formation", body: "Team up with someone who can carry it as their own — as a founder, not as an employee." },
      { no: "07", name: "Spin-out and operate", body: "Run it as an independent company, shaped so that it does not stay dependent on Yorisou." },
      { no: "08", name: "Learning", body: "Keep what worked and what died as material for the next venture." },
    ],
    independenceHeading: ["The goal is a company", "that stands on its own."],
    independenceBody: [
      "The point of the foundry is not to accumulate things under Yorisou. It is to get each venture to where it can stand as an independent company.",
      "So it is built to be handed over from the start. If the people running it cannot make the real decisions, it has not become a company.",
    ],
    asterionEyebrow: "Shared technology and execution",
    asterionHeading: ["Do not build", "the same thing twice."],
    asterionBody: [
      "Asterion OS is an independent shared technology and execution platform, positioned within Yorisou's foundry architecture. It is not owned by Yorisou.",
      "Because the common ground is there, no venture has to rebuild it, and each can concentrate on its own domain. What accumulates becomes the starting point for the next one.",
    ],
    asterionBoundaryTitle: "The boundary",
    asterionBoundaryBody:
      "Each venture is governed separately. Intellectual property, data and operating responsibility belong to the venture. Nothing is designed so that venture or user data flows automatically to the platform.",
    economicsHeading: ["Ownership follows", "contribution and responsibility."],
    economicsBody: [
      "The terms differ by venture. We do not apply one fixed formula to everything.",
      "Only the principle is shared: ownership follows contribution, the risk carried, and the responsibility that continues. People who run a venture hold real decision-making authority.",
      "The specifics are discussed per venture and per person. They are not the kind of thing that belongs on a website.",
    ],
    maturityTitle: "Where this stands",
    maturityBody:
      "This way of working is not a proven, repeatable method. Yorisou is early, and has not yet carried a venture out as an independent company. What is written here is how we actually proceed — not a claim about results.",
  },

  /* ── BUILD WITH US (CORP-v1.2) ──────────────────────────────────────── */
  buildWithUs: {
    eyebrow: "Build with us",
    heading: ["Where you come in", "depends on where you stand."],
    lead:
      "Yorisou carries a venture to just before it becomes a company, then teams up with someone who can carry it. So we are not looking for people to employ. We are looking for people to hand it to.",
    lanes: [
      {
        key: "founders",
        label: "Founder",
        title: "Founders and co-founders",
        body:
          "Taking on a venture that has been carried to just short of being a company, as your own. You come in as a founder, not as a hire — the decisions sit with you, and so does the responsibility.",
        invites: [
          "You have actually run something with real operations behind it",
          "You can move forward while a lot is still undecided",
          "You know one of: technology, manufacturing, government, or local work",
        ],
        offers: "Research and evidence, an early product, the business design, and shared infrastructure. You start partway, not from zero.",
        cannot: "We cannot promise a salary, funding, or ownership terms at this point. Terms are discussed per venture.",
        ventures: ["Mirai Move", "Kakari", "Chigamo"],
        state: "We are at the stage of wanting to listen. There is no open position.",
        cta: "Register interest",
      },
      {
        key: "team",
        label: "Founding team",
        title: "Founding team and specialists",
        body:
          "A founder alone is never enough. We are looking for people to hold one part of it — engineering, operations, or the field — from early on.",
        invites: [
          "You have seen things through to operation, not just to launch",
          "You have started something with a small team",
          "You know what is ordinary in your domain",
        ],
        offers: "A place from the beginning, and real latitude over the part you hold.",
        cannot: "There is no standing hiring pipeline. We cannot say we are in a position to hire right now.",
        ventures: ["Mirai Move", "Kakari"],
        state: "It depends on the venture's stage. Tell us what you could take on.",
        cta: "Start a conversation",
      },
      {
        key: "users",
        label: "Early users",
        title: "Early users and people testing with us",
        body:
          "We want people to look at what we have built from the position of actually using it — not to be told it is good, but to be told where it stops working.",
        invites: [
          "You have actually struggled with this problem",
          "You can say plainly what did not work",
          "You do not mind seeing something before it is public",
        ],
        offers: "A look at something mid-build, and what you say goes back into the design.",
        cannot: "We cannot promise a release date, that your request lands, or payment.",
        ventures: ["Kakari", "Mirai Move"],
        state: "We are looking for people to show it to. This is not a formal programme.",
        cta: "Register interest",
      },
      {
        key: "research",
        label: "Universities",
        title: "Universities and research",
        body:
          "Turning research into something society can use needs business design alongside it. We are looking for people to think about founder development and research implementation with.",
        invites: [
          "You are looking for somewhere research can land",
          "You want students and researchers to get real founding experience",
          "You would rather start from joint exploration",
        ],
        offers: "Business-side design, and work that is genuinely running. We can start from exploration.",
        cannot: "There is no research agreement, no funding, and no formal collaboration yet.",
        ventures: ["Mirai Move", "Chigamo"],
        state: "We have no partnership record. It starts with a conversation.",
        cta: "Start a conversation",
      },
      {
        key: "public",
        label: "Public sector",
        title: "Government and public sector",
        body:
          "The rules exist but were never translated into steps a resident can follow. We want to design the small test, the measurement, and the path to something that lasts.",
        invites: [
          "You have a problem that can be tried in the field",
          "You want it in a form where the effect can be measured",
          "You do not want it to end as a one-off pilot",
        ],
        offers: "Research, evidence organised into a usable shape, and a design for testing small.",
        cannot: "We have no track record with a municipality, and we cannot offer any procedural guarantee.",
        ventures: ["Mirai Move", "Kakari"],
        state: "It starts with a conversation. Nothing is in progress.",
        cta: "Get in touch",
      },
      {
        key: "corporate",
        label: "Companies",
        title: "Companies",
        body:
          "If you have a problem in your own operations that should become a business. We can start from joint development or a test in the field.",
        invites: [
          "There is an unsolved operational problem in your work",
          "You are looking for the shape of a new business",
          "You are looking for a development partner",
        ],
        offers: "Redesigning the problem as a business, from the beginning.",
        cannot: "We have no commercial track record and no case studies to show you.",
        ventures: ["Mirai Move", "Kakari", "Chigamo"],
        state: "It starts with listening.",
        cta: "Enquire",
      },
    ],
    intakeTitle: "About intake",
    intakeBody:
      "There is currently no application process and no selection programme. What is here is an invitation, not an existing partnership or an open role. We start by hearing what you have, and whether there is something to talk about.",
    foundingTeamEyebrow: "Founding team",
    foundingTeamHeading: ["We start building", "before there is a company."],
    foundingTeamBody: [
      "Usually a venture starts once people have gathered. Yorisou runs the other way round: the research and evidence, the early product and the business design come first, and then we look for the person who will take it on.",
      "So nobody starts from a blank page. You start by picking up something that already has a shape, and making it yours.",
      "What does not change is what taking it on means. Whoever holds the decisions holds the responsibility. If the people running it cannot make the real decisions, it has not become a company.",
    ],
    ctaHeading: ["Whoever you are,", "the way in is the same."],
    ctaBody: "Write what you have in mind and send it. We read them in order.",
  },
};
