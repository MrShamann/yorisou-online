import "server-only";

// OSF-1 PHASE D — the Reflection Assistant.
//
// WHAT IT IS ALLOWED TO BE, AND THE ONE DESIGN CHOICE THAT MADE IT SAFE TO BUILD.
//
// `Yorisou_Recommendation_and_Reflection_Governance_v1.0.md` requires that any reflection
// referencing a stored memory pass an eligibility rule — confirmed + reflection permission +
// permitting condition — checked by one shared permission service. That service does not exist in
// this codebase: `use_permission` and `permissionCheckService` are named in the 18-entity model and
// are unbuilt (recorded as known limitation 5 of the Phase 1 package).
//
// So an assistant that READS a person's stored memories has no governed read gate to pass through,
// and building one would be Package B. This assistant therefore reads NOTHING. It works only on the
// text the person typed in the same request, and it holds no history between calls. That is not a
// limitation worked around — it is what makes the capability buildable today without inventing the
// permission layer or quietly skipping it.
//
// ALLOWED (matching AI_BOUNDARY.permitted): ask reflection questions, summarise what was written,
// organise it, suggest wording.
// FORBIDDEN: diagnosis, personality judgement, permanent identity, psychological conclusion — every
// provider response passes assertAiOutputWithinBoundary before it can reach a surface, and a
// violation discards the whole draft rather than editing it.
//
// THE OUTPUT IS A DRAFT, NOT A RECORD. Nothing is persisted here. The draft exists in one HTTP
// response; the person edits or discards it, and only an explicit save writes anything. That mirrors
// the memory-confirmation design: the product cannot end up holding something nobody agreed to,
// because there is nowhere for it to be held.
//
// PROVIDER ROUTING. `Yorisou_AI_and_Provider_Governance_v1.0.md`: "All model calls route through the
// Provider Harness … no direct provider calls." This uses resolvePrivateReflectionProviders(), the
// same resolver privateAi.ts and structureExperience use. Providers are OFF by default in this
// product, so the ordinary outcome is `assistant_unavailable` — and the flow is designed so the
// person still completes their reflection without it.

import { resolvePrivateReflectionProviders } from "@/lib/server/privateAiProviderResolver";
import { assertAiOutputWithinBoundary, inspectAiOutput } from "@/lib/server/lifeOs/aiBoundary";
import {
  LIGHT_REFLECTION_QUESTIONS,
  POSTMORTEM_REFLECTION_QUESTIONS,
  reflectionQuestionsFor,
  type ReflectionField,
  type ReflectionMode,
} from "@/lib/life-os/contract";

export type ReflectionAnswers = Partial<Record<ReflectionField, string>>;

export type ReflectionDraft = {
  /** The organised text, for the person to accept, edit, or throw away. */
  draft: string;
  /** One question the assistant offers back. Never rhetorical, never leading. */
  question: string | null;
  provider: string;
  model: string;
};

export type ReflectionDraftOutcome =
  | { ok: true; draft: ReflectionDraft }
  | { ok: false; reason: "assistant_unavailable" | "nothing_written" | "boundary_violation" | "provider_error" };

const SYSTEM = "Return only valid JSON.";

/**
 * The questions only the deep postmortem asks — what was wanted, what was known, what options
 * existed, what was decided. Derived by diffing the two sets rather than listed again here, because a
 * hand-kept copy drifts the first time a question moves between them.
 */
const LIGHT_FIELDS = new Set<string>(
  LIGHT_REFLECTION_QUESTIONS.flatMap((question) => question.fields.map((entry) => entry.field)),
);
const POSTMORTEM_ONLY_FIELDS = POSTMORTEM_REFLECTION_QUESTIONS.flatMap((question) =>
  question.fields.map((entry) => entry.field),
).filter((field) => !LIGHT_FIELDS.has(field));

/**
 * Which flow these answers came from.
 *
 * The mode does not arrive with the request: parseAssistantInput() returns answer fields only, so the
 * route has no mode to pass. It is recoverable without guessing, because the four postmortem
 * questions are asked nowhere else — any of them holding text means the person is in the deep flow.
 * A postmortem answered with only the three shared questions is indistinguishable from a light one
 * and is read as light, which costs nothing: the answers the light set has no question for are
 * exactly the ones that were left empty.
 */
function modeOf(answers: ReflectionAnswers): ReflectionMode {
  const deep = POSTMORTEM_ONLY_FIELDS.some((field) => (answers[field] ?? "").trim().length > 0);
  return deep ? "postmortem" : "light";
}

/**
 * One organising instruction per mode. The deep flow separates the decision from what followed, and
 * that separation is the reason the format exists — a draft that folds them back together reads the
 * outcome as a verdict on the choice, which is the error the postmortem is built to prevent.
 */
const ORGANISING_BY_MODE: Record<ReflectionMode, string> = {
  light: "書かれたことを、起きた順にそのまま整理してください。",
  postmortem: "決めたことと、そのあと起きたことは、切り離して整理してください。",
};

/**
 * The prompt. Written to make the prohibited outputs hard to produce rather than merely disallowed:
 * it states the person's words are the subject, forbids adding facts, and asks for a question rather
 * than a conclusion.
 *
 * Organised by the questions of the mode the person is actually in. Walking the light set for every
 * request dropped four of a postmortem's seven answers before the call was made: what was wanted,
 * what was known at the time, the options that existed and the decision taken have no light question
 * to hang on, so the deepest thing the person wrote never reached the provider and the draft came
 * back built from the three shared answers.
 */
function prompt(answers: ReflectionAnswers, mode: ReflectionMode): string {
  // Widened from the two readonly question sets: only the prompt and the field names are read here.
  const questions: readonly { prompt: string; fields: readonly { field: string }[] }[] =
    reflectionQuestionsFor(mode);
  const written = questions.flatMap((q) =>
    q.fields.map((f) => ({ q: q.prompt, a: (answers[f.field as ReflectionField] ?? "").trim() })),
  ).filter((entry) => entry.a.length > 0);
  return [
    "あなたはYORISOUの「振り返りアシスタント」です。利用者が書いた文章を整理するだけの役割です。",
    "",
    "してよいこと: 書かれた内容をそのままの意味で整理する / 読みやすく言い換える / 続きを考えるための問いを一つ添える。",
    "してはいけないこと: 診断する / 性格を判断する / 「あなたは〜な人です」と断定する / 心理的な結論を出す / 書かれていない事実を足す / 助言や指示をする。",
    "",
    ORGANISING_BY_MODE[mode],
    "",
    "利用者が書いたこと:",
    ...written.map((entry) => `- ${entry.q} → ${entry.a}`),
    "",
    '次のJSONだけを返してください: {"draft":"整理した文章（日本語、書かれた内容のみ）","question":"続きを考えるための短い問い、なければ空文字"}',
  ].join("\n");
}

function validate(value: unknown): { draft: string; question: string | null } | null {
  if (!value || typeof value !== "object") return null;
  const data = value as Record<string, unknown>;
  const draft = typeof data.draft === "string" ? data.draft.trim() : "";
  if (draft.length === 0 || draft.length > 4000) return null;
  const raw = typeof data.question === "string" ? data.question.trim() : "";
  return { draft, question: raw.length > 0 && raw.length <= 300 ? raw : null };
}

/**
 * Produce a draft from what the person just wrote. Reads no stored record; keeps no state.
 *
 * Returns a reason rather than throwing, because every failure here is one the flow must survive
 * gracefully: the person is mid-reflection and must be able to finish without the assistant.
 */
export async function draftReflection(answers: ReflectionAnswers): Promise<ReflectionDraftOutcome> {
  const hasText = Object.values(answers).some((value) => (value ?? "").trim().length > 0);
  if (!hasText) return { ok: false, reason: "nothing_written" };

  const routes = resolvePrivateReflectionProviders();
  if (routes.length === 0) return { ok: false, reason: "assistant_unavailable" };

  const body = prompt(answers, modeOf(answers));
  for (const route of routes) {
    try {
      const response = await fetch(route.endpoint, {
        method: "POST",
        headers: route.headers,
        body: JSON.stringify(route.body(`${SYSTEM}\n\n${body}`)),
        signal: AbortSignal.timeout(20000),
      });
      if (!response.ok) continue;
      const parsed = route.parse(await response.json());
      if (!parsed.content) continue;
      const value = validate(JSON.parse(parsed.content));
      if (!value) continue;
      // THE BOUNDARY, ENFORCED BEFORE ANYTHING REACHES A SURFACE. A violation discards the whole
      // draft: a sanitised sentence would still carry the provenance of a model that just broke the
      // rule, and would read to the person as the product's own voice.
      const combined = [value.draft, value.question ?? ""].join("\n");
      if (inspectAiOutput(combined).length > 0) return { ok: false, reason: "boundary_violation" };
      assertAiOutputWithinBoundary(combined);
      return { ok: true, draft: { ...value, provider: route.provider, model: route.model } };
    } catch {
      continue;
    }
  }
  return { ok: false, reason: "provider_error" };
}
