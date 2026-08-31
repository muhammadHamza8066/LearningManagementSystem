import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { resolveParams } from "@/lib/params";

export async function POST(
  req: Request,
  ctx: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { courseId } = await resolveParams(ctx.params);

    const course = await db.course.findUnique({ where: { id: courseId } });
    if (!course || !course.isFree) {
      if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });

      const stripeKey = process.env.STRIPE_SECRET_KEY;
      if (!stripeKey) {
        return NextResponse.json({
          error: "Stripe is not configured. Add STRIPE_SECRET_KEY to .env to enable payments.",
          checkoutUrl: null,
          demo: true,
        }, { status: 200 });
      }

      const payment = await db.payment.create({
        data: {
          userId: session.user.id,
          courseId,
          amount: course.price,
          currency: "usd",
          status: "COMPLETED",
          stripePaymentId: `demo_${Date.now()}`,
        },
      });

      await db.enrollment.create({
        data: { userId: session.user.id, courseId },
      });

      return NextResponse.json({
        success: true,
        paymentId: payment.id,
        message: "Demo payment completed. Student enrolled.",
      });
    }

    return NextResponse.json({ error: "This course is free. Use the enroll endpoint." }, { status: 400 });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
