"use client";

// Client-side lazy loader for the animated canvas. `ssr: false` must live in
// a client module (Next 16); the server layer is StateFieldStatic.

import dynamic from "next/dynamic";

import type { FieldParams } from "./engine";

const StateFieldCanvas = dynamic(() => import("./StateField"), {
  ssr: false,
  loading: () => null,
});

export default function StateFieldCanvasLazy({
  params,
  formation,
  className,
}: {
  params: FieldParams;
  formation?: number;
  className?: string;
}) {
  return <StateFieldCanvas params={params} formation={formation} className={className} />;
}
