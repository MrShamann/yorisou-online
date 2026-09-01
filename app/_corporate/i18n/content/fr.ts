import type { SiteCopy } from "../types";

/**
 * CORP-P5R2 — FRANÇAIS. Traduit depuis la source canonique japonaise.
 *
 * Ce fichier est un pendant adapté, non une traduction littérale : il est écrit pour se lire comme
 * du français d'entreprise naturel. Il ne peut jamais être plus affirmatif que le japonais. Aucune
 * mention de client, de partenaire, de chiffre, de revenu, de financement, de position de marché,
 * de taille d'équipe ou de capacité n'y figure si le japonais ne la fait pas déjà.
 *
 * Sur le représentant : « Harvard Business School Executive Education » est énoncé précisément. Il
 * ne s'agit PAS d'un diplôme de Harvard University ni d'un MBA de la HBS, et cette formulation ne
 * doit jamais être raccourcie d'une manière qui laisserait entendre l'un ou l'autre. Aucune
 * approbation de IESE, Harvard, Ficosa ou d'un organisme public n'est sous-entendue.
 *
 * Yorisou est une société japonaise à responsabilité limitée (LLC / GK) : la forme est rendue par
 * « LLC » et le dirigeant par « représentant ». Aucun titre de société par actions n'est employé.
 */
export const fr: SiteCopy = {
  chrome: {
    skip: "Aller au contenu principal",
    menu: "Menu",
    menuToggle: "Ouvrir et fermer le menu",
    close: "Fermer",
    navLabel: "Navigation du site",
    navLabelMobile: "Navigation du site (mobile)",
    langLabel: "Langue d’affichage",
    langHeading: "Choisir une langue",
    langSearch: "Rechercher une langue",
    langCurrent: "Langue actuelle",
    previewBadge: "Aperçu — non publié",
    nav: { home: "Accueil", miraiMove: "Mirai Move", kakari: "Kakari", about: "À propos", company: "Entreprise", contact: "Contact" },
    footerTagline: "Les personnes et la technique construisent l’avenir.",
    footerProjects: "Projets",
    footerCompany: "Entreprise",
    footerLegalNote: "Les faits présentés ici reposent sur des éléments que nous avons pu vérifier.",
    backToTop: "Haut de page",
  },

  meta: {
    home: { title: "Yorisou LLC — Faire d’un problème structurel une activité.", description: "Yorisou LLC est une fonderie d’entreprises : nous cherchons des problèmes structurels, réunissons les preuves et les actifs nécessaires, et nous nous associons à ceux qui les conduiront pour les lancer comme activités. Mirai Move et Kakari sont en construction ; Chigamo en est au stade du concept." },
    miraiMove: { title: "Mirai Move — Yorisou LLC", description: "Une plateforme d’information, de mise en relation et de développement d’activités dans le secteur de la mobilité au Japon. Le site public est en ligne ; les fonctionnalités de la plateforme sont en cours de développement." },
    kakari: { title: "Kakari — Yorisou LLC", description: "Un accompagnement multilingue pour les démarches administratives et les documents, destiné aux personnes qui vivent au Japon et à celles qui y créent une activité. En cours de développement, pas encore accessible au public." },
    about: { title: "Notre façon de construire — Yorisou LLC", description: "Trouver le problème, le vérifier, le concevoir comme une activité, constituer une équipe fondatrice et la mettre debout. Le fonctionnement de la fonderie Yorisou, les formes que peut prendre une activité, et la place qu’y occupe le socle commun." },
    company: { title: "Entreprise — Yorisou LLC", description: "Présentation de Yorisou LLC, profil du représentant, message du représentant et domaines d’activité." },
    contact: { title: "Contact — Yorisou LLC", description: "Point de contact pour les demandes liées à nos activités, aux partenariats et à la presse." },
    ventures: { title: "Projets — Yorisou LLC", description: "Ce que Yorisou construit aujourd’hui : Mirai Move, Kakari et Chigamo. Chacun en est à une étape différente, et nous l’indiquons telle quelle." },
    buildWithUs: { title: "Construire avec nous — Yorisou LLC", description: "Les portes d’entrée pour les fondateurs, les chercheurs, les acteurs publics et les entreprises. Il n’existe pas d’appel à candidatures : nous commençons par une conversation." },
    chigamo: { title: "Chigamo — Yorisou LLC", description: "Une idée : rendre visible, à partir du lieu et du contexte, ce qui est réellement utile là où l’on se trouve. Au stade du concept ; aucun produit n’est accessible au public." },
  },

  common: {
    buildingLabel: "en construction",
    conceptLabel: "au stade du concept",
    readMore: (name) => `En savoir plus sur ${name}`,
    backHome: "Retour à la présentation de l’entreprise",
    stageLabel: "Étape actuelle",
    boundaryLabel: "Ce que nous ne prenons pas en charge",
    nowLabel: "Aujourd’hui",
    nextLabel: "Prochaine étape",
    whoLabel: "Qui nous aimerions entendre",
  },

  home: {
    eyebrow: "Yorisou LLC",
    hook: ["Faire d’un problème structurel", "une entreprise."],
    thesis: ["D’un problème structurel,", "nous bâtissons une activité,", "puis nous la faisons grandir."],
    lead: [
      "Yorisou est une fonderie d’entreprises : nous cherchons les problèmes structurels de la société, nous les vérifions, nous les concevons comme des activités,",
      "puis nous nous associons à ceux qui les conduiront, pour les lancer comme activités.",
    ],
    humanSide: "Personnes",
    humanItems: ["Vie quotidienne", "Travail", "Territoire"],
    systemSide: "Systèmes",
    systemItems: ["Mobilité", "Démarches administratives"],
    fieldCaption: "Personnes — vie quotidienne, travail, territoire  /  Systèmes — mobilité, démarches administratives",
    fieldRelation: "Relations",

    whyEyebrow: "Les problèmes que nous traitons",
    whyHeading: ["La complexité ne se résout pas", "par le seul effort individuel."],
    whyBeats: [
      { no: "01", title: "« Je ne sais pas » arrête dès la porte.", body: "Un dispositif qui existe mais que l’on ne parvient pas à atteindre équivaut à un dispositif qui n’existe pas." },
      { no: "02", title: "Le chemin jusqu’au professionnel est long.", body: "Avant le point où le jugement humain est réellement nécessaire, il reste une distance qu’un système pourrait prendre en charge." },
      { no: "03", title: "Le terrain et les systèmes ne s’articulent pas.", body: "Dans la mobilité, l’action sociale et l’administration, il existe des options qui n’ont pas encore atteint les personnes sur le terrain." },
    ],

    buildEyebrow: "Ce que nous construisons",
    buildHeading: ["Des domaines que le système n’atteint pas —", "abordés un par un."],

    howEyebrow: "Notre façon de construire",
    howHeading: ["Prendre en charge la complexité", "et la rendre utilisable."],
    howBeats: [
      { no: "01", title: "Partir des mots du terrain", body: "Nous ne partons pas de la technologie. Nous concevons à rebours, à partir des démarches réelles d’une personne bloquée." },
      { no: "02", title: "Assumer jusqu’à la compréhension", body: "Afficher l’information ne suffit pas. Savoir quoi faire ensuite fait partie du périmètre de la conception." },
      { no: "03", title: "Énoncer les limites", body: "Nous n’empiétons pas sur ce qui relève d’un professionnel agréé. Ce que nous prenons en charge, et le moment où nous passons le relais, est inscrit dans le produit lui-même." },
      { no: "04", title: "Ne dire que ce qui peut être vérifié", body: "Résultats, chiffres et partenariats ne figurent ici que lorsqu’il existe des preuves. Ce qui ne peut pas être confirmé n’est pas écrit." },
    ],
    howDisclose: "Ce que ces principes signifient concrètement",

    founderEyebrow: "Le représentant",
    founderHeading: ["Construit par quelqu’un qui observe", "des secteurs complexes depuis vingt ans."],
    founderTeaser: "Plus de vingt ans dans l’automobile, la mobilité, l’industrie et les affaires internationales, à la jonction de la technologie, de la mise en œuvre et de la réalité commerciale. Le même constat revenait sans cesse : un dispositif bien conçu s’arrêtait avant d’atteindre la personne qui en avait besoin.",
    founderRole: "Représentant, Yorisou LLC",
    founderCta: "À propos du représentant",

    messageEyebrow: "Message du représentant",
    messageHeading: ["Ce qui compte n’est pas la technologie,", "mais le fait que cela arrive à destination."],
    messageTeaser: "Ce que nous traitons n’est pas la nouveauté. Les dispositifs et les options existent déjà, mais ils s’arrêtent avant d’atteindre ceux qui en ont besoin. Nous construisons une entreprise qui réduit cette distance, étape par étape.",
    messageCta: "Lire le message intégral",

    originEyebrow: "Notre implantation",
    originHeading: ["Commencer depuis Fukuoka."],
    originBody: "Yorisou LLC construit son activité depuis Fukuoka, au Japon — un lieu où la vie quotidienne, le travail et le territoire se tiennent à faible distance les uns des autres, et où la conception peut partir des démarches que les gens accomplissent réellement.",

    proofEyebrow: "Entreprise",
    proofHeading: ["Ce que nous pouvons affirmer,", "et rien de plus."],

    ctaEyebrow: "Contact",
    ctaHeading: ["Il y a peut-être matière", "à travailler ensemble."],
    ctaBody: "Nous recevons les demandes concernant nos activités, les projets de partenariat et la presse. Nous répondons au fur et à mesure, selon la demande.",
    ctaButton: "Nous contacter",

    /* CORP-v1.2 — Le socle commun et la porte d’entrée, sur la page d’accueil. */
    asterionEyebrow: "Socle commun",
    asterionHeading: ["À chaque projet,", "le socle s’épaissit."],
    asterionBody:
      "Asterion OS est un projet de plateforme technique indépendant. Parce qu’un socle commun existe déjà, aucun projet n’a à reconstruire les mêmes mécanismes : chacun peut consacrer son énergie à ce qui lui est propre.",
    asterionNote:
      "Chaque projet est gouverné séparément. La propriété intellectuelle, les données et la responsabilité d’exploitation — ainsi que les droits relatifs à Asterion — dépendent des accords applicables à chaque cas.",
    /* CORP-v1.4 — le lien que Yorisou garde avec ce qu’elle construit. Conditionnel, jamais promis. */
    portfolioEyebrow: "Notre lien avec les projets",
    portfolioHeading: ["Construire n’est pas", "le point final."],
    portfolioBody:
      "Une fois un projet lancé, Yorisou peut rester associée à sa valeur dans la durée : en conservant une participation, sous la forme d’une licence, ou en l’exploitant conjointement. Un projet peut aussi être constitué en société distincte, cédé ou vendu.",
    portfolioNote:
      "La forme retenue dépend de la maturité du projet, des personnes avec qui il se fait, du marché, du capital et de l’accord conclu pour ce projet. Rien n’est fixé à l’avance.",
    engageEyebrow: "Construire avec nous",
    engageHeading: ["Entrer maintenant,", "pendant que l’entreprise se forme."],
    engageBody:
      "Fondateurs, chercheurs, acteurs publics, entreprises. Le point d’entrée dépend de la place que vous occupez. Nous commençons par ce dont il est possible de parler aujourd’hui.",
    engageCta: "Voir les portes d’entrée",
    engageNote: "Toutes commencent aujourd’hui par une conversation. Il n’existe encore ni procédure de candidature ni processus de sélection.",
    explainerLabel: "Yorisou en 30 secondes",
    explainerHeading: ["D’un problème à une entreprise,", "en trente secondes."],
    explainerClose: "Fermer",
    explainerPlay: "Lecture",
    explainerPause: "Pause",
    explainerRestart: "Recommencer",
    explainerStepLabel: "Étape",
  },

  mirai: {
    reading: "Faire avancer la mobilité des territoires jusqu’à une solution.",
    now: "Le site public est en ligne, et le dispositif qui lit en continu les informations publiques tourne de lui-même. Mais rien n’est encore parti vers l’extérieur — pas une seule fois.",
    next: "Sur le premier cas concret, il reste des points qui ne peuvent pas se trancher depuis le bureau. À partir d’ici, c’est à une personne d’agir.",
    who: "Des personnes qui connaissent de l’intérieur la mobilité des territoires — collectivités, opérateurs, terrain — et qui savent décrire les contraintes réelles.",
    join: {
      title: "Participer à ce projet",
      body: "Ce dont nous avons besoin aujourd’hui, ce sont des interlocuteurs capables de décrire concrètement les contraintes du terrain. Nous en sommes à l’étape où l’on vérifie, pas à celle où l’on vend.",
      roles: [
        "Vous travaillez dans les transports ou la mobilité d’un territoire — collectivité, opérateur, ou le terrain lui-même",
        "Vous pourriez porter ce domaine comme fondateur ou comme opérateur",
        "Vous savez comment l’exploitation fonctionne réellement",
      ],
      state: "Nous en sommes à l’étape où nous voulons écouter. Il n’y a aucun poste ouvert.",
    },
    eyebrow: "Projet 01",
    heading: ["Une plateforme d’information,", "de mise en relation et de développement d’activités", "dans le secteur de la mobilité au Japon."],
    stage: "Site public en ligne / fonctionnalités de la plateforme en cours de développement",
    lead: "Mirai Move a pour objectif de relier l’administration et les collectivités, les entreprises, les acteurs de terrain du territoire, du soin et de l’action sociale, les fournisseurs étrangers et les partenaires japonais, afin que l’information et les opportunités liées à la mobilité soient traitées comme un flux unique. Le site d’information public est en ligne aujourd’hui ; les fonctionnalités de la plateforme sont en cours de développement.",
    domain: "Le secteur de la mobilité au Japon",
    networkEyebrow: "Les acteurs que nous relions",
    networkHeading: ["Des acteurs aux positions différentes", "regardent la même opportunité", "avec des mots différents."],
    centre: "Opportunité de mobilité",
    parties: [
      { no: "01", title: "Administration et collectivités", body: "Du côté des dispositifs et des budgets" },
      { no: "02", title: "Entreprises", body: "Du côté de l’offre et de la mise en œuvre" },
      { no: "03", title: "Terrain du territoire, du soin et de l’action sociale", body: "Là où la mobilité se produit réellement" },
      { no: "04", title: "Fournisseurs étrangers et partenaires japonais", body: "Du côté de ceux qui apportent des options" },
    ],
    boundaryTitle: "À propos de l’état de développement",
    boundaryBody: "La plateforme elle-même est en cours de développement. L’exécution autonome par des agents n’est pas activée. Toute action ayant un effet hors du système est conçue pour exiger une confirmation humaine. Elle n’est pas proposée comme une plateforme complète et achevée.",
    detail: [
      { heading: "Le problème traité", body: "Les options de mobilité existent séparément selon les territoires, les dispositifs et les opérateurs. La personne qui en a besoin et l’option qui existe déjà ne se rencontrent pas au même endroit." },
      { heading: "Les acteurs concernés", body: "Administration et collectivités, entreprises, acteurs de terrain du territoire, du soin et de l’action sociale, fournisseurs étrangers et partenaires japonais. Des acteurs aux positions et aux critères différents regardent la même opportunité avec des mots différents." },
      { heading: "Ce qui fonctionne aujourd’hui", body: "Le site d’information public est en ligne. Les fonctions d’information, de mise en relation et de développement d’activités de la plateforme en sont au stade de la construction des fondations et de l’architecture." },
    ],
    siteLabel: "Site public",
    siteUrl: "https://www.miraimove.com",
  },

  kakari: {
    reading: "Permettre à chacun de mener lui-même ses démarches au Japon.",
    now: "Une phase de test non publique. Le service n’est pas accessible au public et personne ne l’utilise encore.",
    next: "Les démarches nécessaires à la distribution, et la fixation des informations d’immatriculation de la société. L’un comme l’autre demandent une confirmation extérieure.",
    who: "Les personnes de nationalité étrangère qui vivent au Japon, celles qui les accompagnent, et les professionnels agréés.",
    join: {
      title: "Participer à ce projet",
      body: "Nous voulons d’abord le montrer à des personnes qui savent ce que ces démarches sont réellement. Ce n’est pas un outil destiné à remplacer un professionnel.",
      roles: [
        "Vous avez réellement buté sur une démarche au Japon",
        "Vous accompagnez, à un titre ou à un autre, des résidents étrangers",
        "Vous êtes un professionnel agréé et pouvez nous aider à vérifier où placer la limite",
        "Vous pourriez porter ce projet comme fondateur ou comme opérateur",
      ],
      state: "Nous cherchons des personnes à qui le montrer. Rien n’est public et rien n’est ouvert.",
    },
    eyebrow: "Projet 02",
    heading: ["Un accompagnement multilingue pour les démarches", "et les documents, destiné aux personnes qui vivent au Japon", "et à celles qui y créent une activité."],
    stage: "En cours de développement (pas encore accessible au public)",
    lead: "Lorsque la langue et les connaissances préalables font barrière, on ne parvient pas à atteindre les dispositifs auxquels on a pourtant droit. Kakari aide à identifier les informations utiles, à préparer les documents, à remplir les formulaires et à suivre la procédure de dépôt — dans la langue de la personne. Le projet est en cours de développement et n’est pas encore accessible au public.",
    domain: "Démarches administratives et documents / multilingue",
    procedureEyebrow: "La démarche accompagnée",
    procedureHeading: ["De la recherche d’information,", "jusqu’au dépôt du dossier."],
    steps: [
      { no: "01", title: "Se renseigner", body: "Identifier les dispositifs qui vous concernent" },
      { no: "02", title: "Réunir les documents", body: "Déterminer les documents et les pièces à joindre" },
      { no: "03", title: "Préparer", body: "Remplir les formulaires dans votre langue et en vérifier le contenu" },
      { no: "04", title: "Déposer", body: "Être guidé sur le lieu, le mode de dépôt et la procédure d’envoi postal" },
    ],
    boundaryTitle: "Ce qui relève d’un professionnel agréé",
    boundaryBody: "Nous n’agissons pas en tant que professionnel agréé pour votre compte. Les domaines qui exigent une appréciation juridique, fiscale ou administrative officielle sont indiqués comme relevant d’un professionnel. Les appréciations et les représentations qui requièrent une qualification — avocat, conseiller fiscal agréé ou rédacteur administratif agréé — ne font pas partie des fonctions de Kakari.",
    detail: [
      { heading: "Le problème traité", body: "La manière d’accomplir une démarche est une information publique. Pourtant, faute de maîtrise de la langue et des connaissances supposées acquises, certaines personnes n’atteignent pas le dispositif. Ce n’est pas une question de capacité personnelle." },
      { heading: "Les personnes concernées", body: "Les personnes qui vivent au Japon et celles qui s’apprêtent à y créer une activité — celles pour qui accomplir seules une démarche en japonais est difficile." },
      { heading: "Ce qui fonctionne aujourd’hui", body: "La brique d’authentification a été construite dans un environnement de vérification isolé, où les droits d’accès et le stockage sont en cours de validation. Les intégrations externes restent désactivées et le service n’est pas accessible au public." },
    ],
  },

  about: {
    eyebrow: "À propos",
    heading: ["Notre façon de construire", "est notre engagement."],
    lead: "Yorisou observe la complexité présente dans la vie quotidienne, le travail et les territoires, et conçoit des produits qui aident chacun à comprendre, à choisir et à avancer.",
    whyHeading: ["Pourquoi cette entreprise existe."],
    whyBody: [
      "Les dispositifs, les technologies et les options existent déjà en grand nombre. Ils s’arrêtent pourtant avant d’atteindre la personne qui en a besoin. C’est cette dernière distance que nous traitons.",
      "On décrit souvent cette distance comme une affaire d’effort individuel ou de volume d’information. En pratique, une complexité que le système aurait pu absorber est simplement remise à la personne.",
    ],
    thinkHeading: ["Notre façon de réfléchir."],
    thinkBody: [
      "Nous ne partons pas de la technologie. Nous commençons par débloquer le geste qui reste bloqué : lire la situation de la personne, l’organiser comme un ensemble de relations, et la conduire jusqu’au point où l’étape suivante devient claire. C’est là le périmètre de la conception.",
      "L’IA sert à cette compréhension et à cette mise en structure — non à décider à la place de la personne. Son rôle est de mettre sous une forme utilisable les éléments nécessaires à la décision. Le jugement et la responsabilité restent du côté de la personne.",
    ],
    buildHeading: ["Notre façon de construire."],
    principles: [
      { no: "01", title: "Partir des mots du terrain", body: "Nous ne partons pas de la technologie. Nous concevons à rebours, à partir des démarches réelles d’une personne bloquée." },
      { no: "02", title: "Assumer jusqu’à la compréhension", body: "Afficher l’information ne suffit pas. Savoir quoi faire ensuite fait partie du périmètre de la conception." },
      { no: "03", title: "Énoncer les limites", body: "Nous n’empiétons pas sur ce qui relève d’un professionnel agréé. Ce que nous prenons en charge, et le moment où nous passons le relais, est inscrit dans le produit lui-même." },
      { no: "04", title: "Ne dire que ce qui peut être vérifié", body: "Résultats, chiffres et partenariats ne figurent ici que lorsqu’il existe des preuves. Ce qui ne peut pas être confirmé n’est pas écrit." },
    ],
    principlesLong: [
      { no: "01", title: "Partir des mots du terrain", long: "Aucun dispositif n’atteint qui que ce soit tant qu’il n’a pas été traduit dans les démarches que la personne accomplit réellement. Nous partons de la demande réelle, du déplacement réel, de l’échange réel — non d’un énoncé abstrait du problème, mais du seul geste qui reste aujourd’hui bloqué." },
      { no: "02", title: "Assumer jusqu’à la compréhension", long: "Aligner des résultats de recherche n’est pas un accompagnement. Ce dont une personne a besoin, c’est de savoir quoi faire ensuite. Le périmètre du produit va jusqu’au point où l’étape suivante est comprise, et non jusqu’au point où l’information a été affichée." },
      { no: "03", title: "Énoncer les limites", long: "Laisser quelqu’un utiliser un produit sans dire clairement ce qu’il ne peut pas faire est la conception la plus dangereuse qui soit. Ce que nous prenons en charge, et le moment où un professionnel prend le relais, est inscrit sur l’écran lui-même. La limite est une fonctionnalité, non une mention d’avertissement." },
      { no: "04", title: "Ne dire que ce qui peut être vérifié", long: "Nous ne parlons pas de résultats que nous ne pouvons pas confirmer, ni de fonctionnalités qui ne sont pas encore en service. Chaque fait que nous publions repose sur un élément qui l’atteste. Lorsqu’il y a peu à dire, nous publions peu." },
    ],
    orderHeading: ["Un domaine à la fois,", "jusqu’au bout."],
    orderBody: "Nous ne lançons pas beaucoup de choses en même temps. Nous préférons mener un domaine jusqu’au point où il rejoint les démarches que les gens accomplissent réellement.",
    claimsHeading: ["Nous n’écrivons pas", "ce que nous ne pouvons pas vérifier."],
    claimsBody: "Chaque fait que nous publions repose sur un élément qui l’atteste. Lorsqu’il y a peu à dire, nous publions peu.",
  },

  company: {
    eyebrow: "Entreprise",
    heading: ["Yorisou LLC"],
    intro: "Yorisou LLC est une fonderie d’entreprises : nous cherchons des problèmes structurels, nous les concevons comme des activités et nous les lançons avec des personnes capables de les conduire. Basée à Fukuoka, l’entreprise construit plusieurs projets ; ceux qui sont publics aujourd’hui sont Mirai Move, Kakari et Chigamo.",

    messageEyebrow: "Message du représentant",
    messageHeading: ["Ce qui compte n’est pas la technologie,", "mais le fait que cela arrive à destination."],
    message: [
      "Ce que nous traitons n’est pas la nouveauté.",
      "Pendant plus de vingt ans, dans l’automobile, la mobilité et l’industrie, je me suis tenu entre la technologie, la mise en œuvre et la réalité commerciale. Le même constat revenait sans cesse : un dispositif bien conçu s’arrêtait avant d’atteindre la personne qui en avait besoin. Non par manque de technologie, mais parce qu’il n’avait jamais été traduit dans les démarches que cette personne accomplit réellement.",
      "Les dispositifs et les options existent déjà en grand nombre. Mais si l’on ne sait pas si cela nous concerne, ni quoi faire ensuite, c’est comme s’ils n’existaient pas. Réduire cette dernière distance — la faire porter par le système plutôt que par la personne — voilà la raison pour laquelle Yorisou a été créée.",
      "Nous n’utilisons pas l’IA pour décider à la place des gens. Nous l’utilisons pour lire la situation, l’organiser comme un ensemble de relations et la mettre sous une forme utilisable, afin que la personne puisse décider. Le jugement et la responsabilité restent du côté de la personne. Ce que nous prenons en charge, et le moment où nous passons le relais à un professionnel, est inscrit sur l’écran lui-même.",
      "Nous sommes encore une petite entreprise, et il y a peu de choses que nous puissions écrire. C’est précisément pourquoi nous n’écrivons que ce que nous pouvons vérifier. Ce qui doit croître, ce ne sont pas les affirmations, mais ce qui est réellement arrivé à destination.",
    ],
    messageSignature: "Jin Yang",
    messageRole: "Représentant, Yorisou LLC",

    profileEyebrow: "Le représentant",
    profileHeading: ["À propos du représentant"],
    profileName: "Jin Yang",
    profileNameLatin: "Jin Yang / Edward Jin",
    profileRole: "Représentant, Yorisou LLC",
    profileBody: [
      "Plus de vingt ans d’expérience professionnelle dans l’automobile, la mobilité, l’industrie, le développement de projets industriels, la chaîne d’approvisionnement, le développement commercial, le développement produit et les affaires internationales transfrontalières.",
    ],
    profileBackgroundLabel: "Parcours",
    profileBackground: [
      "A exercé des responsabilités commerciales et industrielles de haut niveau chez Ficosa, équipementier automobile international, en lien avec des projets industriels mondiaux et des activités commerciales en Asie.",
      "A ensuite fondé et dirigé des activités de technologie et de fabrication en Chine, touchant à l’électronique automobile, aux systèmes de contrôle, à la fabrication de précision et au développement de produits et de systèmes faisant appel à l’IA.",
      "A travaillé sur plusieurs marchés, dont l’Europe, la Chine et le Japon.",
      "Est aujourd’hui représentant de Yorisou LLC au Japon et construit l’entreprise depuis Fukuoka.",
    ],
    profileEducationLabel: "Formation",
    profileEducation: [
      "MBA, IESE Business School",
      "General Management Program, Harvard Business School Executive Education",
    ],
    profileRelevanceLabel: "En quoi ce parcours compte ici",
    profileRelevance: [
      "Une longue pratique au sein d’industries réelles et complexes.",
      "Une position à la jonction de la technologie, de la fabrication, de l’exécution commerciale et des marchés internationaux.",
      "Une exposition directe à l’écart entre ce qu’un système permet et ce qu’une personne ou une organisation peut réellement utiliser.",
      "Et, de là, la raison de concevoir des produits qui rendent la complexité compréhensible et praticable.",
    ],

    overviewEyebrow: "Présentation de l’entreprise",
    overviewHeading: ["Présentation de l’entreprise"],
    facts: [
      { label: "Dénomination", value: "Yorisou LLC (Yorisou GK)" },
      { label: "Numéro d’entreprise (hōjin bangō)", value: "2290003018125" },
      { label: "Représentant", value: "Jin Yang" },
      { label: "Siège", value: "Ville de Fukuoka, préfecture de Fukuoka, Japon" },
      { label: "Activité", value: "Exploration, conception, développement et exploitation de nouvelles activités ; constitution d’équipes fondatrices ; et mise en œuvre par exploitation conjointe, licence ou dispositifs équivalents" },
    ],

    businessEyebrow: "Domaines d’activité",
    businessHeading: ["Domaines d’activité"],
    businessBody: "Ce qui est au centre de Yorisou, c’est la construction des projets eux-mêmes : trouver un problème structurel, le vérifier, le concevoir comme une activité, le construire, et le lancer avec des personnes capables de le conduire. Les projets publics aujourd’hui sont l’information, la mise en relation et le développement d’activités dans le secteur de la mobilité (Mirai Move) ; l’accompagnement multilingue pour les démarches administratives, destiné aux personnes qui vivent au Japon et à celles qui y créent une activité (Kakari) ; et la découverte d’un bassin de vie à partir du lieu et du contexte (Chigamo, au stade du concept). Tous suivent le même principe : prendre en charge la complexité et restituer quelque chose d’utilisable.",

    projectsEyebrow: "Projets",
    projectsHeading: ["Ce que nous construisons"],

    originEyebrow: "Notre implantation",
    originHeading: ["Commencer depuis Fukuoka."],
    originBody: [
      "Yorisou LLC construit son activité depuis la ville de Fukuoka, au Japon.",
      "C’est un lieu où la vie quotidienne, le travail et le territoire se tiennent à faible distance les uns des autres — et où la conception peut partir des démarches que les gens accomplissent réellement.",
    ],

    ctaHeading: ["Contact"],
    ctaBody: "Nous recevons les demandes concernant nos activités, les projets de partenariat et la presse.",
  },

  contact: {
    eyebrow: "Contact",
    heading: ["Contact"],
    lead: "Nous recevons les demandes concernant nos activités, les projets de partenariat et la presse. Nous répondons au fur et à mesure, selon la demande.",
    channelsHeading: ["Ce que vous pouvez nous demander"],
    channels: [
      { title: "Questions générales", body: "Questions sur Yorisou en tant qu’entreprise et sur les projets que nous construisons." },
      { title: "Activités et partenariats", body: "Discussions de collaboration ou d’ordre commercial dans la mobilité ou les démarches administratives." },
      { title: "Presse et médias", body: "Demandes d’interview et questions sur l’entreprise ou son représentant." },
    ],
    formHeading: ["Nous écrire"],
    formIntro: "Utilisez le formulaire ci-dessous. Chaque demande est lue et reçoit une réponse au fur et à mesure.",
    unavailableBody: "Le chemin de distribution n’a pas encore été vérifié : un message envoyé d’ici ne pourrait pas être garanti. Le formulaire s’ouvrira sur cette page dès que ce sera confirmé.",
    fields: {
      name: "Nom", namePlaceholder: "Votre nom",
      email: "E-mail", emailPlaceholder: "vous@exemple.com",
      org: "Entreprise ou organisation", orgPlaceholder: "Facultatif",
      type: "Type de demande",
      message: "Message", messagePlaceholder: "Indiquez le contexte et ce que vous souhaitez vérifier.",
    },
    types: [
      { value: "general", label: "Question générale" },
      { value: "business", label: "Activités et partenariats" },
      { value: "media", label: "Presse et médias" },
    ],
    submit: "Envoyer",
    sending: "Envoi en cours…",
    successTitle: "Message envoyé",
    successBody: "Nous avons bien reçu votre demande. Nous l’examinerons et vous répondrons au fur et à mesure.",
    errorTitle: "Envoi impossible",
    errorBody: "Merci de patienter un instant et de réessayer.",
    required: "Obligatoire",
    privacyNote: "Les informations personnelles que vous transmettez sont utilisées uniquement pour répondre à votre demande.",
  },

  /* ── VENTURES INDEX (CORP-v1.2) ───────────────────────────────── */
  ventures: {
    eyebrow: "Projets",
    publicLabel: "Projets actuellement publics",
    publicNote: "Yorisou construit plusieurs projets. Voici ceux qui sont publics pour l’instant.",
    heading: ["Aucun d’eux ne tient encore", "debout comme entreprise."],
    lead:
      "Dans chacun d’eux, les dispositifs et les systèmes existent déjà — et s’arrêtent juste avant les personnes qui en ont besoin. Yorisou travaille dans cet écart, et vérifie à mesure qu’il avance.",
    cards: [
      {
        name: "Mirai Move",
        href: "/mirai-move",
        thesis: "Relier l’information, la mise en relation et le développement d’activités dans la mobilité.",
        problem: "Entre opérateurs, territoires et administration, l’information et les opportunités restent cloisonnées.",
        building: "Une plateforme où les acteurs japonais et étrangers travaillent à partir des mêmes informations.",
        status: "En développement et en exploitation. Site public en ligne.",
      },
      {
        name: "Kakari",
        href: "/kakari",
        thesis: "Accompagner en plusieurs langues les démarches de ceux qui vivent au Japon ou y créent une activité.",
        problem: "Les dispositifs existent, mais la langue et l’enchaînement des étapes empêchent d’y recourir.",
        building: "Un moyen de découper une démarche en étapes et de montrer jusqu’où l’on peut aller seul.",
        status: "En développement. Préparation de la mise en ligne.",
      },
      {
        name: "Chigamo",
        href: "/chigamo",
        thesis: "Rendre un lieu lisible à partir de la position et du contexte.",
        problem: "Les informations les plus utiles sur un lieu sont précisément celles que l’on trouve le moins.",
        building: "Une manière de découvrir son bassin de vie à partir de la position et du contexte.",
        status: "Stade du concept. Rien n’a encore été vérifié.",
      },
    ],
    /* CORP-v1.4 — sépare ce qui est vrai aujourd’hui de ce qui peut suivre. */
    structureHeading: ["Ce qui est vrai aujourd’hui,", "et ce qui peut suivre."],
    structureBody: [
      "Les étapes indiquées ci-dessus décrivent la situation actuelle. Nous n’y écrivons que ce qui a déjà eu lieu.",
      "La suite n’est pas arrêtée. Un projet peut continuer d’être exploité au sein de Yorisou, accueillir une équipe d’exploitation venue de l’extérieur, être détenu conjointement ou être constitué en société distincte. Il peut aussi prendre la forme d’une licence, d’une cession ou d’une vente.",
      "Laquelle de ces formes s’appliquera dépend de la maturité du projet, des personnes avec qui il se fait, du marché, du capital et de l’accord conclu. Ce qui est écrit ici décrit des formes possibles : ce n’est ni un plan ni une promesse.",
    ],
    noteHeading: ["Ce que dit cette page,", "et ce qu’elle ne dit pas."],
    noteBody: [
      "Ce qui figure ici, ce sont les projets et les idées sur lesquels Yorisou travaille actuellement.",
      "Il ne s’agit ni de filiales constituées, ni de participations, ni de clients. Chacun en est à une étape différente, et nous l’écrivons telle quelle.",
      "Ce qui figure ici est vrai aujourd’hui. La forme que prendra ensuite chacun d’eux n’est pas arrêtée.",
    ],
  },

  /* ── CHIGAMO (CORP-v1.2) ──────────────────────────────────────── */
  chigamo: {
    reading: "Comprendre un lieu, depuis ce lieu même.",
    now: "Stade du concept. Aucun produit accessible, aucun utilisateur, aucun dispositif mené avec une collectivité.",
    next: "Filtrer par position et par contexte rend-il l’information réellement utilisable ? C’est ce que nous voulons éprouver d’abord, à petite échelle.",
    who: "Des personnes qui connaissent réellement un territoire donné, et qui savent dire où l’information sur le bassin de vie cesse d’être utile.",
    join: {
      title: "Participer à ce projet",
      body: "Nous en sommes encore avant toute vérification. Nous cherchons donc moins des personnes avec qui construire que des personnes capables de casser l’hypothèse.",
      roles: [
        "Vous connaissez en détail un territoire précis, pour y vivre",
        "Vous avez travaillé avec des données de localisation ou des données territoriales",
        "Cela ne vous dérange pas de vous impliquer alors que tout en est encore au stade du concept",
      ],
      state: "Stade du concept. La forme que pourrait prendre une participation n’est pas encore définie.",
    },
    eyebrow: "Projet",
    heading: ["Comprendre un lieu,", "depuis ce lieu même."],
    stage: "Stade du concept",
    lead:
      "Une idée : à partir de la position et du contexte, rendre visible ce qui est réellement utile là où l’on se trouve. Le projet en est encore au stade qui précède toute vérification.",
    domain: "Bassin de vie / position et contexte / découverte",
    conceptEyebrow: "Le raisonnement",
    conceptHeading: ["L’information existe.", "Elle n’arrive simplement pas."],
    conceptBody: [
      "Ce que l’on veut vraiment savoir d’un lieu est précisément ce qu’une recherche restitue le moins bien. Non que l’information manque : elle n’a jamais été organisée en fonction du lieu et de la situation.",
      "Où l’on se trouve, à quel moment, et dans quelle situation. Certaines informations ne deviennent reconnaissables comme les siennes que lorsque ces trois éléments coïncident. C’est ce que Chigamo cherche à traiter.",
    ],
    boundaryTitle: "Où en est le projet",
    boundaryBody:
      "Chigamo en est au stade du concept. Aucun produit n’est accessible, il n’y a aucun utilisateur et aucun dispositif mené avec une collectivité. Ce qui est écrit ici est une hypothèse que nous cherchons à vérifier.",
    detail: [
      {
        heading: "Pourquoi maintenant",
        body: "Les cartes et les moteurs de recherche sont arrivés à maturité. Pourtant, « ce qui a du sens pour moi, là où je me trouve » reste quelque chose que chacun doit reconstituer soi-même.",
      },
      {
        heading: "Ce qu’il faut vérifier",
        body: "Filtrer par position et par contexte rend-il l’information réellement utilisable ? C’est ce que nous voulons éprouver d’abord, à petite échelle.",
      },
    ],
  },

  /* ── NOTRE FAÇON DE CONSTRUIRE / FONDERIE (CORP-v1.2) ──────────────── */
  foundry: {
    eyebrow: "Notre façon de construire",
    heading: ["D’un problème", "à une entreprise, dans l’ordre."],
    lead:
      "Nous ne partons pas d’une intuition. Nous cherchons un problème structurel, nous le vérifions, nous le concevons comme une activité, nous nous associons à des personnes capables de la conduire, puis nous la menons jusqu’au point où elle tient debout comme activité. C’est cet enchaînement que Yorisou appelle sa fonderie.",
    stagesEyebrow: "Les étapes",
    stagesHeading: ["Huit étapes,", "et aucune n’est sautée."],
    stages: [
      { no: "01", name: "Hypothèse", body: "Situer le problème structurel — à partir de la forme réelle du terrain, non d’une intuition." },
      { no: "02", name: "Preuves", body: "Vérifier que le problème existe vraiment et sur qui il pèse. Beaucoup d’hypothèses s’arrêtent ici." },
      { no: "03", name: "Conception de l’activité", body: "Donner à la réponse la forme d’une activité : qui l’utilise, et où se crée la contrepartie." },
      { no: "04", name: "Construction", body: "Construire. Utiliser le socle commun là où il existe, et concentrer l’effort sur ce qui est propre au projet." },
      { no: "05", name: "Projet transmissible", body: "Amener les actifs et les procédures au point où quelqu’un d’extérieur peut les reprendre et les exploiter." },
      { no: "06", name: "Équipe fondatrice", body: "S’associer à une personne capable de porter le projet comme le sien — en tant que fondateur, non comme salarié." },
      { no: "07", name: "Indépendance et exploitation", body: "Amener le projet au point où il fonctionne par ses propres moyens. Il peut être constitué en société distincte, continuer d’être exploité au sein de Yorisou, ou être détenu conjointement avec d’autres." },
      { no: "08", name: "Apprentissage", body: "Conserver ce qui a fonctionné comme ce qui s’est arrêté, en matière première pour le projet suivant. La relation avec le projet ne s’arrête pas nécessairement là." },
    ],
    independenceHeading: ["Un projet peut prendre", "plus d’une forme."],
    independenceBody: [
      "Tenir debout comme entreprise indépendante est l’une des formes que nous visons. Cela ne signifie pas pour autant qu’y parvenir mette fin à la relation avec Yorisou.",
      "Un projet peut continuer d’être exploité au sein de Yorisou. Il peut aussi accueillir un fondateur ou une équipe d’exploitation venue de l’extérieur et être détenu conjointement, être constitué en société distincte, prendre la forme d’une licence, ou faire l’objet d’une cession ou d’une vente.",
      "La forme retenue dépend de la maturité du projet, des personnes avec qui il se fait, du marché, du capital et de l’accord conclu pour ce projet. Il n’existe pas de modèle fixé d’avance.",
      "Un seul point est constant : tout est construit, dès le départ, pour être transmis. Si ceux qui exploitent le projet ne détiennent pas les véritables décisions, il ne tient pas comme activité.",
    ],
    asterionEyebrow: "Socle technique et d’exécution commun",
    asterionHeading: ["Ne pas construire", "deux fois la même chose."],
    asterionBody: [
      "Asterion OS est un projet de plateforme technique indépendant. Il ne fait pas partie des projets Yorisou présentés sur ce site.",
      "Il est possible qu’un projet Yorisou utilise certaines capacités d’Asterion là où cela est approprié. La propriété, les licences, les droits sur les données et la responsabilité d’exploitation dépendent alors des accords applicables au cas considéré.",
      "Parce qu’un socle commun peut être utilisé, aucun projet n’a à reconstruire les mêmes mécanismes et chacun peut se concentrer sur son propre domaine. Ce qui s’accumule devient le point de départ du projet suivant.",
    ],
    asterionBoundaryTitle: "La limite",
    asterionBoundaryBody:
      "Chaque projet est gouverné séparément. La propriété intellectuelle, les données et la responsabilité d’exploitation sont réglées par l’accord propre à chaque projet. Rien n’est conçu pour que les données d’un projet ou de ses utilisateurs remontent automatiquement vers le socle.",
    economicsHeading: ["La détention suit", "la contribution et la responsabilité."],
    economicsBody: [
      "Les conditions diffèrent d’un projet à l’autre. Nous n’appliquons pas une formule unique à tous.",
      "Seul le principe est commun : la détention suit la contribution, le risque assumé et la responsabilité qui se poursuit. Ceux qui conduisent un projet y détiennent un véritable pouvoir de décision.",
      "Yorisou peut elle aussi rester associée à la valeur d’un projet dans la durée : en conservant une participation, sous la forme d’une licence, ou en l’exploitant conjointement. Ce qui s’applique dépend de la part que Yorisou a portée et du risque qu’elle a pris.",
      "Aucune condition ne peut être promise aujourd’hui. Ni la détention, ni la forme d’un droit ne sont fixées avant un accord.",
      "Les modalités concrètes se discutent projet par projet et personne par personne. Elles n’ont pas leur place sur un site.",
    ],
    maturityTitle: "Où nous en sommes",
    maturityBody:
      "Cette façon de faire n’est pas une méthode éprouvée ni reproductible. Yorisou en est à ses débuts et n’a encore fait sortir aucun projet sous la forme d’une entreprise indépendante. Ce qui est écrit ici décrit la manière dont nous procédons réellement ; ce n’est pas une affirmation de résultats.",
  },

  /* ── CONSTRUIRE AVEC NOUS (CORP-v1.2) ──────────────────────────── */
  buildWithUs: {
    eyebrow: "Construire avec nous",
    heading: ["Le point d’entrée dépend", "de la place que vous occupez."],
    lead:
      "Yorisou mène un projet jusqu’au seuil de l’activité, puis s’associe à qui peut le porter. Nous ne cherchons donc pas des personnes à employer, mais des personnes et des organisations prêtes à reprendre un projet.",
    /* CORP-v1.4 — la forme d’une participation se conçoit projet par projet, et n’est promise d’avance pour aucun. */
    structureHeading: ["La forme de votre participation", "se conçoit projet par projet."],
    structureBody: [
      "Il n’existe pas de case toute faite dans laquelle entrer. Cofondation, équipe fondatrice, participation dans un projet, licence, exploitation conjointe, constitution en société distincte : la forme dépend du projet et de la part que vous en portez.",
      "Quelle que soit la forme retenue, la gouvernance, la propriété intellectuelle, le rôle, les responsabilités et les conditions économiques sont fixés par un accord distinct. Aucune condition ne peut être promise ici à l’avance.",
    ],
    lanes: [
      {
        key: "founders",
        label: "Fondateurs",
        title: "Fondateurs et cofondateurs",
        body:
          "Reprendre comme le vôtre un projet mené jusqu’au seuil de l’entreprise. Vous entrez en tant que fondateur, non comme salarié : les décisions vous reviennent, et la responsabilité aussi.",
        invites: [
          "Vous avez réellement fait fonctionner une activité ancrée dans le terrain",
          "Vous savez avancer alors que beaucoup de choses restent indéterminées",
          "Vous connaissez l’un de ces terrains : technologie, industrie, administration ou territoire",
        ],
        offers: "Les recherches et les preuves, un premier produit, la conception de l’activité et le socle commun. Vous ne partez pas de zéro, mais de ce qui existe déjà.",
        cannot: "Nous ne pouvons promettre à ce stade ni salaire, ni financement, ni conditions de détention. Les modalités se discutent projet par projet.",
        ventures: ["Mirai Move", "Kakari", "Chigamo"],
        state: "Nous en sommes à l’étape où nous voulons écouter. Il n’y a aucun poste ouvert.",
        cta: "Faire part de votre intérêt",
      },
      {
        key: "team",
        label: "Équipe fondatrice",
        title: "Équipe fondatrice et spécialistes",
        body:
          "Un fondateur seul ne suffit jamais. Nous cherchons des personnes prêtes à tenir dès le début l’une des pièces : la technique, l’exploitation ou le terrain.",
        invites: [
          "Vous avez suivi les choses jusqu’à l’exploitation, et pas seulement jusqu’au lancement",
          "Vous avez déjà lancé quelque chose à quelques-uns",
          "Vous savez ce qui va de soi dans ce domaine",
        ],
        offers: "Une place dès le début, et une réelle latitude sur la partie que vous tenez.",
        cannot: "Il n’existe aucun processus de recrutement permanent. Nous ne pouvons pas dire que nous soyons en mesure d’embaucher aujourd’hui.",
        ventures: ["Mirai Move", "Kakari"],
        state: "Cela dépend de l’étape où en est le projet. Dites-nous d’abord ce que vous pourriez prendre en charge.",
        cta: "Engager la conversation",
      },
      {
        key: "users",
        label: "Premiers utilisateurs",
        title: "Premiers utilisateurs et personnes qui testent avec nous",
        body:
          "Nous voulons que ce que nous avons construit soit regardé depuis la position de celui qui s’en sert — non pour qu’on nous dise que c’est bien, mais pour qu’on nous dise où cela bloque.",
        invites: [
          "Vous avez réellement été confronté à ce problème",
          "Vous savez dire clairement ce qui n’a pas fonctionné",
          "Voir quelque chose avant sa mise en ligne ne vous dérange pas",
        ],
        offers: "Un aperçu de ce qui est en cours de construction, et ce que vous en dites revient dans la conception.",
        cannot: "Nous ne pouvons promettre ni date de mise en ligne, ni la prise en compte de vos demandes, ni aucune contrepartie.",
        ventures: ["Kakari", "Mirai Move"],
        state: "Nous cherchons des personnes à qui le montrer. Il ne s’agit pas d’un appel officiel.",
        cta: "Faire part de votre intérêt",
      },
      {
        key: "research",
        label: "Universités",
        title: "Universités et recherche",
        body:
          "Transformer un résultat de recherche en quelque chose d’utilisable par la société suppose une conception du côté de l’activité. Nous cherchons des interlocuteurs avec qui réfléchir à la formation de fondateurs et à la mise en œuvre de la recherche.",
        invites: [
          "Vous cherchez où vos travaux pourraient être mis en œuvre",
          "Vous souhaitez offrir aux étudiants et aux chercheurs une expérience concrète de la création",
          "Vous préférez commencer par une exploration commune",
        ],
        offers: "La conception du côté de l’activité, et un terrain réellement en fonctionnement. Nous pouvons commencer par une exploration.",
        cannot: "Il n’y a encore ni convention de recherche, ni financement, ni collaboration officielle.",
        ventures: ["Mirai Move", "Chigamo"],
        state: "Nous n’avons aucun partenariat à notre actif. Cela commence par une conversation.",
        cta: "Engager la conversation",
      },
      {
        key: "public",
        label: "Secteur public",
        title: "Administration et secteur public",
        body:
          "Le dispositif existe, mais il n’a jamais été traduit dans les démarches que les habitants accomplissent. C’est cet écart que nous voulons travailler : concevoir avec vous l’essai à petite échelle, la mesure de ses effets, et le passage à quelque chose qui dure.",
        invites: [
          "Vous avez un sujet qui peut être essayé sur le terrain",
          "Vous voulez pouvoir en mesurer les effets",
          "Vous ne voulez pas en rester à une expérimentation isolée",
        ],
        offers: "Les recherches, les preuves mises en ordre, et la conception d’un essai à petite échelle.",
        cannot: "Nous n’avons encore aucun dispositif mené avec une collectivité à notre actif, et nous ne pouvons offrir aucune garantie de nature réglementaire.",
        ventures: ["Mirai Move", "Kakari"],
        state: "Cela commence par une conversation. Aucune collaboration n’est en cours.",
        cta: "Nous en parler",
      },
      {
        key: "corporate",
        label: "Entreprises",
        title: "Entreprises",
        body:
          "Si un problème rencontré dans vos propres opérations mérite de devenir une activité. Nous pouvons commencer par un développement conjoint, ou par une vérification sur le terrain.",
        invites: [
          "Un problème opérationnel reste non résolu dans vos activités",
          "Vous cherchez la forme d’une nouvelle activité",
          "Vous cherchez un partenaire de développement",
        ],
        offers: "Nous pouvons intervenir dès la reconception du problème sous la forme d’une activité.",
        cannot: "Nous n’avons aucun historique commercial, et aucun cas client à vous montrer.",
        ventures: ["Mirai Move", "Kakari", "Chigamo"],
        state: "Cela commence par une écoute.",
        cta: "Nous écrire",
      },
    ],
    intakeTitle: "À propos de ces invitations",
    intakeBody:
      "Il n’existe aujourd’hui ni procédure de candidature ni programme de sélection. Ce qui figure ici est une invitation, non un partenariat en cours ni un poste ouvert. Nous commençons par écouter ce que vous avez à dire, puis par voir s’il y a matière à en parler.",
    foundingTeamEyebrow: "Équipe fondatrice",
    foundingTeamHeading: ["Nous commençons à construire", "avant qu’il y ait une entreprise."],
    foundingTeamBody: [
      "En général, une activité démarre une fois les personnes réunies. Yorisou procède dans l’ordre inverse : les recherches et les preuves, un premier produit et la conception de l’activité viennent d’abord, et nous cherchons ensuite la personne qui les reprendra.",
      "Personne ne part donc d’une page blanche. On commence par reprendre à son compte quelque chose qui a déjà une forme.",
      "En revanche, ce que reprendre veut dire ne change pas : celui qui détient les décisions détient aussi la responsabilité. Si ceux qui exploitent le projet ne détiennent pas les véritables décisions, ce n’est pas encore une entreprise.",
    ],
    ctaHeading: ["Quelle que soit votre place,", "l’entrée est la même."],
    ctaBody: "Écrivez-nous ce que vous avez en tête. Nous lisons chaque message, au fur et à mesure.",
  },
};
