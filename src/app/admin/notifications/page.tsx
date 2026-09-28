import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { timeAgo } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Bell } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminNotificationsPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const notes = await prisma.notification.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 50 }).catch(() => []);
  await prisma.notification.updateMany({ where: { userId: user.id, isRead: false }, data: { isRead: true } }).catch(() => {});

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="serif-heading text-4xl text-ink-900">Notifications</h1>
      {notes.length === 0 ? (
        <EmptyState icon={<Bell className="h-8 w-8" />} title="You're caught up" />
      ) : (
        <div className="space-y-2">
          {notes.map((n) => (
            <Card key={n.id} className="p-4">
              <p className="font-semibold text-ink-900">{n.title}</p>
              <p className="text-sm text-ink-700">{n.message}</p>
              <p className="mt-1 text-xs text-ink-400">{timeAgo(n.createdAt)}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
