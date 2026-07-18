// SR-1 — anonymous guided-experience catalogue.
//
// Reflection exercises, NOT assessments. Each experience is a short, calm,
// device-local guided reflection a stranger can run without login. There is no
// scoring, no diagnosis, no medical/therapy claim, and no crisis handling: every
// item carries an honest boundary the runner shows before the visitor begins.
//
// This file is pure data + types. It stores nothing; any free-text a visitor
// writes while stepping through stays in component state only (never persisted).

export type GuidedExperience = {
  slug: string; // url slug
  title: string;
  purpose: string; // what it's for
  whoItHelps: string; // who it may help
  estimatedTime: string; // e.g. "約2分"
  preparation: string; // one line
  steps: { prompt: string; guidance: string }[]; // 3-5 steps, each a reflective prompt + gentle guidance
  completion: string; // closing line
  reflection: string; // a reflective takeaway prompt
  boundary: string; // "これは診断ではありません…" style honest boundary
};

export const SR1_GUIDED_EXPERIENCES: readonly GuidedExperience[] = [
  {
    slug: "grounding-reflection",
    title: "2分の振り返り",
    purpose:
      "考え込まずに、今の気持ちの置き場所を見つけるための短い振り返りです。気分を少しだけ立て直したいときに使えます。",
    whoItHelps:
      "頭の中がざわついている、気持ちが宙ぶらりんで次に進めない——そんなときに向いています。",
    estimatedTime: "約2分",
    preparation: "静かに座れる場所と、深呼吸をひとつ。それだけで始められます。",
    steps: [
      {
        prompt: "今、体はどんな感じですか。",
        guidance:
          "肩・あご・呼吸のあたりに、そっと注意を向けてみます。良し悪しを決めず、ただ「今こうなっている」と気づくだけで十分です。",
      },
      {
        prompt: "その感じに、名前をつけるとしたら。",
        guidance:
          "「もやもや」「重い」「そわそわ」——ぴったりでなくて構いません。言葉にすると、気持ちと少し距離が取れます。",
      },
      {
        prompt: "今は脇に置いておけそうなことは、どれですか。",
        guidance:
          "全部を今すぐ解決しなくて大丈夫です。ひとつだけ「これは後で」と、心の中でそっと置いてみます。",
      },
      {
        prompt: "この2分のあと、できる小さなことをひとつ。",
        guidance:
          "水を一杯飲む、窓を開ける、ひと息つく——それくらいの軽さで十分です。大きな決断は要りません。",
      },
    ],
    completion:
      "おつかれさまでした。気づいて、名前をつけて、ひとつ置けたなら、それでもう十分です。",
    reflection:
      "今日の自分に、ひとことだけかけるとしたら、どんな言葉になりそうですか。",
    boundary:
      "これは診断ではありません。心の状態を評価したり、良し悪しを決めるものでもありません。つらさが強い・長く続く・生活に影響しているときは、これだけで抱え込まず、信頼できる人や確認済みの相談先につながることも選択肢です。",
  },
  {
    slug: "relationship-breath",
    title: "距離感をゆるめる",
    purpose:
      "人との関わりで感じる負担を、会う・返す・合わせるの三つに分けて眺め、今日どれを少し軽くできるかを一つだけ選ぶ小さな練習です。",
    whoItHelps:
      "人づきあいに気を張りすぎて疲れている、断りづらくて予定や返信がたまっている——そんなときに向いています。",
    estimatedTime: "約3分",
    preparation: "誰かを思い浮かべる必要はありません。今の自分の負担だけに目を向けます。",
    steps: [
      {
        prompt: "今いちばん負担に感じるのは、会う・返す・合わせるのどれですか。",
        guidance:
          "会う（人と直接ふれる）、返す（連絡やメッセージ）、合わせる（相手のペースや空気）。どれか一つに、そっと丸をつけるつもりで選びます。",
      },
      {
        prompt: "その負担は、いつ・どんな場面で強くなりますか。",
        guidance:
          "特定の相手を責める必要はありません。「夜の返信がしんどい」「大人数だと消耗する」——場面が見えると、扱いやすくなります。",
      },
      {
        prompt: "今日、そこを少しだけ軽くできるとしたら、何ができそうですか。",
        guidance:
          "返信を明日にする、会う時間を短くする、無理に合わせる場面を一つ手放す。小さな一つで十分です。全部でなくて構いません。",
      },
      {
        prompt: "その一つを選んだ自分に、許可を出せそうですか。",
        guidance:
          "距離を取ることは、関係を切ることではありません。続けるために、少しゆるめる。それは失礼ではなく、手入れです。",
      },
    ],
    completion:
      "おつかれさまでした。負担を一つ見つけて、今日できる軽さを一つ選べたなら、それでもう前に進んでいます。",
    reflection:
      "会う・返す・合わせるのうち、これからも大切にしたいのはどれで、少しゆるめたいのはどれでしょうか。",
    boundary:
      "これは診断ではありません。人間関係の結論や、相手が良いか悪いかを決めるものでもありません。関係のつらさが強い・安全が脅かされていると感じるときは、これだけで判断せず、信頼できる人や確認済みの相談先につながることも選択肢です。",
  },
  {
    slug: "work-reset",
    title: "仕事のリズムを整える",
    purpose:
      "今日の集中の「山」と「谷」を一つずつ書き出し、次にやる一歩を一つだけ決める、短い仕事のリズムの立て直しです。",
    whoItHelps:
      "やることが多くて頭がいっぱい、なんとなく手が止まっている、ペースがつかめない——そんなときに向いています。",
    estimatedTime: "約3分",
    preparation: "今日一日をざっと思い返せる状態で。完璧に思い出す必要はありません。",
    steps: [
      {
        prompt: "今日、いちばん集中できたのはどの時間・どの作業でしたか。",
        guidance:
          "うまくいった瞬間を一つ思い出します。短くても構いません。「午前中の書きもの」くらいの解像度で十分です。",
      },
      {
        prompt: "反対に、いちばん停滞したのはどこでしたか。",
        guidance:
          "自分を責める必要はありません。疲れ・割り込み・気が乗らない作業——「谷」の場所がわかると、次に守りやすくなります。",
      },
      {
        prompt: "その山と谷から、明日に活かせそうなことは何ですか。",
        guidance:
          "「集中できる時間に重い作業を寄せる」「谷の時間は軽い作業にする」——気づきを一つだけ言葉にしてみます。",
      },
      {
        prompt: "では、次にやる一歩を一つだけ決めるとしたら。",
        guidance:
          "たくさん決めなくて大丈夫です。今日か明日の最初の一手を、具体的に一つ。それだけでリズムは戻り始めます。",
      },
    ],
    completion:
      "おつかれさまでした。山と谷を見て、次の一歩を一つ決められたなら、それでもう整い始めています。",
    reflection:
      "自分が本来のペースを取り戻せるのは、どんな条件がそろったときだと感じますか。",
    boundary:
      "これは診断ではありません。仕事の能力や成果を評価するものでもありません。慢性的な疲れ・眠れない・気力が続かない状態が長く続くときは、これだけで抱え込まず、信頼できる人や確認済みの相談先につながることも選択肢です。",
  },
] as const;

const BY_SLUG = new Map(SR1_GUIDED_EXPERIENCES.map((experience) => [experience.slug, experience]));

export function getGuidedExperience(slug: string): GuidedExperience | undefined {
  return BY_SLUG.get(slug);
}
