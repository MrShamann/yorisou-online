"use client";

// AIX-2 — in-view trigger. Adds `aix2-in` to its wrapper when it scrolls into
// view, so `.aix2-rise` children run their CSS entrance. Motion is gated in
// CSS behind prefers-reduced-motion (reduce -> children are simply visible),
// so this only schedules the class; it never animates via JS.

import { useEffect, useRef, useState, type ReactNode } from "react";

export default function AixIn({
  children,
  className = "",
  as: Tag = "div",
  id,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "header";
  id?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Comp = Tag as "div";
  return (
    <Comp ref={ref as never} id={id} className={`${inView ? "aix2-in" : ""} ${className}`}>
      {children}
    </Comp>
  );
}
