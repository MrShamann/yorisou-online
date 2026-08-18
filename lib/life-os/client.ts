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

/**
 * Which act failed. The reassurance a person needs is different for each, and a single sentence
 * cannot be true of all three: "入力した内容はこの画面に残っています" is the right thing to say about a
 * reflection that would not save and the WRONG thing to say about a suppression that would not
 * apply, where there was nothing typed and the question is whether the record changed.
 */
export type LifeFailureKind = "save" | "change" | "delete" | "confirm";

/**
 * A message a person should actually see for a non-ok result. Never a status code, never an internal
 * identifier, and never a bare "エラーが発生しました" — which tells someone only that the product is
 * upset with them.
 *
 * Every message answers the two questions a failure actually raises, in order: **what happened to
 * what I had**, and **what can I do now**. The transactional audit class makes the first answerable
 * with certainty rather than hope — a failed reflection save means nothing was written, because the
 * mutation and its audit row stand or fall together (see OSF1_AUDIT_DELIVERY_CLASSES.md). So the copy
 * can state it as fact.
 *
 * `not_accepting` deliberately does NOT invite a retry: a 503 here means the schema is not declared
 * ready, which will not resolve in the next minute, and inviting someone to keep trying against a
 * closed door is worse than telling them it is closed.
 */
export function lifeFailureMessage(
  result: Extract<LifeResult<unknown>, { ok: false }>,
  kind: LifeFailureKind = "save",
): string {
  if (result.reason === "unauthenticated") return "サインインすると保存できます。";
  if (result.reason === "closed") return "この機能はいま使えません。";
  // THE ONE CASE WHERE THE PRODUCT CANNOT HONESTLY SAY WHAT HAPPENED.
  //
  // `network_unavailable` means `fetch` itself rejected — which includes a request that REACHED the
  // server and committed, with only the response lost. The transactional audit class makes "nothing
  // was written" a fact about a SERVER-side failure; it says nothing about a dropped response. So this
  // branch must not claim certainty, and it must not invite a blind retry: `yorisou_explicit_memories`
  // has no unique constraint on (owner, digest), so pressing 覚えておく again after a lost response
  // stores the memory twice.
  //
  // Telling someone to check is worse copy and better information.
  if (result.code === "network_unavailable") {
    return kind === "delete"
      ? "通信が届きませんでした。消えたかどうかは、画面を読み込み直して確かめてください。"
      : "通信が届きませんでした。保存できたかどうかは、画面を読み込み直して確かめてください。";
  }
  if (result.reason === "not_accepting") {
    if (kind === "save") return "いまは保存を受け付けていません。入力した内容はこの画面に残っています。";
    if (kind === "confirm") return "いまは保存を受け付けていません。何も残っていません。";
    return "いまは変更を受け付けていません。記録はそのままです。";
  }
  // `confirm` is the memory-confirmation case, and it gets its own sentence for a reason worth
  // stating: 「何も残っていません」 is a fact only because confirmation is transactional with its audit
  // row. There is no partial state to describe, so the copy can be flatly reassuring — which none of
  // the other three can be.
  if (kind === "confirm") return "保存できませんでした。何も残っていません。少し時間をおいて、もう一度お試しください。";
  if (kind === "change") return "変更できませんでした。記録はそのままです。少し時間をおいて、もう一度お試しください。";
  if (kind === "delete") return "消せませんでした。記録はまだ残っています。少し時間をおいて、もう一度お試しください。";
  return "保存できませんでした。入力した内容はこの画面に残っています。少し時間をおいて、もう一度お試しください。";
}
