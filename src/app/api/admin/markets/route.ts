import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { marketSchema } from "@/lib/validators";

export async function POST(req: NextRequest) {
  try {
    await requireAuth(["ADMIN"]);
    const body = await req.json();
    const data = marketSchema.parse(body);
    const market = await prisma.market.create({ data: {
      name: data.name, address: data.address, city: data.city,
      operatingDays: data.operatingDays, startTime: data.startTime, endTime: data.endTime,
      latitude: data.latitude, longitude: data.longitude,
      imageUrl: data.imageUrl || null, description: data.description || null,
    }});
    return NextResponse.json({ success: true, marketId: market.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
