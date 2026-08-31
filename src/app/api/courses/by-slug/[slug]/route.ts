import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { resolveParams } from "@/lib/params";

export async function GET(
  req: Request,
  ctx: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await resolveParams(ctx.params);

    const course = await db.course.findUnique({
      where: { slug },
      include: {
        instructor: { select: { id: true, name: true, image: true, bio: true } },
        category: { select: { name: true, slug: true } },
        modules: {
          orderBy: { position: "asc" },
          include: {
            lessons: {
              orderBy: { position: "asc" },
              select: { id: true, title: true, duration: true, isFree: true, videoUrl: true },
            },
          },
        },
        _count: { select: { enrollments: true, reviews: true } },
        reviews: {
          include: { user: { select: { name: true, image: true } } },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!course || course.status !== "PUBLISHED") {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    return NextResponse.json(course);
  } catch (error) {
    console.error("Failed to fetch course:", error);
    return NextResponse.json({ error: "Failed to fetch course" }, { status: 500 });
  }
}
