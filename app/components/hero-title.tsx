"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { useReducedMotion } from "@/app/hooks/use-reduced-motion";

const WORD = "TECHNODEVIL";

export function HeroTitle() {
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setReady(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  if (reduced) {
    return <h1 className="title">TECHNODEVIL</h1>;
  }

  return (
    <h1
      className={`title title--animated ${ready ? "is-ready" : ""}`}
      aria-label="TECHNODEVIL"
      style={{ "--letter-count": WORD.length } as CSSProperties}
    >
      {WORD.split("").map((letter, index) => (
        <span
          className="title__letter"
          key={`${letter}-${index}`}
          style={{ "--i": index } as CSSProperties}
          aria-hidden="true"
        >
          {letter}
        </span>
      ))}
    </h1>
  );
}
