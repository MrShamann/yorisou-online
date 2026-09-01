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
 *
 * CORP-v1.2/v1.4 boundaries, carried at full strength: Asterion OS is an INDEPENDENT
 * technology-platform project and is NOT one of the ventures presented on this site — never "our
 * platform", never "powered by", and no claim either way about who owns it. Ownership, licensing,
 * data rights and operating responsibility follow the agreements that apply in each case, and the
 * separate-governance sentence (IP, data, operating responsibility per venture) stays intact.
 * Mirai Move, Kakari and Chigamo are ventures and concepts, never subsidiaries, investments or
 * clients. Chigamo is at concept stage with no product, no users and no municipal programme. The
 * foundry method is not claimed as proven or repeatable, and no venture has been spun out yet.
 * Build-with-us intake states plainly that there is no application process and no selection
 * programme; no CTA is ever rendered as "apply now".
 *
 * CORP-v1.2R2. `reading` is each venture's own one-line positioning, never a transliteration: the
 * wordmarks Mirai Move, Kakari and Chigamo stay in Latin script here, exactly as Kakari's own
 * localisation glossary requires. Every `cannot` keeps the Japanese bluntness — no salary, no
 * funding, no ownership terms, no track record, no case studies, no municipal programme, no
 * research agreement — and every `state` carries the weakest truthful status, so nothing reads as
 * an open intake. Mirai Move has sent nothing to anyone externally; Kakari is in private testing
 * with zero users and never substitutes for a licensed professional; Chigamo is concept only.
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
    footerTagline: "人與技術，創造未來。",
    footerProjects: "事業",
    footerCompany: "公司",
    footerLegalNote: "本網站記載的事實，皆以可查證的紀錄為依據。",
    backToTop: "回到頁首",
  },

  meta: {
    home: { title: "Yorisou 合同會社 — 把結構性的課題，變成事業。", description: "Yorisou 合同會社是一家創業 foundry：找出結構性的課題，建立證據與事業資產，並與能夠營運的人組隊，把它立成事業。目前正在建構 Mirai Move 與 Kakari，Chigamo 仍在構想階段。" },
    miraiMove: { title: "Mirai Move — Yorisou 合同會社", description: "面向日本移動出行領域的資訊、媒合與事業開發平台。公開網站營運中，平台功能仍在開發階段。" },
    kakari: { title: "Kakari — Yorisou 合同會社", description: "為在日本生活的人、在日本創業的人提供多語言的行政程序與文件支援。目前開發中，尚未對外公開。" },
    about: { title: "我們的做法 — Yorisou 合同會社", description: "找出課題、加以查證、設計成事業，再與創業團隊一起把它立起來。Yorisou 的 foundry 如何進行、事業可以有哪些形態，以及共用基礎落在什麼位置。" },
    company: { title: "公司資訊 — Yorisou 合同會社", description: "Yorisou 合同會社的公司概要、代表人簡介、代表致詞與事業領域。" },
    contact: { title: "聯絡我們 — Yorisou 合同會社", description: "事業、合作與採訪相關的聯絡窗口。" },
    ventures: { title: "事業 — Yorisou 合同會社", description: "Yorisou 目前推進中的事業與構想：Mirai Move、Kakari、Chigamo。各自的階段不同，我們照實記載。" },
    buildWithUs: { title: "一起打造 — Yorisou 合同會社", description: "給創業者、研究者、行政與企業的入口。目前沒有公開招募的機制，我們從能談的範圍開始。" },
    chigamo: { title: "Chigamo — Yorisou 合同會社", description: "從位置與脈絡出發，讓人知道那塊土地上真正派得上用場的事。目前為構想階段，沒有公開中的產品。" },
  },

  common: {
    buildingLabel: "建構中",
    conceptLabel: "構想階段",
    readMore: (name) => `深入了解 ${name}`,
    backHome: "返回公司首頁",
    stageLabel: "目前階段",
    boundaryLabel: "不承擔的範圍",
    nowLabel: "目前",
    nextLabel: "下一步",
    whoLabel: "想談談的對象",
  },

  home: {
    eyebrow: "Yorisou 合同會社",
    hook: ["把結構性課題，", "變成公司。"],
    thesis: ["從結構性的課題，", "打造事業，", "並持續培育。"],
    lead: [
      "Yorisou 是一家 foundry：我們找出社會中結構性的課題，加以查證，設計成事業，",
      "並與營運的人組隊，把它立成一項事業。",
    ],
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
    buildHeading: ["制度沒有觸及的領域，", "我們一個一個做出來。"],

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

    /* CORP-v1.2 — Asterion layer and engagement layer on the homepage. */
    asterionEyebrow: "共用基礎",
    asterionBody:
      "Asterion OS 是一個獨立的技術基礎專案。同樣的機制不必反覆重建，各項事業也就能把力氣放在自己的領域上。",
    asterionNote:
      "各項事業分別治理。智慧財產、資料與營運責任的歸屬，以及 Asterion 相關的權利，都取決於所適用的協議。",
    /* CORP-v1.4 — how Yorisou stays involved in what it builds. Conditional, never promised. */
    portfolioEyebrow: "與事業的關係",
    portfolioHeading: ["做出來，", "不是終點。"],
    portfolioBody:
      "事業立起來之後，Yorisou 也可能持續參與它的價值：繼續持有股份、以授權的形式參與，或是共同營運。事業也可能分割成獨立的公司，或走向轉讓與出售。",
    portfolioBranches: ["在 YORISOU 內部營運", "共同創業、共同營運", "股份", "授權", "獨立公司", "轉讓或出售"],
    portfolioNote:
      "會是哪一種形態，取決於事業的成熟度、合作的對象、市場、資本，以及各事業的協議。沒有事先定好的條件。",
    engageEyebrow: "一起打造",
    engageHeading: ["還沒成為公司的階段，", "就希望你一起參與。"],
    engageBody:
      "創業者、研究者、行政、企業。立場不同，能參與的位置也不同。我們從現在能談的範圍開始。",
    engageCta: "看看參與的方式",
    engageNote: "每一種都是從洽談開始。目前還沒有應徵受理或甄選的機制。",
    explainerLabel: "30 秒認識 Yorisou",
    explainerHeading: ["從一個課題到一家公司，", "30 秒說完。"],
    explainerClose: "關閉",
    explainerPlay: "播放",
    explainerPause: "暫停",
    explainerRestart: "從頭播放",
    explainerStepLabel: "場景",
  },

  mirai: {
    reading: "把地方的移動，一路推到解決為止。",
    now: "公開網站正在運作，持續讀取公開資訊的機制也自動在跑。但對外送出去的東西，到目前為止一件也沒有。",
    next: "在第一個實質的案例上，還留著幾個不到外面確認就無法往前的問題。從這裡開始，換人親自去跑。",
    who: "了解地方移動現場的人。能以地方政府或交通業者的立場，說出實際限制的人。",
    join: {
      title: "參與這項事業",
      body: "現在需要的，是能具體說出現場限制的對象。這是去查證的階段，不是推銷的階段。",
      roles: [
        "正在參與地方的交通或移動（地方政府、業者、現場）",
        "能把這個領域當成事業背負起來的創業者或營運者",
        "了解實際運作方式的專業人才",
      ],
      state: "目前是想先聽聽你怎麼說的階段。沒有招募名額。",
    },
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
    reading: "讓在日本的手續，能靠自己走完。",
    now: "目前是非公開的測試階段。尚未對外公開，也還沒有任何人在使用。",
    next: "發布所需的手續，以及公司登記資訊的確定。兩件都是需要外部確認的工作。",
    who: "在日本生活的外國籍人士。站在支援立場的人。以及具國家資格的專業人士。",
    join: {
      title: "參與這項事業",
      body: "目前希望先讓了解手續實況的人看看。這不是用來取代專業人士的工具。",
      roles: [
        "在日本辦手續時實際遇過困難",
        "正在參與對外國籍人士的支援",
        "身為行政書士等具資格的專業人士，能一起確認界線該畫在哪裡",
        "能把這項事業背負起來的創業者或營運者",
      ],
      state: "我們正在找能看看它的人。既未公開，也還沒有招募。",
    },
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
    intro: "Yorisou 合同會社是一家創業 foundry：找出結構性的課題，設計成事業，並與能夠營運的人組隊，一起把它立起來。我們以福岡為據點建構多項事業，目前公開的是 Mirai Move、Kakari 與 Chigamo。",

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
      { label: "法人番號（日本國稅廳）", value: "2290003018125" },
      { label: "代表", value: "Jin Yang" },
      { label: "所在地", value: "日本福岡縣福岡市" },
      { label: "事業內容", value: "新事業的探索、企劃、開發與營運；創業團隊的組成；以及透過共同事業化、授權等方式推動事業化" },
    ],

    businessEyebrow: "事業領域",
    businessBody: "Yorisou 的核心，是打造事業本身。找出結構性的課題，加以查證，設計成事業，實際做出來，再與能夠營運的人組隊把它立起來。目前公開的事業是：移動出行領域的資訊、媒合與事業開發（Mirai Move）；為在日本生活的人、在日本創業的人提供的多語言手續支援（Kakari）；以及從位置與脈絡出發的生活圈探索（Chigamo，構想階段）。三者都依循同一個方針推進：承接複雜，交還可以使用的形式。",

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
    unavailableBody: "我們尚未完成寄送路徑的驗證，因此無法保證從這裡送出的訊息一定送達。確認之後，表單會在本頁開放。",
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

  /* ── VENTURES INDEX (CORP-v1.2) ─────────────────────────────────── */
  ventures: {
    eyebrow: "事業",
    publicLabel: "目前公開的事業",
    publicNote: "Yorisou 正在建構多個事業。這裡介紹目前公開的事業。",
    heading: ["它們都還沒有", "作為公司獨立站住。"],
    lead:
      "這些領域有一個共同點：制度與機制其實都已經存在，卻在需要的人面前停了下來。Yorisou 走進那個位置，一邊查證，一邊把它做成形。",
    cards: [
      {
        name: "Mirai Move",
        href: "/mirai-move",
        thesis: "串連移動出行領域的資訊、媒合與事業開發。",
        problem: "在業者、地方與行政之間，資訊與機會是被切開的。",
        building: "讓國內外的關係人能站在同一份資訊上對話的平台。",
      },
      {
        name: "Kakari",
        href: "/kakari",
        thesis: "以多語言支援在日本生活的人、在日本創業的人的各項手續。",
        problem: "制度明明存在，卻因語言與流程的障礙而沒有被使用。",
        building: "把手續拆成階段，讓人看得出自己能做到哪裡的機制。",
      },
      {
        name: "Chigamo",
        href: "/chigamo",
        thesis: "從位置與脈絡出發，讓人看懂一個地方。",
        problem: "在那個地方真正派得上用場的資訊，反而最難找到。",
        building: "以位置與脈絡為線索的生活圈探索機制。",
      },
    ],
    /* CORP-v1.4 — separates what is true today from what may follow. */
    structureHeading: ["現在的形態，", "與往後的形態。"],
    structureBody: [
      "上面寫的階段，是目前的事實。我們只寫已經發生的事。",
      "往後的形態還沒有定下來。可能繼續在 Yorisou 之內營運，可能從外部迎入營運團隊，可能共同持有，也可能分割成獨立的公司。也可能採取授權、轉讓或出售的形式。",
      "會是哪一種，取決於事業的成熟度、合作的對象、市場、資本，以及協議。這裡寫的是可能發生的形態，不是計畫，也不是承諾。",
    ],
    noteHeading: ["這個頁面說了什麼，", "又沒有說什麼。"],
    noteBody: [
      "這裡列出的，是 Yorisou 目前正在推進的事業與構想。",
      "它們不是已經法人化的子公司，不是出資對象，也不是客戶。各自的階段不同，我們就照實寫。",
      "這裡寫的是目前的事實。它們接下來會變成什麼形態，還沒有定下來。",
    ],
  },

  /* ── CHIGAMO (CORP-v1.2) ────────────────────────────────────────── */
  chigamo: {
    reading: "在那個地方，就看得懂那個地方。",
    now: "構想階段。沒有公開中的產品，沒有使用者，也沒有與地方政府的任何合作。",
    next: "當資訊以位置與脈絡收斂之後，是否真的變得可用。我們打算先從小規模確認這一點。",
    who: "真正了解那塊土地的人。能說明生活圈的資訊在哪裡斷掉的人。",
    join: {
      title: "參與這項事業",
      body: "這還是查證之前的階段。所以與其說是找一起做的人，不如說是在找能把假設打破的人。",
      roles: [
        "以居住者的角度，熟知某個特定地區",
        "處理過位置資訊或地區資料",
        "不排斥從構想階段就參與",
      ],
      state: "構想階段。能參與的形式還沒有定下來。",
    },
    eyebrow: "事業",
    heading: ["在那個地方，", "就看得懂那個地方。"],
    stage: "構想階段",
    lead:
      "以位置與脈絡為線索，讓人知道在那塊土地上真正派得上用場的事——這是一個構想。目前仍在驗證之前的階段。",
    domain: "生活圈 / 位置與脈絡 / 探索",
    conceptEyebrow: "我們在想的事",
    conceptHeading: ["不是沒有資訊，", "而是資訊沒有送達。"],
    conceptBody: [
      "關於一個地方，越是真正想知道的事，越是搜尋不到。不是因為資訊不存在，而是因為它從未依照地點與脈絡被整理起來。",
      "所在的位置、當下的時間，以及這個人正處在什麼狀況。這三者對上了，有些資訊才會顯得與自己有關。Chigamo 想處理的就是這一段。",
    ],
    boundaryTitle: "目前的階段",
    boundaryBody:
      "Chigamo 處於構想階段。沒有公開中的產品，沒有使用者，也還沒有任何與地方政府的合作。這裡寫下的，是我們打算去驗證的假設。",
    detail: [
      {
        heading: "為什麼是現在",
        body: "地圖與搜尋都已經足夠成熟。即使如此，「我現在站的這個地方，對我而言什麼才有意義」，仍然要靠人自己重新查一遍。",
      },
      {
        heading: "要驗證什麼",
        body: "當資訊以位置與脈絡收斂之後，是否真的變得可用。我們打算先從小規模開始確認。",
      },
    ],
  },

  /* ── HOW WE BUILD / FOUNDRY (CORP-v1.2) ──────────────────────────── */
  foundry: {
    eyebrow: "我們的做法",
    heading: ["從一個課題，", "一路帶到一家公司。"],
    lead:
      "我們不從突然想到的點子開始。找出結構性的課題，加以查證，設計成事業，與能夠營運的人組隊，一路推進到它能作為事業站住為止。Yorisou 把這個順序稱為 foundry。",
    stagesEyebrow: "階段",
    stagesHeading: ["八個階段，", "一個都不跳過。"],
    stages: [
      { no: "01", name: "假說", body: "先立起一個判斷：結構性的課題在哪裡。不是靈光一閃，而是從現場的形狀出發。" },
      { no: "02", name: "證據", body: "確認這個課題是否真的存在、困住的是誰。有不少假說會在這裡消失。" },
      { no: "03", name: "事業設計", body: "把解法做成事業的形狀。設計出誰會使用，以及對價在哪裡產生。" },
      { no: "04", name: "建置", body: "實際動手做。能沿用共用基礎的地方就沿用，把力氣集中在這項事業獨有的部分。" },
      { no: "05", name: "事業就緒", body: "把資產與流程整理到他人能夠接手營運的程度。" },
      { no: "06", name: "創業團隊的組成", body: "與能把這項事業當成自己的事來背負的人組隊。不是雇用，而是共同創業。" },
      { no: "07", name: "獨立與營運", body: "讓這項事業能靠自己的力量運轉。可能分割成獨立的公司，可能繼續在 Yorisou 之內營運，也可能與他人共同持有。" },
      { no: "08", name: "學習", body: "順利的部分，以及消失的假說，都留下來作為下一項事業的材料。與事業的關係，並不一定到此為止。" },
    ],
    independenceHeading: ["事業的形態，", "不只有一種。"],
    independenceBody: [
      "以獨立的公司站起來，是我們期望的形態之一。但那並不代表走到那一步，與 Yorisou 的關係就結束了。",
      "也有事業會繼續在 Yorisou 之內營運。可能從外部迎入創業者或營運團隊、共同持有，可能分割成獨立的公司，可能採取授權的形式，也可能走向轉讓或出售。",
      "會採取哪一種形態，取決於事業的成熟度、合作的對象、市場、資本，以及該事業的協議。沒有事先定好的模式。",
      "共通的只有一點：從一開始就用可以交接的方式做。如果營運的人沒有真正的決定權，那它就還沒有作為事業站住。",
    ],
    asterionEyebrow: "共用技術與執行基礎",
    asterionHeading: ["同樣的東西，", "不做第二次。"],
    asterionBody: [
      "Asterion OS 是一個獨立的技術基礎專案。它並不是這份公司介紹裡所談的 Yorisou 事業之一。",
      "Yorisou 的事業在必要時，有可能使用 Asterion 的功能。所有權、授權、資料權利與營運責任，都取決於當時所適用的協議。",
      "有了可以共用的基礎，各項事業不必再重建同樣的機制，能專注在自己的領域。累積起來的能力，會成為下一項事業的起點。",
    ],
    asterionBoundaryTitle: "界線",
    asterionBoundaryBody:
      "各項事業分別治理。智慧財產、資料與營運責任的歸屬，由各事業的協議訂定。我們沒有讓事業或使用者的資料自動流向基礎層的設計。",
    economicsHeading: ["持分依循", "貢獻與責任。"],
    economicsBody: [
      "每項事業的條件都不同。我們不會把同一套固定的模式套用在所有事情上。",
      "共通的只有原則：持分依循貢獻、承擔的風險，以及會延續下去的責任。實際營運的人，握有真正的決定權。",
      "Yorisou 自身也可能持續參與該事業的長期價值：繼續持有股份、以授權的形式參與，或是共同營運。採取哪一種，取決於在那項事業裡承擔了多少、又負了多少風險。",
      "現階段還沒有能夠承諾的條件。無論是持分，還是權利的形式，都不是在協議之前就已經定好的。",
      "具體的條件，會依事業、依對象個別談。那不是能寫在網站上的東西。",
    ],
    maturityTitle: "目前的階段",
    maturityBody:
      "這套做法還不是經過反覆驗證的方法。Yorisou 仍處於初期階段，也還沒有把任何一項事業送成獨立的公司。這裡寫的是我們實際的進行方式，不是對成果的主張。",
  },

  /* ── BUILD WITH US (CORP-v1.2) ────────────────────────────────── */
  buildWithUs: {
    eyebrow: "一起打造",
    heading: ["立場不同，", "入口也不同。"],
    lead:
      "Yorisou 會先把事業推進到能夠站住之前的那一步，再與能背負它的人組隊。所以我們找的不是受雇的人，而是願意承接這項事業的人或組織。",
    /* CORP-v1.4 — the shape of an involvement is designed per project, and promised in advance for none. */
    structureHeading: ["參與的方式，", "依專案個別設計。"],
    structureBody: [
      "不是把人套進固定的框架裡。共同創業、創業團隊、事業的持分、授權、共同營運、分割成獨立的公司——依事業、依承擔的範圍而不同。",
      "不論採取哪一種形式，治理、智慧財產、角色、責任與經濟條件，都以另行締結的協議訂定。在這裡無法事先承諾任何條件。",
    ],
    lanes: [
      {
        key: "founders",
        label: "創業者",
        title: "創業者與共同創業者",
        body:
          "把已經推進到成為公司之前的事業，當成自己的事來承接的位置。不是受雇，而是以共同創業的身分參與。決定權與責任，都放在那個人身上。",
        invites: [
          "實際運作過有現場的事業",
          "在許多事都還沒定下來的階段，仍能把事情往前推",
          "在技術、製造、行政或地方之中，至少有一個領域的實地理解",
        ],
        offers: "調查與證據、初期的產品、事業設計，以及共用基礎。不是從零開始，而是從半途接手。",
        cannot: "薪資、募資與持分條件，現階段我們都無法承諾。條件會依事業個別再談。",
        ventures: ["Mirai Move", "Kakari", "Chigamo"],
        state: "目前是想先聽聽你怎麼說的階段。沒有招募名額。",
        cta: "表達興趣",
      },
      {
        key: "team",
        label: "創業成員",
        title: "創業成員與專業人才",
        body:
          "光靠創業者一個人，從來都不夠。我們在找能從初期就一起扛起技術、營運或現場其中一塊的人。",
        invites: [
          "不只把東西做出來，也一路看到營運",
          "有以少數人啟動一件事的經驗",
          "知道那個領域裡什麼叫理所當然",
        ],
        offers: "從初期就參與的位置，以及在自己實際動手的範圍內的裁量。",
        cannot: "我們沒有常設的職缺。現在也還說不上是能夠聘人的狀態。",
        ventures: ["Mirai Move", "Kakari"],
        state: "要看事業的階段。請先告訴我們你能承接什麼。",
        cta: "聊聊看",
      },
      {
        key: "users",
        label: "早期使用者",
        title: "早期使用者與參與試用的人",
        body:
          "希望有人能站在實際使用的位置，看看我們做出來的東西。不是為了聽到稱讚，而是為了知道它會在哪裡卡住。",
        invites: [
          "在這個課題上實際遇過困難",
          "能把不順利的地方原話說出來",
          "不介意看還沒公開的東西",
        ],
        offers: "讓你看看做到一半的東西，你說的會回到設計裡。",
        cannot: "公開時程、需求是否會被採納，以及報酬，我們都無法承諾。",
        ventures: ["Kakari", "Mirai Move"],
        state: "我們正在找能看看它的人。這不是正式的招募。",
        cta: "表達興趣",
      },
      {
        key: "research",
        label: "大學與研究",
        title: "大學與研究",
        body:
          "要把研究成果帶到社會上可用的階段，需要事業端的設計。我們正在尋找能一起思考創業人才培育與研究落地的對象。",
        invites: [
          "正在尋找研究成果的落地場域",
          "希望讓學生與研究者累積實地的創業經驗",
          "想先從共同探索開始",
        ],
        offers: "事業端的設計，以及實際在運作的現場。可以從共同探索開始。",
        cannot: "共同研究契約、資金與正式的合作關係，目前都還沒有。",
        ventures: ["Mirai Move", "Chigamo"],
        state: "我們沒有任何合作實績。一切從談起。",
        cta: "聊聊看",
      },
      {
        key: "public",
        label: "行政與公共部門",
        title: "行政與公共部門",
        body:
          "制度明明存在，卻沒有被翻譯成居民實際會走的步驟。我們希望一起設計那段落差：先小規模嘗試、量得出成效，並且能延續下去。",
        invites: [
          "有可以在實地嘗試的課題",
          "希望做成能衡量成效的形式",
          "不想停在一次性的實證",
        ],
        offers: "調查與證據的整理，以及小規模試行的設計。",
        cannot: "我們還沒有與地方政府合作的實績，也無法提供制度上的保證。",
        ventures: ["Mirai Move", "Kakari"],
        state: "從洽談開始。目前沒有進行中的合作。",
        cta: "洽談",
      },
      {
        key: "corporate",
        label: "企業",
        title: "企業",
        body:
          "如果想把自家現場的課題，做成事業的形狀。我們可以從共同開發，或從實地驗證開始。",
        invites: [
          "現場有尚未解決的營運課題",
          "正在尋找新事業的形狀",
          "正在尋找共同開發的對象",
        ],
        offers: "可以從把課題重新設計成事業的那一步開始參與。",
        cannot: "我們沒有商務往來的實績，也沒有可以拿出來給你看的導入案例。",
        ventures: ["Mirai Move", "Kakari", "Chigamo"],
        state: "先從聽你說起。",
        cta: "來信詢問",
      },
    ],
    intakeTitle: "關於招募狀況",
    intakeBody:
      "目前沒有應徵受理的機制，也沒有甄選的制度。這裡寫的是邀請，不是進行中的合作，也不是開放中的職缺。我們會先聽聽你的內容，從能不能談起開始。",
    foundingTeamEyebrow: "創業團隊",
    foundingTeamHeading: ["在成為公司之前，", "我們已經開始做了。"],
    foundingTeamBody: [
      "多數情況下，事業是在人聚齊之後才開始。Yorisou 的順序相反：先做出調查與證據、初期的產品，以及作為事業的設計，然後才去找能承接它的人。",
      "所以參與的人不會從一張白紙開始。可以從接手一個已經有形狀的東西、把它變成自己的，開始做起。",
      "相對地，承接這件事的意義並不會因此變輕。握有決定權的人，也承擔責任。如果營運的人沒有真正的決定權，那它就還不是一家公司。",
    ],
    ctaHeading: ["無論哪一種立場，", "最初的入口都一樣。"],
    ctaBody: "把想法寫下來寄給我們。我們會依序閱讀。",
  },
};
