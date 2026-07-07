export const PLATFORM_PILLARS = [
  {
    title: "今の状態を知る",
    body: "恋愛、仕事、人との距離感、名前の印象。今の自分に近い入口から、状態やリズムを見える形にします。",
  },
  {
    title: "入口を選び直せる",
    body: "結果や関心に合わせて、別の入口や読みもの、次に見たい案内へ静かにつなげます。",
  },
  {
    title: "あとから見返せる",
    body: "結果をLINEに保存すると、あとから見返せます。必要に応じて、振り返りのきっかけや次の入口も受け取れます。",
  },
  {
    title: "レポートでもう少し深く読む",
    body: "無料結果だけでは見えにくい傾向や、関係・仕事・選び方のリズムを、レポートでもう少し具体的に整理できます。",
  },
  {
    title: "次の行動やおすすめにつながる",
    body: "反応や関心をもとに、読みもの、道具、サービス、参加の入口を少しずつ整えていきます。",
  },
] as const;

export const PLATFORM_ENTRY_LINKS = [
  {
    title: "今の自分をチェックする",
    body: "120問の公開テストから、結果、レポート、LINE保存まで、いま使える流れをまとめて進められます。",
    href: "/open-testing",
    label: "公開テストを始める",
  },
  {
    title: "入口を選ぶ",
    body: "恋愛、人との距離感、仕事や生活リズム、暮らしの関心まで、今日の自分に近い入口を選べます。",
    href: "/tests",
    label: "入口の違いを見る",
  },
  {
    title: "LINEから続ける",
    body: "結果の見返しや次のヒントを、必要なときだけ受け取れる継続入口です。",
    href: "/line/mini-app",
    label: "LINEを開く",
  },
] as const;

export const HOME_PRODUCT_LOOP = [
  {
    title: "診断する",
    body: "今の状態に近い入口から始めます。",
  },
  {
    title: "結果を読む",
    body: "今の見え方を短く受け取ります。",
  },
  {
    title: "あとで戻る",
    body: "LINEや保存から後で見返せます。",
  },
  {
    title: "レポートを見る",
    body: "必要なら、もう少し深く読み進めます。",
  },
  {
    title: "次の入口へ",
    body: "反応や関心に合わせて次を整えます。",
  },
] as const;

export const HOME_ENTRY_GUIDE = [
  {
    title: "まず今の状態を知りたい",
    body: "公開テストから、結果とレポートまでひと通り進めたい人向けです。",
    href: "/open-testing",
    label: "今の自分をチェックする",
  },
  {
    title: "自分に近いテーマから選びたい",
    body: "恋愛、人との距離感、仕事や生活リズム、暮らしの関心から近い入口を選べます。",
    href: "/tests",
    label: "入口を選ぶ",
  },
  {
    title: "あとで戻れる形にしたい",
    body: "結果の見返しや次のヒントを、LINEから無理なく続けるための入口です。",
    href: "/line/mini-app",
    label: "LINEから続ける",
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

export const DESIGN_FUTURE_NOTE =
  "こどもの絵や家族の小さな表現を、将来の試作品や記念品のアイデアとして育てることも検討しています。";

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
  "生活リズムの立て直し",
  "気持ちの戻し方",
  "人との距離の整え方",
  "小さく動ける次の一歩",
  "続き方のヒントへの関心",
] as const;

export const DIAGNOSTIC_ENTRY_CARDS = [
  {
    title: "いまのあなたタイプ診断",
    category: "自分を知る",
    status: "公開中",
    hook: "今の気分や人との向き合い方から、あなたの現在地を見つけます。",
    time: "約3分",
    outcome: "今の状態タイプ、短い解説、LINE保存、レポートの見本、おすすめの入口",
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
