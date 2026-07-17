"use client";

// Animated State Field canvas host (AIX-1). PROGRESSIVE ENHANCEMENT ONLY:
// StateFieldStatic renders the same deterministic frame on the server; this
// canvas fades in above it when animation is safe and wanted. Controls:
// - prefers-reduced-motion: no rAF loop ever starts (static layer remains);
// - document hidden / scrolled out of view: loop pauses;
// - device pixel ratio capped at 2; ~30fps on coarse-pointer devices;
// - node budget reduced on mobile and low-power devices;
// - pointer adds a gentle local attraction (delight only, never required).
//   The scene host is pointer-events: none so UI above stays fully clickable;
//   pointer position is therefore read from a window-level listener and
//   normalized to the canvas bounds. Fine-pointer devices only — touch
//   devices never pay for it. While attraction is live the canvas exposes
//   data-pointer="active" (observable in tests). When the canvas activates,
//   the parent scene gets data-canvas-active so the static SVG layer fades
//   out (no duplicate visual density).

import { useEffect, useRef, useState } from "react";

import {
  createFieldNodes,
  fieldLinks,
  fieldPointsAt,
  type FieldParams,
} from "./engine";

type Props = {
  params: FieldParams;
  /** formation 0..1; animates smoothly toward the target */
  formation?: number;
  className?: string;
};

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function lowPower(): boolean {
  if (typeof window === "undefined") return false;
  if (new URLSearchParams(window.location.search).get("power") === "low") return true;
  const nav = navigator as Navigator & { deviceMemory?: number };
  return nav.deviceMemory !== undefined && nav.deviceMemory <= 4;
}

function isCoarsePointer(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
}

export default function StateField({ params, formation = 1, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [active, setActive] = useState(false);
  const formationTarget = useRef(formation);
  formationTarget.current = formation;

  useEffect(() => {
    if (prefersReducedMotion()) return; // static SVG layer stays; no loop.

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return; // canvas unavailable -> static layer stays.

    const mobile = isCoarsePointer();
    const budget = lowPower() ? 24 : mobile ? Math.min(params.nodeCount, 44) : params.nodeCount;
    const nodes = createFieldNodes({ ...params, nodeCount: budget });

    let raf = 0;
    let running = false;
    let inView = true;
    let width = 0;
    let height = 0;
    let currentFormation = Math.max(0, Math.min(1, formationTarget.current));
    const pointer = { x: -1, y: -1, strength: 0 };
    const frameInterval = mobile ? 1000 / 30 : 0; // ~30fps on touch devices
    let lastFrame = 0;
    const start = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (now: number) => {
      raf = 0;
      if (!running) return;
      if (frameInterval && now - lastFrame < frameInterval) {
        raf = requestAnimationFrame(draw);
        return;
      }
      lastFrame = now;
      const t = (now - start) / 1000;

      // ease formation toward its target so progress feels continuous
      currentFormation += (formationTarget.current - currentFormation) * 0.04;
      pointer.strength *= 0.96;

      const pointerLive = pointer.strength > 0.05 && pointer.x >= 0;
      if (pointerLive !== (canvas.dataset.pointer === "active")) {
        if (pointerLive) {
          canvas.dataset.pointer = "active";
        } else {
          delete canvas.dataset.pointer;
        }
      }

      const points = fieldPointsAt(nodes, params.seed, t, currentFormation);

      // gentle pointer attraction
      if (pointer.strength > 0.01 && pointer.x >= 0) {
        for (const p of points) {
          const dx = pointer.x - p.x;
          const dy = pointer.y - p.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 0.04) {
            const pull = (1 - d2 / 0.04) * 0.028 * pointer.strength;
            p.x += dx * pull;
            p.y += dy * pull;
          }
        }
      }

      ctx.clearRect(0, 0, width, height);
      const scale = Math.min(width, height);

      const links = fieldLinks(points);
      ctx.strokeStyle = params.lineColor;
      for (const link of links) {
        const a = points[link.a];
        const b = points[link.b];
        ctx.lineWidth = link.strength * 1.2 + 0.3;
        ctx.beginPath();
        ctx.moveTo(a.x * width, a.y * height);
        ctx.lineTo(b.x * width, b.y * height);
        ctx.stroke();
      }

      for (const p of points) {
        const color = params.palette[p.colorIndex]?.color ?? params.palette[0].color;
        ctx.globalAlpha = Math.min(1, p.alpha);
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(p.x * width, p.y * height, Math.max(1.2, p.r * scale), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(draw);
    };

    const setRunning = (next: boolean) => {
      if (next === running) return;
      running = next;
      if (running && !raf) {
        raf = requestAnimationFrame(draw);
      } else if (!running && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const onVisibility = () => setRunning(!document.hidden && inView);
    const observer = new IntersectionObserver((entries) => {
      inView = entries[0]?.isIntersecting ?? true;
      setRunning(!document.hidden && inView);
    });

    // Window-level pointer tracking: the scene host is pointer-events: none
    // (links, buttons, scrolling and text selection above it are untouched),
    // so movement is observed globally and mapped into canvas space. Only
    // positions inside (or just beside) the canvas box feed the attraction.
    const onPointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      if (x < -0.05 || x > 1.05 || y < -0.05 || y > 1.05) return;
      pointer.x = x;
      pointer.y = y;
      pointer.strength = 1;
    };
    const finePointer = !mobile;

    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    if (finePointer) {
      window.addEventListener("pointermove", onPointer, { passive: true });
    }
    observer.observe(canvas);
    setRunning(true);
    setActive(true);
    canvas.parentElement?.setAttribute("data-canvas-active", "true");

    return () => {
      setRunning(false);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      if (finePointer) {
        window.removeEventListener("pointermove", onPointer);
      }
      observer.disconnect();
      canvas.parentElement?.removeAttribute("data-canvas-active");
    };
    // params identity is stable per surface; formation flows through a ref.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.seed, params.nodeCount, params.family]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      style={{ opacity: active ? 1 : 0, transition: "opacity 900ms ease" }}
    />
  );
}
