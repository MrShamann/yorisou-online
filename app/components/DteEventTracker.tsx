"use client";

import { useEffect } from "react";

type TrackEventPayload = {
  event: string;
  completionId?: string | null;
  personaId?: string | null;
  sessionId?: string | null;
  userId?: string | null;
  locale?: "ja" | "en" | null;
  entrySource?: string | null;
  testVersion?: string | null;
  questionPosition?: number | null;
  questionId?: string | null;
  totalQuestionsAnswered?: number | null;
  completionTimestamp?: string | null;
  publicResultLabel?: string | null;
  resultVariantIds?: string[] | null;
  shareSurface?: string | null;
  shareCardVariant?: string | null;
  paywallVariant?: string | null;
  unlockTarget?: string | null;
  returnSurface?: string | null;
  daysSinceCompletion?: number | null;
  durationMs?: number | null;
  branchId?: "yorisou_dte" | "hinata_support" | "website_brand" | "operator_admin" | "synthetic_branch_lab" | null;
  sourceBranchId?: "yorisou_dte" | "hinata_support" | "website_brand" | "operator_admin" | "synthetic_branch_lab" | null;
  visibilityPolicy?: "public" | "branch_internal" | "internal" | null;
  crossBranchAccessPolicy?: "same_branch_only" | "explicit_bridge" | "read_only_archive" | null;
  variantId?: string | null;
  variantKey?: string | null;
  triggerKey?: string | null;
  triggerContext?: Record<string, string | number | boolean | null> | null;
  resultKey?: string | null;
  source?: string | null;
  surface?: string | null;
  action?: string | null;
  questionIndex?: number | null;
  followUpIndex?: number | null;
  unitType?: string | null;
  status?: string | null;
  reason?: string | null;
  viewportClass?: string | null;
};

function deriveViewportClass() {
  if (typeof window === "undefined") {
    return null;
  }

  const width = window.innerWidth;
  const height = window.innerHeight;
  if (width <= 360 || height <= 740) {
    return "mobile_compact_360";
  }
  if (width <= 375 || height <= 812) {
    return "mobile_compact_375";
  }
  if (width <= 390 || height <= 844) {
    return "mobile_compact_390";
  }
  return "mobile_standard";
}

export async function trackDteEvent(payload: TrackEventPayload) {
  try {
    const viewportClass = payload.viewportClass ?? deriveViewportClass();
    await fetch("/api/check-in/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        event: payload.event,
        completionId: payload.completionId ?? null,
        personaId: payload.personaId ?? null,
        sessionId: payload.sessionId ?? null,
        userId: payload.userId ?? null,
        locale: payload.locale ?? null,
        entrySource: payload.entrySource ?? null,
        testVersion: payload.testVersion ?? null,
        questionPosition: payload.questionPosition ?? null,
        questionId: payload.questionId ?? null,
        totalQuestionsAnswered: payload.totalQuestionsAnswered ?? null,
        completionTimestamp: payload.completionTimestamp ?? null,
        publicResultLabel: payload.publicResultLabel ?? null,
        resultVariantIds: payload.resultVariantIds ?? null,
        shareSurface: payload.shareSurface ?? null,
        shareCardVariant: payload.shareCardVariant ?? null,
        paywallVariant: payload.paywallVariant ?? null,
        unlockTarget: payload.unlockTarget ?? null,
        returnSurface: payload.returnSurface ?? null,
        daysSinceCompletion: payload.daysSinceCompletion ?? null,
        durationMs: typeof payload.durationMs === "number" ? payload.durationMs : null,
        branchId: payload.branchId ?? null,
        sourceBranchId: payload.sourceBranchId ?? null,
        visibilityPolicy: payload.visibilityPolicy ?? null,
        crossBranchAccessPolicy: payload.crossBranchAccessPolicy ?? null,
        variantId: payload.variantId ?? null,
        variantKey: payload.variantKey ?? null,
        triggerKey: payload.triggerKey ?? null,
        triggerContext: payload.triggerContext ?? null,
        resultKey: payload.resultKey ?? null,
        source: payload.source ?? null,
        surface: payload.surface ?? null,
        action: payload.action ?? null,
        questionIndex: payload.questionIndex ?? null,
        followUpIndex: payload.followUpIndex ?? null,
        unitType: payload.unitType ?? null,
        status: payload.status ?? null,
        reason: payload.reason ?? null,
        viewportClass,
      }),
    });
  } catch {
    // Tracking must never block the result experience.
  }
}

type Props = TrackEventPayload & {
  enabled?: boolean;
};

export default function DteEventTracker({ enabled = true, ...payload }: Props) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    void trackDteEvent(payload);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    enabled,
    payload.event,
    payload.completionId,
    payload.personaId,
    payload.sessionId,
    payload.userId,
    payload.locale,
    payload.entrySource,
    payload.testVersion,
    payload.questionPosition,
    payload.questionId,
    payload.totalQuestionsAnswered,
    payload.completionTimestamp,
    payload.publicResultLabel,
    payload.resultVariantIds,
    payload.shareSurface,
    payload.shareCardVariant,
    payload.paywallVariant,
    payload.unlockTarget,
    payload.returnSurface,
    payload.daysSinceCompletion,
    payload.durationMs,
    payload.branchId,
    payload.sourceBranchId,
    payload.visibilityPolicy,
    payload.crossBranchAccessPolicy,
    payload.variantId,
    payload.variantKey,
    payload.triggerKey,
    payload.triggerContext,
    payload.resultKey,
    payload.source,
    payload.surface,
    payload.action,
    payload.questionIndex,
    payload.followUpIndex,
    payload.unitType,
    payload.status,
    payload.reason,
    payload.viewportClass,
  ]);

  return null;
}
