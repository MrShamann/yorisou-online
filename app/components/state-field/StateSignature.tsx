// State Signature (AIX-1) — the deterministic visual identity of a public
// result. Derived ONLY from public-safe identifiers (result code, overlay,
// confidence band). Same result -> same visual, animated on the result page
// and static on share surfaces. It is a metaphor, not measurement: no raw
// answers, no private data, no numeric confidence.

import FieldScene from "./FieldScene";
import StateFieldStatic from "./StateFieldStatic";
import {
  ON_DARK_LINE_COLOR,
  onDarkPalette,
  signatureParams,
  type PublicSignatureContext,
} from "./seed";

type SignatureProps = {
  context: PublicSignatureContext;
  /** formation level (result reveal animates this up via stages) */
  formation?: number;
  className?: string;
};

/** Animated signature for the result reveal (canvas above static SVG). */
export default function StateSignature({ context, formation = 1, className = "" }: SignatureProps) {
  const params = signatureParams(context, 64);
  return <FieldScene params={params} formation={formation} className={className} />;
}

/** Static, share-safe signature (pure SVG; usable in any server context). */
export function StateSignatureStatic({
  context,
  className,
  onDark = false,
}: {
  context: PublicSignatureContext;
  className?: string;
  /** lift luminance for dark share surfaces (same arrangement/seed) */
  onDark?: boolean;
}) {
  const base = signatureParams(context, 64);
  const params = onDark
    ? { ...base, palette: onDarkPalette(base.palette), lineColor: ON_DARK_LINE_COLOR }
    : base;
  return <StateFieldStatic params={params} formation={1} className={className} />;
}
