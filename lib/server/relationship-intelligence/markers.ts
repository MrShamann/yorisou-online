export const TEST_MARKER_KEYS = [
  "__review_test",
  "__post_merge_review_test",
  "__local_smoke_test",
  "__pr68_review_test",
] as const;

export function isMarkedTestMetadata(metadata: Record<string, string | number | boolean | null> | undefined) {
  return TEST_MARKER_KEYS.some((key) => Boolean(metadata?.[key]));
}
