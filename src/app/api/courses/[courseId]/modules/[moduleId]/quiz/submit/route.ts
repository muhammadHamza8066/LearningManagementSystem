import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string; moduleId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const quiz = await db.quiz.findUnique({
      where: { moduleId: params.moduleId },
      include: {
        questions: {
          include: { options: true },
          orderBy: { position: "asc" },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    const body = await req.json();
    const { answers } = body as {
      answers: { questionId: string; selectedOptionId?: string; text?: string }[];
    };

    let totalPoints = 0;
    let earnedPoints = 0;

    const answerRecords = answers.map((ans) => {
      const question = quiz.questions.find((q) => q.id === ans.questionId);
      if (!question) return { questionId: ans.questionId, text: "", isCorrect: false };

      totalPoints += question.points;

      let isCorrect = false;

      if (question.type === "MCQ" || question.type === "TRUE_FALSE") {
        const correctOption = question.options.find((o) => o.isCorrect);
        isCorrect = correctOption?.id === ans.selectedOptionId;
      } else if (question.type === "SHORT_ANSWER") {
        isCorrect = false;
      }

      if (isCorrect) earnedPoints += question.points;

      return {
        questionId: ans.questionId,
        text: ans.selectedOptionId || ans.text || "",
        isCorrect,
      };
    });

    const score = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
    const hasShortAnswer = quiz.questions.some((q) => q.type === "SHORT_ANSWER");

    const submission = await db.submission.create({
      data: {
        userId: session.user.id,
        quizId: quiz.id,
        score: Math.round(score * 10) / 10,
        status: hasShortAnswer ? "SUBMITTED" : "GRADED",
        gradedAt: hasShortAnswer ? undefined : new Date(),
        answers: {
          create: answerRecords,
        },
      },
      include: {
        answers: {
          include: {
            question: {
              include: { options: true },
            },
          },
        },
      },
    });

    return NextResponse.json({
      submissionId: submission.id,
      score: submission.score,
      passed: (submission.score || 0) >= quiz.passMark,
      passMark: quiz.passMark,
      totalQuestions: quiz.questions.length,
      correctAnswers: answerRecords.filter((a) => a.isCorrect).length,
      status: submission.status,
    });
  } catch (error) {
    console.error("Failed to submit quiz:", error);
    return NextResponse.json({ error: "Failed to submit quiz" }, { status: 500 });
  }
}
