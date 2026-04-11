"use client";

import { useEffect, useRef, useState } from "react";

export function useScrollDirection(): "up" | "down" {
  const [direction, setDirection] = useState<"up" | "down">("up");
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current) {
        setDirection("down");
      } else if (currentScrollY < lastScrollY.current) {
        setDirection("up");
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return direction;
}