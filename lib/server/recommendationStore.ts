import "server-only";

// UX-2R / CPC-1 — the canonical recommendation runtime.
//
// The database graph landed first; nothing in the application called it, so "helpful", "I tried
// it" and "not for me" still evaporated on refresh. This module is the only path between the app
// and that graph.
//
// Every operation goes through the SECURITY DEFINER RPCs, which re-check the full authorization
// chain on each call — result exists, owner matches, not erased, live envelope valid, current
// interpretation is confirmed or corrected, recommendation permission currently true. Nothing here
// caches a permission or trusts one the caller supplies: consent is a present-tense fact, and a
// person who has just rejected their result must stop being recommended to immediately.

import { rpc, request } from "./assessmentAttemptStore";
import {
  GOVERNED_RECOMMENDATION_CONTENT_VERSION,
  buildGovernedRecommendationItems,
  findGovernedRecommendation,
  type GovernedRecommendation,
} from "@/lib/yorisou/recommendations/governed";

export type RecommendationAction =
  | "saved"
  | "try_intent"
  | "tried"
  | "helpful"
  | "not_helpful"
  | "not_relevant"
  | "hidden"
  | "reported"
  | "resource_opened";

export type RecommendationSurface = "result" | "recommendations" | "graph" | "private_state" | "line";

export type RecommendationItemView = GovernedRecommendation & {
  itemId: string;
  rank: number;
  /** Every action the person has taken on this item, newest first. Append-only. */
  actions: { action: RecommendationAction; createdAt: string }[];
};

export type RecommendationSetView = {
  setId: string;
  resultRowId: string;
  acceptedResultId: string;
  originalResultId: string | null;
  eligibilityBasis: "confirmed" | "corrected";
  contentVersion: string;
  generatedAt: string;
  items: RecommendationItemView[];
};

/**
 * `withheld` is NOT an error. The viewer owns the result; their own unanswered, rejected or
 * deferred interpretation is the gate, and the surface should say so.
 */
export type RecommendationLoad =
  | { outcome: "ok"; set: RecommendationSetView }
  | { outcome: "withheld" }
  | { outcome: "unavailable" };

type SetRow = {
  id: string;
  result_row_id: string;
  accepted_result_id: string;
  original_result_id: string | null;
  eligibility_basis: "confirmed" | "corrected";
  content_version: string;
  generated_at: string;
};
type ItemRow = { id: string; rank: number; recommendation_key: string };
type ActionRow = { item_id: string; action: RecommendationAction; created_at: string };

function classify(error: unknown): "withheld" | "unavailable" {
  const code = error instanceof Error ? error.message : "";
  // Only a live, owned, valid result with present-tense consent reaches "ok". Everything else is
  // either the person's own withheld consent or a concealed refusal — and the two must not be
  // confused, because one is explainable and the other must reveal nothing.
  if (code === "recommendation_not_permitted") return "withheld";
  return "unavailable";
}

async function select<T>(path: string): Promise<T[]> {
  const r = await request(path, { method: "GET" });
  if (!r.ok) throw new Error(`recommendation_read_failed:${r.status}`);
  return (await r.json()) as T[];
}

async function hydrate(set: SetRow, ownerAccountId: string): Promise<RecommendationSetView> {
  const [items, actions] = await Promise.all([
    select<ItemRow>(
      `yorisou_recommendation_items?set_id=eq.${set.id}&owner_account_id=eq.${encodeURIComponent(ownerAccountId)}&order=rank.asc`,
    ),
    select<ActionRow>(
      `yorisou_recommendation_actions?set_id=eq.${set.id}&owner_account_id=eq.${encodeURIComponent(ownerAccountId)}&order=created_at.desc`,
    ),
  ]);

  return {
    setId: set.id,
    resultRowId: set.result_row_id,
    acceptedResultId: set.accepted_result_id,
    originalResultId: set.original_result_id,
    eligibilityBasis: set.eligibility_basis,
    contentVersion: set.content_version,
    generatedAt: set.generated_at,
    items: items
      .map((item) => {
        const governed = findGovernedRecommendation(item.recommendation_key);
        if (!governed) return null; // a key with no governed content is never rendered blank
        return {
          ...governed,
          itemId: item.id,
          rank: item.rank,
          actions: actions
            .filter((a) => a.item_id === item.id)
            .map((a) => ({ action: a.action, createdAt: a.created_at })),
        };
      })
      .filter((v): v is RecommendationItemView => v !== null),
  };
}

/** Materialize (idempotently) and return the current governed set for a canonical result. */
export async function loadRecommendationSet(
  resultRowId: string,
  ownerAccountId: string,
  surface: RecommendationSurface,
): Promise<RecommendationLoad> {
  try {
    const eligibility = await rpc<
      { accepted_result_id: string; original_result_id: string | null; basis: string }[]
    >("yorisou_recommendation_eligibility", {
      p_result_row_id: resultRowId,
      p_owner_account_id: ownerAccountId,
    });
    const accepted = eligibility[0]?.accepted_result_id;
    if (!accepted) return { outcome: "withheld" };

    // Deterministic, finite, governed. No external provider, no generated prose.
    const items = buildGovernedRecommendationItems(accepted);

    const setId = await rpc<string>("yorisou_recommendation_materialize", {
      p_result_row_id: resultRowId,
      p_owner_account_id: ownerAccountId,
      p_content_version: GOVERNED_RECOMMENDATION_CONTENT_VERSION,
      p_source_surface: surface,
      p_items: items,
    });

    const rows = await select<SetRow>(`yorisou_recommendation_sets?id=eq.${setId}`);
    if (!rows[0]) return { outcome: "unavailable" };
    return { outcome: "ok", set: await hydrate(rows[0], ownerAccountId) };
  } catch (error) {
    const outcome = classify(error);
    if (outcome === "unavailable") {
      console.error("recommendation load failed", {
        code: error instanceof Error ? error.message : "unknown",
      });
    }
    return { outcome };
  }
}

/**
 * Record one signal.
 *
 * `intentNonce` makes a double tap or a retry after a lost reply resolve to the SAME action row
 * instead of two — the same reason the interpretation response carries one.
 */
export async function recordRecommendationAction(input: {
  itemId: string;
  ownerAccountId: string;
  action: RecommendationAction;
  surface: RecommendationSurface;
  intentNonce?: string | null;
}): Promise<{ outcome: "ok"; actionId: string } | { outcome: "withheld" | "unavailable" }> {
  try {
    const actionId = await rpc<string>("yorisou_recommendation_act", {
      p_item_id: input.itemId,
      p_owner_account_id: input.ownerAccountId,
      p_action: input.action,
      p_source_surface: input.surface,
      p_intent_nonce: input.intentNonce ?? null,
    });
    return { outcome: "ok", actionId };
  } catch (error) {
    const outcome = classify(error);
    if (outcome === "unavailable") {
      console.error("recommendation action failed", {
        code: error instanceof Error ? error.message : "unknown",
      });
    }
    return { outcome };
  }
}

/** Read-only history for /private-state. Never materializes, so viewing history cannot create data. */
export async function listRecommendationHistory(
  resultRowId: string,
  ownerAccountId: string,
): Promise<RecommendationSetView[]> {
  try {
    const sets = await select<SetRow>(
      `yorisou_recommendation_sets?result_row_id=eq.${resultRowId}&owner_account_id=eq.${encodeURIComponent(ownerAccountId)}&order=generated_at.desc`,
    );
    return await Promise.all(sets.map((s) => hydrate(s, ownerAccountId)));
  } catch (error) {
    console.error("recommendation history failed", {
      code: error instanceof Error ? error.message : "unknown",
    });
    return [];
  }
}
