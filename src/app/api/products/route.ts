import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { productSchema } from "@/lib/validators";

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth(["FARMER"]);
    const body = await req.json();
    const data = productSchema.parse(body);

    const profile = await prisma.farmerProfile.findUnique({ where: { userId: session.userId } });
    if (!profile) return NextResponse.json({ error: "Farmer profile missing" }, { status: 400 });

    const product = await prisma.product.create({
      data: {
        farmerId: profile.id,
        categoryId: data.categoryId,
        name: data.name,
        description: data.description || null,
        price: data.price,
        unit: data.unit,
        stock: data.stock,
        imageUrl: data.imageUrl || null,
        isRecurring: data.isRecurring,
      },
    });
    return NextResponse.json({ success: true, productId: product.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
