import { getApprovedInsightSourceConfigs, getDiscoverableInsightSourceRegistry, getInsightSourceById, toInsightSourceConfig } from "@/lib/insights/source-registry";
import type { InsightSourceConfig, InsightSourceRegistryEntry } from "@/lib/insights/types";

export function getInsightSources(): InsightSourceConfig[] {
  return getApprovedInsightSourceConfigs();
}

export function getDiscoverableInsightSources(): InsightSourceRegistryEntry[] {
  return getDiscoverableInsightSourceRegistry();
}

export function getInsightSourceConfigById(id: string): InsightSourceConfig | null {
  const source = getInsightSourceById(id);
  return source ? toInsightSourceConfig(source) : null;
}

export const insightSources: InsightSourceConfig[] = getInsightSources();
