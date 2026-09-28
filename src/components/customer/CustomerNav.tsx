import type { NavLinkConfig } from "@/components/layout/DashboardShell";

export const customerNavLinks: NavLinkConfig[] = [
  { href: "/customer", label: "Overview", icon: "Home" },
  { href: "/customer/browse", label: "Browse markets", icon: "MapPin" },
  { href: "/customer/cart", label: "My basket", icon: "ShoppingBasket" },
  { href: "/customer/orders", label: "My orders", icon: "PackageCheck" },
  { href: "/customer/favorites", label: "Favorites", icon: "Heart" },
  { href: "/customer/notifications", label: "Notifications", icon: "Bell" },
  { href: "/customer/profile", label: "Profile", icon: "User" },
  { href: "/customer/help", label: "Help & chat", icon: "MessagesSquare" },
];
