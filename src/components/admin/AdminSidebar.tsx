"use client";

import {
  BookOpen,
  ClipboardList,
  Flame,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

type NavItem = { href: string; label: string; icon: LucideIcon };

const navItems: NavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/seminars", label: "Seminars", icon: BookOpen },
  { href: "/admin/experts", label: "Experts", icon: Users },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquare },
  { href: "/admin/registrations", label: "Registrations", icon: ClipboardList },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async (): Promise<void> => {
    try {
      setIsLoggingOut(true);
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0D0B08] border-r border-saffron/10 flex flex-col z-40">
      <div className="px-5 py-6">
        <div className="flex items-center gap-2">
          <Flame size={20} className="text-[#d97706]" />
          <h2 className="text-lg text-[#d97706] font-heading">Vedanta Life School</h2>
        </div>
        <p className="mt-1 text-xs text-white/55 [font-family:var(--font-poppins)]">Admin Panel</p>
      </div>

      <div className="mx-4 border-t border-saffron/10" />

      <nav className="mt-4 flex flex-col gap-1 px-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all duration-150 [font-family:var(--font-poppins)]",
                isActive
                  ? "text-saffron bg-saffron/10 border-l-2 border-saffron"
                  : "text-white/50 hover:text-white hover:bg-white/5",
              ].join(" ")}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-3 pb-5">
        <div className="mb-3 border-t border-saffron/10" />
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-red-300/80 transition-all duration-150 hover:bg-white/5 hover:text-red-200 disabled:opacity-60 [font-family:var(--font-poppins)]"
        >
          <LogOut size={18} />
          <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
        </button>
      </div>
    </aside>
  );
}
