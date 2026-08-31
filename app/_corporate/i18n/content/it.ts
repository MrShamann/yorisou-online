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
    home: { title: "Yorisou LLC — Dai problemi strutturali a società che stanno in piedi da sole.", description: "Yorisou LLC è una foundry: individuiamo problemi strutturali, costruiamo prove e asset d’impresa e formiamo team fondatori per farne società indipendenti. Mirai Move, Kakari e Chigamo sono in corso." },
    miraiMove: { title: "Mirai Move — Yorisou LLC", description: "Una piattaforma per l’informazione, il matching e lo sviluppo di business nel settore della mobilità in Giappone. Il sito pubblico è online; le funzionalità della piattaforma sono in sviluppo." },
    kakari: { title: "Kakari — Yorisou LLC", description: "Supporto multilingue per procedure amministrative e documenti, per chi vive in Giappone e per chi avvia qui un’attività. In sviluppo, non ancora disponibile al pubblico." },
    about: { title: "Come costruiamo — Yorisou LLC", description: "Individuare il problema, verificarlo, progettarlo come impresa, formare un team fondatore e portarlo fino a una società indipendente. Come funziona la foundry di Yorisou e quale posto occupa l’infrastruttura condivisa." },
    company: { title: "Società — Yorisou LLC", description: "Profilo societario, profilo del socio amministratore, messaggio del socio amministratore e aree di attività di Yorisou LLC." },
    contact: { title: "Contatti — Yorisou LLC", description: "Richieste relative alle nostre attività, a collaborazioni e alla stampa." },
    ventures: { title: "Progetti — Yorisou LLC", description: "I progetti e le idee su cui Yorisou sta lavorando ora: Mirai Move, Kakari e Chigamo. Ognuno è a uno stadio diverso, e lo scriviamo com’è." },
    buildWithUs: { title: "Costruire insieme — Yorisou LLC", description: "Le vie d’ingresso per fondatori, ricercatori, enti pubblici e imprese. Non c’è un programma di candidature: si parte da una conversazione." },
    chigamo: { title: "Chigamo — Yorisou LLC", description: "Un’idea: rendere riconoscibile, a partire da posizione e contesto, ciò che è davvero utile in un dato luogo. È in fase di concept; non esiste alcun prodotto pubblicato." },
  },

  common: {
    readMore: (name) => `Scopri di più su ${name}`,
    backHome: "Torna alla panoramica della società",
    stageLabel: "Stato attuale",
    boundaryLabel: "Ciò di cui non ci occupiamo",
    nowLabel: "Adesso",
    nextLabel: "Il passo successivo",
    whoLabel: "Chi vorremmo ascoltare",
  },

  home: {
    eyebrow: "Yorisou LLC",
    thesis: ["Dai problemi strutturali,", "costruiamo aziende", "che stanno in piedi da sole."],
    lead: [
      "Yorisou è una foundry: individuiamo i problemi strutturali della società, li verifichiamo,",
      "li progettiamo come imprese e facciamo squadra con chi le guiderà,",
      "accompagnandole fino a farne società indipendenti.",
    ],
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
    buildHeading: ["Tre ambiti su cui", "stiamo lavorando ora."],

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

    /* CORP-v1.2 — Asterion layer and engagement layer on the homepage. */
    asterionEyebrow: "Infrastruttura condivisa",
    asterionHeading: ["A ogni progetto,", "le fondamenta si fanno più solide."],
    asterionBody:
      "Asterion OS è una piattaforma tecnologica e di esecuzione condivisa e indipendente, collocata all’interno dell’architettura foundry di Yorisou. Poiché la base comune esiste già, ogni progetto può concentrare le proprie energie sulla parte che gli è davvero propria.",
    asterionNote:
      "Ogni progetto è governato separatamente e mantiene proprietà intellettuale, dati e responsabilità operativa propri. Asterion non è di proprietà di Yorisou.",
    engageEyebrow: "Costruire insieme",
    engageHeading: ["Entra già nella fase", "in cui diventa una società."],
    engageBody:
      "Fondatori, ricercatori, enti pubblici, imprese. Il punto in cui si entra dipende da dove ci si trova. Partiamo da ciò di cui si può parlare adesso.",
    engageCta: "Vedi le vie d’ingresso",
    engageNote: "In ogni caso si comincia da una conversazione. Non esiste ancora né una procedura di candidatura né un meccanismo di selezione.",
    explainerLabel: "Yorisou in 30 secondi",
    explainerHeading: ["Dal problema alla società,", "in trenta secondi."],
    explainerClose: "Chiudi",
    explainerPlay: "Riproduci",
    explainerPause: "Pausa",
    explainerRestart: "Ricomincia",
    explainerStepLabel: "Scena",
  },

  mirai: {
    reading: "Portare la mobilità dei territori fino a una soluzione.",
    now: "Il sito pubblico è online e il sistema che legge senza sosta le fonti pubbliche gira da solo. Ma verso l’esterno non è ancora uscito nulla: nemmeno una volta.",
    next: "Sul primo caso concreto restano questioni che non si possono chiudere dalla scrivania. Da qui in avanti tocca alle persone.",
    who: "Chi conosce dall’interno la mobilità dei territori — comuni, operatori, il lavoro sul campo — e sa raccontare i vincoli reali.",
    join: {
      title: "Partecipare a questo progetto",
      body: "Ciò che serve adesso è qualcuno che sappia descrivere i vincoli in concreto. È la fase in cui si va a verificare, non quella in cui si vende.",
      roles: [
        "Lavori nel trasporto o nella mobilità di un territorio: comune, operatore o campo",
        "Potresti portare questo ambito sulle spalle, come fondatore o come chi lo gestisce",
        "Conosci come funziona davvero l’operatività quotidiana",
      ],
      state: "Siamo alla fase in cui vogliamo ascoltare. Non c’è alcuna posizione aperta.",
    },
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
    reading: "Perché una procedura in Giappone si possa portare avanti da soli.",
    now: "È una fase di test privata. Non è disponibile al pubblico e non lo sta ancora usando nessuno.",
    next: "I passaggi necessari alla distribuzione e la definizione dei dati di registrazione della società. Entrambi richiedono conferme dall’esterno.",
    who: "Chi vive in Giappone con cittadinanza straniera, chi lo accompagna in questo percorso e i professionisti abilitati.",
    join: {
      title: "Partecipare a questo progetto",
      body: "Vorremmo che a guardarlo per primo fosse chi sa com’è davvero fare queste procedure. Non è uno strumento pensato per sostituire un professionista.",
      roles: [
        "Ti sei trovato davvero in difficoltà con una procedura in Giappone",
        "Accompagni a qualche titolo persone straniere che vivono in Giappone",
        "Come professionista abilitato, puoi verificare con noi dove passa il confine",
        "Potresti portare questo progetto sulle spalle, come fondatore o come chi lo gestisce",
      ],
      state: "Cerchiamo persone a cui mostrarlo. Non abbiamo ancora pubblicato nulla e non abbiamo aperto nulla.",
    },
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
      { label: "Numero d’impresa (hōjin bangō)", value: "2290003018125" },
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

  /* ── VENTURES INDEX (CORP-v1.2) ─────────────────────────────────── */
  ventures: {
    eyebrow: "Ciò che stiamo costruendo",
    heading: ["In tre ambiti, il lavoro", "che precede la nascita di una società."],
    lead:
      "In tutti e tre, le regole e i sistemi esistono già e si fermano appena prima delle persone che ne hanno bisogno. Yorisou entra in quello spazio e dà forma alle cose verificandole man mano.",
    cards: [
      {
        name: "Mirai Move",
        href: "/mirai-move",
        thesis: "Mettere in relazione informazione, matching e sviluppo di business nella mobilità.",
        problem: "Informazioni e opportunità restano divise tra operatori, territori e amministrazioni.",
        building: "Una piattaforma in cui i soggetti giapponesi ed esteri possano parlare a partire dalle stesse informazioni.",
        status: "In sviluppo e in esercizio. Sito pubblico online.",
      },
      {
        name: "Kakari",
        href: "/kakari",
        thesis: "Sostenere in più lingue le procedure di chi vive in Giappone e di chi vi avvia un’attività.",
        problem: "I sistemi esistono, ma la barriera della lingua e dei passaggi li lascia inutilizzati.",
        building: "Un modo per scomporre una procedura in fasi e mostrare fin dove si può arrivare da soli.",
        status: "In sviluppo. In preparazione per il rilascio.",
      },
      {
        name: "Chigamo",
        href: "/chigamo",
        thesis: "Rendere comprensibile un luogo a partire da posizione e contesto.",
        problem: "Proprio le informazioni davvero utili in un luogo sono quelle che non si trovano.",
        building: "Uno strumento di scoperta del proprio territorio, costruito su posizione e contesto.",
        status: "Fase di concept. La verifica deve ancora cominciare.",
      },
    ],
    noteHeading: ["Che cosa dice questa pagina,", "e che cosa non dice."],
    noteBody: [
      "Qui sono elencati i progetti e le idee su cui Yorisou sta lavorando ora.",
      "Non sono società controllate, non sono partecipazioni e non sono clienti. Ognuno è a uno stadio diverso, e lo abbiamo scritto com’è.",
      "L’obiettivo è che ciascuno arrivi a reggersi come società indipendente. Nessuno ci è ancora arrivato.",
    ],
  },

  /* ── CHIGAMO (CORP-v1.2) ───────────────────────────────────────── */
  chigamo: {
    reading: "Capire un luogo, stando in quel luogo.",
    now: "Fase di concept. Non esiste un prodotto pubblicato, non ci sono utenti e non c’è alcun programma con enti locali.",
    next: "Se restringere per posizione e contesto renda l’informazione davvero utilizzabile. È la prima cosa che vogliamo verificare, in piccolo.",
    who: "Chi conosce davvero un territorio e sa dire dove le informazioni sul proprio quartiere smettono di essere utili.",
    join: {
      title: "Partecipare a questo progetto",
      body: "Siamo ancora prima della fase di verifica. Per questo cerchiamo meno qualcuno con cui costruire e più qualcuno che sappia smontare l’ipotesi.",
      roles: [
        "Conosci nel dettaglio un territorio preciso, dalla parte di chi ci abita",
        "Hai lavorato con dati di posizione o con dati territoriali",
        "Non ti pesa essere coinvolto mentre è ancora soltanto un’idea",
      ],
      state: "Fase di concept. La forma del coinvolgimento non è ancora definita.",
    },
    eyebrow: "Progetto",
    heading: ["Capire un luogo,", "stando in quel luogo."],
    stage: "Fase di concept",
    lead:
      "Un’idea: usare posizione e contesto per far emergere ciò che in un dato luogo è davvero utile. Siamo ancora prima della fase di verifica.",
    domain: "Territorio di vita / posizione e contesto / scoperta",
    conceptEyebrow: "Il ragionamento",
    conceptHeading: ["Le informazioni ci sono.", "Solo, non arrivano."],
    conceptBody: [
      "Proprio le cose che si vorrebbe davvero sapere di un luogo sono quelle che una ricerca restituisce peggio. Non perché l’informazione manchi, ma perché non è mai stata ordinata in rapporto al luogo e alla situazione.",
      "Dove ci si trova, in quale momento e in quale situazione: certe informazioni si riconoscono come proprie soltanto quando questi tre elementi coincidono. È lì che Chigamo prova a lavorare.",
    ],
    boundaryTitle: "A che punto siamo",
    boundaryBody:
      "Chigamo è in fase di concept. Non esiste un prodotto pubblicato, non ci sono utenti e non c’è alcun programma con enti locali. Quanto scritto qui è un’ipotesi che intendiamo verificare.",
    detail: [
      {
        heading: "Perché adesso",
        body: "Le mappe e i motori di ricerca sono strumenti maturi. Eppure «che cosa conta per me, nel posto in cui mi trovo adesso» resta qualcosa che ognuno deve ricostruirsi da sé.",
      },
      {
        heading: "Che cosa dobbiamo verificare",
        body: "Se restringere per posizione e contesto renda l’informazione davvero utilizzabile. È la prima cosa che vogliamo verificare, in piccolo.",
      },
    ],
  },

  /* ── HOW WE BUILD / FOUNDRY (CORP-v1.2) ──────────────────────────── */
  foundry: {
    eyebrow: "Come costruiamo",
    heading: ["Dal problema alla società,", "un passaggio alla volta."],
    lead:
      "Non partiamo da un’intuizione che ci è piaciuta. Individuiamo un problema strutturale, lo verifichiamo, lo progettiamo come impresa, ci uniamo a chi può gestirlo e lo portiamo fino a una società indipendente. Yorisou chiama foundry questo ordine di lavoro.",
    stagesEyebrow: "Le fasi",
    stagesHeading: ["Otto fasi,", "senza saltarne nessuna."],
    stages: [
      { no: "01", name: "Ipotesi", body: "Stabilire dove sta il problema strutturale: dalla forma concreta del lavoro reale, non da un’intuizione." },
      { no: "02", name: "Prove", body: "Verificare se il problema esiste davvero e su chi ricade. Molte ipotesi si fermano qui." },
      { no: "03", name: "Progettazione dell’impresa", body: "Dare al modo di risolverlo la forma di un’attività: chi la usa e dove nasce davvero uno scambio di valore." },
      { no: "04", name: "Costruzione", body: "Realizzarlo. Usare la base comune dove c’è e concentrare le forze su ciò che è specifico di quel progetto." },
      { no: "05", name: "Pronto come impresa", body: "Portare asset e procedure a uno stato in cui qualcuno dall’esterno possa prenderli in mano e farli funzionare." },
      { no: "06", name: "Formazione del team fondatore", body: "Unirsi a chi può portarlo avanti come cosa propria: come fondatore, non come dipendente." },
      { no: "07", name: "Indipendenza e gestione", body: "Farlo funzionare come società indipendente, in una forma che non resti dipendente da Yorisou." },
      { no: "08", name: "Apprendimento", body: "Conservare ciò che ha funzionato e ciò che si è fermato come materiale per il progetto successivo." },
    ],
    independenceHeading: ["L’obiettivo è una società", "che sta in piedi da sola."],
    independenceBody: [
      "Lo scopo della foundry non è accumulare cose sotto Yorisou. È portare ogni progetto al punto in cui può reggersi come società indipendente.",
      "Per questo lo costruiamo fin dall’inizio in una forma che si possa consegnare. Se chi lo gestisce non ha un potere decisionale reale, non è diventato una società.",
    ],
    asterionEyebrow: "Tecnologia ed esecuzione condivise",
    asterionHeading: ["Non costruire due volte", "la stessa cosa."],
    asterionBody: [
      "Asterion OS è una piattaforma tecnologica e di esecuzione condivisa e indipendente, collocata all’interno dell’architettura foundry di Yorisou. Non è di proprietà di Yorisou.",
      "Poiché la base comune c’è, nessun progetto deve ricostruirla e ognuno può concentrarsi sul proprio ambito. Ciò che si accumula diventa il punto di partenza per il progetto successivo.",
    ],
    asterionBoundaryTitle: "Il confine",
    asterionBoundaryBody:
      "Ogni progetto è governato separatamente. Proprietà intellettuale, dati e responsabilità operativa appartengono al progetto. Nulla è progettato perché i dati di un progetto o dei suoi utenti confluiscano automaticamente verso la piattaforma.",
    economicsHeading: ["La proprietà segue", "il contributo e la responsabilità."],
    economicsBody: [
      "Le condizioni cambiano da progetto a progetto. Non applichiamo a tutto una formula fissa.",
      "In comune c’è solo il principio: la proprietà segue il contributo, il rischio assunto e la responsabilità che continua nel tempo. Chi gestisce un progetto ha un potere decisionale reale.",
      "Le condizioni concrete si discutono per ogni progetto e con ciascun interlocutore. Non sono il genere di cose che stanno su un sito.",
    ],
    maturityTitle: "A che punto siamo",
    maturityBody:
      "Questo modo di lavorare non è un metodo comprovato e ripetibile. Yorisou è agli inizi e non ha ancora portato fuori alcun progetto come società indipendente. Quanto scritto qui è il procedimento che seguiamo davvero, non un’affermazione sui risultati.",
  },

  /* ── BUILD WITH US (CORP-v1.2) ────────────────────────────────── */
  buildWithUs: {
    eyebrow: "Costruire insieme",
    heading: ["Il punto d’ingresso cambia", "a seconda di dove ti trovi."],
    lead:
      "Yorisou porta un progetto fino al punto immediatamente precedente alla nascita di una società, e solo allora fa squadra con chi può portarselo sulle spalle. Per questo non cerchiamo persone da assumere, ma persone che se ne facciano carico.",
    lanes: [
      {
        key: "founders",
        label: "Fondatori",
        title: "Fondatori e cofondatori",
        body:
          "Prendere come cosa propria un progetto già portato fino al punto immediatamente precedente alla nascita di una società. Si entra come fondatori, non come dipendenti: le decisioni stanno dalla tua parte, e con esse la responsabilità.",
        invites: [
          "Hai già fatto funzionare davvero un’attività con un’operatività reale alle spalle",
          "Sai andare avanti quando molte cose sono ancora indecise",
          "Conosci da vicino almeno uno tra tecnologia, produzione, pubblica amministrazione e lavoro sul territorio",
        ],
        offers: "Ricerca e prove, un primo prodotto, la progettazione dell’impresa e l’infrastruttura condivisa. Non si parte da zero, ma da un punto già avanzato.",
        cannot: "Al momento non possiamo promettere né uno stipendio, né una raccolta di capitali, né condizioni di partecipazione. Le condizioni si discutono progetto per progetto.",
        ventures: ["Mirai Move", "Kakari", "Chigamo"],
        state: "Siamo alla fase in cui vogliamo ascoltare. Non c’è alcuna posizione aperta.",
        cta: "Segnala il tuo interesse",
      },
      {
        key: "team",
        label: "Team fondatore",
        title: "Team fondatore e figure specialistiche",
        body:
          "Un fondatore da solo non basta mai. Cerchiamo persone che, fin dall’inizio, si prendano una parte: la tecnologia, l’operatività o il lavoro sul campo.",
        invites: [
          "Non ti sei fermato alla realizzazione: hai seguito le cose fino all’esercizio quotidiano",
          "Hai già avviato qualcosa con un gruppo di poche persone",
          "Sai che cosa è ovvio nel tuo ambito",
        ],
        offers: "Un posto fin dall’inizio e un margine di decisione reale sulla parte che tieni in mano.",
        cannot: "Non esiste un canale di assunzione permanente. Non possiamo dire di essere in condizione di assumere adesso.",
        ventures: ["Mirai Move", "Kakari"],
        state: "Dipende dalla fase del progetto. Raccontaci prima che cosa potresti prenderti.",
        cta: "Apri una conversazione",
      },
      {
        key: "users",
        label: "Primi utilizzatori",
        title: "Primi utilizzatori e chi prova insieme a noi",
        body:
          "Vorremmo che qualcuno guardasse ciò che abbiamo costruito dalla posizione di chi lo usa davvero. Non per sentirci dire che va bene, ma per farci dire dove si blocca.",
        invites: [
          "Ti sei trovato davvero in difficoltà con questo problema",
          "Sai dire senza giri di parole che cosa non ha funzionato",
          "Non ti pesa guardare qualcosa prima che sia pubblico",
        ],
        offers: "Uno sguardo su qualcosa ancora in costruzione, e ciò che dici rientra nella progettazione.",
        cannot: "Non possiamo promettere una data di rilascio, né che la tua richiesta venga accolta, né un compenso.",
        ventures: ["Kakari", "Mirai Move"],
        state: "Cerchiamo persone a cui mostrarlo. Non è un programma formale.",
        cta: "Segnala il tuo interesse",
      },
      {
        key: "research",
        label: "Università e ricerca",
        title: "Università e ricerca",
        body:
          "Trasformare i risultati della ricerca in qualcosa che la società possa usare richiede anche una progettazione dal lato dell’impresa. Cerchiamo interlocutori con cui ragionare sulla formazione di chi fonda e sull’implementazione della ricerca.",
        invites: [
          "Cerchi un luogo in cui i risultati della ricerca possano essere applicati",
          "Vuoi che studenti e ricercatori facciano un’esperienza concreta di creazione d’impresa",
          "Preferisci partire da un’esplorazione condivisa",
        ],
        offers: "La progettazione dal lato dell’impresa e un lavoro che è davvero in corso. Si può partire da un’esplorazione.",
        cannot: "Non esiste ancora alcun accordo di ricerca, alcun finanziamento né alcuna collaborazione formale.",
        ventures: ["Mirai Move", "Chigamo"],
        state: "Non abbiamo alcuna collaborazione alle spalle. Si comincia da una conversazione.",
        cta: "Apri una conversazione",
      },
      {
        key: "public",
        label: "Enti pubblici",
        title: "Amministrazioni ed enti pubblici",
        body:
          "Nel settore pubblico le regole spesso ci sono, ma non sono mai state tradotte nei passaggi che un cittadino deve compiere. Vorremmo progettare insieme la prova in piccolo, la misurazione degli effetti e il passaggio a una forma che duri.",
        invites: [
          "Hai un problema che si può provare sul campo",
          "Vuoi dargli una forma in cui l’effetto sia misurabile",
          "Non vuoi che si esaurisca in una sperimentazione isolata",
        ],
        offers: "Ricerca, prove ordinate in una forma utilizzabile e la progettazione di una prova in piccolo.",
        cannot: "Non abbiamo ancora alcun lavoro svolto con un ente locale, e non possiamo offrire alcuna garanzia sul piano normativo.",
        ventures: ["Mirai Move", "Kakari"],
        state: "Si comincia da una conversazione. Non c’è nulla in corso.",
        cta: "Parliamone",
      },
      {
        key: "corporate",
        label: "Imprese",
        title: "Imprese",
        body:
          "Se dentro la tua organizzazione c’è un problema operativo che meriterebbe di diventare un’attività a sé. Si può partire da uno sviluppo congiunto o da una verifica sul campo.",
        invites: [
          "C’è un problema operativo irrisolto nel lavoro di ogni giorno",
          "Stai cercando la forma di una nuova attività",
          "Stai cercando un partner di sviluppo",
        ],
        offers: "Si può partire dal ridisegnare il problema come attività a sé.",
        cannot: "Non abbiamo alcun rapporto commerciale alle spalle, né alcun caso di adozione da mostrare.",
        ventures: ["Mirai Move", "Kakari", "Chigamo"],
        state: "Si comincia ascoltando.",
        cta: "Scrivici",
      },
    ],
    intakeTitle: "Come riceviamo i contatti",
    intakeBody:
      "Al momento non esiste alcuna procedura di candidatura né alcun programma di selezione. Quello che trovi qui è un invito, non una collaborazione già in corso né una posizione aperta. Cominciamo ascoltando di che si tratta e vedendo se c’è qualcosa di cui parlare.",
    foundingTeamEyebrow: "Team fondatore",
    foundingTeamHeading: ["Cominciamo a costruire", "prima che ci sia una società."],
    foundingTeamBody: [
      "Di solito un’attività comincia quando le persone si sono riunite. Yorisou procede nell’ordine inverso: prima la ricerca e le prove, un primo prodotto e la progettazione come impresa; poi cerchiamo chi se ne farà carico.",
      "Così nessuno parte da un foglio bianco. Si comincia raccogliendo qualcosa che ha già una forma e facendolo proprio.",
      "In cambio, che cosa significhi farsene carico non cambia. Chi ha il potere decisionale ha anche la responsabilità. Se chi gestisce un progetto non ha un potere decisionale reale, quel progetto non è diventato una società.",
    ],
    ctaHeading: ["Da qualunque parte tu arrivi,", "l’ingresso è lo stesso."],
    ctaBody: "Scrivi di che si tratta e mandacelo. Leggiamo tutto, in ordine di arrivo.",
  },
};
