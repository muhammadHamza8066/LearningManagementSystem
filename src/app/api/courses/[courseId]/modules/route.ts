import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { resolveParams } from "@/lib/params";
import { z } from "zod";

const moduleSchema = z.object({
  title: z.string().min(1, "Module title is required"),
});

export async function GET(
  req: Request,
  ctx: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await resolveParams(ctx.params);
    const modules = await db.module.findMany({
      where: { courseId },
      orderBy: { position: "asc" },
      include: {
        lessons: { orderBy: { position: "asc" } },
      },
    });
    return NextResponse.json(modules);
  } catch (error) {
    console.error("Failed to fetch modules:", error);
    return NextResponse.json({ error: "Failed to fetch modules" }, { status: 500 });
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

    const course = await db.course.findUnique({ where: { id: courseId } });
    if (!course || course.instructorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { title } = moduleSchema.parse(body);

    const lastModule = await db.module.findFirst({
      where: { courseId },
      orderBy: { position: "desc" },
    });

    const mod = await db.module.create({
      data: {
        title,
        courseId,
        position: (lastModule?.position ?? -1) + 1,
      },
      include: { lessons: true },
    });

    return NextResponse.json(mod, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error("Failed to create module:", error);
    return NextResponse.json({ error: "Failed to create module" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  ctx: { params: Promise<{ courseId: string }> }
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
    const { orderedIds } = body as { orderedIds: string[] };

    const updates = orderedIds.map((id, index) =>
      db.module.update({ where: { id }, data: { position: index } })
    );
    await db.$transaction(updates);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to reorder modules:", error);
    return NextResponse.json({ error: "Failed to reorder modules" }, { status: 500 });
  }
}
