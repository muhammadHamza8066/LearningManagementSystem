import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { resolveParams } from "@/lib/params";

export async function POST(
  req: Request,
  ctx: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { courseId } = await resolveParams(ctx.params);
    const body = await req.json();
    const { lessonId } = body;

    const enrollment = await db.enrollment.findUnique({
      where: { userId_courseId: { userId: session.user.id, courseId } },
    });
    if (!enrollment) return NextResponse.json({ error: "Not enrolled" }, { status: 403 });

    await db.lessonProgress.upsert({
      where: { enrollmentId_lessonId: { enrollmentId: enrollment.id, lessonId } },
      update: { isCompleted: true, completedAt: new Date() },
      create: { enrollmentId: enrollment.id, lessonId, isCompleted: true, completedAt: new Date() },
    });

    const course = await db.course.findUnique({
      where: { id: courseId },
      include: { modules: { include: { lessons: { select: { id: true } } } } },
    });

    const totalLessons = course?.modules.reduce((acc, m) => acc + m.lessons.length, 0) || 0;
    const completedLessons = await db.lessonProgress.count({
      where: { enrollmentId: enrollment.id, isCompleted: true },
    });
    const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    await db.enrollment.update({
      where: { id: enrollment.id },
      data: {
        progress: overallProgress,
        completedAt: overallProgress === 100 ? new Date() : null,
        status: overallProgress === 100 ? "COMPLETED" : "ACTIVE",
      },
    });

    if (overallProgress === 100) {
      const existingCert = await db.certificate.findUnique({
        where: { userId_courseId: { userId: session.user.id, courseId } },
      });
      if (!existingCert) {
        await db.certificate.create({
          data: { userId: session.user.id, courseId, url: `/certificate/auto` },
        });
      }
    }

    return NextResponse.json({ progress: overallProgress, completedLessons, totalLessons, courseCompleted: overallProgress === 100 });
  } catch (error) {
    console.error("Failed to update progress:", error);
    return NextResponse.json({ error: "Failed to update progress" }, { status: 500 });
  }
}

export async function GET(
  req: Request,
  ctx: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { courseId } = await resolveParams(ctx.params);

    const enrollment = await db.enrollment.findUnique({
      where: { userId_courseId: { userId: session.user.id, courseId } },
      include: { lessonProgress: true },
    });
    if (!enrollment) return NextResponse.json({ error: "Not enrolled" }, { status: 403 });

    return NextResponse.json({
      progress: enrollment.progress,
      status: enrollment.status,
      lessonProgress: enrollment.lessonProgress,
    });
  } catch (error) {
    console.error("Failed to fetch progress:", error);
    return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 });
  }
}
