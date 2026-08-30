import type { SiteCopy } from "../types";

/**
 * CORP-P5R2 — PORTUGUESE. Translated from the Japanese canonical source (ja.ts).
 *
 * This is an adapted sibling, not a literal rendering: it is written to read as natural corporate
 * Portuguese. It may never be stronger than the Japanese. No customer, partner, metric, revenue,
 * funding, market-position, team-size or capability claim appears here that the Japanese does not
 * already make.
 *
 * On the company form: the Japanese "gogo gaisha" is a limited liability company. It is rendered as
 * "Yorisou LLC" and never with a joint-stock-company term. The representative member is rendered as
 * "sócio administrador" — never a corporate-CEO title.
 *
 * On the representative: "Harvard Business School Executive Education" is stated precisely. It is
 * NOT a Harvard University degree and NOT an HBS MBA, and must never be shortened in a way that
 * implies either. No endorsement by IESE, Harvard, Ficosa, or any government body is implied.
 */
export const pt: SiteCopy = {
  chrome: {
    skip: "Ir para o conteúdo",
    menu: "Menu",
    menuToggle: "Abrir e fechar o menu",
    close: "Fechar",
    navLabel: "Navegação do site",
    navLabelMobile: "Navegação do site (versão móvel)",
    langLabel: "Idioma de exibição",
    langHeading: "Escolha um idioma",
    langSearch: "Pesquisar idiomas",
    langCurrent: "Idioma atual",
    previewBadge: "Preview — não publicado",
    nav: { home: "Início", miraiMove: "Mirai Move", kakari: "Kakari", about: "Sobre nós", company: "A empresa", contact: "Contato" },
    footerTagline: "Entre as pessoas e a sociedade, criamos a próxima forma de estar ao lado.",
    footerProjects: "Projetos",
    footerCompany: "Empresa",
    footerLegalNote: "Os fatos publicados aqui baseiam-se em registros que pudemos verificar.",
    backToTop: "Voltar ao topo",
  },

  meta: {
    home: { title: "Yorisou LLC — Entre as pessoas e a sociedade, criamos a próxima forma de estar ao lado.", description: "A Yorisou LLC observa de perto a complexidade da vida cotidiana, do trabalho e das comunidades locais e cria produtos que ajudam as pessoas a entender, escolher e seguir em frente. Desenvolvemos o Mirai Move e o Kakari." },
    miraiMove: { title: "Mirai Move — Yorisou LLC", description: "Uma plataforma de informação, conexão e desenvolvimento de negócios no setor de mobilidade do Japão. O site público está no ar; as funcionalidades da plataforma estão em desenvolvimento." },
    kakari: { title: "Kakari — Yorisou LLC", description: "Suporte multilíngue para procedimentos administrativos e documentos, para quem vive no Japão e para quem vai abrir um negócio aqui. Em desenvolvimento, ainda não disponível ao público." },
    about: { title: "Sobre nós — Yorisou LLC", description: "Por que a Yorisou existe, como pensa e como constrói. Não escrevemos o que não podemos verificar." },
    company: { title: "A empresa — Yorisou LLC", description: "Perfil corporativo, perfil do sócio administrador, mensagem do sócio administrador e áreas de atuação da Yorisou LLC." },
    contact: { title: "Contato — Yorisou LLC", description: "Canal para consultas sobre nosso trabalho, parcerias e imprensa." },
  },

  common: {
    readMore: (name) => `Saiba mais sobre ${name}`,
    backHome: "Voltar à página da empresa",
    stageLabel: "Estágio atual",
    boundaryLabel: "O que não assumimos",
  },

  home: {
    eyebrow: "Yorisou LLC",
    thesis: ["Entre as pessoas e a sociedade,", "criamos a próxima forma", "de estar ao lado."],
    lead: ["A Yorisou observa de perto a complexidade da vida cotidiana, do trabalho e das comunidades locais", "e cria produtos que ajudam as pessoas a entender, escolher e seguir em frente."],
    humanSide: "Pessoas",
    humanItems: ["Vida cotidiana", "Trabalho", "Comunidade"],
    systemSide: "Sistemas",
    systemItems: ["Mobilidade", "Procedimentos públicos"],
    fieldCaption: "Pessoas — vida cotidiana, trabalho, comunidade  /  Sistemas — mobilidade, procedimentos públicos",
    fieldRelation: "Relações",

    whyEyebrow: "Os problemas que enfrentamos",
    whyHeading: ["A complexidade não se resolve", "só com o esforço de cada um."],
    whyBeats: [
      { no: "01", title: "O “não sei” barra as pessoas logo na entrada.", body: "Um sistema que existe, mas ao qual não se consegue chegar, é o mesmo que não existir." },
      { no: "02", title: "O caminho até um profissional é longo.", body: "Antes do ponto em que o julgamento humano é realmente necessário, há um trecho que o sistema poderia percorrer." },
      { no: "03", title: "A prática e o sistema não se encaixam.", body: "Na mobilidade, na assistência social e na administração pública existem opções que ainda não chegaram a quem está no dia a dia." },
    ],

    buildEyebrow: "O que construímos",
    buildHeading: ["Criamos a próxima forma de estar ao lado,", "uma de cada vez."],

    howEyebrow: "Como construímos",
    howHeading: ["Assumimos a complexidade", "e a transformamos em algo utilizável."],
    howBeats: [
      { no: "01", title: "Começar pela linguagem de quem está no dia a dia", body: "Não partimos da tecnologia. Projetamos a partir dos passos reais de quem está travado." },
      { no: "02", title: "Responder até o ponto da compreensão", body: "Apresentar a informação não é o fim. Saber o que fazer a seguir faz parte do escopo do projeto." },
      { no: "03", title: "Explicitar o limite", body: "Não entramos no que cabe a um profissional habilitado. Até onde vamos e a partir de onde passamos adiante está escrito dentro do próprio produto." },
      { no: "04", title: "Dizer apenas o que pode ser verificado", body: "Resultados, números e parcerias só aparecem quando há evidência. O que não pode ser confirmado não é escrito." },
    ],
    howDisclose: "O que esses princípios significam na prática",

    founderEyebrow: "Representante",
    founderHeading: ["Construído por quem passou", "vinte anos dentro de setores complexos."],
    founderTeaser: "Mais de vinte anos nos setores automotivo, de mobilidade, de manufatura e de negócios internacionais, entre a tecnologia, a implementação e a realidade comercial. A mesma cena se repetia: um sistema bem construído parava antes de chegar a quem precisava dele.",
    founderRole: "Sócio administrador, Yorisou LLC",
    founderCta: "Sobre o representante",

    messageEyebrow: "Mensagem",
    messageHeading: ["Avaliamos pelo que chega,", "não pelo que é avançado."],
    messageTeaser: "O que tratamos não é novidade. Instituições e opções já existem — mas param antes de chegar a quem precisa delas. Estamos construindo uma empresa que encurta essa distância, passo a passo.",
    messageCta: "Ler a mensagem completa",

    originEyebrow: "Onde estamos",
    originHeading: ["Começando por Fukuoka."],
    originBody: "A Yorisou LLC está construindo a empresa a partir de Fukuoka, no Japão — um lugar onde vida cotidiana, trabalho e comunidade estão próximos e onde o projeto pode começar pelos passos que as pessoas realmente dão.",

    proofEyebrow: "A empresa",
    proofHeading: ["O que podemos afirmar,", "e apenas isso."],

    ctaEyebrow: "Contato",
    ctaHeading: ["Talvez haja espaço", "para trabalharmos juntos."],
    ctaBody: "Recebemos consultas sobre nosso trabalho, propostas de parceria e pedidos de imprensa. Respondemos conforme o conteúdo de cada mensagem.",
    ctaButton: "Fale conosco",
  },

  mirai: {
    eyebrow: "Projeto 01",
    heading: ["Uma plataforma de informação, conexão", "e desenvolvimento de negócios", "no setor de mobilidade do Japão."],
    stage: "Site público no ar / funcionalidades da plataforma em desenvolvimento",
    lead: "O Mirai Move busca conectar governo e municípios, empresas, comunidades e serviços de cuidado e assistência, fornecedores estrangeiros e parceiros nacionais, para que a informação e as oportunidades ligadas à mobilidade sejam tratadas como um único fluxo. Hoje o site público de informação está no ar; as funcionalidades da plataforma estão em desenvolvimento.",
    domain: "Setor de mobilidade do Japão",
    networkEyebrow: "Quem ele conecta",
    networkHeading: ["Partes em posições diferentes", "olham para a mesma oportunidade", "com palavras diferentes."],
    centre: "Oportunidade de mobilidade",
    parties: [
      { no: "01", title: "Governo e municípios", body: "O lado das regras e do orçamento" },
      { no: "02", title: "Empresas", body: "O lado do fornecimento e da execução" },
      { no: "03", title: "Comunidades e serviços de cuidado e assistência", body: "Onde o deslocamento de fato acontece" },
      { no: "04", title: "Fornecedores estrangeiros e parceiros nacionais", body: "Quem traz as opções" },
    ],
    boundaryTitle: "Sobre o estágio de desenvolvimento",
    boundaryBody: "A plataforma em si está em desenvolvimento. A execução autônoma por agentes não está habilitada. Qualquer ação que alcance o exterior do sistema é projetada para exigir confirmação humana. Não é oferecida como uma plataforma concluída e com todas as funcionalidades.",
    detail: [
      { heading: "O problema que aborda", body: "As opções de mobilidade existem separadas por região, por programa e por operador. Quem precisa de uma delas e a opção que já existe não se encontram no mesmo lugar." },
      { heading: "Com quem trabalha", body: "Governo e municípios, empresas, comunidades e serviços de cuidado e assistência, fornecedores estrangeiros e parceiros nacionais. Partes com posições e critérios diferentes olham para a mesma oportunidade com palavras diferentes." },
      { heading: "O que está em funcionamento hoje", body: "O site público de informação está no ar. As funções de informação, conexão e desenvolvimento de negócios da plataforma estão na etapa de construção da base e da arquitetura." },
    ],
    siteLabel: "Site público",
    siteUrl: "https://www.miraimove.com",
  },

  kakari: {
    eyebrow: "Projeto 02",
    heading: ["Suporte multilíngue para procedimentos", "e documentos, para quem vive no Japão", "e para quem vai abrir um negócio aqui."],
    stage: "Em desenvolvimento (ainda não disponível ao público)",
    lead: "Quando a língua e o conhecimento prévio são a barreira, as pessoas não conseguem chegar a sistemas que teriam o direito de usar. O Kakari apoia a identificação da informação necessária, a preparação dos documentos, o preenchimento dos formulários e a orientação sobre o processo de entrega e de envio postal — em vários idiomas. Está em desenvolvimento e ainda não disponível ao público.",
    domain: "Procedimentos administrativos e documentos / multilíngue",
    procedureEyebrow: "O percurso que apoia",
    procedureHeading: ["Da pesquisa inicial,", "até a entrega."],
    steps: [
      { no: "01", title: "Pesquisar", body: "Identificar quais procedimentos se aplicam a você" },
      { no: "02", title: "Reunir os documentos", body: "Levantar os documentos e anexos necessários" },
      { no: "03", title: "Preencher", body: "Preencher no seu idioma e conferir o conteúdo" },
      { no: "04", title: "Entregar", body: "Orientar sobre onde, como e por qual processo postal enviar" },
    ],
    boundaryTitle: "O que cabe a um profissional habilitado",
    boundaryBody: "Não atuamos como representantes no lugar de profissionais habilitados. As áreas que exigem decisões jurídicas, tributárias ou determinações oficiais são explicitadas como trabalho de um profissional habilitado. Julgamentos ou representação que exijam habilitação — como advogado, contador tributarista ou despachante administrativo — não fazem parte das funções do Kakari.",
    detail: [
      { heading: "O problema que aborda", body: "Como realizar um procedimento é informação pública. Ainda assim, há quem não consiga chegar ao sistema apenas porque falta o idioma e o conhecimento pressuposto. Isso não é uma questão de capacidade da pessoa." },
      { heading: "Com quem trabalha", body: "Pessoas que vivem no Japão e pessoas que vão abrir um negócio aqui — quem está em uma situação em que é difícil conduzir sozinho um procedimento em japonês." },
      { heading: "O que está em funcionamento hoje", body: "A base de autenticação foi construída em um ambiente de verificação isolado, no qual permissões e armazenamento estão sendo verificados. As integrações externas permanecem desativadas e não há disponibilização ao público." },
    ],
  },

  about: {
    eyebrow: "Sobre nós",
    heading: ["A forma como construímos", "é a promessa que fazemos."],
    lead: "A Yorisou observa de perto a complexidade da vida cotidiana, do trabalho e das comunidades locais e cria produtos que ajudam as pessoas a entender, escolher e seguir em frente.",
    whyHeading: ["Por que esta empresa existe."],
    whyBody: [
      "Instituições, tecnologias e opções já existem em grande número. Ainda assim, param antes de chegar a quem precisa delas. É dessa última distância que cuidamos.",
      "Essa distância costuma ser descrita como uma questão de esforço individual ou de falta de informação. Na prática, porém, boa parte da complexidade que o sistema poderia absorver é simplesmente entregue à pessoa.",
    ],
    thinkHeading: ["Como pensamos."],
    thinkBody: [
      "Não partimos da tecnologia. Começamos por destravar o passo que está parado agora: ler a situação da pessoa, organizá-la como um conjunto de relações e levá-la até o ponto em que o próximo passo fica claro. Esse é o escopo do nosso projeto.",
      "A IA é usada para essa compreensão e estruturação, não para decidir no lugar das pessoas. Seu papel é organizar, de forma utilizável, o material de que alguém precisa para decidir. A decisão e a responsabilidade permanecem com a pessoa.",
    ],
    buildHeading: ["Como construímos."],
    principles: [
      { no: "01", title: "Começar pela linguagem de quem está no dia a dia", body: "Não partimos da tecnologia. Projetamos a partir dos passos reais de quem está travado." },
      { no: "02", title: "Responder até o ponto da compreensão", body: "Apresentar a informação não é o fim. Saber o que fazer a seguir faz parte do escopo do projeto." },
      { no: "03", title: "Explicitar o limite", body: "Não entramos no que cabe a um profissional habilitado. Até onde vamos e a partir de onde passamos adiante está escrito dentro do próprio produto." },
      { no: "04", title: "Dizer apenas o que pode ser verificado", body: "Resultados, números e parcerias só aparecem quando há evidência. O que não pode ser confirmado não é escrito." },
    ],
    principlesLong: [
      { no: "01", title: "Começar pela linguagem de quem está no dia a dia", long: "Nenhum sistema chega a alguém enquanto não for traduzido para os passos que a pessoa à sua frente realmente dá. Começamos pelo pedido real, pelo deslocamento real, pela conversa real — não por um enunciado abstrato de problema, mas pelo único passo que está travado agora." },
      { no: "02", title: "Responder até o ponto da compreensão", long: "Listar resultados de busca não é apoio. O que a pessoa precisa é saber o que fazer a seguir. O escopo do produto vai até o ponto em que o próximo passo é compreendido, e não até o ponto em que a informação foi exibida." },
      { no: "03", title: "Explicitar o limite", long: "Deixar alguém usar um produto sem deixar claro o que ele não faz é o projeto mais perigoso que existe. O que assumimos e o ponto em que um profissional habilitado assume estão escritos na própria tela. O limite é uma função, não um aviso legal." },
      { no: "04", title: "Dizer apenas o que pode ser verificado", long: "Não falamos de resultados que não podemos confirmar nem de funcionalidades que ainda não estão em operação. Todo fato que publicamos tem um registro por trás. Nos períodos em que há pouco a dizer, publicamos pouco." },
    ],
    orderHeading: ["Um de cada vez,", "até o fim."],
    orderBody: "Não iniciamos muitas coisas ao mesmo tempo. Preferimos levar uma área até o ponto em que ela alcança os passos que as pessoas realmente dão.",
    claimsHeading: ["Não escrevemos", "o que não podemos verificar."],
    claimsBody: "Todo fato que publicamos tem um registro por trás. Nos períodos em que há pouco a dizer, publicamos pouco.",
  },

  company: {
    eyebrow: "A empresa",
    heading: ["Yorisou LLC"],
    intro: "A Yorisou LLC cria produtos que transformam a complexidade da vida cotidiana, do trabalho e das comunidades locais em algo que a pessoa consegue entender, escolher e colocar em prática. Com base em Fukuoka, desenvolvemos dois projetos: Mirai Move e Kakari.",

    messageEyebrow: "Mensagem do sócio administrador",
    messageHeading: ["Avaliamos pelo que chega,", "não pelo que é avançado."],
    message: [
      "O que tratamos não é novidade.",
      "Por mais de vinte anos, nos setores automotivo, de mobilidade e de manufatura, estive entre a tecnologia, a implementação e a realidade comercial. A mesma cena se repetia: um sistema bem construído parava antes de chegar a quem precisava dele. Não por falta de tecnologia, mas porque nunca havia sido traduzido para os passos que aquela pessoa realmente dá.",
      "Instituições e opções já existem em grande número. Mas, se a pessoa não consegue saber se aquilo lhe diz respeito nem o que fazer a seguir, é o mesmo que não existirem. Encurtar essa última distância — fazer com que o sistema a absorva, em vez de entregá-la ao indivíduo — é a razão pela qual a Yorisou existe.",
      "Não usamos a IA para decidir no lugar das pessoas. Usamos para ler a situação, organizá-la como um conjunto de relações e apresentá-la de forma utilizável, para que a pessoa possa decidir. A decisão e a responsabilidade permanecem com a pessoa. O que assumimos e o ponto em que passamos para um profissional habilitado estão escritos na própria tela.",
      "Ainda somos uma empresa pequena e não há muito que possamos afirmar. É justamente por isso que escrevemos apenas o que podemos verificar. O que deve crescer não é a afirmação, mas o registro daquilo que de fato chegou.",
    ],
    messageSignature: "Jin Yang",
    messageRole: "Sócio administrador, Yorisou LLC",

    profileEyebrow: "Representante",
    profileHeading: ["Sobre o sócio administrador"],
    profileName: "Jin Yang",
    profileNameLatin: "Jin Yang / Edward Jin",
    profileRole: "Sócio administrador, Yorisou LLC",
    profileBody: [
      "Mais de vinte anos de experiência profissional nos setores automotivo, de mobilidade e de manufatura, em desenvolvimento de projetos industriais, cadeia de suprimentos, desenvolvimento comercial, desenvolvimento de produtos e negócios internacionais entre países.",
    ],
    profileBackgroundLabel: "Trajetória",
    profileBackground: [
      "Assumiu responsabilidades sênior em projetos comerciais e industriais na Ficosa, fornecedora automotiva internacional, com atuação em projetos industriais globais e em atividades comerciais na Ásia.",
      "Em seguida, fundou e conduziu negócios de tecnologia e manufatura na China, com trabalhos em eletrônica automotiva, sistemas de controle, manufatura de precisão e desenvolvimento de produtos e sistemas com uso de IA.",
      "Atuou em diversos mercados, entre eles Europa, China e Japão.",
      "Atualmente é sócio administrador da Yorisou LLC no Japão e conduz a construção da empresa a partir de Fukuoka.",
    ],
    profileEducationLabel: "Formação",
    profileEducation: [
      "MBA, IESE Business School",
      "General Management Program, Harvard Business School Executive Education",
    ],
    profileRelevanceLabel: "Por que essa trajetória importa aqui",
    profileRelevance: [
      "Longa experiência prática em setores complexos do mundo real.",
      "A posição de quem conecta tecnologia, manufatura, execução comercial e mercados internacionais.",
      "Contato direto com a distância entre o que um sistema consegue fazer e o que uma pessoa ou uma organização consegue de fato usar.",
      "E, por consequência, a razão para criar produtos que transformam a complexidade em algo compreensível e acionável.",
    ],

    overviewEyebrow: "Perfil corporativo",
    overviewHeading: ["Perfil corporativo"],
    facts: [
      { label: "Razão social", value: "Yorisou LLC (Yorisou GK)" },
      { label: "Sócio administrador", value: "Jin Yang" },
      { label: "Localização", value: "Cidade de Fukuoka, província de Fukuoka, Japão" },
      { label: "Atividade", value: "Planejamento, desenvolvimento e operação do Mirai Move e do Kakari" },
    ],

    businessEyebrow: "Áreas de atuação",
    businessHeading: ["Áreas de atuação"],
    businessBody: "Informação, conexão e desenvolvimento de negócios no setor de mobilidade; e suporte multilíngue para procedimentos administrativos e documentos, para quem vive no Japão e para quem vai abrir um negócio aqui. Ambos seguem o mesmo princípio: assumir a complexidade e devolver algo utilizável.",

    projectsEyebrow: "Projetos",
    projectsHeading: ["O que estamos construindo"],

    originEyebrow: "Onde estamos",
    originHeading: ["Começando por Fukuoka."],
    originBody: [
      "A Yorisou LLC está construindo a empresa a partir da cidade de Fukuoka, no Japão.",
      "É um lugar onde vida cotidiana, trabalho e comunidade estão próximos — e onde o projeto pode começar pelos passos que as pessoas realmente dão.",
    ],

    ctaHeading: ["Contato"],
    ctaBody: "Recebemos consultas sobre nosso trabalho, propostas de parceria e pedidos de imprensa.",
  },

  contact: {
    eyebrow: "Contato",
    heading: ["Contato"],
    lead: "Recebemos consultas sobre nosso trabalho, propostas de parceria e pedidos de imprensa. Respondemos conforme o conteúdo de cada mensagem.",
    channelsHeading: ["Sobre o que você pode falar conosco"],
    channels: [
      { title: "Consultas gerais", body: "Perguntas sobre a Yorisou como empresa e sobre os projetos que desenvolvemos." },
      { title: "Negócios e parcerias", body: "Colaborações ou conversas comerciais nas áreas de mobilidade e de procedimentos administrativos." },
      { title: "Imprensa e mídia", body: "Pedidos de entrevista e perguntas sobre a empresa ou sobre seu representante." },
    ],
    formHeading: ["Envie uma mensagem"],
    formIntro: "Use o formulário abaixo. Lemos todas as mensagens e respondemos conforme o conteúdo.",
    fields: {
      name: "Nome", namePlaceholder: "Seu nome",
      email: "E-mail", emailPlaceholder: "voce@exemplo.com",
      org: "Empresa ou organização", orgPlaceholder: "Opcional",
      type: "Tipo de contato",
      message: "Mensagem", messagePlaceholder: "Conte o contexto e o que gostaria de confirmar.",
    },
    types: [
      { value: "general", label: "Consulta geral" },
      { value: "business", label: "Negócios e parcerias" },
      { value: "media", label: "Imprensa e mídia" },
    ],
    submit: "Enviar",
    sending: "Enviando…",
    successTitle: "Mensagem enviada",
    successBody: "Recebemos sua mensagem. Vamos analisá-la e responder em seguida.",
    errorTitle: "Não foi possível enviar",
    errorBody: "Aguarde um momento e tente novamente.",
    required: "Obrigatório",
    privacyNote: "Os dados pessoais fornecidos são usados apenas para responder à sua mensagem.",
  },
};
