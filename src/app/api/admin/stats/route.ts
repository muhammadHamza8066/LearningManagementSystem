import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      newUsersThisWeek,
      totalCourses,
      newCoursesThisWeek,
      totalEnrollments,
      totalRevenue,
      pendingApprovals,
      recentUsers,
      coursesByCategory,
      enrollmentsByMonth,
    ] = await Promise.all([
      db.user.count(),
      db.user.count({ where: { createdAt: { gte: weekAgo } } }),
      db.course.count({ where: { status: "PUBLISHED" } }),
      db.course.count({ where: { createdAt: { gte: weekAgo }, status: "PUBLISHED" } }),
      db.enrollment.count(),
      db.payment.aggregate({ where: { status: "COMPLETED" }, _sum: { amount: true } }),
      db.user.count({ where: { role: "INSTRUCTOR", isApproved: false } }),
      db.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        select: { id: true, name: true, email: true, role: true, createdAt: true, isApproved: true },
      }),
      db.category.findMany({
        select: {
          name: true,
          _count: { select: { courses: true } },
        },
        orderBy: { name: "asc" },
      }),
      db.enrollment.groupBy({
        by: ["enrolledAt"],
        _count: true,
        orderBy: { enrolledAt: "asc" },
      }),
    ]);

    return NextResponse.json({
      totalUsers,
      newUsersThisWeek,
      totalCourses,
      newCoursesThisWeek,
      totalEnrollments,
      totalRevenue: totalRevenue._sum.amount || 0,
      pendingApprovals,
      recentUsers,
      coursesByCategory: coursesByCategory.map((c) => ({
        category: c.name,
        count: c._count.courses,
      })),
    });
  } catch (error) {
    console.error("Failed to fetch admin stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
