"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import {
  LogOut,
  Bell,
  Search,
  User,
  Settings,
  LayoutDashboard,
  BookOpen,
  ChevronDown,
  X,
  Menu,
} from "lucide-react";

export function Navbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { data: session } = useSession();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifRead, setNotifRead] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const role = session?.user?.role;
  const dashHref = role === "ADMIN" ? "/admin" : role === "INSTRUCTOR" ? "/instructor" : "/dashboard";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 px-4 sm:px-6 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button onClick={onMenuClick} className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-900">
            <Menu className="h-5 w-5" />
          </button>
        )}
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses, lessons..."
            className="h-9 w-48 md:w-72 rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            <Bell className="h-5 w-5" />
            {!notifRead && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-gray-200 bg-white shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                <button onClick={() => setNotifOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                <div className="px-4 py-3 hover:bg-gray-50 border-b border-gray-50">
                  <p className="text-sm text-gray-900">Welcome to LearnForge!</p>
                  <p className="mt-0.5 text-xs text-gray-500">Start by browsing the course catalog and enrolling in your first course.</p>
                  <p className="mt-1 text-xs text-gray-400">Just now</p>
                </div>
                <div className="px-4 py-3 hover:bg-gray-50 border-b border-gray-50">
                  <p className="text-sm text-gray-900">New courses available</p>
                  <p className="mt-0.5 text-xs text-gray-500">8 new courses have been published including Programming Fundamentals and Data Structures.</p>
                  <p className="mt-1 text-xs text-gray-400">2 hours ago</p>
                </div>
                <div className="px-4 py-3 hover:bg-gray-50">
                  <p className="text-sm text-gray-900">Complete your profile</p>
                  <p className="mt-0.5 text-xs text-gray-500">Add a profile picture and bio to personalize your account.</p>
                  <p className="mt-1 text-xs text-gray-400">1 day ago</p>
                </div>
              </div>
              <div className="border-t border-gray-100 px-4 py-2">
                <button
                  className="w-full text-center text-xs font-medium text-blue-600 hover:text-blue-700 py-1"
                  onClick={() => { setNotifRead(true); setNotifOpen(false); }}
                >
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile dropdown */}
        {session?.user && (
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-100 transition-colors"
            >
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900 leading-tight">{session.user.name}</p>
                <Badge
                  variant={role === "ADMIN" ? "destructive" : role === "INSTRUCTOR" ? "default" : "secondary"}
                  className="text-[10px] mt-0.5"
                >
                  {role}
                </Badge>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                {session.user.name?.charAt(0).toUpperCase()}
              </div>
              <ChevronDown className="hidden sm:block h-3.5 w-3.5 text-gray-400" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-gray-200 bg-white shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="border-b border-gray-100 px-4 py-3">
                  <p className="text-sm font-semibold text-gray-900">{session.user.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{session.user.email}</p>
                </div>
                <div className="p-2">
                  <Link
                    href={dashHref}
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <LayoutDashboard className="h-4 w-4 text-gray-400" />
                    Dashboard
                  </Link>
                  {role === "STUDENT" && (
                    <Link
                      href="/dashboard/my-courses"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <BookOpen className="h-4 w-4 text-gray-400" />
                      My Courses
                    </Link>
                  )}
                  <Link
                    href="/courses"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Search className="h-4 w-4 text-gray-400" />
                    Browse Courses
                  </Link>
                </div>
                <div className="border-t border-gray-100 p-2">
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {!session && (
          <div className="flex items-center gap-2">
            <Link href="/login" className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900">Sign in</Link>
            <Link href="/register" className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700">Get started</Link>
          </div>
        )}
      </div>
    </header>
  );
}
