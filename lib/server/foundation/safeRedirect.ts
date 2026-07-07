export function normalizeSafeInternalPath(value: string | null | undefined, fallback: string) {
  if (!value) {
    return fallback;
  }

  const trimmed = value.trim();

  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return fallback;
  }

  try {
    const parsed = new URL(trimmed, "https://yorisou.internal");
    if (parsed.origin !== "https://yorisou.internal") {
      return fallback;
    }
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return fallback;
  }
}

export function buildSafeInternalHref(basePath: string, nextPath: string | null | undefined) {
  const normalized = normalizeSafeInternalPath(nextPath, "");
  if (!normalized) {
    return basePath;
  }

  const params = new URLSearchParams({ next: normalized });
  return `${basePath}?${params.toString()}`;
}
