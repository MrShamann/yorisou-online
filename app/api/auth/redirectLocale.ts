export function inferLocaleFromPaths(...values: Array<string | undefined>) {
  return values.some((value) => value === "/en" || value?.startsWith("/en/")) ? "en" : "ja";
}
