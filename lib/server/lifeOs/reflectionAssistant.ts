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

import {
  resolvePrivateReflectionProviders,
  type ReflectionProviderRoute,
} from "@/lib/server/privateAiProviderResolver";
import { assertAiOutputWithinBoundary, inspectAiOutput } from "@/lib/server/lifeOs/aiBoundary";
import {
  LIGHT_REFLECTION_QUESTIONS,
  POSTMORTEM_REFLECTION_QUESTIONS,
  REFLECTION_FIELDS,
  REFLECTION_MODES,
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

/**
 * Why no draft was produced. NORMALIZED, and deliberately more specific than the surface needs.
 *
 * Every one of these used to collapse into `provider_error`. That was wrong in a way that only shows
 * up when something is broken: a provider returning `{}` for every request, a model that ignored the
 * JSON instruction, and a network that never answered were indistinguishable in the logs, so the one
 * question an operator asks — *which* of those is happening — had no answer anywhere.
 *
 * The PERSON is told one thing regardless (「いまは整理を利用できません」), because none of this is their
 * problem and the flow continues either way. The distinction exists for the operational event, not
 * for the screen.
 */
export type ReflectionDraftFailure =
  /** No provider is configured. The ORDINARY state of this product — not an error. */
  | "assistant_unavailable"
  | "nothing_written"
  | "input_too_long"
  | "unsupported_mode"
  /** Every attempt was still outstanding when the total budget ran out. */
  | "provider_timeout"
  | "provider_http_error"
  /** The call succeeded and carried no content. */
  | "provider_empty"
  /** Not JSON, or JSON of the wrong shape. */
  | "provider_malformed"
  /** A valid draft, over the length the person could actually save. Refused, never truncated. */
  | "provider_oversized"
  /** Output crossed the AI boundary. The whole draft is discarded. */
  | "boundary_violation";

export type ReflectionDraftOutcome =
  | { ok: true; draft: ReflectionDraft }
  | { ok: false; reason: ReflectionDraftFailure };

const SYSTEM = "Return only valid JSON.";

/**
 * THE INPUT BOUND, derived rather than chosen.
 *
 * Every answer is already capped at 2000 characters by `boundedText` in parseAssistantInput, and the
 * set of answer fields is closed, so the total a request can carry is bounded by construction. Naming
 * that product here does two things a round number would not: it states what the bound actually is,
 * and it fails loudly if the contract ever grows a field without anyone reconsidering what reaches a
 * provider. A guard on a number that cannot currently be exceeded is not dead code — it is the thing
 * that notices when it becomes exceedable.
 */
const MAX_ANSWER_LENGTH = 2000;
export const ASSISTANT_MAX_INPUT_CHARS = REFLECTION_FIELDS.length * MAX_ANSWER_LENGTH;

/**
 * ONE call's deadline, and the TOTAL deadline for the request.
 *
 * The loop below tries each configured provider in turn, which is the harness's fallback contract.
 * Without a total budget that is `routes.length * 20s` of server time for one press of one button —
 * with a primary and four fallbacks, a hundred seconds during which the person has no answer and no
 * way to know one is coming. The total is what makes the fallback bounded rather than merely finite.
 *
 * ATTEMPTS are bounded too. A fallback exists to survive one provider being down, not to poll five of
 * them; beyond the second the marginal chance of success does not pay for the wait.
 */
const CALL_TIMEOUT_MS = 20_000;
const TOTAL_BUDGET_MS = 25_000;
const MAX_PROVIDER_ATTEMPTS = 2;

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
/**
 * Which failure an exception represents. Three outcomes, because `response.json()` and `fetch()` fail
 * in three genuinely different ways and an operator needs them apart:
 *
 *   TimeoutError   the deadline passed — `AbortSignal.timeout` rejects with a DOMException whose name
 *                  is this, and Node's DOMException IS an `instanceof Error`, so it reads correctly
 *                  both for a header-phase abort and for a body that stalls after headers arrived.
 *   SyntaxError    the body arrived and is not JSON — a gateway error page answering 200, say. That is
 *                  malformed, not a transport problem, and calling it one sends an operator to the
 *                  network when the answer is in the provider's response.
 *   anything else  transport: a reset socket, DNS, a refused connection.
 */
function classify(error: unknown): ReflectionDraftFailure {
  if (!(error instanceof Error)) return "provider_http_error";
  if (error.name === "TimeoutError") return "provider_timeout";
  if (error.name === "SyntaxError") return "provider_malformed";
  return "provider_http_error";
}

function prompt(answers: ReflectionAnswers, mode: ReflectionMode): string {
  // Widened from the two readonly question sets: only the prompt and the field names are read here.
  const questions: readonly { prompt: string; fields: readonly { field: string }[] }[] =
    reflectionQuestionsFor(mode);
  const written = questions.flatMap((q) =>
    q.fields.map((f) => ({ q: q.prompt, a: (answers[f.field as ReflectionField] ?? "").trim() })),
  ).filter((entry) => entry.a.length > 0);
  // EACH ANSWER IS SERIALIZED, NOT INTERPOLATED — and this closes a real hole.
  //
  // `boundedText` trims the ENDS of an answer and caps its length; interior newlines survive, and the
  // block below is joined with "\n". So an answer containing a newline escaped its bullet, and an
  // adversarial review demonstrated it: one `what_happened` value produced a prompt with TWO
  // 「利用者が書いたこと:」 labels, two JSON instruction lines, and three attacker lines at column zero.
  // The claim that there was "no instruction channel" was structurally false.
  //
  // JSON.stringify makes every answer exactly one line: newlines become \n, quotes are escaped, and
  // nothing a person can type reaches column zero. It also loses no content — the model receives the
  // text verbatim, quoted — which matters, because the alternative (stripping newlines) would silently
  // alter what somebody wrote.
  //
  // Impact was self-directed: the prompt carries no other person's data, no tools and no retrieval, so
  // the only victim was the injector. That bounds the severity; it does not make the claim true.
  const asOneLine = (value: string) => JSON.stringify(value);
  return [
    "あなたはYORISOUの「振り返りアシスタント」です。利用者が書いた文章を整理するだけの役割です。",
    "",
    "してよいこと: 書かれた内容をそのままの意味で整理する / 読みやすく言い換える / 続きを考えるための問いを一つ添える。",
    "してはいけないこと: 診断する / 性格を判断する / 「あなたは〜な人です」と断定する / 心理的な結論を出す / 書かれていない事実を足す / 助言や指示をする。",
    "",
    ORGANISING_BY_MODE[mode],
    "",
    "利用者が書いたこと:",
    ...written.map((entry) => `- ${entry.q} → ${asOneLine(entry.a)}`),
    "",
    '次のJSONだけを返してください: {"draft":"整理した文章（日本語、書かれた内容のみ）","question":"続きを考えるための短い問い、なければ空文字"}',
  ].join("\n");
}

/**
 * The output bound is the COLUMN's bound, not a round number.
 *
 * A draft is applied by appending it to the person's `next_time` answer, and that column accepts
 * 2000 characters. The previous ceiling of 4000 therefore allowed a perfectly valid draft that the
 * person could accept and then fail to save — the assistant handing them something the product would
 * refuse. Bounding the two at the same number is what makes "use this draft" always work.
 */
const MAX_DRAFT_LENGTH = 2000;
const MAX_QUESTION_LENGTH = 300;

type Validated =
  | { ok: true; value: { draft: string; question: string | null } }
  | { ok: false; reason: "provider_malformed" | "provider_empty" | "provider_oversized" };

/**
 * Check a parsed provider response. Returns WHICH way it was wrong, not merely that it was.
 *
 * The three cases are genuinely different faults with different fixes: a wrong shape is a prompt or
 * model problem, an empty draft is a model that had nothing to say, and an over-length draft is a
 * model that ignored a bound. Collapsing them lost the only signal that separates "the provider is
 * misconfigured" from "the provider is verbose".
 */
function validate(value: unknown): Validated {
  if (!value || typeof value !== "object" || Array.isArray(value)) return { ok: false, reason: "provider_malformed" };
  const data = value as Record<string, unknown>;
  if (data.draft !== undefined && typeof data.draft !== "string") return { ok: false, reason: "provider_malformed" };
  const draft = typeof data.draft === "string" ? data.draft.trim() : "";
  if (draft.length === 0) return { ok: false, reason: "provider_empty" };
  // Over-length is REFUSED, never truncated. Cutting a provider's output mid-sentence and showing it
  // as a finished draft would be the product putting words in someone's mouth badly.
  if (draft.length > MAX_DRAFT_LENGTH) return { ok: false, reason: "provider_oversized" };
  const raw = typeof data.question === "string" ? data.question.trim() : "";
  // An over-length or non-string QUESTION is dropped rather than fatal: the question is an optional
  // extra, and losing it costs the person nothing, whereas discarding a good draft over it would.
  return { ok: true, value: { draft, question: raw.length > 0 && raw.length <= MAX_QUESTION_LENGTH ? raw : null } };
}

/**
 * Produce a draft from what the person just wrote. Reads no stored record; keeps no state.
 *
 * Returns a reason rather than throwing, because every failure here is one the flow must survive
 * gracefully: the person is mid-reflection and must be able to finish without the assistant.
 */
export async function draftReflection(
  answers: ReflectionAnswers,
  requestedMode: ReflectionMode | null = null,
  /**
   * The provider routes to try. Defaults to the Provider Harness resolver, which is the only thing
   * production ever uses — `AI and Provider Governance v1.0`: "All model calls route through the
   * Provider Harness … no direct provider calls."
   *
   * It is a parameter so a TEST can supply a deterministic route without a real provider, a network
   * call, or an API key. Deliberately NOT an environment variable and NOT an alias in the resolver:
   * a fake provider selectable by configuration is a fake provider that can be selected in
   * production. This one exists only where a caller passes it in, and no shipped caller does.
   */
  routes: ReflectionProviderRoute[] = resolvePrivateReflectionProviders(),
): Promise<ReflectionDraftOutcome> {
  if (requestedMode !== null && !REFLECTION_MODES.includes(requestedMode)) {
    // parseAssistantInput refuses an unsupported mode before this is reached, so this is the second
    // of two gates rather than the only one. It stays because `draftReflection` is exported and a
    // future caller need not go through the route.
    return { ok: false, reason: "unsupported_mode" };
  }
  const written = Object.values(answers).filter((value) => (value ?? "").trim().length > 0);
  if (written.length === 0) return { ok: false, reason: "nothing_written" };
  const total = written.reduce((sum, value) => sum + (value ?? "").length, 0);
  if (total > ASSISTANT_MAX_INPUT_CHARS) return { ok: false, reason: "input_too_long" };

  if (routes.length === 0) return { ok: false, reason: "assistant_unavailable" };

  // An explicit, already-validated mode wins; inference is the fallback for callers that do not
  // send one. Inference stays because it is still correct — the four postmortem questions are asked
  // nowhere else — but a stated mode should never be second-guessed.
  const body = prompt(answers, requestedMode ?? modeOf(answers));
  const startedAt = Date.now();
  // The FIRST failure seen, kept. The comment here used to say a later route "must not erase what an
  // earlier one told us" while every branch assigned unconditionally — last write won, so a primary
  // that returned malformed JSON followed by an unreachable fallback reported `provider_http_error`
  // and the actionable half was lost. `note()` only records the first, which is what was meant.
  let failure: ReflectionDraftFailure | null = null;
  const note = (reason: ReflectionDraftFailure) => {
    if (failure === null) failure = reason;
  };

  let candidate: { value: { draft: string; question: string | null }; provider: string; model: string } | null = null;

  for (const route of routes.slice(0, MAX_PROVIDER_ATTEMPTS)) {
    const remaining = TOTAL_BUDGET_MS - (Date.now() - startedAt);
    // Stop rather than fire a request that cannot finish inside the budget. Starting one anyway is
    // how a bounded loop becomes an unbounded wait.
    if (remaining <= 0) return { ok: false, reason: "provider_timeout" };
    try {
      const response = await fetch(route.endpoint, {
        method: "POST",
        headers: route.headers,
        body: JSON.stringify(route.body(`${SYSTEM}\n\n${body}`)),
        signal: AbortSignal.timeout(Math.min(CALL_TIMEOUT_MS, remaining)),
      });
      if (!response.ok) {
        note("provider_http_error");
        continue;
      }
      let payload: unknown;
      try {
        payload = await response.json();
      } catch (error) {
        // CLASSIFIED, not assumed. Headers can arrive and the BODY stall past the deadline — common
        // with a proxied provider — and `response.json()` then rejects with a TimeoutError. Mapping
        // every rejection here to `provider_malformed` reported a slow provider as "the model ignored
        // the JSON instruction", which sends an operator to the wrong place.
        note(classify(error));
        continue;
      }
      const parsed = route.parse(payload);
      if (!parsed.content || parsed.content.trim().length === 0) {
        note("provider_empty");
        continue;
      }
      // Named `parsedJson`, not `candidate`. It shadowed the outer `candidate` the boundary check
      // below the loop reads, so the capture assigned to the wrong binding and every successful draft
      // was silently dropped. Eight tests caught it, which is what they are for.
      let parsedJson: unknown;
      try {
        parsedJson = JSON.parse(parsed.content);
      } catch {
        note("provider_malformed");
        continue;
      }
      const checked = validate(parsedJson);
      if (!checked.ok) {
        note(checked.reason);
        continue;
      }
      // THE BOUNDARY, ENFORCED BEFORE ANYTHING REACHES A SURFACE. A violation discards the whole
      // draft: a sanitised sentence would still carry the provenance of a model that just broke the
      // rule, and would read to the person as the product's own voice.
      //
      // It RETURNS rather than falling through to the next provider, and that is deliberate. Trying
      // another model after one crossed the boundary is shopping for a compliant answer to a prompt
      // that just produced a prohibited one.
      // CAPTURED HERE, CHECKED BELOW THE CATCH. The boundary check used to sit inside this try, and
      // the no-retry property then rested entirely on the explicit `return` above the assert: if that
      // line were ever removed, `assertAiOutputWithinBoundary`'s throw would be swallowed by the catch,
      // misreported as a transport error, AND retried against the next provider — shopping for a
      // compliant answer to a prompt that just produced a prohibited one. Moved out, that is
      // impossible by structure rather than by one line's continued existence.
      candidate = { value: checked.value, provider: route.provider, model: route.model };
      break;
    } catch (error) {
      note(classify(error));
      continue;
    }
  }
  // THE BOUNDARY, ENFORCED BEFORE ANYTHING REACHES A SURFACE, and outside every catch. A violation
  // discards the whole draft: a sanitised sentence would still carry the provenance of a model that
  // just broke the rule, and would read to the person as the product's own voice.
  if (candidate) {
    const combined = [candidate.value.draft, candidate.value.question ?? ""].join("\n");
    if (inspectAiOutput(combined).length > 0) return { ok: false, reason: "boundary_violation" };
    assertAiOutputWithinBoundary(combined);
    return { ok: true, draft: { ...candidate.value, provider: candidate.provider, model: candidate.model } };
  }
  // Every route refused and none said why: only reachable if `routes` was non-empty and every attempt
  // failed before setting a reason, which the branches above make impossible. Named rather than
  // defaulted, so it cannot masquerade as an HTTP error.
  return { ok: false, reason: failure ?? "provider_http_error" };
}
