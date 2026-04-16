"use client";

import {
  BookOpen,
  GraduationCap,
  House,
  Mail,
  MoreHorizontal,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { useScrollDirection } from "@/hooks/useScrollDirection";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type ActiveItem = "home" | "seminars" | "experts" | "more";

type NavItem = {
  key: ActiveItem;
  label: string;
  href?: string;
  icon: LucideIcon;
};

const navItems: NavItem[] = [
  { key: "home", label: "Home", href: "#hero", icon: House },
  { key: "seminars", label: "Seminars", href: "#seminars", icon: BookOpen },
  { key: "experts", label: "Experts", href: "#experts", icon: GraduationCap },
  { key: "more", label: "More", icon: MoreHorizontal },
];

const sectionMap: Array<{ id: string; key: Exclude<ActiveItem, "more"> }> = [
  { id: "hero", key: "home" },
  { id: "seminars", key: "seminars" },
  { id: "experts", key: "experts" },
];

export default function BottomNav() {
  const direction = useScrollDirection();
  const [active, setActive] = useState<ActiveItem>("home");

  useEffect(() => {
    const sections = sectionMap
      .map((item) => ({ ...item, element: document.getElementById(item.id) }))
      .filter((item): item is { id: string; key: Exclude<ActiveItem, "more">; element: HTMLElement } =>
        Boolean(item.element)
      );

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries[0]) {
          const matched = sections.find((section) => section.element === visibleEntries[0].target);
          if (matched) {
            setActive(matched.key);
          }
        }
      },
      {
        root: null,
        rootMargin: "-35% 0px -45% 0px",
        threshold: [0.2, 0.4, 0.6],
      }
    );

    sections.forEach((section) => observer.observe(section.element));

    return () => observer.disconnect();
  }, []);

  const hiddenOnScrollDown = useMemo(() => direction === "down", [direction]);

  const handleAnchorClick = (event: React.MouseEvent<HTMLAnchorElement>, href: string, item: ActiveItem) => {
    event.preventDefault();
    const section = document.querySelector(href);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      setActive(item);
    }
  };

  return (
    <nav
      className={cn(
        "w-[95%] mx-auto fixed inset-x-0 bottom-2 z-50 border-t border-saffron/10 bg-[#0D0B08]/95 backdrop-blur-md transition-transform duration-300 ease-in-out md:hidden rounded-xl",
        hiddenOnScrollDown ? "translate-y-full" : "translate-y-0"
      )}
      aria-label="Mobile Bottom Navigation"
    >
      <div className="grid grid-cols-4 items-center px-2 py-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.key;

          if (item.key === "more") {
            return (
              <Popover key={item.key}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "flex h-14 flex-col items-center justify-center gap-0.5 rounded-md transition-colors duration-200",
                      isActive ? "text-saffron" : "text-white/40"
                    )}
                    onClick={() => setActive("more")}
                  >
                    <span className={cn("mb-0.5 h-1.5 w-1.5 rounded-full", isActive ? "bg-saffron" : "bg-transparent")} />
                    <Icon className="h-5.5 w-5.5" />
                    <span className="font-body text-[10px]">{item.label}</span>
                  </button>
                </PopoverTrigger>
                <PopoverContent align="end" side="top" className="mb-2 w-44">
                  <div className="flex flex-col gap-1">
                    <a
                      href="#problem"
                      className="rounded-md px-3 py-2 text-sm text-ivory/90 transition-colors hover:bg-saffron/10 hover:text-saffron"
                      onClick={(event) => handleAnchorClick(event, "#problem", "more")}
                    >
                      About
                    </a>
                    <a
                      href="#"
                      className="rounded-md px-3 py-2 text-sm text-ivory/90 transition-colors hover:bg-saffron/10 hover:text-saffron"
                    >
                      Privacy Policy
                    </a>
                    <a
                      href="#"
                      className="rounded-md px-3 py-2 text-sm text-ivory/90 transition-colors hover:bg-saffron/10 hover:text-saffron"
                    >
                      Refund Policy
                    </a>
                  </div>
                </PopoverContent>
              </Popover>
            );
          }

          return (
            <a
              key={item.key}
              href={item.href}
              className={cn(
                "flex h-14 flex-col items-center justify-center gap-0.5 rounded-md transition-colors duration-200",
                isActive ? "text-saffron" : "text-white/40"
              )}
              onClick={(event) => handleAnchorClick(event, item.href || "#hero", item.key)}
            >
              <span className={cn("mb-0.5 h-1.5 w-1.5 rounded-full", isActive ? "bg-saffron" : "bg-transparent")} />
              <Icon className="h-5.5 w-5.5" />
              <span className="font-body text-[10px]">{item.label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
