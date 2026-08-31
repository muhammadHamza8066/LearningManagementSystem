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
    const { rating, comment } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    const enrollment = await db.enrollment.findUnique({
      where: { userId_courseId: { userId: session.user.id, courseId } },
    });
    if (!enrollment) {
      return NextResponse.json({ error: "You must be enrolled to review" }, { status: 403 });
    }

    const review = await db.review.upsert({
      where: { userId_courseId: { userId: session.user.id, courseId } },
      update: { rating, comment },
      create: { userId: session.user.id, courseId, rating, comment },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error("Failed to submit review:", error);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
