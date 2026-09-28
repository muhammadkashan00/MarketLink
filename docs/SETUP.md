# Setup Instructions (MANDATORY per SRS §1.9)

## Prerequisites
- **Node.js 20+** — [nodejs.org](https://nodejs.org/en/download/)
- **npm 10+** (comes with Node)
- **Git** — [git-scm.com](https://git-scm.com/downloads)
- A **Neon PostgreSQL** database URL — free at [neon.tech](https://neon.tech)
- A **Cloudinary** account (free) — [cloudinary.com](https://cloudinary.com)

Minimum hardware (per SRS): Intel Core i5+, 16GB RAM, 500GB HDD, Chrome/Firefox/Edge.

## Step-by-step Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/muhammadkashan00/MarketLink.git
cd MarketLink
```

### 2. Install dependencies
```bash
npm install
```
This installs Next.js, Prisma, Tailwind, Framer Motion, Leaflet, and all other packages.

### 3. Create `.env` file
Copy `.env.example` → `.env` and fill in real values:

```bash
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL="postgresql://user:password@ep-xxxx.region.neon.tech/dbname?sslmode=require"
JWT_SECRET="paste-a-random-32-character-string-here"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
ADMIN_EMAIL="admin@marketlink.com"
ADMIN_PASSWORD="Admin@12345"
```

### 4. Set up the database schema
```bash
npx prisma generate       # Generate the Prisma client
npx prisma db push        # Push schema to your Neon database (creates all tables)
```

### 5. Seed the database with test data
```bash
npm run db:seed
```
This creates: 8 categories, 6 markets, 10 farmers, 3 customers, 1 admin, ~40 products, 25 orders, 30 reviews.

### 6. Start the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000). You should see the MarketLink landing page.

### 7. Log in with test credentials
See [User Credentials](../README.md#-test-accounts-after-seeding) in the main README.

---

## Production Build (optional)
```bash
npm run build
npm start
```

## Common Issues

**"Can't reach database server"**
→ Double-check your `DATABASE_URL`. It must include `?sslmode=require` at the end for Neon.

**"Cloudinary upload failed"**
→ Verify your CLOUD_NAME, API_KEY, and API_SECRET are exactly as shown in your Cloudinary dashboard.

**Port 3000 already in use**
→ Set a different port: `PORT=3001 npm run dev`

**Prisma migration errors**
→ Try `npx prisma db push --force-reset` (⚠️ deletes all data).

---

## Deployment to Vercel

1. Push your code to GitHub.
2. Go to [vercel.com](https://vercel.com) and import the GitHub repo.
3. In project settings, add all `.env` variables.
4. Vercel auto-deploys on every push to `main`.
5. After first deploy, run migrations manually:
   ```bash
   DATABASE_URL="<your-neon-prod-url>" npx prisma db push
   DATABASE_URL="<your-neon-prod-url>" npm run db:seed
   ```
