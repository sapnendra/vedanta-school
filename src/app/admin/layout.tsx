import type { ReactNode } from "react";

import AdminSidebar from "@/components/admin/AdminSidebar";
import { Toaster } from "@/components/ui/sonner";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#0D0B08]">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8 overflow-auto">{children}</main>
      <Toaster richColors position="top-right" />
    </div>
  );
}
