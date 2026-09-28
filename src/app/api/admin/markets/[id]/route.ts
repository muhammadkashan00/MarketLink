import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireAuth(["ADMIN"]);
  const body = await req.json();
  await prisma.market.update({ where: { id }, data: body });
  return NextResponse.json({ success: true });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireAuth(["ADMIN"]);
  await prisma.market.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
