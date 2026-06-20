export type QuestionPoolOptionInput = {
  id: "A" | "B" | "C" | "D" | "E";
  label: string;
  signal?: string | null;
};

export type QuestionPoolSourceQuestion = {
  candidate_id: string;
  dimension_id: string;
  dimension_label: string;
  pool: string;
  scenario_family: string;
  session_position: string;
  tone_depth: string;
  persona_fit_hint: string[];
  question: string;
  helper_text: string;
  options: QuestionPoolOptionInput[];
  calibration_notes?: string;
};

export type QuestionPoolSessionOrderItem = {
  q: number;
  item_id: string;
  dimension_id: string;
};

export type QuestionPoolMetadata = {
  session_id: string;
  date: string;
};

