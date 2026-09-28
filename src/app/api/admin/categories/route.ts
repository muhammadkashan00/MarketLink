import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function POST(req: NextRequest) {
  await requireAuth(["ADMIN"]);
  const { name, icon } = await req.json();
  if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });
  const cat = await prisma.category.create({ data: { name, slug: slugify(name), icon: icon || null } });
  return NextResponse.json({ success: true, category: cat });
}
