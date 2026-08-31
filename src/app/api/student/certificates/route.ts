import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const certs = await db.certificate.findMany({
      where: { userId: session.user.id },
      include: {
        course: { select: { id: true, title: true, instructor: { select: { name: true } } } },
      },
      orderBy: { issuedAt: "desc" },
    });

    return NextResponse.json(certs);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch certificates" }, { status: 500 });
  }
}
