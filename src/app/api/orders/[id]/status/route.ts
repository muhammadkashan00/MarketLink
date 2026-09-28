import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

const NEXT_STATUS: Record<string, string> = {
  PLACED: "ACCEPTED",
  ACCEPTED: "READY",
  READY: "COMPLETED",
};

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await requireAuth(["FARMER", "ADMIN"]);
    const { action } = await req.json(); // action = "advance" | "cancel"

    const order = await prisma.order.findUnique({
      where: { id },
      include: { farmer: true },
    });
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (session.role === "FARMER" && order.farmer.userId !== session.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (action === "advance") {
      const next = NEXT_STATUS[order.status];
      if (!next) return NextResponse.json({ error: "Cannot advance" }, { status: 400 });

      await prisma.order.update({ where: { id }, data: { status: next as any } });
      const type = next === "ACCEPTED" ? "ORDER_ACCEPTED" : next === "READY" ? "ORDER_READY" : "ORDER_COMPLETED";
      await prisma.notification.create({
        data: {
          userId: order.customerId,
          type: type as any,
          title:
            next === "ACCEPTED" ? "Order accepted!" :
            next === "READY" ? "Your order is ready for pickup" :
            "Order marked as picked up",
          message: `Order #${order.orderNumber.slice(-6).toUpperCase()}`,
          link: `/customer/orders/${order.id}`,
        },
      });
      return NextResponse.json({ success: true, status: next });
    }
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
