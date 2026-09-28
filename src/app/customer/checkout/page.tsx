import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CheckoutClient } from "@/components/customer/CheckoutClient";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirect=/customer/checkout");

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="serif-heading text-4xl text-ink-900">Checkout</h1>
      <p className="mt-1 text-ink-600">Pick a date, choose a slot, and reserve your harvest.</p>
      <div className="mt-8">
        <CheckoutClient />
      </div>
    </div>
  );
}
