import type { SiteCopy } from "../types";

/**
 * CORP-P5R2 — ITALIAN. Translated from the Japanese canonical source (ja.ts), with en.ts used only
 * as a structural reference.
 *
 * This is an adapted sibling, not a literal rendering: it is written to read as natural corporate
 * Italian. It may never be stronger than the Japanese. No customer, partner, metric, revenue,
 * funding, market-position, team-size or capability claim appears here that the Japanese does not
 * already make.
 *
 * On the company form: Yorisou is a Japanese godo kaisha (LLC), a limited-liability company.
 * It is never described with a joint-stock term, and the representative is "socio amministratore"
 * (representative member), never an "amministratore delegato" of a joint-stock company.
 *
 * On the representative: "Harvard Business School Executive Education" is stated precisely. It is
 * NOT a Harvard University degree and NOT an HBS MBA, and must never be shortened in a way that
 * implies either. No endorsement by IESE, Harvard, Ficosa, or any government body is implied.
 */
export const it: SiteCopy = {
  chrome: {
    skip: "Vai al contenuto",
    menu: "Menu",
    menuToggle: "Apri e chiudi il menu",
    close: "Chiudi",
    navLabel: "Navigazione del sito",
    navLabelMobile: "Navigazione del sito (mobile)",
    langLabel: "Lingua di visualizzazione",
    langHeading: "Scegli una lingua",
    langSearch: "Cerca una lingua",
    langCurrent: "Lingua attuale",
    previewBadge: "Anteprima — non pubblicato",
    nav: { home: "Home", miraiMove: "Mirai Move", kakari: "Kakari", about: "Chi siamo", company: "Società", contact: "Contatti" },
    footerTagline: "Tra le persone e la società, costruiamo il prossimo modo di stare accanto.",
    footerProjects: "Progetti",
    footerCompany: "Società",
    footerLegalNote: "Tutto ciò che dichiariamo qui si basa su un documento che possiamo verificare.",
    backToTop: "Torna all’inizio",
  },

  meta: {
    home: { title: "Yorisou LLC — Tra le persone e la società, costruiamo il prossimo modo di stare accanto.", description: "Yorisou LLC osserva da vicino la complessità della vita quotidiana, del lavoro e delle comunità locali e costruisce prodotti che aiutano le persone a comprenderla, a scegliere e ad andare avanti. Stiamo sviluppando Mirai Move e Kakari." },
    miraiMove: { title: "Mirai Move — Yorisou LLC", description: "Una piattaforma per l’informazione, il matching e lo sviluppo di business nel settore della mobilità in Giappone. Il sito pubblico è online; le funzionalità della piattaforma sono in sviluppo." },
    kakari: { title: "Kakari — Yorisou LLC", description: "Supporto multilingue per procedure amministrative e documenti, per chi vive in Giappone e per chi avvia qui un’attività. In sviluppo, non ancora disponibile al pubblico." },
    about: { title: "Chi siamo — Yorisou LLC", description: "Perché Yorisou esiste, come ragiona e come costruisce. Non scriviamo ciò che non possiamo verificare." },
    company: { title: "Società — Yorisou LLC", description: "Profilo societario, profilo del socio amministratore, messaggio del socio amministratore e aree di attività di Yorisou LLC." },
    contact: { title: "Contatti — Yorisou LLC", description: "Richieste relative alle nostre attività, a collaborazioni e alla stampa." },
  },

  common: {
    readMore: (name) => `Scopri di più su ${name}`,
    backHome: "Torna alla panoramica della società",
    stageLabel: "Stato attuale",
    boundaryLabel: "Ciò di cui non ci occupiamo",
  },

  home: {
    eyebrow: "Yorisou LLC",
    thesis: ["Tra le persone e la società,", "costruiamo il prossimo modo", "di stare accanto."],
    lead: ["Yorisou osserva da vicino la complessità della vita quotidiana, del lavoro e delle comunità locali,", "e costruisce prodotti che aiutano le persone a comprenderla, a scegliere e ad andare avanti."],
    humanSide: "Persone",
    humanItems: ["Vita quotidiana", "Lavoro", "Comunità"],
    systemSide: "Sistemi",
    systemItems: ["Mobilità", "Procedure amministrative"],
    fieldCaption: "Persone — vita quotidiana, lavoro, comunità  /  Sistemi — mobilità, procedure amministrative",
    fieldRelation: "Relazioni",

    whyEyebrow: "I problemi su cui lavoriamo",
    whyHeading: ["La complessità non si risolve", "con il solo sforzo individuale."],
    whyBeats: [
      { no: "01", title: "Il «non capisco» ferma le persone sulla soglia.", body: "Un sistema che esiste ma non è raggiungibile equivale a un sistema che non esiste." },
      { no: "02", title: "La strada verso un professionista è lunga.", body: "Prima del punto in cui serve davvero il giudizio di una persona, c’è un tratto che un sistema potrebbe coprire." },
      { no: "03", title: "Il campo e il sistema non si incastrano.", body: "Nella mobilità, nel welfare e nella pubblica amministrazione esistono possibilità che non sono ancora arrivate a chi lavora sul campo." },
    ],

    buildEyebrow: "Ciò che costruiamo",
    buildHeading: ["Costruiamo il prossimo modo di stare accanto,", "una cosa alla volta."],

    howEyebrow: "Come costruiamo",
    howHeading: ["Ci facciamo carico della complessità", "e la trasformiamo in qualcosa di utilizzabile."],
    howBeats: [
      { no: "01", title: "Partire dal linguaggio di chi è sul campo", body: "Non progettiamo a partire dalla tecnologia. Lavoriamo a ritroso dai passaggi reali di chi si trova bloccato." },
      { no: "02", title: "Farci carico del problema fino alla comprensione", body: "Presentare informazioni non basta. Sapere che cosa fare dopo rientra nel perimetro della progettazione." },
      { no: "03", title: "Dichiarare il confine", body: "Non entriamo nel lavoro che spetta a un professionista abilitato. Ciò di cui ci occupiamo, e il punto in cui passiamo il testimone, è scritto nel prodotto stesso." },
      { no: "04", title: "Dire solo ciò che è verificabile", body: "Risultati, numeri e collaborazioni compaiono solo dove esistono prove. Ciò che non può essere confermato non viene scritto." },
    ],
    howDisclose: "Che cosa significano questi principi nella pratica",

    founderEyebrow: "Socio amministratore",
    founderHeading: ["Costruito da chi ha passato", "vent’anni dentro settori complessi."],
    founderTeaser: "Vent’anni tra automotive, mobilità, produzione industriale e business internazionale, stando tra la tecnologia, la sua implementazione e la realtà commerciale. La stessa scena si ripeteva: un sistema ben costruito che si ferma prima di raggiungere la persona che ne ha bisogno.",
    founderRole: "Socio amministratore, Yorisou LLC",
    founderCta: "Il socio amministratore",

    messageEyebrow: "Messaggio",
    messageHeading: ["Giudichiamo se arriva,", "non se è avanzato."],
    messageTeaser: "Ciò di cui ci occupiamo non è la novità. I sistemi e le possibilità esistono già: semplicemente si fermano prima di raggiungere chi ne ha bisogno. Stiamo costruendo un’azienda che riduce quella distanza, un passo alla volta.",
    messageCta: "Leggi il messaggio completo",

    originEyebrow: "Dove siamo",
    originHeading: ["Partiamo da Fukuoka."],
    originBody: "Yorisou LLC sta costruendo l’azienda da Fukuoka, in Giappone: un luogo in cui vita quotidiana, lavoro e comunità stanno vicini, e in cui la progettazione può partire dai passaggi che le persone compiono davvero.",

    proofEyebrow: "Società",
    proofHeading: ["Ciò che possiamo dichiarare,", "e nulla di più."],

    ctaEyebrow: "Contatti",
    ctaHeading: ["Potrebbe esserci spazio", "per lavorare insieme."],
    ctaBody: "Accogliamo richieste sulle nostre attività, proposte di collaborazione e domande della stampa. Rispondiamo via via, in base a ciò che ci viene chiesto.",
    ctaButton: "Scrivici",
  },

  mirai: {
    eyebrow: "Progetto 01",
    heading: ["Una piattaforma per l’informazione, il matching", "e lo sviluppo di business", "nel settore della mobilità in Giappone."],
    stage: "Sito pubblico online / funzionalità della piattaforma in sviluppo",
    lead: "Mirai Move vuole mettere in relazione amministrazioni pubbliche e comuni, imprese, realtà locali e servizi di assistenza e welfare, fornitori esteri e partner nazionali, perché informazioni e opportunità legate alla mobilità possano essere trattate come un unico flusso. Oggi il sito pubblico di informazione è online; le funzionalità della piattaforma sono in fase di sviluppo.",
    domain: "Il settore della mobilità in Giappone",
    networkEyebrow: "Chi mette in relazione",
    networkHeading: ["Soggetti che si trovano in posizioni diverse", "guardano alla stessa opportunità", "con parole diverse."],
    centre: "Opportunità di mobilità",
    parties: [
      { no: "01", title: "Amministrazioni pubbliche e comuni", body: "Il lato delle regole e del budget" },
      { no: "02", title: "Imprese", body: "Il lato della fornitura e della realizzazione" },
      { no: "03", title: "Realtà locali, assistenza e welfare", body: "Dove il movimento accade davvero" },
      { no: "04", title: "Fornitori esteri e partner nazionali", body: "Il lato che porta le alternative" },
    ],
    boundaryTitle: "Sullo stato di sviluppo",
    boundaryBody: "La piattaforma vera e propria è in sviluppo. L’esecuzione autonoma da parte di agenti non è attivata. Ogni azione che raggiunge l’esterno del sistema è progettata per richiedere una conferma umana. Non viene offerta come piattaforma completa e pienamente funzionante.",
    detail: [
      { heading: "Il problema che affronta", body: "Le alternative di mobilità esistono separate per territorio, per normativa e per operatore. Chi ne ha bisogno e l’alternativa che già esiste non si incontrano nello stesso luogo." },
      { heading: "Con chi lavora", body: "Amministrazioni pubbliche e comuni, imprese, realtà locali e servizi di assistenza e welfare, fornitori esteri e partner nazionali. Soggetti con posizioni e criteri di giudizio diversi guardano alla stessa opportunità con parole diverse." },
      { heading: "Che cosa è attivo oggi", body: "Il sito pubblico di informazione è online. Le funzioni di informazione, matching e sviluppo di business della piattaforma sono nella fase di costruzione delle fondamenta e dell’architettura." },
    ],
    siteLabel: "Sito pubblico",
    siteUrl: "https://www.miraimove.com",
  },

  kakari: {
    eyebrow: "Progetto 02",
    heading: ["Supporto multilingue per procedure", "e documenti, per chi vive in Giappone", "e per chi avvia qui un’attività."],
    stage: "In sviluppo (non ancora disponibile al pubblico)",
    lead: "Quando l’ostacolo è la lingua o la conoscenza specialistica, le persone non riescono a raggiungere sistemi che avrebbero il diritto di usare. Kakari accompagna nell’individuare le informazioni necessarie, preparare i documenti, compilare i moduli e seguire le indicazioni per la presentazione e l’invio postale, in più lingue. È in fase di sviluppo e non è disponibile al pubblico.",
    domain: "Procedure amministrative e documenti / multilingue",
    procedureEyebrow: "La procedura che accompagna",
    procedureHeading: ["Dall’informarsi,", "al presentare la domanda."],
    steps: [
      { no: "01", title: "Informarsi", body: "Individuare quali procedure riguardano la propria situazione" },
      { no: "02", title: "Raccogliere i documenti", body: "Definire i documenti e gli allegati necessari" },
      { no: "03", title: "Preparare", body: "Compilare i moduli nella propria lingua e verificarne il contenuto" },
      { no: "04", title: "Presentare", body: "Indicazioni su dove, come e con quale procedura postale presentare la domanda" },
    ],
    boundaryTitle: "Dove subentra un professionista",
    boundaryBody: "Non agiamo in qualità di professionisti abilitati per conto dell’utente. Gli ambiti che richiedono valutazioni legali, fiscali o ufficiali sono indicati esplicitamente come attività di competenza di un professionista. Le valutazioni e la rappresentanza che richiedono un’abilitazione — come avvocato, consulente fiscale o scrivano amministrativo — non rientrano nelle funzioni di Kakari.",
    detail: [
      { heading: "Il problema che affronta", body: "Come si svolge una procedura è un’informazione pubblica. Eppure ci sono persone che non riescono a raggiungere il sistema solo perché mancano la lingua e le conoscenze date per scontate. Non è una questione di capacità personale." },
      { heading: "Con chi lavora", body: "Persone che vivono in Giappone e persone che stanno per avviare qui un’attività: chi si trova in difficoltà a portare avanti da solo una procedura in giapponese." },
      { heading: "Che cosa è attivo oggi", body: "L’infrastruttura di autenticazione è stata realizzata in un ambiente di verifica isolato, in cui si stanno verificando permessi e archiviazione. Le integrazioni esterne restano disattivate e il servizio non è disponibile al pubblico." },
    ],
  },

  about: {
    eyebrow: "Chi siamo",
    heading: ["Il modo in cui costruiamo", "è la promessa che facciamo."],
    lead: "Yorisou osserva da vicino la complessità della vita quotidiana, del lavoro e delle comunità locali e costruisce prodotti che aiutano le persone a comprenderla, a scegliere e ad andare avanti.",
    whyHeading: ["Perché esiste questa azienda."],
    whyBody: [
      "Sistemi, tecnologie e possibilità esistono già in gran numero. Eppure si fermano prima di raggiungere la persona che ne ha bisogno. È su quest’ultima distanza che lavoriamo.",
      "Questa distanza viene di solito descritta come una questione di impegno personale o di quantità di informazioni. In pratica, però, la complessità che il sistema avrebbe potuto assorbire viene semplicemente consegnata all’individuo.",
    ],
    thinkHeading: ["Come ragioniamo."],
    thinkBody: [
      "Non progettiamo a partire dalla tecnologia. Cominciamo sciogliendo la mossa che al momento è bloccata: leggere la situazione della persona, ordinarla come un insieme di relazioni e portarla fino al punto in cui il passo successivo è chiaro. È questo il perimetro della progettazione.",
      "L’AI serve a quella comprensione e a quella strutturazione, non a decidere al posto di qualcuno. Il suo compito è mettere in una forma utilizzabile il materiale di cui una persona ha bisogno per decidere.",
    ],
    buildHeading: ["Come costruiamo."],
    principles: [
      { no: "01", title: "Partire dal linguaggio di chi è sul campo", body: "Non progettiamo a partire dalla tecnologia. Lavoriamo a ritroso dai passaggi reali di chi si trova bloccato." },
      { no: "02", title: "Farci carico del problema fino alla comprensione", body: "Presentare informazioni non basta. Sapere che cosa fare dopo rientra nel perimetro della progettazione." },
      { no: "03", title: "Dichiarare il confine", body: "Non entriamo nel lavoro che spetta a un professionista abilitato. Ciò di cui ci occupiamo, e il punto in cui passiamo il testimone, è scritto nel prodotto stesso." },
      { no: "04", title: "Dire solo ciò che è verificabile", body: "Risultati, numeri e collaborazioni compaiono solo dove esistono prove. Ciò che non può essere confermato non viene scritto." },
    ],
    principlesLong: [
      { no: "01", title: "Partire dal linguaggio di chi è sul campo", long: "Nessun sistema arriva a qualcuno finché non è tradotto nei passaggi che quella persona compie davvero. Partiamo dalla domanda reale, dallo spostamento reale, dallo scambio reale: non da un problema astratto, ma dalla singola mossa che in questo momento è bloccata." },
      { no: "02", title: "Farci carico del problema fino alla comprensione", long: "Elencare risultati di ricerca non è supporto. Ciò di cui una persona ha bisogno è sapere che cosa fare adesso. Il perimetro del prodotto arriva al punto in cui il passo successivo è compreso, non al punto in cui l’informazione è stata mostrata." },
      { no: "03", title: "Dichiarare il confine", long: "Lasciare che qualcuno usi un prodotto senza chiarire ciò che non può fare è la progettazione più pericolosa che esista. Ciò di cui ci occupiamo, e il punto in cui subentra un professionista, è scritto nella schermata stessa. Il confine è una funzione, non una postilla." },
      { no: "04", title: "Dire solo ciò che è verificabile", long: "Non raccontiamo risultati che non possiamo confermare, né funzioni che non sono ancora attive. Ogni fatto che pubblichiamo ha alle spalle un documento che lo sostiene. Nei periodi in cui c’è poco da dire, pubblichiamo poco." },
    ],
    orderHeading: ["Una cosa alla volta,", "fino in fondo."],
    orderBody: "Non avviamo molte cose insieme. Preferiamo portare un solo ambito fino al punto in cui raggiunge i passaggi che le persone compiono davvero.",
    claimsHeading: ["Non scriviamo ciò", "che non possiamo verificare."],
    claimsBody: "Ogni fatto che pubblichiamo ha alle spalle un documento che lo sostiene. Nei periodi in cui c’è poco da dire, pubblichiamo poco.",
  },

  company: {
    eyebrow: "Società",
    heading: ["Yorisou LLC"],
    intro: "Yorisou LLC costruisce prodotti che trasformano la complessità della vita quotidiana, del lavoro e delle comunità locali in qualcosa che una persona può comprendere, scegliere e mettere in pratica. Con base a Fukuoka, portiamo avanti due progetti: Mirai Move e Kakari.",

    messageEyebrow: "Messaggio del socio amministratore",
    messageHeading: ["Giudichiamo se arriva,", "non se è avanzato."],
    message: [
      "Ciò di cui ci occupiamo non è la novità.",
      "Per più di vent’anni, tra automotive, mobilità e produzione industriale, sono stato tra la tecnologia, la sua implementazione e la realtà commerciale. La stessa scena si ripeteva: un sistema ben costruito che si ferma prima di raggiungere la persona che ne ha bisogno. Non perché mancasse la tecnologia, ma perché non era stata tradotta nei passaggi che quella persona compie davvero.",
      "Sistemi e possibilità esistono già in gran numero. Ma se qualcuno non riesce a capire se lo riguardano, o che cosa fare dopo, è come se non esistessero. Ridurre quest’ultima distanza, facendola assorbire dal sistema e non dall’individuo, è la ragione per cui ho creato Yorisou.",
      "Non usiamo l’AI per decidere al posto delle persone. La usiamo per leggere la situazione, ordinarla come un insieme di relazioni e metterla in una forma utilizzabile, perché sia una persona a decidere. Il giudizio e la responsabilità restano alla persona. Ciò di cui ci occupiamo, e il punto in cui passiamo il testimone a un professionista, è scritto nella schermata stessa.",
      "Come azienda siamo ancora piccoli e non c’è molto che possiamo già dichiarare. È proprio per questo che scriviamo solo ciò che abbiamo potuto verificare. A crescere non deve essere l’affermazione, ma ciò che è davvero arrivato alle persone.",
    ],
    messageSignature: "Jin Yang",
    messageRole: "Socio amministratore, Yorisou LLC",

    profileEyebrow: "Socio amministratore",
    profileHeading: ["Il socio amministratore"],
    profileName: "Jin Yang",
    profileNameLatin: "Jin Yang / Edward Jin",
    profileRole: "Socio amministratore, Yorisou LLC",
    profileBody: [
      "Oltre vent’anni di esperienza professionale tra automotive, mobilità, produzione industriale, sviluppo di progetti industriali, supply chain, sviluppo commerciale, sviluppo prodotto e attività internazionali a cavallo tra più Paesi.",
    ],
    profileBackgroundLabel: "Percorso professionale",
    profileBackground: [
      "Ha ricoperto responsabilità senior in ambito commerciale e di progetti industriali presso Ficosa, fornitore internazionale di componentistica automotive, con attività legate a progetti industriali globali e all’attività commerciale nell’area asiatica.",
      "Ha successivamente fondato e gestito imprese tecnologiche e manifatturiere in Cina, occupandosi di elettronica per l’automotive, sistemi di controllo, produzione di precisione e sviluppo di prodotti e sistemi basati sull’AI.",
      "Ha esperienza di gestione di attività internazionali in più mercati, tra cui Europa, Cina e Giappone.",
      "Oggi è socio amministratore di Yorisou LLC in Giappone e sta costruendo l’azienda da Fukuoka.",
    ],
    profileEducationLabel: "Formazione",
    profileEducation: [
      "MBA, IESE Business School",
      "General Management Program, Harvard Business School Executive Education",
    ],
    profileRelevanceLabel: "Perché questo percorso conta per Yorisou",
    profileRelevance: [
      "Una lunga esperienza operativa attraverso settori industriali reali e complessi.",
      "L’aver lavorato nel punto in cui si incontrano tecnologia, produzione, esecuzione commerciale e mercati internazionali.",
      "Il contatto diretto con il divario tra ciò che un sistema o una tecnologia sanno fare e ciò che una persona o un’organizzazione riescono davvero a usare.",
      "E, di conseguenza, la scelta di costruire prodotti che trasformano la complessità in qualcosa di comprensibile e praticabile.",
    ],

    overviewEyebrow: "Profilo societario",
    overviewHeading: ["Profilo societario"],
    facts: [
      { label: "Denominazione", value: "Yorisou LLC (Yorisou GK)" },
      { label: "Socio amministratore", value: "Jin Yang" },
      { label: "Sede", value: "Città di Fukuoka, prefettura di Fukuoka, Giappone" },
      { label: "Attività", value: "Ideazione, sviluppo e gestione di Mirai Move e Kakari" },
    ],

    businessEyebrow: "Aree di attività",
    businessHeading: ["Aree di attività"],
    businessBody: "Informazione, matching e sviluppo di business nel settore della mobilità; e supporto multilingue per procedure amministrative e documenti, rivolto a chi vive in Giappone e a chi avvia qui un’attività. Entrambe seguono lo stesso principio: farsi carico della complessità e restituire qualcosa di utilizzabile.",

    projectsEyebrow: "Progetti",
    projectsHeading: ["Che cosa stiamo costruendo"],

    originEyebrow: "Dove siamo",
    originHeading: ["Partiamo da Fukuoka."],
    originBody: [
      "Yorisou LLC sta costruendo l’azienda dalla città di Fukuoka, in Giappone.",
      "È un luogo in cui vita quotidiana, lavoro e comunità stanno vicini, e in cui la progettazione può partire dai passaggi che le persone compiono davvero.",
    ],

    ctaHeading: ["Contatti"],
    ctaBody: "Accogliamo richieste sulle nostre attività, proposte di collaborazione e domande della stampa.",
  },

  contact: {
    eyebrow: "Contatti",
    heading: ["Contatti"],
    lead: "Accogliamo richieste sulle nostre attività, proposte di collaborazione e domande della stampa. Rispondiamo via via, in base a ciò che ci viene chiesto.",
    channelsHeading: ["Di che cosa puoi scriverci"],
    channels: [
      { title: "Richieste generali", body: "Domande su Yorisou come azienda e sui progetti che stiamo portando avanti." },
      { title: "Business e collaborazioni", body: "Proposte di collaborazione o discussioni commerciali nell’ambito della mobilità o delle procedure amministrative." },
      { title: "Stampa e media", body: "Richieste di interviste e domande sull’azienda o sul suo socio amministratore." },
    ],
    formHeading: ["Scrivici un messaggio"],
    formIntro: "Usa il modulo qui sotto. Leggiamo ogni richiesta e rispondiamo via via.",
    fields: {
      name: "Nome", namePlaceholder: "Il tuo nome",
      email: "Email", emailPlaceholder: "you@example.com",
      org: "Azienda o organizzazione", orgPlaceholder: "Facoltativo",
      type: "Tipo di richiesta",
      message: "Messaggio", messagePlaceholder: "Raccontaci il contesto e che cosa vorresti verificare.",
    },
    types: [
      { value: "general", label: "Richiesta generale" },
      { value: "business", label: "Business e collaborazioni" },
      { value: "media", label: "Stampa e media" },
    ],
    submit: "Invia",
    sending: "Invio in corso…",
    successTitle: "Messaggio inviato",
    successBody: "Abbiamo ricevuto la tua richiesta. La esamineremo e ti risponderemo.",
    errorTitle: "Invio non riuscito",
    errorBody: "Attendi un momento e riprova.",
    required: "Obbligatorio",
    privacyNote: "I dati personali che ci fornisci sono utilizzati esclusivamente per rispondere alla tua richiesta.",
  },
};
