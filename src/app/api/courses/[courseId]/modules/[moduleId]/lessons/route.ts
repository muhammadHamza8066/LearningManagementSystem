import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { resolveParams } from "@/lib/params";
import { z } from "zod";

const lessonSchema = z.object({
  title: z.string().min(1, "Lesson title is required"),
  content: z.string().optional(),
  videoUrl: z.string().optional(),
  duration: z.number().optional(),
  isFree: z.boolean().default(false),
});

export async function POST(
  req: Request,
  ctx: { params: Promise<{ courseId: string; moduleId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { courseId, moduleId } = await resolveParams(ctx.params);

    const course = await db.course.findUnique({ where: { id: courseId } });
    if (!course || course.instructorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const data = lessonSchema.parse(body);

    const lastLesson = await db.lesson.findFirst({
      where: { moduleId },
      orderBy: { position: "desc" },
    });

    const lesson = await db.lesson.create({
      data: {
        title: data.title,
        content: data.content,
        videoUrl: data.videoUrl,
        duration: data.duration,
        isFree: data.isFree,
        moduleId,
        position: (lastLesson?.position ?? -1) + 1,
      },
    });

    return NextResponse.json(lesson, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message || "Validation error" }, { status: 400 });
    }
    console.error("Failed to create lesson:", error);
    return NextResponse.json({ error: "Failed to create lesson" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  ctx: { params: Promise<{ courseId: string; moduleId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { courseId } = await resolveParams(ctx.params);

    const course = await db.course.findUnique({ where: { id: courseId } });
    if (!course || course.instructorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();

    if (body.orderedIds) {
      const updates = body.orderedIds.map((id: string, index: number) =>
        db.lesson.update({ where: { id }, data: { position: index } })
      );
      await db.$transaction(updates);
      return NextResponse.json({ success: true });
    }

    if (body.lessonId) {
      const lesson = await db.lesson.update({
        where: { id: body.lessonId },
        data: {
          title: body.title,
          content: body.content,
          videoUrl: body.videoUrl,
          duration: body.duration,
          isFree: body.isFree,
        },
      });
      return NextResponse.json(lesson);
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  } catch (error) {
    console.error("Failed to update lesson:", error);
    return NextResponse.json({ error: "Failed to update lesson" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  ctx: { params: Promise<{ courseId: string; moduleId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const lessonId = searchParams.get("lessonId");
    if (!lessonId) return NextResponse.json({ error: "Lesson ID required" }, { status: 400 });

    await db.lesson.delete({ where: { id: lessonId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete lesson:", error);
    return NextResponse.json({ error: "Failed to delete lesson" }, { status: 500 });
  }
}
