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
    footerTagline: "Strukturprobleme zu Unternehmen machen.",
    footerProjects: "Projekte",
    footerCompany: "Unternehmen",
    footerLegalNote: "Alle hier genannten Angaben beruhen auf Aufzeichnungen, die wir überprüfen können.",
    backToTop: "Zum Seitenanfang",
  },

  meta: {
    home: { title: "Yorisou LLC — Von strukturellen Problemen zu Unternehmen, die für sich stehen.", description: "Yorisou LLC ist eine Foundry: Wir finden strukturelle Probleme, erarbeiten Belege und geschäftliche Grundlagen und bilden Gründungsteams, um daraus eigenständige Unternehmen zu machen. In Arbeit sind Mirai Move, Kakari und Chigamo." },
    miraiMove: { title: "Mirai Move — Yorisou LLC", description: "Eine Plattform für Information, Vermittlung und Geschäftsentwicklung im japanischen Mobilitätsbereich. Die öffentliche Website ist online, die Plattformfunktionen befinden sich in Entwicklung." },
    kakari: { title: "Kakari — Yorisou LLC", description: "Mehrsprachige Unterstützung bei Behördenverfahren und Dokumenten – für Menschen, die in Japan leben, und für alle, die hier ein Unternehmen gründen. In Entwicklung und noch nicht allgemein verfügbar." },
    about: { title: "Wie wir entwickeln — Yorisou LLC", description: "Das Problem finden, es überprüfen, es als Geschäft entwerfen, ein Gründungsteam bilden und es bis zum eigenständigen Unternehmen tragen. Wie die Foundry von Yorisou vorgeht und wo die gemeinsame Basis steht." },
    company: { title: "Unternehmen — Yorisou LLC", description: "Unternehmensprofil, Profil des geschäftsführenden Gesellschafters, Botschaft der Geschäftsführung und Geschäftsfelder von Yorisou LLC." },
    contact: { title: "Kontakt — Yorisou LLC", description: "Anfragen zu unserer Arbeit, zu Partnerschaften und von der Presse." },
    ventures: { title: "Projekte — Yorisou LLC", description: "Woran Yorisou gerade arbeitet: Mirai Move, Kakari und Chigamo. Jedes steht an einem anderen Punkt, und wir schreiben, an welchem." },
    buildWithUs: { title: "Gemeinsam entwickeln — Yorisou LLC", description: "Einstiege für Gründerinnen und Gründer, für Forschung, Verwaltung und Unternehmen. Es gibt kein Bewerbungsverfahren; wir beginnen mit einem Gespräch." },
    chigamo: { title: "Chigamo — Yorisou LLC", description: "Ein Konzept dafür, aus Ort und Kontext sichtbar zu machen, was an einem Ort tatsächlich weiterhilft. Derzeit im Konzeptstadium; es gibt nichts öffentlich Verfügbares." },
  },

  common: {
    readMore: (name) => `Mehr über ${name}`,
    backHome: "Zurück zur Unternehmensübersicht",
    stageLabel: "Aktueller Stand",
    boundaryLabel: "Was wir nicht übernehmen",
    nowLabel: "Jetzt",
    nextLabel: "Nächster Schritt",
    whoLabel: "Mit wem wir sprechen möchten",
  },

  home: {
    eyebrow: "Yorisou LLC",
    hook: ["Strukturprobleme", "zu Unternehmen machen."],
    thesis: ["Aus strukturellen Problemen", "bauen wir Unternehmen auf,", "die eigenständig bestehen."],
    lead: [
      "Yorisou ist eine Foundry: Wir finden strukturelle Probleme in der Gesellschaft,",
      "überprüfen sie, entwerfen sie als Geschäft und tun uns mit den Menschen zusammen,",
      "die sie führen werden – bis hin zu eigenständigen Unternehmen.",
    ],
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
    buildHeading: ["Drei Bereiche,", "an denen wir gerade arbeiten."],

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

    /* CORP-v1.2 — Asterion-Ebene und Beteiligungsebene auf der Startseite. */
    asterionEyebrow: "Gemeinsame Basis",
    asterionHeading: ["Mit jedem Vorhaben", "wächst das Fundament."],
    asterionBody:
      "Asterion OS ist eine eigenständige, gemeinsam genutzte Technologie- und Umsetzungsplattform, die innerhalb der Foundry-Architektur von Yorisou ihren Platz hat. Weil die gemeinsame Grundlage bereits da ist, kann jedes Vorhaben seine Kraft auf das verwenden, was wirklich sein eigenes ist.",
    asterionNote:
      "Jedes Vorhaben wird getrennt geführt; geistiges Eigentum, Daten und operative Verantwortung liegen jeweils bei ihm. Asterion ist nicht Eigentum von Yorisou.",
    engageEyebrow: "Gemeinsam entwickeln",
    engageHeading: ["Kommen Sie dazu, solange", "daraus erst ein Unternehmen wird."],
    engageBody:
      "Gründerinnen und Gründer, Forschung, Verwaltung, Unternehmen. Wo Sie einsteigen können, hängt davon ab, wo Sie stehen. Wir beginnen mit dem, worüber sich jetzt sprechen lässt.",
    engageCta: "Die Einstiege ansehen",
    engageNote: "Alle Einstiege beginnen mit einem Gespräch. Ein Bewerbungsverfahren und ein Auswahlprogramm gibt es noch nicht.",
    explainerLabel: "Yorisou in 30 Sekunden",
    explainerHeading: ["Vom Problem zum Unternehmen –", "in dreißig Sekunden."],
    explainerClose: "Schließen",
    explainerPlay: "Abspielen",
    explainerPause: "Pause",
    explainerRestart: "Von vorne",
    explainerStepLabel: "Schritt",
  },

  mirai: {
    reading: "Regionale Mobilität bis zur Lösung bringen.",
    now: "Die öffentliche Website läuft, und das System, das öffentliche Quellen fortlaufend liest, läuft von selbst weiter. Nach außen gegangen ist bisher nichts – kein einziges Mal.",
    next: "Beim ersten substanziellen Fall bleiben Fragen offen, die sich nicht am Schreibtisch klären lassen. Ab hier ist ein Mensch an der Reihe.",
    who: "Menschen, die regionale Mobilität von innen kennen – aus einer Kommune, von einem Verkehrsbetrieb, aus der Praxis – und die tatsächlichen Sachzwänge benennen können.",
    join: {
      title: "An diesem Vorhaben mitarbeiten",
      body: "Gebraucht wird jetzt jemand, der die Sachzwänge vor Ort konkret beschreiben kann. Wir sind in der Phase des Prüfens, nicht des Verkaufens.",
      roles: [
        "Sie arbeiten in regionalem Verkehr oder in Mobilität – in einer Kommune, bei einem Betreiber oder vor Ort",
        "Sie könnten dieses Feld als Gründerin, Gründer oder Betreiber tragen",
        "Sie wissen, wie der Betrieb tatsächlich läuft",
      ],
      state: "Wir sind an dem Punkt, an dem wir zuhören möchten. Eine ausgeschriebene Stelle gibt es nicht.",
    },
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
    reading: "Damit man Verfahren in Japan selbst bewältigen kann.",
    now: "Eine nicht öffentliche Testphase. Kakari ist nicht allgemein verfügbar, und es nutzt es bislang niemand.",
    next: "Die Schritte, die für eine Verbreitung nötig sind, und die endgültigen Registerangaben des Unternehmens. Beides braucht eine Bestätigung von außen.",
    who: "Menschen mit ausländischer Staatsangehörigkeit, die in Japan leben, Menschen, die sie unterstützen, und zugelassene Fachleute.",
    join: {
      title: "An diesem Vorhaben mitarbeiten",
      body: "Zuerst sollen Menschen daraufschauen, die wissen, wie diese Verfahren wirklich sind. Kakari ist kein Werkzeug, das Fachleute ersetzt.",
      roles: [
        "Sie sind an einem Verfahren in Japan selbst hängengeblieben",
        "Sie unterstützen Menschen mit ausländischer Staatsangehörigkeit",
        "Sie sind zugelassene Fachperson und könnten mit uns prüfen, wo die Grenze verläuft",
        "Sie könnten dieses Vorhaben als Gründerin, Gründer oder Betreiber tragen",
      ],
      state: "Wir suchen Menschen, denen wir es zeigen können. Nichts ist veröffentlicht, und nichts ist ausgeschrieben.",
    },
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
      { label: "Unternehmensnummer (hōjin bangō)", value: "2290003018125" },
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

  /* ── PROJEKTÜBERSICHT (CORP-v1.2) ───────────────────────────────────── */
  ventures: {
    eyebrow: "Woran wir gerade arbeiten",
    heading: ["Drei Felder,", "jedes kurz davor,", "ein Unternehmen zu werden."],
    lead:
      "In allen dreien gibt es die Regeln und die Systeme längst – und sie bleiben kurz vor den Menschen stehen, die sie brauchen. Genau in dieser Lücke arbeitet Yorisou und prüft dabei Schritt für Schritt.",
    cards: [
      {
        name: "Mirai Move",
        href: "/mirai-move",
        thesis: "Information, Vermittlung und Geschäftsentwicklung im Mobilitätsbereich zusammenführen.",
        problem: "Zwischen Anbietern, Regionen und Behörden liegen Informationen und Chancen getrennt voneinander.",
        building: "Eine Plattform, auf der Beteiligte im In- und Ausland von derselben Informationsgrundlage aus sprechen können.",
        status: "In Entwicklung und im Betrieb. Öffentliche Website online.",
      },
      {
        name: "Kakari",
        href: "/kakari",
        thesis: "Verfahren mehrsprachig begleiten – für Menschen, die in Japan leben oder hier gründen.",
        problem: "Die Angebote bestehen, doch Sprache und Ablauf sorgen dafür, dass sie ungenutzt bleiben.",
        building: "Ein Weg, ein Verfahren in Etappen zu zerlegen und zu zeigen, wie weit man allein kommt.",
        status: "In Entwicklung. In Vorbereitung auf die Veröffentlichung.",
      },
      {
        name: "Chigamo",
        href: "/chigamo",
        thesis: "Einen Ort aus Lage und Kontext heraus verständlich machen.",
        problem: "Gerade die Informationen, die vor Ort wirklich helfen, findet man am schwersten.",
        building: "Ein Weg, den eigenen Lebensraum über Ort und Kontext zu erschließen.",
        status: "Konzeptstadium. Die Erprobung steht noch aus.",
      },
    ],
    noteHeading: ["Was diese Seite sagt", "– und was nicht."],
    noteBody: [
      "Hier stehen die Projekte und Konzepte, an denen Yorisou gerade arbeitet.",
      "Es sind keine eingetragenen Tochtergesellschaften, keine Beteiligungen und keine Kunden. Sie stehen an unterschiedlichen Punkten, und wir haben den jeweiligen Stand so geschrieben, wie er ist.",
      "Das Ziel ist, dass jedes für sich als eigenständiges Unternehmen bestehen kann. Erreicht hat das bisher keines.",
    ],
  },

  /* ── CHIGAMO (CORP-v1.2) ────────────────────────────────────────────── */
  chigamo: {
    reading: "Einen Ort verstehen, während man darin steht.",
    now: "Konzeptstadium. Es gibt kein veröffentlichtes Produkt, keine Nutzerinnen und Nutzer und keine Zusammenarbeit mit einer Kommune.",
    next: "Ob Informationen tatsächlich nutzbar werden, wenn man sie nach Ort und Kontext eingrenzt. Das prüfen wir zuerst im Kleinen.",
    who: "Menschen, die einen bestimmten Ort wirklich kennen und sagen können, wo Informationen über den eigenen Lebensraum aufhören zu taugen.",
    join: {
      title: "An diesem Vorhaben mitarbeiten",
      body: "Das steht noch vor der Erprobung. Wir suchen deshalb weniger Menschen, die mitbauen, als Menschen, die unsere Annahme zerlegen.",
      roles: [
        "Sie kennen eine bestimmte Gegend genau – aus dem Leben dort",
        "Sie haben mit Standort- oder Regionaldaten gearbeitet",
        "Es stört Sie nicht, schon im Konzeptstadium dabei zu sein",
      ],
      state: "Konzeptstadium. Wie eine Mitarbeit aussehen kann, ist noch nicht entschieden.",
    },
    eyebrow: "Projekt",
    heading: ["Einen Ort verstehen,", "während man darin steht."],
    stage: "Konzeptstadium",
    lead:
      "Ein Konzept: aus Ort und Kontext sichtbar machen, was an einem bestimmten Ort wirklich weiterhilft. Es steht noch vor der Erprobung.",
    domain: "Lebensraum / Ort und Kontext / Entdecken",
    conceptEyebrow: "Der Gedanke dahinter",
    conceptHeading: ["Die Information fehlt nicht.", "Sie kommt nur nicht an."],
    conceptBody: [
      "Ausgerechnet das, was man über einen Ort wirklich wissen möchte, liefert die Suche am schlechtesten. Nicht, weil die Information fehlte, sondern weil sie nie nach Ort und Situation geordnet wurde.",
      "Wo man ist, wann es ist und worum es gerade geht: Manche Information wird erst dann als die eigene erkennbar, wenn diese drei zusammenkommen. Genau daran versucht Chigamo zu arbeiten.",
    ],
    boundaryTitle: "Der aktuelle Stand",
    boundaryBody:
      "Chigamo befindet sich im Konzeptstadium. Es gibt kein veröffentlichtes Produkt, keine Nutzerinnen und Nutzer und keine Zusammenarbeit mit einer Kommune. Was hier steht, ist eine Annahme, die wir überprüfen wollen.",
    detail: [
      {
        heading: "Warum jetzt",
        body: "Karten und Suche sind beide ausgereift. Trotzdem müssen Menschen immer noch selbst herausfinden, was an dem Ort, an dem sie gerade stehen, für sie Bedeutung hat.",
      },
      {
        heading: "Was wir überprüfen müssen",
        body: "Ob Informationen tatsächlich nutzbar werden, wenn man sie nach Ort und Kontext eingrenzt. Das wollen wir zuerst im Kleinen prüfen.",
      },
    ],
  },

  /* ── WIE WIR ENTWICKELN / FOUNDRY (CORP-v1.2) ───────────────────────── */
  foundry: {
    eyebrow: "Wie wir entwickeln",
    heading: ["Vom Problem", "bis zum Unternehmen –", "der Reihe nach."],
    lead:
      "Wir beginnen nicht bei einer Idee, die uns gefallen hat. Wir finden ein strukturelles Problem, überprüfen es, entwerfen es als Geschäft, tun uns mit Menschen zusammen, die es führen können, und tragen es bis zum eigenständigen Unternehmen. Diese Reihenfolge nennt Yorisou seine Foundry.",
    stagesEyebrow: "Etappen",
    stagesHeading: ["Acht Etappen,", "keine davon übersprungen."],
    stages: [
      { no: "01", name: "Hypothese", body: "Bestimmen, wo das strukturelle Problem liegt – aus der Form der tatsächlichen Arbeit, nicht aus einer Ahnung." },
      { no: "02", name: "Belege", body: "Prüfen, ob das Problem wirklich besteht und wen es trifft. An dieser Stelle enden viele Hypothesen." },
      { no: "03", name: "Geschäftsentwurf", body: "Die Lösung in die Form eines Geschäfts bringen: wer sie nutzt und wo tatsächlich ein Wert entsteht." },
      { no: "04", name: "Aufbau", body: "Tatsächlich bauen. Die gemeinsame Basis nutzen, wo es sie gibt, und die Kraft auf das verwenden, was diesem Vorhaben eigen ist." },
      { no: "05", name: "Tragfähig als Geschäft", body: "Werte und Abläufe so weit bringen, dass Außenstehende sie übernehmen und weiterführen können." },
      { no: "06", name: "Gründungsteam", body: "Sich mit jemandem zusammentun, der das Vorhaben als sein eigenes tragen kann – als Gründung, nicht als Anstellung." },
      { no: "07", name: "Ausgründung und Betrieb", body: "Als eigenständiges Unternehmen führen, angelegt so, dass es nicht von Yorisou abhängig bleibt." },
      { no: "08", name: "Lernen", body: "Was funktioniert hat und was gescheitert ist, bleibt als Material für das nächste Vorhaben." },
    ],
    independenceHeading: ["Das Ziel ist ein Unternehmen,", "das für sich steht."],
    independenceBody: [
      "Der Zweck der Foundry ist nicht, unter Yorisou etwas anzuhäufen. Er ist, jedes Vorhaben so weit zu bringen, dass es als eigenständiges Unternehmen bestehen kann.",
      "Deshalb bauen wir es von Anfang an so, dass es übergeben werden kann. Wenn die Menschen, die es führen, nicht wirklich entscheiden können, ist daraus kein Unternehmen geworden.",
    ],
    asterionEyebrow: "Gemeinsame Technik- und Umsetzungsbasis",
    asterionHeading: ["Dasselbe", "nicht zweimal bauen."],
    asterionBody: [
      "Asterion OS ist eine eigenständige, gemeinsam genutzte Technologie- und Umsetzungsplattform, die innerhalb der Foundry-Architektur von Yorisou ihren Platz hat. Yorisou ist nicht ihr Eigentümer.",
      "Weil diese gemeinsame Grundlage vorhanden ist, muss kein Vorhaben sie erneut bauen, und jedes kann sich auf sein eigenes Feld konzentrieren. Was sich dabei ansammelt, wird zum Ausgangspunkt für das nächste.",
    ],
    asterionBoundaryTitle: "Die Grenze",
    asterionBoundaryBody:
      "Jedes Vorhaben wird getrennt geführt. Geistiges Eigentum, Daten und operative Verantwortung liegen beim jeweiligen Vorhaben. Nichts ist so angelegt, dass Daten aus einem Vorhaben oder von dessen Nutzerinnen und Nutzern automatisch an die Plattform fließen.",
    economicsHeading: ["Anteile richten sich nach", "Beitrag und Verantwortung."],
    economicsBody: [
      "Die Bedingungen unterscheiden sich von Vorhaben zu Vorhaben. Wir legen nicht eine feste Formel über alles.",
      "Gemeinsam ist nur der Grundsatz: Anteile richten sich nach dem Beitrag, nach dem getragenen Risiko und nach der Verantwortung, die bleibt. Wer ein Vorhaben führt, hat tatsächliche Entscheidungsbefugnis.",
      "Das Konkrete besprechen wir je Vorhaben und je Person. Es ist nicht die Art von Sache, die auf eine Website gehört.",
    ],
    maturityTitle: "Der aktuelle Stand",
    maturityBody:
      "Diese Arbeitsweise ist keine erprobte, wiederholbare Methode. Yorisou steht am Anfang und hat noch kein Vorhaben als eigenständiges Unternehmen ausgegründet. Was hier steht, ist die Art, wie wir tatsächlich vorgehen – keine Aussage über Ergebnisse.",
  },

  /* ── GEMEINSAM ENTWICKELN (CORP-v1.2) ───────────────────────────────── */
  buildWithUs: {
    eyebrow: "Gemeinsam entwickeln",
    heading: ["Wo Sie einsteigen,", "hängt davon ab, wo Sie stehen."],
    lead:
      "Yorisou entwickelt ein Vorhaben bis kurz vor den Punkt, an dem daraus ein Unternehmen wird, und tut sich dann mit jemandem zusammen, der es tragen kann. Wir suchen deshalb keine Angestellten, sondern Menschen, die es übernehmen.",
    lanes: [
      {
        key: "founders",
        label: "Gründung",
        title: "Gründung und Mitgründung",
        body:
          "Ein Vorhaben, das bis kurz vor das Unternehmen gediehen ist, als das eigene übernehmen. Sie kommen als Gründerin oder Gründer dazu, nicht als angestellte Kraft: Die Entscheidungen liegen bei Ihnen, und die Verantwortung ebenso.",
        invites: [
          "Sie haben tatsächlich etwas geführt, hinter dem ein realer Betrieb stand",
          "Sie kommen voran, während vieles noch offen ist",
          "Sie kennen sich in einem dieser Felder aus: Technik, Fertigung, Verwaltung oder Arbeit vor Ort",
        ],
        offers: "Recherche und Belege, ein frühes Produkt, den Geschäftsentwurf und die gemeinsame Basis. Sie beginnen nicht bei null, sondern auf halbem Weg.",
        cannot: "Ein Gehalt, eine Finanzierung und Bedingungen für Anteile können wir zum jetzigen Zeitpunkt nicht zusagen. Die Bedingungen besprechen wir je Vorhaben.",
        ventures: ["Mirai Move", "Kakari", "Chigamo"],
        state: "Wir sind an dem Punkt, an dem wir zuhören möchten. Eine ausgeschriebene Stelle gibt es nicht.",
        cta: "Interesse bekunden",
      },
      {
        key: "team",
        label: "Gründungsteam",
        title: "Gründungsteam und Fachleute",
        body:
          "Eine Gründerin oder ein Gründer allein reicht nie. Wir suchen Menschen, die von Anfang an einen Teil mittragen – Technik, Betrieb oder die Arbeit vor Ort.",
        invites: [
          "Sie haben Dinge nicht nur gebaut, sondern bis in den Betrieb begleitet",
          "Sie haben schon einmal mit wenigen Leuten etwas aufgebaut",
          "Sie wissen, was in Ihrem Feld selbstverständlich ist",
        ],
        offers: "Eine Rolle von Anfang an und echten Spielraum über den Teil, den Sie halten.",
        cannot: "Es gibt keine laufenden Stellen. Wir können nicht behaupten, gerade in der Lage zu sein, jemanden einzustellen.",
        ventures: ["Mirai Move", "Kakari"],
        state: "Das hängt vom Stand des jeweiligen Vorhabens ab. Sagen Sie uns zuerst, was Sie übernehmen könnten.",
        cta: "Ins Gespräch kommen",
      },
      {
        key: "users",
        label: "Erste Nutzung",
        title: "Erste Nutzung und Erprobung",
        body:
          "Wir möchten, dass jemand aus der Position der tatsächlichen Nutzung auf das schaut, was wir gebaut haben. Nicht um Lob zu hören, sondern um zu erfahren, wo es nicht weitergeht.",
        invites: [
          "Sie haben mit genau diesem Problem tatsächlich zu kämpfen gehabt",
          "Sie sagen unverblümt, was nicht funktioniert hat",
          "Es macht Ihnen nichts aus, etwas vor der Veröffentlichung zu sehen",
        ],
        offers: "Einen Blick auf etwas, das noch im Bau ist – und was Sie sagen, fließt in den Entwurf zurück.",
        cannot: "Weder einen Veröffentlichungstermin noch die Umsetzung Ihrer Wünsche noch eine Vergütung können wir zusagen.",
        ventures: ["Kakari", "Mirai Move"],
        state: "Wir suchen Menschen, denen wir es zeigen können. Eine förmliche Ausschreibung ist das nicht.",
        cta: "Interesse bekunden",
      },
      {
        key: "research",
        label: "Forschung",
        title: "Hochschulen und Forschung",
        body:
          "Forschung in etwas zu überführen, das die Gesellschaft nutzen kann, braucht daneben einen geschäftlichen Entwurf. Wir suchen Menschen, mit denen wir über Gründungsqualifizierung und die Umsetzung von Forschung nachdenken können.",
        invites: [
          "Sie suchen einen Ort, an dem Forschungsergebnisse ankommen können",
          "Sie möchten Studierenden und Forschenden echte Gründungserfahrung ermöglichen",
          "Sie würden lieber mit einer gemeinsamen Erkundung beginnen",
        ],
        offers: "Den geschäftlichen Entwurf und eine Praxis, die tatsächlich läuft. Wir können mit einer Erkundung beginnen.",
        cannot: "Einen Forschungsvertrag, Mittel und eine offizielle Zusammenarbeit gibt es bisher nicht.",
        ventures: ["Mirai Move", "Chigamo"],
        state: "Es gibt keine bisherigen Kooperationen. Es beginnt mit einem Gespräch.",
        cta: "Ins Gespräch kommen",
      },
      {
        key: "public",
        label: "Verwaltung",
        title: "Verwaltung und öffentlicher Sektor",
        body:
          "Die Regeln bestehen, aber sie sind nie in Schritte übersetzt worden, denen Bürgerinnen und Bürger folgen können. Genau an dieser Lücke möchten wir gemeinsam entwerfen: den kleinen Versuch, die Messung der Wirkung und den Weg zu etwas, das bleibt.",
        invites: [
          "Sie haben eine Aufgabe, die sich in der Praxis erproben lässt",
          "Sie möchten sie so anlegen, dass sich die Wirkung messen lässt",
          "Sie möchten es nicht bei einem einmaligen Pilotprojekt belassen",
        ],
        offers: "Recherche, Belege in eine brauchbare Ordnung gebracht, und einen Entwurf, um im Kleinen zu erproben.",
        cannot: "Wir haben noch keine Zusammenarbeit mit einer Kommune vorzuweisen und können keine verfahrensrechtlichen Garantien geben.",
        ventures: ["Mirai Move", "Kakari"],
        state: "Es beginnt mit einem Gespräch. Es läuft derzeit keine Zusammenarbeit.",
        cta: "Sprechen Sie uns an",
      },
      {
        key: "corporate",
        label: "Unternehmen",
        title: "Unternehmen",
        body:
          "Wenn es im eigenen Betrieb ein Problem gibt, aus dem ein Geschäft werden sollte. Wir können mit gemeinsamer Entwicklung oder einem Versuch in der Praxis beginnen.",
        invites: [
          "In Ihrem Betrieb gibt es ein ungelöstes operatives Problem",
          "Sie suchen die Form für ein neues Geschäft",
          "Sie suchen einen Partner für gemeinsame Entwicklung",
        ],
        offers: "Wir können damit beginnen, das Problem neu als Geschäft zu entwerfen.",
        cannot: "Wir haben keine Geschäftsbeziehungen vorzuweisen und keine Anwendungsbeispiele, die wir zeigen könnten.",
        ventures: ["Mirai Move", "Kakari", "Chigamo"],
        state: "Es beginnt damit, dass wir zuhören.",
        cta: "Anfragen",
      },
    ],
    intakeTitle: "Zur Aufnahme",
    intakeBody:
      "Derzeit gibt es kein Bewerbungsverfahren und kein Auswahlprogramm. Was hier steht, ist eine Einladung – keine bestehende Partnerschaft und keine ausgeschriebene Stelle. Wir beginnen damit, zu hören, worum es Ihnen geht, und ob es etwas zu besprechen gibt.",
    foundingTeamEyebrow: "Gründungsteam",
    foundingTeamHeading: ["Wir bauen bereits,", "bevor es ein Unternehmen gibt."],
    foundingTeamBody: [
      "Meist beginnt ein Vorhaben, sobald sich Menschen zusammengefunden haben. Yorisou geht die umgekehrte Reihenfolge: Zuerst entstehen Recherche und Belege, ein frühes Produkt und der Entwurf als Geschäft – und danach suchen wir die Person, die das übernimmt.",
      "Niemand beginnt deshalb mit einem leeren Blatt. Sie fangen damit an, etwas aufzunehmen, das bereits eine Form hat, und es zu Ihrem eigenen zu machen.",
      "Was das Übernehmen bedeutet, ändert sich dadurch nicht. Wer entscheidet, trägt auch die Verantwortung. Wenn die Menschen, die es führen, nicht wirklich entscheiden können, ist daraus kein Unternehmen geworden.",
    ],
    ctaHeading: ["Wer Sie auch sind –", "der Weg hinein ist derselbe."],
    ctaBody: "Schreiben Sie, was Ihnen vorschwebt, und senden Sie es uns. Wir lesen der Reihe nach.",
  },
};
