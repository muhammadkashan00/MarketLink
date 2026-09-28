import { getCurrentUser } from "@/lib/auth";
import { ProfileFormClient } from "@/components/customer/ProfileFormClient";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) return null;
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="serif-heading text-4xl text-ink-900">Profile</h1>
      <p className="mt-1 text-ink-600">Keep your details fresh so farmers can find you at pickup.</p>
      <div className="mt-8">
        <ProfileFormClient user={{ name: user.name, email: user.email, phone: user.phone, address: user.address }} />
      </div>
    </div>
  );
}
