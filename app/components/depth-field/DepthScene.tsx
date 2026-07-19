// AIX-2 — layered depth-field host. Static SVG (server) underneath; WebGL
// canvas (client, lazy) above, fading in when live and fading the static layer
// out via data-canvas-active (no double density). Both share one absolutely
// positioned box: no layout shift.

import DepthFieldStatic from "./DepthFieldStatic";
import DepthFieldLazy from "./DepthFieldLazy";
import type { DepthParams } from "./engine";
import type { FieldColor } from "./seed";

type Props = {
  params: DepthParams;
  palette: FieldColor[];
  formation?: number;
  className?: string;
  scrollParallax?: boolean;
  /** dim the field further behind dense text */
  veil?: boolean;
};

export default function DepthScene({
  params,
  palette,
  formation = 1,
  className = "",
  scrollParallax = false,
  veil = false,
}: Props) {
  return (
    <div className={`depth-scene ${className}`} aria-hidden="true">
      <DepthFieldStatic params={params} palette={palette} formation={formation} className="depth-layer" />
      <DepthFieldLazy
        params={params}
        palette={palette}
        formation={formation}
        className="depth-layer"
        scrollParallax={scrollParallax}
      />
      {veil ? <div className="depth-veil" /> : null}
    </div>
  );
}
