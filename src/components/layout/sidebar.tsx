"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Users,
  BarChart3,
  Settings,
  PlusCircle,
  ClipboardList,
  MessageSquare,
  Award,
  ShieldCheck,
  DollarSign,
} from "lucide-react";

const studentLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/my-courses", label: "My Courses", icon: BookOpen },
  { href: "/dashboard/certificates", label: "Certificates", icon: Award },
  { href: "/dashboard/discussions", label: "Discussions", icon: MessageSquare },
];

const instructorLinks = [
  { href: "/instructor", label: "Dashboard", icon: LayoutDashboard },
  { href: "/instructor/courses", label: "My Courses", icon: BookOpen },
  { href: "/instructor/create", label: "Create Course", icon: PlusCircle },
  { href: "/instructor/grades", label: "Grade Book", icon: ClipboardList },
  { href: "/instructor/earnings", label: "Earnings", icon: DollarSign },
  { href: "/instructor/analytics", label: "Analytics", icon: BarChart3 },
];

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/approvals", label: "Approvals", icon: ShieldCheck },
  { href: "/admin/revenue", label: "Revenue", icon: DollarSign },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = session?.user?.role;

  const links =
    role === "ADMIN"
      ? adminLinks
      : role === "INSTRUCTOR"
        ? instructorLinks
        : studentLinks;

  const sidebarContent = (
    <>
      <div className="flex h-16 items-center justify-between border-b border-gray-200 px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
            LF
          </div>
          <span className="text-lg font-bold text-gray-900">LearnForge</span>
        </Link>
        {onMobileClose && (
          <button onClick={onMobileClose} className="lg:hidden p-1 text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive =
            pathname === link.href ||
            (link.href !== "/dashboard" &&
              link.href !== "/instructor" &&
              link.href !== "/admin" &&
              pathname.startsWith(link.href));

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onMobileClose}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-200 p-4">
        <Link
          href="/courses"
          onClick={onMobileClose}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <GraduationCap className="h-5 w-5" />
          Browse Courses
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-gray-200 bg-white lg:flex">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onMobileClose} />
          <aside className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-gray-200 bg-white lg:hidden animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}
