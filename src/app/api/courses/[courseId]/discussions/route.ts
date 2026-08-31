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

    const discussions = await db.discussion.findMany({
      where: { courseId },
      include: {
        user: { select: { name: true, image: true } },
        _count: { select: { replies: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(discussions);
  } catch (error) {
    console.error("Failed to fetch discussions:", error);
    return NextResponse.json({ error: "Failed to fetch discussions" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  ctx: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { courseId } = await resolveParams(ctx.params);
    const body = await req.json();

    const enrollment = await db.enrollment.findUnique({
      where: { userId_courseId: { userId: session.user.id, courseId } },
    });

    const course = await db.course.findUnique({ where: { id: courseId } });
    const isInstructor = course?.instructorId === session.user.id;

    if (!enrollment && !isInstructor && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "You must be enrolled to participate" }, { status: 403 });
    }

    const discussion = await db.discussion.create({
      data: {
        title: body.title,
        content: body.content,
        userId: session.user.id,
        courseId,
      },
      include: {
        user: { select: { name: true, image: true } },
        _count: { select: { replies: true } },
      },
    });

    return NextResponse.json(discussion, { status: 201 });
  } catch (error) {
    console.error("Failed to create discussion:", error);
    return NextResponse.json({ error: "Failed to create discussion" }, { status: 500 });
  }
}
