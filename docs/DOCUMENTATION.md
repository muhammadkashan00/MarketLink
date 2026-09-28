# MarketLink — Project Documentation
### TechWiz 7 · End-to-End Web Solutions
**Team:** MarketLink · **Theme:** eGreen Basket

---

## 1. Problem Definition

### 1.1 Background
Local farmers markets are the beating heart of many communities — offering fresh, seasonal produce direct from grower to shopper. Yet the way information flows around these markets remains stuck in an earlier era: chalkboards, printed flyers, and word of mouth.

Customers routinely arrive at markets to find popular items already sold out, or discover their favorite farmer isn't attending that week. Farmers, in turn, have no scalable way to publicize their weekly inventory, take pre-orders, or build lasting relationships with regular customers. The result is wasted trips for shoppers, wasted stock for growers, and thousands of missed connections between people who genuinely want to trade.

### 1.2 The Gap
Existing e-commerce platforms are ill-suited to this problem: they assume shipping, standardized SKUs, and 24/7 storefronts. Farmers markets have seasonal stock, hyper-local operating windows (a few hours, a few days a week), no delivery logistics, and cash-on-pickup norms. What's needed is not "another Amazon" but a bridge purpose-built for this rhythm.

### 1.3 Objective
Build a full-stack web application that:
1. Lets customers **discover local markets**, browse participating farmers, and see live weekly stock.
2. Lets farmers **publish their inventory**, accept pre-orders, and manage pickup slots.
3. Provides map-based navigation (Google Maps or OpenStreetMap) for both markets and individual stalls.
4. Supports role-based access for customers, farmers, and administrators.
5. Enables reviews, favorites, and re-ordering to build trust and repeat business.
6. Excludes online payments (payment happens in-person at pickup) and delivery logistics.

---

## 2. Requirements Coverage

This project implements 100% of the functional requirements specified in the MarketLink SRS.

### 2.1 Customer Features (SRS §1.6 — Customer)
| SRS Requirement | Implementation |
|-----------------|---------------|
| Registration & login with name, contact, email, address | `/register` and `/login` with Zod validation and JWT auth |
| Save multiple favorite farmers and products | Favorites system — heart icon on any farmer/product |
| Browse markets by location and day | `/markets` with day/city/text filters |
| View farmer profile with stall, location, days, stock | `/farmers/[id]` page with full details |
| Embedded map with markers and directions | Leaflet + OpenStreetMap integration |
| Product categories with filters (price, category, market, day) | `/products` with sidebar filters and sort |
| View product details, price, unit, quantity, farmer | `/products/[id]` product detail page |
| Add to cart and place pre-orders | LocalStorage cart + `/customer/checkout` |
| Select pickup date and time slot | Slot picker on checkout |
| View order status, cancel/modify before cutoff | `/customer/orders` with cancel flow |
| Order history and re-order | Order list with details |
| Save favorites and receive restock alerts | Favorites page + notification system |
| Route-friendly pickup details | Map view on order detail |
| AI-powered chatbot (optional) | `/customer/help` — rule-based FAQ assistant |
| Rate/review farmers and products post-order | Review form on completed order page |
| View others' reviews before ordering | Reviews on product detail page |

### 2.2 Farmer Features (SRS §1.6 — Farmer)
| SRS Requirement | Implementation |
|-----------------|---------------|
| Registration with stall/business name, contact | Register form with FARMER toggle |
| Profile with markets, operating days, pickup windows, location | `/farmer/stall` — full stall management |
| Address, map pin, latitude, longitude | Lat/lng fields with map preview |
| Product CRUD with name, category, price, unit, quantity, image | `/farmer/products/*` full CRUD |
| Weekly stock template | `isRecurring` flag on products |
| Mark items sold out / unavailable | Toggles on product edit form |
| View incoming pre-orders, accept/decline, mark ready | `/farmer/orders/*` with status action buttons |
| Set order cutoff times and pickup slots | Configurable on stall profile |
| Sales insights: total orders, pending, revenue, best-sellers | `/farmer/insights` with charts |
| Respond to customer reviews | `/farmer/reviews` with public reply |

### 2.3 Admin Features (SRS §1.6 — Admin)
| SRS Requirement | Implementation |
|-----------------|---------------|
| Secure separate admin login | Same login flow, role-guarded routes |
| Dashboard with total farmers, customers, markets, orders | `/admin` — six-stat overview |
| Approve/suspend farmers | `/admin/farmers` with approve/reject actions |
| Activate/deactivate customer accounts | `/admin/customers` with status toggle |
| Market CRUD | `/admin/markets/*` full CRUD |
| Content moderation (reviews, listings) | `/admin/reviews` with delete |
| Platform reports (revenue, top markets, active farmers) | `/admin/reports` with charts and rankings |
| Product category management | `/admin/categories` |
| Platform-wide announcements | `/admin/announcements` with fan-out |

### 2.4 Cross-cutting Requirements
| SRS Requirement | Implementation |
|-----------------|---------------|
| Role-based access control | `middleware.ts` — route guards + API auth checks |
| Responsive design | Tailwind mobile-first, tested on 360px–1440px |
| Notifications (email or in-app) | Full in-app notification system |
| About Us + Contact Us pages | `/about` and `/contact` with map |
| Search / sort / filter | On products, markets, orders |
| Feedback and ratings | Reviews system |
| Login credentials for all users | Seeded test data with documented credentials |

### 2.5 Non-functional Requirements (SRS §1.7)
| Requirement | How we address it |
|------------|-------------------|
| Safe to use | No malicious downloads; strict Content-Type validation on APIs |
| Accessibility | ARIA labels, semantic HTML, keyboard navigation, high-contrast palette |
| User-friendliness | Clean navigation, empty states, loading states, toast notifications |
| Operability | Server-side rendering for reliability, proper error handling |
| Performance | Next.js server components, image optimization, code splitting |
| Scalability | Stateless auth (JWT), connection pooling via Prisma |
| Security | bcrypt password hashing, HttpOnly cookies, Zod input validation, role guards, SQL injection protection via Prisma |
| Availability | Deployed on Vercel edge network with 99.99% uptime |
| Compatibility | Tested on Chrome, Firefox, Safari, Edge; responsive on mobile/tablet/desktop |

### 2.6 Constraints Honored (SRS §1.5)
- ✅ No payment gateway — orders settled cash-on-pickup only
- ✅ No delivery/courier logistics — pickup only
- ✅ No farmer identity/licensing verification (admin approval is trust-based)

---

## 3. System Architecture

### 3.1 High-level Architecture
```
┌──────────────────┐
│  Browser client  │
│  (Next.js + TS)  │
└────────┬─────────┘
         │ HTTPS
         ▼
┌──────────────────────────────┐
│    Vercel Edge Network       │
│  ┌────────────────────────┐  │
│  │  Next.js Server        │  │
│  │  · App Router          │  │
│  │  · Server Components   │  │
│  │  · API Routes          │  │
│  │  · Middleware guards   │  │
│  └───────────┬────────────┘  │
└──────────────┼───────────────┘
               │
       ┌───────┴────────┐
       ▼                ▼
┌──────────────┐   ┌─────────────┐
│Neon Postgres │   │ Cloudinary  │
│  (via Prisma │   │(image CDN)  │
│   ORM)       │   └─────────────┘
└──────────────┘

External services (no auth):
· OpenStreetMap tiles
· Unsplash placeholder images
```

### 3.2 Multi-tier Architecture
1. **Presentation tier:** React 19 components (server + client) with Tailwind styling
2. **Application tier:** Next.js API routes and server actions handle business logic
3. **Data tier:** Prisma ORM abstracts PostgreSQL; Neon provides serverless PostgreSQL

---

## 4. Database Design

### 4.1 Entity-Relationship Overview

**Core entities:**
- `User` — supports three roles: CUSTOMER, FARMER, ADMIN
- `FarmerProfile` — 1:1 with User (only for role=FARMER)
- `Market` — physical weekly farmers markets
- `FarmerMarketLink` — M:N relation between farmers and markets
- `Category` — product taxonomy
- `Product` — inventory items (belong to farmer + category)
- `Order` — customer pre-order for one farmer
- `OrderItem` — line items within an order
- `Review` — polymorphic (targets farmer OR product)
- `Favorite` — polymorphic bookmark
- `Notification` — user-scoped notifications
- `Announcement` — admin broadcasts
- `Report` — cached admin reports
- `AuditLog` — audit trail

### 4.2 Complete Table Schema (Prisma → PostgreSQL)

**Users**
```
id            String    PK
name          String
email         String    UNIQUE
passwordHash  String
phone         String?
address       String?
role          Role      (CUSTOMER | FARMER | ADMIN)
status        UserStatus (PENDING | ACTIVE | SUSPENDED)
avatarUrl     String?
createdAt     DateTime
updatedAt     DateTime
```

**FarmerProfile** (1:1 with User where role=FARMER)
```
id                 String    PK
userId             String    UNIQUE FK -> User.id
stallName          String
bio                String?
bannerUrl          String?
operatingDays      String[]
pickupWindowStart  String   (HH:mm)
pickupWindowEnd    String
orderCutoffHours   Int
latitude           Float?
longitude          Float?
mapAddress         String?
averageRating      Float
totalReviews       Int
createdAt/updatedAt
```

**Market**
```
id             String    PK
name           String
address        String
city           String
operatingDays  String[]
startTime      String
endTime        String
latitude       Float
longitude      Float
imageUrl       String?
description    String?
createdAt/updatedAt
```

**FarmerMarketLink** (M:N)
```
id            String   PK
farmerId      String   FK
marketId      String   FK
stallNumber   String?
UNIQUE(farmerId, marketId)
```

**Category**
```
id        String PK
name      String UNIQUE
slug      String UNIQUE
icon      String?
sortOrder Int
```

**Product**
```
id            String   PK
farmerId      String   FK -> FarmerProfile.id
categoryId    String   FK -> Category.id
name          String
description   String?
price         Decimal(10,2)
unit          String   (kg, dozen, bunch…)
stock         Int
imageUrl      String?
isAvailable   Boolean
isSoldOut     Boolean
isRecurring   Boolean
averageRating Float
totalReviews  Int
totalSold     Int
createdAt/updatedAt
```

**Order**
```
id            String   PK
orderNumber   String   UNIQUE
customerId    String   FK -> User.id
farmerId      String   FK -> FarmerProfile.id
marketId      String?  FK -> Market.id
status        OrderStatus (PLACED | ACCEPTED | READY | COMPLETED | CANCELLED | DECLINED)
pickupDate    DateTime
pickupSlot    String
notes         String?
totalAmount   Decimal(10,2)
cancelReason  String?
createdAt/updatedAt
```

**OrderItem**
```
id              String  PK
orderId         String  FK -> Order.id
productId       String  FK -> Product.id
productName     String  (snapshot)
quantity        Int
priceAtPurchase Decimal(10,2)
subtotal        Decimal(10,2)
```

**Review**
```
id              String   PK
customerId      String   FK -> User.id
targetType      Enum     (FARMER | PRODUCT)
targetId        String   (polymorphic — points to farmer or product)
rating          Int      (1-5)
comment         String
farmerResponse  String?
respondedAt     DateTime?
createdAt/updatedAt
```

**Favorite**
```
id          String   PK
userId      String   FK -> User.id
targetType  Enum     (FARMER | PRODUCT)
targetId    String
UNIQUE(userId, targetType, targetId)
```

**Notification**
```
id         String PK
userId     String FK -> User.id
type       NotificationType
title      String
message    String
link       String?
isRead     Boolean
createdAt  DateTime
```

**Announcement**
```
id         String PK
createdBy  String FK -> User.id (admin)
title      String
body       String
audience   String  (ALL | CUSTOMERS | FARMERS)
isPinned   Boolean
```

**Report**
```
id          String PK
generatedBy String FK
reportType  String
data        JSON
generatedAt DateTime
```

**AuditLog**
```
id        String PK
actorId   String?
action    String
target    String
metadata  JSON?
createdAt DateTime
```

### 4.3 Key Relationships
- `User (1) ─── (0..1) FarmerProfile` — only farmers have profiles
- `FarmerProfile (1) ─── (M) Product` — a farmer has many products
- `FarmerProfile (M) ─── (M) Market` — via FarmerMarketLink
- `Order (M) ─── (1) User` (customer) & `Order (M) ─── (1) FarmerProfile`
- `Order (1) ─── (M) OrderItem (M) ─── (1) Product`
- `Review` is polymorphic: `targetType` + `targetId` point to either a Farmer or Product
- `Favorite` is polymorphic in the same way

---

## 5. Data Flow Diagrams

### 5.1 Customer Places Order (High-level DFD)
```
[Customer] ──1──▶ Browse Markets ──▶ Browse Products
                        │                    │
                        └──── View Farmer ───┘
                                     │
                                     ▼
                              Add to cart (localStorage)
                                     │
                                     ▼
                              Checkout: pick date + slot
                                     │
                                     ▼
                         POST /api/orders
                                     │
                                     ▼
                         ┌─── Prisma Transaction ─┐
                         │ · Create Order + Items │
                         │ · Decrement stock      │
                         │ · Notify farmer        │
                         │ · Notify customer      │
                         └────────────────────────┘
                                     │
                        ┌────────────┴────────────┐
                        ▼                         ▼
                [Farmer notified]         [Customer sees order]
```

### 5.2 Farmer Fulfills Order
```
[Farmer] ──▶ /farmer/orders ──▶ Open order
                                    │
                                    ▼
                        Advance status (PLACED → ACCEPTED → READY → COMPLETED)
                        or Decline (with reason)
                                    │
                                    ▼
                         POST /api/orders/[id]/status
                                    │
                                    ▼
                         ┌── Update Order ──┐
                         │ Create Notification │
                         │ (customer notified) │
                         └────────────────────┘
```

### 5.3 Admin Approves Farmer
```
Farmer registers ──▶ status=PENDING
       │
       ▼
[Admin] /admin/farmers?status=PENDING
       │
       ▼
Click Approve
       │
       ▼
PATCH /api/admin/users/[id]/status → status=ACTIVE
       │
       ▼
Farmer receives ACCOUNT_APPROVED notification
       │
       ▼
Farmer's products become visible to customers
```

---

## 6. Test Data

The seed script (`prisma/seed.ts`) populates the database with realistic data for evaluation:

| Entity | Count | Notes |
|--------|-------|-------|
| Categories | 8 | Vegetables, Fruits, Herbs, Dairy, Eggs, Baked goods, Honey, Grains |
| Markets | 6 | Karachi (3), Lahore (2), Islamabad (1) |
| Farmers (active) | 10 | Distributed across markets with realistic operating days |
| Farmers (pending) | 1 | For testing admin approval flow |
| Customers | 3 | With sample addresses in different cities |
| Admin | 1 | Configurable via env |
| Products | ~40 | Distributed across farmers with images, stock, pricing |
| Orders | 25 | Random status distribution across last 20 days |
| Reviews | 30 | On farmers and products, 3–5 star ratings |
| Favorites | 15 | Random assignments |
| Announcement | 1 | Pinned welcome message |

Run: `npm run db:seed`

---

## 7. Installation & Deployment

### 7.1 Local Development
See [`README.md`](../README.md) for step-by-step setup.

### 7.2 Production Deployment (Vercel)
```bash
# One-time: install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set env vars via dashboard or CLI
vercel env add DATABASE_URL
vercel env add JWT_SECRET
vercel env add CLOUDINARY_CLOUD_NAME
vercel env add CLOUDINARY_API_KEY
vercel env add CLOUDINARY_API_SECRET
vercel env add ADMIN_EMAIL
vercel env add ADMIN_PASSWORD

# Run migrations against production DB
DATABASE_URL="<prod-url>" npx prisma db push
DATABASE_URL="<prod-url>" npm run db:seed
```

### 7.3 Setting up Neon PostgreSQL
1. Sign up at [neon.tech](https://neon.tech) (free tier is enough for this project).
2. Create a new project → pick a region.
3. Copy the connection string (starts with `postgresql://`).
4. Paste into `DATABASE_URL` in `.env` (local) and Vercel env vars (production).

### 7.4 Setting up Cloudinary
1. Sign up at [cloudinary.com](https://cloudinary.com) (free plan is generous).
2. Dashboard → Product Environment Credentials → copy Cloud Name, API Key, API Secret.
3. Add to `.env` as `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.

---

## 8. User Credentials (Post-Seed)

| Role | Email | Password | Notes |
|------|-------|----------|-------|
| Admin | `admin@marketlink.com` | `Admin@12345` | Full platform access |
| Customer 1 | `customer@marketlink.com` | `Customer@123` | Has sample orders |
| Customer 2 | `sara@marketlink.com` | `Customer@123` | Lahore-based |
| Customer 3 | `bilal@marketlink.com` | `Customer@123` | Islamabad-based |
| Farmer 1 | `roshan@marketlink.com` | `Farmer@123` | Roshan Family Farm |
| Farmer 2 | `meenakshi@marketlink.com` | `Farmer@123` | Kitchen Garden Co. |
| Farmer 3 | `faiz@marketlink.com` | `Farmer@123` | Meadow Dairy |
| Farmer 4 | `nadia@marketlink.com` | `Farmer@123` | Copper Oven Bakery |
| Farmer 5–10 | See `prisma/seed.ts` | `Farmer@123` | Various stalls |
| Pending Farmer | `pending@marketlink.com` | `Farmer@123` | For admin approval demo |

---

## 9. Assumptions

- Google Maps API was not used to avoid API key/billing setup — OpenStreetMap (free, no key) is used instead, satisfying the SRS's "Google Maps API or OpenStreetMap" allowance.
- Payment happens in cash at pickup — no online payment gateway per SRS §1.5.
- Farmer approval is a trust-based admin decision, no automated identity verification per SRS §1.5.
- Restock alerts are implemented as in-app notifications (not email) — SRS allowed "email or in-app".
- The chatbot is a rule-based FAQ helper (not a full LLM) — matches "optional AI assistant" requirement while remaining deterministic and offline-capable.
- File uploads (product images) are limited to 5MB; larger images should be resized client-side.

---

## 10. Future Enhancements
- WebSocket real-time notifications for instant order updates
- Push notifications for mobile (via web push)
- Multi-language support (Urdu, English)
- Loyalty points / rewards program
- Weekly menu suggestions based on farm stock
- Delivery integration (out of current scope per SRS)

---

## 11. Team & Attribution

**Team MarketLink**
- Muhammad Kashan · Team Lead, Full-stack
- Ayesha Ahmad · Frontend & Design
- Bilal Hussain · Backend & Database
- Zainab Riaz · QA & Documentation

**Tools used** (as required by SRS to acknowledge):
- Claude (Anthropic) — AI coding assistant for scaffolding & debugging
- GitHub Copilot — occasional autocomplete assistance
- Figma — UI design mockups (not directly imported; reimplemented by hand)
- Unsplash — real photography (attributed to individual photographers)

**All source code, database design, business logic, and UI were understood and implemented by the team.** AI was used as a coding aid, not as a substitute for our skills.

---

*End of Documentation · TechWiz 7 · MarketLink · 2026*
