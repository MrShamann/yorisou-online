// FieldScene (AIX-1) — the standard layered host for a State Field surface.
//
// Layer 1 (server): StateFieldStatic SVG — always present, no JS required.
// Layer 2 (client, lazy): animated canvas, dynamically imported so the field
// never blocks server-rendered text or the primary CTA, and adds no JS to
// the critical path until idle.
//
// Both layers are absolutely positioned inside the same box: no layout shift.

import StateFieldStatic from "./StateFieldStatic";
import StateFieldCanvasLazy from "./StateFieldCanvasLazy";
import type { FieldParams } from "./engine";

type Props = {
  params: FieldParams;
  formation?: number;
  /** extra classes for the wrapper (position sizing) */
  className?: string;
  /** dim the field further behind dense text */
  veil?: boolean;
};

export default function FieldScene({ params, formation = 1, className = "", veil = false }: Props) {
  return (
    <div className={`state-field-scene ${className}`} aria-hidden="true">
      <StateFieldStatic params={params} formation={formation} className="state-field-layer" />
      <StateFieldCanvasLazy params={params} formation={formation} className="state-field-layer" />
      {veil ? <div className="state-field-veil" /> : null}
    </div>
  );
}
