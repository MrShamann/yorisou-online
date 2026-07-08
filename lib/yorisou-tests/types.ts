export type TestStatus = "available" | "blocked";

export type TestCatalogEntry = {
  slug: string;
  testId: string;
  title: string;
  description: string;
  estimatedTime: string;
  category: string;
  boundaryNote: string;
  ctaLabel: string;
  route: string;
  status: TestStatus;
  blockedReason?: string;
};

export type WeightedOption = {
  key?: string;
  id?: string;
  label_jp?: string;
  label?: string;
  weights?: Record<string, number | undefined>;
  score_tags?: readonly string[];
};

export type WeightedQuestion = {
  id: string;
  section: string;
  prompt_jp: string;
  options: readonly WeightedOption[];
};

export type ResultRule = {
  display_name_jp?: string;
  primary_trigger_dimensions?: readonly string[];
  secondary_trigger_dimensions?: readonly string[];
  low_confidence_fallback?: string;
};

export type RuleBasedResultType = {
  id?: string;
  result_type_id?: string;
  display_name_jp?: string;
  short_label_jp?: string;
  share_card_line_jp?: string;
  name_jp?: string;
  public_summary_jp?: string;
};

export type RankedDimension = {
  key: string;
  score: number;
  label: string;
};

export type RuleBasedRuntime = {
  slug: string;
  testId: string;
  title: string;
  introTitle: string;
  introDescription: string;
  estimatedTime: string;
  questionCount: number;
  questions: readonly WeightedQuestion[];
  sections: ReadonlyArray<{
    id: string;
    title_jp: string;
    question_ids: readonly string[];
    section_break_copy_jp?: string;
  }>;
  resultTypes: readonly RuleBasedResultType[];
  resultRules: Record<string, ResultRule>;
  dimensionLabels: Record<string, string>;
  boundaryNote: string;
  paidPreviewCopy?: string;
  shareLabel?: string;
  relatedRoutes: ReadonlyArray<{ href: string; label: string }>;
};

export type RuleBasedResolvedResult = {
  resultId: string;
  title: string;
  summary: string;
  score: number;
  topDimensions: RankedDimension[];
  lowDimension: RankedDimension | null;
};

export type SymbolicRoute = {
  href: string;
  label: string;
};

export type OmikujiRuntime = {
  slug: string;
  testId: string;
  title: string;
  introTitle: string;
  introDescription: string;
  estimatedTime: string;
  boundaryNote: string;
  optionalInputs: ReadonlyArray<{
    id: string;
    label_jp: string;
    options: readonly string[];
  }>;
  resultPool: ReadonlyArray<{
    result_id: string;
    fortune_level_jp: string;
    title_jp: string;
    main_message_jp: string;
    today_hint_jp: string;
    avoid_jp: string;
    lucky_action_jp: string;
    lucky_color_jp: string;
    share_card_line_jp: string;
    recommendation_trigger?: string;
    core_bridge_jp?: string;
  }>;
  relatedRoutes: readonly SymbolicRoute[];
};

export type NamePairRuntime = {
  slug: string;
  testId: string;
  title: string;
  introTitle: string;
  introDescription: string;
  estimatedTime: string;
  boundaryNote: string;
  inputs: ReadonlyArray<{
    id: string;
    label_jp: string;
    type: string;
    required: boolean;
    options?: readonly string[];
    max_length?: number;
    guidance_jp?: string;
  }>;
  optionalQuestions: ReadonlyArray<{
    id: string;
    prompt_jp: string;
    options: ReadonlyArray<{
      key: string;
      label_jp: string;
      score_tags?: readonly string[];
    }>;
  }>;
  resultPool: ReadonlyArray<{
    result_id: string;
    title_jp: string;
    compatibility_label_jp: string;
    main_message_jp: string;
    pair_strength_jp: string;
    possible_gap_jp: string;
    one_question_to_talk_jp: string;
    r01_bridge_jp?: string;
    c02_bridge_jp?: string;
    share_card_line_jp: string;
  }>;
  relatedRoutes: readonly SymbolicRoute[];
};

export type RelationshipParticipant = {
  id: "A" | "B";
  label_jp: string;
  intro_jp: string;
};

export type RelationshipQuestionOption = {
  label: string;
  text: string;
  score: Record<string, number>;
};

export type RelationshipQuestion = {
  id: string;
  person: "A" | "B";
  prompt: string;
  options: readonly RelationshipQuestionOption[];
  sensitivity: string;
};

export type RelationshipResultType = {
  id: string;
  name: string;
  summary: string;
  dims: readonly string[];
  bullets: readonly string[];
  private: string;
  report: string;
};

export type RelationshipPairRuntime = {
  slug: string;
  testId: string;
  title: string;
  introTitle: string;
  introDescription: string;
  estimatedTime: string;
  questionCountTotal: number;
  questionCountPerPerson: number;
  participants: readonly RelationshipParticipant[];
  dimensions: ReadonlyArray<{
    id: string;
    label: string;
    description: string;
  }>;
  questions: readonly RelationshipQuestion[];
  resultTypes: readonly RelationshipResultType[];
  tieBreakOrder: readonly string[];
  fallbackResultId: string;
  boundaryNote: string;
  reportTeaserLabel: string;
  relatedRoutes: readonly SymbolicRoute[];
};

export type RelationshipPairResolvedResult = {
  resultId: string;
  title: string;
  summary: string;
  bullets: readonly string[];
  reportTeaser: string;
  confidence: "low" | "medium" | "high";
  alignedLabels: readonly string[];
  gapLabel: string | null;
  gapSummary: string | null;
};
