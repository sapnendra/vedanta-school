"use client";

import Image from "next/image";
import Link from "next/link";
import { Moon, Sun } from "lucide-react";
import { type MouseEvent, useEffect, useState } from "react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#problem" },
  { label: "Seminars", href: "#seminars" },
  { label: "Experts", href: "#experts" },
  { label: "Contact", href: "#register" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleAnchorClick = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    event.preventDefault();
    const section = document.querySelector(href);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-saffron/10 bg-charcoal transition-all duration-300",
        isScrolled && "bg-charcoal/90 backdrop-blur-md"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="#hero" className="flex items-center gap-2 text-saffron" scroll={false}>
          <Image src="/logo.svg" alt="Vedanta Life School logo" width={22} height={22} className="size-5" priority />
          <span className="font-heading text-base font-semibold tracking-tight sm:text-lg">
            Vedanta Life School
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(event) => handleAnchorClick(event, link.href)}
              className="text-sm font-medium text-ivory/80 transition-colors hover:text-saffron"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full border border-saffron/20 text-ivory hover:bg-saffron/10"
            aria-label="Toggle theme"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          >
            {resolvedTheme === "dark" ? (
              <Sun className="size-4 text-saffron" />
            ) : (
              <Moon className="size-4 text-saffron" />
            )}
          </Button>

          <Button className="rounded-full bg-saffron px-3 text-charcoal hover:bg-gold sm:px-5" asChild>
            <a href="#register" onClick={(event) => handleAnchorClick(event, "#register")}>
              <span className="text-xs sm:text-sm">Reserve Your Seat</span>
            </a>
          </Button>
        </div>

        <Button className="hidden rounded-full bg-saffron px-5 text-charcoal hover:bg-gold md:inline-flex" asChild>
          <a href="#register" onClick={(event) => handleAnchorClick(event, "#register")}>
            Reserve Your Seat
          </a>
        </Button>
      </div>
    </header>
  );
}