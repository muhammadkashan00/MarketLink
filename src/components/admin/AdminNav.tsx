import type { NavLinkConfig } from "@/components/layout/DashboardShell";

export const adminNavLinks: NavLinkConfig[] = [
  { href: "/admin", label: "Overview", icon: "Home" },
  { href: "/admin/farmers", label: "Farmers", icon: "Sprout" },
  { href: "/admin/customers", label: "Customers", icon: "Users" },
  { href: "/admin/markets", label: "Markets", icon: "MapPin" },
  { href: "/admin/categories", label: "Categories", icon: "Tag" },
  { href: "/admin/reviews", label: "Moderation", icon: "MessageSquare" },
  { href: "/admin/reports", label: "Reports", icon: "BarChart3" },
  { href: "/admin/announcements", label: "Announcements", icon: "Megaphone" },
  { href: "/admin/notifications", label: "Notifications", icon: "Bell" },
];
