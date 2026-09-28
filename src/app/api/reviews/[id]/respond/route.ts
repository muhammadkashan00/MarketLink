import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await requireAuth(["FARMER"]);
    const { response } = await req.json();
    if (!response || response.length < 3) return NextResponse.json({ error: "Response too short" }, { status: 400 });

    const review = await prisma.review.findUnique({ where: { id } });
    if (!review || review.targetType !== "FARMER") return NextResponse.json({ error: "Not found" }, { status: 404 });

    const farmer = await prisma.farmerProfile.findUnique({ where: { id: review.targetId } });
    if (!farmer || farmer.userId !== session.userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await prisma.review.update({ where: { id }, data: { farmerResponse: response, respondedAt: new Date() } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
