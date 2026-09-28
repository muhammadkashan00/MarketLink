import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { farmerNavLinks } from "@/components/farmer/FarmerNav";
import { AlertTriangle } from "lucide-react";

export default async function FarmerLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirect=/farmer");
  if (user.role !== "FARMER") redirect("/");

  const unreadCount = await prisma.notification.count({
    where: { userId: user.id, isRead: false },
  }).catch(() => 0);

  return (
    <DashboardShell
      user={{ name: user.name, email: user.email, role: user.role }}
      navLinks={farmerNavLinks}
      sectionTitle="Farmer"
      notifications={unreadCount}
    >
      {user.status === "PENDING" && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-cream-300 bg-cream-100 p-4 text-cream-900">
          <AlertTriangle className="h-5 w-5" />
          <div>
            <p className="font-semibold">Awaiting admin approval</p>
            <p className="text-xs">You can explore, but customers won't see your stall until an admin approves your account.</p>
          </div>
        </div>
      )}
      {children}
    </DashboardShell>
  );
}
