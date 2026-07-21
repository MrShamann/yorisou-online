// GENERATED FILE — DO NOT EDIT BY HAND.
// Source of truth: docs/yorisou/mtf2a/yorisou-values.v1.json
// Canonical bank content hash (sha256, compact serialization of questionBank.items): 919f17251a280bb34258f6042db46bb9fd543763b33e041de64c36b305eaa9a6
// Regenerate: node scripts/generate-yorisou-values-runtime.mjs
// Drift check: node scripts/generate-yorisou-values-runtime.mjs --check
// Validation fails when this artifact drifts from the canonical JSON
// (lib/yorisou/methods/yorisou-values/__tests__/yorisouValues.test.ts).

export const YORISOU_VALUES_BANK_HASH = "919f17251a280bb34258f6042db46bb9fd543763b33e041de64c36b305eaa9a6" as const;

export const YORISOU_VALUES_DEFINITION = {
  "methodId": "yorisou-values",
  "methodVersion": "values-v1.0",
  "specVersion": "mtf2a-yorisou-values-v1.2.0",
  "nameJa": "いま大事にしたいことチェック",
  "subtitleJa": "最近の選び方から、いまの優先順位を見てみる",
  "family": "yorisou_original_assessment",
  "executionModel": "scored",
  "activationState": "gated",
  "bankVersion": "values-bank-v1.0",
  "scoringVersion": "values-scoring-v1.0",
  "resultSchemaVersion": "values-result-v1.0",
  "bankContentHash": "919f17251a280bb34258f6042db46bb9fd543763b33e041de64c36b305eaa9a6",
  "dimensionOrder": [
    "anshin",
    "pace",
    "tsunagari",
    "seicho",
    "yakuwari",
    "totonoi",
    "jikkan"
  ],
  "dimensions": [
    {
      "dimensionId": "anshin",
      "nameJa": "見通しの安心",
      "definitionJa": "先が読めること、足場が揺らがないことを保ちたい気持ち。",
      "notMeaningJa": "臆病さや保守的な性格のことではありません。いまの選び方の傾向です。"
    },
    {
      "dimensionId": "pace",
      "nameJa": "自分のペース",
      "definitionJa": "自分で選び、自分の速度で進めることを保ちたい気持ち。",
      "notMeaningJa": "わがままやマイペースという評価ではありません。"
    },
    {
      "dimensionId": "tsunagari",
      "nameJa": "つながりの温度",
      "definitionJa": "人とのあたたかい関わりを近くに置いておきたい気持ち。",
      "notMeaningJa": "社交的かどうかの話ではありません。"
    },
    {
      "dimensionId": "seicho",
      "nameJa": "のびしろの手応え",
      "definitionJa": "できることが増えていく感覚を確かめたい気持ち。",
      "notMeaningJa": "向上心の強さの採点ではありません。"
    },
    {
      "dimensionId": "yakuwari",
      "nameJa": "役に立つ実感",
      "definitionJa": "だれかの力になれている実感を確かめたい気持ち。",
      "notMeaningJa": "自己犠牲的という意味ではありません。"
    },
    {
      "dimensionId": "totonoi",
      "nameJa": "暮らしの整い",
      "definitionJa": "生活のリズムと余白が保たれていることを大事にしたい気持ち。",
      "notMeaningJa": "几帳面さの採点ではありません。"
    },
    {
      "dimensionId": "jikkan",
      "nameJa": "心が動く瞬間",
      "definitionJa": "楽しさ、面白さ、心が動く体験を近くに置いておきたい気持ち。",
      "notMeaningJa": "飽きっぽさという評価ではありません。"
    }
  ],
  "dimensionAppearances": {
    "anshin": 14,
    "pace": 13,
    "tsunagari": 14,
    "seicho": 14,
    "yakuwari": 13,
    "totonoi": 14,
    "jikkan": 14
  },
  "items": [
    {
      "itemId": "VAL_Q01",
      "pair": [
        "anshin",
        "pace"
      ],
      "promptJa": "転職や異動を考えるとき、心が向くのは",
      "choiceA": {
        "textJa": "長くつづけられそうな安心感",
        "dimension": "anshin"
      },
      "choiceB": {
        "textJa": "進め方を自分で決められる裁量",
        "dimension": "pace"
      },
      "sensitivity": "work_context"
    },
    {
      "itemId": "VAL_Q02",
      "pair": [
        "anshin",
        "tsunagari"
      ],
      "promptJa": "住む場所を選ぶなら、より重視したいのは",
      "choiceA": {
        "textJa": "生活の安定と安心",
        "dimension": "anshin"
      },
      "choiceB": {
        "textJa": "大切な人たちとの近さ",
        "dimension": "tsunagari"
      },
      "sensitivity": "relationship_context"
    },
    {
      "itemId": "VAL_Q03",
      "pair": [
        "anshin",
        "seicho"
      ],
      "promptJa": "新しい役割の打診があったら",
      "choiceA": {
        "textJa": "いまの確実な役割を大事にしたい",
        "dimension": "anshin"
      },
      "choiceB": {
        "textJa": "未経験でも伸びそうな方を試したい",
        "dimension": "seicho"
      },
      "sensitivity": "work_context"
    },
    {
      "itemId": "VAL_Q04",
      "pair": [
        "anshin",
        "yakuwari"
      ],
      "promptJa": "新しい場に入って、最初にしたいのは",
      "choiceA": {
        "textJa": "様子をつかんで、足場を固めること",
        "dimension": "anshin"
      },
      "choiceB": {
        "textJa": "できる役割を、引き受けてみること",
        "dimension": "yakuwari"
      },
      "sensitivity": "none"
    },
    {
      "itemId": "VAL_Q05",
      "pair": [
        "anshin",
        "totonoi"
      ],
      "promptJa": "日曜の夕方にやりたくなるのは",
      "choiceA": {
        "textJa": "来週の予定を確かめて安心する",
        "dimension": "anshin"
      },
      "choiceB": {
        "textJa": "部屋と持ちものをととのえる",
        "dimension": "totonoi"
      },
      "sensitivity": "none"
    },
    {
      "itemId": "VAL_Q06",
      "pair": [
        "anshin",
        "jikkan"
      ],
      "promptJa": "連休の過ごし方として心地よいのは",
      "choiceA": {
        "textJa": "予定を決めて見通しよく過ごす",
        "dimension": "anshin"
      },
      "choiceB": {
        "textJa": "その場で心が動く方へ行く",
        "dimension": "jikkan"
      },
      "sensitivity": "none"
    },
    {
      "itemId": "VAL_Q07",
      "pair": [
        "pace",
        "tsunagari"
      ],
      "promptJa": "誘いが重なった夜、先に守りたいのは",
      "choiceA": {
        "textJa": "自分の予定と自分の時間",
        "dimension": "pace"
      },
      "choiceB": {
        "textJa": "会いたい人との時間",
        "dimension": "tsunagari"
      },
      "sensitivity": "relationship_context"
    },
    {
      "itemId": "VAL_Q08",
      "pair": [
        "pace",
        "seicho"
      ],
      "promptJa": "なにかを学ぶなら、合っているのは",
      "choiceA": {
        "textJa": "自分の速度で進められるやり方",
        "dimension": "pace"
      },
      "choiceB": {
        "textJa": "少し背伸びが必要な環境",
        "dimension": "seicho"
      },
      "sensitivity": "none"
    },
    {
      "itemId": "VAL_Q09",
      "pair": [
        "pace",
        "yakuwari"
      ],
      "promptJa": "頼まれごとが増えてきたとき",
      "choiceA": {
        "textJa": "予定を見直して、自分のペースを保つ",
        "dimension": "pace"
      },
      "choiceB": {
        "textJa": "段取りを組み直して、引き受ける",
        "dimension": "yakuwari"
      },
      "sensitivity": "none"
    },
    {
      "itemId": "VAL_Q10",
      "pair": [
        "pace",
        "totonoi"
      ],
      "promptJa": "平日の夜に近いのは",
      "choiceA": {
        "textJa": "気の向くままに過ごす",
        "dimension": "pace"
      },
      "choiceB": {
        "textJa": "いつものリズムで過ごす",
        "dimension": "totonoi"
      },
      "sensitivity": "none"
    },
    {
      "itemId": "VAL_Q11",
      "pair": [
        "pace",
        "jikkan"
      ],
      "promptJa": "旅の魅力を選ぶなら",
      "choiceA": {
        "textJa": "しばられない自由さ",
        "dimension": "pace"
      },
      "choiceB": {
        "textJa": "心が動く体験",
        "dimension": "jikkan"
      },
      "sensitivity": "none"
    },
    {
      "itemId": "VAL_Q12",
      "pair": [
        "tsunagari",
        "seicho"
      ],
      "promptJa": "講座やイベントのあと、好きな時間は",
      "choiceA": {
        "textJa": "参加者と話してつながる時間",
        "dimension": "tsunagari"
      },
      "choiceB": {
        "textJa": "学んだことをひとりで深める時間",
        "dimension": "seicho"
      },
      "sensitivity": "none"
    },
    {
      "itemId": "VAL_Q13",
      "pair": [
        "tsunagari",
        "yakuwari"
      ],
      "promptJa": "友人から相談を受けたら",
      "choiceA": {
        "textJa": "まず、そばで聞いていたい",
        "dimension": "tsunagari"
      },
      "choiceB": {
        "textJa": "力になれる方法を探したい",
        "dimension": "yakuwari"
      },
      "sensitivity": "relationship_context"
    },
    {
      "itemId": "VAL_Q14",
      "pair": [
        "tsunagari",
        "totonoi"
      ],
      "promptJa": "疲れた週の回復のしかたに近いのは",
      "choiceA": {
        "textJa": "気の置けない人と過ごす",
        "dimension": "tsunagari"
      },
      "choiceB": {
        "textJa": "ひとりで暮らしをととのえる",
        "dimension": "totonoi"
      },
      "sensitivity": "none"
    },
    {
      "itemId": "VAL_Q15",
      "pair": [
        "tsunagari",
        "jikkan"
      ],
      "promptJa": "集まりに行くなら惹かれるのは",
      "choiceA": {
        "textJa": "いつもの気の合う顔ぶれ",
        "dimension": "tsunagari"
      },
      "choiceB": {
        "textJa": "初めての面白そうな場",
        "dimension": "jikkan"
      },
      "sensitivity": "none"
    },
    {
      "itemId": "VAL_Q16",
      "pair": [
        "seicho",
        "yakuwari"
      ],
      "promptJa": "仕事で役割を選べるなら",
      "choiceA": {
        "textJa": "新しい力が身につく役割",
        "dimension": "seicho"
      },
      "choiceB": {
        "textJa": "人の役に立つ実感がある役割",
        "dimension": "yakuwari"
      },
      "sensitivity": "work_context"
    },
    {
      "itemId": "VAL_Q17",
      "pair": [
        "seicho",
        "totonoi"
      ],
      "promptJa": "朝に30分の余白があったら",
      "choiceA": {
        "textJa": "学びや練習にあてたい",
        "dimension": "seicho"
      },
      "choiceB": {
        "textJa": "暮らしをととのえることにあてたい",
        "dimension": "totonoi"
      },
      "sensitivity": "none"
    },
    {
      "itemId": "VAL_Q18",
      "pair": [
        "seicho",
        "jikkan"
      ],
      "promptJa": "習いごとを選ぶ決め手は",
      "choiceA": {
        "textJa": "上達の手応えがあること",
        "dimension": "seicho"
      },
      "choiceB": {
        "textJa": "とにかく楽しいと思えること",
        "dimension": "jikkan"
      },
      "sensitivity": "none"
    },
    {
      "itemId": "VAL_Q19",
      "pair": [
        "yakuwari",
        "totonoi"
      ],
      "promptJa": "身近な集まりや当番ごとでは",
      "choiceA": {
        "textJa": "役割を引き受けて力になりたい",
        "dimension": "yakuwari"
      },
      "choiceB": {
        "textJa": "まず自分の生活の整いを保ちたい",
        "dimension": "totonoi"
      },
      "sensitivity": "none"
    },
    {
      "itemId": "VAL_Q20",
      "pair": [
        "yakuwari",
        "jikkan"
      ],
      "promptJa": "週末、どちらか一方に行けるなら",
      "choiceA": {
        "textJa": "自分が力になれる集まり",
        "dimension": "yakuwari"
      },
      "choiceB": {
        "textJa": "心が動きそうな集まり",
        "dimension": "jikkan"
      },
      "sensitivity": "none"
    },
    {
      "itemId": "VAL_Q21",
      "pair": [
        "totonoi",
        "jikkan"
      ],
      "promptJa": "「良い一日だった」と思うのは",
      "choiceA": {
        "textJa": "整った、落ち着いた一日",
        "dimension": "totonoi"
      },
      "choiceB": {
        "textJa": "心が動いた、あたらしい一日",
        "dimension": "jikkan"
      },
      "sensitivity": "none"
    },
    {
      "itemId": "VAL_Q22",
      "pair": [
        "anshin",
        "pace"
      ],
      "promptJa": "大きめの買いものを決めるとき",
      "choiceA": {
        "textJa": "納得いくまで自分のペースで選びたい",
        "dimension": "pace"
      },
      "choiceB": {
        "textJa": "実績や保証のある安心な方にしたい",
        "dimension": "anshin"
      },
      "sensitivity": "none"
    },
    {
      "itemId": "VAL_Q23",
      "pair": [
        "anshin",
        "tsunagari"
      ],
      "promptJa": "不安なことがあった夜は",
      "choiceA": {
        "textJa": "人と話して落ち着きたい",
        "dimension": "tsunagari"
      },
      "choiceB": {
        "textJa": "調べて見通しを立てて落ち着きたい",
        "dimension": "anshin"
      },
      "sensitivity": "emotional_context"
    },
    {
      "itemId": "VAL_Q24",
      "pair": [
        "anshin",
        "seicho"
      ],
      "promptJa": "これからの理想に近いのは",
      "choiceA": {
        "textJa": "できることが増えつづけること",
        "dimension": "seicho"
      },
      "choiceB": {
        "textJa": "足場が揺らがないこと",
        "dimension": "anshin"
      },
      "sensitivity": "none"
    },
    {
      "itemId": "VAL_Q25",
      "pair": [
        "anshin",
        "yakuwari"
      ],
      "promptJa": "催しや集まりに関わるなら",
      "choiceA": {
        "textJa": "運営や手伝いの側で、動きたい",
        "dimension": "yakuwari"
      },
      "choiceB": {
        "textJa": "参加する側で、見通しよく楽しみたい",
        "dimension": "anshin"
      },
      "sensitivity": "none"
    },
    {
      "itemId": "VAL_Q26",
      "pair": [
        "anshin",
        "totonoi"
      ],
      "promptJa": "新生活の最初の週にやりたいのは",
      "choiceA": {
        "textJa": "部屋と生活リズムをととのえる",
        "dimension": "totonoi"
      },
      "choiceB": {
        "textJa": "手続きと備えを先に固める",
        "dimension": "anshin"
      },
      "sensitivity": "none"
    },
    {
      "itemId": "VAL_Q27",
      "pair": [
        "anshin",
        "jikkan"
      ],
      "promptJa": "外食のお店を選ぶなら",
      "choiceA": {
        "textJa": "気になっていた新しい店",
        "dimension": "jikkan"
      },
      "choiceB": {
        "textJa": "味の分かっている定番の店",
        "dimension": "anshin"
      },
      "sensitivity": "none"
    },
    {
      "itemId": "VAL_Q28",
      "pair": [
        "pace",
        "tsunagari"
      ],
      "promptJa": "長い休みの計画は",
      "choiceA": {
        "textJa": "大切な人との予定から決める",
        "dimension": "tsunagari"
      },
      "choiceB": {
        "textJa": "まず自分の自由な時間を確保する",
        "dimension": "pace"
      },
      "sensitivity": "relationship_context"
    },
    {
      "itemId": "VAL_Q29",
      "pair": [
        "pace",
        "seicho"
      ],
      "promptJa": "上達が止まったと感じたら",
      "choiceA": {
        "textJa": "負荷を上げて壁を越えたい",
        "dimension": "seicho"
      },
      "choiceB": {
        "textJa": "ペースを落としてでも続けたい",
        "dimension": "pace"
      },
      "sensitivity": "none"
    },
    {
      "itemId": "VAL_Q30",
      "pair": [
        "pace",
        "yakuwari"
      ],
      "promptJa": "チームでの役回りとして選びやすいのは",
      "choiceA": {
        "textJa": "頼られる調整役",
        "dimension": "yakuwari"
      },
      "choiceB": {
        "textJa": "自分の裁量が保てる役割",
        "dimension": "pace"
      },
      "sensitivity": "work_context"
    },
    {
      "itemId": "VAL_Q31",
      "pair": [
        "pace",
        "totonoi"
      ],
      "promptJa": "休日の午前に近いのは",
      "choiceA": {
        "textJa": "いつもの家事や習慣を先に済ませる",
        "dimension": "totonoi"
      },
      "choiceB": {
        "textJa": "その日の気分で決める",
        "dimension": "pace"
      },
      "sensitivity": "none"
    },
    {
      "itemId": "VAL_Q32",
      "pair": [
        "pace",
        "jikkan"
      ],
      "promptJa": "面白そうな急な誘いが来たら",
      "choiceA": {
        "textJa": "心が動いたら乗る",
        "dimension": "jikkan"
      },
      "choiceB": {
        "textJa": "自分の予定は崩したくない",
        "dimension": "pace"
      },
      "sensitivity": "none"
    },
    {
      "itemId": "VAL_Q33",
      "pair": [
        "tsunagari",
        "seicho"
      ],
      "promptJa": "転機のときに頼りにしたいのは",
      "choiceA": {
        "textJa": "学んで力をつけること",
        "dimension": "seicho"
      },
      "choiceB": {
        "textJa": "信頼できる人とのつながり",
        "dimension": "tsunagari"
      },
      "sensitivity": "none"
    },
    {
      "itemId": "VAL_Q34",
      "pair": [
        "tsunagari",
        "yakuwari"
      ],
      "promptJa": "職場や学校でうれしいのは",
      "choiceA": {
        "textJa": "「助かった」と言われること",
        "dimension": "yakuwari"
      },
      "choiceB": {
        "textJa": "気持ちよく雑談できる関係",
        "dimension": "tsunagari"
      },
      "sensitivity": "work_context"
    },
    {
      "itemId": "VAL_Q35",
      "pair": [
        "tsunagari",
        "totonoi"
      ],
      "promptJa": "平日の夜の連絡ごとについて近いのは",
      "choiceA": {
        "textJa": "夜のリズムは崩したくない",
        "dimension": "totonoi"
      },
      "choiceB": {
        "textJa": "やりとりの時間を大事にしたい",
        "dimension": "tsunagari"
      },
      "sensitivity": "relationship_context"
    },
    {
      "itemId": "VAL_Q36",
      "pair": [
        "tsunagari",
        "jikkan"
      ],
      "promptJa": "記憶に残っているのは、どちらの時間",
      "choiceA": {
        "textJa": "初めての体験に飛び込んだ時間",
        "dimension": "jikkan"
      },
      "choiceB": {
        "textJa": "大切な人と笑っていた時間",
        "dimension": "tsunagari"
      },
      "sensitivity": "relationship_context"
    },
    {
      "itemId": "VAL_Q37",
      "pair": [
        "seicho",
        "yakuwari"
      ],
      "promptJa": "新しく時間を使うなら",
      "choiceA": {
        "textJa": "人をサポートする側の活動",
        "dimension": "yakuwari"
      },
      "choiceB": {
        "textJa": "自分が学ぶ側の活動",
        "dimension": "seicho"
      },
      "sensitivity": "none"
    },
    {
      "itemId": "VAL_Q38",
      "pair": [
        "seicho",
        "totonoi"
      ],
      "promptJa": "平日の夜、自由な1時間があったら",
      "choiceA": {
        "textJa": "部屋やあすの段取りをととのえる",
        "dimension": "totonoi"
      },
      "choiceB": {
        "textJa": "気になっていた学びを進める",
        "dimension": "seicho"
      },
      "sensitivity": "none"
    },
    {
      "itemId": "VAL_Q39",
      "pair": [
        "seicho",
        "jikkan"
      ],
      "promptJa": "続いている趣味の、続いている理由は",
      "choiceA": {
        "textJa": "単純に楽しいから",
        "dimension": "jikkan"
      },
      "choiceB": {
        "textJa": "上達の手応えがあるから",
        "dimension": "seicho"
      },
      "sensitivity": "none"
    },
    {
      "itemId": "VAL_Q40",
      "pair": [
        "yakuwari",
        "totonoi"
      ],
      "promptJa": "予定の詰まった週に、新しい頼まれごとが来たら",
      "choiceA": {
        "textJa": "「来週なら」と時期を提案する",
        "dimension": "totonoi"
      },
      "choiceB": {
        "textJa": "予定を組み替えて応じる",
        "dimension": "yakuwari"
      },
      "sensitivity": "none"
    },
    {
      "itemId": "VAL_Q41",
      "pair": [
        "yakuwari",
        "jikkan"
      ],
      "promptJa": "満たされた気持ちになるのは",
      "choiceA": {
        "textJa": "心が動く体験をしたとき",
        "dimension": "jikkan"
      },
      "choiceB": {
        "textJa": "誰かの役に立てたとき",
        "dimension": "yakuwari"
      },
      "sensitivity": "none"
    },
    {
      "itemId": "VAL_Q42",
      "pair": [
        "totonoi",
        "jikkan"
      ],
      "promptJa": "部屋に手を入れるなら",
      "choiceA": {
        "textJa": "心が動く遊び心を足したい",
        "dimension": "jikkan"
      },
      "choiceB": {
        "textJa": "使いやすくととのえたい",
        "dimension": "totonoi"
      },
      "sensitivity": "none"
    },
    {
      "itemId": "VAL_Q43",
      "pair": [
        "anshin",
        "seicho"
      ],
      "promptJa": "資格やスキルの勉強を始めるなら、動機に近いのは",
      "choiceA": {
        "textJa": "先々の安心につながるから",
        "dimension": "anshin"
      },
      "choiceB": {
        "textJa": "できることを増やしたいから",
        "dimension": "seicho"
      },
      "sensitivity": "none"
    },
    {
      "itemId": "VAL_Q44",
      "pair": [
        "pace",
        "totonoi"
      ],
      "promptJa": "暮らしの理想に近いのは",
      "choiceA": {
        "textJa": "よい習慣が決まってまわっている",
        "dimension": "totonoi"
      },
      "choiceB": {
        "textJa": "その時々で自由に組み替えられる",
        "dimension": "pace"
      },
      "sensitivity": "none"
    },
    {
      "itemId": "VAL_Q45",
      "pair": [
        "tsunagari",
        "jikkan"
      ],
      "promptJa": "週末に出かけるなら",
      "choiceA": {
        "textJa": "いつもの人と、ゆっくり深く",
        "dimension": "tsunagari"
      },
      "choiceB": {
        "textJa": "面白そうなら知らない場でも",
        "dimension": "jikkan"
      },
      "sensitivity": "relationship_context"
    },
    {
      "itemId": "VAL_Q46",
      "pair": [
        "seicho",
        "yakuwari"
      ],
      "promptJa": "人に教える立場になったら、うれしいのは",
      "choiceA": {
        "textJa": "相手の力になれていること",
        "dimension": "yakuwari"
      },
      "choiceB": {
        "textJa": "教えることで自分も伸びること",
        "dimension": "seicho"
      },
      "sensitivity": "none"
    },
    {
      "itemId": "VAL_Q47",
      "pair": [
        "anshin",
        "tsunagari"
      ],
      "promptJa": "大きな決断の前にしたいのは",
      "choiceA": {
        "textJa": "信頼する人に相談する",
        "dimension": "tsunagari"
      },
      "choiceB": {
        "textJa": "情報を集めて見通しを固める",
        "dimension": "anshin"
      },
      "sensitivity": "emotional_context"
    },
    {
      "itemId": "VAL_Q48",
      "pair": [
        "totonoi",
        "jikkan"
      ],
      "promptJa": "理想の平日の夜に近いのは",
      "choiceA": {
        "textJa": "整った部屋で静かに過ごす",
        "dimension": "totonoi"
      },
      "choiceB": {
        "textJa": "予定外の楽しいことが起きる",
        "dimension": "jikkan"
      },
      "sensitivity": "none"
    }
  ],
  "scoring": {
    "model": "pairwise win-rate",
    "requiredAnsweredItems": 48,
    "insufficientCoverageCopyJa": "あと{remaining}問こたえると、結果が出せます。とちゅうから再開できます。",
    "mixedThreshold": 0.05,
    "confidenceBoundaryJa": "このテストは、統計的に検証された確信度スコアを提供するものではありません。いまの選び方の傾向を、ことばで整理するためのものです。"
  },
  "secondarySignal": {
    "labelJa": "もうひとつ近かった軸",
    "mixedCloseSetLabelJa": "同じくらい近かった軸"
  },
  "results": [
    {
      "resultId": "VAL_R_ANSHIN",
      "primaryDimension": "anshin",
      "public": {
        "displayNameJa": "見通しを確かめたい時期",
        "hookJa": "いまは、足場をたしかめながら進みたいとき。",
        "recognitionJa": "最近の選び方には「先が読めること」を大事にする傾向が出ています。",
        "bulletsJa": [
          "決める前に、確かめたくなる",
          "備えがあると、動きやすくなる",
          "実績のある選択肢に手が伸びる"
        ],
        "gentleNextStepJa": "確かめたいことを、ひとつだけ紙に書き出してみる。",
        "shareLineJa": "決める前に、いったん確かめたい派でした。"
      },
      "private": {
        "detailJa": "安心は臆病さではなく、次に動くための足場づくりです。いまのあなたの選び方は、揺れの少ない土台を先に確保しようとしています。",
        "currentPriorityPatternJa": "「読めること」を基準に選びやすい。読めない選択肢は、内容が良くても後回しになりやすい。",
        "innerTensionJa": "のびしろや心が動く体験への気持ちと、見通しへの気持ちが引っ張り合うことがあります。",
        "workContextJa": "仕事では、確実に果たせる役割を選びやすい時期。挑戦は「小さく試せる形」なら受け取りやすい。",
        "relationshipContextJa": "関係でも見通しを求めやすく、あいまいな距離感が続くと消耗しやすい。",
        "dailyLifeContextJa": "回答では、備えや確認にあたる選択が多めでした。決まっていない予定の多い週は、負荷が上がりやすいかもしれません。",
        "overlookedNeedJa": "確かめる作業のなかで、休むことが後回しになっていないか。",
        "overextensionRiskJa": "すべてを確かめようとすると、動き出せなくなることがある。確かめる範囲を絞るのがこつ。",
        "correctionPromptJa": "この読みが違うと感じたら、それが正解です。近い方に直してください。",
        "reportBridgeJa": "レポートでは、見通しの安心が他の6つの軸とどう釣り合っているかを見られます。",
        "recommendationTags": [
          "need_order",
          "need_rest"
        ],
        "nextTests": [
          "c02-current-state",
          "daily-check-in"
        ],
        "recommendations": [
          {
            "tag": "need_order",
            "fitReasonJa": "備え・確認を選ぶ回答パターンに、整えごと系のヒントが対応するため",
            "evidenceSource": "anshin chosen on >=3 of its preparation/order-flavored items",
            "consent": "recommendation purpose consent required",
            "boundary": "private-only; never in share/URL"
          },
          {
            "tag": "need_rest",
            "fitReasonJa": "確認ごとに時間を使う選択が続く場合の休息ヒントとして",
            "evidenceSource": "anshin win-rate >= 0.7 (one-sided pattern)",
            "consent": "recommendation purpose consent required",
            "boundary": "private-only"
          }
        ]
      }
    },
    {
      "resultId": "VAL_R_PACE",
      "primaryDimension": "pace",
      "public": {
        "displayNameJa": "自分のペースを守りたい時期",
        "hookJa": "いまは、自分の速度がいちばんの基準。",
        "recognitionJa": "最近の選び方には「自分で決めて、自分の速度で進むこと」を守る傾向が出ています。",
        "bulletsJa": [
          "裁量のある方を選びたくなる",
          "急かされると消耗しやすい",
          "予定は詰めすぎたくない"
        ],
        "gentleNextStepJa": "今週、誰にも渡さない自分の時間をひと枠だけ確保する。",
        "shareLineJa": "予定は詰めすぎない。いまはそれが最優先みたい。"
      },
      "private": {
        "detailJa": "ペースを守りたい気持ちは、周りへの拒否ではなく、自分の質を保つ方法です。いまの選び方は、速度の主導権を自分の側に置いています。",
        "currentPriorityPatternJa": "「自分で決められるか」を基準に選びやすい。良い話でも、速度を奪われそうだと引きやすい。",
        "innerTensionJa": "つながりや役に立ちたい気持ちと、ペースを守りたい気持ちが引っ張り合いやすい。",
        "workContextJa": "裁量のある進め方だと力が出る時期。細かい管理下では消耗しやすい。",
        "relationshipContextJa": "距離を調整したい時期は、意図が伝わりにくいことがあります。ひとこと添えると誤解が減るかもしれません。",
        "dailyLifeContextJa": "余白のある予定表が回復につながる。空白の時間は、さぼりではなく燃料。",
        "overlookedNeedJa": "ペースを守る理由を、大切な人に伝えられているか。",
        "overextensionRiskJa": "守りが強くなりすぎる場合は、助けを借りる選択肢が視野から外れることもあります。",
        "correctionPromptJa": "この読みが違うと感じたら、近い方に直してください。それがこの記録の正しい使い方です。",
        "reportBridgeJa": "レポートでは、ペースの軸がどの場面で強く出るかを見られます。",
        "recommendationTags": [
          "need_solo",
          "need_rest"
        ],
        "nextTests": [
          "work-rhythm",
          "daily-check-in"
        ],
        "recommendations": [
          {
            "tag": "need_solo",
            "fitReasonJa": "自分の時間を守る回答パターンに対応するため",
            "evidenceSource": "pace chosen over tsunagari/yakuwari on >=3 of those items",
            "consent": "recommendation purpose consent required",
            "boundary": "private-only"
          },
          {
            "tag": "need_rest",
            "fitReasonJa": "ペースを守る選択が強い場合の休息ヒントとして",
            "evidenceSource": "pace win-rate >= 0.7",
            "consent": "recommendation purpose consent required",
            "boundary": "private-only"
          }
        ]
      }
    },
    {
      "resultId": "VAL_R_TSUNAGARI",
      "primaryDimension": "tsunagari",
      "public": {
        "displayNameJa": "あたたかさを近くに置きたい時期",
        "hookJa": "いまは、人のあたたかさが効くとき。",
        "recognitionJa": "最近の選び方には「大切な人との時間」を先に置く傾向が出ています。",
        "bulletsJa": [
          "会って話すと回復する",
          "大切な人の予定を先に確保する",
          "ひとりが続くと乾きやすい"
        ],
        "gentleNextStepJa": "会いたい人にひとこと、短い連絡をしてみる。",
        "shareLineJa": "会って話すと回復するタイプ、いまのわたし。"
      },
      "private": {
        "detailJa": "選び方のうえで、あたたかい関わりが優先されています。これは依存ではなく、いまのあなたの選び方の特徴です。",
        "currentPriorityPatternJa": "「誰といるか」を基準に選びやすい。内容よりも顔ぶれで決まることがある。",
        "innerTensionJa": "自分のペースや暮らしの整いと、人との時間が引っ張り合いやすい。",
        "workContextJa": "関係の良いチームだと力が出る時期。孤立した作業が続くと消耗しやすい。",
        "relationshipContextJa": "回答では、関わりに時間を割く選択が多めでした。受け取る側になる時間も、同じくらい選択肢に入れてよいかもしれません。",
        "dailyLifeContextJa": "回答の傾向からは、短いやりとりにも時間を割きたい時期に見えます。長い集まりである必要はありません。",
        "overlookedNeedJa": "会えない日の過ごし方を、自分なりに持てているか。",
        "overextensionRiskJa": "相手に合わせる選択が続く場合、自分の残量が後回しになることがあります。",
        "correctionPromptJa": "違うと感じたら、近い方に直してください。",
        "reportBridgeJa": "レポートでは、つながりの温度と自分のペースの釣り合いを見られます。",
        "recommendationTags": [
          "need_connect"
        ],
        "nextTests": [
          "relationship-fatigue-24q",
          "daily-check-in"
        ],
        "recommendations": [
          {
            "tag": "need_connect",
            "fitReasonJa": "人との時間を選ぶ回答パターンに対応するため",
            "evidenceSource": "tsunagari chosen on >=3 relationship_context items",
            "consent": "recommendation purpose consent required",
            "boundary": "private-only"
          }
        ]
      }
    },
    {
      "resultId": "VAL_R_SEICHO",
      "primaryDimension": "seicho",
      "public": {
        "displayNameJa": "のびしろに手を伸ばしたい時期",
        "hookJa": "いまは、少し背伸びがしたいとき。",
        "recognitionJa": "最近の選び方には「できることが増える方」へ向かう傾向が出ています。",
        "bulletsJa": [
          "停滞すると物足りなくなる",
          "少し難しい方に惹かれる",
          "学びに時間を回したくなる"
        ],
        "gentleNextStepJa": "伸ばしたいことをひとつ選び、15分だけ手をつけてみる。",
        "shareLineJa": "ちょっと難しいほうを選びたくなってるらしい。"
      },
      "private": {
        "detailJa": "手応えを求める気持ちが強まっている時期です。挑戦の選択肢が、安心や整いより先に目に入るようになっています。",
        "currentPriorityPatternJa": "「伸びるかどうか」を基準に選びやすい。成長が見えない環境からは気持ちが離れやすい。",
        "innerTensionJa": "見通しの安心や暮らしの整いと、背伸びしたい気持ちが引っ張り合いやすい。",
        "workContextJa": "新しい領域を任されると力が出る時期。同じ作業の繰り返しは消耗のもと。",
        "relationshipContextJa": "挑戦に時間を回す選択が続く場合は、そのことを周りに伝えておくと誤解が減ります。",
        "dailyLifeContextJa": "学びの時間が確保できた日は満足度が高い。詰め込みすぎには注意。",
        "overlookedNeedJa": "伸びること以外の回復——休みや遊び——が痩せていないか。",
        "overextensionRiskJa": "負荷を上げ続けると、楽しさが義務に変わりやすい。",
        "correctionPromptJa": "違うと感じたら、近い方に直してください。",
        "reportBridgeJa": "レポートでは、のびしろの軸と安心・整いの軸の釣り合いを見られます。",
        "recommendationTags": [
          "content_learning",
          "need_small_win"
        ],
        "nextTests": [
          "f01-work-fit",
          "c02-current-state"
        ],
        "recommendations": [
          {
            "tag": "content_learning",
            "fitReasonJa": "学び・挑戦を選ぶ回答パターンに対応するため",
            "evidenceSource": "seicho chosen on >=3 learning-flavored items",
            "consent": "recommendation purpose consent required",
            "boundary": "private-only"
          },
          {
            "tag": "need_small_win",
            "fitReasonJa": "手応えを求める回答パターンに対応するため",
            "evidenceSource": "seicho win-rate >= 0.7",
            "consent": "recommendation purpose consent required",
            "boundary": "private-only"
          }
        ]
      }
    },
    {
      "resultId": "VAL_R_YAKUWARI",
      "primaryDimension": "yakuwari",
      "public": {
        "displayNameJa": "役に立つ実感を確かめたい時期",
        "hookJa": "いまは、「助かった」のひとことが効くとき。",
        "recognitionJa": "最近の選び方には「誰かの力になれること」を優先する傾向が出ています。",
        "bulletsJa": [
          "頼まれると応えたくなる",
          "役に立てた日は満ちる",
          "調整役を引き受けやすい"
        ],
        "gentleNextStepJa": "今週引き受けたことをひとつ数えて、自分にも「よくやった」と言う。",
        "shareLineJa": "「助かった」の一言がいちばん効く時期でした。"
      },
      "private": {
        "detailJa": "貢献の実感は、あなたにとって大きな燃料になっています。ただしこの軸は、残量を超えて働きやすい軸でもあります。",
        "currentPriorityPatternJa": "回答では「力になれるか」を基準にした選択が多めでした。",
        "innerTensionJa": "自分のペースや暮らしの整いと、応えたい気持ちが引っ張り合いやすい。",
        "workContextJa": "感謝が見える環境だと力が出る時期。貢献が数字でしか測られない場では乾きやすい。",
        "relationshipContextJa": "応じる側の選択が続く場合は、役割を降りる時間をつくることも選択肢になります。",
        "dailyLifeContextJa": "回答では、自分の時間より応じることが先に選ばれやすい傾向が出ています。自分の時間の優先度を、意識的に決めどころに乗せるのがこの時期の論点です。",
        "overlookedNeedJa": "あなた自身は、誰に頼れているか。",
        "overextensionRiskJa": "応じる選択がほぼ一方向に偏っている場合、余力の配分が論点になります。",
        "correctionPromptJa": "違うと感じたら、近い方に直してください。",
        "reportBridgeJa": "レポートでは、役に立つ実感と自分のペースの釣り合いを見られます。",
        "recommendationTags": [
          "need_rest",
          "need_solo"
        ],
        "nextTests": [
          "relationship-fatigue-24q",
          "daily-check-in"
        ],
        "recommendations": [
          {
            "tag": "need_rest",
            "fitReasonJa": "応じる選択が一方向に偏る場合の休息ヒントとして",
            "evidenceSource": "yakuwari chosen over pace/totonoi on >=3 of those items",
            "consent": "recommendation purpose consent required",
            "boundary": "private-only"
          },
          {
            "tag": "need_solo",
            "fitReasonJa": "自分の時間が後回しになる回答パターンに対応するため",
            "evidenceSource": "yakuwari win-rate >= 0.7",
            "consent": "recommendation purpose consent required",
            "boundary": "private-only"
          }
        ]
      }
    },
    {
      "resultId": "VAL_R_TOTONOI",
      "primaryDimension": "totonoi",
      "public": {
        "displayNameJa": "暮らしをととのえたい時期",
        "hookJa": "いまは、リズムと余白がいちばんの味方。",
        "recognitionJa": "最近の選び方には「生活の整い」を守る傾向が出ています。",
        "bulletsJa": [
          "いつもの習慣が崩れると疲れる",
          "片づくと気持ちも片づく",
          "夜のリズムを守りたい"
        ],
        "gentleNextStepJa": "今夜、ひとつだけ小さく片づける場所を決める。",
        "shareLineJa": "いつものリズムが崩れると弱い。当たってる。"
      },
      "private": {
        "detailJa": "整いを求めるのは退屈さではなく、回復と集中の土台づくりです。いまの選び方は、生活のリズムを守ろうとしています。",
        "currentPriorityPatternJa": "「リズムが守れるか」を基準に選びやすい。楽しそうな話でも、生活が乱れそうだと引きやすい。",
        "innerTensionJa": "つながりや心が動く体験と、整いを守りたい気持ちが引っ張り合いやすい。",
        "workContextJa": "回答の傾向では、決まった流れのある進め方が選ばれやすくなっています。突発対応の続く時期は消耗しやすいかもしれません。",
        "relationshipContextJa": "リズムを守る選択が続くと、誘いを見送る場面もあるかもしれません。そのときは理由をひとこと添えるのがこつです。",
        "dailyLifeContextJa": "小さな片づけ・同じ時間の食事と睡眠が効く時期。",
        "overlookedNeedJa": "整えた先で、なにをしたいのか。整い自体が目的化していないか。",
        "overextensionRiskJa": "乱れを許せなくなると、整いが窮屈さに変わることがある。",
        "correctionPromptJa": "違うと感じたら、近い方に直してください。",
        "reportBridgeJa": "レポートでは、暮らしの整いと心が動く瞬間の釣り合いを見られます。",
        "recommendationTags": [
          "need_order"
        ],
        "nextTests": [
          "work-rhythm",
          "daily-check-in"
        ],
        "recommendations": [
          {
            "tag": "need_order",
            "fitReasonJa": "リズムと整いを選ぶ回答パターンに対応するため",
            "evidenceSource": "totonoi chosen on >=3 order-flavored items",
            "consent": "recommendation purpose consent required",
            "boundary": "private-only"
          }
        ]
      }
    },
    {
      "resultId": "VAL_R_JIKKAN",
      "primaryDimension": "jikkan",
      "public": {
        "displayNameJa": "心が動くほうへ行きたい時期",
        "hookJa": "いまは、「面白そう」を信じていいとき。",
        "recognitionJa": "最近の選び方には「心が動くかどうか」を優先する傾向が出ています。",
        "bulletsJa": [
          "初めての場に惹かれる",
          "「面白そう」で動ける",
          "変化のない日が続くと乾く"
        ],
        "gentleNextStepJa": "今週、いつもと違う小さな選択をひとつだけしてみる。",
        "shareLineJa": "「面白そう」で動いていい時期だそうです。"
      },
      "private": {
        "detailJa": "心が動く体験を選ぶ傾向が強まっています。回答のうえでは、それが逃避ではなく、いまの選び方の中心にあります。",
        "currentPriorityPatternJa": "「心が動くか」を基準に選びやすい。正しいけれど退屈な選択肢からは気持ちが離れやすい。",
        "innerTensionJa": "見通しの安心や暮らしの整いと、動きたい気持ちが引っ張り合いやすい。",
        "workContextJa": "回答の傾向では、変化のある選択が選ばれやすくなっています。単調な時期は物足りなさを感じやすいかもしれません。",
        "relationshipContextJa": "新しい出会いに向かうエネルギーが強い時期。いつもの関係の手入れも忘れずに。",
        "dailyLifeContextJa": "小さな冒険——道・店・過ごし方を変える——で十分に満ちる。大きく賭ける必要はない。",
        "overlookedNeedJa": "動き続けた後の、静かな回復の時間。",
        "overextensionRiskJa": "刺激が義務になると、楽しさの感度そのものが下がる。",
        "correctionPromptJa": "違うと感じたら、近い方に直してください。",
        "reportBridgeJa": "レポートでは、心が動く瞬間と見通しの安心の釣り合いを見られます。",
        "recommendationTags": [
          "need_change"
        ],
        "nextTests": [
          "c02-current-state",
          "daily-check-in"
        ],
        "recommendations": [
          {
            "tag": "need_change",
            "fitReasonJa": "変化・体験を選ぶ回答パターンに対応するため",
            "evidenceSource": "jikkan chosen on >=3 novelty-flavored items",
            "consent": "recommendation purpose consent required",
            "boundary": "private-only"
          }
        ]
      }
    },
    {
      "resultId": "VAL_R_MIXED",
      "primaryDimension": null,
      "public": {
        "displayNameJa": "大事なことが並ぶ時期",
        "hookJa": "いまは、いくつかの優先が同じくらい近くにあります。",
        "recognitionJa": "最近の選び方では、複数の優先軸がほぼ同じ強さで表れています。どれかひとつがはっきり先頭、という状態ではありません。",
        "bulletsJa": [
          "場面によって選ぶ基準が変わることがある",
          "どれも大事で、順位をつけていない",
          "答えの傾向に、はっきりした一位がない"
        ],
        "gentleNextStepJa": "いま同じくらい大事なものを、ふたつだけ名前にしてみる。",
        "shareLineJa": "一位が決められない結果が出た。どれも大事らしい。"
      },
      "private": {
        "detailJa": "上位の軸の差が小さい、というのがこの結果の意味のすべてです。近かった軸の名前と、その回答上の表れは、この下に示されます。",
        "currentPriorityPatternJa": "上位の軸がほぼ同じ強さで並んでいます。どの軸がどの選択で選ばれたかは、回答の記録から確認できます。",
        "innerTensionJa": "近かった軸同士が同じ場面で向かい合った回答があれば、その項目が綱引きの実例です。該当がない場合、綱引きの有無はこの結果からは分かりません。",
        "workContextJa": "仕事の場面への表れは、仕事の場面の回答が十分にある場合にだけ示されます。今回の回答から読み取れない場合、この方法では推測しません。",
        "relationshipContextJa": "人との関わりへの表れも同様に、該当する回答がある場合にだけ示されます。",
        "dailyLifeContextJa": "暮らしへの表れも、該当する回答の範囲でだけ示されます。",
        "overlookedNeedJa": "この結果から「見落としている必要」を推測することはできません。",
        "overextensionRiskJa": "この結果から「無理のしすぎ」を推測することはできません。",
        "correctionPromptJa": "違うと感じたら、近い方に直してください。",
        "reportBridgeJa": "レポートでは、近かった軸の組み合わせと、それぞれがどの回答で選ばれたかを見られます。",
        "recommendationTags": [
          "no_recommendation"
        ],
        "nextTests": [
          "daily-check-in",
          "c02-current-state"
        ],
        "recommendations": [
          {
            "tag": "no_recommendation",
            "fitReasonJa": "拮抗した結果からは、特定のヒントを導けないため（既定）",
            "evidenceSource": "default for Mixed; a hint may appear only when a separate supported answer pattern justifies it",
            "consent": "n/a",
            "boundary": "n/a"
          }
        ]
      }
    }
  ],
  "recommendationGovernedTags": [
    "need_rest",
    "need_order",
    "need_change",
    "need_connect",
    "need_solo",
    "need_small_win",
    "context_work",
    "context_relationship",
    "content_learning",
    "no_recommendation"
  ],
  "interpretationLimitsJa": "いまの選び方の傾向の整理です。性格の診断でも、優劣の判定でもありません。統計的に検証された確信度スコアは提供しません。結果は状況とともに変わります。採用・配属・評価・選考など、第三者による判断の材料には使えません。",
  "usageBoundaryJa": "この結果は、本人がじぶんの選び方をふり返るためのものです。採用・配属・人事評価・入学選考・保険や与信の判断など、第三者が人を選んだり評価したりする目的には適していません。使わないでください。",
  "privacyClass": "P1_answers_only",
  "confirmationRequired": true,
  "understandingPolicy": "method_derived_eligible"
} as const;

export type YorisouValuesDefinition = typeof YORISOU_VALUES_DEFINITION;
export type YorisouValuesDimensionId = YorisouValuesDefinition["dimensionOrder"][number];
export type YorisouValuesResultId = YorisouValuesDefinition["results"][number]["resultId"];
