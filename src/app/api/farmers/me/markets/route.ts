import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await requireAuth(["FARMER"]);
  const { marketId, stallNumber } = await req.json();
  const profile = await prisma.farmerProfile.findUnique({ where: { userId: session.userId } });
  if (!profile) return NextResponse.json({ error: "No profile" }, { status: 400 });
  const link = await prisma.farmerMarketLink.upsert({
    where: { farmerId_marketId: { farmerId: profile.id, marketId } },
    update: { stallNumber: stallNumber || null },
    create: { farmerId: profile.id, marketId, stallNumber: stallNumber || null },
  });
  return NextResponse.json({ success: true, id: link.id });
}

export async function DELETE(req: NextRequest) {
  const session = await requireAuth(["FARMER"]);
  const { searchParams } = new URL(req.url);
  const marketId = searchParams.get("marketId");
  if (!marketId) return NextResponse.json({ error: "marketId required" }, { status: 400 });
  const profile = await prisma.farmerProfile.findUnique({ where: { userId: session.userId } });
  if (!profile) return NextResponse.json({ error: "No profile" }, { status: 400 });
  await prisma.farmerMarketLink.delete({ where: { farmerId_marketId: { farmerId: profile.id, marketId } } });
  return NextResponse.json({ success: true });
}
