import { z } from "zod";

// ============ AUTH ============
export const registerSchema = z.object({
  name: z.string().min(2, "Name too short").max(60),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be 6+ characters"),
  phone: z.string().min(7).optional().or(z.literal("")),
  address: z.string().min(3).optional().or(z.literal("")),
  role: z.enum(["CUSTOMER", "FARMER"]),
  stallName: z.string().min(2).optional().or(z.literal("")),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// ============ PRODUCT ============
export const productSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional().or(z.literal("")),
  categoryId: z.string().min(1),
  price: z.number().positive(),
  unit: z.string().default("kg"),
  stock: z.number().int().nonnegative(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  isRecurring: z.boolean().default(false),
});

// ============ ORDER ============
export const orderItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
});

export const placeOrderSchema = z.object({
  farmerId: z.string(),
  marketId: z.string().optional().nullable(),
  items: z.array(orderItemSchema).min(1, "Cart cannot be empty"),
  pickupDate: z.string(),
  pickupSlot: z.string(),
  notes: z.string().max(300).optional().or(z.literal("")),
});

// ============ FARMER PROFILE ============
export const farmerProfileSchema = z.object({
  stallName: z.string().min(2).max(80),
  bio: z.string().max(500).optional().or(z.literal("")),
  operatingDays: z.array(z.enum(["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"])),
  pickupWindowStart: z.string(),
  pickupWindowEnd: z.string(),
  orderCutoffHours: z.number().int().min(1).max(72),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  mapAddress: z.string().optional().or(z.literal("")),
  bannerUrl: z.string().url().optional().or(z.literal("")),
});

// ============ MARKET ============
export const marketSchema = z.object({
  name: z.string().min(2).max(80),
  address: z.string().min(3),
  city: z.string().min(2),
  operatingDays: z.array(z.enum(["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"])),
  startTime: z.string(),
  endTime: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  description: z.string().max(500).optional().or(z.literal("")),
});

// ============ REVIEW ============
export const reviewSchema = z.object({
  targetType: z.enum(["FARMER", "PRODUCT"]),
  targetId: z.string(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(5).max(500),
});
