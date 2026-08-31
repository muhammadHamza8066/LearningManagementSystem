import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "INSTRUCTOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const courses = await db.course.findMany({
      where: { instructorId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { enrollments: true, modules: true },
        },
      },
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error("Failed to fetch instructor courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}
