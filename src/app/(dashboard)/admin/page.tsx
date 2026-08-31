"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, DollarSign, ShieldCheck, TrendingUp, UserPlus, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Stats {
  totalUsers: number;
  newUsersThisWeek: number;
  totalCourses: number;
  newCoursesThisWeek: number;
  totalEnrollments: number;
  totalRevenue: number;
  pendingApprovals: number;
  recentUsers: { id: string; name: string; email: string; role: string; createdAt: string; isApproved: boolean }[];
  coursesByCategory: { category: string; count: number }[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-gray-400" /></div>;
  if (!stats) return <div className="text-center py-20 text-gray-500">Failed to load dashboard</div>;

  const statCards = [
    { label: "Total Users", value: stats.totalUsers, change: `+${stats.newUsersThisWeek} this week`, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Courses", value: stats.totalCourses, change: `+${stats.newCoursesThisWeek} this week`, icon: BookOpen, color: "text-green-600", bg: "bg-green-50" },
    { label: "Revenue", value: `$${stats.totalRevenue.toFixed(2)}`, change: `${stats.totalEnrollments} enrollments`, icon: DollarSign, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Pending Approvals", value: stats.pendingApprovals, change: "Instructors awaiting review", icon: ShieldCheck, color: "text-red-600", bg: "bg-red-50" },
  ];

  return (
    <div className="space-y-8">
      <div><h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1><p className="mt-1 text-sm text-gray-500">Platform overview and management.</p></div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => { const Icon = s.icon; return (
          <Card key={s.label}><CardContent className="p-5"><div className="flex items-center justify-between">
            <div><p className="text-sm text-gray-500">{s.label}</p><p className="mt-1 text-2xl font-bold text-gray-900">{s.value}</p><p className="mt-1 text-xs text-gray-400">{s.change}</p></div>
            <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${s.bg}`}><Icon className={`h-5 w-5 ${s.color}`} /></div>
          </div></CardContent></Card>
        );})}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-gray-400" />Courses by Category</CardTitle></CardHeader>
          <CardContent>
            {stats.coursesByCategory.length === 0 ? <p className="py-8 text-center text-sm text-gray-400">No published courses yet.</p> : (
              <div className="space-y-3">
                {stats.coursesByCategory.map((c) => (
                  <div key={c.category} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{c.category}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 rounded-full bg-blue-100" style={{ width: `${Math.max(c.count * 20, 20)}px` }}>
                        <div className="h-full rounded-full bg-blue-600" style={{ width: "100%" }} />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{c.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card><CardHeader><CardTitle className="flex items-center gap-2"><UserPlus className="h-5 w-5 text-gray-400" />Recent Registrations</CardTitle></CardHeader>
          <CardContent>
            {stats.recentUsers.length === 0 ? <p className="py-8 text-center text-sm text-gray-400">No users yet.</p> : (
              <div className="space-y-3">
                {stats.recentUsers.slice(0, 8).map((u) => (
                  <div key={u.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600">{u.name.charAt(0)}</div>
                      <div><p className="text-sm font-medium text-gray-900">{u.name}</p><p className="text-xs text-gray-500">{u.email}</p></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={u.role === "ADMIN" ? "destructive" : u.role === "INSTRUCTOR" ? "default" : "secondary"} className="text-[10px]">{u.role}</Badge>
                      <span className="text-xs text-gray-400">{formatDate(u.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
