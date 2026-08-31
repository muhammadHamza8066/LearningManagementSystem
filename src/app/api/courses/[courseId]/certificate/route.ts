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

    const enrollment = await db.enrollment.findUnique({
      where: { userId_courseId: { userId: session.user.id, courseId } },
    });

    if (!enrollment || enrollment.status !== "COMPLETED") {
      return NextResponse.json(
        { error: "You must complete the course to get a certificate" },
        { status: 400 }
      );
    }

    const existing = await db.certificate.findUnique({
      where: { userId_courseId: { userId: session.user.id, courseId } },
    });

    if (existing) {
      return NextResponse.json(existing);
    }

    const course = await db.course.findUnique({
      where: { id: courseId },
      select: { title: true },
    });

    const certificate = await db.certificate.create({
      data: {
        userId: session.user.id,
        courseId,
        url: `/certificate/${Date.now().toString(36)}`,
      },
    });

    return NextResponse.json(certificate, { status: 201 });
  } catch (error) {
    console.error("Failed to generate certificate:", error);
    return NextResponse.json({ error: "Failed to generate certificate" }, { status: 500 });
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

    const certificate = await db.certificate.findUnique({
      where: { userId_courseId: { userId: session.user.id, courseId } },
    });

    return NextResponse.json(certificate);
  } catch (error) {
    return NextResponse.json(null);
  }
}
