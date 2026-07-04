export const PLATFORM_PILLARS = [
  {
    title: "診断で、いまの状態を知る",
    body: "恋愛、仕事、人との距離感、名前の印象。いくつかの入口から、今の自分に近いテーマを選び、状態やリズムを見える形にします。",
  },
  {
    title: "LINEで、ゆるく続くよりそい",
    body: "結果をLINEに保存すると、あとから見返せます。必要に応じて、振り返りのきっかけ、次に試せる診断、レポート、あなたに合いそうな情報が届くことがあります。",
  },
  {
    title: "レポートで、もう少し深く読む",
    body: "無料結果だけでは見えにくい傾向や、関係・仕事・選び方のリズムを、より深いレポートで整理できます。レポートは、あなたを決めつけるものではなく、次の選択肢を考えるための読みものです。",
  },
  {
    title: "Yorisou Select",
    body: "本、コンテンツ、道具、サービス、商品まで。診断やフィードバックをもとに、今の状態に合いそうな選択肢を少しずつ提案していきます。",
  },
  {
    title: "Yorisou Design",
    body: "声や行動から見えてきた困りごとや欲しいものをもとに、新しい道具、体験、サービス、商品アイデアを一緒に形にしていきます。はじめは関心確認や小さな試用から進めます。",
  },
  {
    title: "Community / Co-creation",
    body: "気になるテーマには、フィードバック、試用、生活の観察、アイデアづくりとして参加できます。参加は任意で、あなたの声はよりよい提案や新しい取り組みにつながります。",
  },
] as const;

export const PLATFORM_ENTRY_LINKS = [
  {
    title: "今の自分を診断する",
    body: "今の状態タイプ、短い解説、LINE保存、レポート preview、おすすめの入口まで、今使える流れをまとめて試せます。",
    href: "/open-testing",
    label: "公開中の入口へ",
  },
  {
    title: "入口を選ぶ",
    body: "恋愛、人との距離感、仕事や生活のリズムなど、今の自分に近いテーマから静かに選べます。",
    href: "/tests",
    label: "診断テーマを見る",
  },
  {
    title: "LINEから続ける",
    body: "結果の見返しや次のヒントを、必要なときだけ受け取れるLINE入口です。",
    href: "/line/mini-app",
    label: "LINEを開く",
  },
] as const;

export const SELECT_CARDS = [
  {
    title: "読みもの",
    body: "今の状態をもう少し整理するためのコンテンツ。",
    status: "提案候補",
  },
  {
    title: "道具",
    body: "毎日のリズムや振り返りを助ける小さな道具。",
    status: "検討中",
  },
  {
    title: "サービス",
    body: "必要なときに検討できる外部サービスや相談先。",
    status: "関心受付",
  },
  {
    title: "商品",
    body: "生活を少し軽くするための選択肢。状態や関心に合わせて提案します。",
    status: "提案候補",
  },
] as const;

export const DESIGN_CARDS = [
  {
    title: "アイデアを集める",
    body: "困りごと、欲しいもの、使ってみたい場面を集めます。",
  },
  {
    title: "小さく試す",
    body: "関心が集まったテーマは、試用やフィードバックを通じて形を確かめます。",
  },
  {
    title: "一緒に育てる",
    body: "必要なものだけを、無理なく、使う人の声から育てます。",
  },
] as const;

export const COMMUNITY_CARDS = [
  {
    title: "フィードバック",
    body: "気づいたことや違和感を、次の改善につなげる入口です。",
  },
  {
    title: "試用",
    body: "小さく試して、使い心地を確かめる参加の形です。",
  },
  {
    title: "生活の観察",
    body: "日々のリズムや困りごとを言葉にして、よりよい提案の材料にします。",
  },
  {
    title: "アイデアづくり",
    body: "必要なものや助かる体験を、一緒に整理していく参加の形です。",
  },
] as const;

export const LOCAL_LIFE_THEMES = [
  "移動しづらさ",
  "買い物や通院の困りごと",
  "家族を支える人の負担",
  "地域のつながり",
  "若い世代と高齢者の支え合いアイデア",
] as const;

export const DIAGNOSTIC_ENTRY_CARDS = [
  {
    title: "いまのあなたタイプ診断",
    category: "自分を知る",
    status: "公開中",
    hook: "今の気分や人との向き合い方から、あなたの現在地を見つけます。",
    time: "約3分",
    outcome: "今の状態タイプ、短い解説、LINE保存、レポート preview、おすすめの入口",
    href: "/open-testing",
    label: "診断をはじめる",
    availableNow: true,
  },
  {
    title: "恋愛の距離感診断",
    category: "恋愛・人間関係",
    status: "先行テーマ",
    hook: "近づきたい気持ちと、自分のペース。その間にある、あなたらしい距離感を見つけます。",
    time: "約3分",
    outcome: "距離感タイプ、関係のリズム、レポート案内、おすすめの振り返りテーマ",
    href: "/contact?topic=love-distance-interest",
    label: "興味を送る",
    availableNow: false,
  },
  {
    title: "仕事のリズム診断",
    category: "仕事・選び方",
    status: "先行テーマ",
    hook: "集中しやすい環境、疲れやすい関わり方、動き出しやすいペースを整理します。",
    time: "約3分",
    outcome: "仕事リズムタイプ、向きやすい環境、レポート案内、役立つコンテンツや道具のヒント",
    href: "/contact?topic=work-rhythm-interest",
    label: "興味を送る",
    availableNow: false,
  },
  {
    title: "名前の印象チェック",
    category: "名前・象徴チェック",
    status: "先行テーマ",
    hook: "名前から受ける印象をきっかけに、自分らしさの見え方を軽く振り返ります。",
    time: "約2分",
    outcome: "名前の印象メモ、自己理解のきっかけ、関連診断案内",
    href: "/contact?topic=name-impression-interest",
    label: "興味を送る",
    availableNow: false,
  },
] as const;
