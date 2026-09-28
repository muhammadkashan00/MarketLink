import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    await requireAuth();
    const { imageBase64, folder } = await req.json();
    if (!imageBase64) return NextResponse.json({ error: "No image" }, { status: 400 });
    const url = await uploadImage(imageBase64, folder || "marketlink/products");
    return NextResponse.json({ url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Upload failed" }, { status: 400 });
  }
}
