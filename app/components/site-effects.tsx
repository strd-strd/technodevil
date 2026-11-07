"use client";

import dynamic from "next/dynamic";
import { CursorGlow } from "@/app/components/cursor-glow";
import { ScrollProgress } from "@/app/components/scroll-progress";

const MotionScroll = dynamic(
  () =>
    import("@/app/components/motion-scroll").then((mod) => mod.MotionScroll),
  { ssr: false },
);

export function SiteEffects() {
  return (
    <>
      <ScrollProgress />
      <CursorGlow />
      <MotionScroll />
    </>
  );
}
