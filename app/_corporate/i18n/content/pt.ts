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
    footerTagline: "As pessoas e a tecnologia constroem o futuro.",
    footerProjects: "Projetos",
    footerCompany: "Empresa",
    footerLegalNote: "Os fatos publicados aqui baseiam-se em registros que pudemos verificar.",
    backToTop: "Voltar ao topo",
  },

  meta: {
    home: { title: "Yorisou LLC — Transformar problemas estruturais em negócios.", description: "A Yorisou LLC atua como foundry: encontra problemas estruturais, constrói evidência e ativos de negócio e forma equipes fundadoras para colocá-los de pé como negócio. Mirai Move e Kakari estão em construção; Chigamo está em fase de conceito." },
    miraiMove: { title: "Mirai Move — Yorisou LLC", description: "Uma plataforma de informação, conexão e desenvolvimento de negócios no setor de mobilidade do Japão. O site público está no ar; as funcionalidades da plataforma estão em desenvolvimento." },
    kakari: { title: "Kakari — Yorisou LLC", description: "Suporte multilíngue para procedimentos administrativos e documentos, para quem vive no Japão e para quem vai abrir um negócio aqui. Em desenvolvimento, ainda não disponível ao público." },
    about: { title: "Como construímos — Yorisou LLC", description: "Encontrar o problema, verificar, desenhar o negócio, formar a equipe fundadora e colocá-lo de pé. Como funciona o processo de foundry da Yorisou, que formas um projeto pode tomar e onde se situa a infraestrutura compartilhada." },
    company: { title: "A empresa — Yorisou LLC", description: "Perfil corporativo, perfil do sócio administrador, mensagem do sócio administrador e áreas de atuação da Yorisou LLC." },
    contact: { title: "Contato — Yorisou LLC", description: "Canal para consultas sobre nosso trabalho, parcerias e imprensa." },
    ventures: { title: "Projetos — Yorisou LLC", description: "O que a Yorisou desenvolve hoje: Mirai Move, Kakari e Chigamo. Cada um está em um estágio diferente, e dizemos qual." },
    buildWithUs: { title: "Construir junto — Yorisou LLC", description: "Formas de entrada para fundadores, pesquisadores, órgãos públicos e empresas. Não há programa de candidaturas aberto; começamos por uma conversa." },
    chigamo: { title: "Chigamo — Yorisou LLC", description: "Um conceito para tornar visível, a partir de posição e contexto, o que de fato é útil em um lugar. Está em estágio conceitual; não há produto disponível ao público." },
  },

  common: {
    buildingLabel: "em construção",
    conceptLabel: "em conceito",
    readMore: (name) => `Saiba mais sobre ${name}`,
    backHome: "Voltar à página da empresa",
    stageLabel: "Estágio atual",
    boundaryLabel: "O que não assumimos",
    nowLabel: "Agora",
    nextLabel: "Próximo passo",
    whoLabel: "Com quem queremos falar",
  },

  home: {
    eyebrow: "Yorisou LLC",
    hook: ["Problemas estruturais,", "transformados em empresas."],
    thesis: ["A partir de problemas estruturais,", "construímos negócios", "e os fazemos crescer."],
    lead: ["A Yorisou é uma foundry: encontramos problemas estruturais na sociedade, verificamos cada um,", "desenhamos como negócio e nos juntamos a quem vai conduzi-lo, para colocá-lo de pé."],
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

    buildHeading: ["Áreas onde o sistema não chega —", "assumidas uma de cada vez."],

    howEyebrow: "Como construímos",
    howHeading: ["Assumimos a complexidade", "e a transformamos em algo utilizável."],
    howBeats: [
      { no: "01", title: "Começar pela linguagem de quem está no dia a dia", body: "Não partimos da tecnologia. Projetamos a partir dos passos reais de quem está travado." },
      { no: "02", title: "Responder até o ponto da compreensão", body: "Apresentar a informação não é o fim. Saber o que fazer a seguir faz parte do escopo do projeto." },
      { no: "03", title: "Explicitar o limite", body: "Não entramos no que cabe a um profissional habilitado. Até onde vamos e a partir de onde passamos adiante está escrito dentro do próprio produto." },
      { no: "04", title: "Dizer apenas o que pode ser verificado", body: "Resultados, números e parcerias só aparecem quando há evidência. O que não pode ser confirmado não é escrito." },
    ],

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

    /* CORP-v1.2 — camada Asterion e camada de engajamento na página inicial. */
    asterionEyebrow: "Infraestrutura compartilhada",
    asterionBody:
      "O Asterion OS é um projeto independente de plataforma tecnológica. Quando não é preciso refazer os mesmos mecanismos vez após vez, cada projeto pode concentrar o esforço naquilo que é próprio dele.",
    asterionNote:
      "Cada projeto é governado separadamente. Onde residem a propriedade intelectual, os dados e a responsabilidade operacional — e que direitos existem sobre o Asterion — é definido pelos acordos aplicáveis em cada caso.",
    /* CORP-v1.4 — como a Yorisou segue ligada ao que constrói. Condicional, nunca prometido. */
    portfolioEyebrow: "Nossa relação com os projetos",
    portfolioHeading: ["Construí-lo", "não é o fim."],
    portfolioBody:
      "Depois de colocar um projeto de pé, a relação da Yorisou com o valor dele a longo prazo pode continuar: mantendo uma participação no capital, por meio de uma licença ou conduzindo-o em conjunto. O projeto também pode ser separado como empresa, ou vir a ser cedido ou vendido.",
    portfolioBranches: ["Operado dentro da Yorisou", "Cofundado e operado em conjunto", "Participação", "Licença", "Empresa separada", "Transferência ou venda"],
    portfolioNote:
      "A forma que isso toma depende da maturidade do projeto, de quem participa, do mercado, do capital e do acordo alcançado em cada caso. Não há condições fixadas de antemão.",
    engageEyebrow: "Construir junto",
    engageHeading: ["Entre enquanto ainda", "está virando empresa."],
    engageBody:
      "Fundadores, pesquisadores, órgãos públicos, empresas. Por onde se entra depende de onde você está. Começamos pelo que já dá para conversar.",
    engageCta: "Ver as formas de entrada",
    engageNote: "Todas começam por uma conversa. Ainda não há processo de candidatura nem seleção.",
  },

  mirai: {
    reading: "Levar a mobilidade de uma região até a solução.",
    now: "O site público está no ar, e o sistema que lê continuamente fontes públicas também roda sozinho. Mas nada saiu daqui para ninguém — nenhuma vez.",
    next: "No primeiro caso concreto, restam pontos que não se resolvem sem verificar do lado de fora. Daqui em diante é a vez de uma pessoa se mover.",
    who: "Quem conhece por dentro o deslocamento em uma região — município, operador de transporte ou o próprio campo — e consegue descrever as restrições reais.",
    join: {
      title: "Trabalhar neste projeto",
      body: "O que falta agora é alguém que consiga descrever as restrições de forma concreta. Este é o estágio de verificar, não o de vender.",
      roles: [
        "Você atua no transporte ou na mobilidade de uma região — município, operador ou o próprio campo",
        "Você poderia carregar esta área como fundador ou operador",
        "Você conhece como a operação de fato funciona",
      ],
      state: "Estamos no estágio de querer ouvir. Não há vaga aberta.",
    },
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
    reading: "Para que os trâmites no Japão possam ser feitos pela própria pessoa.",
    now: "Estágio de teste fechado. Não está disponível ao público e ninguém o utiliza ainda.",
    next: "Os trâmites necessários para a distribuição e a definição dos dados de registro da empresa. Os dois dependem de confirmação externa.",
    who: "Pessoas estrangeiras que vivem no Japão, quem as apoia e profissionais habilitados.",
    join: {
      title: "Trabalhar neste projeto",
      body: "Queremos que quem conhece a realidade desses trâmites veja isto primeiro. Não é uma ferramenta para substituir profissionais habilitados.",
      roles: [
        "Você já passou de fato por dificuldades com um procedimento no Japão",
        "Você apoia, de alguma forma, pessoas estrangeiras que vivem no Japão",
        "Você é profissional habilitado e pode ajudar a verificar onde fica o limite",
        "Você poderia carregar este projeto como fundador ou operador",
      ],
      state: "Procuramos pessoas para mostrar. Nada foi publicado e nada está aberto.",
    },
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
    orderHeading: ["Um de cada vez,", "até o fim."],
    orderBody: "Não iniciamos muitas coisas ao mesmo tempo. Preferimos levar uma área até o ponto em que ela alcança os passos que as pessoas realmente dão.",
    claimsHeading: ["Não escrevemos", "o que não podemos verificar."],
    claimsBody: "Todo fato que publicamos tem um registro por trás. Nos períodos em que há pouco a dizer, publicamos pouco.",
  },

  company: {
    eyebrow: "A empresa",
    heading: ["Yorisou LLC"],
    intro: "A Yorisou LLC é uma foundry: encontra problemas estruturais, desenha-os como negócio e os coloca de pé junto a quem pode conduzi-los. Com base em Fukuoka, está construindo vários projetos; os atualmente públicos são Mirai Move, Kakari e Chigamo.",

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
      { label: "Número corporativo (hōjin bangō)", value: "2290003018125" },
      { label: "Sócio administrador", value: "Jin Yang" },
      { label: "Localização", value: "Cidade de Fukuoka, província de Fukuoka, Japão" },
      { label: "Atividade", value: "Exploração, planejamento, desenvolvimento e operação de novos projetos; formação de equipes fundadoras; e viabilização de negócios por meio de operação conjunta, licenciamento e acordos semelhantes" },
    ],

    businessEyebrow: "Áreas de atuação",
    businessBody: "No centro da Yorisou está construir os próprios negócios: encontrar um problema estrutural, verificar, desenhar como negócio, construir e colocá-lo de pé junto a quem possa conduzi-lo. Os projetos atualmente públicos são a informação, a conexão e o desenvolvimento de negócios no setor de mobilidade (Mirai Move); o suporte multilíngue para procedimentos administrativos e documentos, para quem vive no Japão e para quem vai abrir um negócio aqui (Kakari); e a descoberta do entorno cotidiano a partir do lugar e do contexto (Chigamo, em fase de conceito). Todos seguem o mesmo princípio: assumir a complexidade e devolver algo utilizável.",

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
    unavailableBody: "Ainda não verificámos o caminho de entrega, por isso não poderíamos garantir que uma mensagem enviada daqui chegasse. O formulário abrirá nesta página assim que isso for confirmado.",
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

  /* ── VENTURES INDEX (CORP-v1.2) ─────────────────────────────────────── */
  ventures: {
    eyebrow: "Projetos",
    publicLabel: "Projetos atualmente públicos",
    publicNote: "A Yorisou está a construir vários projetos. Estes são os atualmente públicos.",
    heading: ["Nenhum deles se sustenta", "ainda como empresa."],
    lead:
      "Em todas elas, as instituições e os sistemas já existem — e param pouco antes de chegar a quem precisa. A Yorisou entra nesse intervalo e vai dando forma enquanto verifica.",
    cards: [
      {
        name: "Mirai Move",
        href: "/mirai-move",
        thesis: "Reunir informação, conexão e desenvolvimento de negócios no setor de mobilidade.",
        problem: "Entre operadores, regiões e governo, informação e oportunidade estão separadas.",
        building: "Uma plataforma em que partes do Japão e de fora trabalhem sobre a mesma informação.",
      },
      {
        name: "Kakari",
        href: "/kakari",
        thesis: "Apoiar em vários idiomas os procedimentos de quem vive no Japão e de quem abre um negócio aqui.",
        problem: "Os sistemas existem, mas a língua e a sequência de passos impedem que sejam usados.",
        building: "Uma forma de dividir o procedimento em etapas e mostrar até onde se consegue ir sozinho.",
      },
      {
        name: "Chigamo",
        href: "/chigamo",
        thesis: "Fazer com que se entenda um lugar a partir de posição e contexto.",
        problem: "A informação que mais ajudaria ali é justamente a mais difícil de encontrar.",
        building: "Uma forma de descobrir o entorno, apoiada em posição e contexto.",
      },
    ],
    /* CORP-v1.4 — separa o que é verdade hoje do que pode vir depois. */
    structureHeading: ["O que é verdade hoje", "e o que pode vir depois."],
    structureBody: [
      "Os estágios indicados acima são a situação atual. Escrevemos apenas o que já aconteceu.",
      "A forma que cada um vai tomar daqui em diante não está decidida. Um projeto pode continuar sendo operado dentro da Yorisou, receber de fora uma equipe de operação, passar a ser detido em conjunto ou ser separado como empresa. Também pode tomar a forma de uma licença, ou vir a ser cedido ou vendido.",
      "Qual delas se aplica depende da maturidade do projeto, de quem participa, do mercado, do capital e do acordo. O que está escrito aqui são formas possíveis: não é um plano nem uma promessa.",
    ],
    noteHeading: ["O que esta página diz", "e o que não diz."],
    noteBody: [
      "Estes são os projetos e os conceitos em que a Yorisou trabalha hoje.",
      "Não são subsidiárias constituídas, não são investimentos e não são clientes. Estão em estágios diferentes, e escrevemos o estágio como ele é.",
      "O que está escrito aqui é o que hoje é verdade. Que forma cada um vai tomar daqui em diante ainda não está decidido.",
    ],
  },

  /* ── CHIGAMO (CORP-v1.2) ────────────────────────────────────────────── */
  chigamo: {
    reading: "Entender um lugar, estando nele.",
    now: "Estágio conceitual. Não há produto disponível ao público, não há usuários e não há nenhum programa com municípios.",
    next: "Se filtrar por posição e contexto torna a informação realmente utilizável. É isso que queremos testar primeiro, em pequena escala.",
    who: "Quem conhece de verdade um lugar específico e consegue dizer onde a informação do entorno cotidiano deixa de ser útil.",
    join: {
      title: "Trabalhar neste projeto",
      body: "Isto ainda está antes da fase de verificação. Por isso procuramos menos gente para construir junto e mais gente que derrube a hipótese.",
      roles: [
        "Você conhece em detalhe uma região específica, por morar nela",
        "Você já trabalhou com dados de posição ou dados regionais",
        "Você não se incomoda em participar enquanto isto ainda é um conceito",
      ],
      state: "Estágio conceitual. Ainda não está definido o que significaria participar.",
    },
    eyebrow: "Projeto",
    heading: ["Entender um lugar,", "estando nele."],
    stage: "Estágio conceitual",
    lead:
      "Um conceito: usar posição e contexto para trazer à tona o que é de fato útil em determinado lugar. Ainda está antes da fase de verificação.",
    domain: "Entorno cotidiano / posição e contexto / descoberta",
    conceptEyebrow: "O que estamos pensando",
    conceptHeading: ["Não falta informação.", "Ela é que não chega."],
    conceptBody: [
      "O que mais se quer saber sobre um lugar é justamente o que a busca devolve pior. Não porque a informação não exista, mas porque ela nunca foi organizada em relação ao lugar e à situação.",
      "Onde a pessoa está, em que momento e diante de qual situação. Há informação que só se torna reconhecivelmente sua quando essas três coisas coincidem. É disso que o Chigamo tenta tratar.",
    ],
    boundaryTitle: "Em que ponto isto está",
    boundaryBody:
      "O Chigamo está em estágio conceitual. Não há produto disponível ao público, não há usuários e não há nenhum programa com municípios. O que está escrito aqui é uma hipótese que pretendemos verificar.",
    detail: [
      {
        heading: "Por que agora",
        body: "Mapas e busca já amadureceram. Ainda assim, “o que faz sentido para mim, no lugar onde estou” continua sendo algo que cada pessoa levanta por conta própria.",
      },
      {
        heading: "O que precisamos verificar",
        body: "Se filtrar por posição e contexto torna a informação realmente utilizável. É isso que queremos testar primeiro, em pequena escala.",
      },
    ],
  },

  /* ── HOW WE BUILD / FOUNDRY (CORP-v1.2) ─────────────────────────────── */
  foundry: {
    eyebrow: "Como construímos",
    heading: ["Do problema até a empresa,", "na ordem."],
    lead:
      "Não começamos por uma ideia que nos agradou. Encontramos um problema estrutural, verificamos, desenhamos como negócio, nos juntamos a quem pode conduzi-lo e o levamos até o ponto em que se sustenta como negócio. A Yorisou chama essa sequência de foundry.",
    stagesEyebrow: "Etapas",
    stagesHeading: ["Oito etapas,", "sem pular nenhuma."],
    stages: [
      { no: "01", name: "Hipótese", body: "Definir onde está o problema estrutural — a partir da forma do trabalho real, não de um palpite." },
      { no: "02", name: "Evidência", body: "Verificar se o problema existe mesmo e sobre quem ele recai. Muitas hipóteses morrem aqui." },
      { no: "03", name: "Desenho do negócio", body: "Transformar a resposta em negócio: quem usa e onde o valor é de fato trocado." },
      { no: "04", name: "Construção", body: "Construir. Usar o terreno comum onde ele existe e concentrar o esforço no que é específico deste projeto." },
      { no: "05", name: "Pronto para operar", body: "Deixar os ativos e os procedimentos em um estado em que alguém de fora consiga assumir e conduzir." },
      { no: "06", name: "Formação da equipe fundadora", body: "Juntar-se a quem consegue carregar o projeto como seu — como fundador, não como empregado." },
      { no: "07", name: "Independência e operação", body: "Deixá-lo em um estado em que funcione pela própria força. Pode ser separado como empresa, pode continuar sendo operado dentro da Yorisou ou pode passar a ser detido em conjunto." },
      { no: "08", name: "Aprendizado", body: "Guardar o que funcionou e o que morreu como material para o próximo projeto. A relação com o projeto não termina necessariamente aqui." },
    ],
    independenceHeading: ["Um projeto pode tomar", "mais de uma forma."],
    independenceBody: [
      "Sustentar-se como empresa independente é uma das formas a que aspiramos. Mas chegar até lá não significa que a relação com a Yorisou termine aí.",
      "Alguns projetos continuam sendo operados dentro da Yorisou. Outros recebem de fora um fundador ou uma equipe de operação e passam a ser detidos em conjunto; outros são separados como empresa, tomam a forma de uma licença, ou vêm a ser cedidos ou vendidos.",
      "A forma que toma depende da maturidade do projeto, de quem participa, do mercado, do capital e do acordo alcançado em cada projeto. Não há nenhum modelo fixado de antemão.",
      "Só há uma constante: construímos desde o início de um jeito que possa ser transferido. Se quem conduz não pode tomar as decisões de verdade, aquilo não se sustenta como negócio.",
    ],
    asterionEyebrow: "Tecnologia e execução compartilhadas",
    asterionHeading: ["Não construir", "a mesma coisa duas vezes."],
    asterionBody: [
      "O Asterion OS é um projeto independente de plataforma tecnológica. Não é um dos projetos da Yorisou apresentados neste site corporativo.",
      "Os projetos da Yorisou podem vir a usar recursos do Asterion quando isso for adequado. A propriedade, o licenciamento, os direitos sobre os dados e a responsabilidade operacional são definidos pelos acordos aplicáveis em cada caso.",
      "Quando se pode usar uma base comum, nenhum projeto precisa refazer os mesmos mecanismos e cada um pode se concentrar no próprio domínio. A capacidade que se acumula vira o ponto de partida do projeto seguinte.",
    ],
    asterionBoundaryTitle: "O limite",
    asterionBoundaryBody:
      "Cada projeto é governado separadamente. Onde residem a propriedade intelectual, os dados e a responsabilidade operacional é fixado no acordo de cada projeto. Nada é desenhado para que dados de um projeto ou de seus usuários fluam automaticamente para a plataforma.",
    economicsHeading: ["A participação segue", "a contribuição e a responsabilidade."],
    economicsBody: [
      "As condições variam de projeto para projeto. Não aplicamos uma fórmula fixa a tudo.",
      "Só o princípio é comum: a participação segue a contribuição, o risco assumido e a responsabilidade que continua. Quem conduz um projeto tem poder real de decisão.",
      "A própria Yorisou pode seguir ligada ao valor de longo prazo de um projeto: mantendo uma participação no capital, por meio de uma licença ou conduzindo-o em conjunto. Qual dessas formas se aplica depende de quanto ela assumiu naquele projeto e de quanto risco correu.",
      "Por ora não há condições que possamos prometer. Nem a participação nem a forma de qualquer direito estão decididas antes de um acordo.",
      "Os detalhes são conversados caso a caso, com cada projeto e cada pessoa. Não são o tipo de coisa que cabe em um site.",
    ],
    maturityTitle: "Em que ponto isto está",
    maturityBody:
      "Esta forma de trabalhar não é um método comprovado nem repetível. A Yorisou está em estágio inicial e ainda não levou nenhum projeto até uma empresa independente. O que está escrito aqui é como de fato procedemos — não é uma afirmação sobre resultados.",
  },

  /* ── BUILD WITH US (CORP-v1.2) ──────────────────────────────────────── */
  buildWithUs: {
    eyebrow: "Construir junto",
    heading: ["A porta de entrada muda", "conforme a sua posição."],
    lead:
      "A Yorisou leva cada projeto até pouco antes de ele se sustentar sozinho e então se junta a quem consegue carregá-lo. Por isso não procuramos gente para empregar, mas pessoas e organizações que assumam o projeto.",
    /* CORP-v1.4 — a forma de cada participação é desenhada por projeto, e em nenhum é prometida de antemão. */
    structureHeading: ["A forma de participar", "é desenhada em cada projeto."],
    structureBody: [
      "Não se trata de encaixar em um molde fixo. Cofundação, equipe fundadora, participação no projeto, licença, operação conjunta, separação como empresa: qual se aplica depende do projeto e da parte que você assume.",
      "Seja qual for a forma, a governança, a propriedade intelectual, o papel, a responsabilidade e as condições econômicas são fixados em um acordo à parte. Aqui não há condições que possamos prometer de antemão.",
    ],
    lanes: [
      {
        key: "founders",
        label: "Fundadores",
        title: "Fundadores e cofundadores",
        body:
          "Assumir como seu um projeto que já foi levado até pouco antes de virar empresa. Você entra como fundador, não como contratado — as decisões ficam com você, e a responsabilidade também.",
        invites: [
          "Você já conduziu de verdade algo com operação real por trás",
          "Você consegue avançar enquanto muita coisa ainda está indefinida",
          "Você conhece de perto ao menos uma destas áreas: tecnologia, manufatura, administração pública ou trabalho comunitário",
        ],
        offers: "Pesquisa e evidência, um produto inicial, o desenho do negócio e a infraestrutura compartilhada. Você começa no meio do caminho, não do zero.",
        cannot: "Não podemos prometer salário, captação de recursos nem condições de participação neste momento. As condições são conversadas projeto a projeto.",
        ventures: ["Mirai Move", "Kakari", "Chigamo"],
        state: "Estamos no estágio de querer ouvir. Não há vaga aberta.",
        cta: "Manifestar interesse",
      },
      {
        key: "team",
        label: "Equipe fundadora",
        title: "Equipe fundadora e especialistas",
        body:
          "Um fundador sozinho nunca basta. Procuramos quem assuma desde cedo uma das partes — engenharia, operação ou o campo.",
        invites: [
          "Você já acompanhou as coisas até a operação, não só até o lançamento",
          "Você já colocou algo de pé com uma equipe pequena",
          "Você sabe o que é o básico na sua área",
        ],
        offers: "Um lugar desde o começo e autonomia real sobre a parte que você assume.",
        cannot: "Não existe um processo de contratação permanente. Não podemos dizer que estamos em condições de contratar agora.",
        ventures: ["Mirai Move", "Kakari"],
        state: "Depende do estágio de cada projeto. Conte primeiro o que você poderia assumir.",
        cta: "Começar uma conversa",
      },
      {
        key: "users",
        label: "Primeiros usuários",
        title: "Primeiros usuários e quem testa junto",
        body:
          "Queremos que as pessoas olhem o que construímos da posição de quem realmente usa — não para ouvir elogio, mas para saber onde aquilo trava.",
        invites: [
          "Você já passou de fato por dificuldades com este problema",
          "Você consegue dizer com clareza o que não funcionou",
          "Você não se incomoda em ver algo antes de ser público",
        ],
        offers: "Ver algo em construção, e o que você disser volta para o desenho.",
        cannot: "Não podemos prometer data de lançamento, nem que o seu pedido entre, nem pagamento.",
        ventures: ["Kakari", "Mirai Move"],
        state: "Procuramos pessoas para mostrar. Não é um programa formal.",
        cta: "Manifestar interesse",
      },
      {
        key: "research",
        label: "Universidades",
        title: "Universidades e pesquisa",
        body:
          "Transformar pesquisa em algo que a sociedade consiga usar exige também desenho de negócio. Procuramos pessoas para pensar junto a formação de fundadores e a implementação de pesquisa.",
        invites: [
          "Você procura onde a pesquisa pode aterrissar",
          "Você quer que estudantes e pesquisadores tenham experiência real de fundação",
          "Você prefere começar por uma exploração conjunta",
        ],
        offers: "O desenho do lado do negócio e trabalho que está de fato em andamento. Dá para começar por uma exploração.",
        cannot: "Não há convênio de pesquisa, não há financiamento e não há nenhuma colaboração formal.",
        ventures: ["Mirai Move", "Chigamo"],
        state: "Não temos histórico de parcerias. Começa por uma conversa.",
        cta: "Começar uma conversa",
      },
      {
        key: "public",
        label: "Setor público",
        title: "Governo e setor público",
        body:
          "As regras existem, mas nunca foram traduzidas em passos que o cidadão consiga seguir. Queremos desenhar junto o teste pequeno, a medição e o caminho até algo que se sustente.",
        invites: [
          "Você tem um problema que dá para testar em campo",
          "Você quer um formato em que o efeito possa ser medido",
          "Você não quer que termine como um piloto isolado",
        ],
        offers: "Pesquisa, evidência organizada em um formato utilizável e um desenho para testar em pequena escala.",
        cannot: "Não temos histórico de trabalho com nenhum município e não podemos oferecer nenhuma garantia de ordem administrativa.",
        ventures: ["Mirai Move", "Kakari"],
        state: "Começa por uma conversa. Não há nada em andamento.",
        cta: "Fale conosco",
      },
      {
        key: "corporate",
        label: "Empresas",
        title: "Empresas",
        body:
          "Se há um problema na sua própria operação que deveria virar um negócio, podemos começar por desenvolvimento conjunto ou por um teste em campo.",
        invites: [
          "Há um problema operacional não resolvido no seu dia a dia",
          "Você procura o formato de um novo negócio",
          "Você procura um parceiro de desenvolvimento",
        ],
        offers: "Redesenhar o problema como negócio, desde o início.",
        cannot: "Não temos histórico comercial nem casos de implantação para mostrar.",
        ventures: ["Mirai Move", "Kakari", "Chigamo"],
        state: "Começa por ouvir.",
        cta: "Entrar em contato",
      },
    ],
    intakeTitle: "Sobre a entrada",
    intakeBody:
      "No momento não há processo de candidatura nem programa de seleção. O que está aqui é um convite, não uma parceria em andamento nem uma vaga aberta. Começamos ouvindo o que você tem e vendo se há algo a conversar.",
    foundingTeamEyebrow: "Equipe fundadora",
    foundingTeamHeading: ["Começamos a construir", "antes de existir uma empresa."],
    foundingTeamBody: [
      "Normalmente um projeto começa depois que as pessoas se reúnem. A Yorisou faz o caminho inverso: primeiro a pesquisa e a evidência, o produto inicial e o desenho do negócio; só depois procuramos quem vai assumir.",
      "Por isso ninguém começa de uma página em branco. Você começa pegando algo que já tem forma e tornando aquilo seu.",
      "O que não muda é o sentido de assumir. Quem tem as decisões tem a responsabilidade. Se quem conduz não pode decidir de verdade, aquilo não virou uma empresa.",
    ],
    ctaHeading: ["Seja qual for a posição,", "a porta de entrada é a mesma."],
    ctaBody: "Escreva o que tem em mente e envie. Lemos na ordem em que chegam.",
  },
};
