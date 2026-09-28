import type { NavLinkConfig } from "@/components/layout/DashboardShell";

export const farmerNavLinks: NavLinkConfig[] = [
  { href: "/farmer", label: "Overview", icon: "Home" },
  { href: "/farmer/products", label: "Products", icon: "Package" },
  { href: "/farmer/orders", label: "Orders", icon: "PackageCheck" },
  { href: "/farmer/reviews", label: "Reviews", icon: "MessageSquare" },
  { href: "/farmer/stall", label: "My stall", icon: "Store" },
  { href: "/farmer/insights", label: "Insights", icon: "BarChart3" },
  { href: "/farmer/notifications", label: "Notifications", icon: "Bell" },
  { href: "/farmer/profile", label: "Profile", icon: "User" },
];
