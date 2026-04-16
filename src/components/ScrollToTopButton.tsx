"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsVisible(window.scrollY > 360);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label="Scroll to top"
      onClick={scrollToTop}
      className={cn(
        "fixed right-4 z-50 rounded-full border border-saffron/35 bg-charcoal/90 text-saffron shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-saffron/12 md:left-6",
        "bottom-24 md:bottom-6",
        isVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      )}
    >
      <ArrowUp className="size-5" />
    </Button>
  );
}
