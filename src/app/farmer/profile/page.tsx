import { getCurrentUser } from "@/lib/auth";
import { ProfileFormClient } from "@/components/customer/ProfileFormClient";

export const dynamic = "force-dynamic";

export default async function FarmerProfilePage() {
  const user = await getCurrentUser();
  if (!user) return null;
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="serif-heading text-4xl text-ink-900">Personal profile</h1>
      <p className="mt-1 text-ink-600">Your personal details. For stall/business info, use <a href="/farmer/stall" className="font-semibold text-harvest-800 hover:underline">My stall</a>.</p>
      <div className="mt-8">
        <ProfileFormClient user={{ name: user.name, email: user.email, phone: user.phone, address: user.address }} />
      </div>
    </div>
  );
}
