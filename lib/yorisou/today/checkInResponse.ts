// YORISOU V2 — what the check-in gives back.
//
// ─────────────────────────────────────────────────────────────────────────────
// THE DEFECT THIS REPLACES
// ─────────────────────────────────────────────────────────────────────────────
//
// The old response rendered `labelForState(state)。labelForIntent(intent)。` — the two labels the
// person had just tapped, read back to them — followed by one sentence keyed on intent ALONE.
// Twenty-five possible answers collapsed into five, and every one of them was a paraphrase:
//
//     落ち着かない。気分を変えたいようです。
//
// Value Delta — what the person receives minus what they supplied — was zero. An interaction that
// returns nothing is not a small UX problem; it is the product failing to be a product.
//
// ─────────────────────────────────────────────────────────────────────────────
// WHERE THE NEW INFORMATION ACTUALLY COMES FROM
// ─────────────────────────────────────────────────────────────────────────────
//
// From the COMBINATION, which is the one thing the person did not state. They chose a state and
// they chose what they want; they did not say what those two together might mean. "Unsettled" says
// little. "Unsettled, and wanting to change the mood" says something the person can recognise or
// reject — that the urge to move may be part of the restlessness rather than the cure for it.
//
// So this is a 5 × 5 table, written cell by cell. Not five sentences reused across five states, and
// not a template with the labels interpolated back in — both are the same failure wearing a
// different shape.
//
// ─────────────────────────────────────────────────────────────────────────────
// WHY A TABLE RATHER THAN A MODEL
// ─────────────────────────────────────────────────────────────────────────────
//
// The input space is twenty-five cells, closed and known. A model call here would add latency and
// cost to the product's most frequent interaction, introduce a failure mode on a path that must
// never fail, and produce prose nobody reviewed — to answer a question that has twenty-five
// possible inputs. Written once and read forever is strictly better, and it makes every sentence
// the product will ever say reviewable in one file.
//
// AI belongs where the space is genuinely open: free-text reflection. Not here.
//
// ─────────────────────────────────────────────────────────────────────────────
// THE RULES EVERY CELL FOLLOWS
// ─────────────────────────────────────────────────────────────────────────────
//
//   GROUNDED     it refers only to the two things the person chose. It never invents a cause, a
//                history, an event or a feeling they did not report.
//   HYPOTHESIS   it is offered as something that might fit — かもしれません / ようにも見えます —
//                never as a fact about them. The person is the authority on themselves.
//   CORRECTABLE  every response is answerable with 近い / 少し違う, and 少し違う is a real answer
//                that changes what happens next rather than a politeness.
//   ONE STEP     exactly one suggested next action, and it may be "stop here for today".
//   NOT CLINICAL no diagnosis, no symptom language, no advice that belongs to a clinician. "Heavy"
//                is a description of a day, and this file never treats it as anything more.

import type { IntentOptionId, StateOptionId } from "./currentStateCheckIn";

export type CheckInResponse = {
  /** The observation. One or two sentences, always a hypothesis. */
  reading: string;
  /** The single suggested next action. */
  step: { label: string; href: string };
  /** Why this step, in one short line. Shown quietly, never as the headline. */
  because: string;
};

const R = (reading: string, label: string, href: string, because: string): CheckInResponse => ({
  reading,
  step: { label, href },
  because,
});

// Routes used below. Kept to surfaces that exist and are open to everyone, because a suggestion
// leading somewhere a person cannot reach is worse than no suggestion.
const IMAIRO = "/tests/ima-iro";
const TESTS = "/tests";
const EXPLORE = "/explore";
const HOME = "/";

/**
 * The table. Rows are how they are; columns are what they want.
 *
 * Read any row across and it should sound like the same person being met differently depending on
 * what they asked for — because that is what is actually happening.
 */
const TABLE: Record<StateOptionId, Record<IntentOptionId, CheckInResponse>> = {
  unsettled: {
    rest: R(
      "落ち着かないまま「休みたい」と思えているのは、けっこう大事なことかもしれません。休みたい気持ちは、たいてい先に体のほうから出てきます。",
      "静かに読めるものを見る", EXPLORE,
      "考えるより先に、負荷を下げるほうが向いていそうなときなので。",
    ),
    "sort-out": R(
      "落ち着かないときの「整理したい」は、片づけたい対象がまだ形になっていないことも多いようです。全部を並べようとせず、ひとつだけ取り出すほうが進みやすいかもしれません。",
      "テーマから選んでみる", TESTS,
      "対象が決まると、落ち着かなさの輪郭も見えやすくなるので。",
    ),
    shift: R(
      "落ち着かないときに「気分を変えたい」と感じるのは自然ですが、その動きたさ自体が落ち着かなさの一部、ということもあります。変えるより、まず今の状態に名前をつけるほうが早い場合もあるかもしれません。",
      "いま色テストで今の動き方を見る", IMAIRO,
      "動き方がわかると、変えるべきものが絞れるので。",
    ),
    understand: R(
      "落ち着かない最中に「自分を知りたい」と思えるのは、少し珍しいことです。今の揺れは、ふだん見えにくい部分が表に出ているタイミングかもしれません。",
      "いま色テストを受けてみる", IMAIRO,
      "揺れているときのほうが、動き方の癖は見えやすいので。",
    ),
    undecided: R(
      "落ち着かないけれど、どうしたいかはまだ決めていない。決めないでいることは、いまの状態としてそのまま置いておいて大丈夫そうです。",
      "今日はここまでにする", HOME,
      "決めないと決めるのも、ひとつの選択なので。",
    ),
  },
  "busy-mind": {
    rest: R(
      "頭が休まらないときの「休みたい」は、体より先に思考が疲れているサインのこともあります。横になるより、考える対象を減らすほうが効くかもしれません。",
      "静かに読めるものを見る", EXPLORE,
      "入力を一本に絞ると、回りつづける感じが落ちやすいので。",
    ),
    "sort-out": R(
      "頭が休まらない状態で「整理したい」というのは、量が多いというより、置き場所が決まっていないのかもしれません。順番をつけるより、まず外に出すほうが軽くなることがあります。",
      "テーマから選んでみる", TESTS,
      "外に出す枠があると、頭の中で回し続けなくてよくなるので。",
    ),
    shift: R(
      "考えが止まらないまま気分だけ変えようとすると、内容がそのままついてくることがあります。切り替えの前に、いま何を繰り返し考えているかだけ見ておくと違うかもしれません。",
      "合いそうなものを探す", EXPLORE,
      "対象がはっきりすると、切り替えが効きやすくなるので。",
    ),
    understand: R(
      "頭が休まらないときは、考えの内容より「考え方の癖」のほうが見えていることがあります。今は、その癖を見るのに向いたタイミングかもしれません。",
      "いま色テストを受けてみる", IMAIRO,
      "繰り返し考えてしまう形には、その人らしさが出やすいので。",
    ),
    undecided: R(
      "頭は動いているけれど、どうしたいかは決まっていない。無理に着地させなくても、いまはそれで十分かもしれません。",
      "今日はここまでにする", HOME,
      "考えが多い日に決めたことは、あとで変わりやすいので。",
    ),
  },
  heavy: {
    rest: R(
      "なんとなく重いときの「休みたい」は、理由がはっきりしないぶん、後回しにされやすい気持ちです。理由がなくても、休んでいい合図として扱って大丈夫そうです。",
      "静かに読めるものを見る", EXPLORE,
      "理由を探すより先に、重さを下げるほうが向いていそうなので。",
    ),
    "sort-out": R(
      "「なんとなく」のまま整理しようとすると、言葉にならないことに時間がかかります。全体をまとめようとせず、ひとつだけ名前をつけてみるほうが進みやすいかもしれません。",
      "テーマから選んでみる", TESTS,
      "ひとつ言葉になると、残りも輪郭が出てくることがあるので。",
    ),
    shift: R(
      "重さの理由がはっきりしないときの「気分を変えたい」は、うまくいく日とそうでない日の差が大きいようです。切り替わらなくても、それは失敗ではなさそうです。",
      "合いそうなものを探す", EXPLORE,
      "軽い刺激のほうが、いまは負担になりにくいので。",
    ),
    understand: R(
      "はっきりした理由がないまま重い、という状態は、言葉にしにくいぶん見過ごされがちです。それを見てみようと思えていること自体が、いまの手がかりかもしれません。",
      "いま色テストを受けてみる", IMAIRO,
      "説明しにくい状態ほど、型から見ると輪郭が出やすいので。",
    ),
    undecided: R(
      "重さがあって、どうしたいかも決まっていない。いまは何かを決めるより、そう感じている日だと記録しておくだけで十分かもしれません。",
      "今日はここまでにする", HOME,
      "重い日に決めなくていいことは、案外多いので。",
    ),
  },
  steady: {
    rest: R(
      "落ち着いているときに休もうとするのは、実はいちばん難しい選択かもしれません。崩れてから休むより、ずっと負担が少ないやり方です。",
      "静かに読めるものを見る", EXPLORE,
      "余裕があるうちの休みは、あとの消耗を減らすので。",
    ),
    "sort-out": R(
      "落ち着いているときの整理は、うまくいきやすいタイミングです。困っている最中ではないぶん、後回しにしてきたことのほうが扱いやすいかもしれません。",
      "テーマから選んでみる", TESTS,
      "余裕があるときのほうが、大きめの問いに向き合えるので。",
    ),
    shift: R(
      "落ち着いているのに気分を変えたい、というのは、悪い状態ではなく「少し物足りない」に近いのかもしれません。整えるより、新しいものを入れるほうが合いそうです。",
      "合いそうなものを探す", EXPLORE,
      "回復ではなく変化を求めていそうなので。",
    ),
    understand: R(
      "落ち着いているときのほうが、自分のことは見えやすいのかもしれません。困っている最中の答えは状況に引っぱられがちですが、いまはそれが少ないタイミングのようです。",
      "いま色テストを受けてみる", IMAIRO,
      "揺れが小さいときの結果は、あとで見返しても信頼しやすいので。",
    ),
    undecided: R(
      "落ち着いていて、とくに決めたいこともない。それは何もない日ではなく、余白がある日なのかもしれません。",
      "今日はここまでにする", HOME,
      "余白のある日は、そのまま置いておいていいので。",
    ),
  },
  unsure: {
    rest: R(
      "自分の状態がよくわからないまま「休みたい」と思えているなら、その感覚のほうを信じてよさそうです。説明できることだけが本当ではありません。",
      "静かに読めるものを見る", EXPLORE,
      "言葉にできる前でも、休む判断はできるので。",
    ),
    "sort-out": R(
      "「よくわからない」を整理したい、というのは、答えを出すことより、いまどこにいるかを知りたいのかもしれません。分類より、置いてみることから始めると進みやすそうです。",
      "テーマから選んでみる", TESTS,
      "枠があると、わからなさの形が見えてくることがあるので。",
    ),
    shift: R(
      "状態がつかめないまま気分を変えようとすると、何が変わったのか自分でも分かりにくくなります。先に、いまを少しだけ言葉にしておくと違うかもしれません。",
      "いま色テストで今の動き方を見る", IMAIRO,
      "起点がわかると、変化にも気づけるようになるので。",
    ),
    understand: R(
      "「よくわからない」から始める自己理解は、遠回りに見えて確かなことが多いようです。すでに答えを持っている人より、見えるものが増えることがあります。",
      "いま色テストを受けてみる", IMAIRO,
      "先入観が少ないぶん、結果を素直に受け取りやすいので。",
    ),
    undecided: R(
      "状態もわからないし、どうしたいかも決まっていない。それでもここを開いた、というのが今日わかっていることかもしれません。",
      "今日はここまでにする", HOME,
      "わからない日を、わからないまま残しておけるので。",
    ),
  },
};

/** The response for one check-in. A pure lookup — no computation, no network, no model. */
export function checkInResponseFor(state: StateOptionId, intent: IntentOptionId): CheckInResponse {
  return TABLE[state][intent];
}

/**
 * What a person may say back.
 *
 * `少し違う` is a real answer, not a politeness: it is what makes the reading a hypothesis rather
 * than a verdict, and P7 requires that an inference never becomes confirmed truth without the
 * person saying so.
 */
export const CHECK_IN_FEEDBACK = [
  { id: "close", label: "近い" },
  { id: "off", label: "少し違う" },
  { id: "unclear", label: "まだ分からない" },
] as const;

export type CheckInFeedbackId = (typeof CHECK_IN_FEEDBACK)[number]["id"];

/** What the surface says after a person answers. Their word is final; nothing argues back. */
export function acknowledgeFeedback(id: CheckInFeedbackId): string {
  switch (id) {
    case "close":
      return "ありがとうございます。近い、と受け取りました。";
    case "off":
      return "ありがとうございます。いまの見立ては外しておきます。";
    case "unclear":
      return "わからないままで大丈夫です。そのまま置いておきます。";
  }
}
