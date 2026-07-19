// AIX-2 — State Signature with depth. The deterministic visual identity of a
// public result, now rendered as a small volumetric field (public-safe IDs
// only). Animated on the result reveal; static SVG on share/report surfaces.

import DepthScene from "./DepthScene";
import DepthFieldStatic from "./DepthFieldStatic";
import { signatureDepthParams, paletteFor, type PublicSignatureContext } from "./seed";

export default function DepthSignature({
  context,
  formation = 1,
  className = "",
}: {
  context: PublicSignatureContext;
  formation?: number;
  className?: string;
}) {
  const params = signatureDepthParams(context, 220);
  const palette = paletteFor(context);
  return <DepthScene params={params} palette={palette} formation={formation} className={className} />;
}

/** Static, share-safe signature (pure SVG; usable in any server context). */
export function DepthSignatureStatic({
  context,
  className,
}: {
  context: PublicSignatureContext;
  className?: string;
}) {
  const params = signatureDepthParams(context, 220);
  const palette = paletteFor(context);
  return <DepthFieldStatic params={params} palette={palette} formation={1} className={className} />;
}
