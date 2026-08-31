import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await db.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true, name: true, email: true, role: true,
        isApproved: true, isBanned: true, createdAt: true,
        _count: { select: { enrollments: true, coursesCreated: true } },
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { userId, action } = body;

    if (action === "ban") {
      await db.user.update({ where: { id: userId }, data: { isBanned: true } });
    } else if (action === "unban") {
      await db.user.update({ where: { id: userId }, data: { isBanned: false } });
    } else if (action === "approve") {
      await db.user.update({ where: { id: userId }, data: { isApproved: true } });
    } else if (action === "changeRole") {
      await db.user.update({ where: { id: userId }, data: { role: body.role } });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
