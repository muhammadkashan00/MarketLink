import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validators";
import { hashPassword, createSession, setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = registerSchema.parse(body);

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const passwordHash = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        phone: data.phone || null,
        address: data.address || null,
        role: data.role,
        status: data.role === "FARMER" ? "PENDING" : "ACTIVE",
        farmerProfile: data.role === "FARMER"
          ? {
              create: {
                stallName: data.stallName || `${data.name}'s Stall`,
                operatingDays: ["SAT", "SUN"],
              },
            }
          : undefined,
      },
    });

    // For farmers: pending approval. Do not create session automatically.
    if (data.role === "FARMER") {
      return NextResponse.json({
        success: true,
        pending: true,
        message: "Registration submitted. Awaiting admin approval.",
      });
    }

    const token = await createSession({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });
    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("register error:", err);
    const msg = err instanceof Error ? err.message : "Registration failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
