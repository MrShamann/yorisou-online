import type { CSSProperties } from "react";

export type YorisouLogoVariant = "primary" | "dark" | "white";

const SYMBOL_COLORS: Record<YorisouLogoVariant, { mark: string; text: string }> = {
  primary: { mark: "#6C4CFF", text: "#302A3D" },
  dark: { mark: "#151027", text: "#151027" },
  white: { mark: "#FFFFFF", text: "#FFFFFF" },
};

/**
 * YORISOU brand symbol: an abstract Y whose two arms curve inward like an
 * embrace, with a continuous orbit and a small returning dot — the user
 * coming back to their own state over time. Single geometry for every
 * surface (web, favicon, LINE); only color variants may differ.
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
      {/* orbit */}
      <ellipse
        cx="24"
        cy="26"
        rx="19"
        ry="7.5"
        transform="rotate(-18 24 26)"
        stroke={mark}
        strokeWidth="2"
        opacity="0.42"
        className={breathing ? "yorisou-orbit-breathe" : undefined}
      />
      {/* returning dot on the orbit */}
      <circle cx="42.1" cy="20.1" r="2.4" fill={mark} className={breathing ? "yorisou-orbit-dot" : undefined} />
      {/* Y arms curving inward (embrace) */}
      <path d="M11 8.5 C11 20 16.5 24.5 24 27" stroke={mark} strokeWidth="4.2" strokeLinecap="round" />
      <path d="M37 8.5 C37 20 31.5 24.5 24 27" stroke={mark} strokeWidth="4.2" strokeLinecap="round" />
      {/* stem */}
      <path d="M24 27 L24 41" stroke={mark} strokeWidth="4.2" strokeLinecap="round" />
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
