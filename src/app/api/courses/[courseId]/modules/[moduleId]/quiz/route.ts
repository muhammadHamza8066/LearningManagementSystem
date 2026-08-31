import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { resolveParams } from "@/lib/params";
import { z } from "zod";

const quizSchema = z.object({
  title: z.string().min(1, "Quiz title is required"),
  passMark: z.number().min(0).max(100).default(70),
  timeLimit: z.number().optional(),
  questions: z.array(
    z.object({
      text: z.string().min(1),
      type: z.enum(["MCQ", "TRUE_FALSE", "SHORT_ANSWER"]),
      points: z.number().min(1).default(1),
      options: z
        .array(z.object({ text: z.string().min(1), isCorrect: z.boolean() }))
        .optional(),
    })
  ),
});

export async function GET(
  req: Request,
  ctx: { params: Promise<{ courseId: string; moduleId: string }> }
) {
  try {
    const { moduleId } = await resolveParams(ctx.params);
    const quiz = await db.quiz.findUnique({
      where: { moduleId },
      include: {
        questions: {
          orderBy: { position: "asc" },
          include: { options: true },
        },
      },
    });
    return NextResponse.json(quiz);
  } catch (error) {
    console.error("Failed to fetch quiz:", error);
    return NextResponse.json({ error: "Failed to fetch quiz" }, { status: 500 });
  }
}

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

    const existing = await db.quiz.findUnique({ where: { moduleId } });
    if (existing) {
      return NextResponse.json({ error: "This module already has a quiz. Delete it first." }, { status: 409 });
    }

    const body = await req.json();
    const data = quizSchema.parse(body);

    const quiz = await db.quiz.create({
      data: {
        title: data.title,
        passMark: data.passMark,
        timeLimit: data.timeLimit,
        moduleId,
        questions: {
          create: data.questions.map((q, i) => ({
            text: q.text,
            type: q.type,
            points: q.points,
            position: i,
            options: q.options ? { create: q.options } : undefined,
          })),
        },
      },
      include: { questions: { include: { options: true }, orderBy: { position: "asc" } } },
    });

    return NextResponse.json(quiz, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error("Failed to create quiz:", error);
    return NextResponse.json({ error: "Failed to create quiz" }, { status: 500 });
  }
}

export async function DELETE(
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

    await db.quiz.delete({ where: { moduleId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete quiz:", error);
    return NextResponse.json({ error: "Failed to delete quiz" }, { status: 500 });
  }
}
