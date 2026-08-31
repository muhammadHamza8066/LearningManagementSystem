import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { resolveParams } from "@/lib/params";

export async function GET(
  req: Request,
  ctx: { params: Promise<{ discussionId: string }> }
) {
  try {
    const { discussionId } = await resolveParams(ctx.params);

    const discussion = await db.discussion.findUnique({
      where: { id: discussionId },
      include: {
        user: { select: { name: true, image: true, role: true } },
        replies: {
          include: { user: { select: { name: true, image: true, role: true } } },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!discussion) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(discussion);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch discussion" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  ctx: { params: Promise<{ discussionId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { discussionId } = await resolveParams(ctx.params);
    const body = await req.json();

    const reply = await db.reply.create({
      data: {
        content: body.content,
        userId: session.user.id,
        discussionId,
      },
      include: { user: { select: { name: true, image: true, role: true } } },
    });

    return NextResponse.json(reply, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to post reply" }, { status: 500 });
  }
}
