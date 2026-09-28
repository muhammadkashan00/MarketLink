import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { timeAgo } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Bell, CheckCircle2, PackageCheck, MessageSquare, Megaphone } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const notes = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  }).catch(() => []);

  await prisma.notification.updateMany({ where: { userId: user.id, isRead: false }, data: { isRead: true } }).catch(() => {});

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="serif-heading text-4xl text-ink-900">Notifications</h1>
        <p className="mt-1 text-ink-600">Order updates, restocks and announcements — all here.</p>
      </div>

      {notes.length === 0 ? (
        <EmptyState icon={<Bell className="h-8 w-8" />} title="You're all caught up" description="We'll notify you when something new happens." />
      ) : (
        <div className="space-y-2">
          {notes.map((n) => (
            <Card key={n.id} className={`p-4 ${n.isRead ? "" : "border-harvest-300 bg-harvest-50/50"}`}>
              <div className="flex gap-3">
                <div className="rounded-xl bg-harvest-100 p-2 text-harvest-800">{iconFor(n.type)}</div>
                <div className="flex-1">
                  <p className="font-semibold text-ink-900">{n.title}</p>
                  <p className="text-sm text-ink-600">{n.message}</p>
                  <p className="mt-1 text-xs text-ink-400">{timeAgo(n.createdAt)}</p>
                </div>
                {n.link && <Link href={n.link} className="btn-ghost text-xs">Open</Link>}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function iconFor(t: string) {
  switch (t) {
    case "ORDER_PLACED":
    case "ORDER_ACCEPTED":
    case "ORDER_READY":
    case "ORDER_COMPLETED":
      return <PackageCheck className="h-4 w-4" />;
    case "REVIEW_RECEIVED": return <MessageSquare className="h-4 w-4" />;
    case "ANNOUNCEMENT": return <Megaphone className="h-4 w-4" />;
    default: return <CheckCircle2 className="h-4 w-4" />;
  }
}
