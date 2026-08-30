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
    footerTagline: "Entre les personnes et la société, créer la prochaine forme d’accompagnement.",
    footerProjects: "Projets",
    footerCompany: "Entreprise",
    footerLegalNote: "Les faits présentés ici reposent sur des éléments que nous avons pu vérifier.",
    backToTop: "Haut de page",
  },

  meta: {
    home: { title: "Yorisou LLC — D’un problème structurel à une entreprise qui tient debout seule.", description: "Yorisou LLC est une fonderie d’entreprises : nous cherchons des problèmes structurels, réunissons les preuves et les actifs nécessaires, et nous associons à des équipes fondatrices pour en faire des entreprises indépendantes. Mirai Move, Kakari et Chigamo sont en cours." },
    miraiMove: { title: "Mirai Move — Yorisou LLC", description: "Une plateforme d’information, de mise en relation et de développement d’activités dans le secteur de la mobilité au Japon. Le site public est en ligne ; les fonctionnalités de la plateforme sont en cours de développement." },
    kakari: { title: "Kakari — Yorisou LLC", description: "Un accompagnement multilingue pour les démarches administratives et les documents, destiné aux personnes qui vivent au Japon et à celles qui y créent une activité. En cours de développement, pas encore accessible au public." },
    about: { title: "Notre façon de construire — Yorisou LLC", description: "Trouver le problème, le vérifier, le concevoir comme une activité, constituer une équipe fondatrice et la conduire jusqu’à une entreprise indépendante. Le fonctionnement de la fonderie Yorisou, et la place qu’y occupe le socle technique commun." },
    company: { title: "Entreprise — Yorisou LLC", description: "Présentation de Yorisou LLC, profil du représentant, message du représentant et domaines d’activité." },
    contact: { title: "Contact — Yorisou LLC", description: "Point de contact pour les demandes liées à nos activités, aux partenariats et à la presse." },
    ventures: { title: "Projets — Yorisou LLC", description: "Ce que Yorisou construit aujourd’hui : Mirai Move, Kakari et Chigamo. Chacun en est à une étape différente, et nous l’indiquons telle quelle." },
    buildWithUs: { title: "Construire avec nous — Yorisou LLC", description: "Les portes d’entrée pour les fondateurs, les chercheurs, les acteurs publics et les entreprises. Il n’existe pas d’appel à candidatures : nous commençons par une conversation." },
    chigamo: { title: "Chigamo — Yorisou LLC", description: "Une idée : rendre visible, à partir du lieu et du contexte, ce qui est réellement utile là où l’on se trouve. Au stade du concept ; aucun produit n’est accessible au public." },
  },

  common: {
    readMore: (name) => `En savoir plus sur ${name}`,
    backHome: "Retour à la présentation de l’entreprise",
    stageLabel: "Étape actuelle",
    boundaryLabel: "Ce que nous ne prenons pas en charge",
  },

  home: {
    eyebrow: "Yorisou LLC",
    thesis: ["D’un problème structurel,", "nous bâtissons une entreprise", "qui tient debout seule."],
    lead: [
      "Yorisou est une fonderie d’entreprises : nous cherchons les problèmes structurels de la société, nous les vérifions, nous les concevons comme des activités,",
      "puis nous nous associons à ceux qui les conduiront, jusqu’à en faire des entreprises indépendantes.",
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
    buildHeading: ["Trois domaines,", "en cours aujourd’hui."],

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
      "Asterion OS est une plateforme technique et d’exécution commune, indépendante, qui trouve sa place dans l’architecture de la fonderie Yorisou. Parce que ce socle existe déjà, aucun projet n’a à le reconstruire : chacun peut consacrer son énergie à ce qui lui est propre.",
    asterionNote:
      "Chaque projet est gouverné séparément et conserve sa propre propriété intellectuelle, ses propres données et sa propre responsabilité d’exploitation. Asterion n’appartient pas à Yorisou.",
    engageEyebrow: "Construire avec nous",
    engageHeading: ["Entrer maintenant,", "pendant que l’entreprise se forme."],
    engageBody:
      "Fondateurs, chercheurs, acteurs publics, entreprises. Le point d’entrée dépend de la place que vous occupez. Nous commençons par ce dont il est possible de parler aujourd’hui.",
    engageCta: "Voir les portes d’entrée",
  },

  mirai: {
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
    intro: "Yorisou LLC conçoit des produits qui transforment la complexité de la vie quotidienne, du travail et des territoires en quelque chose que chacun peut comprendre, choisir et mettre en œuvre. Basée à Fukuoka, l’entreprise développe deux projets : Mirai Move et Kakari.",

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
      { label: "Représentant", value: "Jin Yang" },
      { label: "Siège", value: "Ville de Fukuoka, préfecture de Fukuoka, Japon" },
      { label: "Activité", value: "Conception, développement et exploitation de Mirai Move et Kakari" },
    ],

    businessEyebrow: "Domaines d’activité",
    businessHeading: ["Domaines d’activité"],
    businessBody: "Information, mise en relation et développement d’activités dans le secteur de la mobilité ; et accompagnement multilingue pour les démarches administratives et les documents, destiné aux personnes qui vivent au Japon et à celles qui y créent une activité. Les deux suivent le même principe : prendre en charge la complexité et restituer quelque chose d’utilisable.",

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
    eyebrow: "Les projets en cours",
    heading: ["Trois domaines, menés", "jusqu’au seuil de l’entreprise."],
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
    noteHeading: ["Ce que dit cette page,", "et ce qu’elle ne dit pas."],
    noteBody: [
      "Ce qui figure ici, ce sont les projets et les idées sur lesquels Yorisou travaille actuellement.",
      "Il ne s’agit ni de filiales constituées, ni de participations, ni de clients. Chacun en est à une étape différente, et nous l’écrivons telle quelle.",
      "L’objectif est que chacun tienne un jour comme entreprise indépendante. Aucun n’y est encore parvenu.",
    ],
  },

  /* ── CHIGAMO (CORP-v1.2) ──────────────────────────────────────── */
  chigamo: {
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
      "Nous ne partons pas d’une intuition. Nous cherchons un problème structurel, nous le vérifions, nous le concevons comme une activité, nous nous associons à des personnes capables de la conduire, puis nous la menons jusqu’à une entreprise indépendante. C’est cet enchaînement que Yorisou appelle sa fonderie.",
    stagesEyebrow: "Les étapes",
    stagesHeading: ["Huit étapes,", "et aucune n’est sautée."],
    stages: [
      { no: "01", name: "Hypothèse", body: "Situer le problème structurel — à partir de la forme réelle du terrain, non d’une intuition." },
      { no: "02", name: "Preuves", body: "Vérifier que le problème existe vraiment et sur qui il pèse. Beaucoup d’hypothèses s’arrêtent ici." },
      { no: "03", name: "Conception de l’activité", body: "Donner à la réponse la forme d’une activité : qui l’utilise, et où se crée la contrepartie." },
      { no: "04", name: "Construction", body: "Construire. Utiliser le socle commun là où il existe, et concentrer l’effort sur ce qui est propre au projet." },
      { no: "05", name: "Projet transmissible", body: "Amener les actifs et les procédures au point où quelqu’un d’extérieur peut les reprendre et les exploiter." },
      { no: "06", name: "Équipe fondatrice", body: "S’associer à une personne capable de porter le projet comme le sien — en tant que fondateur, non comme salarié." },
      { no: "07", name: "Indépendance et exploitation", body: "Faire fonctionner le projet comme une entreprise indépendante, conçue pour ne pas rester dépendante de Yorisou." },
      { no: "08", name: "Apprentissage", body: "Conserver ce qui a fonctionné comme ce qui s’est arrêté, en matière première pour le projet suivant." },
    ],
    independenceHeading: ["Le but est une entreprise", "qui tient debout seule."],
    independenceBody: [
      "La fonderie n’a pas pour but d’accumuler des entités sous Yorisou. Elle a pour but d’amener chaque projet au point où il peut tenir comme entreprise indépendante.",
      "C’est pourquoi tout est construit, dès le départ, pour être transmis. Si ceux qui exploitent le projet ne détiennent pas les véritables décisions, ce n’est pas encore une entreprise.",
    ],
    asterionEyebrow: "Socle technique et d’exécution commun",
    asterionHeading: ["Ne pas construire", "deux fois la même chose."],
    asterionBody: [
      "Asterion OS est une plateforme technique et d’exécution commune, indépendante, qui trouve sa place dans l’architecture de la fonderie Yorisou. Elle n’appartient pas à Yorisou.",
      "Parce que ce socle commun existe, aucun projet n’a à reconstruire les mêmes mécanismes et chacun peut se concentrer sur son propre domaine. Ce qui s’accumule devient le point de départ du projet suivant.",
    ],
    asterionBoundaryTitle: "La limite",
    asterionBoundaryBody:
      "Chaque projet est gouverné séparément. La propriété intellectuelle, les données et la responsabilité d’exploitation appartiennent au projet. Rien n’est conçu pour que les données d’un projet ou de ses utilisateurs remontent automatiquement vers le socle.",
    economicsHeading: ["La détention suit", "la contribution et la responsabilité."],
    economicsBody: [
      "Les conditions diffèrent d’un projet à l’autre. Nous n’appliquons pas une formule unique à tous.",
      "Seul le principe est commun : la détention suit la contribution, le risque assumé et la responsabilité qui se poursuit. Ceux qui conduisent un projet y détiennent un véritable pouvoir de décision.",
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
      "Pour l’instant, nous commençons par ce dont il est possible de parler. Il n’existe pas de cadre de recrutement établi. Si cela vous intéresse, dites-nous d’abord ce que vous avez en tête.",
    lanes: [
      {
        key: "founders",
        title: "Fondateurs et opérateurs",
        body:
          "Yorisou mène ses projets jusqu’au seuil de l’entreprise et cherche des personnes capables d’en porter un comme le leur. C’est un rôle de fondateur, non un poste que l’on confie.",
        invites: [
          "Vous avez réellement fait fonctionner une activité ancrée dans le terrain",
          "Vous savez avancer alors que beaucoup de choses restent indéterminées",
          "Vous connaissez l’un de ces terrains : technologie, industrie, administration ou territoire",
        ],
        cta: "Faire part de votre intérêt",
      },
      {
        key: "research",
        title: "Universités et recherche",
        body:
          "Transformer un résultat de recherche en quelque chose d’utilisable par la société suppose une conception du côté de l’activité. Nous cherchons des interlocuteurs avec qui réfléchir à la formation de fondateurs et à la mise en œuvre de la recherche.",
        invites: [
          "Vous cherchez où vos travaux pourraient être mis en œuvre",
          "Vous souhaitez offrir aux étudiants et aux chercheurs une expérience concrète de la création",
          "Vous préférez commencer par une exploration commune",
        ],
        cta: "Engager la conversation",
      },
      {
        key: "public",
        title: "Administration et secteur public",
        body:
          "Dans le domaine public, le dispositif existe souvent sans avoir été traduit dans les démarches que les habitants accomplissent. Nous souhaitons concevoir avec vous l’essai à petite échelle, la mesure de ses effets, et le passage à quelque chose qui dure.",
        invites: [
          "Vous avez un sujet qui peut être essayé sur le terrain",
          "Vous voulez pouvoir en mesurer les effets",
          "Vous ne voulez pas en rester à une expérimentation isolée",
        ],
        cta: "Nous en parler",
      },
      {
        key: "corporate",
        title: "Entreprises",
        body:
          "Si un problème rencontré dans vos propres opérations mérite de devenir une activité. Nous pouvons commencer par un développement conjoint, ou par une vérification sur le terrain.",
        invites: [
          "Un problème opérationnel reste non résolu dans vos activités",
          "Vous cherchez la forme d’une nouvelle activité",
          "Vous cherchez un partenaire de développement",
        ],
        cta: "Nous écrire",
      },
    ],
    intakeTitle: "À propos de ces invitations",
    intakeBody:
      "Il n’existe aujourd’hui ni procédure de candidature ni programme de sélection. Ce qui figure ici est une invitation, non un partenariat en cours ni un poste ouvert. Nous commençons par écouter ce que vous avez à dire, puis par voir s’il y a matière à en parler.",
    ctaHeading: ["Quelle que soit votre place,", "l’entrée est la même."],
    ctaBody: "Écrivez-nous ce que vous avez en tête. Nous lisons chaque message, au fur et à mesure.",
  },
};
