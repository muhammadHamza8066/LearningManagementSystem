import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { resolveParams } from "@/lib/params";

export async function GET(
  req: Request,
  ctx: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await resolveParams(ctx.params);

    const course = await db.course.findUnique({
      where: { id: courseId },
      include: {
        instructor: { select: { id: true, name: true, image: true, bio: true } },
        category: true,
        modules: {
          orderBy: { position: "asc" },
          include: {
            lessons: {
              orderBy: { position: "asc" },
              select: { id: true, title: true, content: true, duration: true, isFree: true, position: true, videoUrl: true },
            },
          },
        },
        _count: { select: { enrollments: true, reviews: true } },
        reviews: {
          include: { user: { select: { name: true, image: true } } },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });

    const quizzes = await db.quiz.findMany({
      where: { moduleId: { in: course.modules.map((m: any) => m.id) } },
      select: { id: true, title: true, moduleId: true },
    });

    const courseWithQuizzes = {
      ...course,
      modules: course.modules.map((m: any) => ({
        ...m,
        quiz: quizzes.find((q) => q.moduleId === m.id) || null,
      })),
    };

    return NextResponse.json(courseWithQuizzes);
  } catch (error) {
    console.error("Failed to fetch course:", error);
    return NextResponse.json({ error: "Failed to fetch course" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { courseId } = await resolveParams(ctx.params);

    const course = await db.course.findUnique({ where: { id: courseId } });
    if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });
    if (course.instructorId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const updated = await db.course.update({
      where: { id: courseId },
      data: {
        title: body.title,
        description: body.description,
        thumbnail: body.thumbnail,
        previewVideo: body.previewVideo,
        price: body.isFree ? 0 : body.price,
        isFree: body.isFree,
        level: body.level,
        categoryId: body.categoryId || null,
        duration: body.duration,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update course:", error);
    return NextResponse.json({ error: "Failed to update course" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  ctx: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { courseId } = await resolveParams(ctx.params);

    const course = await db.course.findUnique({ where: { id: courseId } });
    if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });
    if (course.instructorId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db.course.delete({ where: { id: courseId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete course:", error);
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 });
  }
}
