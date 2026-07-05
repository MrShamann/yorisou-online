"use client";

import type { MouseEvent } from "react";
import type { ComponentProps } from "react";
import Link from "next/link";

import type {
  RecommendationInterestId,
  RecommendationSignalSource,
  RecommendationSignalType,
  YorisouTestId,
} from "@/app/data/yorisouRecommendationSignals";

type RecommendationSignalPayload = {
  source: RecommendationSignalSource;
  signalType: RecommendationSignalType;
  testId?: YorisouTestId;
  resultId?: string | null;
  interestId?: RecommendationInterestId;
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
