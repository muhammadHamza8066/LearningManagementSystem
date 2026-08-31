"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Ban, CheckCircle2, Loader2, Shield } from "lucide-react";

interface UserData {
  id: string; name: string; email: string; role: string;
  isApproved: boolean; isBanned: boolean; createdAt: string;
  _count: { enrollments: number; coursesCreated: number };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/users").then((r) => r.json()).then((d) => setUsers(Array.isArray(d) ? d : [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  async function handleAction(userId: string, action: string, role?: string) {
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, action, role }),
    });
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(Array.isArray(data) ? data : []);
  }

  if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-gray-400" /></div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">User Management</h1><p className="text-sm text-gray-500">{users.length} total users</p></div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-500">User</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Role</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Activity</th>
              <th className="px-4 py-3 text-right font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">{u.name.charAt(0)}</div>
                    <div><p className="font-medium text-gray-900">{u.name}</p><p className="text-xs text-gray-500">{u.email}</p></div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={u.role === "ADMIN" ? "destructive" : u.role === "INSTRUCTOR" ? "default" : "secondary"}>{u.role}</Badge>
                </td>
                <td className="px-4 py-3">
                  {u.isBanned ? <Badge variant="destructive">Banned</Badge> : u.isApproved ? <Badge variant="success">Active</Badge> : <Badge variant="warning">Pending</Badge>}
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">
                  {u.role === "INSTRUCTOR" ? `${u._count.coursesCreated} courses` : `${u._count.enrollments} enrollments`}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    {!u.isApproved && u.role === "INSTRUCTOR" && (
                      <Button size="sm" variant="outline" className="text-xs gap-1" onClick={() => handleAction(u.id, "approve")}>
                        <CheckCircle2 className="h-3 w-3" /> Approve
                      </Button>
                    )}
                    {u.isBanned ? (
                      <Button size="sm" variant="outline" className="text-xs" onClick={() => handleAction(u.id, "unban")}>Unban</Button>
                    ) : u.role !== "ADMIN" ? (
                      <Button size="sm" variant="outline" className="text-xs text-red-600 gap-1" onClick={() => handleAction(u.id, "ban")}>
                        <Ban className="h-3 w-3" /> Ban
                      </Button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
