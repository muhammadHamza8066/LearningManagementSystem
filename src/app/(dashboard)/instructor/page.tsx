import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  BookOpen,
  Users,
  DollarSign,
  TrendingUp,
  PlusCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function InstructorDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "INSTRUCTOR") redirect("/dashboard");

  const stats = [
    {
      label: "Published Courses",
      value: "0",
      icon: BookOpen,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Total Students",
      value: "0",
      icon: Users,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Total Earnings",
      value: "$0.00",
      icon: DollarSign,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Avg. Completion",
      value: "0%",
      icon: TrendingUp,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Instructor Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your courses, students, and earnings.
          </p>
        </div>
        <Link href="/instructor/create">
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Create Course
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="mt-1 text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-lg ${stat.bg}`}
                  >
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
              <BookOpen className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-gray-900">
              No courses created yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Create your first course and start sharing your knowledge.
            </p>
            <Link href="/instructor/create" className="mt-4">
              <Button size="sm" className="gap-2">
                <PlusCircle className="h-4 w-4" />
                Create your first course
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
