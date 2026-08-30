import type { SiteCopy } from "../types";

/**
 * CORP-P5R2 — GERMAN. Translated from the Japanese canonical source (ja.ts), with en.ts as the
 * structural reference only.
 *
 * No claim here is stronger than the Japanese. No customer, partner, metric, revenue, funding,
 * market-position, team-size or capability claim appears that the Japanese does not already make.
 *
 * Legal form: the company is a Japanese LLC (godo kaisha). It is rendered as "Yorisou LLC"
 * (with "Yorisou GK" in the company overview) and NEVER as a joint-stock company. The
 * representative is "geschäftsführender Gesellschafter" — never a corporate chief-executive title.
 *
 * On education: "Harvard Business School Executive Education" is stated precisely. It is NOT a
 * Harvard degree and NOT an HBS MBA, and must never be shortened in a way that implies either.
 * No endorsement by IESE, Harvard, Ficosa or any public body is implied.
 */
export const de: SiteCopy = {
  chrome: {
    skip: "Zum Inhalt springen",
    menu: "Menü",
    menuToggle: "Menü öffnen und schließen",
    close: "Schließen",
    navLabel: "Seitennavigation",
    navLabelMobile: "Seitennavigation (mobil)",
    langLabel: "Anzeigesprache",
    langHeading: "Sprache wählen",
    langSearch: "Sprachen durchsuchen",
    langCurrent: "Aktuelle Sprache",
    previewBadge: "Preview — nicht veröffentlicht",
    nav: { home: "Startseite", miraiMove: "Mirai Move", kakari: "Kakari", about: "Über uns", company: "Unternehmen", contact: "Kontakt" },
    footerTagline: "Zwischen Mensch und Gesellschaft schaffen wir die nächste Form des Beistands.",
    footerProjects: "Projekte",
    footerCompany: "Unternehmen",
    footerLegalNote: "Alle hier genannten Angaben beruhen auf Aufzeichnungen, die wir überprüfen können.",
    backToTop: "Zum Seitenanfang",
  },

  meta: {
    home: { title: "Yorisou LLC — Zwischen Mensch und Gesellschaft schaffen wir die nächste Form des Beistands.", description: "Yorisou LLC betrachtet die Komplexität in Alltag, Arbeit und Region genau und entwickelt Produkte, die Menschen helfen, sie zu verstehen, zu entscheiden und weiterzukommen. Wir entwickeln Mirai Move und Kakari." },
    miraiMove: { title: "Mirai Move — Yorisou LLC", description: "Eine Plattform für Information, Vermittlung und Geschäftsentwicklung im japanischen Mobilitätsbereich. Die öffentliche Website ist online, die Plattformfunktionen befinden sich in Entwicklung." },
    kakari: { title: "Kakari — Yorisou LLC", description: "Mehrsprachige Unterstützung bei Behördenverfahren und Dokumenten – für Menschen, die in Japan leben, und für alle, die hier ein Unternehmen gründen. In Entwicklung und noch nicht allgemein verfügbar." },
    about: { title: "Über uns — Yorisou LLC", description: "Wofür Yorisou existiert, wie wir denken und wie wir entwickeln. Was wir nicht überprüfen können, schreiben wir nicht." },
    company: { title: "Unternehmen — Yorisou LLC", description: "Unternehmensprofil, Profil des geschäftsführenden Gesellschafters, Botschaft der Geschäftsführung und Geschäftsfelder von Yorisou LLC." },
    contact: { title: "Kontakt — Yorisou LLC", description: "Anfragen zu unserer Arbeit, zu Partnerschaften und von der Presse." },
  },

  common: {
    readMore: (name) => `Mehr über ${name}`,
    backHome: "Zurück zur Unternehmensübersicht",
    stageLabel: "Aktueller Stand",
    boundaryLabel: "Was wir nicht übernehmen",
  },

  home: {
    eyebrow: "Yorisou LLC",
    thesis: ["Zwischen Mensch und Gesellschaft", "schaffen wir die nächste", "Form des Beistands."],
    lead: ["Yorisou betrachtet die Komplexität in Alltag, Arbeit und Region genau", "und entwickelt Produkte, die Menschen helfen, sie zu verstehen, zu entscheiden und weiterzukommen."],
    humanSide: "Mensch",
    humanItems: ["Alltag", "Arbeit", "Region"],
    systemSide: "Systeme",
    systemItems: ["Mobilität", "Behördenverfahren"],
    fieldCaption: "Mensch — Alltag, Arbeit, Region  /  Systeme — Mobilität, Behördenverfahren",
    fieldRelation: "Beziehung",

    whyEyebrow: "Die Probleme, an denen wir arbeiten",
    whyHeading: ["Komplexität lässt sich nicht", "durch individuelle Anstrengung allein lösen."],
    whyBeats: [
      { no: "01", title: "„Ich verstehe es nicht“ hält Menschen schon an der Schwelle auf.", body: "Ein Angebot, das zwar besteht, aber nicht erreichbar ist, ist so gut wie nicht vorhanden." },
      { no: "02", title: "Der Weg bis zur Fachperson ist weit.", body: "Vor dem Punkt, an dem menschliches Urteilsvermögen wirklich nötig ist, liegt eine Strecke, die ein System übernehmen könnte." },
      { no: "03", title: "Praxis und System greifen nicht ineinander.", body: "In Mobilität, Pflege und Verwaltung gibt es Möglichkeiten, die bei den Menschen vor Ort noch nicht angekommen sind." },
    ],

    buildEyebrow: "Was wir entwickeln",
    buildHeading: ["Wir schaffen die nächste Form des Beistands –", "eine nach der anderen."],

    howEyebrow: "Wie wir entwickeln",
    howHeading: ["Wir nehmen die Komplexität auf uns", "und machen daraus etwas Nutzbares."],
    howBeats: [
      { no: "01", title: "Bei der Sprache der Praxis beginnen", body: "Wir denken nicht von der Technik her. Wir gehen von den tatsächlichen Schritten der Menschen aus, die feststecken." },
      { no: "02", title: "Verantwortung bis zum Verstehen übernehmen", body: "Informationen auszugeben ist nicht das Ende. Zu wissen, was als Nächstes zu tun ist, gehört zum Entwurf." },
      { no: "03", title: "Die Grenze deutlich machen", body: "Wir greifen nicht in Aufgaben ein, die zugelassenen Fachleuten vorbehalten sind. Was wir übernehmen und wo wir übergeben, steht im Produkt selbst." },
      { no: "04", title: "Nur sagen, was überprüfbar ist", body: "Ergebnisse, Zahlen und Partnerschaften nennen wir nur dort, wo es Belege gibt. Was sich nicht bestätigen lässt, schreiben wir nicht." },
    ],
    howDisclose: "Was diese Grundsätze in der Praxis bedeuten",

    founderEyebrow: "Geschäftsführung",
    founderHeading: ["Entwickelt von jemandem, der zwanzig Jahre lang", "in komplexen Industrien gearbeitet hat."],
    founderTeaser: "Über zwanzig Jahre in Automobil, Mobilität, Fertigung und internationalem Geschäft – immer zwischen Technik, Umsetzung und kommerzieller Realität. Immer wieder dasselbe Bild: ein gut gebautes System, das stehen bleibt, bevor es die Menschen erreicht, die es brauchen.",
    founderRole: "Geschäftsführender Gesellschafter, Yorisou LLC",
    founderCta: "Mehr über die Geschäftsführung",

    messageEyebrow: "Botschaft",
    messageHeading: ["Wir entscheiden danach, ob es ankommt –", "nicht danach, wie fortschrittlich es ist."],
    messageTeaser: "Woran wir arbeiten, ist nicht das Neue. Angebote und Möglichkeiten gibt es bereits – sie bleiben nur stehen, bevor sie die Menschen erreichen, die sie brauchen. Wir bauen ein Unternehmen, das diese Distanz Schritt für Schritt verkürzt.",
    messageCta: "Vollständige Botschaft lesen",

    originEyebrow: "Unser Standort",
    originHeading: ["Wir beginnen in Fukuoka."],
    originBody: "Yorisou LLC baut das Unternehmen von Fukuoka in Japan aus auf – an einem Ort, an dem Alltag, Arbeit und Region nah beieinanderliegen und der Entwurf bei den Schritten beginnen kann, die Menschen tatsächlich gehen.",

    proofEyebrow: "Unternehmen",
    proofHeading: ["Was wir sagen können –", "und nur das."],

    ctaEyebrow: "Kontakt",
    ctaHeading: ["Vielleicht gibt es Raum,", "gemeinsam daran zu arbeiten."],
    ctaBody: "Wir freuen uns über Anfragen zu unserer Arbeit, zu möglichen Partnerschaften und von der Presse. Wir antworten der Reihe nach, je nach Anliegen.",
    ctaButton: "Kontakt aufnehmen",
  },

  mirai: {
    eyebrow: "Projekt 01",
    heading: ["Eine Plattform für Information, Vermittlung", "und Geschäftsentwicklung", "im japanischen Mobilitätsbereich."],
    stage: "Öffentliche Website online / Plattformfunktionen in Entwicklung",
    lead: "Mirai Move soll Behörden und Kommunen, Unternehmen, Einrichtungen aus Pflege, Sozialwesen und Region, ausländische Zulieferer und inländische Partner verbinden, damit Informationen und Chancen rund um Mobilität als ein zusammenhängender Fluss behandelt werden können. Heute ist die öffentliche Informationswebsite online; die Plattformfunktionen befinden sich in Entwicklung.",
    domain: "Japanischer Mobilitätsbereich",
    networkEyebrow: "Wen die Plattform verbindet",
    networkHeading: ["Beteiligte mit unterschiedlichen Standpunkten", "sehen dieselbe Chance", "in unterschiedlichen Worten."],
    centre: "Chance auf Mobilität",
    parties: [
      { no: "01", title: "Behörden und Kommunen", body: "Auf der Seite von Regeln und Budget" },
      { no: "02", title: "Unternehmen", body: "Auf der Seite von Angebot und Umsetzung" },
      { no: "03", title: "Region, Pflege und Sozialwesen", body: "Dort, wo Mobilität tatsächlich stattfindet" },
      { no: "04", title: "Ausländische Zulieferer und inländische Partner", body: "Die Seite, die Möglichkeiten einbringt" },
    ],
    boundaryTitle: "Zum Entwicklungsstand",
    boundaryBody: "Die Plattform selbst befindet sich in Entwicklung. Eine autonome Ausführung durch Agenten ist nicht aktiviert. Jede Handlung, die nach außen wirkt, ist so ausgelegt, dass sie eine Bestätigung durch einen Menschen voraussetzt. Als fertige, voll funktionsfähige Plattform wird sie nicht angeboten.",
    detail: [
      { heading: "Das Problem, um das es geht", body: "Mobilitätsangebote bestehen getrennt voneinander – nach Region, nach Regelwerk, nach Anbieter. Wer eines braucht, und das Angebot, das es bereits gibt, begegnen einander nicht am selben Ort." },
      { heading: "Mit wem wir es zu tun haben", body: "Behörden und Kommunen, Unternehmen, Einrichtungen aus Pflege, Sozialwesen und Region, ausländische Zulieferer und inländische Partner. Beteiligte mit unterschiedlichen Positionen und Maßstäben sehen dieselbe Chance in unterschiedlichen Worten." },
      { heading: "Was heute läuft", body: "Die öffentliche Informationswebsite ist online. Die Funktionen der Plattform für Information, Vermittlung und Geschäftsentwicklung befinden sich im Aufbau von Grundlagen und Architektur." },
    ],
    siteLabel: "Öffentliche Website",
    siteUrl: "https://www.miraimove.com",
  },

  kakari: {
    eyebrow: "Projekt 02",
    heading: ["Mehrsprachige Unterstützung bei Verfahren", "und Dokumenten – für Menschen, die in Japan leben,", "und für alle, die hier ein Unternehmen gründen."],
    stage: "In Entwicklung (noch nicht allgemein verfügbar)",
    lead: "Wenn Sprache und Vorwissen zur Hürde werden, erreichen Menschen die Angebote nicht, die ihnen eigentlich offenstehen. Kakari unterstützt dabei, die nötigen Informationen zu finden, Unterlagen vorzubereiten, Formulare auszufüllen und den Weg bis zur Einreichung zu gehen – mehrsprachig. Kakari befindet sich derzeit in Entwicklung und ist noch nicht allgemein verfügbar.",
    domain: "Behördenverfahren und Dokumente / mehrsprachig",
    procedureEyebrow: "Der unterstützte Ablauf",
    procedureHeading: ["Vom Nachschlagen", "bis zur Einreichung."],
    steps: [
      { no: "01", title: "Nachschlagen", body: "Feststellen, welche Verfahren einen selbst betreffen" },
      { no: "02", title: "Unterlagen zusammenstellen", body: "Ermitteln, welche Dokumente und Anlagen nötig sind" },
      { no: "03", title: "Ausfüllen", body: "Die Formulare mehrsprachig ausfüllen und den Inhalt prüfen" },
      { no: "04", title: "Einreichen", body: "Hinweise dazu, wo, wie und auf welchem Postweg eingereicht wird" },
    ],
    boundaryTitle: "Wo Fachleute übernehmen",
    boundaryBody: "Wir handeln nicht stellvertretend als zugelassene Fachleute. Bereiche, in denen rechtliche, steuerliche oder behördliche Beurteilungen nötig sind, weisen wir ausdrücklich als Aufgaben aus, die Fachleute übernehmen. Beurteilungen oder Vertretungshandlungen, die eine berufsrechtliche Zulassung voraussetzen – etwa als Rechtsanwalt, Steuerberater oder Verwaltungsschreiber (gyosei shoshi) –, gehören nicht zu den Funktionen von Kakari.",
    detail: [
      { heading: "Das Problem, um das es geht", body: "Wie ein Verfahren abläuft, ist öffentlich zugänglich. Trotzdem erreichen Menschen das Angebot nicht, allein weil Sprache und vorausgesetztes Wissen fehlen. Das ist kein Mangel an Fähigkeit." },
      { heading: "Mit wem wir es zu tun haben", body: "Menschen, die in Japan leben, und Menschen, die hier ein Unternehmen gründen wollen – all jene, denen es schwerfällt, ein Verfahren allein und auf Japanisch zu durchlaufen." },
      { heading: "Was heute läuft", body: "Die Authentifizierungsgrundlage ist in einer eigenständigen Testumgebung aufgebaut; dort werden Berechtigungen und Speicher überprüft. Externe Anbindungen bleiben deaktiviert, und öffentlich verfügbar ist Kakari nicht." },
    ],
  },

  about: {
    eyebrow: "Über uns",
    heading: ["Wie wir entwickeln,", "ist das Versprechen, das wir geben."],
    lead: "Yorisou betrachtet die Komplexität in Alltag, Arbeit und Region genau und entwickelt Produkte, die Menschen helfen, sie zu verstehen, zu entscheiden und weiterzukommen.",
    whyHeading: ["Warum es dieses Unternehmen gibt."],
    whyBody: [
      "Angebote, Technik und Möglichkeiten gibt es bereits in großer Zahl. Trotzdem bleiben sie stehen, bevor sie die Menschen erreichen, die sie brauchen. Diese letzte Distanz ist das, woran wir arbeiten.",
      "Diese Distanz wird meist als Frage individueller Anstrengung oder mangelnder Information beschrieben. Tatsächlich wird jedoch häufig einfach Komplexität an den Einzelnen weitergereicht, die das System selbst hätte auffangen können.",
    ],
    thinkHeading: ["Wie wir denken."],
    thinkBody: [
      "Wir denken nicht von der Technik her. Wir beginnen damit, den einen Schritt zu lösen, der gerade feststeckt: die Situation eines Menschen erfassen, sie als Beziehungen ordnen und bis zu dem Punkt tragen, an dem der nächste Schritt klar ist. So weit reicht der Entwurf.",
      "KI setzen wir für dieses Verstehen und Strukturieren ein – nicht, um die Entscheidung zu übernehmen. Ihre Aufgabe ist es, das Material, das ein Mensch zum Entscheiden braucht, in eine nutzbare Form zu bringen. Urteil und Verantwortung bleiben beim Menschen.",
    ],
    buildHeading: ["Wie wir entwickeln."],
    principles: [
      { no: "01", title: "Bei der Sprache der Praxis beginnen", body: "Wir denken nicht von der Technik her. Wir gehen von den tatsächlichen Schritten der Menschen aus, die feststecken." },
      { no: "02", title: "Verantwortung bis zum Verstehen übernehmen", body: "Informationen auszugeben ist nicht das Ende. Zu wissen, was als Nächstes zu tun ist, gehört zum Entwurf." },
      { no: "03", title: "Die Grenze deutlich machen", body: "Wir greifen nicht in Aufgaben ein, die zugelassenen Fachleuten vorbehalten sind. Was wir übernehmen und wo wir übergeben, steht im Produkt selbst." },
      { no: "04", title: "Nur sagen, was überprüfbar ist", body: "Ergebnisse, Zahlen und Partnerschaften nennen wir nur dort, wo es Belege gibt. Was sich nicht bestätigen lässt, schreiben wir nicht." },
    ],
    principlesLong: [
      { no: "01", title: "Bei der Sprache der Praxis beginnen", long: "Kein Angebot erreicht jemanden, solange es nicht in die Schritte übersetzt ist, die der Mensch davor tatsächlich geht. Wir beginnen beim tatsächlichen Antrag, beim tatsächlichen Weg, beim tatsächlichen Austausch – nicht bei einer abstrakten Problemstellung, sondern bei dem einen Schritt, der gerade feststeckt." },
      { no: "02", title: "Verantwortung bis zum Verstehen übernehmen", long: "Suchergebnisse aufzulisten ist keine Unterstützung. Was ein Mensch braucht, ist zu wissen, was als Nächstes zu tun ist. Das Produkt reicht bis zu dem Punkt, an dem der nächste Schritt verstanden ist – nicht bis zu dem Punkt, an dem Informationen angezeigt wurden." },
      { no: "03", title: "Die Grenze deutlich machen", long: "Menschen etwas nutzen zu lassen, ohne klar zu sagen, was es nicht kann, ist der gefährlichste Entwurf überhaupt. Was wir übernehmen und wo wir an Fachleute übergeben, schreiben wir auf den Bildschirm selbst. Die Grenze ist Teil der Funktion, kein Hinweis im Kleingedruckten." },
      { no: "04", title: "Nur sagen, was überprüfbar ist", long: "Wir sprechen weder über Ergebnisse, die wir nicht bestätigen können, noch über Funktionen, die noch nicht laufen. Hinter jeder Angabe, die wir veröffentlichen, steht eine Aufzeichnung. In Zeiten, in denen wir wenig sagen können, veröffentlichen wir wenig." },
    ],
    orderHeading: ["Eines nach dem anderen –", "und ganz zu Ende."],
    orderBody: "Wir beginnen nicht vieles auf einmal. Lieber führen wir ein Feld so weit, dass es die Schritte erreicht, die Menschen tatsächlich gehen.",
    claimsHeading: ["Was wir nicht überprüfen können,", "schreiben wir nicht."],
    claimsBody: "Hinter jeder Angabe, die wir veröffentlichen, steht eine Aufzeichnung. In Zeiten, in denen wir wenig sagen können, veröffentlichen wir wenig.",
  },

  company: {
    eyebrow: "Unternehmen",
    heading: ["Yorisou LLC"],
    intro: "Yorisou LLC entwickelt Produkte, die die Komplexität von Alltag, Arbeit und Region in etwas verwandeln, das Menschen verstehen, abwägen und in Handeln überführen können. Von Fukuoka aus arbeiten wir an zwei Projekten: Mirai Move und Kakari.",

    messageEyebrow: "Botschaft der Geschäftsführung",
    messageHeading: ["Wir entscheiden danach, ob es ankommt –", "nicht danach, wie fortschrittlich es ist."],
    message: [
      "Woran wir arbeiten, ist nicht das Neue.",
      "Über zwanzig Jahre lang stand ich in Automobil, Mobilität und Fertigung zwischen Technik, Umsetzung und kommerzieller Realität. Immer wieder dasselbe Bild: ein gut gebautes System, das stehen bleibt, bevor es die Menschen erreicht, die es brauchen. Nicht weil die Technik fehlte, sondern weil sie nie in die Schritte übersetzt wurde, die diese Menschen tatsächlich gehen.",
      "Angebote und Möglichkeiten gibt es bereits in großer Zahl. Wenn jemand aber nicht erkennen kann, ob sie ihn betreffen oder was als Nächstes zu tun ist, ist es, als gäbe es sie nicht. Diese letzte Distanz zu schließen – sie vom System auffangen zu lassen statt vom Einzelnen – ist der Grund, warum Yorisou entstanden ist.",
      "Wir setzen KI nicht ein, um Entscheidungen zu übernehmen. Wir setzen sie ein, um die Situation zu erfassen, sie als Beziehungen zu ordnen und in eine nutzbare Form zu bringen, damit ein Mensch entscheiden kann. Urteil und Verantwortung bleiben beim Menschen. Was wir übernehmen und wo wir an Fachleute übergeben, schreiben wir auf den Bildschirm selbst.",
      "Als Unternehmen sind wir noch klein, und es gibt nicht viel, was wir schreiben können. Genau deshalb schreiben wir nur, was wir überprüfen konnten. Wachsen sollte nicht die Behauptung, sondern der Nachweis, tatsächlich angekommen zu sein.",
    ],
    messageSignature: "Jin Yang",
    messageRole: "Geschäftsführender Gesellschafter, Yorisou LLC",

    profileEyebrow: "Geschäftsführung",
    profileHeading: ["Über den geschäftsführenden Gesellschafter"],
    profileName: "Jin Yang",
    profileNameLatin: "Jin Yang / Edward Jin",
    profileRole: "Geschäftsführender Gesellschafter, Yorisou LLC",
    profileBody: [
      "Über zwanzig Jahre Berufserfahrung in Automobil, Mobilität, Fertigung, industrieller Projektentwicklung, Lieferkette, Geschäftsentwicklung und Produktentwicklung sowie im grenzüberschreitenden internationalen Geschäft.",
    ],
    profileBackgroundLabel: "Werdegang",
    profileBackground: [
      "Leitende Verantwortung für kommerzielle und industrielle Projekte bei Ficosa, einem internationalen Automobilzulieferer, unter anderem im Zusammenhang mit globalen Industrieprojekten und kommerziellen Aktivitäten in Asien.",
      "Anschließend Gründung und Leitung von Technologie- und Fertigungsunternehmen in China, unter anderem in den Bereichen Fahrzeugelektronik, Steuerungssysteme, Präzisionsfertigung sowie KI-gestützte Produkt- und Systementwicklung.",
      "Erfahrung im internationalen Geschäftsbetrieb in mehreren Märkten, darunter Europa, China und Japan.",
      "Heute geschäftsführender Gesellschafter von Yorisou LLC in Japan und baut das Unternehmen von Fukuoka aus auf.",
    ],
    profileEducationLabel: "Ausbildung",
    profileEducation: [
      "MBA, IESE Business School",
      "General Management Program, Harvard Business School Executive Education",
    ],
    profileRelevanceLabel: "Warum dieser Werdegang zu Yorisou führt",
    profileRelevance: [
      "Langjährige Praxis quer durch komplexe, reale Industrien.",
      "Eine Position an der Schnittstelle von Technik, Fertigung, kommerzieller Umsetzung und internationalen Märkten.",
      "Der unmittelbare Blick auf die Lücke zwischen dem, was Systeme und Technik können, und dem, was Menschen und Organisationen tatsächlich nutzen können.",
      "Und daraus der Anlass, Produkte zu entwickeln, die Komplexität in etwas Verständliches und Handhabbares verwandeln.",
    ],

    overviewEyebrow: "Unternehmensprofil",
    overviewHeading: ["Unternehmensprofil"],
    facts: [
      { label: "Firma", value: "Yorisou LLC (Yorisou GK)" },
      { label: "Geschäftsführender Gesellschafter", value: "Jin Yang" },
      { label: "Sitz", value: "Stadt Fukuoka, Präfektur Fukuoka, Japan" },
      { label: "Geschäftstätigkeit", value: "Planung, Entwicklung und Betrieb von Mirai Move und Kakari" },
    ],

    businessEyebrow: "Geschäftsfelder",
    businessHeading: ["Geschäftsfelder"],
    businessBody: "Information, Vermittlung und Geschäftsentwicklung im Mobilitätsbereich sowie mehrsprachige Unterstützung bei Behördenverfahren und Dokumenten für Menschen, die in Japan leben, und für alle, die hier ein Unternehmen gründen. Beides folgt demselben Grundsatz: die Komplexität aufnehmen und etwas Nutzbares zurückgeben.",

    projectsEyebrow: "Projekte",
    projectsHeading: ["Woran wir arbeiten"],

    originEyebrow: "Unser Standort",
    originHeading: ["Wir beginnen in Fukuoka."],
    originBody: [
      "Yorisou LLC baut das Unternehmen von der Stadt Fukuoka in Japan aus auf.",
      "Es ist ein Ort, an dem Alltag, Arbeit und Region nah beieinanderliegen – und an dem der Entwurf bei den Schritten beginnen kann, die Menschen tatsächlich gehen.",
    ],

    ctaHeading: ["Kontakt"],
    ctaBody: "Wir freuen uns über Anfragen zu unserer Arbeit, zu möglichen Partnerschaften und von der Presse.",
  },

  contact: {
    eyebrow: "Kontakt",
    heading: ["Kontakt"],
    lead: "Wir freuen uns über Anfragen zu unserer Arbeit, zu möglichen Partnerschaften und von der Presse. Wir antworten der Reihe nach, je nach Anliegen.",
    channelsHeading: ["Worum es gehen kann"],
    channels: [
      { title: "Allgemeine Anfragen", body: "Fragen zu Yorisou als Unternehmen und zu den Projekten, an denen wir arbeiten." },
      { title: "Geschäft und Partnerschaften", body: "Zusammenarbeit oder geschäftliche Gespräche in den Bereichen Mobilität und Behördenverfahren." },
      { title: "Presse und Medien", body: "Interviewanfragen sowie Fragen zum Unternehmen oder zur Geschäftsführung." },
    ],
    formHeading: ["Schreiben Sie uns"],
    formIntro: "Nutzen Sie das folgende Formular. Wir lesen jede Anfrage und antworten der Reihe nach.",
    fields: {
      name: "Name", namePlaceholder: "Ihr Name",
      email: "E-Mail-Adresse", emailPlaceholder: "you@example.com",
      org: "Unternehmen oder Organisation", orgPlaceholder: "Optional",
      type: "Art der Anfrage",
      message: "Nachricht", messagePlaceholder: "Beschreiben Sie den Hintergrund und was Sie klären möchten.",
    },
    types: [
      { value: "general", label: "Allgemeine Anfrage" },
      { value: "business", label: "Geschäft und Partnerschaften" },
      { value: "media", label: "Presse und Medien" },
    ],
    submit: "Senden",
    sending: "Wird gesendet …",
    successTitle: "Nachricht gesendet",
    successBody: "Wir haben Ihre Anfrage erhalten. Wir prüfen sie und melden uns der Reihe nach.",
    errorTitle: "Senden nicht möglich",
    errorBody: "Bitte warten Sie einen Moment und versuchen Sie es erneut.",
    required: "Pflichtfeld",
    privacyNote: "Ihre personenbezogenen Daten verwenden wir ausschließlich zur Beantwortung Ihrer Anfrage.",
  },
};
