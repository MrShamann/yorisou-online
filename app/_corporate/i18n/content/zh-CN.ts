import type { SiteCopy } from "../types";

/**
 * CORP-P5R2 — SIMPLIFIED CHINESE. Translated from the Japanese canonical source (ja.ts),
 * structured against the reviewed English sibling (en.ts).
 *
 * This is an adapted sibling, not a literal rendering: it is written to read as natural
 * Simplified Chinese corporate copy. It may never be stronger than the Japanese. No customer,
 * partner, metric, revenue, funding, market-position, team-size or capability claim appears here
 * that the Japanese does not already make.
 *
 * On the company form: Yorisou is a Japanese 合同会社 (LLC). It is rendered as 有限责任公司 and never
 * as a joint-stock company; the representative is 代表, never a 株式会社-style corporate officer title.
 *
 * On Asterion OS: it is an INDEPENDENT shared technology and execution platform. It is not owned
 * by Yorisou, is not a Yorisou venture, and nothing here may say or imply otherwise. The boundary
 * sentence about separate governance, IP, data and operating responsibility must stay intact.
 *
 * On the ventures: Mirai Move, Kakari and Chigamo are ventures and concepts, never subsidiaries,
 * portfolio companies, investments or clients. Chigamo is at concept stage — no product, no users,
 * no municipal programme.
 *
 * On the representative: "Harvard Business School Executive Education" and its General Management
 * Program are stated precisely. It is NOT a Harvard degree and NOT an HBS MBA, and must never be
 * shortened in a way that implies either. No endorsement by IESE, Harvard, Ficosa, or any
 * government body is implied.
 */
export const zh_CN: SiteCopy = {
  chrome: {
    skip: "跳到正文",
    menu: "菜单",
    menuToggle: "打开或关闭菜单",
    close: "关闭",
    navLabel: "站点导航",
    navLabelMobile: "站点导航（移动端）",
    langLabel: "显示语言",
    langHeading: "选择语言",
    langSearch: "搜索语言",
    langCurrent: "当前语言",
    previewBadge: "Preview — 未公开",
    nav: { home: "首页", miraiMove: "Mirai Move", kakari: "Kakari", about: "关于我们", company: "公司信息", contact: "联系我们" },
    footerTagline: "把结构性问题，做成公司。",
    footerProjects: "业务",
    footerCompany: "公司",
    footerLegalNote: "本站所载事实，均以可核实的记录为依据。",
    backToTop: "返回页首",
  },

  meta: {
    home: { title: "Yorisou 有限责任公司 — 从结构性问题，做出能够独立存在的公司。", description: "Yorisou 有限责任公司是一家创业工场：发现结构性问题，积累证据与事业资产，并与创始团队一起把它带成独立的公司。目前正在推进 Mirai Move、Kakari 与 Chigamo。" },
    miraiMove: { title: "Mirai Move — Yorisou 有限责任公司", description: "面向日本出行领域的信息、对接与业务开发平台。公开网站已在运行，平台功能仍处于开发阶段。" },
    kakari: { title: "Kakari — Yorisou 有限责任公司", description: "面向在日本生活的人与在日本创业的人，提供多语言的行政手续与文书支持。目前处于开发阶段，尚未面向公众开放。" },
    about: { title: "我们如何构建 — Yorisou 有限责任公司", description: "发现问题、加以确认、设计成一项事业，再与创始团队一起把它带向独立的公司。Yorisou 创业工场的推进方式，以及共通基础所处的位置。" },
    company: { title: "公司信息 — Yorisou 有限责任公司", description: "Yorisou 有限责任公司的公司概要、代表人简介、代表致辞与业务领域。" },
    contact: { title: "联系我们 — Yorisou 有限责任公司", description: "关于业务、合作与采访的咨询窗口。" },
    ventures: { title: "业务 — Yorisou 有限责任公司", description: "Yorisou 目前正在推进的事业与构想：Mirai Move、Kakari、Chigamo。各自所处的阶段并不相同，我们如实写明。" },
    buildWithUs: { title: "一起构建 — Yorisou 有限责任公司", description: "面向创业者、研究者、行政机构与企业的入口。目前没有固定的招募名额，我们从可以谈的范围开始。" },
    chigamo: { title: "Chigamo — Yorisou 有限责任公司", description: "从位置与情境出发，让人看清一个地方真正有用的是什么——这是一个构想。目前处于构想阶段，没有已公开的产品。" },
  },

  common: {
    readMore: (name) => `了解 ${name}`,
    backHome: "返回公司首页",
    stageLabel: "当前阶段",
    boundaryLabel: "不承担的范围",
    nowLabel: "现在",
    nextLabel: "下一步",
    whoLabel: "想对话的人",
  },

  home: {
    eyebrow: "Yorisou 有限责任公司",
    hook: ["把结构性问题，", "做成公司。"],
    thesis: ["从结构性的问题出发，", "创建能够独立存在的", "公司。"],
    lead: [
      "Yorisou 是一家创业工场：发现社会中结构性的问题，加以确认，设计成一项事业，",
      "再与运营它的人组队，把它带向独立的公司。",
    ],
    humanSide: "人",
    humanItems: ["生活", "工作", "地区"],
    systemSide: "机制",
    systemItems: ["出行", "行政手续"],
    fieldCaption: "人 — 生活、工作、地区　／　机制 — 出行、行政手续",
    fieldRelation: "关系",

    whyEyebrow: "我们面对的问题",
    whyHeading: ["复杂性无法仅凭", "个人的努力来化解。"],
    whyBeats: [
      { no: "01", title: "“不明白”让人止步于入口。", body: "制度即使存在，若无法抵达，就等于不存在。" },
      { no: "02", title: "走到专业人士面前的路太远。", body: "在真正需要由人来判断之前，还有一段本可以由机制承担的距离。" },
      { no: "03", title: "一线与机制彼此错位。", body: "在出行、福祉与行政的一线，仍有尚未送达的选择。" },
    ],

    buildEyebrow: "我们在做什么",
    buildHeading: ["三个领域，", "正在推进中。"],

    howEyebrow: "我们如何构建",
    howHeading: ["承接复杂，", "把它变成可用的形态。"],
    howBeats: [
      { no: "01", title: "从一线的语言出发", body: "我们不从技术出发，而是从真正遇到困难的人的步骤倒推来设计。" },
      { no: "02", title: "把“看懂”纳入责任范围", body: "不以提供信息为终点。让人明白下一步该做什么，也在设计范围之内。" },
      { no: "03", title: "明示边界", body: "我们不进入应由专业人士承担的领域。承担到哪里、从哪里交给人，都写在产品之中。" },
      { no: "04", title: "只说能够验证的事", body: "实绩、数字与合作，只记载有证据的部分。无法确认的事，我们不写。" },
    ],
    howDisclose: "这些原则在实际中意味着什么",

    founderEyebrow: "代表人",
    founderHeading: ["由一个在复杂的一线", "看了二十年的人来构建。"],
    founderTeaser: "在汽车、出行、制造与国际业务的一线工作二十余年，始终站在技术、落地与商流之间。在那里反复看到的，是优秀的机制没能送到使用者手中就停了下来。",
    founderRole: "Yorisou 有限责任公司 代表",
    founderCta: "关于代表人",

    messageEyebrow: "代表致辞",
    messageHeading: ["判断的标准不是技术，", "而是能否送达。"],
    messageTeaser: "我们处理的不是新奇。已经存在的制度与选择，往往在需要它的人面前停下。我们正在建立一家把这段距离逐步缩短的公司。",
    messageCta: "阅读致辞全文",

    originEyebrow: "所在地",
    originHeading: ["从福冈出发。"],
    originBody: "Yorisou 有限责任公司以日本福冈县福冈市为据点推进公司建设。在生活、工作与地区彼此靠近的地方，我们从一线的实际步骤开始设计。",

    proofEyebrow: "公司信息",
    proofHeading: ["能够言明的，", "也仅止于此。"],

    ctaEyebrow: "联系我们",
    ctaHeading: ["或许有可以", "一起推进的空间。"],
    ctaBody: "我们接受业务咨询、合作洽谈与采访申请。将根据内容依次回复。",
    ctaButton: "前往咨询",

    /* CORP-v1.2 — Asterion layer and engagement layer on the homepage. */
    asterionEyebrow: "共享基础设施",
    asterionHeading: ["每构建一次，", "根基就厚一层。"],
    asterionBody:
      "Asterion OS 是一个独立的共享技术与执行平台，在 Yorisou 的创业工场构想中被置于共通的位置。因为不必反复重建同样的机制，每一项事业都可以把力气用在真正属于自己的领域上。",
    asterionNote:
      "各项事业分别独立治理，知识产权、数据与运营责任也各自归属于事业本身。Asterion 并不为 Yorisou 所有。",
    engageEyebrow: "一起构建",
    engageHeading: ["在它成为公司之前，", "就参与进来。"],
    engageBody:
      "创业者、研究者、行政机构、企业。立场不同，能够参与的位置也不同。我们从现在可以谈的范围开始。",
    engageCta: "查看参与方式",
    engageNote: "无论哪一种，现在都从交流开始。我们还没有申请受理，也没有选拔机制。",
    explainerLabel: "30 秒了解 Yorisou",
    explainerHeading: ["从问题到公司，", "只要 30 秒。"],
    explainerClose: "关闭",
    explainerPlay: "播放",
    explainerPause: "暂停",
    explainerRestart: "重新播放",
    explainerStepLabel: "场景",
  },

  mirai: {
    reading: "让地区的出行，一直推动到解决为止。",
    now: "公开网站正在运行，持续读取公开信息的机制也在自动运转。但是，向外部发出的东西，至今一件也没有。",
    next: "在第一个实质性的案例上，还剩下一些不到外面去确认就无法推进的问题。从这里往前，该由人来动了。",
    who: "了解地区出行一线的人。能够站在地方政府或交通运营方的立场，讲清实际约束条件的人。",
    join: {
      title: "参与这项事业",
      body: "现在需要的，是能够具体讲清一线约束条件的人。我们处在去确认的阶段，而不是去推销的阶段。",
      roles: [
        "从事地区交通与出行相关的工作（地方政府、运营方、一线）",
        "能够把这个领域作为事业承担起来的创业者或运营者",
        "了解实际运营方式的专业人才",
      ],
      state: "目前处在希望听人讲的阶段。没有招募名额。",
    },
    eyebrow: "业务 01",
    heading: ["面向日本出行领域的", "信息、对接与", "业务开发平台。"],
    stage: "公开网站运行中／平台功能开发中",
    lead: "Mirai Move 希望连接行政机构与地方政府、企业、护理／福祉／地区一线、海外供应商与日本国内合作方，把与出行相关的信息和机会作为同一条流程来处理。目前公开信息网站已在运行，平台功能仍处于开发阶段。",
    domain: "日本的出行领域",
    networkEyebrow: "连接的对象",
    networkHeading: ["立场不同的各方，", "正用不同的语言", "看着同一个机会。"],
    centre: "出行的机会",
    parties: [
      { no: "01", title: "行政机构与地方政府", body: "制度与预算的一方" },
      { no: "02", title: "企业", body: "供给与落地的一方" },
      { no: "03", title: "地区、护理／福祉一线", body: "出行实际发生的地方" },
      { no: "04", title: "海外供应商／日本国内合作方", body: "带来选择的一方" },
    ],
    boundaryTitle: "关于开发状况",
    boundaryBody: "平台本体仍在开发中。我们没有启用自主智能体的自动执行。凡是涉及对外部产生作用的操作，均以人工确认为前提进行设计。本平台并未作为已完成的全功能平台对外提供。",
    detail: [
      { heading: "面对的问题", body: "出行的选择因地区、因制度、因运营方而分散存在。需要它的人，与已经存在的选择，无法在同一个地方相遇。" },
      { heading: "面向的对象", body: "行政机构与地方政府、企业、护理／福祉／地区一线、海外供应商、日本国内合作方。立场与判断标准各不相同的各方，正用不同的语言看着同一个机会。" },
      { heading: "目前在运行的部分", body: "公开信息网站已在运行。作为平台的信息、对接与业务开发功能，仍处于基础与架构的搭建阶段。" },
    ],
    siteLabel: "公开网站",
    siteUrl: "https://www.miraimove.com",
  },

  kakari: {
    reading: "让日本的手续，能够由自己一步步办下来。",
    now: "处于非公开的测试阶段。尚未面向公众开放，目前还没有人在使用。",
    next: "分发所需的各项手续，以及公司登记信息的确定。两件事都需要外部的确认。",
    who: "在日本生活的外籍人士。处于支援立场的人。以及持有资格的专业人士。",
    join: {
      title: "参与这项事业",
      body: "目前的阶段，是希望先请了解手续实际情况的人来看一看。它不是用来取代专业人士的工具。",
      roles: [
        "在日本办手续时真正遇到过困难",
        "从事对外籍人士的支援工作",
        "作为行政书士等持有资格的专业人士，能够一起确认边界该划在哪里",
        "能够承担这项事业的创业者或运营者",
      ],
      state: "我们正在寻找愿意来看一看的人。既未公开，也未开始招募。",
    },
    eyebrow: "业务 02",
    heading: ["面向在日本生活的人、", "以及在日本创业的人的", "多语言手续支持。"],
    stage: "开发中（尚未面向公众开放）",
    lead: "当日语和专业知识成为障碍，人们就无法抵达本应可以使用的制度。Kakari 以多语言支持必要信息的呈现、材料的准备、表格的填写，以及提交与邮寄步骤的指引。目前处于开发阶段，尚未面向公众开放。",
    domain: "行政手续与文书 ／ 多语言",
    procedureEyebrow: "支持的流程",
    procedureHeading: ["从查清楚，", "到提交完成。"],
    steps: [
      { no: "01", title: "查清楚", body: "确定哪些制度与自己有关" },
      { no: "02", title: "备齐材料", body: "梳理出所需的文件与附件" },
      { no: "03", title: "填写制作", body: "以多语言填写，并确认内容" },
      { no: "04", title: "提交", body: "指引提交对象、提交方式与邮寄步骤" },
    ],
    boundaryTitle: "由专业人士承担的范围",
    boundaryBody: "我们不代理需要资格的专业业务。凡涉及法务、税务与公权判断的领域，均明示为由专业人士承担的范围。需要律师、税理士、行政书士等资格的判断与代理，不包含在 Kakari 的功能之内。",
    detail: [
      { heading: "面对的问题", body: "办理手续的方法本身是公开的。即便如此，仅仅因为语言与背景知识不足，就有人无法抵达制度。这并不是本人能力的问题。" },
      { heading: "面向的对象", body: "在日本生活的人，以及即将在日本创业的人。我们设想的是那些难以独自用日语完成手续的人。" },
      { heading: "目前在运行的部分", body: "我们已在独立的验证环境中搭建认证基础，目前正在验证权限与存储。外部联动仍处于关闭状态，尚未面向公众开放。" },
    ],
  },

  about: {
    eyebrow: "关于我们",
    heading: ["构建的方式，", "本身就是承诺。"],
    lead: "Yorisou 关注生活、工作与地区中的复杂性，打造让人能够理解、选择并向前迈进的产品。",
    whyHeading: ["这家公司为何存在。"],
    whyBody: [
      "制度、技术与选择，早已大量存在。即便如此，它们仍在需要的人面前停下。我们面对的，正是这最后的一段距离。",
      "这段距离常被当作个人努力或信息量的问题来谈论。但实际上，很多时候只是本应由机制承担的复杂性，被原样交到了个人手上。",
    ],
    thinkHeading: ["我们如何思考。"],
    thinkBody: [
      "我们不从技术出发，而是从解开当下卡住的那一步开始思考。读取人的处境，把它整理成关系，并送到能够明白下一步该做什么的状态。这些都属于设计的范围。",
      "AI 用于这样的理解与结构化，而不是用来代替判断。它的作用，是把人在判断时所需的材料，整理成可用的形态。判断与责任留在人这一侧。",
    ],
    buildHeading: ["我们如何构建。"],
    principles: [
      { no: "01", title: "从一线的语言出发", body: "我们不从技术出发，而是从真正遇到困难的人的步骤倒推来设计。" },
      { no: "02", title: "把“看懂”纳入责任范围", body: "不以提供信息为终点。让人明白下一步该做什么，也在设计范围之内。" },
      { no: "03", title: "明示边界", body: "我们不进入应由专业人士承担的领域。承担到哪里、从哪里交给人，都写在产品之中。" },
      { no: "04", title: "只说能够验证的事", body: "实绩、数字与合作，只记载有证据的部分。无法确认的事，我们不写。" },
    ],
    principlesLong: [
      { no: "01", title: "从一线的语言出发", long: "任何制度，如果没有被翻译成使用者的操作步骤，就无法送达。我们从真实的申请、真实的出行、真实的往来开始设计。不做抽象的问题设定，而是从解开眼前卡住的那一步开始思考。" },
      { no: "02", title: "把“看懂”纳入责任范围", long: "罗列检索结果并不是支持。人们需要的，是明白此刻自己该做什么。产品的范围不止于呈现信息，而是延伸到能够理解下一步的状态。" },
      { no: "03", title: "明示边界", long: "把做不到的事含糊带过却让人继续使用，是最危险的设计。我们把自己承担的范围，以及交给专业人士的范围，直接写在产品的界面上。边界不是注意事项，而是功能的一部分。" },
      { no: "04", title: "只说能够验证的事", long: "我们不会提前谈论无法确认的实绩，或尚未运行的功能。所刊载的每一项事实，背后都有可以佐证的记录。在能写的内容还很少的时期，我们就少写。" },
    ],
    orderHeading: ["一件一件，", "做到最后。"],
    orderBody: "我们不会同时启动很多事情。我们优先在一个领域里，一直做到能够触及一线实际步骤为止。",
    claimsHeading: ["无法确认的事，", "我们不写。"],
    claimsBody: "所刊载的每一项事实，背后都有可以佐证的记录。在能写的内容还很少的时期，我们就少写。",
  },

  company: {
    eyebrow: "公司信息",
    heading: ["Yorisou 有限责任公司"],
    intro: "Yorisou 有限责任公司打造的产品，把生活、工作与地区中的复杂性，转化为人能够理解、选择并据以行动的形态。我们以福冈为据点，推进 Mirai Move 与 Kakari 两项业务。",

    messageEyebrow: "代表致辞",
    messageHeading: ["判断的标准不是技术，", "而是能否送达。"],
    message: [
      "我们处理的，不是新奇。",
      "在汽车、出行与制造的一线工作二十余年，我始终站在技术、落地与商流之间。在那里反复看到的，是做得很好的机制，却在送到需要它的人手中之前就停了下来。原因不是技术不够，而是它没有被翻译成使用者的实际步骤。",
      "制度与选择，早已大量存在。但如果人们无法判断“这与我有没有关系”“接下来该做什么”，那就等于不存在。让机制来承担这最后的一段距离——这就是创办 Yorisou 的理由。",
      "我们不用 AI 来代替判断。我们用它读取处境、把信息整理成关系，并整备成可用的形态，让人能够作出判断。判断与责任留在人这一侧。承担到哪里、从哪里交给专业人士，都写在产品的界面上。这就是我们的设计。",
      "公司目前还很小，能写的内容也不多。正因如此，我们只写已经确认的事。应该增加的不是主张，而是真正送达的实绩。",
    ],
    messageSignature: "Jin Yang",
    messageRole: "Yorisou 有限责任公司 代表",

    profileEyebrow: "代表人",
    profileHeading: ["关于代表人"],
    profileName: "Jin Yang",
    profileNameLatin: "Jin Yang / Edward Jin",
    profileRole: "Yorisou 有限责任公司 代表",
    profileBody: [
      "在汽车、出行、制造、产业项目开发、供应链、商务开拓、产品开发，以及跨境国际业务领域，拥有二十余年的实务经验。",
    ],
    profileBackgroundLabel: "经历",
    profileBackground: [
      "曾在国际汽车零部件供应商 Ficosa 承担商务与产业项目的高级职责，参与全球产业项目及亚洲地区的商务工作。",
      "其后在中国创办并经营技术与制造业务，涉及汽车电子、控制系统、精密制造，以及运用 AI 的产品与系统开发。",
      "在包括欧洲、中国与日本在内的多个市场，拥有国际业务运营经验。",
      "现任 Yorisou 有限责任公司代表，以福冈为据点推进公司建设。",
    ],
    profileEducationLabel: "学历",
    profileEducation: [
      "IESE Business School 工商管理硕士（MBA）",
      "Harvard Business School Executive Education，General Management Program 结业",
    ],
    profileRelevanceLabel: "这段经历为何与 Yorisou 相关",
    profileRelevance: [
      "长期横跨复杂的现实产业从事实务工作。",
      "始终处在连接技术、制造、商业执行与国际市场的位置上。",
      "亲眼看到机制与技术，同人与组织实际能够使用的东西之间存在的落差。",
      "由此走向打造把复杂性转化为可理解、可行动形态的产品。",
    ],

    overviewEyebrow: "公司概要",
    overviewHeading: ["公司概要"],
    facts: [
      { label: "名称", value: "Yorisou 有限责任公司（Yorisou LLC）" },
      { label: "法人番号（日本国税厅）", value: "2290003018125" },
      { label: "代表", value: "Jin Yang" },
      { label: "所在地", value: "日本福冈县福冈市" },
      { label: "业务内容", value: "Mirai Move、Kakari 的策划、开发与运营" },
    ],

    businessEyebrow: "业务领域",
    businessHeading: ["业务领域"],
    businessBody: "出行领域的信息、对接与业务开发；以及面向在日本生活的人与在日本创业的人的多语言行政手续与文书支持。两者都遵循同一个方针：承接复杂，交还可用的形态。",

    projectsEyebrow: "业务",
    projectsHeading: ["正在推进的业务"],

    originEyebrow: "所在地",
    originHeading: ["从福冈出发。"],
    originBody: [
      "Yorisou 有限责任公司以日本福冈市为据点推进公司建设。",
      "这里是生活、工作与地区彼此靠近的地方，设计可以从人们实际采取的步骤开始。",
    ],

    ctaHeading: ["联系我们"],
    ctaBody: "我们接受业务咨询、合作洽谈与采访申请。",
  },

  contact: {
    eyebrow: "联系我们",
    heading: ["联系我们"],
    lead: "我们接受业务咨询、合作洽谈与采访申请。将根据内容依次回复。",
    channelsHeading: ["可以咨询的内容"],
    channels: [
      { title: "一般咨询", body: "关于 Yorisou 这家公司，以及我们正在推进的业务的提问。" },
      { title: "业务与合作", body: "在出行领域、行政手续领域的协作或商务洽谈。" },
      { title: "采访与媒体", body: "采访申请，以及关于公司或代表人的咨询。" },
    ],
    formHeading: ["通过表单发送"],
    formIntro: "请通过下方表单发送。我们会确认收到的内容，并依次回复。",
    fields: {
      name: "姓名", namePlaceholder: "您的姓名",
      email: "电子邮箱", emailPlaceholder: "you@example.com",
      org: "公司或团体名称", orgPlaceholder: "选填",
      type: "咨询类型",
      message: "咨询内容", messagePlaceholder: "请写下咨询的背景，以及希望确认的事项。",
    },
    types: [
      { value: "general", label: "一般咨询" },
      { value: "business", label: "业务与合作" },
      { value: "media", label: "采访与媒体" },
    ],
    submit: "发送",
    sending: "发送中…",
    successTitle: "已发送",
    successBody: "我们已收到您的咨询。确认内容后会依次回复。",
    errorTitle: "发送失败",
    errorBody: "请稍后再试一次。",
    required: "必填",
    privacyNote: "您提供的个人信息，仅用于回复本次咨询。",
  },

  /* ── VENTURES INDEX (CORP-v1.2) ─────────────────────────────────────── */
  ventures: {
    eyebrow: "目前的业务",
    heading: ["三个领域，", "都还在成为公司之前的阶段。"],
    lead:
      "它们的共同点是：制度与机制都已经存在，却在真正需要的人面前停下。Yorisou 走进这段空白，一边确认，一边把它做成形。",
    cards: [
      {
        name: "Mirai Move",
        href: "/mirai-move",
        thesis: "把出行领域的信息、对接与业务开发连接起来。",
        problem: "在运营方、地区与行政之间，信息与机会被割裂开。",
        building: "一个让日本国内外的相关方基于同一份信息对话的平台。",
        status: "开发与运营中。已有公开网站。",
      },
      {
        name: "Kakari",
        href: "/kakari",
        thesis: "以多语言支持在日本生活与创业所需的各项手续。",
        problem: "制度明明存在，却因为语言与流程的门槛而无人用得上。",
        building: "把手续拆成阶段，并让人看清自己能走到哪一步的机制。",
        status: "开发中。正在准备公开。",
      },
      {
        name: "Chigamo",
        href: "/chigamo",
        thesis: "从位置与情境出发，让人看懂一个地方。",
        problem: "越是在当地真正有用的信息，越是搜不出来。",
        building: "以位置与情境为线索的生活圈发现机制。",
        status: "构想阶段。验证尚未开始。",
      },
    ],
    noteHeading: ["这一页说明了什么，", "又没有说明什么。"],
    noteBody: [
      "这里列出的，是 Yorisou 目前正在推进的事业与构想。",
      "它们不是已经法人化的子公司，不是出资对象，也不是客户。各自所处的阶段并不相同，我们如实写明。",
      "我们的目标是让它们成为能够独立存在的公司，但目前还没有一项达到那个状态。",
    ],
  },

  /* ── CHIGAMO (CORP-v1.2) ────────────────────────────────────────────── */
  chigamo: {
    reading: "身在一个地方，就能看懂这个地方。",
    now: "处于构想阶段。没有已公开的产品，没有用户，也没有与地方政府开展的任何项目。",
    next: "当以位置与情境收窄范围时，信息是否真的会变得可用。我们打算先从小处确认这一点。",
    who: "真正了解那片土地的人。能够说清生活圈的信息在哪里断掉的人。",
    join: {
      title: "参与这项事业",
      body: "这仍是验证之前的阶段。所以与其说在找一起做的人，不如说在找能把假设推翻的人。",
      roles: [
        "以居住者的身份，对某个特定地区了解得很细",
        "有处理位置信息或地区数据的经验",
        "不介意从构想阶段就参与进来",
      ],
      state: "构想阶段。可以参与的形式尚未确定。",
    },
    eyebrow: "业务",
    heading: ["身在一个地方，", "就能看懂这个地方。"],
    stage: "构想阶段",
    lead:
      "以位置与情境为线索，让人看清在这片土地上真正有用的是什么——这是一个构想。目前仍处于验证之前的阶段。",
    domain: "生活圈 ／ 位置与情境 ／ 发现",
    conceptEyebrow: "我们的思考",
    conceptHeading: ["不是没有信息，", "而是信息没有送达。"],
    conceptBody: [
      "关于一个地方，越是真正想知道的事，越是搜不到。原因不是信息不存在，而是它从未按照位置与情境被整理起来。",
      "所在的位置、当下的时间，以及这个人正处的状况。有些信息，只有当这三者对上，人才会意识到“这与我有关”。Chigamo 想要处理的正是这一处。",
    ],
    boundaryTitle: "目前的阶段",
    boundaryBody:
      "Chigamo 处于构想阶段。没有已公开的产品，没有用户，也还没有与地方政府开展的任何项目。这里写下的，是我们打算去验证的假设。",
    detail: [
      {
        heading: "为什么是现在",
        body: "地图与检索都已经足够成熟。即便如此，“此刻我所在的地方，对我来说什么才有意义”，仍然需要人自己重新去查。",
      },
      {
        heading: "需要确认什么",
        body: "当以位置与情境收窄范围时，信息是否真的会变得可用。我们打算先从小处确认这一点。",
      },
    ],
  },

  /* ── HOW WE BUILD / FOUNDRY (CORP-v1.2) ─────────────────────────────── */
  foundry: {
    eyebrow: "我们如何构建",
    heading: ["从问题到公司，", "按顺序一步步走完。"],
    lead:
      "我们不从灵光一现开始。发现结构性的问题，加以确认，设计成一项事业，与能够运营它的人组队，最终让它成为独立的公司。Yorisou 把这一顺序称为创业工场（foundry）。",
    stagesEyebrow: "阶段",
    stagesHeading: ["八个阶段，", "一个都不跳过。"],
    stages: [
      { no: "01", name: "假设", body: "先确定结构性的问题出在哪里。不是凭灵感，而是从一线的实际形态出发。" },
      { no: "02", name: "证据", body: "确认这个问题是否真的存在、究竟是谁在为它所困。有不少假设会在这一步消失。" },
      { no: "03", name: "事业设计", body: "把解法变成事业的形态。设计清楚由谁使用，以及价值在哪里完成交换。" },
      { no: "04", name: "构建", body: "真正动手做。能用共通基础的地方就用，把力气集中在这项事业特有的部分上。" },
      { no: "05", name: "事业就绪", body: "把资产与流程整理到外部的人可以接手运营的程度。" },
      { no: "06", name: "组建创始团队", body: "与能够把这项事业当作自己的事来承担的人组队。不是雇佣关系，而是共同创业。" },
      { no: "07", name: "独立与运营", body: "作为独立的公司运转起来。目标是不再持续依赖 Yorisou 的形态。" },
      { no: "08", name: "学习", body: "无论是做成的部分，还是中途消失的假设，都作为下一项事业的材料留存下来。" },
    ],
    independenceHeading: ["目的是，", "一家能够独立存在的公司。"],
    independenceBody: [
      "创业工场的目的，不是让 Yorisou 旗下的名单变长，而是让每一项事业都达到能够作为独立公司自己站住的状态。",
      "所以我们从一开始就按可以交接的方式来做。如果运营它的人手里没有真正的决定权，那它就还不算一家公司。",
    ],
    asterionEyebrow: "共享技术与执行基础",
    asterionHeading: ["同样的东西，", "不做第二遍。"],
    asterionBody: [
      "Asterion OS 是一个独立的共享技术与执行平台，在 Yorisou 的创业工场构想中被置于共通的位置。它并不为 Yorisou 所有。",
      "因为有共通的基础，各项事业不必重建同样的机制，可以专注在自己的领域上。积累下来的能力，会成为下一项事业的起点。",
    ],
    asterionBoundaryTitle: "边界",
    asterionBoundaryBody:
      "各项事业分别独立治理。知识产权、数据与运营责任，都归属于事业本身。我们没有做成让事业或用户的数据自动流向基础平台的设计。",
    economicsHeading: ["权益的归属，", "取决于贡献与责任。"],
    economicsBody: [
      "每项事业的条件都不一样。我们不会把同一个固定的模板套到所有事业上。",
      "共通的只有原则：权益取决于贡献、所承担的风险，以及此后持续的责任。运营这项事业的人，握有实际的决定权。",
      "具体条件按事业、按对象逐一商谈。这不是能够写在网站上的内容。",
    ],
    maturityTitle: "目前的阶段",
    maturityBody:
      "这套做法还不是一种经过反复验证的方法。Yorisou 仍处于早期阶段，尚未把任何一项事业送出成为独立的公司。这里写下的是我们实际采用的推进方式，而不是对成果的主张。",
  },

  /* ── BUILD WITH US (CORP-v1.2) ──────────────────────────────────────── */
  buildWithUs: {
    eyebrow: "一起构建",
    heading: ["立场不同，", "入口也不同。"],
    lead:
      "Yorisou 会把一项事业推进到成为公司之前的位置，再与能够承担它的人组队。所以我们在找的，不是被雇佣的人，而是把它接下来的人。",
    lanes: [
      {
        key: "founders",
        label: "创业者",
        title: "创业者与共同创业者",
        body:
          "把已经推进到成为公司之前的事业，当作自己的事接下来的位置。参与的身份不是受雇，而是共同创业。决定权与责任，都放在这个人手上。",
        invites: [
          "有过真正把一项带一线的事业运转起来的经验",
          "能在大量事情尚未确定的阶段推动它向前",
          "对技术、制造、行政或地区事务中的某一项有实地的熟悉",
        ],
        offers: "调研与证据、早期的产品、事业设计，以及共通基础。不必从零开始，可以从中途接手。",
        cannot: "薪酬、融资、权益条件，在现阶段我们都无法承诺。条件按每项事业逐一商谈。",
        ventures: ["Mirai Move", "Kakari", "Chigamo"],
        state: "目前处在希望听人讲的阶段。没有招募名额。",
        cta: "表达意向",
      },
      {
        key: "team",
        label: "创始成员",
        title: "创始成员与专业人才",
        body:
          "创业者一个人从来不够。我们在寻找从早期就一起扛起技术、运营或一线其中一块的人。",
        invites: [
          "不只是做出来，还一直看到运营环节",
          "有过以少数人把事情从头做起来的经验",
          "了解那个领域里被视为理所当然的事",
        ],
        offers: "从早期参与的位置，以及在自己动手的范围内的实际裁量。",
        cannot: "我们没有常设的招聘名额。现在也谈不上处在能够招人的状态。",
        ventures: ["Mirai Move", "Kakari"],
        state: "要看事业所处的阶段。请先告诉我们你能承担什么。",
        cta: "先聊一聊",
      },
      {
        key: "users",
        label: "早期使用者",
        title: "早期使用者与参与验证的人",
        body:
          "这个阶段，我们希望有人站在真正使用的立场，来看我们做出来的东西。不是为了得到称赞，而是为了知道它在哪里卡住。",
        invites: [
          "曾经真正为这个问题所困",
          "能把不顺利的地方原样说出来",
          "不介意看尚未公开的东西",
        ],
        offers: "让你看到还在做的东西，你说的会反映到设计里。",
        cannot: "公开的时间、意见是否会被采纳，以及任何报酬，我们都无法承诺。",
        ventures: ["Kakari", "Mirai Move"],
        state: "我们正在寻找愿意来看一看的人。这不是正式的招募。",
        cta: "表达意向",
      },
      {
        key: "research",
        label: "大学与研究",
        title: "大学与研究机构",
        body:
          "把研究成果变成社会可用的形态，这一步需要来自事业侧的设计。关于创业人才的培养与研究的落地，我们在寻找可以一起思考的伙伴。",
        invites: [
          "正在为研究成果寻找落地的去处",
          "希望让学生与研究者获得创业的实地经验",
          "希望从共同的探索开始",
        ],
        offers: "来自事业侧的设计，以及真正在运转的一线。可以从探索开始。",
        cannot: "共同研究协议、资金，以及正式的合作关系，我们都还没有。",
        ventures: ["Mirai Move", "Chigamo"],
        state: "我们没有合作实绩。从交谈开始。",
        cta: "先聊一聊",
      },
      {
        key: "public",
        label: "行政与公共",
        title: "行政与公共部门",
        body:
          "制度已经具备，却没有被翻译成居民可以照着走的步骤。我们希望在这段落差上一起设计：从小范围试行，到衡量效果，再到形成可以持续的形态。",
        invites: [
          "有可以在实地试行的课题",
          "希望做成可以衡量效果的形态",
          "不希望止步于一次性的试点",
        ],
        offers: "调研与证据的整理，以及用于小范围试行的设计。",
        cannot: "我们还没有与地方政府开展项目的实绩，也无法提供制度上的保证。",
        ventures: ["Mirai Move", "Kakari"],
        state: "从咨询交流开始。没有正在进行的合作。",
        cta: "咨询洽谈",
      },
      {
        key: "corporate",
        label: "企业",
        title: "企业",
        body:
          "如果希望把自家一线存在的问题做成事业的形态。我们可以从共同开发，或是实地的验证开始。",
        invites: [
          "一线存在尚未解决的运营问题",
          "正在寻找新事业的形态",
          "正在寻找共同开发的伙伴",
        ],
        offers: "可以从把问题重新设计成一项事业开始参与。",
        cannot: "我们没有交易实绩，也没有可以作为导入案例展示的东西。",
        ventures: ["Mirai Move", "Kakari", "Chigamo"],
        state: "从听你讲开始。",
        cta: "联系我们",
      },
    ],
    intakeTitle: "关于受理方式",
    intakeBody:
      "目前没有申请受理，也没有任何选拔机制。这里写的是邀请，而不是进行中的合作，也不是开放的招聘名额。我们先听听你的想法，从能不能谈得起来开始。",
    foundingTeamEyebrow: "创始团队",
    foundingTeamHeading: ["在成为公司之前，", "我们已经开始做了。"],
    foundingTeamBody: [
      "多数情况下，事业是在人聚齐之后才开始的。Yorisou 走的是相反的顺序：先做出调研与证据、早期的产品，以及作为事业的设计，然后再去找能够把它接下来的人。",
      "所以参与的人不必从一张白纸开始，而是可以从把已经成形的东西接过来、当作自己的事开始。",
      "但是，把它接下来这件事本身的分量并不会因此改变。握有决定权的人，同时承担责任。如果运营它的人手里没有真正的决定权，那它就还不算一家公司。",
    ],
    ctaHeading: ["无论哪种立场，", "最初的入口都是同一个。"],
    ctaBody: "请把想法写下来发给我们。我们会依次阅读。",
  },
};
