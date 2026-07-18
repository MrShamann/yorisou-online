// AIX-4 — one public-safe result-share model that represents every retained
// result type through a single architecture (Founder Finding B). The model is
// PUBLIC-SAFE by construction: it carries only a test label, a public result
// name, a short social line, up to three public traits, a deterministic visual
// seed, a canonical URL, locale and card theme. It never carries raw answers,
// private notes, payload keys, account identifiers, confidence internals, or any
// non-public result evidence — those are stripped here and never accepted.

export type ShareCardFormat = "square" | "story" | "og";
export type ShareLocale = "ja" | "en";
export type ShareTheme = "focus" | "immersive";

export const SHARE_FORMATS: Record<ShareCardFormat, { width: number; height: number }> = {
  square: { width: 1080, height: 1080 },
  story: { width: 1080, height: 1920 },
  og: { width: 1200, height: 630 },
};

// What a result surface passes in. All fields are already public.
export type ShareCardInput = {
  testLabel: string; // e.g. "いま色テスト by よりそう" / "人間関係の疲れチェック"
  title: string; // public result name / display line
  line?: string; // short social line
  traits?: ReadonlyArray<string>;
  seed?: string; // any public-safe string; deterministic visual only
  url?: string; // canonical public URL to link to
  locale?: ShareLocale;
  theme?: ShareTheme;
};

export type ShareCardModel = {
  testLabel: string;
  title: string;
  line: string;
  traits: string[];
  seed: string;
  seedNumber: number;
  url: string;
  locale: ShareLocale;
  theme: ShareTheme;
};

const MAX_TITLE = 42;
const MAX_LINE = 64;
const MAX_TRAIT = 18;
const MAX_LABEL = 32;

// Anything that looks like private/leak-prone content is refused outright.
const FORBIDDEN = /(payloadKey|service_role|answers?=|"answers"|confidence[_-]?band|accountId|userId|sessionId|@)/i;

function clean(value: string | undefined | null, max: number): string {
  if (!value) return "";
  const oneLine = String(value).replace(/[\r\n\t]+/g, " ").replace(/\s+/g, " ").trim();
  if (FORBIDDEN.test(oneLine)) return "";
  return oneLine.length > max ? `${oneLine.slice(0, max - 1)}…` : oneLine;
}

// Deterministic small non-negative int from a string (stable across renders).
export function seedToNumber(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) % 360;
}

const SITE_ORIGIN = "https://yorisou.online";

function safeUrl(url: string | undefined): string {
  if (!url) return SITE_ORIGIN + "/tests";
  // only allow same-site relative or the canonical origin; never external.
  if (url.startsWith("/")) return SITE_ORIGIN + url;
  if (url.startsWith(SITE_ORIGIN + "/") || url === SITE_ORIGIN) return url;
  return SITE_ORIGIN + "/tests";
}

export function resolveShareCard(input: ShareCardInput): ShareCardModel {
  const title = clean(input.title, MAX_TITLE) || "YORISOU";
  const testLabel = clean(input.testLabel, MAX_LABEL) || "YORISOU";
  const line = clean(input.line, MAX_LINE) || "今の状態から、次の選択まで。";
  const traits = (input.traits ?? [])
    .map((t) => clean(t, MAX_TRAIT))
    .filter(Boolean)
    .slice(0, 3);
  const seed = clean(input.seed || `${testLabel}:${title}`, 64) || title;
  const locale: ShareLocale = input.locale === "en" ? "en" : "ja";
  const theme: ShareTheme = input.theme === "immersive" ? "immersive" : "focus";
  return {
    testLabel,
    title,
    line,
    traits,
    seed,
    seedNumber: seedToNumber(seed),
    url: safeUrl(input.url),
    locale,
    theme,
  };
}

// Build the public-safe query for the generated-image endpoint. Only whitelisted
// public fields are serialized; nothing private can reach the image route.
export function shareImageQuery(model: ShareCardModel, format: ShareCardFormat): string {
  const q = new URLSearchParams();
  q.set("f", format);
  q.set("tl", model.testLabel);
  q.set("t", model.title);
  q.set("l", model.line);
  if (model.traits.length) q.set("tr", model.traits.join("|"));
  q.set("s", model.seed);
  q.set("loc", model.locale);
  q.set("th", model.theme);
  return q.toString();
}

export function buildShareImagePath(model: ShareCardModel, format: ShareCardFormat): string {
  return `/api/share/card?${shareImageQuery(model, format)}`;
}

export function buildShareImageUrl(model: ShareCardModel, format: ShareCardFormat): string {
  return SITE_ORIGIN + buildShareImagePath(model, format);
}

export function buildShareText(model: ShareCardModel): string {
  const head = model.title && model.title !== "YORISOU" ? `${model.title}｜${model.testLabel}` : model.testLabel;
  return `${head}\n${model.line}`;
}

// Parse the image-route query back into a model (server side, for ImageResponse).
export function parseShareImageParams(sp: URLSearchParams): { format: ShareCardFormat; model: ShareCardModel } {
  const fRaw = sp.get("f");
  const format: ShareCardFormat = fRaw === "story" ? "story" : fRaw === "og" ? "og" : "square";
  const model = resolveShareCard({
    testLabel: sp.get("tl") || "",
    title: sp.get("t") || "",
    line: sp.get("l") || "",
    traits: (sp.get("tr") || "").split("|").filter(Boolean),
    seed: sp.get("s") || "",
    locale: sp.get("loc") === "en" ? "en" : "ja",
    theme: sp.get("th") === "immersive" ? "immersive" : "focus",
  });
  return { format, model };
}
