export const PLATFORM_PILLARS = [
  {
    title: "チェック",
    body: "今の状態に近い入口から、まず現在地をつかみます。",
  },
  {
    title: "結果",
    body: "短い結果を受け取り、今の見え方を落ち着いて読みます。",
  },
  {
    title: "レポート",
    body: "もう少し深く読みたいときは、レポートへ進めます。",
  },
  {
    title: "おすすめ",
    body: "次に見たい読みものや選択肢、おすすめの入口につながります。",
  },
  {
    title: "コミュニティ",
    body: "反応や声を残し、軽く参加しながら次の改善につなげられます。",
  },
  {
    title: "Yorisou Design",
    body: "小さなアイデアや試作品の関心を育てる、コンセプト領域です。",
  },
  {
    title: "マーケット",
    body: "将来のおすすめやマッチングの可能性を、まだ販売前の段階で整理します。",
  },
  {
    title: "LINEで続ける",
    body: "保存、再開、受け取りのための戻り道としてLINEを使えます。",
  },
] as const;

export const PLATFORM_ENTRY_LINKS = [
  {
    title: "はじめる",
    body: "初めての人が、チェックから結果、レポート、保存までひと通り試す入口です。",
    href: "/open-testing",
    label: "公開テストから始める",
  },
  {
    title: "チェックを選ぶ",
    body: "恋愛、仕事、暮らし、名前の印象など、近いテーマから入口を選べます。",
    href: "/tests",
    label: "入口を見比べる",
  },
  {
    title: "おすすめを見る",
    body: "結果のあとで、次に見たいヒントや選択肢を静かに整理する領域です。",
    href: "/recommendations?resultId=EM-AK&overlayId=balancing&confidence=low",
    label: "おすすめの入口を見る",
  },
] as const;

export const HOME_PRODUCT_LOOP = [
  {
    title: "チェック",
    body: "今の状態に近い入口から始めます。",
  },
  {
    title: "結果を読む",
    body: "今の見え方を短く受け取ります。",
  },
  {
    title: "レポート",
    body: "深く知りたいときは、レポートへ進みます。",
  },
  {
    title: "おすすめ",
    body: "次に見たいヒントや選択肢を受け取ります。",
  },
  {
    title: "コミュニティ",
    body: "反応や声を残し、次の改善につなげます。",
  },
  {
    title: "Design / マーケット",
    body: "将来の試作品やマッチングの可能性を育てます。",
  },
  {
    title: "LINEで戻る",
    body: "保存・再開・受け取りの導線として使えます。",
  },
] as const;

export const HOME_ENTRY_GUIDE = [
  {
    title: "まず今の状態を知りたい",
    body: "公開テストから、結果とレポートまでひと通り進めたい人向けです。",
    href: "/open-testing",
    label: "はじめる",
  },
  {
    title: "自分に近いテーマから選びたい",
    body: "恋愛、人との距離感、仕事や生活リズム、暮らしの関心から近い入口を選べます。",
    href: "/tests",
    label: "チェックを選ぶ",
  },
  {
    title: "次のヒントやおすすめも見たい",
    body: "結果のあとで、次の入口、おすすめ、反応の残し方まで見たい人向けです。",
    href: "/recommendations?resultId=EM-AK&overlayId=balancing&confidence=low",
    label: "おすすめを見る",
  },
] as const;

export const HOME_PLATFORM_BRANCHES = [
  {
    title: "チェック",
    body: "今の状態に近い入口から始める領域です。",
    href: "/tests",
    label: "チェックを見る",
    status: "いま使える",
  },
  {
    title: "レポート",
    body: "結果をもう少し深く読み、次を整理する読みものです。",
    href: "/report-preview?resultId=EM-AK&overlayId=balancing&confidence=low",
    label: "レポートを見る",
    status: "いま使える",
  },
  {
    title: "おすすめ",
    body: "次に見たいヒントや選択肢、おすすめの入口をまとめます。",
    href: "/recommendations?resultId=EM-AK&overlayId=balancing&confidence=low",
    label: "おすすめを見る",
    status: "いま使える",
  },
  {
    title: "コミュニティ",
    body: "反応、感想、生活の声を残し、軽く参加できる領域です。",
    href: "/#yorisou-community",
    label: "コミュニティを見る",
    status: "参加は任意",
  },
  {
    title: "Yorisou Design",
    body: "まだ販売ではなく、アイデアや試作品の可能性を育てる場所です。",
    href: "/#yorisou-design",
    label: "Designを見る",
    status: "コンセプト検証",
  },
  {
    title: "マーケット",
    body: "将来のおすすめやマッチングの可能性を、準備中の領域として整理します。",
    href: "/#yorisou-market",
    label: "マーケットを見る",
    status: "準備中",
  },
] as const;

export const SELECT_CARDS = [
  {
    title: "読みもの",
    body: "今の状態をもう少し整理するためのコンテンツや見本。",
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
  "こどもの絵や家族の小さな表現を、将来の試作品や記念品のアイデアとして育てることも検討しています。まだ販売ではなく、関心や可能性を見ていく段階です。";

export const COMMUNITY_CARDS = [
  {
    title: "フィードバック",
    body: "気づいたことや違和感を、次の改善につなげる入口です。",
  },
  {
    title: "反応",
    body: "結果やおすすめに対するひとことの反応を、軽く残せます。",
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

export const MARKETPLACE_CARDS = [
  {
    title: "おすすめ候補をためる",
    body: "今の状態や関心に合いそうな選択肢を、まだ販売前の候補として整理します。",
  },
  {
    title: "将来のマッチングを見る",
    body: "必要な人と選択肢がどうつながるかを、準備中の領域として育てます。",
  },
  {
    title: "関心の強さを確かめる",
    body: "ほしいもの、試したいこと、合いそうな提案の反応を静かに集めます。",
  },
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
