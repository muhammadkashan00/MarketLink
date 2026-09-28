export type NavItem = {
  href: string;
  label: string;
  icon?: React.ReactNode;
};

export type StatCard = {
  label: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  color?: string;
};

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  unit: string;
  imageUrl?: string;
  quantity: number;
  stock: number;
  farmerId: string;
  farmerName: string;
};
