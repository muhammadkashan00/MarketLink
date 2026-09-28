import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const links = await prisma.farmerMarketLink.findMany({
    where: { farmerId: id },
    include: { market: { select: { id: true, name: true } } },
  }).catch(() => []);
  return NextResponse.json({ markets: links.map((l) => l.market) });
}
