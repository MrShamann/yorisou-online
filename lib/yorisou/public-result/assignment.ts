import { FORMULA_DRAFT_REQUIRES_EDWARD_APPROVAL, type SubdimensionCode } from "@/lib/yorisou/scoring/types";

import { PUBLIC_ARCHETYPE_RULES, PUBLIC_CLAN_RULES } from "./mapping";
import { PUBLIC_ARCHETYPE_BY_CODE } from "./taxonomy";
import type {
  PublicArchetypeDefinition,
  PublicAssignmentAggregateInput,
  PublicResultAssignment,
  PublicClanCode,
  PublicResultResolution,
} from "./types";

const REQUIRED_ANSWER_COUNT = 120;

function countMatches(
  groupedBySubdimension: PublicAssignmentAggregateInput["groupedBySubdimension"],
  subdimensions: readonly SubdimensionCode[],
) {
  return subdimensions.reduce((total, code) => {
    return total + (groupedBySubdimension[code]?.length ?? 0);
  }, 0);
}

function hasSensitiveRouting(input: PublicAssignmentAggregateInput) {
  const safety = input.safetyRoutingSummary;
  if (!safety) return false;

  return (
    safety.sensitivityCounts.private_high > 0 ||
    safety.reviewRoutingCounts.needs_review > 0 ||
    safety.reviewRoutingCounts.needs_human_review_sensitive > 0
  );
}

function selectClan(input: PublicAssignmentAggregateInput): PublicClanCode | null {
  const clanCandidates = PUBLIC_CLAN_RULES.map((rule) => ({
    clanCode: rule.clanCode,
    primaryCount: countMatches(input.groupedBySubdimension, rule.primarySubdimensions),
    secondaryCount: countMatches(input.groupedBySubdimension, rule.secondarySubdimensions),
  }));

  const maxPrimary = Math.max(...clanCandidates.map((candidate) => candidate.primaryCount));
  const primaryLeaders = clanCandidates.filter((candidate) => candidate.primaryCount === maxPrimary);
  if (primaryLeaders.length === 1) {
    return primaryLeaders[0].clanCode;
  }

  const maxSecondary = Math.max(...primaryLeaders.map((candidate) => candidate.secondaryCount));
  const secondaryLeaders = primaryLeaders.filter((candidate) => candidate.secondaryCount === maxSecondary);
  return secondaryLeaders.length === 1 ? secondaryLeaders[0].clanCode : null;
}

function selectArchetype(
  clanCode: PublicClanCode,
  input: PublicAssignmentAggregateInput,
): PublicArchetypeDefinition | null {
  const rules = PUBLIC_ARCHETYPE_RULES.filter((rule) => rule.clanCode === clanCode);
  const archetypeCandidates = rules.map((rule) => ({
    archetype: PUBLIC_ARCHETYPE_BY_CODE[rule.publicCode],
    primaryCount: countMatches(input.groupedBySubdimension, rule.primarySubdimensions),
    secondaryCount: countMatches(input.groupedBySubdimension, rule.secondarySubdimensions),
  }));

  const maxPrimary = Math.max(...archetypeCandidates.map((candidate) => candidate.primaryCount));
  const primaryLeaders = archetypeCandidates.filter((candidate) => candidate.primaryCount === maxPrimary);
  if (primaryLeaders.length === 1) {
    return primaryLeaders[0].archetype;
  }

  const maxSecondary = Math.max(...primaryLeaders.map((candidate) => candidate.secondaryCount));
  const secondaryLeaders = primaryLeaders.filter((candidate) => candidate.secondaryCount === maxSecondary);
  return secondaryLeaders.length === 1 ? secondaryLeaders[0].archetype : null;
}

function toPublicAssignment(archetype: PublicArchetypeDefinition): PublicResultAssignment {
  const {
    publicCode,
    nickname,
    clanEnglish,
    clanJapanese,
    secondaryBadge,
    currentStateNote,
    mappingVersion,
  } = archetype;

  return {
    publicCode,
    nickname,
    clanEnglish,
    clanJapanese,
    secondaryBadge,
    currentStateNote,
    mappingVersion,
  };
}

function hasRequiredFields(input: PublicAssignmentAggregateInput) {
  return Boolean(
    input &&
      input.groupedBySubdimension &&
      input.formulaStatus &&
      typeof input.answerCount === "number",
  );
}

export function assignPublicArchetype(
  input: PublicAssignmentAggregateInput,
): PublicResultResolution {
  if (!hasRequiredFields(input)) {
    return { assignment: null, status: "placeholder" };
  }

  if (input.answerCount < REQUIRED_ANSWER_COUNT) {
    return { assignment: null, status: "placeholder" };
  }

  if (input.formulaStatus !== FORMULA_DRAFT_REQUIRES_EDWARD_APPROVAL) {
    return { assignment: null, status: "placeholder" };
  }

  if (hasSensitiveRouting(input)) {
    return { assignment: null, status: "placeholder" };
  }

  const clanCode = selectClan(input);
  if (!clanCode) {
    return { assignment: null, status: "placeholder" };
  }

  const assignment = selectArchetype(clanCode, input);
  if (!assignment) {
    return { assignment: null, status: "placeholder" };
  }

  return {
    assignment: toPublicAssignment(assignment),
    status: "assigned",
  };
}
