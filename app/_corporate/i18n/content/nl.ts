import type { SiteCopy } from "../types";

/**
 * CORP-P5R2 — DUTCH. Translated from the Japanese canonical source (ja.ts), with en.ts used only
 * as a structural reference.
 *
 * This is an adapted sibling, not a literal rendering: it is written to read as natural corporate
 * Dutch. It may never be stronger than the Japanese. No customer, partner, metric, revenue,
 * funding, market-position, team-size or capability claim appears here that the Japanese does not
 * already make.
 *
 * On the company form: Yorisou is a Japanese godo kaisha, a member-managed limited liability
 * company. It is rendered as "Yorisou LLC" and the representative is a "vertegenwoordigend
 * vennoot" (representative member). A joint-stock term (NV) or a "CEO of a corporation" title
 * would be legally wrong here.
 *
 * On the representative: "Harvard Business School Executive Education" is stated precisely. It is
 * NOT a Harvard University degree and NOT an HBS MBA, and must never be shortened in a way that
 * implies either. No endorsement by IESE, Harvard, Ficosa, or any government body is implied.
 */
export const nl: SiteCopy = {
  chrome: {
    skip: "Ga naar de inhoud",
    menu: "Menu",
    menuToggle: "Menu openen en sluiten",
    close: "Sluiten",
    navLabel: "Sitenavigatie",
    navLabelMobile: "Sitenavigatie (mobiel)",
    langLabel: "Weergavetaal",
    langHeading: "Kies een taal",
    langSearch: "Talen zoeken",
    langCurrent: "Huidige taal",
    previewBadge: "Preview — niet gepubliceerd",
    nav: { home: "Home", miraiMove: "Mirai Move", kakari: "Kakari", about: "Over ons", company: "Bedrijf", contact: "Contact" },
    footerTagline: "Tussen mens en samenleving bouwen wij de volgende vorm van nabijheid.",
    footerProjects: "Projecten",
    footerCompany: "Bedrijf",
    footerLegalNote: "Alles wat hier staat, berust op een vastgelegd gegeven dat wij hebben kunnen verifiëren.",
    backToTop: "Terug naar boven",
  },

  meta: {
    home: { title: "Yorisou LLC — Tussen mens en samenleving bouwen wij de volgende vorm van nabijheid.", description: "Yorisou LLC kijkt nauwkeurig naar de complexiteit in het dagelijks leven, het werk en de lokale gemeenschap, en bouwt producten waarmee mensen die complexiteit begrijpen, kiezen en verder komen. Wij ontwikkelen Mirai Move en Kakari." },
    miraiMove: { title: "Mirai Move — Yorisou LLC", description: "Een platform voor informatie, matching en business development in de Japanse mobiliteitssector. De publieke website is live; de platformfuncties zijn in ontwikkeling." },
    kakari: { title: "Kakari — Yorisou LLC", description: "Meertalige ondersteuning bij administratieve procedures en documenten, voor mensen die in Japan wonen en voor wie hier een onderneming start. In ontwikkeling en nog niet algemeen beschikbaar." },
    about: { title: "Over ons — Yorisou LLC", description: "Waarom Yorisou bestaat, hoe wij denken en hoe wij bouwen. Wat wij niet kunnen verifiëren, schrijven wij niet op." },
    company: { title: "Bedrijf — Yorisou LLC", description: "Bedrijfsprofiel, profiel van de vertegenwoordiger, boodschap van de vertegenwoordiger en werkgebieden van Yorisou LLC." },
    contact: { title: "Contact — Yorisou LLC", description: "Vragen over ons werk, samenwerking en pers." },
  },

  common: {
    readMore: (name) => `Meer over ${name}`,
    backHome: "Terug naar het bedrijfsoverzicht",
    stageLabel: "Huidige fase",
    boundaryLabel: "Wat wij niet op ons nemen",
  },

  home: {
    eyebrow: "Yorisou LLC",
    thesis: ["Tussen mens en samenleving", "bouwen wij de volgende", "vorm van nabijheid."],
    lead: ["Yorisou kijkt nauwkeurig naar de complexiteit in het dagelijks leven, het werk en de lokale gemeenschap,", "en bouwt producten waarmee mensen die begrijpen, kiezen en verder komen."],
    humanSide: "Mens",
    humanItems: ["Dagelijks leven", "Werk", "Gemeenschap"],
    systemSide: "Systemen",
    systemItems: ["Mobiliteit", "Overheidsprocedures"],
    fieldCaption: "Mens — dagelijks leven, werk, gemeenschap  /  Systemen — mobiliteit, overheidsprocedures",
    fieldRelation: "Relaties",

    whyEyebrow: "De vraagstukken waaraan wij werken",
    whyHeading: ["Complexiteit los je niet op", "met inspanning van het individu alleen."],
    whyBeats: [
      { no: "01", title: "‘Ik weet het niet’ houdt mensen bij de deur tegen.", body: "Een regeling die bestaat maar onbereikbaar blijft, is hetzelfde als geen regeling." },
      { no: "02", title: "De weg naar een professional is lang.", body: "Vóór het punt waarop menselijk oordeel werkelijk nodig is, ligt een afstand die een systeem zou kunnen overbruggen." },
      { no: "03", title: "De praktijk en het systeem sluiten niet op elkaar aan.", body: "In mobiliteit, zorg en overheidsdienstverlening bestaan mogelijkheden die de mensen in de praktijk nog niet hebben bereikt." },
    ],

    buildEyebrow: "Wat wij bouwen",
    buildHeading: ["Wij bouwen de volgende vorm van nabijheid,", "één voor één."],

    howEyebrow: "Hoe wij bouwen",
    howHeading: ["Wij nemen de complexiteit op ons", "en maken er iets bruikbaars van."],
    howBeats: [
      { no: "01", title: "Beginnen bij de taal van de praktijk", body: "Wij ontwerpen niet vanuit de techniek. Wij redeneren terug vanuit de werkelijke stappen van iemand die vastloopt." },
      { no: "02", title: "Verantwoordelijk tot het begrepen is", body: "Informatie tonen is niet het eindpunt. Weten wat de volgende stap is, hoort binnen de reikwijdte van het ontwerp." },
      { no: "03", title: "De grens benoemen", body: "Wij treden niet in het werk dat aan een erkende professional toebehoort. Wat wij wel doen en waar wij overdragen, staat in het product zelf beschreven." },
      { no: "04", title: "Alleen zeggen wat te verifiëren is", body: "Resultaten, cijfers en samenwerkingen vermelden wij alleen waar bewijs voor is. Wat wij niet kunnen bevestigen, schrijven wij niet op." },
    ],
    howDisclose: "Wat deze uitgangspunten in de praktijk betekenen",

    founderEyebrow: "Vertegenwoordiger",
    founderHeading: ["Gebouwd door iemand die twintig jaar", "in complexe industrieën heeft gestaan."],
    founderTeaser: "Ruim twintig jaar in de automotive, mobiliteit, productie en internationaal zakendoen, steeds tussen de techniek, de uitvoering en de commerciële praktijk in. Wat zich daar telkens herhaalde: een goed werkend systeem dat stilvalt voordat het de mens bereikt die het nodig heeft.",
    founderRole: "Vertegenwoordigend vennoot, Yorisou LLC",
    founderCta: "Over de vertegenwoordiger",

    messageEyebrow: "Boodschap",
    messageHeading: ["Wij beoordelen of het aankomt,", "niet of het geavanceerd is."],
    messageTeaser: "Waar wij ons mee bezighouden is niet het nieuwe. Regelingen en mogelijkheden bestaan al — ze stoppen alleen voordat ze de mensen bereiken die ze nodig hebben. Wij bouwen een bedrijf dat die afstand stap voor stap verkleint.",
    messageCta: "Lees de volledige boodschap",

    originEyebrow: "Waar wij gevestigd zijn",
    originHeading: ["Beginnen vanuit Fukuoka."],
    originBody: "Yorisou LLC bouwt het bedrijf op vanuit Fukuoka in Japan — een plek waar dagelijks leven, werk en gemeenschap dicht bij elkaar liggen, en waar het ontwerp kan beginnen bij de stappen die mensen daadwerkelijk zetten.",

    proofEyebrow: "Bedrijf",
    proofHeading: ["Wat wij kunnen vermelden,", "en niet meer dan dat."],

    ctaEyebrow: "Contact",
    ctaHeading: ["Misschien is er ruimte", "om hier samen aan te werken."],
    ctaBody: "Wij ontvangen graag vragen over ons werk, mogelijke samenwerking en persverzoeken. Wij reageren op volgorde, afhankelijk van de vraag.",
    ctaButton: "Neem contact op",
  },

  mirai: {
    eyebrow: "Project 01",
    heading: ["Een platform voor informatie, matching", "en business development", "in de Japanse mobiliteitssector."],
    stage: "Publieke website live / platformfuncties in ontwikkeling",
    lead: "Mirai Move wil overheid en gemeenten, bedrijven, zorg- en gemeenschapsomgevingen, buitenlandse leveranciers en Japanse partners met elkaar verbinden, zodat informatie en kansen rond mobiliteit als één samenhangend geheel behandeld kunnen worden. De publieke informatiewebsite is nu live; de platformfuncties zijn in ontwikkeling.",
    domain: "De Japanse mobiliteitssector",
    networkEyebrow: "Wie het verbindt",
    networkHeading: ["Partijen met verschillende posities", "kijken naar dezelfde kans", "in verschillende woorden."],
    centre: "Kansen in mobiliteit",
    parties: [
      { no: "01", title: "Overheid en gemeenten", body: "De kant van regelgeving en budget" },
      { no: "02", title: "Bedrijven", body: "De kant van levering en uitvoering" },
      { no: "03", title: "Gemeenschap, zorg en welzijn", body: "Waar de verplaatsing daadwerkelijk plaatsvindt" },
      { no: "04", title: "Buitenlandse leveranciers en Japanse partners", body: "De kant die de mogelijkheden binnenbrengt" },
    ],
    boundaryTitle: "Over de ontwikkelstatus",
    boundaryBody: "Het platform zelf is in ontwikkeling. Autonome uitvoering door agents is niet ingeschakeld. Elke handeling met werking naar buiten is zo ontworpen dat menselijke bevestiging vereist is. Het wordt niet aangeboden als een voltooid platform met alle functies.",
    detail: [
      { heading: "Het vraagstuk waaraan wij werken", body: "Mobiliteitsopties bestaan los van elkaar: per regio, per regeling en per aanbieder. Wie er een nodig heeft en de mogelijkheid die al bestaat, komen niet op dezelfde plek samen." },
      { heading: "De partijen waarmee wij werken", body: "Overheid en gemeenten, bedrijven, zorg- en gemeenschapsomgevingen, buitenlandse leveranciers en Japanse partners. Partijen met verschillende posities en verschillende afwegingen kijken naar dezelfde kans in verschillende woorden." },
      { heading: "Wat er nu draait", body: "De publieke informatiewebsite is live. De platformfuncties voor informatie, matching en business development bevinden zich in de fase waarin het fundament en de architectuur worden opgebouwd." },
    ],
    siteLabel: "Publieke website",
    siteUrl: "https://www.miraimove.com",
  },

  kakari: {
    eyebrow: "Project 02",
    heading: ["Meertalige ondersteuning bij procedures", "en documenten, voor mensen die in Japan wonen", "en voor wie hier een onderneming start."],
    stage: "In ontwikkeling (nog niet algemeen beschikbaar)",
    lead: "Wanneer taal en voorkennis de drempel vormen, bereiken mensen de regelingen niet die zij zouden mogen gebruiken. Kakari ondersteunt bij het vinden van de relevante informatie, het voorbereiden van documenten, het invullen van formulieren en het volgen van de indieningsprocedure — in de eigen taal van de gebruiker. Kakari is in ontwikkeling en nog niet algemeen beschikbaar.",
    domain: "Administratieve procedures en documenten / meertalig",
    procedureEyebrow: "De procedure die wij ondersteunen",
    procedureHeading: ["Van uitzoeken,", "tot indienen."],
    steps: [
      { no: "01", title: "Uitzoeken", body: "Vaststellen welke regelingen op u van toepassing zijn" },
      { no: "02", title: "Documenten verzamelen", body: "In kaart brengen welke documenten en bijlagen nodig zijn" },
      { no: "03", title: "Opstellen", body: "De formulieren in uw eigen taal invullen en de inhoud controleren" },
      { no: "04", title: "Indienen", body: "Uitleg over waar, hoe en via welke postprocedure u indient" },
    ],
    boundaryTitle: "Waar de professional het overneemt",
    boundaryBody: "Wij treden niet namens u op als erkende professional. Juridische, fiscale en officiële beoordelingen worden benoemd als werk dat een professional uitvoert. Beoordelingen of vertegenwoordiging waarvoor een beroepskwalificatie vereist is — zoals een advocaat, een belastingadviseur of een administratief juridisch dienstverlener (gyoseishoshi) — maken geen deel uit van de functies van Kakari.",
    detail: [
      { heading: "Het vraagstuk waaraan wij werken", body: "Hoe een procedure verloopt, is openbare informatie. Toch bereiken mensen de regeling niet, alleen omdat de taal en de veronderstelde voorkennis ontbreken. Dat is geen kwestie van iemands vermogen." },
      { heading: "De mensen waarmee wij werken", body: "Mensen die in Japan wonen en mensen die hier een onderneming gaan starten — mensen voor wie het alleen doorlopen van een procedure in het Japans moeilijk is." },
      { heading: "Wat er nu draait", body: "De authenticatiebasis is opgebouwd in een afgezonderde testomgeving, waarin rechten en opslag worden geverifieerd. Externe koppelingen blijven uitgeschakeld en er is geen publieke beschikbaarheid." },
    ],
  },

  about: {
    eyebrow: "Over ons",
    heading: ["Hoe wij bouwen,", "is de belofte die wij doen."],
    lead: "Yorisou kijkt nauwkeurig naar de complexiteit in het dagelijks leven, het werk en de lokale gemeenschap, en bouwt producten waarmee mensen die begrijpen, kiezen en verder komen.",
    whyHeading: ["Waarom dit bedrijf bestaat."],
    whyBody: [
      "Regelingen, techniek en mogelijkheden bestaan al in groten getale. Toch stoppen ze voordat ze de mens bereiken die ze nodig heeft. Die laatste afstand is waar wij ons op richten.",
      "Die afstand wordt meestal beschreven als een kwestie van eigen inspanning of van informatie. In de praktijk wordt complexiteit die het systeem had kunnen opvangen simpelweg bij het individu neergelegd.",
    ],
    thinkHeading: ["Hoe wij denken."],
    thinkBody: [
      "Wij ontwerpen niet vanuit de techniek. Wij beginnen bij het losmaken van de ene stap die nu vastzit: de situatie van de mens lezen, die ordenen als een geheel van relaties, en doorvoeren tot het punt waarop de volgende stap duidelijk is. Dat is de reikwijdte van het ontwerp.",
      "AI zetten wij in voor dat begrijpen en ordenen — niet om de beslissing over te nemen. De rol ervan is om het materiaal dat iemand nodig heeft in een bruikbare vorm te brengen. Het oordeel en de verantwoordelijkheid blijven bij de mens.",
    ],
    buildHeading: ["Hoe wij bouwen."],
    principles: [
      { no: "01", title: "Beginnen bij de taal van de praktijk", body: "Wij ontwerpen niet vanuit de techniek. Wij redeneren terug vanuit de werkelijke stappen van iemand die vastloopt." },
      { no: "02", title: "Verantwoordelijk tot het begrepen is", body: "Informatie tonen is niet het eindpunt. Weten wat de volgende stap is, hoort binnen de reikwijdte van het ontwerp." },
      { no: "03", title: "De grens benoemen", body: "Wij treden niet in het werk dat aan een erkende professional toebehoort. Wat wij wel doen en waar wij overdragen, staat in het product zelf beschreven." },
      { no: "04", title: "Alleen zeggen wat te verifiëren is", body: "Resultaten, cijfers en samenwerkingen vermelden wij alleen waar bewijs voor is. Wat wij niet kunnen bevestigen, schrijven wij niet op." },
    ],
    principlesLong: [
      { no: "01", title: "Beginnen bij de taal van de praktijk", long: "Geen enkele regeling bereikt iemand voordat zij vertaald is naar de stappen die de betrokkene daadwerkelijk zet. Wij beginnen bij de werkelijke aanvraag, de werkelijke verplaatsing, het werkelijke contact — niet bij een abstracte probleemstelling, maar bij de ene stap die nu vastzit." },
      { no: "02", title: "Verantwoordelijk tot het begrepen is", long: "Zoekresultaten opsommen is geen ondersteuning. Wat iemand nodig heeft, is weten wat hij nu moet doen. De reikwijdte van het product loopt tot het punt waarop de volgende stap begrepen is, niet tot het punt waarop informatie is getoond." },
      { no: "03", title: "De grens benoemen", long: "Iemand een product laten gebruiken zonder duidelijk te maken wat het niet kan, is het gevaarlijkste ontwerp dat er is. Wat wij zelf doen en waar een professional het overneemt, schrijven wij in het scherm zelf. De grens is een functie, geen kleine lettertjes." },
      { no: "04", title: "Alleen zeggen wat te verifiëren is", long: "Wij spreken niet over resultaten die wij niet kunnen bevestigen, of over functies die nog niet draaien. Achter elk feit dat wij publiceren ligt een vastgelegd gegeven. In periodes waarin wij weinig kunnen zeggen, publiceren wij weinig." },
    ],
    orderHeading: ["Eén voor één,", "helemaal tot het einde."],
    orderBody: "Wij starten niet veel dingen tegelijk. Liever brengen wij één gebied helemaal tot het punt waarop het aansluit bij de stappen die mensen werkelijk zetten.",
    claimsHeading: ["Wat wij niet kunnen verifiëren,", "schrijven wij niet op."],
    claimsBody: "Achter elk feit dat wij publiceren ligt een vastgelegd gegeven. In periodes waarin wij weinig kunnen zeggen, publiceren wij weinig.",
  },

  company: {
    eyebrow: "Bedrijf",
    heading: ["Yorisou LLC"],
    intro: "Yorisou LLC bouwt producten die de complexiteit van het dagelijks leven, het werk en de lokale gemeenschap omzetten in iets wat mensen kunnen begrijpen, waaruit zij kunnen kiezen en waarnaar zij kunnen handelen. Vanuit Fukuoka werken wij aan twee projecten: Mirai Move en Kakari.",

    messageEyebrow: "Boodschap van de vertegenwoordiger",
    messageHeading: ["Wij beoordelen of het aankomt,", "niet of het geavanceerd is."],
    message: [
      "Waar wij ons mee bezighouden is niet het nieuwe.",
      "Ruim twintig jaar stond ik in de automotive, de mobiliteit en de productie tussen de techniek, de uitvoering en de commerciële praktijk in. Wat zich daar telkens herhaalde: een goed werkend systeem dat stilvalt voordat het de mens bereikt die het nodig heeft. Niet omdat de techniek tekortschoot, maar omdat zij nooit vertaald was naar de stappen die deze mens daadwerkelijk zet.",
      "Regelingen en mogelijkheden bestaan al in groten getale. Maar als iemand niet kan vaststellen of het hem aangaat, of wat de volgende stap is, is het alsof ze niet bestaan. Die laatste afstand overbruggen — het systeem laten opvangen wat nu bij het individu terechtkomt — is de reden waarom Yorisou er is.",
      "Wij gebruiken AI niet om de beslissing te nemen. Wij gebruiken het om de situatie te lezen, die te ordenen als relaties en in een bruikbare vorm te brengen, zodat de mens kan beslissen. Het oordeel en de verantwoordelijkheid blijven bij de mens. Wat wij zelf doen en waar wij overdragen aan een professional, schrijven wij in het scherm zelf.",
      "Wij zijn nog een klein bedrijf en er is nog niet veel dat wij kunnen vermelden. Juist daarom schrijven wij alleen op wat wij kunnen verifiëren. Wat moet groeien is niet de bewering, maar wat werkelijk is aangekomen.",
    ],
    messageSignature: "Jin Yang",
    messageRole: "Vertegenwoordigend vennoot, Yorisou LLC",

    profileEyebrow: "Vertegenwoordiger",
    profileHeading: ["Over de vertegenwoordigend vennoot"],
    profileName: "Jin Yang",
    profileNameLatin: "Jin Yang / Edward Jin",
    profileRole: "Vertegenwoordigend vennoot, Yorisou LLC",
    profileBody: [
      "Ruim twintig jaar praktijkervaring in de automotive, mobiliteit, productie, industriële projectontwikkeling, supply chain, commerciële ontwikkeling, productontwikkeling en grensoverschrijdend internationaal zakendoen.",
    ],
    profileBackgroundLabel: "Achtergrond",
    profileBackground: [
      "Vervulde senior commerciële en industriële projectverantwoordelijkheden bij Ficosa, een internationale toeleverancier in de automotive, waaronder werk verbonden aan wereldwijde industriële projecten en commerciële activiteiten in Azië.",
      "Richtte daarna technologie- en productiebedrijven op in China en leidde deze, met werk op het gebied van automotive-elektronica, besturingssystemen, precisieproductie en AI-ondersteunde product- en systeemontwikkeling.",
      "Werkte in meerdere markten, waaronder Europa, China en Japan.",
      "Is nu vertegenwoordigend vennoot van Yorisou LLC in Japan en bouwt het bedrijf op vanuit Fukuoka.",
    ],
    profileEducationLabel: "Opleiding",
    profileEducation: [
      "MBA, IESE Business School",
      "General Management Program, Harvard Business School Executive Education",
    ],
    profileRelevanceLabel: "Waarom deze achtergrond hier van belang is",
    profileRelevance: [
      "Langdurige praktijkervaring dwars door complexe, reële industrieën heen.",
      "Een positie op het snijvlak van techniek, productie, commerciële uitvoering en internationale markten.",
      "Directe ervaring met de kloof tussen wat een systeem kan en wat een mens of organisatie werkelijk kan gebruiken.",
      "En daarmee de aanleiding om producten te bouwen die complexiteit omzetten in iets begrijpelijks waarnaar te handelen valt.",
    ],

    overviewEyebrow: "Bedrijfsprofiel",
    overviewHeading: ["Bedrijfsprofiel"],
    facts: [
      { label: "Naam", value: "Yorisou LLC (Yorisou GK)" },
      { label: "Vertegenwoordigend vennoot", value: "Jin Yang" },
      { label: "Vestiging", value: "Fukuoka, prefectuur Fukuoka, Japan" },
      { label: "Activiteiten", value: "Ontwerp, ontwikkeling en exploitatie van Mirai Move en Kakari" },
    ],

    businessEyebrow: "Werkgebieden",
    businessHeading: ["Werkgebieden"],
    businessBody: "Informatie, matching en business development in de mobiliteitssector; en meertalige ondersteuning bij administratieve procedures en documenten, voor mensen die in Japan wonen en voor wie hier een onderneming start. Beide volgen hetzelfde uitgangspunt: de complexiteit op ons nemen en er iets bruikbaars van teruggeven.",

    projectsEyebrow: "Projecten",
    projectsHeading: ["Waar wij aan bouwen"],

    originEyebrow: "Waar wij gevestigd zijn",
    originHeading: ["Beginnen vanuit Fukuoka."],
    originBody: [
      "Yorisou LLC bouwt het bedrijf op vanuit de stad Fukuoka in Japan.",
      "Het is een plek waar dagelijks leven, werk en gemeenschap dicht bij elkaar liggen — en waar het ontwerp kan beginnen bij de stappen die mensen daadwerkelijk zetten.",
    ],

    ctaHeading: ["Contact"],
    ctaBody: "Wij ontvangen graag vragen over ons werk, mogelijke samenwerking en persverzoeken.",
  },

  contact: {
    eyebrow: "Contact",
    heading: ["Contact"],
    lead: "Wij ontvangen graag vragen over ons werk, mogelijke samenwerking en persverzoeken. Wij reageren op volgorde, afhankelijk van de vraag.",
    channelsHeading: ["Waarover u contact kunt opnemen"],
    channels: [
      { title: "Algemene vragen", body: "Vragen over Yorisou als bedrijf en over de projecten waaraan wij werken." },
      { title: "Zakelijk en samenwerking", body: "Samenwerking of zakelijke gesprekken op het gebied van mobiliteit of administratieve procedures." },
      { title: "Pers en media", body: "Interviewverzoeken en vragen over het bedrijf of de vertegenwoordiger." },
    ],
    formHeading: ["Stuur ons een bericht"],
    formIntro: "Gebruik het onderstaande formulier. Wij lezen elke vraag en reageren op volgorde.",
    fields: {
      name: "Naam", namePlaceholder: "Uw naam",
      email: "E-mailadres", emailPlaceholder: "u@example.com",
      org: "Bedrijf of organisatie", orgPlaceholder: "Optioneel",
      type: "Soort vraag",
      message: "Bericht", messagePlaceholder: "Beschrijf de achtergrond en wat u graag wilt weten.",
    },
    types: [
      { value: "general", label: "Algemene vraag" },
      { value: "business", label: "Zakelijk en samenwerking" },
      { value: "media", label: "Pers en media" },
    ],
    submit: "Versturen",
    sending: "Bezig met versturen…",
    successTitle: "Bericht verzonden",
    successBody: "Wij hebben uw vraag ontvangen. Wij bekijken deze en reageren op volgorde.",
    errorTitle: "Verzenden mislukt",
    errorBody: "Wacht een moment en probeer het opnieuw.",
    required: "Verplicht",
    privacyNote: "De persoonsgegevens die u verstrekt, gebruiken wij uitsluitend om uw vraag te beantwoorden.",
  },
};
