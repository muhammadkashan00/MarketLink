import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await requireAuth(["ADMIN"]);
  const { title, body, audience } = await req.json();
  const a = await prisma.announcement.create({
    data: { createdBy: session.userId, title, body, audience: audience || "ALL" },
  });
  // Fan out notifications
  const users = await prisma.user.findMany({
    where: audience === "CUSTOMERS" ? { role: "CUSTOMER" } : audience === "FARMERS" ? { role: "FARMER" } : {},
    select: { id: true },
  });
  await prisma.notification.createMany({
    data: users.map((u) => ({
      userId: u.id, type: "ANNOUNCEMENT", title, message: body,
    })),
  });
  return NextResponse.json({ success: true, id: a.id });
}
