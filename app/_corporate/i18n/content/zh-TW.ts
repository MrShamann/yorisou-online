import type { SiteCopy } from "../types";

/**
 * CORP-P5R2 — TRADITIONAL CHINESE (zh-TW). Translated from the Japanese canonical source.
 *
 * This is an adapted sibling, not a literal rendering: it is written to read as natural corporate
 * Traditional Chinese. It may never be stronger than the Japanese. No customer, partner, metric,
 * revenue, funding, market-position, team-size or capability claim appears here that the Japanese
 * does not already make.
 *
 * Company form: the Japanese LLC form is rendered 合同會社 and never as a joint-stock-company term.
 * The representative is 代表 — never a chief-executive title belonging to a joint-stock company.
 *
 * On the representative: "Harvard Business School Executive Education, General Management Program"
 * is stated precisely. It is NOT a Harvard University degree and NOT an HBS MBA, and must never be
 * shortened in a way that implies either. No endorsement by IESE, Harvard, Ficosa, or any
 * government body is implied.
 *
 * The Kakari professional boundary and the Mirai Move development-status boundary are carried at
 * full strength.
 */
export const zh_TW: SiteCopy = {
  chrome: {
    skip: "跳至主要內容",
    menu: "選單",
    menuToggle: "開啟或關閉選單",
    close: "關閉",
    navLabel: "網站導覽",
    navLabelMobile: "網站導覽（行動版）",
    langLabel: "顯示語言",
    langHeading: "選擇語言",
    langSearch: "搜尋語言",
    langCurrent: "目前語言",
    previewBadge: "Preview — 尚未公開",
    nav: { home: "首頁", miraiMove: "Mirai Move", kakari: "Kakari", about: "關於我們", company: "公司資訊", contact: "聯絡我們" },
    footerTagline: "在人與社會之間，打造下一種相伴的方式。",
    footerProjects: "事業",
    footerCompany: "公司",
    footerLegalNote: "本網站記載的事實，皆以可查證的紀錄為依據。",
    backToTop: "回到頁首",
  },

  meta: {
    home: { title: "Yorisou 合同會社 — 在人與社會之間，打造下一種相伴的方式。", description: "Yorisou 合同會社正視生活、工作與地方之中的複雜，打造能讓人理解、選擇並向前推進的產品。目前開發 Mirai Move 與 Kakari。" },
    miraiMove: { title: "Mirai Move — Yorisou 合同會社", description: "面向日本移動出行領域的資訊、媒合與事業開發平台。公開網站營運中，平台功能仍在開發階段。" },
    kakari: { title: "Kakari — Yorisou 合同會社", description: "為在日本生活的人、在日本創業的人提供多語言的行政程序與文件支援。目前開發中，尚未對外公開。" },
    about: { title: "關於我們 — Yorisou 合同會社", description: "Yorisou 為何存在、如何思考、如何打造產品。無法查證的事，我們不寫。" },
    company: { title: "公司資訊 — Yorisou 合同會社", description: "Yorisou 合同會社的公司概要、代表人簡介、代表致詞與事業領域。" },
    contact: { title: "聯絡我們 — Yorisou 合同會社", description: "事業、合作與採訪相關的聯絡窗口。" },
  },

  common: {
    readMore: (name) => `深入了解 ${name}`,
    backHome: "返回公司首頁",
    stageLabel: "目前階段",
    boundaryLabel: "不承擔的範圍",
  },

  home: {
    eyebrow: "Yorisou 合同會社",
    thesis: ["在人與社會之間，", "打造下一種", "相伴的方式。"],
    lead: ["Yorisou 正視生活、工作與地方之中的複雜，", "打造能讓人理解、選擇並向前推進的產品。"],
    humanSide: "人",
    humanItems: ["生活", "工作", "地方"],
    systemSide: "機制",
    systemItems: ["移動出行", "行政程序"],
    fieldCaption: "人 — 生活、工作、地方　／　機制 — 移動出行、行政程序",
    fieldRelation: "關係",

    whyEyebrow: "我們面對的問題",
    whyHeading: ["複雜的難題，", "無法只靠個人的努力解開。"],
    whyBeats: [
      { no: "01", title: "「不知道」讓人止步於入口。", body: "制度即使存在，若無法抵達，就等同於不存在。" },
      { no: "02", title: "走到專業人士面前的路，太遠。", body: "在真正需要人來判斷之前，還有一段本來可以由機制承擔的距離。" },
      { no: "03", title: "現場與機制沒有咬合。", body: "在移動、照護與社福、行政的現場，還有尚未送達的選項。" },
    ],

    buildEyebrow: "我們正在打造的",
    buildHeading: ["下一種相伴的方式，", "我們一個一個打造。"],

    howEyebrow: "我們的做法",
    howHeading: ["承接複雜，", "轉化成可以使用的形式。"],
    howBeats: [
      { no: "01", title: "從現場的語言開始", body: "我們不從技術出發，而是從實際受困的人的步驟反推設計。" },
      { no: "02", title: "把「弄懂」也納入責任", body: "提供資訊不是終點。知道下一步該做什麼，也在設計的範圍之內。" },
      { no: "03", title: "明確標示界線", body: "我們不涉入應由專業人士承擔的領域。承擔到哪裡、從哪裡交給人，都寫進產品之中。" },
      { no: "04", title: "只說能夠查證的事", body: "實際成果、數字與合作關係，只記載有證據的部分。無法確認的事，我們不寫。" },
    ],
    howDisclose: "這些原則在實務上代表什麼",

    founderEyebrow: "代表人",
    founderHeading: ["由看了二十年", "複雜現場的人來打造。"],
    founderTeaser: "在汽車、移動出行、製造與國際事業的現場超過二十年，一直站在技術、落地實作與商業環節之間。在那裡反覆看到的，是優秀的機制停在半路，始終沒有送到需要的人手上。",
    founderRole: "Yorisou 合同會社 代表",
    founderCta: "關於代表人",

    messageEyebrow: "代表致詞",
    messageHeading: ["判斷的標準不是技術，", "而是能不能送達。"],
    messageTeaser: "我們處理的並不是新穎。既有的制度與選項，往往在需要的人面前就停了下來。我們正在打造一家公司，一步一步縮短那段距離。",
    messageCta: "閱讀完整致詞",

    originEyebrow: "據點",
    originHeading: ["從福岡開始。"],
    originBody: "Yorisou 合同會社以日本福岡縣福岡市為據點，逐步建立這家公司。在生活、工作與地方彼此靠近的地方，從現場的步驟開始設計。",

    proofEyebrow: "公司資訊",
    proofHeading: ["能寫的部分，", "就只寫這麼多。"],

    ctaEyebrow: "聯絡我們",
    ctaHeading: ["或許還有可以", "一起推進的空間。"],
    ctaBody: "我們接受事業諮詢、合作洽談與採訪邀約，並依內容依序回覆。",
    ctaButton: "前往聯絡表單",
  },

  mirai: {
    eyebrow: "事業 01",
    heading: ["面向日本移動出行領域的", "資訊、媒合與", "事業開發平台。"],
    stage: "公開網站營運中／平台功能開發中",
    lead: "Mirai Move 期望串連行政機關與地方政府、企業、照護與社福及地方現場、海外供應商與國內合作夥伴，讓移動相關的資訊與機會能以同一條流程處理。目前公開資訊網站已在營運，平台功能仍處於開發階段。",
    domain: "日本移動出行領域",
    networkEyebrow: "串連的對象",
    networkHeading: ["立場不同的各方，", "正以不同的語言", "看著同一個機會。"],
    centre: "移動的機會",
    parties: [
      { no: "01", title: "行政機關與地方政府", body: "制度與預算的一方" },
      { no: "02", title: "企業", body: "供給與實作的一方" },
      { no: "03", title: "地方與照護、社福現場", body: "移動實際發生的場所" },
      { no: "04", title: "海外供應商／國內合作夥伴", body: "帶進選項的一方" },
    ],
    boundaryTitle: "關於開發狀況",
    boundaryBody: "平台本體仍在開發中。尚未啟用自主代理的自動執行。凡是會向外部產生作用的操作，皆以人工確認為前提設計。目前並未以功能完整的成品平台形式提供。",
    detail: [
      { heading: "面對的問題", body: "移動的選項依地區、依制度、依業者而分散存在。需要的人與既有的選項，無法在同一個地方相遇。" },
      { heading: "面對的對象", body: "行政機關與地方政府、企業、照護與社福及地方現場、海外供應商、國內合作夥伴。立場與判斷標準各異的各方，正以不同的語言看著同一個機會。" },
      { heading: "目前運作中的部分", body: "公開資訊網站已在營運。作為平台的資訊、媒合與事業開發功能，仍處於基礎與架構整備的階段。" },
    ],
    siteLabel: "公開網站",
    siteUrl: "https://www.miraimove.com",
  },

  kakari: {
    eyebrow: "事業 02",
    heading: ["為在日本生活的人、", "在日本創業的人提供的", "多語言手續支援。"],
    stage: "開發中（尚未對外公開）",
    lead: "當語言與專業知識成為障礙，人們就無法抵達原本可以使用的制度。Kakari 以多語言支援必要資訊的呈現、文件的準備、表單的填寫，以及提交與郵寄的步驟指引。目前處於開發階段，尚未對外公開。",
    domain: "行政程序與文件 ／ 多語言",
    procedureEyebrow: "支援的流程",
    procedureHeading: ["從查詢開始，", "到完成提交。"],
    steps: [
      { no: "01", title: "查詢", body: "確認哪些制度與自己有關" },
      { no: "02", title: "備齊文件", body: "盤點所需的文件與附件" },
      { no: "03", title: "製作", body: "以多語言填寫並確認內容" },
      { no: "04", title: "提交", body: "指引提交對象、提交方式與郵寄流程" },
    ],
    boundaryTitle: "由專業人士承擔的範圍",
    boundaryBody: "我們不代理需國家資格的專業業務。需要法務、稅務或公權力判斷的領域，明確標示為由專業人士承擔的範圍。需要律師、稅理士、行政書士等資格的判斷或代理，不包含在 Kakari 的功能之中。",
    detail: [
      { heading: "面對的問題", body: "手續的做法是公開的。即使如此，仍有人只因語言與前提知識不足，就無法抵達制度。這不是本人能力的問題。" },
      { heading: "面對的對象", body: "在日本生活的人，以及即將在日本創業的人。我們設想的，是難以獨自以日文完成手續的處境。" },
      { heading: "目前運作中的部分", body: "已在獨立的驗證環境建置認證基礎，正在驗證權限與儲存。外部串接維持停用狀態，尚未對外公開。" },
    ],
  },

  about: {
    eyebrow: "關於我們",
    heading: ["我們怎麼打造，", "就是我們的承諾。"],
    lead: "Yorisou 正視生活、工作與地方之中的複雜，打造能讓人理解、選擇並向前推進的產品。",
    whyHeading: ["這家公司為何存在。"],
    whyBody: [
      "制度、技術與選項，其實都已經大量存在。即使如此，它們仍在需要的人面前停了下來。我們面對的，就是這最後一段距離。",
      "這段距離常被說成是個人努力或資訊量的問題。但實際上，很多時候只是本該由機制承接的複雜，就這樣原封不動地交到個人手上。",
    ],
    thinkHeading: ["我們怎麼思考。"],
    thinkBody: [
      "我們不從技術出發，而是從解開此刻卡住的那一步開始。讀取當事人的處境，整理成關係，再帶到能夠知道下一步該做什麼的狀態。這就是我們設計的範圍。",
      "AI 是為了這樣的理解與結構化而使用，不是用來代替判斷。它的角色，是把人在判斷時所需的材料，整理成可以使用的形式。判斷與責任，仍留在人的一方。",
    ],
    buildHeading: ["我們怎麼打造。"],
    principles: [
      { no: "01", title: "從現場的語言開始", body: "我們不從技術出發，而是從實際受困的人的步驟反推設計。" },
      { no: "02", title: "把「弄懂」也納入責任", body: "提供資訊不是終點。知道下一步該做什麼，也在設計的範圍之內。" },
      { no: "03", title: "明確標示界線", body: "我們不涉入應由專業人士承擔的領域。承擔到哪裡、從哪裡交給人，都寫進產品之中。" },
      { no: "04", title: "只說能夠查證的事", body: "實際成果、數字與合作關係，只記載有證據的部分。無法確認的事，我們不寫。" },
    ],
    principlesLong: [
      { no: "01", title: "從現場的語言開始", long: "任何制度，若沒有被翻譯成使用者實際會走的步驟，就送不到人手上。我們從真實的申請、真實的移動、真實的往來開始設計。不從抽象的課題設定出發，而是從眼前卡住的那一步開始解。" },
      { no: "02", title: "把「弄懂」也納入責任", long: "把搜尋結果排出來並不是支援。人真正需要的，是知道自己現在該做什麼。產品的範圍，落在能理解下一步的那一刻，而不是資訊已經呈現的那一刻。" },
      { no: "03", title: "明確標示界線", long: "在沒有講清楚做不到什麼的情況下讓人使用，是最危險的設計。我們承擔的範圍，以及交接給專業人士的範圍，都寫在產品畫面本身。界線不是注意事項，而是功能的一部分。" },
      { no: "04", title: "只說能夠查證的事", long: "我們不會先談無法確認的成果，或尚未運作的功能。刊載的每一項事實，背後一定有可佐證的紀錄。能寫的少的時期，就少寫。" },
    ],
    orderHeading: ["一次一個，", "做到最後。"],
    orderBody: "我們不會同時啟動很多事。我們優先把一個領域做到能真正接上現場步驟的程度。",
    claimsHeading: ["無法查證的事，", "我們不寫。"],
    claimsBody: "刊載的每一項事實，背後一定有可佐證的紀錄。能寫的少的時期，就少寫。",
  },

  company: {
    eyebrow: "公司資訊",
    heading: ["Yorisou 合同會社"],
    intro: "Yorisou 合同會社打造的產品，是把生活、工作與地方之中的複雜，轉化成人能夠理解、選擇並採取行動的形式。我們以福岡為據點，推進 Mirai Move 與 Kakari 兩項事業。",

    messageEyebrow: "代表致詞",
    messageHeading: ["判斷的標準不是技術，", "而是能不能送達。"],
    message: [
      "我們處理的並不是新穎。",
      "在汽車、移動出行與製造的現場超過二十年，我一直站在技術、落地實作與商業環節之間。在那裡反覆看到的，是做得很好的機制，停在半路，沒有送到需要它的人手上。原因不是技術不足，而是它從未被翻譯成那個人實際會走的步驟。",
      "制度與選項，其實都已經大量存在。但如果一個人無法判斷「這與我有沒有關係」「下一步該做什麼」，那就等同於不存在。讓機制來承接這最後一段距離，而不是把它交給個人——這就是我創辦 Yorisou 的理由。",
      "我們不用 AI 代替判斷。我們用它讀取處境、整理成關係，並整理成可以使用的形式，讓人能夠自己判斷。判斷與責任仍留在人的一方。我們承擔到哪裡、從哪裡交給專業人士，都寫在產品畫面上。",
      "公司目前還很小，能寫的也不多。正因如此，我們只寫能夠確認的事。該增加的不是主張，而是真正送達的紀錄。",
    ],
    messageSignature: "Jin Yang",
    messageRole: "Yorisou 合同會社 代表",

    profileEyebrow: "代表人",
    profileHeading: ["關於代表人"],
    profileName: "Jin Yang",
    profileNameLatin: "Jin Yang / Edward Jin",
    profileRole: "Yorisou 合同會社 代表",
    profileBody: [
      "在汽車、移動出行、製造、產業專案開發、供應鏈、商業開發、產品開發，以及跨越國境的國際事業上，擁有超過二十年的實務經驗。",
    ],
    profileBackgroundLabel: "經歷",
    profileBackground: [
      "曾於國際汽車零組件供應商 Ficosa 擔任商業與產業專案的資深職責，參與全球產業專案與亞洲地區的商業活動。",
      "其後於中國創辦並經營技術與製造事業，涉及汽車電子、控制系統、精密製造，以及運用 AI 的產品與系統開發。",
      "在包含歐洲、中國與日本在內的多個市場，具備國際事業營運經驗。",
      "現於日本擔任 Yorisou 合同會社代表，以福岡為據點推進公司的建立。",
    ],
    profileEducationLabel: "學歷",
    profileEducation: [
      "IESE Business School 企業管理碩士（MBA）",
      "Harvard Business School Executive Education，General Management Program 結業",
    ],
    profileRelevanceLabel: "這段經歷為何與 Yorisou 有關",
    profileRelevance: [
      "長期在複雜的真實產業之間從事實務工作。",
      "站在連接技術、製造、商業執行與國際市場的位置上。",
      "直接看見機制與技術，和人與組織實際能夠使用之物，兩者之間的落差。",
      "因而走向打造能把複雜轉化成可理解、可行動的產品。",
    ],

    overviewEyebrow: "公司概要",
    overviewHeading: ["公司概要"],
    facts: [
      { label: "商號", value: "Yorisou 合同會社（Yorisou LLC）" },
      { label: "代表", value: "Jin Yang" },
      { label: "所在地", value: "日本福岡縣福岡市" },
      { label: "事業內容", value: "Mirai Move、Kakari 的企劃、開發與營運" },
    ],

    businessEyebrow: "事業領域",
    businessHeading: ["事業領域"],
    businessBody: "移動出行領域的資訊、媒合與事業開發；以及為在日本生活的人、在日本創業的人提供的多語言行政程序與文件支援。兩者都依循同一個方針：承接複雜，交還可以使用的形式。",

    projectsEyebrow: "事業",
    projectsHeading: ["推進中的事業"],

    originEyebrow: "據點",
    originHeading: ["從福岡開始。"],
    originBody: [
      "Yorisou 合同會社以日本福岡縣福岡市為據點，逐步建立這家公司。",
      "在生活、工作與地方彼此靠近的地方，從現場的步驟開始設計。",
    ],

    ctaHeading: ["聯絡我們"],
    ctaBody: "我們接受事業諮詢、合作洽談與採訪邀約。",
  },

  contact: {
    eyebrow: "聯絡我們",
    heading: ["聯絡我們"],
    lead: "我們接受事業諮詢、合作洽談與採訪邀約，並依內容依序回覆。",
    channelsHeading: ["可以諮詢的類型"],
    channels: [
      { title: "一般諮詢", body: "關於 Yorisou 這家公司，以及我們推進中的事業的提問。" },
      { title: "事業與合作", body: "在移動出行領域、行政程序領域的協作或商務洽談。" },
      { title: "採訪與媒體", body: "採訪邀約，以及關於公司或代表人的詢問。" },
    ],
    formHeading: ["透過表單聯絡"],
    formIntro: "請使用以下表單傳送。我們會確認每一封來信，並依序回覆。",
    fields: {
      name: "姓名", namePlaceholder: "您的姓名",
      email: "電子郵件", emailPlaceholder: "you@example.com",
      org: "公司或組織名稱", orgPlaceholder: "選填",
      type: "諮詢類型",
      message: "諮詢內容", messagePlaceholder: "請說明來信的背景，以及想確認的事項。",
    },
    types: [
      { value: "general", label: "一般諮詢" },
      { value: "business", label: "事業與合作" },
      { value: "media", label: "採訪與媒體" },
    ],
    submit: "送出",
    sending: "傳送中…",
    successTitle: "已送出",
    successBody: "我們已收到您的來信。確認內容後會依序回覆。",
    errorTitle: "無法送出",
    errorBody: "請稍候片刻，再試一次。",
    required: "必填",
    privacyNote: "您提供的個人資料，僅用於回覆本次諮詢。",
  },
};
