"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/app/hooks/use-reduced-motion";

type StatCounterProps = {
  value: number;
  suffix?: string;
};

export function StatCounter({ value, suffix = "%" }: StatCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      setDisplay(value);
      return;
    }

    const node = ref.current;
    if (!node) return;

    let frame = 0;
    let started = false;

    const animate = () => {
      const start = performance.now();
      const duration = 1100;

      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        setDisplay(Math.round(value * eased));
        if (t < 1) frame = window.requestAnimationFrame(tick);
      };

      frame = window.requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          started = true;
          animate();
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [reduced, value]);

  return (
    <span className="stat-counter" ref={ref}>
      {display}
      {suffix}
    </span>
  );
}
