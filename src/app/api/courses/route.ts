import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";
import { z } from "zod";

const createCourseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  categoryId: z.string().optional(),
  price: z.number().min(0).default(0),
  isFree: z.boolean().default(true),
  level: z.string().optional(),
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const level = searchParams.get("level") || "";
    const sort = searchParams.get("sort") || "newest";

    const where: Record<string, unknown> = {
      status: "PUBLISHED",
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category) {
      where.categoryId = category;
    }

    if (level) {
      where.level = level;
    }

    const orderBy: any =
      sort === "price-low"
        ? { price: "asc" }
        : sort === "price-high"
          ? { price: "desc" }
          : sort === "popular"
            ? { enrollments: { _count: "desc" } }
            : { createdAt: "desc" };

    const [courses, total] = await Promise.all([
      db.course.findMany({
        where,
        include: {
          instructor: { select: { id: true, name: true, image: true } },
          category: { select: { id: true, name: true, slug: true } },
          modules: {
            include: { lessons: { select: { id: true } } },
          },
          _count: { select: { enrollments: true, reviews: true } },
          reviews: { select: { rating: true } },
        },
        orderBy: sort === "popular" ? { enrollments: { _count: "desc" } } : orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.course.count({ where }),
    ]);

    const coursesWithMeta = courses.map((course) => {
      const totalLessons = course.modules.reduce(
        (acc, m) => acc + m.lessons.length,
        0
      );
      const avgRating =
        course.reviews.length > 0
          ? course.reviews.reduce((acc, r) => acc + r.rating, 0) /
            course.reviews.length
          : 0;

      return {
        id: course.id,
        title: course.title,
        slug: course.slug,
        description: course.description,
        thumbnail: course.thumbnail,
        price: course.price,
        isFree: course.isFree,
        level: course.level,
        instructor: course.instructor,
        category: course.category,
        totalLessons,
        totalModules: course.modules.length,
        enrollmentCount: course._count.enrollments,
        reviewCount: course._count.reviews,
        avgRating: Math.round(avgRating * 10) / 10,
        createdAt: course.createdAt,
      };
    });

    return NextResponse.json({
      courses: coursesWithMeta,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Failed to fetch courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "INSTRUCTOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = createCourseSchema.parse(body);

    let slug = slugify(data.title);
    const existing = await db.course.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const course = await db.course.create({
      data: {
        title: data.title,
        slug,
        description: data.description,
        categoryId: data.categoryId || null,
        price: data.isFree ? 0 : data.price,
        isFree: data.isFree,
        level: data.level,
        instructorId: session.user.id,
        status: "DRAFT",
      },
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Validation error" },
        { status: 400 }
      );
    }
    console.error("Failed to create course:", error);
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    );
  }
}
