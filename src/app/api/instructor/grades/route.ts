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
      select: {
        id: true,
        title: true,
        modules: {
          select: { id: true, title: true },
          orderBy: { position: "asc" },
        },
      },
    });

    const moduleIds = courses.flatMap((c) => c.modules.map((m) => m.id));

    const quizzes = await db.quiz.findMany({
      where: { moduleId: { in: moduleIds } },
      select: {
        id: true,
        title: true,
        passMark: true,
        moduleId: true,
        submissions: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    const result = courses.map((course) => ({
      ...course,
      modules: course.modules.map((mod) => ({
        ...mod,
        quiz: quizzes.find((q) => q.moduleId === mod.id) || null,
      })),
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch grades:", error);
    return NextResponse.json({ error: "Failed to fetch grades" }, { status: 500 });
  }
}
