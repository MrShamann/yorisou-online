import type { SiteCopy } from "../types";

/**
 * CORP-P5R2 — SPANISH. Translated from the Japanese canonical source (ja.ts), using en.ts only as a
 * structural reference.
 *
 * It may never be stronger than the Japanese. No customer, partner, metric, revenue, funding,
 * market-position, team-size or capability claim appears here that the Japanese does not already
 * make.
 *
 * On the company form: Yorisou is a Japanese LLC (godo kaisha), a limited-liability company. It
 * is NOT a sociedad anonima, and the representative is a representative member — "socio administrador", never a
 * consejero delegado / CEO title.
 *
 * On the representative: "Harvard Business School Executive Education" is stated precisely. It is
 * NOT a Harvard University degree and NOT an HBS MBA, and must never be shortened in a way that
 * implies either. No endorsement by IESE, Harvard, Ficosa, or any government body is implied.
 */
export const es: SiteCopy = {
  chrome: {
    skip: "Saltar al contenido",
    menu: "Menú",
    menuToggle: "Abrir y cerrar el menú",
    close: "Cerrar",
    navLabel: "Navegación del sitio",
    navLabelMobile: "Navegación del sitio (móvil)",
    langLabel: "Idioma de visualización",
    langHeading: "Elegir idioma",
    langSearch: "Buscar idiomas",
    langCurrent: "Idioma actual",
    previewBadge: "Preview — sin publicar",
    nav: { home: "Inicio", miraiMove: "Mirai Move", kakari: "Kakari", about: "Quiénes somos", company: "La empresa", contact: "Contacto" },
    footerTagline: "Entre las personas y la sociedad, creamos la próxima forma de acompañar.",
    footerProjects: "Proyectos",
    footerCompany: "Empresa",
    footerLegalNote: "Todo lo que aquí se afirma se apoya en un registro que podemos verificar.",
    backToTop: "Volver arriba",
  },

  meta: {
    home: { title: "Yorisou LLC — De los problemas estructurales a empresas que se sostienen solas.", description: "Yorisou LLC es una foundry: encuentra problemas estructurales, construye las pruebas y los activos del negocio, y forma equipos fundadores para convertirlos en empresas independientes. Ahora avanzan Mirai Move, Kakari y Chigamo." },
    miraiMove: { title: "Mirai Move — Yorisou LLC", description: "Una plataforma de información, conexión y desarrollo de negocio en el sector de la movilidad en Japón. El sitio público está en funcionamiento; las funciones de plataforma están en desarrollo." },
    kakari: { title: "Kakari — Yorisou LLC", description: "Apoyo multilingüe para trámites administrativos y documentos, dirigido a quienes viven en Japón y a quienes inician aquí una actividad empresarial. En desarrollo; todavía no está disponible de forma general." },
    about: { title: "Cómo construimos — Yorisou LLC", description: "Encontrar el problema, comprobarlo, diseñarlo como negocio, formar un equipo fundador y llevarlo hasta una empresa independiente. Cómo funciona la foundry de Yorisou y dónde se sitúa la infraestructura compartida." },
    company: { title: "La empresa — Yorisou LLC", description: "Datos de la empresa, perfil del representante, mensaje del representante y áreas de actividad de Yorisou LLC." },
    contact: { title: "Contacto — Yorisou LLC", description: "Consultas sobre nuestra actividad, colaboraciones y prensa." },
    ventures: { title: "Proyectos — Yorisou LLC", description: "En qué trabaja Yorisou ahora mismo: Mirai Move, Kakari y Chigamo. Cada uno está en una etapa distinta y así lo indicamos." },
    buildWithUs: { title: "Construir juntos — Yorisou LLC", description: "Vías de entrada para fundadores, investigadores, administración pública y empresas. No hay convocatoria abierta ni proceso de selección: empezamos por una conversación." },
    chigamo: { title: "Chigamo — Yorisou LLC", description: "Una idea para que, a partir del lugar y el contexto, se entienda qué resulta realmente útil en ese sitio. Está en fase de concepto; no hay ningún producto publicado." },
  },

  common: {
    readMore: (name) => `Más sobre ${name}`,
    backHome: "Volver a la página de la empresa",
    stageLabel: "Etapa actual",
    boundaryLabel: "Lo que no asumimos",
    nowLabel: "Ahora",
    nextLabel: "Siguiente paso",
    whoLabel: "Con quién queremos hablar",
  },

  home: {
    eyebrow: "Yorisou LLC",
    thesis: ["Partimos de problemas estructurales", "para construir empresas", "que se sostengan por sí solas."],
    lead: [
      "Yorisou es una foundry: encontramos problemas estructurales de la sociedad, los verificamos, los diseñamos como negocios",
      "y nos asociamos con quienes van a dirigirlos para convertirlos en empresas independientes.",
    ],
    humanSide: "Personas",
    humanItems: ["Vida cotidiana", "Trabajo", "Comunidad"],
    systemSide: "Sistemas",
    systemItems: ["Movilidad", "Trámites administrativos"],
    fieldCaption: "Personas — vida cotidiana, trabajo, comunidad  /  Sistemas — movilidad, trámites administrativos",
    fieldRelation: "Relaciones",

    whyEyebrow: "Los problemas que abordamos",
    whyHeading: ["La complejidad no se resuelve", "solo con el esfuerzo individual."],
    whyBeats: [
      { no: "01", title: "«No lo entiendo» detiene a la gente en la puerta.", body: "Un sistema que existe pero al que no se puede llegar equivale a uno que no existe." },
      { no: "02", title: "El camino hasta un profesional es largo.", body: "Antes del punto en el que de verdad hace falta el criterio de una persona, hay un tramo que un sistema podría cubrir." },
      { no: "03", title: "El terreno real y el sistema no encajan.", body: "En movilidad, servicios sociales y administración pública hay opciones que aún no han llegado a quienes trabajan sobre el terreno." },
    ],

    buildEyebrow: "Lo que construimos",
    buildHeading: ["Tres áreas,", "en marcha ahora mismo."],

    howEyebrow: "Cómo construimos",
    howHeading: ["Asumimos la complejidad", "y la convertimos en algo utilizable."],
    howBeats: [
      { no: "01", title: "Empezar por el lenguaje del terreno", body: "No diseñamos partiendo de la tecnología. Trabajamos hacia atrás desde los pasos reales de quien está bloqueado." },
      { no: "02", title: "Responder hasta que se entienda", body: "Mostrar información no es el final. Saber qué hacer a continuación forma parte del alcance del diseño." },
      { no: "03", title: "Explicitar el límite", body: "No entramos en el trabajo que corresponde a un profesional habilitado. Lo que cubrimos y dónde traspasamos está escrito en el propio producto." },
      { no: "04", title: "Decir solo lo que se puede verificar", body: "Los resultados, las cifras y las colaboraciones solo aparecen cuando hay pruebas. Lo que no se puede confirmar no se escribe." },
    ],
    howDisclose: "Qué significan estos principios en la práctica",

    founderEyebrow: "Representante",
    founderHeading: ["Lo construye alguien que lleva", "veinte años dentro de industrias complejas."],
    founderTeaser: "Más de veinte años en automoción, movilidad, fabricación y negocio internacional, situado entre la tecnología, la implantación y la realidad comercial. Lo mismo se repetía una y otra vez: un sistema bien hecho que se detenía antes de llegar a la persona que lo necesitaba.",
    founderRole: "Socio administrador de Yorisou LLC",
    founderCta: "Sobre el representante",

    messageEyebrow: "Mensaje",
    messageHeading: ["Juzgamos por si llega,", "no por si es avanzado."],
    messageTeaser: "Aquello de lo que nos ocupamos no es la novedad. Los sistemas y las opciones ya existen: simplemente se detienen antes de llegar a quienes los necesitan. Estamos construyendo una empresa que acorta esa distancia, paso a paso.",
    messageCta: "Leer el mensaje completo",

    originEyebrow: "Dónde estamos",
    originHeading: ["Empezamos desde Fukuoka."],
    originBody: "Yorisou LLC está construyendo la empresa desde Fukuoka, Japón: un lugar donde la vida cotidiana, el trabajo y la comunidad están cerca unos de otros, y donde el diseño puede empezar por los pasos que las personas dan realmente.",

    proofEyebrow: "La empresa",
    proofHeading: ["Lo que podemos afirmar,", "y nada más."],

    ctaEyebrow: "Contacto",
    ctaHeading: ["Puede que haya margen", "para trabajar juntos."],
    ctaBody: "Atendemos consultas sobre nuestra actividad, posibles colaboraciones y prensa. Respondemos por orden, según lo que se plantee.",
    ctaButton: "Escríbanos",

    /* CORP-v1.2 — capa Asterion y capa de participación en la portada. */
    asterionEyebrow: "Infraestructura compartida",
    asterionHeading: ["Con cada proyecto,", "la base común se ensancha."],
    asterionBody:
      "Asterion OS es una plataforma independiente de tecnología y ejecución compartidas, situada dentro de la arquitectura de foundry de Yorisou. Como esa base común ya existe, ningún proyecto tiene que rehacerla y cada uno puede concentrarse en lo que le es propio.",
    asterionNote:
      "Cada proyecto se gobierna por separado y conserva su propia propiedad intelectual, sus datos y su responsabilidad operativa. Asterion no es propiedad de Yorisou.",
    engageEyebrow: "Construir juntos",
    engageHeading: ["Participe desde antes", "de que sea una empresa."],
    engageBody:
      "Fundadores, investigadores, administración pública y empresas. El punto de entrada depende del lugar desde el que llegue. Empezamos por lo que ya se pueda hablar.",
    engageCta: "Ver las vías de entrada",
    engageNote: "Todas empiezan por una conversación. Todavía no existe ningún proceso de solicitud ni de selección.",
    explainerLabel: "Yorisou en 30 segundos",
    explainerHeading: ["De un problema a una empresa,", "en treinta segundos."],
    explainerClose: "Cerrar",
  },

  mirai: {
    reading: "Llevar la movilidad local hasta la solución.",
    now: "El sitio público está en funcionamiento, y el sistema que lee información pública sigue trabajando por su cuenta. Aun así, no hemos hecho llegar nada a nadie fuera: ni una sola vez.",
    next: "En el primer caso con contenido real quedan cuestiones que no se pueden cerrar desde el escritorio. A partir de aquí le toca moverse a una persona.",
    who: "Quien conozca por dentro la movilidad local —municipios, operadores, el propio terreno— y pueda explicar las restricciones reales.",
    join: {
      title: "Participar en este proyecto",
      body: "Lo que hace falta ahora es alguien que sepa describir esas restricciones de forma concreta. Es una etapa de comprobación, no de venta.",
      roles: [
        "Trabaja en transporte o movilidad local: municipio, operador o el propio terreno",
        "Podría asumir este ámbito como fundador o como responsable de la operación",
        "Conoce cómo funciona realmente la operación",
      ],
      state: "Estamos en la etapa de querer escuchar. No hay ninguna plaza abierta.",
    },
    eyebrow: "Proyecto 01",
    heading: ["Una plataforma de información, conexión", "y desarrollo de negocio", "en el sector de la movilidad en Japón."],
    stage: "Sitio público en funcionamiento / funciones de plataforma en desarrollo",
    lead: "Mirai Move aspira a conectar a la Administración y los municipios, las empresas, los entornos comunitarios y de cuidados, los proveedores extranjeros y los socios nacionales, para que la información y las oportunidades en torno a la movilidad puedan tratarse como un único flujo. Hoy el sitio público de información está en funcionamiento; las funciones de plataforma están en desarrollo.",
    domain: "El sector de la movilidad en Japón",
    networkEyebrow: "A quién conecta",
    networkHeading: ["Partes que ocupan lugares distintos", "miran la misma oportunidad", "con palabras distintas."],
    centre: "Oportunidad de movilidad",
    parties: [
      { no: "01", title: "Administración y municipios", body: "El lado de las normas y el presupuesto" },
      { no: "02", title: "Empresas", body: "El lado del suministro y la implantación" },
      { no: "03", title: "Entornos comunitarios, de cuidados y servicios sociales", body: "Donde el desplazamiento ocurre realmente" },
      { no: "04", title: "Proveedores extranjeros y socios nacionales", body: "Quienes aportan las opciones" },
    ],
    boundaryTitle: "Sobre el estado de desarrollo",
    boundaryBody: "La plataforma en sí está en desarrollo. La ejecución autónoma por agentes no está activada. Toda acción que salga hacia fuera del sistema está diseñada para requerir la confirmación de una persona. No se ofrece como una plataforma terminada ni con todas sus funciones.",
    detail: [
      { heading: "El problema que aborda", body: "Las opciones de movilidad existen por separado según la región, el programa y el operador. Quien necesita una y la opción que ya existe no se encuentran en el mismo lugar." },
      { heading: "Con quién trabaja", body: "Administración y municipios, empresas, entornos comunitarios y de cuidados, proveedores extranjeros y socios nacionales. Partes con posiciones y criterios distintos miran la misma oportunidad con palabras distintas." },
      { heading: "Qué está en funcionamiento hoy", body: "El sitio público de información está en funcionamiento. Las capacidades de información, conexión y desarrollo de negocio de la plataforma se encuentran en la fase de construcción de sus bases y su arquitectura." },
    ],
    siteLabel: "Sitio público",
    siteUrl: "https://www.miraimove.com",
  },

  kakari: {
    reading: "Que los trámites en Japón pueda hacerlos uno mismo.",
    now: "Está en pruebas privadas. No está disponible al público y todavía no lo usa nadie.",
    next: "Los trámites necesarios para distribuirlo y la fijación de los datos registrales de la empresa. Las dos cosas requieren una confirmación externa.",
    who: "Personas extranjeras que viven en Japón, quienes las acompañan y los profesionales habilitados.",
    join: {
      title: "Participar en este proyecto",
      body: "Primero queremos que lo mire quien conoce cómo son de verdad estos trámites. No es una herramienta para sustituir a un profesional.",
      roles: [
        "Ha tenido dificultades reales con un trámite en Japón",
        "Acompaña de algún modo a personas extranjeras residentes",
        "Es profesional habilitado y puede ayudarnos a comprobar dónde está el límite",
        "Podría asumir este proyecto como fundador o como responsable de la operación",
      ],
      state: "Buscamos a quién enseñárselo. Todavía no está publicado ni hay convocatoria.",
    },
    eyebrow: "Proyecto 02",
    heading: ["Apoyo multilingüe para trámites", "y documentos, para quienes viven en Japón", "y quienes inician aquí una actividad."],
    stage: "En desarrollo (todavía no disponible de forma general)",
    lead: "Cuando el idioma y los conocimientos previos son la barrera, las personas no llegan a sistemas que tienen derecho a usar. Kakari ayuda a encontrar la información pertinente, preparar los documentos, cumplimentar los formularios y seguir el proceso de presentación, en el idioma de cada persona. Está en desarrollo y todavía no está disponible de forma general.",
    domain: "Trámites administrativos y documentos / multilingüe",
    procedureEyebrow: "El trámite que acompaña",
    procedureHeading: ["Desde informarse,", "hasta presentar."],
    steps: [
      { no: "01", title: "Informarse", body: "Identificar qué trámites le corresponden" },
      { no: "02", title: "Reunir documentos", body: "Determinar los documentos y anexos necesarios" },
      { no: "03", title: "Preparar", body: "Cumplimentar los formularios en su idioma y revisar el contenido" },
      { no: "04", title: "Presentar", body: "Orientación sobre dónde, cómo y por qué vía postal presentar" },
    ],
    boundaryTitle: "Dónde toma el relevo un profesional",
    boundaryBody: "No actuamos como profesional habilitado en su nombre. Las cuestiones jurídicas y fiscales y las resoluciones oficiales se indican como trabajo que corresponde a un profesional. Los juicios o la representación que requieren una habilitación profesional —como abogado, asesor fiscal o gestor administrativo— no forman parte de las funciones de Kakari.",
    detail: [
      { heading: "El problema que aborda", body: "Cómo se realiza un trámite es información pública. Aun así, hay personas que no llegan al sistema simplemente porque les faltan el idioma y los conocimientos que se dan por supuestos. Eso no es una falta de capacidad." },
      { heading: "Con quién trabaja", body: "Personas que viven en Japón y personas que van a iniciar aquí una actividad empresarial: aquellas para quienes hacer un trámite en japonés por sí solas resulta difícil." },
      { heading: "Qué está en funcionamiento hoy", body: "La base de autenticación se ha construido en un entorno de verificación aislado, donde se están verificando los permisos y el almacenamiento. Las integraciones externas siguen desactivadas y no está disponible públicamente." },
    ],
  },

  about: {
    eyebrow: "Quiénes somos",
    heading: ["Cómo construimos", "es la promesa que hacemos."],
    lead: "Yorisou observa de cerca la complejidad de la vida cotidiana, el trabajo y las comunidades locales, y crea productos que ayudan a las personas a entenderla, decidir y avanzar.",
    whyHeading: ["Por qué existe esta empresa."],
    whyBody: [
      "Los sistemas, la tecnología y las opciones ya existen en gran número. Aun así, se detienen antes de llegar a quien los necesita. Esa última distancia es en la que trabajamos.",
      "Esa distancia suele describirse como una cuestión de esfuerzo individual o de información. En la práctica, la complejidad que el sistema podría haber absorbido se traslada sin más a la persona.",
    ],
    thinkHeading: ["Cómo pensamos."],
    thinkBody: [
      "No diseñamos partiendo de la tecnología. Empezamos por soltar el movimiento que ahora está bloqueado: leer la situación de la persona, ordenarla como un conjunto de relaciones y llevarla hasta el punto en el que el siguiente paso queda claro. Ese es el alcance del diseño.",
      "La IA se usa para esa comprensión y esa estructuración, no para tomar la decisión. Su función es dejar en una forma utilizable el material que una persona necesita. El criterio, y la responsabilidad, siguen siendo de la persona.",
    ],
    buildHeading: ["Cómo construimos."],
    principles: [
      { no: "01", title: "Empezar por el lenguaje del terreno", body: "No diseñamos partiendo de la tecnología. Trabajamos hacia atrás desde los pasos reales de quien está bloqueado." },
      { no: "02", title: "Responder hasta que se entienda", body: "Mostrar información no es el final. Saber qué hacer a continuación forma parte del alcance del diseño." },
      { no: "03", title: "Explicitar el límite", body: "No entramos en el trabajo que corresponde a un profesional habilitado. Lo que cubrimos y dónde traspasamos está escrito en el propio producto." },
      { no: "04", title: "Decir solo lo que se puede verificar", body: "Los resultados, las cifras y las colaboraciones solo aparecen cuando hay pruebas. Lo que no se puede confirmar no se escribe." },
    ],
    principlesLong: [
      { no: "01", title: "Empezar por el lenguaje del terreno", long: "Ningún sistema llega a nadie hasta que se traduce a los pasos que da realmente la persona que lo tiene delante. Empezamos por la solicitud real, el trayecto real, el intercambio real: no por un planteamiento abstracto del problema, sino por el único movimiento que ahora está bloqueado." },
      { no: "02", title: "Responder hasta que se entienda", long: "Enumerar resultados de búsqueda no es acompañar. Lo que una persona necesita es saber qué hacer a continuación. El alcance del producto llega hasta el punto en que se entiende el siguiente paso, no hasta el punto en que se ha mostrado la información." },
      { no: "03", title: "Explicitar el límite", long: "Dejar que alguien use un producto sin aclarar lo que no puede hacer es el diseño más peligroso que existe. Lo que asumimos y dónde toma el relevo un profesional está escrito en la propia pantalla. El límite es una función, no una advertencia al pie." },
      { no: "04", title: "Decir solo lo que se puede verificar", long: "No describimos resultados que no podemos confirmar ni funciones que aún no están en marcha. Cada hecho que publicamos tiene un registro detrás. En las etapas en las que hay poco que podamos decir, publicamos poco." },
    ],
    orderHeading: ["De una en una,", "hasta el final."],
    orderBody: "No ponemos muchas cosas en marcha a la vez. Preferimos llevar un solo ámbito hasta el punto en que alcanza los pasos que las personas dan realmente.",
    claimsHeading: ["No escribimos", "lo que no podemos verificar."],
    claimsBody: "Cada hecho que publicamos tiene un registro detrás. En las etapas en las que hay poco que podamos decir, publicamos poco.",
  },

  company: {
    eyebrow: "La empresa",
    heading: ["Yorisou LLC"],
    intro: "Yorisou LLC crea productos que convierten la complejidad de la vida cotidiana, el trabajo y las comunidades locales en algo que una persona pueda entender, elegir y llevar a la práctica. Con base en Fukuoka, desarrollamos dos proyectos: Mirai Move y Kakari.",

    messageEyebrow: "Mensaje del representante",
    messageHeading: ["Juzgamos por si llega,", "no por si es avanzado."],
    message: [
      "Aquello de lo que nos ocupamos no es la novedad.",
      "Durante más de veinte años, en automoción, movilidad y fabricación, me situé entre la tecnología, la implantación y la realidad comercial. Lo mismo se repetía una y otra vez: un sistema bien hecho que se detenía antes de llegar a la persona que lo necesitaba. No porque faltara tecnología, sino porque nunca se había traducido a los pasos que esa persona da realmente.",
      "Los sistemas y las opciones ya existen en gran número. Pero si alguien no sabe si le corresponden o qué hacer a continuación, es como si no existieran. Acortar esa última distancia —que la asuma el sistema y no la persona— es la razón por la que existe Yorisou.",
      "No usamos la IA para tomar la decisión. La usamos para leer la situación, ordenarla como relaciones y dejarla en una forma utilizable, de modo que sea una persona quien decida. El criterio y la responsabilidad siguen siendo de la persona. Lo que asumimos y dónde traspasamos a un profesional está escrito en la propia pantalla.",
      "Seguimos siendo una empresa pequeña y todavía no hay mucho que podamos afirmar. Precisamente por eso escribimos solo lo que podemos verificar. Lo que debe crecer no es la afirmación, sino el registro de haber llegado de verdad.",
    ],
    messageSignature: "Jin Yang",
    messageRole: "Socio administrador de Yorisou LLC",

    profileEyebrow: "Representante",
    profileHeading: ["Sobre el representante"],
    profileName: "Jin Yang",
    profileNameLatin: "Jin Yang / Edward Jin",
    profileRole: "Socio administrador de Yorisou LLC",
    profileBody: [
      "Más de veinte años de experiencia profesional en automoción, movilidad, fabricación, desarrollo de proyectos industriales, cadena de suministro, desarrollo comercial, desarrollo de producto y negocio internacional transfronterizo.",
    ],
    profileBackgroundLabel: "Trayectoria",
    profileBackground: [
      "Asumió responsabilidades sénior comerciales y de proyectos industriales en Ficosa, proveedor internacional de automoción, con trabajo vinculado a proyectos industriales globales y a la actividad comercial en Asia.",
      "Posteriormente fundó y dirigió negocios de tecnología y fabricación en China, con trabajo relacionado con electrónica del automóvil, sistemas de control, fabricación de precisión y desarrollo de productos y sistemas con IA.",
      "Ha trabajado en varios mercados, entre ellos Europa, China y Japón.",
      "Actualmente es socio administrador de Yorisou LLC en Japón y construye la empresa desde Fukuoka.",
    ],
    profileEducationLabel: "Formación",
    profileEducation: [
      "MBA, IESE Business School",
      "General Management Program, Harvard Business School Executive Education",
    ],
    profileRelevanceLabel: "Por qué esta trayectoria importa aquí",
    profileRelevance: [
      "Una larga experiencia trabajando en industrias reales y complejas.",
      "Haber estado donde se encuentran la tecnología, la fabricación, la ejecución comercial y los mercados internacionales.",
      "Contacto directo con la distancia que separa lo que un sistema puede hacer de lo que una persona o una organización puede usar realmente.",
      "Y, por eso, la razón para crear productos que convierten la complejidad en algo comprensible y accionable.",
    ],

    overviewEyebrow: "Datos de la empresa",
    overviewHeading: ["Datos de la empresa"],
    facts: [
      { label: "Denominación", value: "Yorisou LLC (Yorisou GK, sociedad japonesa de responsabilidad limitada)" },
      { label: "Representante", value: "Jin Yang, socio administrador" },
      { label: "Domicilio", value: "Ciudad de Fukuoka, prefectura de Fukuoka (Japón)" },
      { label: "Actividad", value: "Planificación, desarrollo y operación de Mirai Move y Kakari" },
    ],

    businessEyebrow: "Áreas de actividad",
    businessHeading: ["Áreas de actividad"],
    businessBody: "Información, conexión y desarrollo de negocio en el sector de la movilidad; y apoyo multilingüe para trámites administrativos y documentos, dirigido a quienes viven en Japón y a quienes inician aquí una actividad empresarial. Ambas siguen el mismo principio: asumir la complejidad y devolver algo utilizable.",

    projectsEyebrow: "Proyectos",
    projectsHeading: ["Lo que estamos construyendo"],

    originEyebrow: "Dónde estamos",
    originHeading: ["Empezamos desde Fukuoka."],
    originBody: [
      "Yorisou LLC construye la empresa desde la ciudad de Fukuoka, en Japón.",
      "Es un lugar donde la vida cotidiana, el trabajo y la comunidad están cerca unos de otros, y donde el diseño puede empezar por los pasos que las personas dan realmente.",
    ],

    ctaHeading: ["Contacto"],
    ctaBody: "Atendemos consultas sobre nuestra actividad, posibles colaboraciones y prensa.",
  },

  contact: {
    eyebrow: "Contacto",
    heading: ["Contacto"],
    lead: "Atendemos consultas sobre nuestra actividad, posibles colaboraciones y prensa. Respondemos por orden, según lo que se plantee.",
    channelsHeading: ["Sobre qué puede consultarnos"],
    channels: [
      { title: "Consultas generales", body: "Preguntas sobre Yorisou como empresa y sobre los proyectos que estamos construyendo." },
      { title: "Negocio y colaboraciones", body: "Colaboraciones o conversaciones comerciales en movilidad o en trámites administrativos." },
      { title: "Prensa y medios", body: "Solicitudes de entrevista y preguntas sobre la empresa o su representante." },
    ],
    formHeading: ["Envíenos un mensaje"],
    formIntro: "Utilice el formulario siguiente. Leemos todas las consultas y respondemos por orden.",
    fields: {
      name: "Nombre", namePlaceholder: "Su nombre",
      email: "Correo electrónico", emailPlaceholder: "nombre@ejemplo.com",
      org: "Empresa u organización", orgPlaceholder: "Opcional",
      type: "Tipo de consulta",
      message: "Mensaje", messagePlaceholder: "Cuéntenos el contexto y qué le gustaría confirmar.",
    },
    types: [
      { value: "general", label: "Consulta general" },
      { value: "business", label: "Negocio y colaboraciones" },
      { value: "media", label: "Prensa y medios" },
    ],
    submit: "Enviar",
    sending: "Enviando…",
    successTitle: "Mensaje enviado",
    successBody: "Hemos recibido su consulta. La revisaremos y le responderemos por orden.",
    errorTitle: "No se ha podido enviar",
    errorBody: "Espere un momento y vuelva a intentarlo.",
    required: "Obligatorio",
    privacyNote: "Los datos personales que facilite se utilizan únicamente para responder a su consulta.",
  },

  /* ── ÍNDICE DE PROYECTOS (CORP-v1.2) ────────────────────────────────── */
  ventures: {
    eyebrow: "En lo que trabajamos ahora",
    heading: ["Tres ámbitos,", "aún antes de ser empresas."],
    lead:
      "En todos ellos los sistemas y los programas ya existen, pero se detienen justo antes de llegar a quien los necesita. Yorisou trabaja en ese hueco y va comprobando sobre la marcha.",
    cards: [
      {
        name: "Mirai Move",
        href: "/mirai-move",
        thesis: "Unir información, conexión y desarrollo de negocio en el ámbito de la movilidad.",
        problem: "La información y las oportunidades están separadas entre operadores, territorios y administración.",
        building: "Una plataforma donde las partes, dentro y fuera de Japón, puedan hablar sobre la misma información.",
        status: "En desarrollo y en funcionamiento. Sitio público disponible.",
      },
      {
        name: "Kakari",
        href: "/kakari",
        thesis: "Acompañar en varios idiomas los trámites de quienes viven en Japón o inician aquí una actividad.",
        problem: "Los sistemas existen, pero el idioma y la secuencia de pasos hacen que nunca lleguen a usarse.",
        building: "Una forma de dividir el trámite en etapas y mostrar hasta dónde puede llegar cada persona por sí misma.",
        status: "En desarrollo. En fase de preparación para su publicación.",
      },
      {
        name: "Chigamo",
        href: "/chigamo",
        thesis: "Hacer legible un lugar a partir de la ubicación y el contexto.",
        problem: "Cuanto más útil sería una información en ese lugar, más cuesta encontrarla.",
        building: "Un modo de descubrir el entorno cotidiano a partir de la ubicación y el contexto.",
        status: "Fase de concepto. Todavía sin comprobar.",
      },
    ],
    noteHeading: ["Lo que dice esta página", "y lo que no dice."],
    noteBody: [
      "Aquí figuran los proyectos e ideas en los que Yorisou trabaja actualmente.",
      "No son filiales constituidas, ni participaciones, ni clientes. Cada uno está en una etapa distinta y la escribimos tal cual.",
      "El objetivo es que cada uno pueda sostenerse como empresa independiente. Ninguno ha llegado todavía a ese punto.",
    ],
  },

  /* ── CHIGAMO (CORP-v1.2) ────────────────────────────────────────────── */
  chigamo: {
    reading: "Entender un lugar desde dentro del lugar.",
    now: "Está en fase de concepto. No hay ningún producto publicado, ni personas usuarias, ni ningún programa con administraciones locales.",
    next: "Comprobar si acotar por ubicación y contexto convierte de verdad la información en algo utilizable. Queremos empezar por ahí, a pequeña escala.",
    who: "Quien conozca de verdad un sitio concreto y sepa explicar dónde deja de servir la información del entorno cotidiano.",
    join: {
      title: "Participar en este proyecto",
      body: "Todavía estamos antes de la fase de comprobación. Por eso buscamos menos a alguien con quien construir que a alguien que rompa la hipótesis.",
      roles: [
        "Conoce en detalle una zona concreta, por vivir en ella",
        "Ha trabajado con datos de ubicación o datos del territorio",
        "No le importa participar cuando todavía es solo un concepto",
      ],
      state: "Fase de concepto. Todavía no está decidido de qué forma se puede participar.",
    },
    eyebrow: "Proyecto",
    heading: ["Entender un lugar", "desde dentro del lugar."],
    stage: "Fase de concepto",
    lead:
      "Una idea: usar la ubicación y el contexto para que se entienda qué resulta realmente útil en un sitio concreto. Todavía es anterior a la fase de comprobación.",
    domain: "Entorno cotidiano / ubicación y contexto / descubrimiento",
    conceptEyebrow: "Lo que estamos pensando",
    conceptHeading: ["No es que falte información:", "es que no llega."],
    conceptBody: [
      "Lo que de verdad se quiere saber sobre un lugar es justo lo que peor devuelve una búsqueda. No porque la información no exista, sino porque nunca se ordenó en relación con el lugar y la situación.",
      "Dónde está uno, en qué momento y en qué situación se encuentra. Hay información que solo se reconoce como propia cuando coinciden esas tres cosas. Es ahí donde Chigamo quiere trabajar.",
    ],
    boundaryTitle: "En qué punto está",
    boundaryBody:
      "Chigamo está en fase de concepto. No hay ningún producto publicado, ni personas usuarias, ni ningún programa con administraciones locales. Lo que aquí se describe es una hipótesis que queremos comprobar.",
    detail: [
      {
        heading: "Por qué ahora",
        body: "Los mapas y los buscadores han madurado. Aun así, «qué tiene sentido para mí en el lugar donde estoy» sigue siendo algo que cada persona reconstruye por su cuenta.",
      },
      {
        heading: "Qué hay que comprobar",
        body: "Si acotar por ubicación y contexto convierte de verdad la información en algo utilizable. Queremos comprobarlo primero a pequeña escala.",
      },
    ],
  },

  /* ── CÓMO CONSTRUIMOS / FOUNDRY (CORP-v1.2) ─────────────────────────── */
  foundry: {
    eyebrow: "Cómo construimos",
    heading: ["De un problema a una empresa,", "en orden."],
    lead:
      "No empezamos por una ocurrencia. Encontramos un problema estructural, lo comprobamos, lo diseñamos como negocio, nos asociamos con quien pueda dirigirlo y lo llevamos hasta una empresa independiente. A ese orden Yorisou lo llama foundry.",
    stagesEyebrow: "Etapas",
    stagesHeading: ["Ocho etapas,", "sin saltarse ninguna."],
    stages: [
      { no: "01", name: "Hipótesis", body: "Plantear dónde está el problema estructural, a partir de la forma real del trabajo y no de una corazonada." },
      { no: "02", name: "Pruebas", body: "Comprobar si el problema existe de verdad y sobre quién recae. Aquí desaparecen muchas hipótesis." },
      { no: "03", name: "Diseño del negocio", body: "Convertir la solución en un negocio: quién lo usa y dónde se produce realmente el intercambio de valor." },
      { no: "04", name: "Construcción", body: "Construirlo. Usar la base común allí donde exista y concentrar el esfuerzo en lo que es propio de ese proyecto." },
      { no: "05", name: "Listo como negocio", body: "Dejar los activos y los procedimientos en un estado en el que alguien de fuera pueda tomarlos y operarlos." },
      { no: "06", name: "Formación del equipo fundador", body: "Asociarnos con quien pueda asumirlo como propio: como fundador, no como empleado." },
      { no: "07", name: "Independencia y operación", body: "Dirigirlo como empresa independiente, con una forma que no siga dependiendo de Yorisou." },
      { no: "08", name: "Aprendizaje", body: "Conservar lo que funcionó y también lo que se descartó, como material para el siguiente proyecto." },
    ],
    independenceHeading: ["El objetivo es una empresa", "que se sostenga sola."],
    independenceBody: [
      "El propósito de la foundry no es acumular proyectos bajo Yorisou, sino llevar cada uno hasta donde pueda sostenerse como empresa independiente.",
      "Por eso se construye desde el principio en una forma que pueda traspasarse. Si quienes lo dirigen no tienen la capacidad real de decidir, no se ha convertido en una empresa.",
    ],
    asterionEyebrow: "Tecnología y ejecución compartidas",
    asterionHeading: ["No construir", "dos veces lo mismo."],
    asterionBody: [
      "Asterion OS es una plataforma independiente de tecnología y ejecución compartidas, situada dentro de la arquitectura de foundry de Yorisou. No es propiedad de Yorisou.",
      "Como esa base común existe, ningún proyecto tiene que rehacer lo mismo y cada uno puede concentrarse en su propio ámbito. Lo que se va acumulando sirve de punto de partida para el siguiente.",
    ],
    asterionBoundaryTitle: "El límite",
    asterionBoundaryBody:
      "Cada proyecto se gobierna por separado. La propiedad intelectual, los datos y la responsabilidad operativa pertenecen al proyecto. Nada está diseñado para que los datos de un proyecto o de sus usuarios pasen automáticamente a la plataforma.",
    economicsHeading: ["La participación sigue", "a la contribución y a la responsabilidad."],
    economicsBody: [
      "Las condiciones son distintas en cada proyecto. No aplicamos un mismo modelo fijo a todos.",
      "Lo único común es el principio: la participación sigue a la contribución, al riesgo asumido y a la responsabilidad que continúa. Quien dirige un proyecto tiene capacidad real de decisión.",
      "Las condiciones concretas se hablan con cada proyecto y con cada persona. No son algo que corresponda escribir en un sitio web.",
    ],
    maturityTitle: "En qué punto está",
    maturityBody:
      "Esta forma de trabajar no es todavía un método probado ni repetible. Yorisou está en una etapa inicial y aún no ha puesto en marcha ningún proyecto como empresa independiente. Lo que aquí se describe es cómo procedemos en la práctica, no una afirmación sobre resultados.",
  },

  /* ── CONSTRUIR JUNTOS (CORP-v1.2R2) ──────────────────────── */
  buildWithUs: {
    eyebrow: "Construir juntos",
    heading: ["Cada punto de partida", "tiene su propia entrada."],
    lead:
      "Yorisou lleva un proyecto hasta justo antes de que sea una empresa y entonces se asocia con quien pueda cargar con él. Por eso no buscamos a alguien a quien contratar, sino a alguien que lo asuma.",
    lanes: [
      {
        key: "founders",
        label: "Fundadores",
        title: "Fundadores y cofundadores",
        body:
          "Asumir como propio un proyecto llevado hasta justo antes de ser una empresa. Se entra como fundador, no como persona contratada: las decisiones quedan de su lado, y la responsabilidad también.",
        invites: [
          "Ha dirigido de verdad algo con operación real detrás",
          "Sabe avanzar cuando todavía hay mucho sin decidir",
          "Conoce el terreno en tecnología, fabricación, administración pública o trabajo local",
        ],
        offers: "Investigación y pruebas, un producto inicial, el diseño del negocio y la infraestructura compartida. Se empieza a medio camino, no desde cero.",
        cannot: "A día de hoy no podemos prometer salario, ni financiación, ni condiciones de participación en el capital. Las condiciones se hablan proyecto por proyecto.",
        ventures: ["Mirai Move", "Kakari", "Chigamo"],
        state: "Estamos en la etapa de querer escuchar. No hay ninguna plaza abierta.",
        cta: "Manifestar interés",
      },
      {
        key: "team",
        label: "Equipo fundador",
        title: "Equipo fundador y personas especialistas",
        body:
          "Con un fundador solo nunca basta. Buscamos a quien pueda sostener desde el principio una de las partes: la técnica, la operación o el terreno.",
        invites: [
          "Ha acompañado las cosas hasta la operación, no solo hasta el lanzamiento",
          "Ha puesto algo en marcha con un equipo pequeño",
          "Sabe qué se da por supuesto en su ámbito",
        ],
        offers: "Un sitio desde el principio y margen real de decisión sobre la parte que sostenga.",
        cannot: "No hay ningún proceso de contratación permanente. No podemos decir que estemos en condiciones de contratar ahora mismo.",
        ventures: ["Mirai Move", "Kakari"],
        state: "Depende de la etapa de cada proyecto. Cuéntenos primero qué podría asumir.",
        cta: "Empezar una conversación",
      },
      {
        key: "users",
        label: "Primeras personas usuarias",
        title: "Primeras personas usuarias y quienes prueban con nosotros",
        body:
          "Queremos que se mire lo construido desde la posición de quien lo usa de verdad. No para que nos digan que está bien, sino para que nos digan dónde se atasca.",
        invites: [
          "Ha tenido dificultades reales con este problema",
          "Puede decir con claridad qué no funcionó",
          "No le importa ver algo antes de que sea público",
        ],
        offers: "Ver algo a medio construir, y que lo que diga vuelva al diseño.",
        cannot: "No podemos prometer una fecha de publicación, ni que su petición se incorpore, ni ninguna compensación.",
        ventures: ["Kakari", "Mirai Move"],
        state: "Buscamos a quién enseñárselo. No es una convocatoria formal.",
        cta: "Manifestar interés",
      },
      {
        key: "research",
        label: "Universidad",
        title: "Universidad e investigación",
        body:
          "Llevar un resultado de investigación a una forma que la sociedad pueda usar exige también diseño de negocio. Buscamos con quién pensar la formación de personas fundadoras y la implementación de la investigación.",
        invites: [
          "Busca dónde puede aterrizar un resultado de investigación",
          "Quiere que estudiantes e investigadores tengan experiencia real de creación de empresas",
          "Prefiere empezar por una exploración conjunta",
        ],
        offers: "El diseño desde el lado del negocio y un terreno que está realmente en marcha. Se puede empezar por explorar.",
        cannot: "Todavía no hay ningún convenio de investigación, ni financiación, ni colaboración formal.",
        ventures: ["Mirai Move", "Chigamo"],
        state: "No tenemos ninguna colaboración previa. Se empieza por hablar.",
        cta: "Empezar una conversación",
      },
      {
        key: "public",
        label: "Sector público",
        title: "Administración y sector público",
        body:
          "El sistema existe, pero nunca se ha traducido a los pasos que puede seguir un residente. Queremos diseñar juntos, en ese desnivel, la prueba pequeña, la medición del efecto y el camino hasta algo que perdure.",
        invites: [
          "Tiene un problema que puede probarse sobre el terreno",
          "Quiere darle una forma en la que el efecto pueda medirse",
          "No quiere que se quede en una prueba piloto aislada",
        ],
        offers: "Investigación, pruebas ordenadas en una forma utilizable y un diseño para probar a pequeña escala.",
        cannot: "No tenemos ningún trabajo previo con administraciones locales y no podemos ofrecer ninguna garantía en términos normativos.",
        ventures: ["Mirai Move", "Kakari"],
        state: "Se empieza por una consulta. No hay ninguna colaboración en marcha.",
        cta: "Consultarnos",
      },
      {
        key: "corporate",
        label: "Empresas",
        title: "Empresas",
        body:
          "Si tiene en su propia operación un problema que debería convertirse en negocio. Podemos empezar por un desarrollo conjunto o por una prueba sobre el terreno.",
        invites: [
          "Hay un problema operativo sin resolver en su día a día",
          "Busca la forma de un nuevo negocio",
          "Busca un socio de desarrollo conjunto",
        ],
        offers: "Se puede participar ya desde el momento de rediseñar el problema como negocio.",
        cannot: "No tenemos operaciones comerciales previas ni casos de implantación que podamos enseñar.",
        ventures: ["Mirai Move", "Kakari", "Chigamo"],
        state: "Se empieza por escuchar.",
        cta: "Escribirnos",
      },
    ],
    intakeTitle: "Sobre la recepción de propuestas",
    intakeBody:
      "Actualmente no existe ningún proceso de solicitud ni programa de selección. Lo que aquí figura es una invitación, no una colaboración en marcha ni una vacante abierta. Empezamos por escuchar de qué se trata y por ver si hay algo que hablar.",
    foundingTeamEyebrow: "Equipo fundador",
    foundingTeamHeading: ["Empezamos a construir", "antes de que haya una empresa."],
    foundingTeamBody: [
      "Lo habitual es que un proyecto empiece cuando ya se ha reunido la gente. Yorisou trabaja en el orden inverso: primero la investigación y las pruebas, el producto inicial y el diseño como negocio; después buscamos a quien vaya a asumirlo.",
      "Así, quien participa no empieza con la página en blanco. Empieza recogiendo algo que ya tiene forma y haciéndolo suyo.",
      "Lo que no cambia es qué significa asumirlo. Quien tiene las decisiones tiene también la responsabilidad. Si quien dirige no puede decidir de verdad, eso todavía no es una empresa.",
    ],
    ctaHeading: ["Sea cual sea su posición,", "la primera puerta es la misma."],
    ctaBody: "Escríbanos lo que tiene en mente. Lo leemos por orden.",
  },
};
