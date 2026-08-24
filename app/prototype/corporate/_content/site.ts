/**
 * CORP-P2 — the single content source for every corporate Preview route.
 *
 * Every factual claim below carries a `source` note pointing at the canonical document that proves
 * it. Nothing here may be edited without re-reading that source. Claims with no canonical source do
 * not belong in this file — see docs/yorisou/corporate/CORP_P2_CLAIM_LEDGER.md.
 */

export const ROUTES = {
  home: "/prototype/corporate",
  miraiMove: "/prototype/corporate/mirai-move",
  kakari: "/prototype/corporate/kakari",
  about: "/prototype/corporate/about",
  company: "/prototype/corporate/company",
  contact: "/prototype/corporate/contact",
} as const;

export const NAV = [
  { href: ROUTES.about, label: "私たちについて" },
  { href: ROUTES.miraiMove, label: "Mirai Move" },
  { href: ROUTES.kakari, label: "Kakari" },
  { href: ROUTES.company, label: "会社情報" },
  { href: ROUTES.contact, label: "お問い合わせ" },
] as const;

export const THESIS = "人と社会のあいだに、次のよりそいをつくる。";

/**
 * CORP-P3 F-01 — deliberate Japanese line-breaking.
 *
 * Japanese has no spaces, so a browser breaks CJK anywhere it likes. At 1440px that left 「る。」
 * stranded on its own line, and at 768px it split 「よりそい」 into 「よりそ」/「い」 — a word broken
 * mid-morpheme, which reads as a typo rather than a line break.
 *
 * The fix is to hand the browser its break opportunities instead of letting it invent them: each
 * phrase unit is an inline-block, so a break can only ever happen BETWEEN units. Shrinking the type
 * until it fits was rejected — it destroys the hierarchy the first screen depends on.
 *
 * Wording is unchanged and must stay unchanged; only the composition is authored.
 */
export const THESIS_UNITS = ["人と社会のあいだに、", "次のよりそいを", "つくる。"] as const;

export const HERO_LEAD_UNITS = [
  ["Yorisouは、", "暮らし・仕事・地域にある", "複雑さを見つめ、"],
  ["人が理解し、選び、", "前に進める", "プロダクトをつくる会社です。"],
] as const;

export const HERO_LEAD = [
  "Yorisouは、暮らし・仕事・地域にある複雑さを見つめ、",
  "人が理解し、選び、前に進めるプロダクトをつくる会社です。",
] as const;

/** The four method principles. Source: approved Founder design brief. */
export const METHODS = [
  {
    no: "01",
    title: "現場の言葉から始める",
    short: "技術から発想しません。実際に困っている人の手順から逆算して設計します。",
    long: "どんな制度も、使う人の手順に翻訳されなければ届きません。私たちは、実際の申請、実際の移動、実際のやりとりから設計を始めます。抽象的な課題設定ではなく、目の前で止まっている一手をほどくところから考えます。",
  },
  {
    no: "02",
    title: "わかるところまでをプロダクトの責任にする",
    short: "情報を出して終わりにしない。次に何をすればよいかが分かる状態までを、設計に含めます。",
    long: "検索結果を並べることは支援ではありません。必要なのは、いま自分が何をすればよいかが分かることです。情報の提示ではなく、次の一手が理解できる状態までをプロダクトの範囲とします。",
  },
  {
    no: "03",
    title: "境界を明示する",
    short: "専門家が担うべき領域には踏み込みません。どこまでを担い、どこから人に渡すかを、製品の中で明示します。",
    long: "できないことを曖昧にしたまま使わせることは、いちばん危険な設計です。担う範囲と、専門家に引き継ぐ範囲を、製品の画面そのものに書きます。境界は注意書きではなく、機能の一部です。",
  },
  {
    no: "04",
    title: "検証できることだけを言う",
    short: "実績・数値・提携は、証拠のあるものだけを記載します。確認できないことは、書きません。",
    long: "確認できない実績や、まだ動いていない機能を先に語ることはしません。掲載する事実には、必ずそれを裏づける記録があります。書けることが少ない時期は、少ないまま出します。",
  },
] as const;

/** Source: approved Founder design brief. */
export const PROBLEM_BEATS = [
  {
    no: "01",
    title: "「わからない」が入口で止める。",
    body: "制度は存在しても、たどり着けなければ無いのと同じです。",
  },
  {
    no: "02",
    title: "専門家に渡すまでが遠い。",
    body: "本当に人の判断が必要な場面の手前に、仕組みが担えるはずの距離があります。",
  },
  {
    no: "03",
    title: "現場と仕組みが噛み合わない。",
    body: "移動・福祉・行政の現場には、まだ届いていない選択肢があります。",
  },
] as const;

/** Phrase units for headings that must not fragment. Same rule as THESIS_UNITS. */
export const HEADING_UNITS = {
  problem: ["複雑さは、", "個人の努力だけでは", "解けない。"],
  method: ["複雑さを引き受けて、", "使えるかたちにする。"],
  future: ["次のよりそいを、", "順番につくる。"],
  aboutTitle: ["つくり方が、", "そのまま約束になる。"],
  aboutOrder: ["ひとつずつ、", "最後まで。"],
  aboutClaims: ["確認できないことは、", "書きません。"],
  miraiNetwork: ["立場の違う相手が、", "同じ機会を", "別の言葉で見ている。"],
  kakariFlow: ["調べるところから、", "提出するところまで。"],
} as const;

export type Product = {
  key: "mirai-move" | "kakari";
  name: string;
  href: string;
  domain: string;
  /** Required stage truth. Must match the canonical project source exactly. */
  stage: string;
  line: string;
  /** Phrase units for the product one-liner — same non-fragmenting rule as the thesis. */
  lineUnits: readonly string[];
  summary: string;
  /** The honest limit, rendered as a first-class block rather than a footnote. */
  boundaryTitle: string;
  boundary: string;
  flow: readonly string[];
  flowLabel: string;
  detail: readonly { heading: string; body: string }[];
};

export const MIRAI_MOVE: Product = {
  key: "mirai-move",
  name: "Mirai Move",
  href: ROUTES.miraiMove,
  // Source: mirai-move/AGENT_PROJECT_RULES.md §1 — "Display name: Mirai Move (miraimove.com)".
  domain: "日本のモビリティ領域 ／ miraimove.com",
  // Source: mirai-move/PROJECT_START_HERE.md — "Live in production on Vercel at
  // https://www.miraimove.com" AND "production is NOT yet the V2 full system".
  stage: "公開サイト稼働中／プラットフォーム機能は開発中",
  line: "日本のモビリティ領域における、情報・マッチング・事業開発のためのプラットフォーム。",
  lineUnits: ["日本のモビリティ領域における、", "情報・マッチング・事業開発のための", "プラットフォーム。"],
  summary:
    "行政・自治体、企業、介護／福祉／地域の現場、海外サプライヤー、国内パートナーをつなぎ、移動に関する情報と機会を一つの流れとして扱うことを目指しています。現在は公開情報サイトが稼働しており、プラットフォーム機能は開発段階にあります。",
  boundaryTitle: "開発状況について",
  // Source: mirai-move/PROJECT_START_HERE.md — "no Agent is activated" and "human-gated external
  // action". Stated explicitly so the page cannot be read as claiming an operating agent system.
  boundary:
    "プラットフォーム本体は開発中です。自律エージェントによる自動実行は有効化していません。外部への働きかけを伴う操作は、人の確認を前提とした設計としています。完成した全機能プラットフォームとしては提供していません。",
  flowLabel: "Mirai Move がつなぐ領域",
  flow: ["行政・自治体", "企業", "地域の現場", "パートナー"],
  detail: [
    {
      heading: "扱っている問題",
      body: "移動の選択肢は、地域ごとに、制度ごとに、事業者ごとに分かれて存在しています。必要としている人と、すでにある選択肢が、同じ場所で出会えていません。",
    },
    {
      heading: "向き合っている相手",
      body: "行政・自治体、企業、介護／福祉／地域の現場、海外サプライヤー、国内パートナー。立場も判断基準も違う相手が、同じ機会を別々の言葉で見ています。",
    },
    {
      heading: "いま動いているもの",
      body: "公開情報サイトが稼働しています。プラットフォームとしての情報・マッチング・事業開発の機能は、基盤とアーキテクチャの整備段階にあります。",
    },
  ],
};

export const KAKARI: Product = {
  key: "kakari",
  name: "Kakari",
  href: ROUTES.kakari,
  domain: "行政手続き・書類 ／ 多言語",
  // Source: kakari/PROJECT_START_HERE.md — hosted Preview foundation only, external providers
  // disabled, Draft PR #2 open and unmerged. Not generally available.
  stage: "開発中（一般公開前）",
  line: "日本で暮らす人・事業を始める人のための、多言語の行政手続き・書類サポート。",
  lineUnits: ["日本で暮らす人・", "事業を始める人のための、", "多言語の行政手続き・", "書類サポート。"],
  summary:
    "日本語や専門知識の壁があると、本来使えるはずの制度にたどり着けません。Kakariは、必要な情報の提示、書類の準備、フォームの作成、提出・郵送の手順案内までを多言語で支援します。現在は開発段階にあり、一般には公開していません。",
  boundaryTitle: "専門家との境界について",
  // Source: kakari/PROJECT_START_HERE.md — "never impersonates a licensed professional; high-risk
  // legal, tax, and official matters escalate to professionals". Required wording.
  boundary:
    "士業の代理は行いません。法務・税務・公的判断が必要な領域は、専門家が担う範囲として明示します。弁護士・税理士・行政書士などの資格を要する判断や代理は、Kakariの機能に含まれません。",
  flowLabel: "Kakari が支援する手順",
  flow: ["調べる", "書類をそろえる", "作成する", "提出する"],
  detail: [
    {
      heading: "扱っている問題",
      body: "手続きの方法は公開されています。それでも、言語と前提知識が足りないだけで、制度にたどり着けない人がいます。これは本人の能力の問題ではありません。",
    },
    {
      heading: "向き合っている相手",
      body: "日本で暮らしている人、これから日本で事業を始める人。日本語での手続きを一人で進めることが難しい状況にある人を想定しています。",
    },
    {
      heading: "いま動いているもの",
      body: "認証基盤を独立した検証環境に構築し、権限とストレージの検証を行っている段階です。外部連携は無効のままで、一般公開はしていません。",
    },
  ],
};

export const PRODUCTS = [MIRAI_MOVE, KAKARI] as const;

/**
 * CORP-P3 F-04 — Mirai Move is a NETWORK, so it gets a relationship schematic: parties arranged
 * around a shared centre, each connected to it. Source for the party list:
 * mirai-move/PROJECT_START_HERE.md ("connecting government, institutions, enterprises,
 * care/welfare/community use cases, overseas suppliers, Japanese partners").
 * No coordinates imply geography; no edge implies a transaction volume.
 */
export const MIRAI_NETWORK = {
  centre: "移動の機会",
  parties: [
    { id: "gov", label: "行政・自治体", note: "制度と予算の側" },
    { id: "biz", label: "企業", note: "供給と実装の側" },
    { id: "field", label: "地域・介護／福祉の現場", note: "実際に移動が起きる場所" },
    { id: "supply", label: "海外サプライヤー／国内パートナー", note: "選択肢を持ち込む側" },
  ],
} as const;

/**
 * CORP-P3 F-04 — Kakari is a PROCEDURE, so it gets a sequential flow with an explicit boundary gate.
 * The boundary is a step in the flow, not a disclaimer after it: the point at which the procedure
 * leaves Kakari and becomes a licensed professional's responsibility.
 */
export const KAKARI_PROCEDURE = {
  steps: [
    { no: "01", label: "調べる", note: "どの制度が自分に関係するのかを特定する" },
    { no: "02", label: "書類をそろえる", note: "必要な書類と添付物を洗い出す" },
    { no: "03", label: "作成する", note: "多言語で記入し、内容を確認する" },
    { no: "04", label: "提出する", note: "提出先・提出方法・郵送手順を案内する" },
  ],
  boundary: {
    label: "専門家が担う範囲",
    note: "法務・税務・公的判断が必要になった時点で、Kakariの範囲は終わります。士業の代理は行いません。",
  },
} as const;

/** Blocker identifiers rendered on the Preview so the reason is legible, not hidden. */
export const BLOCKERS = {
  companyRegistration: "COMPANY_REGISTRATION_SOURCE_REQUIRED",
  corporateContact: "VERIFIED_CORPORATE_CONTACT_REQUIRED",
} as const;

/** Fields that stay unpublished until an authoritative registration document exists. */
export const PENDING_COMPANY_FIELDS = [
  "商号",
  "本店所在地",
  "郵便番号",
  "設立年月日",
  "代表者",
  "法人番号",
  "資本金",
  "事業目的",
] as const;
