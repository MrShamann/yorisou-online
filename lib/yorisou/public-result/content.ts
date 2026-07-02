import type { PublicArchetypeDefinition } from "./types";

export type PublicResultHighlight = {
  label: string;
  text: string;
};

export type PublicArchetypeContent = {
  recognitionLine: string;
  highlights: readonly [PublicResultHighlight, PublicResultHighlight];
  gentleNextStep: string;
  shareLine: string;
};

function defineContent(
  _definition: Pick<PublicArchetypeDefinition, "publicCode" | "nickname">,
  content: PublicArchetypeContent,
) {
  return content;
}

export const PUBLIC_ARCHETYPE_CONTENT_BY_CODE = {
  "MS-KI": defineContent(
    { publicCode: "MS-KI", nickname: "気配読み" },
    {
      recognitionLine: "小さな変化や場の空気に、先に気づきやすい動き方が出ています。",
      highlights: [
        { label: "気づきやすさ", text: "まわりの温度差や違和感を早めに拾いやすい" },
        { label: "間合い", text: "急に踏み込むより、少し距離を見ながら整えやすい" },
      ],
      gentleNextStep: "今日は、気になったことをひとつだけ言葉にしてみてください。",
      shareLine: "私は気配読み。あなたは？",
    },
  ),
  "MS-SZ": defineContent(
    { publicCode: "MS-SZ", nickname: "さざ波番" },
    {
      recognitionLine: "揺れのはじまりを小さなうちに感じ取りやすい今の流れです。",
      highlights: [
        { label: "揺れの察知", text: "静かな変化でも早めに気づきやすい" },
        { label: "整え方", text: "大きく動く前に小さくならしていきやすい" },
      ],
      gentleNextStep: "今日は、ざわついた場面をひとつだけ振り返ってみてください。",
      shareLine: "私はさざ波番。あなたは？",
    },
  ),
  "MS-YO": defineContent(
    { publicCode: "MS-YO", nickname: "余韻結び" },
    {
      recognitionLine: "終わったあとの余韻から、今の意味を拾いやすい動き方です。",
      highlights: [
        { label: "余韻", text: "その場が終わったあとに感触を受け取りやすい" },
        { label: "まとめ方", text: "あとから言葉を結び直して整理しやすい" },
      ],
      gentleNextStep: "今日は、残っている感触をひとつだけメモしてみてください。",
      shareLine: "私は余韻結び。あなたは？",
    },
  ),
  "MS-SI": defineContent(
    { publicCode: "MS-SI", nickname: "静けさ読み" },
    {
      recognitionLine: "静かな場面ほど、今の様子を細かく見分けやすい流れです。",
      highlights: [
        { label: "観察", text: "落ち着いた空気の中で違いを見つけやすい" },
        { label: "戻り方", text: "無理に急がず整うタイミングを待ちやすい" },
      ],
      gentleNextStep: "今日は、静かに落ち着ける時間を少しだけ確保してみてください。",
      shareLine: "私は静けさ読み。あなたは？",
    },
  ),
  "EM-AK": defineContent(
    { publicCode: "EM-AK", nickname: "灯起こし" },
    {
      recognitionLine: "止まっている空気に、小さな火を入れやすい今の動き方です。",
      highlights: [
        { label: "初動", text: "最初のひと押しをつくりやすい" },
        { label: "きっかけ", text: "動き出す理由を見つけるのが早い" },
      ],
      gentleNextStep: "今日は、始めたいことをひとつだけ小さく動かしてみてください。",
      shareLine: "私は灯起こし。あなたは？",
    },
  ),
  "EM-FB": defineContent(
    { publicCode: "EM-FB", nickname: "伏せ火" },
    {
      recognitionLine: "外には静かでも、内側の火を保ちやすい流れが出ています。",
      highlights: [
        { label: "内側の熱", text: "気持ちや意欲を静かに持ち続けやすい" },
        { label: "持続", text: "勢いより、長く保つ形に向きやすい" },
      ],
      gentleNextStep: "今日は、まだ消えていない気持ちをひとつだけ確かめてみてください。",
      shareLine: "私は伏せ火。あなたは？",
    },
  ),
  "EM-KU": defineContent(
    { publicCode: "EM-KU", nickname: "風受け" },
    {
      recognitionLine: "外から入るきっかけを受けて、動きにつなげやすい今の流れです。",
      highlights: [
        { label: "反応", text: "ちょっとした追い風を動きに変えやすい" },
        { label: "切り替え", text: "止まっても再スタートのきっかけを拾いやすい" },
      ],
      gentleNextStep: "今日は、追い風になりそうな一言をひとつ受け取ってみてください。",
      shareLine: "私は風受け。あなたは？",
    },
  ),
  "EM-KA": defineContent(
    { publicCode: "EM-KA", nickname: "声の灯" },
    {
      recognitionLine: "言葉に火を入れて、場を少し動かしやすい今の動き方です。",
      highlights: [
        { label: "言葉", text: "ひとことが流れを変える場面に向きやすい" },
        { label: "伝え方", text: "思いを言葉の熱として渡しやすい" },
      ],
      gentleNextStep: "今日は、伝えたいことを短い言葉でひとつだけ出してみてください。",
      shareLine: "私は声の灯。あなたは？",
    },
  ),
  "WL-YM": defineContent(
    { publicCode: "WL-YM", nickname: "柳間合い" },
    {
      recognitionLine: "相手との距離をやわらかく調整しやすい流れが出ています。",
      highlights: [
        { label: "距離感", text: "近づきすぎず離れすぎずを見やすい" },
        { label: "やわらかさ", text: "強く押さずに間合いを整えやすい" },
      ],
      gentleNextStep: "今日は、心地よい距離を感じた場面をひとつだけ思い出してみてください。",
      shareLine: "私は柳間合い。あなたは？",
    },
  ),
  "WL-SE": defineContent(
    { publicCode: "WL-SE", nickname: "線守り" },
    {
      recognitionLine: "自分の線を静かに守りながら動きやすい今の流れです。",
      highlights: [
        { label: "境界", text: "どこまで引き受けるかを見分けやすい" },
        { label: "整え方", text: "無理な広がりを抑えながら進めやすい" },
      ],
      gentleNextStep: "今日は、引き受けすぎない線をひとつだけ決めてみてください。",
      shareLine: "私は線守り。あなたは？",
    },
  ),
  "WL-UN": defineContent(
    { publicCode: "WL-UN", nickname: "受け流し" },
    {
      recognitionLine: "全部を抱え込まず、流しながら整えやすい今の動き方です。",
      highlights: [
        { label: "受け止め方", text: "重さをそのまま抱えずに受け流しやすい" },
        { label: "負担調整", text: "少しずつ力を抜くタイミングをつかみやすい" },
      ],
      gentleNextStep: "今日は、流してよいものをひとつだけ見分けてみてください。",
      shareLine: "私は受け流し。あなたは？",
    },
  ),
  "WL-SK": defineContent(
    { publicCode: "WL-SK", nickname: "掬い手" },
    {
      recognitionLine: "必要なものだけを静かに掬い上げやすい今の流れです。",
      highlights: [
        { label: "見極め", text: "全部ではなく必要な部分を選びやすい" },
        { label: "受け取り", text: "相手の言葉から要点を拾いやすい" },
      ],
      gentleNextStep: "今日は、持ち帰りたい要点をひとつだけ残してみてください。",
      shareLine: "私は掬い手。あなたは？",
    },
  ),
  "TD-SG": defineContent(
    { publicCode: "TD-SG", nickname: "潮替え" },
    {
      recognitionLine: "流れの切り替えどころを見つけやすい今の動き方です。",
      highlights: [
        { label: "切り替え", text: "続けるより変えるほうがよい場面を見やすい" },
        { label: "立て直し", text: "空気を入れ替えるきっかけをつくりやすい" },
      ],
      gentleNextStep: "今日は、切り替えたほうがよさそうなことをひとつだけ見てみてください。",
      shareLine: "私は潮替え。あなたは？",
    },
  ),
  "TD-NT": defineContent(
    { publicCode: "TD-NT", nickname: "波立て直し" },
    {
      recognitionLine: "小さく乱れた流れを、もう一度整え直しやすい今の流れです。",
      highlights: [
        { label: "立て直し", text: "崩れたあとに戻す入口を見つけやすい" },
        { label: "再開", text: "一度止まってもやり直しの形をつくりやすい" },
      ],
      gentleNextStep: "今日は、立て直したいことをひとつだけ小さく戻してみてください。",
      shareLine: "私は波立て直し。あなたは？",
    },
  ),
  "TD-KY": defineContent(
    { publicCode: "TD-KY", nickname: "景色替え" },
    {
      recognitionLine: "見方や場面を変えることで、流れを軽くしやすい今の動き方です。",
      highlights: [
        { label: "見方", text: "同じことでも景色を変えて捉え直しやすい" },
        { label: "場面転換", text: "少し場所や順番を変えると動きやすくなる" },
      ],
      gentleNextStep: "今日は、見方を変えられそうなことをひとつだけ探してみてください。",
      shareLine: "私は景色替え。あなたは？",
    },
  ),
  "TD-TB": defineContent(
    { publicCode: "TD-TB", nickname: "試し火" },
    {
      recognitionLine: "まず少し試してから流れをつかみやすい今の動き方です。",
      highlights: [
        { label: "試し方", text: "本格化の前に小さく試すのが得意" },
        { label: "動き出し", text: "やってみてから調整する流れに向きやすい" },
      ],
      gentleNextStep: "今日は、気になることをひとつだけ試しサイズで動かしてみてください。",
      shareLine: "私は試し火。あなたは？",
    },
  ),
  "CD-IS": defineContent(
    { publicCode: "CD-IS", nickname: "石積み" },
    {
      recognitionLine: "足場を積み上げながら、安定して進みやすい今の流れです。",
      highlights: [
        { label: "安定感", text: "一歩ずつ形をつくる進め方に向きやすい" },
        { label: "継続", text: "急ぐより積み上げることで力が出やすい" },
      ],
      gentleNextStep: "今日は、足場になる小さな習慣をひとつだけ整えてみてください。",
      shareLine: "私は石積み。あなたは？",
    },
  ),
  "CD-SG": defineContent(
    { publicCode: "CD-SG", nickname: "支え木" },
    {
      recognitionLine: "自分やまわりを支える手触りを見つけやすい今の動き方です。",
      highlights: [
        { label: "支え", text: "倒れにくくする工夫を先に見つけやすい" },
        { label: "回復", text: "戻るための支えを置きながら進めやすい" },
      ],
      gentleNextStep: "今日は、支えになっているものをひとつだけ言葉にしてみてください。",
      shareLine: "私は支え木。あなたは？",
    },
  ),
  "CD-AS": defineContent(
    { publicCode: "CD-AS", nickname: "足元番" },
    {
      recognitionLine: "遠くより先に、まず足元から整えやすい今の流れです。",
      highlights: [
        { label: "足元", text: "目の前の安定を先に整えるのが得意" },
        { label: "順番", text: "基礎から進めるほうが力を出しやすい" },
      ],
      gentleNextStep: "今日は、いちばん足元に近いことをひとつだけ整えてみてください。",
      shareLine: "私は足元番。あなたは？",
    },
  ),
  "CD-KJ": defineContent(
    { publicCode: "CD-KJ", nickname: "帰り印" },
    {
      recognitionLine: "戻れる目印を持ちながら進みやすい今の動き方です。",
      highlights: [
        { label: "戻りやすさ", text: "安心して戻れる道筋をつくりやすい" },
        { label: "回復の印", text: "無理しすぎないための目印を残しやすい" },
      ],
      gentleNextStep: "今日は、戻るための目印をひとつだけ決めてみてください。",
      shareLine: "私は帰り印。あなたは？",
    },
  ),
  "IR-IH": defineContent(
    { publicCode: "IR-IH", nickname: "糸ほどき" },
    {
      recognitionLine: "こんがらがった感触を、少しずつほどきやすい今の流れです。",
      highlights: [
        { label: "整理", text: "複雑さを小さく分けて見やすい" },
        { label: "言い直し", text: "まとまらない感覚をあとから整えやすい" },
      ],
      gentleNextStep: "今日は、ほどきたいことをひとつだけ小さく分けてみてください。",
      shareLine: "私は糸ほどき。あなたは？",
    },
  ),
  "IR-MH": defineContent(
    { publicCode: "IR-MH", nickname: "道ひらき" },
    {
      recognitionLine: "選び方に道筋をつけながら進みやすい今の動き方です。",
      highlights: [
        { label: "道筋", text: "迷いの中でも進む順番を見つけやすい" },
        { label: "判断", text: "選ぶ理由を自分なりに整えやすい" },
      ],
      gentleNextStep: "今日は、次の一歩の順番をひとつだけ決めてみてください。",
      shareLine: "私は道ひらき。あなたは？",
    },
  ),
  "IR-SI": defineContent(
    { publicCode: "IR-SI", nickname: "印つけ" },
    {
      recognitionLine: "あとで見返せる印をつけながら、進み方を整えやすい流れです。",
      highlights: [
        { label: "確認", text: "大事な点に印をつけて残しやすい" },
        { label: "見返し", text: "あとで戻る前提で整理しやすい" },
      ],
      gentleNextStep: "今日は、忘れたくないことにひとつだけ印をつけてみてください。",
      shareLine: "私は印つけ。あなたは？",
    },
  ),
  "IR-MK": defineContent(
    { publicCode: "IR-MK", nickname: "見立て替え" },
    {
      recognitionLine: "今の見立てを少し入れ替えることで、動きやすさが出やすい流れです。",
      highlights: [
        { label: "見立て", text: "ひとつの見方に固定されすぎず整えやすい" },
        { label: "柔らかさ", text: "考え直しを次の一歩につなげやすい" },
      ],
      gentleNextStep: "今日は、見立てを変えられそうなことをひとつだけ見直してみてください。",
      shareLine: "私は見立て替え。あなたは？",
    },
  ),
} as const satisfies Record<string, PublicArchetypeContent>;

export function findPublicArchetypeContentByCode(code: string | null | undefined) {
  if (!code) return null;
  return PUBLIC_ARCHETYPE_CONTENT_BY_CODE[code as keyof typeof PUBLIC_ARCHETYPE_CONTENT_BY_CODE] ?? null;
}
