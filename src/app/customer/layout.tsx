import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { customerNavLinks } from "@/components/customer/CustomerNav";

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirect=/customer");
  if (user.role !== "CUSTOMER") redirect("/");

  const unreadCount = await prisma.notification.count({
    where: { userId: user.id, isRead: false },
  }).catch(() => 0);

  return (
    <DashboardShell
      user={{ name: user.name, email: user.email, role: user.role }}
      navLinks={customerNavLinks}
      sectionTitle="Customer"
      notifications={unreadCount}
    >
      {children}
    </DashboardShell>
  );
}
