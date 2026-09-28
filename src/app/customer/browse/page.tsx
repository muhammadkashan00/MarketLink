import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MapPin } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CustomerBrowsePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  // Just redirect them into the public /markets explorer; they can filter/find markets there
  redirect("/markets");
  return null;
}
