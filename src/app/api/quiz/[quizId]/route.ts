import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { resolveParams } from "@/lib/params";

export async function GET(
  req: Request,
  ctx: { params: Promise<{ quizId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { quizId } = await resolveParams(ctx.params);

    const quiz = await db.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          orderBy: { position: "asc" },
          include: { options: { select: { id: true, text: true } } },
        },
      },
    });

    if (!quiz) return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    return NextResponse.json(quiz);
  } catch (error) {
    console.error("Failed to fetch quiz:", error);
    return NextResponse.json({ error: "Failed to fetch quiz" }, { status: 500 });
  }
}
