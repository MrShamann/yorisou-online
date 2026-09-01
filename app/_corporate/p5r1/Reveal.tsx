"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * CORP-P5R1 — the only client boundary on the homepage.
 *
 * It does one thing: the first time the wrapper enters the viewport it sets `data-in="true"` on it,
 * which lets CSS run a FINITE animation once. Motion is scroll-TRIGGERED, never scroll-DRIVEN — the
 * browser's own scrolling is untouched, there is no scroll-jacking, no pointer capture and no
 * requestAnimationFrame loop. The observer unobserves as soon as it fires, so nothing keeps running
 * while the visitor reads.
 *
 * It writes the attribute directly rather than holding React state: the value is only ever consumed
 * by CSS, so a re-render would buy nothing and cost a commit on every reveal.
 *
 * The server renders `data-in="false"`. If IntersectionObserver is unavailable the effect flips it
 * to `true` immediately, which is the same end state `prefers-reduced-motion` produces — a complete
 * composition, never an empty one.
 */
export default function Reveal({
  children,
  className,
  as: Tag = "div",
  threshold = 0.22,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "figure";
  threshold?: number;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reveal = () => el.setAttribute("data-in", "true");
    if (typeof IntersectionObserver === "undefined") {
      reveal();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            reveal();
            io.unobserve(e.target);
          }
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return (
    <Tag ref={ref as never} className={className} data-in="false">
      {children}
    </Tag>
  );
}
