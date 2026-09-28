import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { StarRating } from "@/components/ui/StarRating";
import { DeleteReviewClient } from "@/components/admin/DeleteReviewClient";
import { timeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const reviews = await prisma.review.findMany({
    include: { customer: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" }, take: 100,
  }).catch(() => []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="serif-heading text-4xl text-ink-900">Review moderation</h1>
        <p className="mt-1 text-ink-600">Remove inappropriate content that violates guidelines.</p>
      </div>
      <div className="space-y-3">
        {reviews.map((r) => (
          <Card key={r.id} className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-ink-900">{r.customer.name} <span className="text-xs font-normal text-ink-500">({r.customer.email})</span></p>
                <p className="text-xs text-ink-500">
                  <span className="badge bg-cream-100 text-ink-700">{r.targetType}</span>
                  {" "}· {timeAgo(r.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <StarRating value={r.rating} readOnly size={14} />
                <DeleteReviewClient reviewId={r.id} />
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-700">{r.comment}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
