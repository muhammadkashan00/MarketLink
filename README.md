# 🌿 MarketLink — Farm to Table, Reimagined

**A full-stack web application connecting local farmers-market vendors with customers.**

Built for **TechWiz 7 · End-to-End Web Solutions** by team MarketLink · eGreen Basket theme.

---

## ✨ Features

### 🛒 Customer
- Register / Login with secure JWT authentication
- Browse markets by location, day, and category
- Interactive map view (OpenStreetMap + Leaflet)
- Search & filter products (category, price, market, day)
- Add to cart, place pre-orders with pickup slot selection
- Track orders from placed → accepted → ready → picked up
- Cancel or modify orders before farmer's cutoff
- Save favorite farmers and products
- Rate & review farmers and products after completion
- Real-time in-app notifications
- Rule-based FAQ chatbot for common queries

### 🌾 Farmer
- Complete stall profile with map location
- CRUD product management with image uploads (Cloudinary)
- Weekly stock templates for recurring items
- Accept/decline incoming pre-orders
- Manage pickup slots and order cutoff times
- Sales analytics dashboard with revenue charts
- Insights on best-selling products
- Respond publicly to customer reviews

### 👨‍💼 Admin
- Comprehensive dashboard with platform metrics
- Approve/suspend farmer registrations
- Activate/deactivate customer accounts
- Full CRUD for markets (with map coordinates)
- Product category management
- Review moderation
- Reports & analytics with charts
- Broadcast platform-wide announcements

---

## 🧰 Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + custom design system |
| Animations | Framer Motion |
| Database | **Neon PostgreSQL** |
| ORM | Prisma |
| Auth | JWT (jose) + bcrypt + HttpOnly cookies |
| Maps | Leaflet + OpenStreetMap (no API key required) |
| Charts | Recharts |
| Image hosting | Cloudinary |
| Form validation | Zod + React Hook Form |
| Toast notifications | react-hot-toast |
| Deployment | Vercel |

---

## 🚀 Quick Start (Local)

### Prerequisites
- Node.js 20+ · npm 10+
- A Neon PostgreSQL database URL — grab one free at [neon.tech](https://neon.tech)

### 1. Clone & install
```bash
git clone https://github.com/muhammadkashan00/MarketLink.git
cd MarketLink
npm install
```

### 2. Environment variables
Copy `.env.example` to `.env` and fill in the values:
```env
DATABASE_URL="postgresql://user:password@host.neon.tech/dbname?sslmode=require"
JWT_SECRET="a-random-32-char-string"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-key"
CLOUDINARY_API_SECRET="your-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
ADMIN_EMAIL="admin@marketlink.com"
ADMIN_PASSWORD="Admin@12345"
```

### 3. Run migrations & seed
```bash
npx prisma db push
npm run db:seed
```

### 4. Start dev server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

---

## 🔐 Test Accounts (after seeding)

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@marketlink.com | Admin@12345 |
| **Customer** | customer@marketlink.com | Customer@123 |
| **Customer** | sara@marketlink.com | Customer@123 |
| **Customer** | bilal@marketlink.com | Customer@123 |
| **Farmer** | roshan@marketlink.com | Farmer@123 |
| **Farmer** | meenakshi@marketlink.com | Farmer@123 |
| **Farmer** | faiz@marketlink.com | Farmer@123 |
| **Farmer** (any of 10) | See `prisma/seed.ts` | Farmer@123 |
| **Pending farmer** | pending@marketlink.com | Farmer@123 |

---

## 📂 Project Structure
```
src/
├── app/                  # Next.js App Router
│   ├── (public routes)   # /, /about, /contact, /markets, /products, /farmers
│   ├── (auth routes)     # /login, /register
│   ├── admin/            # Admin dashboard
│   ├── customer/         # Customer dashboard
│   ├── farmer/           # Farmer dashboard
│   └── api/              # Server API routes
├── components/
│   ├── ui/               # Design system (Button, Input, Card, StarRating…)
│   ├── layout/           # Navbar, Footer, DashboardShell
│   ├── home/             # Landing page sections
│   ├── markets/          # Market exploration components
│   ├── products/         # Product listing components
│   ├── customer/         # Cart, checkout, chatbot
│   ├── farmer/           # Stall form, product form, insights
│   ├── admin/            # Admin management components
│   └── maps/             # Leaflet map wrapper
├── lib/                  # utils, prisma, auth, cart, cloudinary
├── types/                # Shared TypeScript types
└── middleware.ts         # Role-based route protection

prisma/
├── schema.prisma         # 15+ models
└── seed.ts               # Realistic test data

docs/
├── DOCUMENTATION.md      # Full project report
└── database-schema.sql   # SQL schema export
```

---

## 🎨 Design Philosophy
Every visual choice is intentional:
- **Palette:** Hand-picked "harvest green" + "warm cream" + "terracotta" — evoking farmers' markets, not tech.
- **Typography:** *Fraunces* (serif, editorial) for headings + *Inter* (crisp, modern) for body.
- **Motion:** Framer Motion for smooth transitions, layout animations, and micro-interactions.
- **Imagery:** Real farm and produce photography (Unsplash), never AI-generated.
- **Illustrations:** Custom SVG for logo, map markers, and decorative elements.

---

## 📖 Documentation
See [`docs/DOCUMENTATION.md`](./docs/DOCUMENTATION.md) for:
- Problem definition
- Requirements traceability from SRS
- Database schema & ERD
- Data flow diagrams
- Test data
- Installation instructions

---

## 🌍 Live Deployment
Once deployed to Vercel, this app will be live at:
`https://market-link.vercel.app` (or your custom domain)

---

## 🙏 Acknowledgements
- Photos courtesy of [Unsplash](https://unsplash.com) contributors
- Icons by [Lucide](https://lucide.dev)
- Maps by [OpenStreetMap](https://www.openstreetmap.org) contributors
- Fonts via [Google Fonts](https://fonts.google.com)

Made with 🌿 by Team MarketLink · TechWiz 7 · 2026
