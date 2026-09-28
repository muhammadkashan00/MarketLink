import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { placeOrderSchema } from "@/lib/validators";

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth(["CUSTOMER"]);
    const body = await req.json();
    const data = placeOrderSchema.parse(body);

    // Fetch products
    const productIds = data.items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { farmer: true },
    });

    if (products.length !== data.items.length) {
      return NextResponse.json({ error: "Some products not found" }, { status: 400 });
    }
    // Check all from same farmer
    const farmerIds = new Set(products.map((p) => p.farmerId));
    if (farmerIds.size > 1) {
      return NextResponse.json({ error: "Order can only contain items from one farmer" }, { status: 400 });
    }
    // Check stock
    for (const item of data.items) {
      const p = products.find((x) => x.id === item.productId)!;
      if (p.stock < item.quantity) {
        return NextResponse.json({ error: `Insufficient stock for ${p.name}` }, { status: 400 });
      }
    }

    const totalAmount = data.items.reduce((s, i) => {
      const p = products.find((x) => x.id === i.productId)!;
      return s + Number(p.price) * i.quantity;
    }, 0);

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          customerId: session.userId,
          farmerId: data.farmerId,
          marketId: data.marketId || null,
          pickupDate: new Date(data.pickupDate),
          pickupSlot: data.pickupSlot,
          notes: data.notes || null,
          totalAmount,
          items: {
            create: data.items.map((i) => {
              const p = products.find((x) => x.id === i.productId)!;
              return {
                productId: p.id,
                productName: p.name,
                quantity: i.quantity,
                priceAtPurchase: p.price,
                subtotal: Number(p.price) * i.quantity,
              };
            }),
          },
        },
      });

      // Decrement stock
      for (const item of data.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity }, totalSold: { increment: item.quantity } },
        });
      }

      // Notify farmer
      const farmer = products[0].farmer;
      await tx.notification.create({
        data: {
          userId: farmer.userId,
          type: "ORDER_PLACED",
          title: "New pre-order received",
          message: `Order #${created.orderNumber.slice(-6).toUpperCase()} · Rs. ${totalAmount.toFixed(0)}`,
          link: `/farmer/orders/${created.id}`,
        },
      });
      // Notify customer
      await tx.notification.create({
        data: {
          userId: session.userId,
          type: "ORDER_PLACED",
          title: "Order placed",
          message: `Waiting for ${products[0].farmer.stallName} to confirm.`,
          link: `/customer/orders/${created.id}`,
        },
      });

      return created;
    });

    return NextResponse.json({ success: true, orderId: order.id, orderNumber: order.orderNumber });
  } catch (err: any) {
    console.error("place order:", err);
    return NextResponse.json({ error: err.message || "Order failed" }, { status: 400 });
  }
}
