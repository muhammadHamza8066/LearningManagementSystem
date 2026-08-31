import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  BookOpen,
  Clock,
  Award,
  TrendingUp,
  ArrowRight,
  Play,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  if (session.user.role === "ADMIN") redirect("/admin");
  if (session.user.role === "INSTRUCTOR") redirect("/instructor");

  const stats = [
    {
      label: "Enrolled Courses",
      value: "0",
      icon: BookOpen,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Hours Learned",
      value: "0",
      icon: Clock,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Certificates Earned",
      value: "0",
      icon: Award,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Avg. Progress",
      value: "0%",
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-50",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {session.user.name?.split(" ")[0]}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Track your learning progress and continue where you left off.
        </p>
      </div>

      {/* Stats */}
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

      {/* Continue Learning */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Continue Learning</span>
            <Link href="/dashboard/my-courses">
              <Button variant="ghost" size="sm" className="gap-1">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
              <Play className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-gray-900">
              No courses yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Browse the course catalog and enroll in your first course.
            </p>
            <Link href="/courses" className="mt-4">
              <Button size="sm">Browse courses</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
