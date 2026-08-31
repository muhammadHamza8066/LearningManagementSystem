import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const enrollments = await db.enrollment.findMany({
      where: { userId: session.user.id },
      orderBy: { enrolledAt: "desc" },
      include: {
        course: {
          include: {
            instructor: { select: { name: true } },
            modules: {
              include: { lessons: { select: { id: true } } },
            },
          },
        },
      },
    });

    return NextResponse.json(enrollments);
  } catch (error) {
    console.error("Failed to fetch enrollments:", error);
    return NextResponse.json({ error: "Failed to fetch enrollments" }, { status: 500 });
  }
}
