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
    home: { title: "Yorisou LLC — Van structurele vraagstukken naar bedrijven die op eigen benen staan.", description: "Yorisou LLC is een foundry: wij zoeken structurele vraagstukken op, bouwen het bewijs en de bouwstenen van een onderneming, en vormen samen met oprichters zelfstandige bedrijven. Mirai Move, Kakari en Chigamo zijn onderweg." },
    miraiMove: { title: "Mirai Move — Yorisou LLC", description: "Een platform voor informatie, matching en business development in de Japanse mobiliteitssector. De publieke website is live; de platformfuncties zijn in ontwikkeling." },
    kakari: { title: "Kakari — Yorisou LLC", description: "Meertalige ondersteuning bij administratieve procedures en documenten, voor mensen die in Japan wonen en voor wie hier een onderneming start. In ontwikkeling en nog niet algemeen beschikbaar." },
    about: { title: "Hoe wij bouwen — Yorisou LLC", description: "Het vraagstuk vinden, het toetsen, het als onderneming ontwerpen, een oprichtersteam vormen en het naar een zelfstandig bedrijf brengen. Hoe de foundry van Yorisou werkt, en waar de gedeelde basis zich bevindt." },
    company: { title: "Bedrijf — Yorisou LLC", description: "Bedrijfsprofiel, profiel van de vertegenwoordiger, boodschap van de vertegenwoordiger en werkgebieden van Yorisou LLC." },
    contact: { title: "Contact — Yorisou LLC", description: "Vragen over ons werk, samenwerking en pers." },
    ventures: { title: "Projecten — Yorisou LLC", description: "Waar Yorisou nu aan werkt: Mirai Move, Kakari en Chigamo. Elk project staat in een andere fase, en die fase benoemen wij zoals hij is." },
    buildWithUs: { title: "Samen bouwen — Yorisou LLC", description: "Ingangen voor oprichters, onderzoekers, overheid en bedrijven. Er is geen open aanmeldings- of selectieprogramma; wij beginnen bij een gesprek." },
    chigamo: { title: "Chigamo — Yorisou LLC", description: "Een concept om vanuit locatie en context zichtbaar te maken wat op een bepaalde plek werkelijk van nut is. Bevindt zich in de conceptfase; er is niets openbaar beschikbaar." },
  },

  common: {
    readMore: (name) => `Meer over ${name}`,
    backHome: "Terug naar het bedrijfsoverzicht",
    stageLabel: "Huidige fase",
    boundaryLabel: "Wat wij niet op ons nemen",
    nowLabel: "Nu",
    nextLabel: "Volgende stap",
    whoLabel: "Met wie wij willen spreken",
  },

  home: {
    eyebrow: "Yorisou LLC",
    thesis: ["Van structurele vraagstukken", "maken wij bedrijven", "die op eigen benen staan."],
    lead: [
      "Yorisou is een foundry: wij zoeken structurele vraagstukken in de samenleving op, toetsen ze en ontwerpen ze als onderneming,",
      "en werken samen met de mensen die ze gaan leiden, op weg naar zelfstandige bedrijven.",
    ],
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
    buildHeading: ["Drie gebieden", "waar wij nu aan werken."],

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
    founderRole: "Besturend vennoot, Yorisou LLC",
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

    /* CORP-v1.2 — Asterion-laag en de laag voor betrokkenheid op de homepage. */
    asterionEyebrow: "Gedeelde basis",
    asterionHeading: ["Elke keer dat wij bouwen,", "wordt de bodem steviger."],
    asterionBody:
      "Asterion OS is een zelfstandig, gedeeld technologie- en uitvoeringsplatform dat een plaats heeft binnen de foundry-opzet van Yorisou. Doordat die gemeenschappelijke basis er al ligt, hoeft niet elk project dezelfde onderdelen opnieuw te bouwen en kan het zijn inspanning richten op het eigen vraagstuk.",
    asterionNote:
      "Elk project wordt afzonderlijk bestuurd en houdt zijn eigen intellectuele eigendom, gegevens en operationele verantwoordelijkheid. Asterion is geen eigendom van Yorisou.",
    engageEyebrow: "Samen bouwen",
    engageHeading: ["Stap in terwijl het nog", "een bedrijf aan het worden is."],
    engageBody:
      "Oprichters, onderzoekers, overheid, bedrijven. Waar u kunt aanhaken, hangt af van waar u staat. Wij beginnen bij wat nu al te bespreken valt.",
    engageCta: "Bekijk de ingangen",
    engageNote: "Alles begint nu bij een gesprek. Er is nog geen aanmeldingsprocedure en geen selectie.",
    explainerLabel: "Yorisou in 30 seconden",
    explainerHeading: ["Van vraagstuk naar bedrijf,", "in dertig seconden."],
    explainerClose: "Sluiten",
  },

  mirai: {
    reading: "Regionale mobiliteit in beweging brengen, tot aan de oplossing.",
    now: "De publieke website draait, en het systeem dat openbare bronnen blijft lezen, loopt vanzelf door. Naar buiten toe is er echter nog niets uitgegaan — geen enkele keer.",
    next: "Bij de eerste werkelijke casus blijven er punten liggen die niet vanachter het bureau te beslissen zijn. Vanaf hier is het aan mensen.",
    who: "Mensen die de praktijk van regionaal vervoer van binnenuit kennen — gemeenten, vervoerders, de werkvloer zelf — en die de werkelijke beperkingen kunnen benoemen.",
    join: {
      title: "Betrokken raken bij dit project",
      body: "Wat nu nodig is, zijn mensen die de beperkingen in de praktijk concreet kunnen benoemen. Dit is de fase van nagaan, niet van verkopen.",
      roles: [
        "U werkt in regionaal vervoer of mobiliteit — bij een gemeente, bij een vervoerder of in de praktijk zelf",
        "U zou dit gebied als oprichter of operationeel leider kunnen dragen",
        "U weet hoe de uitvoering in werkelijkheid verloopt",
      ],
      state: "Wij zijn in de fase van luisteren. Er is geen openstaande positie.",
    },
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
    reading: "Zodat u procedures in Japan zelf kunt doorlopen.",
    now: "Een besloten testfase. Kakari is niet algemeen beschikbaar en er zijn nog geen gebruikers.",
    next: "De stappen die nodig zijn voor distributie, en het vaststellen van de registratiegegevens van het bedrijf. Beide vragen bevestiging van buiten.",
    who: "Mensen met een buitenlandse nationaliteit die in Japan wonen, de mensen die hen ondersteunen, en erkende professionals.",
    join: {
      title: "Betrokken raken bij dit project",
      body: "Wij willen dit eerst laten zien aan mensen die weten hoe deze procedures in werkelijkheid verlopen. Het is geen middel om professionals te vervangen.",
      roles: [
        "U bent in Japan zelf vastgelopen op een procedure",
        "U ondersteunt in enige vorm mensen met een buitenlandse nationaliteit",
        "U bent gyoseishoshi of een andere erkende professional en kunt meekijken waar de grens hoort te liggen",
        "U zou dit project als oprichter of operationeel leider kunnen dragen",
      ],
      state: "Wij zoeken mensen om het aan te laten zien. Er is nog niets openbaar en niets opengesteld.",
    },
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
    messageRole: "Besturend vennoot, Yorisou LLC",

    profileEyebrow: "Vertegenwoordiger",
    profileHeading: ["Over de vertegenwoordigend vennoot"],
    profileName: "Jin Yang",
    profileNameLatin: "Jin Yang / Edward Jin",
    profileRole: "Besturend vennoot, Yorisou LLC",
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
      { label: "Ondernemingsnummer (hōjin bangō)", value: "2290003018125" },
      { label: "Besturend vennoot", value: "Jin Yang" },
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

  /* ── VENTURES INDEX (CORP-v1.2) ─────────────────────────────────────── */
  ventures: {
    eyebrow: "Waar wij nu aan bouwen",
    heading: ["Drie gebieden,", "elk nog net geen bedrijf."],
    lead:
      "In alle drie bestaan de regelingen en de systemen al — en stoppen ze net voordat ze de mensen bereiken die ze nodig hebben. Yorisou werkt in die ruimte, en toetst gaandeweg.",
    cards: [
      {
        name: "Mirai Move",
        href: "/mirai-move",
        thesis: "Informatie, matching en business development in mobiliteit met elkaar verbinden.",
        problem: "Tussen aanbieders, regio’s en overheid liggen informatie en kansen van elkaar gescheiden.",
        building: "Een platform waarop partijen binnen en buiten Japan vanuit dezelfde informatie kunnen werken.",
        status: "In ontwikkeling en in bedrijf. Publieke website live.",
      },
      {
        name: "Kakari",
        href: "/kakari",
        thesis: "Meertalige ondersteuning bij de procedures van wonen en ondernemen in Japan.",
        problem: "De regelingen bestaan, maar taal en volgorde zorgen dat mensen ze nooit gebruiken.",
        building: "Een manier om een procedure in stappen te verdelen en te tonen hoe ver u zelf komt.",
        status: "In ontwikkeling. In voorbereiding op publicatie.",
      },
      {
        name: "Chigamo",
        href: "/chigamo",
        thesis: "Een plek leesbaar maken vanuit locatie en context.",
        problem: "Juist de informatie die hier werkelijk zou helpen, is het moeilijkst te vinden.",
        building: "Ontdekken binnen de eigen leefomgeving, op basis van locatie en context.",
        status: "Conceptfase. Nog niet getoetst.",
      },
    ],
    noteHeading: ["Wat deze pagina zegt,", "en wat niet."],
    noteBody: [
      "Dit zijn de projecten en concepten waaraan Yorisou op dit moment werkt.",
      "Het zijn geen als rechtspersoon opgerichte dochterondernemingen, geen deelnemingen en geen klanten. Ze staan in verschillende fasen, en die fase hebben wij opgeschreven zoals hij is.",
      "Het doel is dat elk project als zelfstandig bedrijf op eigen benen komt te staan. Geen van de projecten heeft dat punt bereikt.",
    ],
  },

  /* ── CHIGAMO (CORP-v1.2) ────────────────────────────────────────────── */
  chigamo: {
    reading: "Een plek begrijpen, vanaf de plek zelf.",
    now: "Conceptfase. Er is geen beschikbaar product, er zijn geen gebruikers en er loopt geen traject met een gemeente.",
    next: "Of informatie werkelijk bruikbaar wordt wanneer je haar afbakent op locatie en context. Dat willen wij eerst klein onderzoeken.",
    who: "Mensen die een bepaalde plek werkelijk kennen en kunnen uitleggen waar informatie over de leefomgeving ophoudt bruikbaar te zijn.",
    join: {
      title: "Betrokken raken bij dit project",
      body: "Dit staat nog vóór de fase van toetsen. Wij zoeken daarom minder mensen om mee te bouwen dan mensen die de veronderstelling onderuit willen halen.",
      roles: [
        "U kent een bepaald gebied van binnenuit, omdat u er woont",
        "U heeft gewerkt met locatiegegevens of regionale data",
        "U vindt het geen bezwaar om al in de conceptfase mee te kijken",
      ],
      state: "Conceptfase. Hoe betrokkenheid eruitziet, ligt nog niet vast.",
    },
    eyebrow: "Project",
    heading: ["Een plek begrijpen,", "vanaf de plek zelf."],
    stage: "Conceptfase",
    lead:
      "Een concept: vanuit locatie en context zichtbaar maken wat op een bepaalde plek werkelijk van nut is. Het staat nog vóór de fase van toetsen.",
    domain: "Leefomgeving / locatie en context / ontdekken",
    conceptEyebrow: "De gedachte erachter",
    conceptHeading: ["De informatie bestaat.", "Zij komt alleen niet aan."],
    conceptBody: [
      "Juist wat u over een plek zou willen weten, is wat een zoekopdracht het slechtst oplevert. Niet omdat de informatie ontbreekt, maar omdat zij nooit is geordend naar plaats en situatie.",
      "Waar u bent, wanneer het is, en waar u mee te maken heeft. Sommige informatie wordt pas werkelijk de uwe wanneer die drie samenvallen. Dat is wat Chigamo probeert te behandelen.",
    ],
    boundaryTitle: "De huidige fase",
    boundaryBody:
      "Chigamo staat in de conceptfase. Er is geen product beschikbaar, er zijn geen gebruikers en er loopt geen traject met een gemeente. Wat hier staat, is een veronderstelling die wij willen toetsen.",
    detail: [
      {
        heading: "Waarom nu",
        body: "Kaarten en zoekmachines zijn allebei volwassen geworden. Toch is ‘wat betekent iets voor mij, hier waar ik sta’ nog altijd iets wat mensen zelf uitzoeken.",
      },
      {
        heading: "Wat wij willen nagaan",
        body: "Of informatie werkelijk bruikbaar wordt wanneer je haar afbakent op locatie en context. Dat willen wij eerst klein onderzoeken.",
      },
    ],
  },

  /* ── HOW WE BUILD / FOUNDRY (CORP-v1.2) ─────────────────────────────── */
  foundry: {
    eyebrow: "Hoe wij bouwen",
    heading: ["Van vraagstuk naar bedrijf,", "in die volgorde."],
    lead:
      "Wij beginnen niet bij een inval. Wij zoeken een structureel vraagstuk op, toetsen het, ontwerpen het als onderneming, werken samen met mensen die het kunnen leiden, en brengen het naar een zelfstandig bedrijf. Die volgorde noemt Yorisou de foundry.",
    stagesEyebrow: "Fasen",
    stagesHeading: ["Acht fasen,", "en wij slaan er geen over."],
    stages: [
      { no: "01", name: "Hypothese", body: "Bepalen waar het structurele vraagstuk zit — vanuit de vorm van het werkelijke werk, niet vanuit een ingeving." },
      { no: "02", name: "Bewijs", body: "Nagaan of het vraagstuk echt bestaat en bij wie het terechtkomt. Hier sneuvelen veel hypothesen." },
      { no: "03", name: "Ondernemingsontwerp", body: "Van het antwoord een onderneming maken: wie het gebruikt, en waar werkelijk waarde wordt uitgewisseld." },
      { no: "04", name: "Bouwen", body: "Het daadwerkelijk maken. Gebruikmaken van de gedeelde basis waar die er is, en de inspanning richten op wat eigen is aan dit project." },
      { no: "05", name: "Klaar als onderneming", body: "De bouwstenen en de werkwijze op een punt brengen waar iemand van buiten ze kan overnemen en voortzetten." },
      { no: "06", name: "Oprichtersteam vormen", body: "Samenwerken met iemand die het als het zijne kan dragen — als oprichter, niet als werknemer." },
      { no: "07", name: "Verzelfstandiging en exploitatie", body: "Het laten draaien als zelfstandig bedrijf, zo ingericht dat het niet afhankelijk blijft van Yorisou." },
      { no: "08", name: "Leren", body: "Wat werkte en wat sneuvelde bewaren als materiaal voor het volgende project." },
    ],
    independenceHeading: ["Het doel is een bedrijf", "dat op eigen benen staat."],
    independenceBody: [
      "De foundry is er niet om steeds meer onder Yorisou te verzamelen. Zij is er om elk project te brengen tot waar het als zelfstandig bedrijf kan staan.",
      "Daarom bouwen wij vanaf het begin op een manier die zich laat overdragen. Als de mensen die het leiden niet de werkelijke beslissingen kunnen nemen, is het geen bedrijf geworden.",
    ],
    asterionEyebrow: "Gedeelde technologie en uitvoering",
    asterionHeading: ["Hetzelfde bouwen wij", "geen tweede keer."],
    asterionBody: [
      "Asterion OS is een zelfstandig, gedeeld technologie- en uitvoeringsplatform dat een plaats heeft binnen de foundry-opzet van Yorisou. Het is geen eigendom van Yorisou.",
      "Doordat die gemeenschappelijke basis er is, hoeft geen enkel project haar opnieuw te bouwen en kan elk zich concentreren op het eigen domein. Wat zich opbouwt, wordt het vertrekpunt voor het volgende.",
    ],
    asterionBoundaryTitle: "De grens",
    asterionBoundaryBody:
      "Elk project wordt afzonderlijk bestuurd. Intellectueel eigendom, gegevens en operationele verantwoordelijkheid behoren toe aan het project zelf. Niets is zo ontworpen dat gegevens van een project of van gebruikers automatisch naar het platform stromen.",
    economicsHeading: ["Eigendom volgt", "bijdrage en verantwoordelijkheid."],
    economicsBody: [
      "De voorwaarden verschillen per project. Wij leggen niet één vaste formule over alles heen.",
      "Alleen het uitgangspunt is gedeeld: eigendom volgt de bijdrage, het gedragen risico en de verantwoordelijkheid die blijft. Wie een project leidt, heeft werkelijke zeggenschap.",
      "Het concrete bespreken wij per project en per persoon. Dat hoort niet op een website thuis.",
    ],
    maturityTitle: "Waar dit nu staat",
    maturityBody:
      "Deze manier van werken is geen bewezen, herhaalbare methode. Yorisou staat aan het begin en heeft nog geen project als zelfstandig bedrijf naar buiten gebracht. Wat hier staat, is hoe wij feitelijk te werk gaan — geen bewering over resultaten.",
  },

  /* ── BUILD WITH US (CORP-v1.2) ──────────────────────────────────────── */
  buildWithUs: {
    eyebrow: "Samen bouwen",
    heading: ["Waar u instapt, hangt af", "van waar u staat."],
    lead:
      "Yorisou brengt een project tot vlak vóór het punt waarop het een bedrijf wordt, en werkt dan samen met iemand die het kan dragen. Wij zoeken dus geen mensen om in dienst te nemen, maar mensen die het overnemen.",
    lanes: [
      {
        key: "founders",
        label: "Oprichters",
        title: "Oprichters en medeoprichters",
        body:
          "U neemt een project dat tot vlak vóór een bedrijf is gebracht over als het uwe. U stapt in als oprichter, niet in loondienst — de beslissingen liggen bij u, en de verantwoordelijkheid ook.",
        invites: [
          "U heeft werkelijk iets geleid waar echte uitvoering achter zat",
          "U kunt vooruit terwijl er nog veel onbeslist is",
          "U kent een van deze werelden: techniek, productie, overheid of de lokale praktijk",
        ],
        offers: "Onderzoek en bewijs, een eerste product, het ondernemingsontwerp en de gedeelde basis. U begint niet bij nul, maar halverwege.",
        cannot: "Wij kunnen op dit moment geen salaris, geen financiering en geen voorwaarden over een aandeel toezeggen. De voorwaarden bespreken wij per project.",
        ventures: ["Mirai Move", "Kakari", "Chigamo"],
        state: "Wij zijn in de fase van luisteren. Er is geen openstaande positie.",
        cta: "Laat uw interesse weten",
      },
      {
        key: "team",
        label: "Oprichtingsteam",
        title: "Oprichtingsteam en specialisten",
        body:
          "Eén oprichter is nooit genoeg. Wij zoeken mensen die vanaf het begin een deel dragen: de techniek, de uitvoering of de praktijk zelf.",
        invites: [
          "U heeft niet alleen gebouwd, maar het ook in de uitvoering meegemaakt",
          "U heeft met een klein team iets opgezet",
          "U weet wat in uw vakgebied vanzelfsprekend is",
        ],
        offers: "Een plek vanaf het begin, en werkelijke ruimte over het deel dat u draagt.",
        cannot: "Er is geen doorlopende werving. Wij kunnen niet zeggen dat wij op dit moment in staat zijn mensen aan te nemen.",
        ventures: ["Mirai Move", "Kakari"],
        state: "Het hangt af van de fase van het project. Vertel ons eerst wat u zou kunnen doen.",
        cta: "Begin een gesprek",
      },
      {
        key: "users",
        label: "Eerste gebruikers",
        title: "Eerste gebruikers en mensen die met ons meetesten",
        body:
          "Wij willen dat mensen naar het gebouwde kijken vanuit de positie van iemand die het werkelijk gebruikt — niet om te horen dat het goed is, maar om te horen waar het vastloopt.",
        invites: [
          "U bent zelf op dit vraagstuk vastgelopen",
          "U kunt onomwonden zeggen wat niet werkte",
          "U vindt het geen bezwaar iets te zien voordat het openbaar is",
        ],
        offers: "U krijgt iets te zien dat nog in aanbouw is, en wat u zegt gaat terug het ontwerp in.",
        cannot: "Wij kunnen geen datum van publicatie toezeggen, niet dat uw wens wordt overgenomen, en geen vergoeding.",
        ventures: ["Kakari", "Mirai Move"],
        state: "Wij zoeken mensen om het aan te laten zien. Dit is geen formeel programma.",
        cta: "Laat uw interesse weten",
      },
      {
        key: "research",
        label: "Universiteiten",
        title: "Universiteiten en onderzoek",
        body:
          "Om onderzoek bruikbaar te maken voor de samenleving is er naast het onderzoek ook ondernemingsontwerp nodig. Wij zoeken mensen om samen mee na te denken over het opleiden van oprichters en over de implementatie van onderzoek.",
        invites: [
          "U zoekt een plek waar onderzoek kan landen",
          "U wilt studenten en onderzoekers echte oprichterservaring geven",
          "U begint liever bij een gezamenlijke verkenning",
        ],
        offers: "Ondernemingsontwerp, en werk dat werkelijk draait. Wij kunnen beginnen bij een verkenning.",
        cannot: "Er is nog geen onderzoeksovereenkomst, geen financiering en geen formele samenwerking.",
        ventures: ["Mirai Move", "Chigamo"],
        state: "Wij hebben nog geen enkele samenwerking achter ons. Het begint bij een gesprek.",
        cta: "Begin een gesprek",
      },
      {
        key: "public",
        label: "Publieke sector",
        title: "Overheid en publieke sector",
        body:
          "De regels bestaan al, maar zijn nooit vertaald naar stappen die een inwoner kan volgen. Wij willen de kleine proef, de meting en de weg naar iets blijvends samen ontwerpen.",
        invites: [
          "U heeft een vraagstuk dat in de praktijk beproefd kan worden",
          "U wilt het in een vorm waarin het effect meetbaar is",
          "U wilt niet dat het bij een eenmalige pilot blijft",
        ],
        offers: "Onderzoek, bewijs geordend tot iets bruikbaars, en een opzet om klein te beproeven.",
        cannot: "Wij hebben nog geen traject met een gemeente achter ons, en wij kunnen geen enkele bestuurlijke of wettelijke garantie geven.",
        ventures: ["Mirai Move", "Kakari"],
        state: "Het begint bij een gesprek. Er loopt op dit moment niets.",
        cta: "Neem contact op",
      },
      {
        key: "corporate",
        label: "Bedrijven",
        title: "Bedrijven",
        body:
          "Wanneer er in uw eigen praktijk een vraagstuk ligt dat een onderneming zou moeten worden. Wij kunnen beginnen bij gezamenlijke ontwikkeling of bij een proef in de praktijk.",
        invites: [
          "In uw werk ligt een onopgelost operationeel vraagstuk",
          "U zoekt de vorm van een nieuwe onderneming",
          "U zoekt een partner om samen mee te ontwikkelen",
        ],
        offers: "Wij kunnen instappen bij het opnieuw ontwerpen van het vraagstuk als onderneming.",
        cannot: "Wij hebben geen zakelijke referenties en geen klantcases die wij u kunnen laten zien.",
        ventures: ["Mirai Move", "Kakari", "Chigamo"],
        state: "Het begint bij luisteren.",
        cta: "Stel uw vraag",
      },
    ],
    intakeTitle: "Over aanmelden",
    intakeBody:
      "Er is op dit moment geen aanmeldingsprocedure en geen selectieprogramma. Wat hier staat is een uitnodiging, geen bestaande samenwerking en geen openstaande functie. Wij beginnen door te horen wat u heeft, en of er iets te bespreken valt.",
    foundingTeamEyebrow: "Oprichtingsteam",
    foundingTeamHeading: ["Wij beginnen te bouwen", "vóór er een bedrijf is."],
    foundingTeamBody: [
      "Meestal begint een onderneming pas nadat er mensen bij elkaar zijn gekomen. Yorisou werkt in de omgekeerde volgorde: eerst het onderzoek en het bewijs, het eerste product en het ondernemingsontwerp, en daarna zoeken wij degene die het overneemt.",
      "Niemand begint dus met een leeg blad. U begint door iets op te pakken dat al een vorm heeft, en het het uwe te maken.",
      "Wat daarbij niet verandert, is wat overnemen betekent. Wie de beslissingen heeft, draagt ook de verantwoordelijkheid. Als de mensen die het leiden niet werkelijk kunnen beslissen, is het geen bedrijf geworden.",
    ],
    ctaHeading: ["Wie u ook bent,", "de ingang is dezelfde."],
    ctaBody: "Schrijf wat u voor ogen heeft en stuur het ons. Wij lezen alles op volgorde.",
  },
};
