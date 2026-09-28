import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { StarRating } from "@/components/ui/StarRating";
import { ReviewResponseClient } from "@/components/farmer/ReviewResponseClient";
import { timeAgo } from "@/lib/utils";
import { MessageSquare } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function FarmerReviewsPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const profile = await prisma.farmerProfile.findUnique({ where: { userId: user.id } });
  if (!profile) return null;

  const reviews = await prisma.review.findMany({
    where: { targetType: "FARMER", targetId: profile.id },
    include: { customer: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  }).catch(() => []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="serif-heading text-4xl text-ink-900">Reviews</h1>
        <p className="mt-1 text-ink-600">
          {profile.averageRating.toFixed(1)}★ average · {profile.totalReviews} total review{profile.totalReviews !== 1 ? "s" : ""}
        </p>
      </div>

      {reviews.length === 0 ? (
        <EmptyState icon={<MessageSquare className="h-8 w-8" />} title="No reviews yet" description="Complete orders will earn you reviews from customers." />
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <Card key={r.id} className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-terracotta-100 text-xs font-semibold text-terracotta-700">
                    {r.customer.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink-900">{r.customer.name}</p>
                    <p className="text-xs text-ink-500">{timeAgo(r.createdAt)}</p>
                  </div>
                </div>
                <StarRating value={r.rating} readOnly size={16} />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-700">{r.comment}</p>
              {r.farmerResponse ? (
                <div className="mt-3 rounded-xl bg-harvest-50 p-3">
                  <p className="text-xs font-semibold uppercase text-harvest-800">Your response</p>
                  <p className="mt-1 text-sm italic text-ink-700">"{r.farmerResponse}"</p>
                </div>
              ) : (
                <ReviewResponseClient reviewId={r.id} />
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
