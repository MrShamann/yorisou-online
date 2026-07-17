// AIX-2 — YORISOU Depth Field engine (pure, deterministic).
//
// Generates a layered 3D point field with genuine foreground / midground /
// background separation. Same seed -> same field, so it drives both the WebGL
// renderer and the server-rendered static SVG fallback (they must agree).
//
// Reuses the public-safe seed primitives from the existing state-field module
// (hashSeed / mulberry32) so determinism and the protected contract tests
// stay valid. Inputs are ONLY public-safe identifiers (see seed.ts).

import { hashSeed, mulberry32 } from "../state-field/engine";

export { hashSeed, mulberry32 };

export type DepthLayer = "far" | "mid" | "near";

export type DepthPoint = {
  x: number; // world units, roughly [-6, 6]
  y: number; // roughly [-4, 4]
  z: number; // depth, negative = away from camera (far ~ -14, near ~ -3)
  size: number; // base point size in world units
  colorIndex: number; // index into the palette
  layer: DepthLayer;
  /** deterministic phase + speed for orbital drift */
  phase: number;
  speed: number;
  /** orbit radius in x/y */
  orbit: number;
};

export type DepthParams = {
  seed: number;
  /** total point count (callers scale down for mobile / low power) */
  count: number;
  /** number of palette colors */
  paletteSize: number;
  /** 0..1 how tightly the near layer clusters (identity control) */
  cohesion: number;
  /** 0..1 orbital tempo */
  tempo: number;
  /** arrangement family 0..5 */
  family: number;
};

const LAYER_SPLIT: Record<DepthLayer, { zMin: number; zMax: number; frac: number; size: [number, number] }> = {
  far: { zMin: -15, zMax: -10, frac: 0.42, size: [0.02, 0.05] },
  mid: { zMin: -9, zMax: -6, frac: 0.36, size: [0.05, 0.11] },
  near: { zMin: -5.5, zMax: -3, frac: 0.22, size: [0.09, 0.2] },
};

function anchorFor(family: number, t: number, rand: () => number): { x: number; y: number } {
  const j = () => (rand() - 0.5) * 1.4;
  switch (family % 6) {
    case 0: {
      const a = t * Math.PI * 2;
      return { x: Math.cos(a) * 3.4 + j(), y: Math.sin(a) * 2.4 + j() };
    }
    case 1: {
      const left = t < 0.5;
      return { x: (left ? -2.6 : 2.6) + j() * 1.4, y: (rand() - 0.5) * 5 };
    }
    case 2: {
      const a = Math.PI * (0.12 + t * 0.76);
      return { x: Math.cos(a) * 4 + j(), y: -2.4 + Math.sin(a) * 3.4 + j() };
    }
    case 3:
      return { x: -5 + t * 10 + j(), y: (((t * 3) % 1) - 0.5) * 5 + j() };
    case 4: {
      const a = t * Math.PI * 3.4;
      const r = 0.6 + t * 3.4;
      return { x: Math.cos(a) * r + j(), y: Math.sin(a) * r * 0.8 + j() };
    }
    default:
      return { x: (rand() - 0.5) * 11, y: (rand() - 0.5) * 7.5 };
  }
}

export function createDepthPoints(params: DepthParams): DepthPoint[] {
  const rand = mulberry32(params.seed);
  const points: DepthPoint[] = [];
  const layers: DepthLayer[] = ["far", "mid", "near"];
  for (const layer of layers) {
    const spec = LAYER_SPLIT[layer];
    const n = Math.max(1, Math.round(params.count * spec.frac));
    for (let i = 0; i < n; i += 1) {
      const t = n <= 1 ? 0 : i / (n - 1);
      const anchor = anchorFor(params.family, t, rand);
      const spread =
        layer === "near" ? 0.5 + (1 - params.cohesion) * 1.6 : layer === "mid" ? 1.4 : 2.6;
      const z = spec.zMin + rand() * (spec.zMax - spec.zMin);
      points.push({
        x: anchor.x + (rand() - 0.5) * spread,
        y: anchor.y + (rand() - 0.5) * spread * 0.8,
        z,
        size: spec.size[0] + rand() * (spec.size[1] - spec.size[0]),
        colorIndex: Math.floor(rand() * params.paletteSize),
        layer,
        phase: rand() * Math.PI * 2,
        speed: (0.04 + rand() * 0.1) * (rand() < 0.5 ? -1 : 1) * (0.4 + params.tempo),
        orbit: (layer === "near" ? 0.14 : layer === "mid" ? 0.24 : 0.4) * (0.5 + rand()),
      });
    }
  }
  return points;
}

/** Perspective-projected 2D positions for the static SVG fallback. */
export type ProjectedPoint = { sx: number; sy: number; r: number; alpha: number; colorIndex: number; z: number };

export function projectForStatic(
  points: DepthPoint[],
  view = 1000,
  formation = 1,
): ProjectedPoint[] {
  // simple pinhole projection matching the WebGL PerspectiveCamera (fov ~ 46,
  // camera at z = 0 looking down -z). focal chosen so the field fills the view.
  const focal = 1150;
  const camZ = 0.5;
  const f = Math.max(0, Math.min(1, formation));
  return points
    .map((p) => {
      const zz = p.z - camZ;
      const scale = focal / -zz;
      const sx = view / 2 + p.x * scale * 0.11;
      const sy = view / 2 - p.y * scale * 0.11;
      const r = Math.max(0.8, p.size * scale * 0.6);
      // depth alpha: nearer = brighter; formation dims far haze when < 1
      const depthAlpha = p.layer === "near" ? 0.9 : p.layer === "mid" ? 0.55 : 0.28;
      return { sx, sy, r, alpha: depthAlpha * (0.5 + f * 0.5), colorIndex: p.colorIndex, z: p.z };
    })
    .sort((a, b) => a.z - b.z); // far first, near last (painter's order)
}
