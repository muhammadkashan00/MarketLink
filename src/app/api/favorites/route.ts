import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  const session = await requireAuth().catch(() => null);
  if (!session) return NextResponse.json({ favorites: [] });
  const list = await prisma.favorite.findMany({ where: { userId: session.userId } });
  return NextResponse.json({ favorites: list });
}

export async function POST(req: NextRequest) {
  const session = await requireAuth().catch(() => null);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { targetType, targetId } = await req.json();
  if (!["FARMER", "PRODUCT"].includes(targetType)) return NextResponse.json({ error: "Bad target" }, { status: 400 });

  const existing = await prisma.favorite.findFirst({ where: { userId: session.userId, targetType, targetId } });
  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    return NextResponse.json({ favorited: false });
  }
  await prisma.favorite.create({ data: { userId: session.userId, targetType, targetId } });
  return NextResponse.json({ favorited: true });
}
