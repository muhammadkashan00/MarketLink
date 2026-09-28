import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StallForm } from "@/components/farmer/StallForm";

export const dynamic = "force-dynamic";

export default async function StallPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const profile = await prisma.farmerProfile.findUnique({
    where: { userId: user.id },
    include: { markets: { include: { market: true } } },
  }).catch(() => null);
  const allMarkets = await prisma.market.findMany({ orderBy: { name: "asc" } }).catch(() => []);
  if (!profile) return null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="serif-heading text-4xl text-ink-900">My stall</h1>
        <p className="mt-1 text-ink-600">Tell customers who you are and where to find you.</p>
      </div>
      <StallForm
        profile={{
          stallName: profile.stallName,
          bio: profile.bio || "",
          operatingDays: profile.operatingDays,
          pickupWindowStart: profile.pickupWindowStart,
          pickupWindowEnd: profile.pickupWindowEnd,
          orderCutoffHours: profile.orderCutoffHours,
          latitude: profile.latitude,
          longitude: profile.longitude,
          mapAddress: profile.mapAddress || "",
          bannerUrl: profile.bannerUrl || "",
        }}
        markets={JSON.parse(JSON.stringify(allMarkets))}
        registeredMarkets={profile.markets.map((m) => ({ marketId: m.marketId, stallNumber: m.stallNumber || "" }))}
      />
    </div>
  );
}
