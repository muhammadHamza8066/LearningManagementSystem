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

    const course = await db.course.findUnique({ where: { id: courseId } });
    if (!course || course.status !== "PUBLISHED") {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const existing = await db.enrollment.findUnique({
      where: { userId_courseId: { userId: session.user.id, courseId } },
    });
    if (existing) {
      return NextResponse.json({ error: "Already enrolled" }, { status: 409 });
    }

    if (!course.isFree) {
      return NextResponse.json({ error: "Payment required" }, { status: 402 });
    }

    const enrollment = await db.enrollment.create({
      data: { userId: session.user.id, courseId },
    });

    return NextResponse.json(enrollment, { status: 201 });
  } catch (error) {
    console.error("Failed to enroll:", error);
    return NextResponse.json({ error: "Failed to enroll" }, { status: 500 });
  }
}
