export const checkInTrafficSources = [
  "homepage_primary",
  "homepage_secondary",
  "homepage_exposure",
  "direct",
  "unknown",
] as const;

export type CheckInTrafficSource = (typeof checkInTrafficSources)[number];

export function normalizeCheckInTrafficSource(value: string | string[] | undefined): CheckInTrafficSource {
  const candidate = Array.isArray(value) ? value[0] : value;

  if (
    candidate === "homepage_primary" ||
    candidate === "homepage_secondary" ||
    candidate === "homepage_exposure" ||
    candidate === "direct"
  ) {
    return candidate;
  }

  if (typeof candidate === "string" && candidate.trim().length > 0) {
    return "unknown";
  }

  return "direct";
}
