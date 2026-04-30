type Locale = "ja" | "en";

type Input = {
  locale: Locale;
  publicResultName: string;
  socialLine: string;
  subtitle: string;
  ctaLine?: string | null;
};

export function buildResultShareMessaging(input: Input) {
  const shareTitle =
    input.locale === "en"
      ? `My Yorisou result: ${input.publicResultName}`
      : `私は「${input.publicResultName}」でした`;

  const shareText = [
    shareTitle,
    input.socialLine,
    input.subtitle,
    input.ctaLine || (input.locale === "en" ? "What kind of support fits you?" : "あなたは今、どの寄り添い方？"),
    "#Yorisou #寄り添い診断",
  ]
    .map((line) => String(line || "").trim())
    .filter(Boolean)
    .join("\n");

  return {
    shareTitle,
    shareText,
  };
}
