"use client";

import { useEffect, useRef, type MouseEvent, type ComponentProps } from "react";
import Link from "next/link";

import type {
  RecommendationActionId,
  RecommendationActionRole,
  RecommendationInterestId,
  RecommendationMode,
  RecommendationSignalSource,
  RecommendationSignalType,
  YorisouTestId,
} from "@/app/data/yorisouRecommendationSignals";
import type {
  CompanionArchetypeId,
  CompanionIntentType,
  CompanionOptionId,
} from "@/app/data/yorisouCompanionArchetypes";

export type RecommendationSignalPayload = {
  source: RecommendationSignalSource;
  signalType: RecommendationSignalType;
  testId?: YorisouTestId;
  resultId?: string | null;
  interestId?: RecommendationInterestId;
  actionId?: RecommendationActionId | null;
  actionRole?: RecommendationActionRole | null;
  recommendationMode?: RecommendationMode | null;
  companionArchetypeId?: CompanionArchetypeId | null;
  companionOptionId?: CompanionOptionId | null;
  companionIntentType?: CompanionIntentType | null;
  note?: string | null;
  pagePath?: string | null;
  metadata?: Record<string, string | number | boolean | null>;
};

export async function trackRecommendationSignal(payload: RecommendationSignalPayload) {
  try {
    await fetch("/api/open-testing/signals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      keepalive: true,
      body: JSON.stringify(payload),
    });
  } catch {
    // Signal capture must never block the public flow.
  }
}

export async function trackRecommendationSignals(payloads: RecommendationSignalPayload[]) {
  for (const payload of payloads) {
    await trackRecommendationSignal(payload);
  }
}

export function RecommendationSignalMountTracker({ signal }: { signal: RecommendationSignalPayload }) {
  const trackedRef = useRef(false);

  useEffect(() => {
    if (trackedRef.current) {
      return;
    }

    trackedRef.current = true;
    void trackRecommendationSignal(signal);
  }, [signal]);

  return null;
}

type RecommendationSignalLinkProps = ComponentProps<typeof Link> & {
  signal: RecommendationSignalPayload;
};

export function RecommendationSignalLink({ signal, onClick, ...props }: RecommendationSignalLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    void trackRecommendationSignal(signal);
    onClick?.(event);
  };

  return <Link {...props} onClick={handleClick} />;
}
