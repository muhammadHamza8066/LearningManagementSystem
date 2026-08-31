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
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ enrolled: false });

    const { courseId } = await resolveParams(ctx.params);

    const enrollment = await db.enrollment.findUnique({
      where: { userId_courseId: { userId: session.user.id, courseId } },
    });

    return NextResponse.json({ enrolled: !!enrollment });
  } catch (error) {
    return NextResponse.json({ enrolled: false });
  }
}
