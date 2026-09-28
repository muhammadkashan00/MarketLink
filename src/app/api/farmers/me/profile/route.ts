import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { farmerProfileSchema } from "@/lib/validators";

export async function PATCH(req: NextRequest) {
  try {
    const session = await requireAuth(["FARMER"]);
    const body = await req.json();
    const data = farmerProfileSchema.partial().parse(body);
    await prisma.farmerProfile.update({
      where: { userId: session.userId },
      data: {
        ...(data.stallName && { stallName: data.stallName }),
        ...(data.bio !== undefined && { bio: data.bio || null }),
        ...(data.operatingDays && { operatingDays: data.operatingDays }),
        ...(data.pickupWindowStart && { pickupWindowStart: data.pickupWindowStart }),
        ...(data.pickupWindowEnd && { pickupWindowEnd: data.pickupWindowEnd }),
        ...(data.orderCutoffHours && { orderCutoffHours: data.orderCutoffHours }),
        ...(data.latitude !== undefined && data.latitude !== null && { latitude: data.latitude }),
        ...(data.longitude !== undefined && data.longitude !== null && { longitude: data.longitude }),
        ...(data.mapAddress !== undefined && { mapAddress: data.mapAddress || null }),
        ...(data.bannerUrl !== undefined && { bannerUrl: data.bannerUrl || null }),
      },
    });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
