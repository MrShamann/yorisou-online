import type { Metadata } from "next";

type SharePreviewInput = {
  personaName: string;
  socialHandle: string;
  publicUrl: string;
  canonicalUrl?: string;
  imageUrl?: string;
  locale?: "ja" | "en";
};

function ensureAbsoluteUrl(value: string) {
  if (!value) {
    return "https://yorisou.online/line/mini-app";
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  return `https://yorisou.online${value.startsWith("/") ? value : `/${value}`}`;
}

export function buildResultSharePreviewMetadata({
  personaName,
  socialHandle,
  publicUrl,
  canonicalUrl,
  imageUrl,
  locale = "ja",
}: SharePreviewInput): Metadata {
  const safePersonaName = personaName.trim() || "Yorisou";
  const safeSocialHandle = socialHandle.trim();
  const resolvedUrl = ensureAbsoluteUrl(publicUrl);
  const resolvedCanonical = canonicalUrl ? ensureAbsoluteUrl(canonicalUrl) : resolvedUrl;
  const resolvedImageUrl = imageUrl ? ensureAbsoluteUrl(imageUrl) : null;
  const title =
    locale === "en"
      ? `${safePersonaName} | Yorisou`
      : `私は「${safePersonaName}」でした | Yorisou`;
  const description =
    locale === "en"
      ? `${safeSocialHandle || safePersonaName}. Find the kind of support that fits you right now.`
      : `${safeSocialHandle || safePersonaName}。Yorisouで今の寄り添い方を見つける。`;

  return {
    metadataBase: new URL("https://yorisou.online"),
    title,
    description,
    alternates: {
      canonical: resolvedCanonical,
    },
    openGraph: {
      title,
      description,
      url: resolvedCanonical,
      siteName: "Yorisou",
      type: "website",
      images: resolvedImageUrl
        ? [
            {
              url: resolvedImageUrl,
              alt: title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: resolvedImageUrl ? "summary_large_image" : "summary",
      title,
      description,
      images: resolvedImageUrl ? [resolvedImageUrl] : undefined,
    },
  };
}
