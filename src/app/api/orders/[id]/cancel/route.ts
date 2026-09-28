import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await requireAuth();
    const { reason } = await req.json();

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true, farmer: true },
    });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    // Access check
    const isCustomer = order.customerId === session.userId;
    const isFarmer = order.farmer.userId === session.userId;
    if (!isCustomer && !isFarmer && session.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (!["PLACED", "ACCEPTED"].includes(order.status)) {
      return NextResponse.json({ error: "Cannot cancel this order" }, { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id },
        data: {
          status: isFarmer && order.status === "PLACED" ? "DECLINED" : "CANCELLED",
          cancelReason: reason || null,
        },
      });
      // Restore stock
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity }, totalSold: { decrement: item.quantity } },
        });
      }
      // Notify counterparty
      const notifyUserId = isCustomer ? order.farmer.userId : order.customerId;
      await tx.notification.create({
        data: {
          userId: notifyUserId,
          type: "ORDER_CANCELLED",
          title: isCustomer ? "Customer cancelled order" : "Farmer declined order",
          message: `Order #${order.orderNumber.slice(-6).toUpperCase()}${reason ? `: ${reason}` : ""}`,
          link: isCustomer ? `/farmer/orders/${order.id}` : `/customer/orders/${order.id}`,
        },
      });
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
