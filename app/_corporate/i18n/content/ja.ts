import type { SiteCopy } from "../types";

/**
 * CORP-P5R2 — JAPANESE CANONICAL SOURCE.
 *
 * This file is the single source of meaning for the entire corporate site. Every other locale is
 * translated FROM this file and may never be stronger than it.
 *
 * CLAIM DISCIPLINE. Nothing here asserts a customer, partner, metric, revenue, funding, market
 * position, team size, government relationship or capability that is not evidenced. Company facts
 * are limited to what the Founder has stated or what a canonical project document proves; fields
 * without a source (法人番号 / 資本金 / 設立年月日 / 番地) are OMITTED rather than shown as pending —
 * a visitor must never see an internal blocker token.
 *
 * 代表社員 is used deliberately. The live consumer-era page renders 代表取締役, which is a 株式会社
 * title and legally wrong for a 合同会社.
 */
export const ja: SiteCopy = {
  chrome: {
    skip: "本文へスキップ",
    menu: "メニュー",
    menuToggle: "メニューを開閉する",
    close: "閉じる",
    navLabel: "サイト内ナビゲーション",
    navLabelMobile: "サイト内ナビゲーション（モバイル）",
    langLabel: "表示言語",
    langHeading: "言語を選択",
    langSearch: "言語を検索",
    langCurrent: "現在の言語",
    previewBadge: "Preview — 未公開",
    nav: { home: "ホーム", miraiMove: "Mirai Move", kakari: "Kakari", about: "私たちについて", company: "会社情報", contact: "お問い合わせ" },
    footerTagline: "人と社会のあいだに、次のよりそいをつくる。",
    footerProjects: "事業",
    footerCompany: "会社",
    footerLegalNote: "掲載している事実は、確認できた記録に基づいています。",
    backToTop: "ページ先頭へ",
  },

  meta: {
    home: { title: "Yorisou 合同会社 — 人と社会のあいだに、次のよりそいをつくる。", description: "Yorisou合同会社は、暮らし・仕事・地域にある複雑さを見つめ、人が理解し、選び、前に進めるプロダクトをつくる会社です。Mirai Move と Kakari を開発しています。" },
    miraiMove: { title: "Mirai Move — Yorisou 合同会社", description: "日本のモビリティ領域における、情報・マッチング・事業開発のためのプラットフォーム。公開サイトが稼働中で、プラットフォーム機能は開発段階です。" },
    kakari: { title: "Kakari — Yorisou 合同会社", description: "日本で暮らす人・事業を始める人のための、多言語の行政手続き・書類サポート。現在は開発中で、一般には公開していません。" },
    about: { title: "私たちについて — Yorisou 合同会社", description: "Yorisouが何のために存在し、どのように考え、どのようにつくるのか。確認できないことは書きません。" },
    company: { title: "会社情報 — Yorisou 合同会社", description: "Yorisou合同会社の会社概要、代表者プロフィール、代表メッセージ、事業領域。" },
    contact: { title: "お問い合わせ — Yorisou 合同会社", description: "事業・提携・取材に関するお問い合わせ窓口です。" },
  },

  common: {
    readMore: (name) => `${name} について詳しく`,
    backHome: "会社トップへ戻る",
    stageLabel: "現在の段階",
    boundaryLabel: "担わない範囲",
  },

  home: {
    eyebrow: "Yorisou 合同会社",
    thesis: ["人と社会のあいだに、", "次のよりそいを", "つくる。"],
    lead: ["Yorisouは、暮らし・仕事・地域にある複雑さを見つめ、", "人が理解し、選び、前に進めるプロダクトをつくる会社です。"],
    humanSide: "人",
    humanItems: ["暮らし", "仕事", "地域"],
    systemSide: "仕組み",
    systemItems: ["モビリティ", "行政手続き"],
    fieldCaption: "人 — 暮らし・仕事・地域　／　仕組み — モビリティ・行政手続き",
    fieldRelation: "関係",

    whyEyebrow: "取り組む問題",
    whyHeading: ["複雑さは、", "個人の努力だけでは", "解けない。"],
    whyBeats: [
      { no: "01", title: "「わからない」が入口で止める。", body: "制度は存在しても、たどり着けなければ無いのと同じです。" },
      { no: "02", title: "専門家に渡すまでが遠い。", body: "本当に人の判断が必要な場面の手前に、仕組みが担えるはずの距離があります。" },
      { no: "03", title: "現場と仕組みが噛み合わない。", body: "移動・福祉・行政の現場には、まだ届いていない選択肢があります。" },
    ],

    buildEyebrow: "つくっているもの",
    buildHeading: ["次のよりそいを、", "順番につくる。"],

    howEyebrow: "つくり方",
    howHeading: ["複雑さを引き受けて、", "使えるかたちにする。"],
    howBeats: [
      { no: "01", title: "現場の言葉から始める", body: "技術から発想しません。実際に困っている人の手順から逆算して設計します。" },
      { no: "02", title: "わかるところまでを責任にする", body: "情報を出して終わりにしない。次に何をすればよいかが分かる状態までを、設計に含めます。" },
      { no: "03", title: "境界を明示する", body: "専門家が担うべき領域には踏み込みません。どこまでを担い、どこから人に渡すかを、製品の中で明示します。" },
      { no: "04", title: "検証できることだけを言う", body: "実績・数値・提携は、証拠のあるものだけを記載します。確認できないことは、書きません。" },
    ],
    howDisclose: "この原則が実際に何を意味するか",

    founderEyebrow: "代表者",
    founderHeading: ["複雑な現場を、", "20年見てきた人間がつくる。"],
    founderTeaser: "自動車・モビリティ・製造・国際事業の現場で20年以上、技術と実装と商流のあいだに立ってきました。そこで繰り返し見たのは、優れた仕組みが、使う人に届かないまま止まる場面でした。",
    founderRole: "Yorisou 合同会社 代表社員",
    founderCta: "代表者について",

    messageEyebrow: "代表メッセージ",
    messageHeading: ["技術ではなく、", "届くかどうかで判断する。"],
    messageTeaser: "私たちが扱うのは、新しさではありません。すでにある制度や選択肢が、必要な人のところで止まってしまう。その距離を、順番に縮めていく会社をつくっています。",
    messageCta: "メッセージ全文を読む",

    originEyebrow: "拠点",
    originHeading: ["福岡から、", "はじめる。"],
    originBody: "Yorisou合同会社は、福岡県福岡市を拠点に会社づくりを進めています。生活と仕事と地域が近い距離にある場所で、現場の手順から設計を始めています。",

    proofEyebrow: "会社情報",
    proofHeading: ["書けることを、", "書けるだけ。"],

    ctaEyebrow: "お問い合わせ",
    ctaHeading: ["一緒に取り組める余地が", "あるかもしれません。"],
    ctaBody: "事業のご相談、提携のご検討、取材のご依頼を受け付けています。内容に応じて順次ご連絡します。",
    ctaButton: "お問い合わせへ",
  },

  mirai: {
    eyebrow: "事業 01",
    heading: ["日本のモビリティ領域における、", "情報・マッチング・事業開発の", "プラットフォーム。"],
    stage: "公開サイト稼働中／プラットフォーム機能は開発中",
    lead: "行政・自治体、企業、介護／福祉／地域の現場、海外サプライヤー、国内パートナーをつなぎ、移動に関する情報と機会を一つの流れとして扱うことを目指しています。現在は公開情報サイトが稼働しており、プラットフォーム機能は開発段階にあります。",
    domain: "日本のモビリティ領域",
    networkEyebrow: "つなぐ相手",
    networkHeading: ["立場の違う相手が、", "同じ機会を", "別の言葉で見ている。"],
    centre: "移動の機会",
    parties: [
      { no: "01", title: "行政・自治体", body: "制度と予算の側" },
      { no: "02", title: "企業", body: "供給と実装の側" },
      { no: "03", title: "地域・介護／福祉の現場", body: "実際に移動が起きる場所" },
      { no: "04", title: "海外サプライヤー／国内パートナー", body: "選択肢を持ち込む側" },
    ],
    boundaryTitle: "開発状況について",
    boundaryBody: "プラットフォーム本体は開発中です。自律エージェントによる自動実行は有効化していません。外部への働きかけを伴う操作は、人の確認を前提とした設計としています。完成した全機能プラットフォームとしては提供していません。",
    detail: [
      { heading: "扱っている問題", body: "移動の選択肢は、地域ごとに、制度ごとに、事業者ごとに分かれて存在しています。必要としている人と、すでにある選択肢が、同じ場所で出会えていません。" },
      { heading: "向き合っている相手", body: "行政・自治体、企業、介護／福祉／地域の現場、海外サプライヤー、国内パートナー。立場も判断基準も違う相手が、同じ機会を別々の言葉で見ています。" },
      { heading: "いま動いているもの", body: "公開情報サイトが稼働しています。プラットフォームとしての情報・マッチング・事業開発の機能は、基盤とアーキテクチャの整備段階にあります。" },
    ],
    siteLabel: "公開サイト",
    siteUrl: "https://www.miraimove.com",
  },

  kakari: {
    eyebrow: "事業 02",
    heading: ["日本で暮らす人・", "事業を始める人のための、", "多言語の手続きサポート。"],
    stage: "開発中（一般公開前）",
    lead: "日本語や専門知識の壁があると、本来使えるはずの制度にたどり着けません。Kakariは、必要な情報の提示、書類の準備、フォームの作成、提出・郵送の手順案内までを多言語で支援します。現在は開発段階にあり、一般には公開していません。",
    domain: "行政手続き・書類 ／ 多言語",
    procedureEyebrow: "支援する手順",
    procedureHeading: ["調べるところから、", "提出するところまで。"],
    steps: [
      { no: "01", title: "調べる", body: "どの制度が自分に関係するのかを特定する" },
      { no: "02", title: "書類をそろえる", body: "必要な書類と添付物を洗い出す" },
      { no: "03", title: "作成する", body: "多言語で記入し、内容を確認する" },
      { no: "04", title: "提出する", body: "提出先・提出方法・郵送手順を案内する" },
    ],
    boundaryTitle: "専門家が担う範囲",
    boundaryBody: "士業の代理は行いません。法務・税務・公的判断が必要な領域は、専門家が担う範囲として明示します。弁護士・税理士・行政書士などの資格を要する判断や代理は、Kakariの機能に含まれません。",
    detail: [
      { heading: "扱っている問題", body: "手続きの方法は公開されています。それでも、言語と前提知識が足りないだけで、制度にたどり着けない人がいます。これは本人の能力の問題ではありません。" },
      { heading: "向き合っている相手", body: "日本で暮らしている人、これから日本で事業を始める人。日本語での手続きを一人で進めることが難しい状況にある人を想定しています。" },
      { heading: "いま動いているもの", body: "認証基盤を独立した検証環境に構築し、権限とストレージの検証を行っている段階です。外部連携は無効のままで、一般公開はしていません。" },
    ],
  },

  about: {
    eyebrow: "私たちについて",
    heading: ["つくり方が、", "そのまま約束になる。"],
    lead: "Yorisouは、暮らし・仕事・地域にある複雑さを見つめ、人が理解し、選び、前に進めるプロダクトをつくる会社です。",
    whyHeading: ["なぜ、この会社があるのか。"],
    whyBody: [
      "制度も、技術も、選択肢も、すでに数多く存在しています。それでも、必要としている人のところで止まってしまう。私たちが向き合っているのは、その最後の距離です。",
      "この距離は、個人の努力や情報量の問題として語られがちです。しかし実際には、仕組みの側が引き受けられるはずの複雑さが、そのまま個人に手渡されているだけのことが多くあります。",
    ],
    thinkHeading: ["どう考えるか。"],
    thinkBody: [
      "私たちは、技術から発想しません。いま止まっている一手をほどくところから考えます。人の状況を読み取り、関係として整理し、次に何をすればよいかが分かる状態まで運ぶ。そこまでを設計の範囲とします。",
      "AIは、その理解と構造化のために使います。判断を代行させるためではありません。人が判断するために必要な材料を、使えるかたちに整えることが役割です。",
    ],
    buildHeading: ["どうつくるか。"],
    principles: [
      { no: "01", title: "現場の言葉から始める", body: "技術から発想しません。実際に困っている人の手順から逆算して設計します。" },
      { no: "02", title: "わかるところまでを責任にする", body: "情報を出して終わりにしない。次に何をすればよいかが分かる状態までを、設計に含めます。" },
      { no: "03", title: "境界を明示する", body: "専門家が担うべき領域には踏み込みません。どこまでを担い、どこから人に渡すかを、製品の中で明示します。" },
      { no: "04", title: "検証できることだけを言う", body: "実績・数値・提携は、証拠のあるものだけを記載します。確認できないことは、書きません。" },
    ],
    principlesLong: [
      { no: "01", title: "現場の言葉から始める", long: "どんな制度も、使う人の手順に翻訳されなければ届きません。私たちは、実際の申請、実際の移動、実際のやりとりから設計を始めます。抽象的な課題設定ではなく、目の前で止まっている一手をほどくところから考えます。" },
      { no: "02", title: "わかるところまでを責任にする", long: "検索結果を並べることは支援ではありません。必要なのは、いま自分が何をすればよいかが分かることです。情報の提示ではなく、次の一手が理解できる状態までをプロダクトの範囲とします。" },
      { no: "03", title: "境界を明示する", long: "できないことを曖昧にしたまま使わせることは、いちばん危険な設計です。担う範囲と、専門家に引き継ぐ範囲を、製品の画面そのものに書きます。境界は注意書きではなく、機能の一部です。" },
      { no: "04", title: "検証できることだけを言う", long: "確認できない実績や、まだ動いていない機能を先に語ることはしません。掲載する事実には、必ずそれを裏づける記録があります。書けることが少ない時期は、少ないまま出します。" },
    ],
    orderHeading: ["ひとつずつ、", "最後まで。"],
    orderBody: "一度に多くを立ち上げることはしません。ひとつの領域で、現場の手順に届くところまでつくり切ることを優先します。",
    claimsHeading: ["確認できないことは、", "書きません。"],
    claimsBody: "掲載する事実には、必ずそれを裏づける記録があります。書けることが少ない時期は、少ないまま出します。",
  },

  company: {
    eyebrow: "会社情報",
    heading: ["Yorisou 合同会社"],
    intro: "Yorisou合同会社は、暮らし・仕事・地域にある複雑さを、人が理解し、選び、前に進められるかたちに変えるプロダクトをつくる会社です。福岡を拠点に、Mirai Move と Kakari の二つの事業を進めています。",

    messageEyebrow: "代表メッセージ",
    messageHeading: ["技術ではなく、", "届くかどうかで判断する。"],
    message: [
      "私たちが扱っているのは、新しさではありません。",
      "自動車・モビリティ・製造の現場で20年以上、技術と実装と商流のあいだに立ってきました。そこで繰り返し見たのは、よくできた仕組みが、それを必要とする人のところに届かないまま止まる場面です。技術が足りないからではありません。使う人の手順に翻訳されていないからです。",
      "制度も、選択肢も、すでに数多く存在しています。それでも「自分に関係があるのか」「次に何をすればよいのか」が分からなければ、無いのと同じです。この最後の距離を、仕組みの側が引き受ける。それがYorisouをつくった理由です。",
      "私たちはAIを、判断を代行させるためには使いません。人が判断するために必要な材料を、読み取り、関係として整理し、使えるかたちに整えるために使います。判断と責任は人の側に残す。どこまでを担い、どこから専門家に渡すのかを、製品の画面に書く。それが私たちの設計です。",
      "会社としてはまだ小さく、書けることも多くありません。だからこそ、確認できたことだけを書きます。増やすべきは、主張ではなく、届いた実績のほうだと考えています。",
    ],
    messageSignature: "ジン・ヤン",
    messageRole: "Yorisou 合同会社 代表社員",

    profileEyebrow: "代表者",
    profileHeading: ["代表社員について"],
    profileName: "ジン・ヤン",
    profileNameLatin: "Jin Yang / Edward Jin",
    profileRole: "Yorisou 合同会社 代表社員",
    profileBody: [
      "自動車・モビリティ・製造・産業プロジェクト開発・サプライチェーン・商業開発・製品開発、そして国境をまたぐ国際事業において、20年以上の実務経験があります。",
    ],
    profileBackgroundLabel: "経歴",
    profileBackground: [
      "国際的な自動車部品サプライヤーである Ficosa にて、商業および産業プロジェクトの上級責任を担当。グローバル産業プロジェクトおよびアジア地域の商業活動に関わる。",
      "その後、中国において技術・製造事業を創業し運営。自動車エレクトロニクス、制御システム、精密製造、AIを活用した製品・システム開発に携わる。",
      "欧州・中国・日本を含む複数の市場で、国際的な事業運営の経験を持つ。",
      "現在は日本で Yorisou 合同会社の代表社員を務め、福岡を拠点に会社づくりを進めている。",
    ],
    profileEducationLabel: "学歴",
    profileEducation: [
      "IESE Business School 経営学修士（MBA）",
      "Harvard Business School Executive Education, General Management Program 修了",
    ],
    profileRelevanceLabel: "なぜこの経歴がYorisouにつながるのか",
    profileRelevance: [
      "複雑な現実の産業を横断して長く実務にあたってきたこと。",
      "技術・製造・商業実行・国際市場を接続する立場に立ってきたこと。",
      "仕組みや技術と、人や組織が実際に使えるものとのあいだにある落差を、直接見てきたこと。",
      "その結果として、複雑さを理解でき、行動できるかたちに変えるプロダクトをつくるに至ったこと。",
    ],

    overviewEyebrow: "会社概要",
    overviewHeading: ["会社概要"],
    facts: [
      { label: "商号", value: "Yorisou 合同会社" },
      { label: "代表社員", value: "ジン・ヤン（Jin Yang）" },
      { label: "所在地", value: "福岡県福岡市" },
      { label: "事業内容", value: "Mirai Move、Kakari の企画・開発・運営" },
    ],

    businessEyebrow: "事業領域",
    businessHeading: ["事業領域"],
    businessBody: "モビリティ領域における情報・マッチング・事業開発、および日本で暮らす人・事業を始める人のための多言語の行政手続き・書類サポート。いずれも、複雑さを引き受けて使えるかたちにするという同じ方針のもとで進めています。",

    projectsEyebrow: "事業",
    projectsHeading: ["進めている事業"],

    originEyebrow: "拠点",
    originHeading: ["福岡から、はじめる。"],
    originBody: [
      "Yorisou合同会社は、福岡県福岡市を拠点に会社づくりを進めています。",
      "暮らしと仕事と地域が近い距離にある場所で、現場の手順から設計を始めています。",
    ],

    ctaHeading: ["お問い合わせ"],
    ctaBody: "事業のご相談、提携のご検討、取材のご依頼を受け付けています。",
  },

  contact: {
    eyebrow: "お問い合わせ",
    heading: ["お問い合わせ"],
    lead: "事業のご相談、提携のご検討、取材のご依頼を受け付けています。内容に応じて順次ご連絡します。",
    channelsHeading: ["ご相談の種類"],
    channels: [
      { title: "一般のお問い合わせ", body: "Yorisouという会社、進めている事業についてのご質問。" },
      { title: "事業・提携", body: "モビリティ領域、行政手続き領域での協業や取引のご相談。" },
      { title: "取材・メディア", body: "取材のご依頼、会社・代表者に関するお問い合わせ。" },
    ],
    formHeading: ["フォームから送る"],
    formIntro: "以下のフォームからお送りください。いただいた内容は担当者が確認し、順次ご連絡します。",
    fields: {
      name: "お名前", namePlaceholder: "山田 太郎",
      email: "メールアドレス", emailPlaceholder: "you@example.com",
      org: "会社名・団体名", orgPlaceholder: "任意",
      type: "お問い合わせ種別",
      message: "お問い合わせ内容", messagePlaceholder: "ご相談の背景や、確認したいことをお書きください。",
    },
    types: [
      { value: "general", label: "一般のお問い合わせ" },
      { value: "business", label: "事業・提携" },
      { value: "media", label: "取材・メディア" },
    ],
    submit: "送信する",
    sending: "送信中…",
    successTitle: "送信しました",
    successBody: "お問い合わせを受け付けました。内容を確認のうえ、順次ご連絡します。",
    errorTitle: "送信できませんでした",
    errorBody: "時間をおいて、もう一度お試しください。",
    required: "必須",
    privacyNote: "いただいた個人情報は、お問い合わせへの対応の目的にのみ使用します。",
  },
};
