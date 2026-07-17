"use client";

// AIX-2 — WebGL depth field (Three.js). Real perspective depth with
// foreground / midground / background separation, atmospheric fog, GPU-side
// orbital drift, camera pointer + scroll parallax, and slow breathing.
//
// PROGRESSIVE ENHANCEMENT ONLY — the server renders DepthFieldStatic (an SVG
// projection of the SAME seed) underneath; this canvas fades in above it when
// WebGL is available and motion is wanted. Controls:
// - prefers-reduced-motion: no animation loop; a single formed frame is drawn
//   once (or, if the caller prefers, the static SVG simply remains);
// - WebGL unavailable / context lost: component self-disables, static remains;
// - document hidden / scrolled out of view: loop pauses;
// - DPR capped at 2; ~30fps on coarse-pointer devices; point budget scaled;
// - pointer read at window level (host is pointer-events:none) so all UI above
//   stays fully clickable;
// - the parent scene gets data-canvas-active when live so the static layer
//   fades out (no double density).

import { useEffect, useRef, useState } from "react";

import { createDepthPoints, type DepthParams } from "./engine";
import type { FieldColor } from "./seed";

type Props = {
  params: DepthParams;
  palette: FieldColor[];
  /** 0..1 formation target; animates smoothly toward this */
  formation?: number;
  className?: string;
  /** scroll-linked parallax intensity 0..1 (home hero) */
  scrollParallax?: boolean;
};

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function lowPower() {
  if (typeof window === "undefined") return false;
  if (new URLSearchParams(window.location.search).get("power") === "low") return true;
  const nav = navigator as Navigator & { deviceMemory?: number };
  return nav.deviceMemory !== undefined && nav.deviceMemory <= 4;
}
function coarsePointer() {
  return typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
}

const VERT = `
  uniform float uTime;
  uniform float uFormation;
  uniform float uFocal;
  attribute float aSize;
  attribute float aPhase;
  attribute float aSpeed;
  attribute float aOrbit;
  attribute vec3 aColor;
  attribute vec3 aDispersed;
  varying vec3 vColor;
  varying float vDepth;
  void main() {
    vColor = aColor;
    // gather from dispersed -> base as formation rises
    vec3 base = position;
    vec3 pos = mix(aDispersed, base, uFormation);
    // gentle orbital drift in x/y, phase per point
    float a = aPhase + uTime * aSpeed;
    pos.x += cos(a) * aOrbit;
    pos.y += sin(a) * aOrbit * 0.82;
    pos.z += sin(a * 0.6) * aOrbit * 0.5;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
    // perspective size attenuation
    gl_PointSize = aSize * uFocal / max(1.0, -mv.z);
  }
`;

const FRAG = `
  precision mediump float;
  varying vec3 vColor;
  varying float vDepth;
  void main() {
    // soft radial sprite
    vec2 c = gl_PointCoord - vec2(0.5);
    float d = length(c);
    if (d > 0.5) discard;
    float glow = smoothstep(0.5, 0.0, d);
    // atmospheric fade with depth (far points dimmer + cooler)
    float atmos = clamp(1.0 - (vDepth - 3.0) / 16.0, 0.12, 1.0);
    float alpha = glow * glow * atmos;
    gl_FragColor = vec4(vColor * (0.55 + glow * 0.9), alpha);
  }
`;

export default function DepthField({ params, palette, formation = 1, className, scrollParallax = false }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [active, setActive] = useState(false);
  const formationTarget = useRef(formation);
  formationTarget.current = formation;

  useEffect(() => {
    if (prefersReducedMotion()) return; // static SVG stays; no loop.
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed = false;
    let cleanup = () => {};

    // Dynamic import keeps three off the critical path and out of SSR.
    import("three")
      .then((THREE) => {
        if (disposed) return;
        let renderer: import("three").WebGLRenderer;
        try {
          renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: "low-power" });
        } catch {
          return; // WebGL unavailable -> static SVG remains.
        }
        const gl = renderer.getContext();
        if (!gl) return;

        const mobile = coarsePointer();
        const budget = lowPower() ? 120 : mobile ? Math.min(params.count, 200) : params.count;
        const pts = createDepthPoints({ ...params, count: budget });

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        renderer.setPixelRatio(dpr);

        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x0a1310, 0.055);
        const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 40);
        camera.position.set(0, 0, 0.5);

        // buffers
        const n = pts.length;
        const position = new Float32Array(n * 3);
        const dispersed = new Float32Array(n * 3);
        const color = new Float32Array(n * 3);
        const size = new Float32Array(n);
        const phase = new Float32Array(n);
        const speed = new Float32Array(n);
        const orbit = new Float32Array(n);
        for (let i = 0; i < n; i += 1) {
          const p = pts[i];
          position[i * 3] = p.x;
          position[i * 3 + 1] = p.y;
          position[i * 3 + 2] = p.z;
          // dispersed = pushed outward + deeper (the "un-formed" cloud)
          dispersed[i * 3] = p.x * 1.9 + (p.phase - Math.PI) * 0.4;
          dispersed[i * 3 + 1] = p.y * 1.9;
          dispersed[i * 3 + 2] = p.z - 4 - p.orbit * 6;
          const c = palette[p.colorIndex % palette.length]?.rgb ?? palette[0].rgb;
          color[i * 3] = c[0];
          color[i * 3 + 1] = c[1];
          color[i * 3 + 2] = c[2];
          size[i] = p.size * 340;
          phase[i] = p.phase;
          speed[i] = p.speed;
          orbit[i] = p.orbit;
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(position, 3));
        geo.setAttribute("aDispersed", new THREE.BufferAttribute(dispersed, 3));
        geo.setAttribute("aColor", new THREE.BufferAttribute(color, 3));
        geo.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
        geo.setAttribute("aPhase", new THREE.BufferAttribute(phase, 1));
        geo.setAttribute("aSpeed", new THREE.BufferAttribute(speed, 1));
        geo.setAttribute("aOrbit", new THREE.BufferAttribute(orbit, 1));

        const material = new THREE.ShaderMaterial({
          uniforms: {
            uTime: { value: 0 },
            uFormation: { value: Math.max(0, Math.min(1, formationTarget.current)) },
            uFocal: { value: 1 },
          },
          vertexShader: VERT,
          fragmentShader: FRAG,
          transparent: true,
          depthWrite: false,
          depthTest: false,
          blending: THREE.AdditiveBlending,
        });
        const cloud = new THREE.Points(geo, material);
        scene.add(cloud);

        let width = 0;
        let height = 0;
        const resize = () => {
          const rect = canvas.getBoundingClientRect();
          width = Math.max(1, Math.round(rect.width));
          height = Math.max(1, Math.round(rect.height));
          renderer.setSize(width, height, false);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          material.uniforms.uFocal.value = height * dpr * 0.5;
        };
        resize();

        const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
        const onPointer = (e: PointerEvent) => {
          pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
          pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
        };
        let scroll = 0;
        const onScroll = () => {
          scroll = Math.min(1, window.scrollY / (window.innerHeight || 900));
        };
        if (scrollParallax) onScroll();

        let raf = 0;
        let running = false;
        let inView = true;
        let curFormation = material.uniforms.uFormation.value;
        const frameInterval = mobile ? 1000 / 30 : 0;
        let last = 0;
        const start = performance.now();

        const draw = (now: number) => {
          raf = 0;
          if (!running) return;
          if (frameInterval && now - last < frameInterval) {
            raf = requestAnimationFrame(draw);
            return;
          }
          last = now;
          const t = (now - start) / 1000;
          material.uniforms.uTime.value = t;
          curFormation += (formationTarget.current - curFormation) * 0.035;
          material.uniforms.uFormation.value = curFormation;
          // ease pointer + apply gentle parallax to camera (depth reads on move)
          pointer.x += (pointer.tx - pointer.x) * 0.04;
          pointer.y += (pointer.ty - pointer.y) * 0.04;
          camera.position.x = pointer.x * 0.5;
          camera.position.y = -pointer.y * 0.34 + (scrollParallax ? scroll * 0.6 : 0);
          camera.lookAt(0, scrollParallax ? scroll * 0.4 : 0, -8);
          // slow breathing rotation of the whole field
          cloud.rotation.z = Math.sin(t * 0.06) * 0.05;
          cloud.rotation.y = Math.sin(t * 0.045) * 0.08;
          renderer.render(scene, camera);
          raf = requestAnimationFrame(draw);
        };

        const setRunning = (next: boolean) => {
          if (next === running) return;
          running = next;
          if (running && !raf) raf = requestAnimationFrame(draw);
          else if (!running && raf) {
            cancelAnimationFrame(raf);
            raf = 0;
          }
        };
        const onVisibility = () => setRunning(!document.hidden && inView);
        const observer = new IntersectionObserver((entries) => {
          inView = entries[0]?.isIntersecting ?? true;
          setRunning(!document.hidden && inView);
        });

        window.addEventListener("resize", resize);
        window.addEventListener("pointermove", onPointer, { passive: true });
        if (scrollParallax) window.addEventListener("scroll", onScroll, { passive: true });
        document.addEventListener("visibilitychange", onVisibility);
        observer.observe(canvas);
        const onLost = (e: Event) => {
          e.preventDefault();
          setRunning(false);
          setActive(false);
        };
        canvas.addEventListener("webglcontextlost", onLost);

        setRunning(true);
        setActive(true);
        canvas.parentElement?.setAttribute("data-canvas-active", "true");

        cleanup = () => {
          setRunning(false);
          window.removeEventListener("resize", resize);
          window.removeEventListener("pointermove", onPointer);
          if (scrollParallax) window.removeEventListener("scroll", onScroll);
          document.removeEventListener("visibilitychange", onVisibility);
          canvas.removeEventListener("webglcontextlost", onLost);
          observer.disconnect();
          geo.dispose();
          material.dispose();
          renderer.dispose();
          canvas.parentElement?.removeAttribute("data-canvas-active");
        };
      })
      .catch(() => {
        /* import failed -> static SVG remains */
      });

    return () => {
      disposed = true;
      cleanup();
    };
    // params identity is stable per surface; formation flows through a ref.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.seed, params.count, params.family]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      style={{ opacity: active ? 1 : 0, transition: "opacity 1200ms ease" }}
    />
  );
}
