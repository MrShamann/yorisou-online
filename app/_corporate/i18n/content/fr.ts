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
    home: { title: "Yorisou LLC — Entre les personnes et la société, créer la prochaine forme d’accompagnement.", description: "Yorisou LLC observe la complexité présente dans la vie quotidienne, le travail et les territoires, et conçoit des produits qui aident chacun à comprendre, à choisir et à avancer. Nous développons Mirai Move et Kakari." },
    miraiMove: { title: "Mirai Move — Yorisou LLC", description: "Une plateforme d’information, de mise en relation et de développement d’activités dans le secteur de la mobilité au Japon. Le site public est en ligne ; les fonctionnalités de la plateforme sont en cours de développement." },
    kakari: { title: "Kakari — Yorisou LLC", description: "Un accompagnement multilingue pour les démarches administratives et les documents, destiné aux personnes qui vivent au Japon et à celles qui y créent une activité. En cours de développement, pas encore accessible au public." },
    about: { title: "À propos — Yorisou LLC", description: "Pourquoi Yorisou existe, comment nous réfléchissons et comment nous construisons. Nous n’écrivons pas ce que nous ne pouvons pas vérifier." },
    company: { title: "Entreprise — Yorisou LLC", description: "Présentation de Yorisou LLC, profil du représentant, message du représentant et domaines d’activité." },
    contact: { title: "Contact — Yorisou LLC", description: "Point de contact pour les demandes liées à nos activités, aux partenariats et à la presse." },
  },

  common: {
    readMore: (name) => `En savoir plus sur ${name}`,
    backHome: "Retour à la présentation de l’entreprise",
    stageLabel: "Étape actuelle",
    boundaryLabel: "Ce que nous ne prenons pas en charge",
  },

  home: {
    eyebrow: "Yorisou LLC",
    thesis: ["Entre les personnes et la société,", "créer la prochaine forme", "d’accompagnement."],
    lead: ["Yorisou observe la complexité présente dans la vie quotidienne, le travail et les territoires,", "et conçoit des produits qui aident chacun à comprendre, à choisir et à avancer."],
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
    buildHeading: ["Nous créons la prochaine forme d’accompagnement,", "un domaine à la fois."],

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
};
