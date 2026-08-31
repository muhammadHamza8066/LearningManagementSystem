import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { resolveParams } from "@/lib/params";

export async function GET(
  req: Request,
  ctx: { params: Promise<{ certificateId: string }> }
) {
  try {
    const { certificateId } = await resolveParams(ctx.params);

    const cert = await db.certificate.findUnique({
      where: { id: certificateId },
      include: {
        user: { select: { name: true } },
        course: { select: { title: true, instructor: { select: { name: true } } } },
      },
    });

    if (!cert) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(cert);
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
