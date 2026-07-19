// AIX-2 — YORISOU "nestle" mark. Original inline SVG (no raster, no
// third-party asset). Two arcs drawing toward a shared luminous node —
// よりそう ("to draw close / nestle"). Theme-aware via currentColor + a jade
// accent; crisp at every size. Replaces the raster crane in the redesigned
// shell (the crane asset stays in the repo, just unused here).

type Props = {
  size?: number;
  className?: string;
  /** accent color for the convergence node + inner arc */
  accent?: string;
  title?: string;
};

export default function BrandMark({ size = 34, className, accent = "#37E0AC", title = "YORISOU" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      role="img"
      aria-label={title}
    >
      {/* outer arc — the one drawing close */}
      <path
        d="M6 30.5C6 16.4 13.9 8.5 27.5 8.5"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.85"
      />
      {/* inner arc — the one being drawn toward, in accent */}
      <path
        d="M13.5 31.5C13.5 22 18.4 16.5 27.8 16.5"
        stroke={accent}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* shared convergence node */}
      <circle cx="29.4" cy="12.2" r="3.1" fill={accent} />
      <circle cx="29.4" cy="12.2" r="6.4" fill={accent} opacity="0.16" />
    </svg>
  );
}

/** Horizontal lockup: mark + wordmark, for header/footer. */
export function BrandLockup({
  className,
  markSize = 32,
  accent = "#37E0AC",
  tone = "light",
}: {
  className?: string;
  markSize?: number;
  accent?: string;
  tone?: "light" | "dark";
}) {
  const wordColor = tone === "dark" ? "#ECF3EE" : "#12241C";
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`} style={{ color: wordColor }}>
      <BrandMark size={markSize} accent={accent} />
      <span
        className="font-semibold"
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: markSize * 0.62,
          letterSpacing: "0.14em",
          lineHeight: 1,
        }}
      >
        YORISOU
      </span>
    </span>
  );
}
