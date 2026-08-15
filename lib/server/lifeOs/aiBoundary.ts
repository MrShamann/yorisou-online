import "server-only";

// OSF-1 — the Phase 1 AI boundary, enforced rather than described.
//
// The package states what AI may and may not do. Prompts already say so — the experience-card
// structuring prompt opens with 「事実を追加せず匿名化して…診断や断定は禁止です」 — but a prompt is a
// request, and a provider that ignores it produces text nobody checks. This module is the check.
//
// WHAT IT SCANS, AND WHAT IT MUST NEVER SCAN.
//
// It scans MODEL OUTPUT. It does not scan what a person wrote.
//
// That distinction is the whole design. Someone writing 「うつ病と診断されて休職した」 in their own
// reflection is describing their own life, and a product that refuses to store that sentence has
// decided the person may not talk about themselves. The same sentence generated ABOUT them by a
// model is a clinical claim the product is not allowed to make. Same words, opposite meaning,
// decided entirely by who is speaking — so the boundary is applied at exactly one place: text on its
// way out of a provider and into a surface.
//
// Nothing here calls a provider. Memory candidates are derived deterministically from what the
// person already wrote (see buildMemoryCandidates), which is why the confirm-before-save flow works
// with every AI provider switched off — which is their current state
// (yorisou_ai_runtime_controls.global_enabled defaults to false).

import { createHash } from "crypto";
import {
  MEMORY_TYPE_LABELS,
  type MemoryCandidate,
  type MemoryType,
  type Goal,
  type LifeReflection,
} from "@/lib/life-os/contract";

/**
 * The declared boundary, as data.
 *
 * It is exported so lib/server/__tests__/osf1AiBoundary.test.ts can assert the list itself has not
 * been quietly widened — a boundary that lives only in prose gets edited without anyone noticing.
 */
export const AI_BOUNDARY = {
  permitted: [
    "summarise_user_input",
    "organise_reflection",
    "suggest_memory_candidates",
    "ask_reflection_questions",
  ],
  prohibited: [
    "diagnose",
    "define_personality",
    "create_permanent_identity",
    "infer_sensitive_traits",
    "create_memory_without_confirmation",
  ],
} as const;

export type BoundaryCategory =
  | "diagnosis"
  | "personality_definition"
  | "permanent_identity"
  | "sensitive_trait_inference"
  | "absolute_certainty";

type Rule = { category: BoundaryCategory; pattern: RegExp; note: string };

/**
 * Deliberately narrow patterns.
 *
 * A scanner that fires on 「重い」 or 「不安」 would reject the ordinary vocabulary of a product about
 * how people feel, and the team would switch it off within a week. Each rule below matches a CLAIM
 * — a named condition, a statement about who someone is, a certainty — not a feeling word.
 */
const RULES: readonly Rule[] = [
  // 1. Diagnosis: naming a clinical condition, or claiming the act of diagnosing.
  {
    category: "diagnosis",
    pattern: /診断|確定診断|疾患|病名|治療が必要|受診が必要/,
    note: "clinical framing",
  },
  {
    category: "diagnosis",
    pattern: /うつ病|双極性|統合失調|適応障害|発達障害|不安障害|パニック障害|摂食障害|依存症|ＡＤＨＤ|ADHD|ASD|PTSD/i,
    note: "named clinical condition",
  },
  {
    category: "diagnosis",
    pattern: /\bdiagnos(?:e|es|ed|is|ing)\b|\byou (?:have|are suffering from) (?:an?\s+)?[a-z\s]*disorder\b/i,
    note: "clinical framing (en)",
  },
  // 2. Personality definition: a statement about what kind of person someone IS.
  //    「〜のようです」 (it seems) is untouched on purpose — that is the product's own register.
  {
    category: "personality_definition",
    pattern: /あなたは[^。]{0,24}(?:な人|タイプ|性格|人間)(?:です|だ|である)/,
    note: "assigns a person-type",
  },
  {
    category: "personality_definition",
    pattern: /あなたの性格|性格的に|あなたの本質|気質は|パーソナリティ/,
    note: "personality attribution",
  },
  {
    category: "personality_definition",
    pattern: /\byour personality\b|\byou are (?:an?|the) (?:kind|type) of person\b/i,
    note: "personality attribution (en)",
  },
  // 3. Permanent identity: framing a state as fixed or lifelong.
  {
    category: "permanent_identity",
    pattern: /あなたは(?:いつも|常に|昔から|生まれつき|根本的に)|一生|生涯にわたって|変わることはありません|永久に/,
    note: "fixes a state as permanent",
  },
  {
    category: "permanent_identity",
    // Any "you always/never …", not only the copular forms: "You always avoid conflict" is the same
    // claim as "You are always avoidant", and requiring an auxiliary let the commoner phrasing past.
    pattern: /\byou (?:always|never)\b|\bfor the rest of your life\b/i,
    note: "fixes a state as permanent (en)",
  },
  // 4. Sensitive traits: categories a product may never infer about someone.
  {
    category: "sensitive_trait_inference",
    pattern: /宗教|信仰|支持政党|政治的信条|性的指向|同性愛|人種|民族|出自|前科|病歴|妊娠していま|障害者手帳/,
    note: "sensitive category",
  },
  {
    category: "sensitive_trait_inference",
    pattern: /\b(?:religion|religious belief|sexual orientation|political affiliation|ethnicity|race)\b/i,
    note: "sensitive category (en)",
  },
  // 5. Absolute certainty: the register the writing rules prohibit outright.
  {
    category: "absolute_certainty",
    pattern: /必ず|絶対に|間違いなく|確実に|１００％|100%/,
    note: "absolute claim",
  },
  {
    category: "absolute_certainty",
    pattern: /\b(?:definitely|certainly|guaranteed|without a doubt)\b/i,
    note: "absolute claim (en)",
  },
];

export type BoundaryViolation = { category: BoundaryCategory; note: string; match: string };

/**
 * Inspect model output. Returns every violation found, not just the first — a caller logging one
 * category while four others slipped past would be worse than no check at all.
 */
export function inspectAiOutput(text: string): BoundaryViolation[] {
  if (typeof text !== "string" || text.length === 0) return [];
  const violations: BoundaryViolation[] = [];
  for (const rule of RULES) {
    const found = rule.pattern.exec(text);
    if (found) violations.push({ category: rule.category, note: rule.note, match: found[0] });
  }
  return violations;
}

/**
 * The enforcement point. Throws rather than sanitising: silently deleting the offending clause would
 * leave a sentence that reads as approved product voice while its provenance is a model that just
 * broke the rule. The caller falls back to its non-AI path instead.
 */
export function assertAiOutputWithinBoundary(text: string): void {
  const violations = inspectAiOutput(text);
  if (violations.length > 0) {
    throw new Error(`ai_boundary_violation:${violations.map((violation) => violation.category).join(",")}`);
  }
}

/**
 * sha256 hex of the confirmed sentence. Must equal `encode(sha256(convert_to(v_content, 'utf8')),
 * 'hex')` in yorisou_osf1_memory_confirm.
 *
 * WHAT THIS DIGEST DOES AND DOES NOT PROVE. It is an INTEGRITY check, not an authenticity one. It is
 * unkeyed, and the same untrusted caller supplies both the content and the digest, so a hostile
 * client can trivially compute a matching pair for any sentence it likes. What it actually rules out
 * is a MISTAKE: a candidate mutated in flight, a stale candidate replayed against edited content, or
 * a caller that assembles the save payload from a different field than the one it rendered. It does
 * NOT prove a human read the sentence — nothing sent from a client can prove that. The guarantee that
 * an unconfirmed memory cannot exist comes from `check (user_confirmed = true)` in the schema, not
 * from here.
 *
 * The digest is taken over the TRIMMED string, and callers must send that same trimmed string. SQL's
 * `btrim` strips ASCII spaces only, while JavaScript's `.trim()` also strips tabs, newlines and
 * U+3000 — so `btrim(jsTrimmed)` is always `jsTrimmed` and the two agree, whereas digesting the raw
 * input here would produce a spurious `osf1_memory_confirmation_mismatch` for any content that ended
 * in a newline. The digest tests in lib/server/__tests__/osf1AiBoundary.test.ts pin this. Note that
 * nothing normalizes Unicode: NFC and NFD of the same text hash differently. That is unreachable
 * today because the content is echoed back byte-for-byte from the response the server produced, and
 * that echo is the invariant to preserve if this ever gains a second caller.
 */
export function memoryDigest(content: string): string {
  return createHash("sha256").update(content.trim(), "utf8").digest("hex");
}

/**
 * Offer memory candidates.
 *
 * These are QUOTES, not conclusions. Each candidate's content is a sentence the person already
 * wrote, wrapped in the minimum framing needed to read as a memory — the product never proposes
 * remembering something it inferred, because a candidate that says something new is a claim the
 * person did not make and would be confirming without having written it.
 *
 * Nothing here writes to the database. A candidate has no id because it has no row: it exists in the
 * response body and in the dialog, and disappears if the person does not confirm.
 *
 * ONLY COLUMNS A FLOW ACTUALLY WRITES. The reflection candidate used to be keyed to `what_learned`,
 * which no flow asks any more — createReflection sends null for it — so it could never appear, and
 * the deep postmortem's own material was offered nowhere. The fields below are the ones the two
 * flows write, and each mode is read through the question it was actually asked: the same column
 * means different things depending on which flow filled it.
 *
 * WHAT IS DELIBERATELY NOT OFFERED. `goal_at_the_time` is what the person wanted BACK THEN; storing
 * it as a `goal` would turn a past want into a standing direction the person never stated.
 * `information_at_hand` and `options_considered` only mean anything beside the decision they
 * explain, and `felt` is a moment, not something to carry forward as a fact about oneself.
 */
export function buildMemoryCandidates(input: {
  reflection?: Pick<LifeReflection, "id" | "mode" | "tried" | "decision_made" | "next_time"> | null;
  goal?: Pick<Goal, "id" | "title"> | null;
}): MemoryCandidate[] {
  const candidates: MemoryCandidate[] = [];

  const push = (
    memoryType: MemoryType,
    content: string | null | undefined,
    reason: string,
    subject: MemoryCandidate["subject"],
  ) => {
    const trimmed = (content ?? "").trim();
    if (trimmed.length === 0 || trimmed.length > 2000) return;
    candidates.push({
      memoryType,
      content: trimmed,
      source: "user_confirmed_ai_suggestion",
      digest: memoryDigest(trimmed),
      reason,
      subject,
    });
  };

  if (input.reflection) {
    const reflection = input.reflection;
    const subject = { reflectionId: reflection.id };
    if (reflection.mode === "postmortem") {
      // The decision is what the deep flow exists to keep — the sentence that says what was chosen,
      // readable later without the outcome attached to it.
      push(
        "reflection",
        reflection.decision_made,
        `${MEMORY_TYPE_LABELS.reflection}で書いた「決めたこと」をそのまま残せます。`,
        subject,
      );
      // Question 7 asks what you would DO next time: a way of doing, not a conclusion.
      push("preference", reflection.next_time, "次にどうしたいか書いたことを、やり方として残せます。", subject);
    } else {
      push("experience", reflection.tried, `試したことを、${MEMORY_TYPE_LABELS.experience}として残せます。`, subject);
      // Question 5 asks what you can carry FORWARD, which is a conclusion — what `lesson` is for, and
      // the one kind of memory a reflection most often produces.
      push(
        "lesson",
        reflection.next_time,
        `次に活かせそうだと書いたことを、${MEMORY_TYPE_LABELS.lesson}として残せます。`,
        subject,
      );
    }
  }

  if (input.goal) {
    push(
      "goal",
      input.goal.title,
      "いま向かっている方向として残せます。",
      { goalId: input.goal.id },
    );
  }

  return candidates;
}
