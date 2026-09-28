import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { reviewSchema } from "@/lib/validators";

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth(["CUSTOMER"]);
    const body = await req.json();
    const data = reviewSchema.parse(body);

    // Must have completed order to review
    const hasOrder = await prisma.order.findFirst({
      where: {
        customerId: session.userId,
        status: "COMPLETED",
        ...(data.targetType === "FARMER"
          ? { farmerId: data.targetId }
          : { items: { some: { productId: data.targetId } } }),
      },
    });
    if (!hasOrder) return NextResponse.json({ error: "You can review only after a completed order" }, { status: 400 });

    const review = await prisma.review.create({
      data: {
        customerId: session.userId,
        targetType: data.targetType,
        targetId: data.targetId,
        rating: data.rating,
        comment: data.comment,
      },
    });

    // Update aggregate rating
    const all = await prisma.review.findMany({
      where: { targetType: data.targetType, targetId: data.targetId },
      select: { rating: true },
    });
    const avg = all.reduce((s, r) => s + r.rating, 0) / all.length;

    if (data.targetType === "FARMER") {
      await prisma.farmerProfile.update({
        where: { id: data.targetId },
        data: { averageRating: avg, totalReviews: all.length },
      });
      const farmer = await prisma.farmerProfile.findUnique({ where: { id: data.targetId } });
      if (farmer) {
        await prisma.notification.create({
          data: {
            userId: farmer.userId, type: "REVIEW_RECEIVED",
            title: "New review received", message: `${data.rating}★ — "${data.comment.slice(0, 60)}${data.comment.length > 60 ? "…" : ""}"`,
            link: "/farmer/reviews",
          },
        });
      }
    } else {
      await prisma.product.update({
        where: { id: data.targetId },
        data: { averageRating: avg, totalReviews: all.length },
      });
    }

    return NextResponse.json({ success: true, reviewId: review.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
