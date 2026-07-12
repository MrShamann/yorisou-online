import type { CSSProperties } from "react";

export type YorisouLogoVariant = "primary" | "dark" | "white";

const SYMBOL_COLORS: Record<YorisouLogoVariant, { mark: string; text: string }> = {
  primary: { mark: "#6C4CFF", text: "#302A3D" },
  dark: { mark: "#151027", text: "#151027" },
  white: { mark: "#FFFFFF", text: "#FFFFFF" },
};

/**
 * YORISOU brand symbol — Founder-reference geometry: a heart drawn as two
 * flowing strokes whose tails merge into a Y stem, wrapped by one thin orbit
 * with a small returning dot. One geometry everywhere (header, footer,
 * favicon, deep AI cards, LINE); only the color variant may change.
 */
export function YorisouSymbol({
  variant = "primary",
  size = 28,
  className,
  breathing = false,
}: {
  variant?: YorisouLogoVariant;
  size?: number;
  className?: string;
  breathing?: boolean;
}) {
  const { mark } = SYMBOL_COLORS[variant];
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="YORISOU"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* orbit — thin ellipse sweeping through the heart, with a returning dot */}
      <ellipse
        cx="24"
        cy="25"
        rx="20"
        ry="8.5"
        transform="rotate(-22 24 25)"
        stroke={mark}
        strokeWidth="1.7"
        opacity="0.45"
        className={breathing ? "yorisou-orbit-breathe" : undefined}
      />
      <circle cx="42.6" cy="17.4" r="2.5" fill={mark} className={breathing ? "yorisou-orbit-dot" : undefined} />
      {/* heart: two flowing lobes whose tails merge toward one point */}
      <path
        d="M23.6 17.5 C21.5 11.5 15.5 9.5 12 12.6 C8.6 15.6 9.3 21.3 13.4 25.6 C16.4 28.7 20.4 31.6 23.6 33.4"
        stroke={mark}
        strokeWidth="3.9"
        strokeLinecap="round"
      />
      <path
        d="M23.6 17.5 C25.7 11.5 31.7 9.5 35.2 12.6 C38.6 15.6 37.9 21.3 33.8 25.6 C30.8 28.7 26.8 31.6 23.6 33.4"
        stroke={mark}
        strokeWidth="3.9"
        strokeLinecap="round"
      />
      {/* Y tail continuing from the heart point */}
      <path d="M23.6 33.4 L23.6 41.5" stroke={mark} strokeWidth="3.9" strokeLinecap="round" />
    </svg>
  );
}

export default function YorisouLogo({
  variant = "primary",
  size = 26,
  withWordmark = true,
  className,
}: {
  variant?: YorisouLogoVariant;
  size?: number;
  withWordmark?: boolean;
  className?: string;
}) {
  const { text } = SYMBOL_COLORS[variant];
  if (!withWordmark) return <YorisouSymbol variant={variant} size={size} className={className} />;
  const wordmarkStyle: CSSProperties = {
    color: text,
    fontFamily: "var(--font-inter, Inter), var(--font-sans)",
    fontWeight: 700,
    letterSpacing: "0.14em",
    fontSize: Math.round(size * 0.62),
    lineHeight: 1,
  };
  return (
    <span className={`inline-flex items-center gap-2 ${className || ""}`}>
      <YorisouSymbol variant={variant} size={size} />
      <span style={wordmarkStyle} translate="no">
        YORISOU
      </span>
    </span>
  );
}
