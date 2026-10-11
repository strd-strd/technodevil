"use client";

import { CursorGlow } from "@/app/components/cursor-glow";
import { ScrollProgress } from "@/app/components/scroll-progress";

export function SiteEffects() {
  return (
    <>
      <ScrollProgress />
      <CursorGlow />
    </>
  );
}
