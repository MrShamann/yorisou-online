"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

type MotionRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
  scale?: number;
};

export default function MotionReveal({
  children,
  className,
  delay = 0,
  distance = 20,
  scale = 0.985,
}: MotionRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const style = {
    "--motion-delay": `${delay}ms`,
    "--motion-distance": `${distance}px`,
    "--motion-scale": `${scale}`,
  } as CSSProperties;

  return (
    <div
      ref={ref}
      style={style}
      data-visible={visible ? "true" : "false"}
      className={["motion-reveal", className].filter(Boolean).join(" ")}
    >
      {children}
    </div>
  );
}
