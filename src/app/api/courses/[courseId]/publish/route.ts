import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const segments = url.pathname.split("/");
    const courseIdx = segments.indexOf("courses");
    const courseId = segments[courseIdx + 1];

    if (!courseId) {
      return NextResponse.json({ error: "Missing course ID" }, { status: 400 });
    }

    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found: " + courseId }, { status: 404 });
    }

    if (course.instructorId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const moduleCount = await db.module.count({
      where: { courseId: courseId },
    });

    if (moduleCount === 0) {
      return NextResponse.json(
        { error: "Course must have at least one module (found 0 for ID: " + courseId + ")" },
        { status: 400 }
      );
    }

    const lessonCount = await db.lesson.count({
      where: { module: { courseId: courseId } },
    });

    if (lessonCount === 0) {
      return NextResponse.json(
        { error: "Course must have at least one lesson" },
        { status: 400 }
      );
    }

    const updated = await db.course.update({
      where: { id: courseId },
      data: { status: "PUBLISHED" },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Publish error:", error);
    return NextResponse.json(
      { error: "Failed: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}
