"use client";

import { useEffect } from "react";
import { useReducedMotion } from "@/app/hooks/use-reduced-motion";

/**
 * Lazy GSAP ScrollTrigger — only transform/opacity, only on [data-motion].
 * Loaded after idle so it stays off the critical path.
 */
export function MotionScroll() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    let cancelled = false;
    let ctx: { revert: () => void } | null = null;
    let idleId: number | undefined;
    let timeoutId: number | undefined;

    const start = () => {
      void (async () => {
        const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);
        if (cancelled) return;

        gsap.registerPlugin(ScrollTrigger);

        ctx = gsap.context(() => {
          // Subtle scrub only — keep range small (vestibular-safe).
          gsap.utils.toArray<HTMLElement>('[data-motion="parallax"]').forEach((el) => {
            const media = el.querySelector<HTMLElement>("[data-motion-target]") ?? el;
            gsap.fromTo(
              media,
              { yPercent: -4 },
              {
                yPercent: 4,
                ease: "none",
                scrollTrigger: {
                  trigger: el,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.5,
                },
              },
            );
          });

          gsap.utils.toArray<HTMLElement>('[data-motion="rise"]').forEach((el) => {
            const media = el.querySelector<HTMLElement>("[data-motion-target]") ?? el;
            gsap.fromTo(
              media,
              { y: 28, opacity: 0.78, scale: 1.03 },
              {
                y: 0,
                opacity: 1,
                scale: 1,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: el,
                  start: "top 88%",
                  end: "top 45%",
                  scrub: 0.55,
                },
              },
            );
          });
        });
      })();
    };

    const ric = window.requestIdleCallback;
    if (typeof ric === "function") {
      idleId = ric(start, { timeout: 1200 });
    } else {
      timeoutId = window.setTimeout(start, 200);
    }

    return () => {
      cancelled = true;
      if (idleId !== undefined && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      ctx?.revert();
    };
  }, [reduced]);

  return null;
}
