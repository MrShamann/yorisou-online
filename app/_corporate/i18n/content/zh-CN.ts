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
    footerTagline: "在人与社会之间，构筑下一种相伴的方式。",
    footerProjects: "业务",
    footerCompany: "公司",
    footerLegalNote: "本站所载事实，均以可核实的记录为依据。",
    backToTop: "返回页首",
  },

  meta: {
    home: { title: "Yorisou 有限责任公司 — 在人与社会之间，构筑下一种相伴的方式。", description: "Yorisou 有限责任公司关注生活、工作与地区中的复杂性，打造让人能够理解、选择并向前迈进的产品。目前正在开发 Mirai Move 与 Kakari。" },
    miraiMove: { title: "Mirai Move — Yorisou 有限责任公司", description: "面向日本出行领域的信息、对接与业务开发平台。公开网站已在运行，平台功能仍处于开发阶段。" },
    kakari: { title: "Kakari — Yorisou 有限责任公司", description: "面向在日本生活的人与在日本创业的人，提供多语言的行政手续与文书支持。目前处于开发阶段，尚未面向公众开放。" },
    about: { title: "关于我们 — Yorisou 有限责任公司", description: "Yorisou 为何存在、如何思考、如何构建。无法确认的事，我们不写。" },
    company: { title: "公司信息 — Yorisou 有限责任公司", description: "Yorisou 有限责任公司的公司概要、代表人简介、代表致辞与业务领域。" },
    contact: { title: "联系我们 — Yorisou 有限责任公司", description: "关于业务、合作与采访的咨询窗口。" },
  },

  common: {
    readMore: (name) => `了解 ${name}`,
    backHome: "返回公司首页",
    stageLabel: "当前阶段",
    boundaryLabel: "不承担的范围",
  },

  home: {
    eyebrow: "Yorisou 有限责任公司",
    thesis: ["在人与社会之间，", "构筑下一种", "相伴的方式。"],
    lead: ["Yorisou 关注生活、工作与地区中的复杂性，", "打造让人能够理解、选择并向前迈进的产品。"],
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
    buildHeading: ["把下一种相伴的方式，", "一件一件地做出来。"],

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
  },

  mirai: {
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
};
