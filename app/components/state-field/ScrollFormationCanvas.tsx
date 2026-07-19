"use client";

// Scroll-linked formation (AIX-1, home narrative only — never on data or
// test surfaces). Maps document scroll progress to the field's formation
// level so the state "forms" as the visitor moves into the page. Reduced
// motion: the canvas never starts (StateField handles it); the static
// server-rendered frame remains.

import { useEffect, useState } from "react";

import StateFieldCanvasLazy from "./StateFieldCanvasLazy";
import type { FieldParams } from "./engine";

export default function ScrollFormationCanvas({
  params,
  className,
  min = 0.55,
  max = 1,
  range = 900,
}: {
  params: FieldParams;
  className?: string;
  min?: number;
  max?: number;
  /** px of scroll over which formation completes */
  range?: number;
}) {
  const [formation, setFormation] = useState(min);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const progress = Math.max(0, Math.min(1, window.scrollY / range));
        setFormation(min + (max - min) * progress);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [min, max, range]);

  return <StateFieldCanvasLazy params={params} formation={formation} className={className} />;
}
