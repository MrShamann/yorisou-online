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
    home: { title: "Yorisou LLC — Entre las personas y la sociedad, creamos la próxima forma de acompañar.", description: "Yorisou LLC observa de cerca la complejidad de la vida cotidiana, el trabajo y las comunidades locales, y crea productos que ayudan a las personas a entenderla, decidir y avanzar. Desarrollamos Mirai Move y Kakari." },
    miraiMove: { title: "Mirai Move — Yorisou LLC", description: "Una plataforma de información, conexión y desarrollo de negocio en el sector de la movilidad en Japón. El sitio público está en funcionamiento; las funciones de plataforma están en desarrollo." },
    kakari: { title: "Kakari — Yorisou LLC", description: "Apoyo multilingüe para trámites administrativos y documentos, dirigido a quienes viven en Japón y a quienes inician aquí una actividad empresarial. En desarrollo; todavía no está disponible de forma general." },
    about: { title: "Quiénes somos — Yorisou LLC", description: "Por qué existe Yorisou, cómo piensa y cómo construye. No escribimos lo que no podemos verificar." },
    company: { title: "La empresa — Yorisou LLC", description: "Datos de la empresa, perfil del representante, mensaje del representante y áreas de actividad de Yorisou LLC." },
    contact: { title: "Contacto — Yorisou LLC", description: "Consultas sobre nuestra actividad, colaboraciones y prensa." },
  },

  common: {
    readMore: (name) => `Más sobre ${name}`,
    backHome: "Volver a la página de la empresa",
    stageLabel: "Etapa actual",
    boundaryLabel: "Lo que no asumimos",
  },

  home: {
    eyebrow: "Yorisou LLC",
    thesis: ["Entre las personas y la sociedad,", "creamos la próxima forma", "de acompañar."],
    lead: ["Yorisou observa de cerca la complejidad de la vida cotidiana, el trabajo y las comunidades locales,", "y crea productos que ayudan a las personas a entenderla, decidir y avanzar."],
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
    buildHeading: ["Creamos la próxima forma de acompañar,", "de una en una."],

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
  },

  mirai: {
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
};
