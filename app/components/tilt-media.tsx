"use client";

import { useRef, type PointerEvent } from "react";
import { useReducedMotion } from "@/app/hooks/use-reduced-motion";

type TiltMediaProps = {
  src: string;
  alt: string;
  className?: string;
};

export function TiltMedia({ src, alt, className = "" }: TiltMediaProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  function onMove(event: PointerEvent<HTMLDivElement>) {
    if (reduced) return;
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    node.style.setProperty("--tilt-x", `${(-y * 6).toFixed(2)}deg`);
    node.style.setProperty("--tilt-y", `${(x * 8).toFixed(2)}deg`);
    node.style.setProperty("--glow-x", `${(x + 0.5) * 100}%`);
    node.style.setProperty("--glow-y", `${(y + 0.5) * 100}%`);
  }

  function onLeave() {
    const node = ref.current;
    if (!node) return;
    node.style.setProperty("--tilt-x", "0deg");
    node.style.setProperty("--tilt-y", "0deg");
  }

  return (
    <div
      className={`tilt-media ${className}`.trim()}
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <img className="tilt-media__img" src={src} alt={alt} />
      <span className="tilt-media__shine" aria-hidden="true" />
    </div>
  );
}
