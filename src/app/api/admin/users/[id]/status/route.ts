import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await requireAuth(["ADMIN"]);
    const { status } = await req.json();
    if (!["ACTIVE", "SUSPENDED", "PENDING"].includes(status)) {
      return NextResponse.json({ error: "Bad status" }, { status: 400 });
    }
    const user = await prisma.user.update({ where: { id }, data: { status } });
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: status === "ACTIVE" ? "ACCOUNT_APPROVED" : "ACCOUNT_SUSPENDED",
        title: status === "ACTIVE" ? "Your account was approved" : "Your account was suspended",
        message: status === "ACTIVE"
          ? "You can now start using MarketLink fully."
          : "Contact support for details.",
      },
    });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
