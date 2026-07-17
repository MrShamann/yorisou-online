// YORISOU State Field — deterministic procedural engine (AIX-1).
//
// A quiet field of signal nodes on slow orbital paths, softly connected when
// near. It is a product metaphor for "a changing but non-deterministic present
// state" — NOT a diagnostic visualization. It must never encode raw answers,
// private data, or numeric confidence; the only inputs are public-safe seeds
// (see seed.ts) and a formation level in [0, 1].
//
// Pure module: no DOM access, fully deterministic for a given seed, so the
// same result identifier always produces the same field (State Signature).

export type FieldPaletteStop = { color: string; weight: number };

export type FieldParams = {
  seed: number;
  /** number of signal nodes (callers scale this down for mobile/low power) */
  nodeCount: number;
  /** palette stops — low-alpha colors mixed per node */
  palette: FieldPaletteStop[];
  /** connection line color */
  lineColor: string;
  /** 0..1 how tightly nodes cluster toward anchors (arrangement identity) */
  cohesion: number;
  /** 0..1 orbital speed scale */
  tempo: number;
  /** anchor layout family, 0..5 (ring / twin / arc / drift / spiral / veil) */
  family: number;
};

export type FieldNode = {
  /** anchor (orbit center), unit space 0..1 */
  ax: number;
  ay: number;
  /** orbit radii (ellipse), unit space */
  rx: number;
  ry: number;
  /** phase offset + angular speed (radians / second) */
  phase: number;
  speed: number;
  /** node radius in unit space (multiply by min(view w,h)) */
  size: number;
  /** palette index */
  colorIndex: number;
  /** depth 0 (far) .. 1 (near) — alpha + parallax weight */
  depth: number;
};

export type FieldPoint = { x: number; y: number; r: number; alpha: number; colorIndex: number };

/** mulberry32 — small deterministic PRNG. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** FNV-1a 32-bit over a string — stable seed from public-safe identifiers. */
export function hashSeed(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Anchor layouts. Each family arranges orbit centers differently. */
function anchorFor(family: number, t: number, rand: () => number): { x: number; y: number } {
  const jitter = () => (rand() - 0.5) * 0.16;
  switch (family % 6) {
    case 0: {
      // ring — a loose circle
      const a = t * Math.PI * 2;
      return { x: 0.5 + Math.cos(a) * 0.3 + jitter(), y: 0.5 + Math.sin(a) * 0.26 + jitter() };
    }
    case 1: {
      // twin — two soft clusters
      const left = t < 0.5;
      return { x: (left ? 0.32 : 0.68) + jitter() * 1.6, y: 0.5 + (rand() - 0.5) * 0.42 };
    }
    case 2: {
      // arc — a rising crescent
      const a = Math.PI * (0.15 + t * 0.7);
      return { x: 0.5 + Math.cos(a) * 0.36 + jitter(), y: 0.62 - Math.sin(a) * 0.3 + jitter() };
    }
    case 3: {
      // drift — layered horizontal bands
      return { x: 0.12 + t * 0.76 + jitter(), y: 0.3 + ((t * 3) % 1) * 0.4 + jitter() };
    }
    case 4: {
      // spiral
      const a = t * Math.PI * 3.4;
      const r = 0.08 + t * 0.3;
      return { x: 0.5 + Math.cos(a) * r + jitter(), y: 0.5 + Math.sin(a) * r * 0.86 + jitter() };
    }
    default: {
      // veil — gentle full-field scatter
      return { x: 0.1 + rand() * 0.8, y: 0.12 + rand() * 0.76 };
    }
  }
}

export function createFieldNodes(params: FieldParams): FieldNode[] {
  const rand = mulberry32(params.seed);
  const nodes: FieldNode[] = [];
  for (let i = 0; i < params.nodeCount; i += 1) {
    const t = params.nodeCount <= 1 ? 0 : i / (params.nodeCount - 1);
    const anchor = anchorFor(params.family, t, rand);
    const spread = 0.055 + (1 - params.cohesion) * 0.11;
    const depth = 0.35 + rand() * 0.65;
    nodes.push({
      ax: anchor.x,
      ay: anchor.y,
      rx: spread * (0.5 + rand()),
      ry: spread * (0.4 + rand() * 0.8),
      phase: rand() * Math.PI * 2,
      speed: (0.05 + rand() * 0.12) * (rand() < 0.5 ? -1 : 1) * (0.4 + params.tempo),
      size: (0.004 + rand() * 0.009) * (0.6 + depth * 0.7),
      colorIndex: pickWeighted(params.palette, rand()),
      depth,
    });
  }
  return nodes;
}

function pickWeighted(palette: FieldPaletteStop[], roll: number): number {
  const total = palette.reduce((sum, stop) => sum + stop.weight, 0);
  let acc = 0;
  for (let i = 0; i < palette.length; i += 1) {
    acc += palette[i].weight / total;
    if (roll <= acc) return i;
  }
  return palette.length - 1;
}

/**
 * Node positions at time `t` (seconds) and `formation` in [0,1].
 * formation 0 = dispersed haze; 1 = fully formed arrangement. The field
 * "forms" as the user progresses — the core AI-native state-formation motion.
 */
export function fieldPointsAt(
  nodes: FieldNode[],
  seed: number,
  t: number,
  formation: number,
): FieldPoint[] {
  const rand = mulberry32(seed ^ 0x9e3779b9);
  const f = Math.max(0, Math.min(1, formation));
  const ease = f * f * (3 - 2 * f); // smoothstep
  return nodes.map((node) => {
    // dispersed position (deterministic per node)
    const dx = rand();
    const dy = rand();
    const angle = node.phase + t * node.speed;
    const ox = node.ax + Math.cos(angle) * node.rx;
    const oy = node.ay + Math.sin(angle) * node.ry;
    const x = dx + (ox - dx) * ease;
    const y = dy + (oy - dy) * ease;
    // breathing: slow global alpha wave offset by depth
    const breath = 0.75 + 0.25 * Math.sin(t * 0.5 + node.depth * Math.PI * 2);
    return {
      x,
      y,
      r: node.size,
      alpha: (0.25 + node.depth * 0.55) * breath * (0.45 + ease * 0.55),
      colorIndex: node.colorIndex,
    };
  });
}

export type FieldLink = { a: number; b: number; strength: number };

/** Soft connections between near nodes (capped so the field stays quiet). */
export function fieldLinks(points: FieldPoint[], maxDistance = 0.14, cap = 60): FieldLink[] {
  const links: FieldLink[] = [];
  for (let i = 0; i < points.length && links.length < cap; i += 1) {
    for (let j = i + 1; j < points.length && links.length < cap; j += 1) {
      const dx = points[i].x - points[j].x;
      const dy = points[i].y - points[j].y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < maxDistance) {
        links.push({ a: i, b: j, strength: 1 - d / maxDistance });
      }
    }
  }
  return links;
}
