"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";

export default function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <div className="lg:ml-64">
        <Navbar onMenuClick={() => setMobileOpen(true)} />
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
