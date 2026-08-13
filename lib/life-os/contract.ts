// OSF-1 — the Life OS Phase 1 domain contract.
//
// One module, imported by the API routes, the client surfaces and the tests, so there is exactly one
// answer to "what values are allowed". The SQL RPCs validate the same vocabularies independently
// (supabase/migrations/202608140001_osf1_life_os_foundation.sql §8) — deliberately duplicated,
// because a check that lives only in the application is a check the next caller can skip. When the
// two disagree, lib/server/__tests__/osf1StateVocabulary.test.ts fails.
//
// This file is NOT under lib/yorisou/ on purpose: that path is a trigger filter for the DCI-1 and
// YV-1 CI workflows (.github/workflows/dci-1-ci.yml, yv-1-ci.yml), and Phase 1 has nothing to do
// with either pilot.
//
// Client-safe: no `server-only`, no environment access, no I/O.

import { STATE_OPTIONS, INTENT_OPTIONS, type StateOptionId, type IntentOptionId } from "@/lib/yorisou/today/currentStateCheckIn";

// ── Current state ────────────────────────────────────────────────────────────

/**
 * The bounded state vocabulary.
 *
 * It is the Today check-in's own option ids, not a second list. The alternative — free-text state —
 * would turn a calm question into a disclosure surface, and would give an inference path something
 * to read. There is deliberately no way to record a state the product does not already offer.
 */
export const STATE_TAG_VOCABULARY: readonly string[] = [
  ...STATE_OPTIONS.map((option) => option.id),
  ...INTENT_OPTIONS.map((option) => option.id),
];

export const MOOD_VALUES = ["calm", "unsettled", "heavy", "tired", "bright", "unsure"] as const;
export const ENERGY_VALUES = ["low", "steady", "high"] as const;
export const CURRENT_STATE_SOURCES = ["today_check_in", "manual"] as const;

export type Mood = (typeof MOOD_VALUES)[number];
export type Energy = (typeof ENERGY_VALUES)[number];
export type CurrentStateSource = (typeof CURRENT_STATE_SOURCES)[number];

export type CurrentStateRecord = {
  id: string;
  state_tags: string[];
  mood: Mood | null;
  energy: Energy | null;
  situation: string | null;
  reflection: string | null;
  source: CurrentStateSource;
  created_at: string;
};

export type CurrentStateInput = {
  stateTags: string[];
  mood?: Mood | null;
  energy?: Energy | null;
  situation?: string | null;
  reflection?: string | null;
  source: CurrentStateSource;
};

/** The Today check-in's two choices, expressed as a current-state record. */
export function currentStateTagsFromCheckIn(state: StateOptionId, intent: IntentOptionId): string[] {
  return [state, intent];
}

// ── Goal ─────────────────────────────────────────────────────────────────────

/**
 * There is no "failed" and no "overdue" here, and there will not be one.
 *
 * The approved writing rules prohibit "goal-setting language that pressures commitment"
 * (docs/report-main-state-mode-writing-rules-v0.2.md §prohibitions) and the report quality gate asks
 * for "an orienting direction (not a goal list)". `released` is 手放す: deciding to stop carrying
 * something is a real outcome, and naming it that way is the difference between a Life OS and a
 * task manager.
 */
export const GOAL_STATUSES = ["active", "paused", "achieved", "released"] as const;
export type GoalStatus = (typeof GOAL_STATUSES)[number];

export const GOAL_STATUS_LABELS: Record<GoalStatus, string> = {
  active: "いま向かっている",
  paused: "いったん置いている",
  achieved: "届いた",
  released: "手放した",
};

export type Goal = {
  id: string;
  title: string;
  description: string | null;
  status: GoalStatus;
  created_at: string;
  updated_at: string;
};

// ── Reflection (user-authored, seven questions) ───────────────────────────────

/**
 * The guided reflection.
 *
 * Only the first question is required. A reflection someone stopped halfway through is still theirs
 * to keep, and requiring all seven would make a quiet flow into a form — which is the thing the UX
 * principles call "no dashboard feeling".
 */
/**
 * Seven questions, on seven screens. Question 4 carries two inputs — the decision and the reason for
 * it — because splitting them into an eighth screen would have made the flow longer than the package
 * specifies, and asking "why" without the decision still on the page loses the thing it refers to.
 */
export const REFLECTION_QUESTIONS = [
  {
    prompt: "何が起きましたか。",
    help: "起きたことを、覚えている範囲で。",
    required: true,
    fields: [{ field: "what_happened", label: "何が起きましたか", required: true }],
  },
  {
    prompt: "そのとき、どうなってほしいと思っていましたか。",
    help: "うまく言えなくても大丈夫です。",
    required: false,
    fields: [{ field: "goal_at_the_time", label: "望んでいたこと", required: false }],
  },
  {
    prompt: "そのとき、何がわかっていましたか。",
    help: "あとから知ったことは含めなくて構いません。",
    required: false,
    fields: [{ field: "information_at_hand", label: "わかっていたこと", required: false }],
  },
  {
    prompt: "どうすることにしましたか。",
    help: "選ばなかったことがあれば、それも。理由は、はっきりしないこともあります。",
    required: false,
    fields: [
      { field: "decision_made", label: "決めたこと", required: false },
      { field: "why", label: "なぜ、そうしたのだと思いますか（任意）", required: false },
    ],
  },
  {
    prompt: "そのあと、何が起きましたか。",
    help: "",
    required: false,
    fields: [{ field: "what_followed", label: "そのあと起きたこと", required: false }],
  },
  {
    prompt: "そこから、何か気づいたことはありますか。",
    help: "なければ空のままで。",
    required: false,
    fields: [{ field: "what_learned", label: "気づいたこと", required: false }],
  },
  {
    prompt: "次に同じことがあったら、どうしたいですか。",
    help: "",
    required: false,
    fields: [{ field: "next_time", label: "次にしたいこと", required: false }],
  },
] as const;

export type ReflectionField = (typeof REFLECTION_QUESTIONS)[number]["fields"][number]["field"];

/** Every stored answer field, in question order. */
export const REFLECTION_FIELDS: readonly { field: ReflectionField; required: boolean }[] =
  REFLECTION_QUESTIONS.flatMap((question) =>
    question.fields.map((entry) => ({ field: entry.field as ReflectionField, required: entry.required })),
  );

export type LifeReflection = {
  id: string;
  experience_id: string | null;
  what_happened: string;
  goal_at_the_time: string | null;
  information_at_hand: string | null;
  decision_made: string | null;
  why: string | null;
  what_followed: string | null;
  what_learned: string | null;
  next_time: string | null;
  created_at: string;
};

export type LifeReflectionInput = Partial<Record<ReflectionField, string | null>> & {
  what_happened: string;
  experienceId?: string | null;
};

// ── Memory (explicit, confirmed) ─────────────────────────────────────────────

export const MEMORY_TYPES = ["preference", "goal", "experience", "reflection"] as const;
export const MEMORY_SOURCES = ["user_statement", "user_confirmed_ai_suggestion"] as const;

export type MemoryType = (typeof MEMORY_TYPES)[number];
export type MemorySource = (typeof MEMORY_SOURCES)[number];

export const MEMORY_TYPE_LABELS: Record<MemoryType, string> = {
  preference: "好みや、やり方",
  goal: "向かいたい方向",
  experience: "経験",
  reflection: "振り返り",
};

export type ExplicitMemory = {
  id: string;
  memory_type: MemoryType;
  content: string;
  source: MemorySource;
  user_confirmed: true;
  created_at: string;
};

/**
 * A memory the product is OFFERING to save. It is not a record — it has no id, and nothing persists
 * it. It exists in one HTTP response and in the confirmation dialog the person is looking at, and it
 * is gone when they navigate away without confirming.
 *
 * `digest` is the sha256 of `content`. The confirm endpoint recomputes it and refuses a mismatch, so
 * the sentence that gets stored is the sentence that was on screen.
 */
export type MemoryCandidate = {
  memoryType: MemoryType;
  content: string;
  source: MemorySource;
  digest: string;
  /** Why this is being offered, in plain language. Never a claim about the person. */
  reason: string;
  subject?: { goalId?: string; experienceId?: string; reflectionId?: string };
};

// ── User context ─────────────────────────────────────────────────────────────

export const CONTEXT_LANGUAGES = ["ja", "en"] as const;
export type ContextLanguage = (typeof CONTEXT_LANGUAGES)[number];

/**
 * The only keys `preferences_json` may hold.
 *
 * An open bag would become a behavioural profile within a release or two — someone would write a
 * "tone" or an "engagement level" into it and nothing would stop them. The RPC refuses an unknown
 * key rather than storing it.
 */
export const PREFERENCE_KEYS = ["reduced_motion", "text_size", "quiet_hours", "default_visibility"] as const;
export type PreferenceKey = (typeof PREFERENCE_KEYS)[number];

export type UserContext = {
  id: string;
  language: ContextLanguage;
  region: string | null;
  timezone: string;
  preferences_json: Partial<Record<PreferenceKey, unknown>>;
  created_at: string;
  updated_at: string;
};

export type UserContextInput = {
  language?: ContextLanguage;
  region?: string | null;
  timezone?: string;
  preferences?: Partial<Record<PreferenceKey, unknown>>;
};

// ── Experience (the EXISTING yorisou_experience_cards, seen through Phase 1) ──

/**
 * Phase 1's Experience field names, mapped onto the columns that already exist.
 *
 * `action_taken` and `outcome` in the Phase 1 spec are the card's `action_tried` and
 * `perceived_outcome`; only `title` and `lesson` were genuinely missing and are added by
 * 202608140001. No second experience table exists.
 */
export const EXPERIENCE_FIELD_MAP = {
  title: "title",
  situation: "situation",
  action_taken: "action_tried",
  outcome: "perceived_outcome",
  lesson: "lesson",
  visibility: "visibility",
} as const;

export type Phase1ExperienceInput = {
  title: string;
  situation: string;
  actionTaken: string;
  outcome: string;
  lesson?: string | null;
};

// ── Validation shared by the API routes and the tests ─────────────────────────

export class LifeOsInputError extends Error {
  constructor(public readonly code: string) {
    super(code);
    this.name = "LifeOsInputError";
  }
}

function boundedText(value: unknown, max: number, code: string, required: boolean): string | null {
  if (value === undefined || value === null || value === "") {
    if (required) throw new LifeOsInputError(code);
    return null;
  }
  if (typeof value !== "string") throw new LifeOsInputError(code);
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    if (required) throw new LifeOsInputError(code);
    return null;
  }
  if (trimmed.length > max) throw new LifeOsInputError(code);
  return trimmed;
}

export function parseCurrentStateInput(body: unknown): CurrentStateInput {
  const value = (body ?? {}) as Record<string, unknown>;
  const tags = value.stateTags;
  if (!Array.isArray(tags) || tags.length < 1 || tags.length > 5) throw new LifeOsInputError("state_tags_invalid");
  const stateTags = tags.map((tag) => {
    if (typeof tag !== "string" || !STATE_TAG_VOCABULARY.includes(tag)) throw new LifeOsInputError("state_tag_not_recognised");
    return tag;
  });
  if (new Set(stateTags).size !== stateTags.length) throw new LifeOsInputError("state_tags_duplicated");
  const mood = value.mood === undefined || value.mood === null ? null : value.mood;
  if (mood !== null && !MOOD_VALUES.includes(mood as Mood)) throw new LifeOsInputError("mood_invalid");
  const energy = value.energy === undefined || value.energy === null ? null : value.energy;
  if (energy !== null && !ENERGY_VALUES.includes(energy as Energy)) throw new LifeOsInputError("energy_invalid");
  const source = value.source ?? "manual";
  if (!CURRENT_STATE_SOURCES.includes(source as CurrentStateSource)) throw new LifeOsInputError("source_invalid");
  return {
    stateTags,
    mood: mood as Mood | null,
    energy: energy as Energy | null,
    situation: boundedText(value.situation, 500, "situation_invalid", false),
    reflection: boundedText(value.reflection, 1000, "reflection_invalid", false),
    source: source as CurrentStateSource,
  };
}

export function parseGoalInput(body: unknown): { title: string; description: string | null } {
  const value = (body ?? {}) as Record<string, unknown>;
  return {
    title: boundedText(value.title, 120, "goal_title_required", true) as string,
    description: boundedText(value.description, 1000, "goal_description_invalid", false),
  };
}

export function parseReflectionInput(body: unknown): LifeReflectionInput {
  const value = (body ?? {}) as Record<string, unknown>;
  const parsed: Record<string, string | null> = {};
  for (const entry of REFLECTION_FIELDS) {
    parsed[entry.field] = boundedText(
      value[entry.field],
      2000,
      entry.required ? "reflection_what_happened_required" : `${entry.field}_invalid`,
      entry.required,
    );
  }
  const experienceId = value.experienceId;
  if (experienceId !== undefined && experienceId !== null && typeof experienceId !== "string") {
    throw new LifeOsInputError("experience_id_invalid");
  }
  return {
    ...(parsed as Omit<LifeReflectionInput, "what_happened" | "experienceId">),
    what_happened: parsed.what_happened as string,
    experienceId: (experienceId as string | undefined) ?? null,
  };
}
