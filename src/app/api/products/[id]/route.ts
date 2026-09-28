import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { productSchema } from "@/lib/validators";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await requireAuth(["FARMER", "ADMIN"]);
    const body = await req.json();

    const product = await prisma.product.findUnique({ where: { id }, include: { farmer: true } });
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (session.role === "FARMER" && product.farmer.userId !== session.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = productSchema.partial().parse(body);
    await prisma.product.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description !== undefined && { description: data.description || null }),
        ...(data.categoryId && { categoryId: data.categoryId }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.unit && { unit: data.unit }),
        ...(data.stock !== undefined && { stock: data.stock }),
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl || null }),
        ...(data.isRecurring !== undefined && { isRecurring: data.isRecurring }),
        ...(body.isAvailable !== undefined && { isAvailable: body.isAvailable }),
        ...(body.isSoldOut !== undefined && { isSoldOut: body.isSoldOut }),
      },
    });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await requireAuth(["FARMER", "ADMIN"]);
    const product = await prisma.product.findUnique({ where: { id }, include: { farmer: true } });
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (session.role === "FARMER" && product.farmer.userId !== session.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
