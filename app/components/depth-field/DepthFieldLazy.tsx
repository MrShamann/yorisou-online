"use client";

// Client-side lazy loader for the WebGL depth field. `ssr: false` must live in
// a client module (Next 16); the server layer is DepthFieldStatic.

import dynamic from "next/dynamic";

import type { DepthParams } from "./engine";
import type { FieldColor } from "./seed";

const DepthFieldCanvas = dynamic(() => import("./DepthField"), {
  ssr: false,
  loading: () => null,
});

export default function DepthFieldLazy(props: {
  params: DepthParams;
  palette: FieldColor[];
  formation?: number;
  className?: string;
  scrollParallax?: boolean;
}) {
  return <DepthFieldCanvas {...props} />;
}
