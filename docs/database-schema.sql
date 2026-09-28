-- MarketLink Database Schema (PostgreSQL)
-- Generated for TechWiz 7 · End-to-End Web Solutions
-- Use `npx prisma db push` to auto-apply the Prisma schema; this file is a human-readable reference.

-- ============ ENUMS ============
CREATE TYPE "Role" AS ENUM ('CUSTOMER', 'FARMER', 'ADMIN');
CREATE TYPE "UserStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED');
CREATE TYPE "OrderStatus" AS ENUM ('PLACED', 'ACCEPTED', 'READY', 'COMPLETED', 'CANCELLED', 'DECLINED');
CREATE TYPE "FavoriteType" AS ENUM ('FARMER', 'PRODUCT');
CREATE TYPE "ReviewTarget" AS ENUM ('FARMER', 'PRODUCT');
CREATE TYPE "NotificationType" AS ENUM (
  'ORDER_PLACED', 'ORDER_ACCEPTED', 'ORDER_READY', 'ORDER_COMPLETED',
  'ORDER_CANCELLED', 'REVIEW_RECEIVED', 'RESTOCK_ALERT', 'ANNOUNCEMENT',
  'ACCOUNT_APPROVED', 'ACCOUNT_SUSPENDED'
);

-- ============ USERS ============
CREATE TABLE "User" (
  "id"           TEXT PRIMARY KEY,
  "name"         TEXT NOT NULL,
  "email"        TEXT UNIQUE NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "phone"        TEXT,
  "address"      TEXT,
  "role"         "Role" NOT NULL,
  "status"       "UserStatus" NOT NULL DEFAULT 'ACTIVE',
  "avatarUrl"    TEXT,
  "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"    TIMESTAMP(3) NOT NULL
);
CREATE INDEX "User_email_idx"  ON "User"("email");
CREATE INDEX "User_role_idx"   ON "User"("role");
CREATE INDEX "User_status_idx" ON "User"("status");

-- ============ FARMER PROFILE ============
CREATE TABLE "FarmerProfile" (
  "id"                 TEXT PRIMARY KEY,
  "userId"             TEXT UNIQUE NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "stallName"          TEXT NOT NULL,
  "bio"                TEXT,
  "bannerUrl"          TEXT,
  "operatingDays"      TEXT[] NOT NULL DEFAULT '{}',
  "pickupWindowStart"  TEXT NOT NULL DEFAULT '08:00',
  "pickupWindowEnd"    TEXT NOT NULL DEFAULT '14:00',
  "orderCutoffHours"   INTEGER NOT NULL DEFAULT 12,
  "latitude"           DOUBLE PRECISION,
  "longitude"          DOUBLE PRECISION,
  "mapAddress"         TEXT,
  "averageRating"      DOUBLE PRECISION NOT NULL DEFAULT 0,
  "totalReviews"       INTEGER NOT NULL DEFAULT 0,
  "createdAt"          TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"          TIMESTAMP(3) NOT NULL
);
CREATE INDEX "FarmerProfile_stallName_idx" ON "FarmerProfile"("stallName");

-- ============ MARKETS ============
CREATE TABLE "Market" (
  "id"             TEXT PRIMARY KEY,
  "name"           TEXT NOT NULL,
  "address"        TEXT NOT NULL,
  "city"           TEXT NOT NULL,
  "operatingDays"  TEXT[] NOT NULL DEFAULT '{}',
  "startTime"      TEXT NOT NULL DEFAULT '07:00',
  "endTime"        TEXT NOT NULL DEFAULT '13:00',
  "latitude"       DOUBLE PRECISION NOT NULL,
  "longitude"      DOUBLE PRECISION NOT NULL,
  "imageUrl"       TEXT,
  "description"    TEXT,
  "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"      TIMESTAMP(3) NOT NULL
);
CREATE INDEX "Market_city_idx" ON "Market"("city");
CREATE INDEX "Market_name_idx" ON "Market"("name");

CREATE TABLE "FarmerMarketLink" (
  "id"          TEXT PRIMARY KEY,
  "farmerId"    TEXT NOT NULL REFERENCES "FarmerProfile"("id") ON DELETE CASCADE,
  "marketId"    TEXT NOT NULL REFERENCES "Market"("id") ON DELETE CASCADE,
  "stallNumber" TEXT,
  UNIQUE("farmerId", "marketId")
);
CREATE INDEX "FarmerMarketLink_farmerId_idx" ON "FarmerMarketLink"("farmerId");
CREATE INDEX "FarmerMarketLink_marketId_idx" ON "FarmerMarketLink"("marketId");

-- ============ CATEGORIES ============
CREATE TABLE "Category" (
  "id"        TEXT PRIMARY KEY,
  "name"      TEXT UNIQUE NOT NULL,
  "slug"      TEXT UNIQUE NOT NULL,
  "icon"      TEXT,
  "sortOrder" INTEGER NOT NULL DEFAULT 0
);

-- ============ PRODUCTS ============
CREATE TABLE "Product" (
  "id"            TEXT PRIMARY KEY,
  "farmerId"      TEXT NOT NULL REFERENCES "FarmerProfile"("id") ON DELETE CASCADE,
  "categoryId"    TEXT NOT NULL REFERENCES "Category"("id"),
  "name"          TEXT NOT NULL,
  "description"   TEXT,
  "price"         DECIMAL(10, 2) NOT NULL,
  "unit"          TEXT NOT NULL DEFAULT 'kg',
  "stock"         INTEGER NOT NULL DEFAULT 0,
  "imageUrl"      TEXT,
  "isAvailable"   BOOLEAN NOT NULL DEFAULT true,
  "isSoldOut"     BOOLEAN NOT NULL DEFAULT false,
  "isRecurring"   BOOLEAN NOT NULL DEFAULT false,
  "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "totalReviews"  INTEGER NOT NULL DEFAULT 0,
  "totalSold"     INTEGER NOT NULL DEFAULT 0,
  "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"     TIMESTAMP(3) NOT NULL
);
CREATE INDEX "Product_farmerId_idx"    ON "Product"("farmerId");
CREATE INDEX "Product_categoryId_idx"  ON "Product"("categoryId");
CREATE INDEX "Product_isAvailable_idx" ON "Product"("isAvailable");
CREATE INDEX "Product_name_idx"        ON "Product"("name");

-- ============ ORDERS ============
CREATE TABLE "Order" (
  "id"           TEXT PRIMARY KEY,
  "orderNumber"  TEXT UNIQUE NOT NULL,
  "customerId"   TEXT NOT NULL REFERENCES "User"("id"),
  "farmerId"     TEXT NOT NULL REFERENCES "FarmerProfile"("id"),
  "marketId"     TEXT REFERENCES "Market"("id"),
  "status"       "OrderStatus" NOT NULL DEFAULT 'PLACED',
  "pickupDate"   TIMESTAMP(3) NOT NULL,
  "pickupSlot"   TEXT NOT NULL,
  "notes"        TEXT,
  "totalAmount"  DECIMAL(10, 2) NOT NULL,
  "cancelReason" TEXT,
  "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"    TIMESTAMP(3) NOT NULL
);
CREATE INDEX "Order_customerId_idx"  ON "Order"("customerId");
CREATE INDEX "Order_farmerId_idx"    ON "Order"("farmerId");
CREATE INDEX "Order_status_idx"      ON "Order"("status");
CREATE INDEX "Order_pickupDate_idx"  ON "Order"("pickupDate");

CREATE TABLE "OrderItem" (
  "id"              TEXT PRIMARY KEY,
  "orderId"         TEXT NOT NULL REFERENCES "Order"("id") ON DELETE CASCADE,
  "productId"       TEXT NOT NULL REFERENCES "Product"("id"),
  "productName"     TEXT NOT NULL,
  "quantity"        INTEGER NOT NULL,
  "priceAtPurchase" DECIMAL(10, 2) NOT NULL,
  "subtotal"        DECIMAL(10, 2) NOT NULL
);
CREATE INDEX "OrderItem_orderId_idx"   ON "OrderItem"("orderId");
CREATE INDEX "OrderItem_productId_idx" ON "OrderItem"("productId");

-- ============ REVIEWS ============
CREATE TABLE "Review" (
  "id"             TEXT PRIMARY KEY,
  "customerId"     TEXT NOT NULL REFERENCES "User"("id"),
  "targetType"     "ReviewTarget" NOT NULL,
  "targetId"       TEXT NOT NULL,
  "rating"         INTEGER NOT NULL CHECK ("rating" >= 1 AND "rating" <= 5),
  "comment"        TEXT NOT NULL,
  "farmerResponse" TEXT,
  "respondedAt"    TIMESTAMP(3),
  "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"      TIMESTAMP(3) NOT NULL
);
CREATE INDEX "Review_target_idx"     ON "Review"("targetType", "targetId");
CREATE INDEX "Review_customerId_idx" ON "Review"("customerId");

-- ============ FAVORITES ============
CREATE TABLE "Favorite" (
  "id"         TEXT PRIMARY KEY,
  "userId"     TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "targetType" "FavoriteType" NOT NULL,
  "targetId"   TEXT NOT NULL,
  UNIQUE("userId", "targetType", "targetId")
);
CREATE INDEX "Favorite_userId_idx" ON "Favorite"("userId");

-- ============ NOTIFICATIONS ============
CREATE TABLE "Notification" (
  "id"        TEXT PRIMARY KEY,
  "userId"    TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "type"      "NotificationType" NOT NULL,
  "title"     TEXT NOT NULL,
  "message"   TEXT NOT NULL,
  "link"      TEXT,
  "isRead"    BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "Notification_user_read_idx" ON "Notification"("userId", "isRead");
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- ============ ADMIN ============
CREATE TABLE "Announcement" (
  "id"        TEXT PRIMARY KEY,
  "createdBy" TEXT NOT NULL REFERENCES "User"("id"),
  "title"     TEXT NOT NULL,
  "body"      TEXT NOT NULL,
  "audience"  TEXT NOT NULL DEFAULT 'ALL',
  "isPinned"  BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);
CREATE INDEX "Announcement_audience_idx" ON "Announcement"("audience");

CREATE TABLE "Report" (
  "id"          TEXT PRIMARY KEY,
  "generatedBy" TEXT NOT NULL REFERENCES "User"("id"),
  "reportType"  TEXT NOT NULL,
  "data"        JSONB NOT NULL,
  "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "AuditLog" (
  "id"        TEXT PRIMARY KEY,
  "actorId"   TEXT,
  "action"    TEXT NOT NULL,
  "target"    TEXT NOT NULL,
  "metadata"  JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- End of schema
