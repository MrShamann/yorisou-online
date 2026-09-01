import Image from "next/image";

import styles from "./site.module.css";
import { VENTURE_BRAND, ventureBrandByName, type VentureBrand } from "../brand";

/**
 * CORP-v1.3.1 — the venture mark slot.
 *
 * Every venture occupies the SAME slot on every surface, and each fills it with its own real
 * identity. v1.3 filled it with a 9px colour square, and the venture that had no colour got an
 * empty one — a placeholder standing in for three identities that either existed and were not being
 * used, or had not been decided yet. Both of those are now resolved.
 *
 * - Mirai Move  its official logo, taken from Mirai Move's own committed brand kit.
 * - Kakari      the Founder-approved corporate co-mark 「係 / Kakari」. The 係 is drawn here as
 *               INLINE svg rather than an <img> for two reasons: it must inherit `currentColor` so
 *               one asset works on the paper and on the dark system surface, and the character must
 *               be set in the corporate site's own Japanese stack, which an external image cannot do.
 * - Chigamo     its new Founder-approved mark, monochrome, also inline for the same reasons.
 *
 * Sizes are set by HEIGHT, so the wide Mirai Move lockup and the square glyph marks sit on the same
 * optical line instead of being squashed to a common box. Nothing is distorted: the raster keeps its
 * intrinsic ratio and the SVGs keep their square viewBox.
 *
 * The mark is decorative. The venture's ASCII wordmark and its stage are always rendered as text
 * beside it, so nothing here is the only carrier of any meaning, and it is `aria-hidden`.
 */

const SIZE = { hero: 26, card: 20, compact: 15 } as const;
export type VentureMarkSize = keyof typeof SIZE;

const JP_STACK =
  "'Hiragino Sans','Hiragino Kaku Gothic ProN','Yu Gothic','Noto Sans CJK JP',sans-serif";

/** 係 above the terminal rule from Kakari's own ProcedureSystem. Monochrome by construction. */
function KakariComark({ px }: { px: number }) {
  return (
    <svg viewBox="0 0 64 64" width={px} height={px} className={styles.ventureMark} aria-hidden="true" focusable="false">
      <text x="32" y="43" textAnchor="middle" fill="currentColor" fontSize="46" fontWeight={600} fontFamily={JP_STACK}>
        係
      </text>
      <path d="M 18 56 L 46 56" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.5" />
    </svg>
  );
}

/** Three brackets closing on one point: place, time and situation aligning. */
function ChigamoMark({ px }: { px: number }) {
  return (
    <svg viewBox="0 0 64 64" width={px} height={px} className={styles.ventureMark} aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="3">
        <path d="M 11 11 H 26 V 26" />
        <path d="M 53 11 H 38 V 26" />
        <path d="M 32 55 V 38" />
      </g>
      <rect x="28" y="28" width="8" height="8" fill="currentColor" />
    </svg>
  );
}

export function VentureMark({
  href,
  name,
  size = "card",
}: {
  href?: string;
  name?: string;
  size?: VentureMarkSize;
}) {
  const brand: VentureBrand | null = href ? (VENTURE_BRAND[href] ?? null) : name ? ventureBrandByName(name) : null;
  if (!brand) return null;
  const px = SIZE[size];

  if (brand.mark.kind === "image") {
    const w = Math.round((brand.mark.width / brand.mark.height) * px);
    return (
      <Image
        src={brand.mark.src}
        alt=""
        width={brand.mark.width}
        height={brand.mark.height}
        sizes={`${w}px`}
        aria-hidden="true"
        className={styles.ventureMark}
        style={{ height: px, width: w }}
      />
    );
  }
  return brand.mark.id === "kakari" ? <KakariComark px={px} /> : <ChigamoMark px={px} />;
}
