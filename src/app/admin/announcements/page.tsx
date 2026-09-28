import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AnnouncementForm } from "@/components/admin/AnnouncementForm";
import { Card } from "@/components/ui/Card";
import { timeAgo } from "@/lib/utils";
import { Megaphone } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AnnouncementsPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const list = await prisma.announcement.findMany({
    include: { admin: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  }).catch(() => []);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="serif-heading text-4xl text-ink-900">Announcements</h1>
        <p className="mt-1 text-ink-600">Broadcast messages to the community.</p>
      </div>
      <AnnouncementForm />
      <div className="space-y-3">
        {list.map((a) => (
          <Card key={a.id} className="p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-terracotta-100 p-2 text-terracotta-700"><Megaphone className="h-4 w-4" /></div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="serif-heading text-lg text-ink-900">{a.title}</p>
                  <span className="badge bg-cream-100 text-ink-700">{a.audience}</span>
                </div>
                <p className="mt-1 text-sm text-ink-700">{a.body}</p>
                <p className="mt-2 text-xs text-ink-500">By {a.admin.name} · {timeAgo(a.createdAt)}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
