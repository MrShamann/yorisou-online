export type ProductCardStatus =
  | "primary"
  | "ready_for_review"
  | "static_entry_only"
  | "later"
  | "hold";

export type ProductCard = {
  id: string;
  category: string;
  title_ja: string;
  subtitle_ja: string;
  badges: readonly string[];
  status: ProductCardStatus;
  primary_cta: string;
  route_placeholder: string | null;
  public_boundary_note: string;
  implementation_allowed_now: boolean;
};

export const PRODUCT_CARDS: readonly ProductCard[] = [
  {
    id: "core-life-state",
    category: "core_life_state",
    title_ja: "今の自分",
    subtitle_ja: "気分、リズム、人との距離、回復のしかたを広くふり返ります。",
    badges: ["Primary", "24問", "無料結果"],
    status: "primary",
    primary_cta: "今の自分を見る",
    route_placeholder: "/check-in",
    public_boundary_note: "医療・心理診断ではありません。",
    implementation_allowed_now: true,
  },
  {
    id: "relationship-fatigue",
    category: "relationship",
    title_ja: "人間関係の疲れ",
    subtitle_ja: "会う・返す・合わせる。今どこに負担が出ているかを小さく整理します。",
    badges: ["24問", "約4〜6分", "無料結果"],
    status: "primary",
    primary_cta: "チェックを始める",
    route_placeholder: "/tests/relationship-fatigue",
    public_boundary_note: "人間関係の結論や相手への判断を決めるものではありません。",
    implementation_allowed_now: true,
  },
  {
    id: "relationship-distance",
    category: "relationship",
    title_ja: "恋愛・ふたりの距離",
    subtitle_ja: "相手の気持ちを読むのではなく、自分の近づき方や安心しやすい距離を整理します。",
    badges: ["18問", "約3〜5分", "無料結果"],
    status: "primary",
    primary_cta: "チェックを始める",
    route_placeholder: "/tests/love-distance",
    public_boundary_note: "連絡・告白・別れ・復縁などの判断を決めるものではありません。",
    implementation_allowed_now: true,
  },
  {
    id: "work-school-rhythm",
    category: "rhythm",
    title_ja: "仕事・学校のリズム",
    subtitle_ja: "集中しやすさ、疲れやすい場面、進め方のクセをふり返るための入口です。",
    badges: ["準備中"],
    status: "later",
    primary_cta: "準備中",
    route_placeholder: null,
    public_boundary_note: "進路・就職・退職などの専門判断をするものではありません。",
    implementation_allowed_now: false,
  },
  {
    id: "symbolic-reflection",
    category: "cultural_reflection",
    title_ja: "象徴リフレクション",
    subtitle_ja: "カードやモチーフをきっかけに、今日の気持ちを軽く言葉にします。",
    badges: ["Secondary", "1〜2分"],
    status: "static_entry_only",
    primary_cta: "準備中",
    route_placeholder: null,
    public_boundary_note: "先のことや誰かの気持ちを示すものではありません。",
    implementation_allowed_now: false,
  },
] as const;
