// OSF-1 — the browser-side client for the /api/life/* domain routes.
//
// Thin on purpose: it posts, it reads the error code, and it never interprets. Every surface needs
// to tell someone the truth about what happened, and that needs three outcomes rather than a
// boolean — "not signed in" and "not accepting entries yet" are expected states of the flow, not
// failures of what the person was doing.
//
// SINGLE PATH. This replaced the earlier `/api/life-os` action-switch route entirely rather than
// sitting beside it: two write paths onto the same tables is how audit coverage and the mutation
// gate end up applying to one of them and not the other.

export type LifeResult<T> =
  | { ok: true; data: T }
  | { ok: false; reason: "unauthenticated" }
  | { ok: false; reason: "closed" }
  | { ok: false; reason: "not_accepting" ; code: string }
  | { ok: false; reason: "failed"; code: string };

async function call<T>(path: string, init?: RequestInit): Promise<LifeResult<T>> {
  let response: Response;
  try {
    response = await fetch(`/api/life/${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
      cache: "no-store",
    });
  } catch {
    return { ok: false, reason: "failed", code: "network_unavailable" };
  }
  if (response.status === 401) return { ok: false, reason: "unauthenticated" };
  if (response.status === 404) return { ok: false, reason: "closed" };
  const payload = (await response.json().catch(() => null)) as (T & { error?: string }) | null;
  if (response.status === 503) {
    return { ok: false, reason: "not_accepting", code: payload?.error ?? "life_os_not_accepting_entries" };
  }
  if (!response.ok) return { ok: false, reason: "failed", code: payload?.error ?? `http_${response.status}` };
  return { ok: true, data: payload as T };
}

export const lifeGet = <T,>(path: string) => call<T>(path);
export const lifePost = <T,>(path: string, body: unknown) =>
  call<T>(path, { method: "POST", body: JSON.stringify(body) });
export const lifePut = <T,>(path: string, body: unknown) =>
  call<T>(path, { method: "PUT", body: JSON.stringify(body) });
export const lifePatch = <T,>(path: string, body: unknown) =>
  call<T>(path, { method: "PATCH", body: JSON.stringify(body) });
export const lifeDelete = <T,>(path: string) => call<T>(path, { method: "DELETE" });

/** A message a person should actually see for a non-ok result. Never a status code. */
export function lifeFailureMessage(result: Extract<LifeResult<unknown>, { ok: false }>): string {
  if (result.reason === "unauthenticated") return "サインインすると保存できます。";
  if (result.reason === "closed") return "この機能はいま使えません。";
  if (result.reason === "not_accepting") return "いまは保存を受け付けていません。書いた内容はこの画面に残っています。";
  return "保存できませんでした。書いた内容はこの画面に残っています。";
}
