"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScrollProvider() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      syncTouch: false,
      // Let native wheel handling work on form controls and Radix overlays.
      prevent: (node) =>
        node instanceof HTMLElement &&
        Boolean(
          node.closest(
            "input, textarea, select, [contenteditable='true'], [role='combobox'], [data-radix-select-content], [data-radix-dialog-content]"
          )
        ),
    });

    let animationFrameId = 0;

    const raf = (time: number) => {
      lenis.raf(time);
      animationFrameId = window.requestAnimationFrame(raf);
    };

    animationFrameId = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    };
  }, []);

  return null;
}
