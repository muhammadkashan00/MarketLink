import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { adminNavLinks } from "@/components/admin/AdminNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirect=/admin");
  if (user.role !== "ADMIN") redirect("/");

  const unreadCount = await prisma.notification.count({
    where: { userId: user.id, isRead: false },
  }).catch(() => 0);

  return (
    <DashboardShell
      user={{ name: user.name, email: user.email, role: user.role }}
      navLinks={adminNavLinks}
      sectionTitle="Admin"
      notifications={unreadCount}
    >
      {children}
    </DashboardShell>
  );
}
