# MarketLink — Project Report
### A Plain-English Guide to How the App Works
*Written for a non-technical reader — no jargon, promise.*

---

## 1. What Is MarketLink?

**MarketLink is like a mini-Amazon, but built specifically for your neighborhood farmers market.**

Imagine every Saturday morning you drive to a farmers market hoping your favorite farmer has tomatoes today. Sometimes they're sold out by 9am. Sometimes they're not even at the market that day. You wasted the trip.

MarketLink fixes this. Farmers post their stock **before** market day. Customers browse, **reserve** what they want, then just show up at the stall to grab their box. Payment happens in cash to the farmer — like normal — but the guesswork is gone.

**The tagline:** *"The freshest harvest, from soil to your table."*

---

## 2. Who Uses MarketLink? (The 3 Roles)

There are **three kinds of users** on MarketLink. Each has their own dashboard designed for what they need to do.

### 🛒 Role 1: The Customer

**Who they are:** Anyone who buys groceries at the farmers market. A parent, a young professional, a chef.

**What they can do:**
- **Sign up** with their name, email, phone, and address.
- **Browse markets** in their city — see which ones are open which days on a real map.
- **Explore products** — vegetables, fruits, dairy, eggs, baked goods, honey, herbs, and grains. They can search by name, filter by category, set a max price, or sort by popularity.
- **View a farmer's page** — see the stall bio, operating days, what's in stock this week, past customer reviews.
- **Add items to a basket** (like a shopping cart), then **place a pre-order**. They pick a specific date and time slot to come collect it.
- **Track their orders** — every order goes through 4 stages: Placed → Accepted → Ready → Picked up. They see live status updates.
- **Cancel or modify** any order before the farmer's cutoff time (usually the night before pickup).
- **Save favorites** — heart a farmer or a specific product for one-tap reordering.
- **Leave reviews** with 1–5 stars and a comment, after they've picked up an order.
- **See notifications** for every order update and platform announcement.
- **Chat with a helper bot** for FAQ (pickup, payment, cancellation questions).

**What they cannot do:** Pay online (all cash at pickup), list products, approve farmers.

### 🌾 Role 2: The Farmer

**Who they are:** A grower who brings produce to one or more local markets each week.

**What they can do:**
- **Register their stall** with a business name and contact info.
- **Wait for admin approval** — this is a safety check so anyone can't just show up as a "farmer".
- **Once approved, set up their stall page:**
  - Stall name and short bio (their story)
  - Which markets they attend
  - Which days they operate
  - Pickup time window (e.g., 8am–1pm)
  - "Cutoff time" — how many hours before pickup they need the order finalized
  - Map location for their stall
- **Add products to their inventory** — with photo, name, category, price, unit (kg / bunch / dozen), and stock available.
- **Manage weekly stock** — mark items sold out, temporarily unavailable, or set them as "recurring weekly stock" so they auto-repeat every week.
- **See incoming pre-orders** — for each one, they can **Accept**, **Decline** (with a reason), mark **Ready for pickup**, or mark **Completed** after the customer collects.
- **View sales insights** — a chart showing their revenue over the last 30 days, a chart of their top 5 best-selling products, total number of unique customers.
- **Respond publicly to customer reviews** — thank them, apologize, or explain.
- **Get notifications** every time a new order comes in or a review is left.

**What they cannot do:** See other farmers' orders, approve other farmers, edit customer accounts.

### 👨‍💼 Role 3: The Admin

**Who they are:** The MarketLink team who keeps the platform trustworthy and healthy.

**What they can do:**
- **See the big picture** — how many customers, how many active farmers, how many markets, how many total orders, total platform revenue.
- **Approve or reject new farmers** — every new farmer sign-up is PENDING until an admin reviews it. Admin can also suspend a bad-behaving farmer or a customer who violates policy.
- **Manage markets** — add a new farmers market to the platform (name, address, operating days, hours, GPS coordinates). Edit or remove existing ones.
- **Manage product categories** — the platform's taxonomy: Vegetables, Fruits, Herbs, Dairy, Eggs, Baked Goods, Honey & Preserves, Grains & Pulses.
- **Moderate content** — delete any inappropriate customer review that violates guidelines.
- **View reports and analytics** — order trends over 90 days, revenue per market ranked, most active farmers ranked, order status breakdown (pie chart).
- **Broadcast announcements** — send a platform-wide message. Can target everyone, only customers, or only farmers.
- **See notifications** for admin-relevant events.

**What they cannot do:** Place orders as a customer, list products as a farmer (a person can only have one role per account).

---

## 3. How Does the Whole Thing Work Together?

Here's the story of a typical week on MarketLink.

### Story A: Ayesha buys tomatoes

1. **Monday evening:** Roshan Family Farm (a farmer) adds "Heirloom tomatoes — Rs. 320/kg, 25 kg available" to their stall inventory in the MarketLink farmer dashboard.
2. **Wednesday afternoon:** Ayesha (a customer) opens MarketLink on her phone. She browses Products, filters by "Vegetables", and sees Roshan's tomatoes. She reads the reviews — 4.5 stars, "sweet and juicy". She adds 2 kg to her basket.
3. **Wednesday evening:** Ayesha checks out. She picks Saturday morning as her pickup date, 10:00–11:00 as her slot, and adds a note: "extra-ripe please". She places the order. Total: Rs. 640, to be paid in cash on Saturday.
4. **Wednesday, ~5 seconds later:** Roshan gets a notification: "New pre-order received." He opens his farmer dashboard, sees Ayesha's order, and taps **Accept**. Ayesha gets a notification: "Order accepted!"
5. **Saturday 8am:** Roshan harvests the tomatoes, sets aside 2 kg for Ayesha, and marks the order **Ready** in the app. Ayesha's phone pings: "Your order is ready for pickup."
6. **Saturday 10:30am:** Ayesha walks up to Roshan's stall at Green Valley Market, shows the order number, hands over Rs. 640 cash, and takes her tomatoes. Roshan taps **Mark Completed** on his end.
7. **Sunday:** Ayesha opens the order in the app and leaves a 5-star review: "Perfect ripeness, exactly as described." Roshan sees the review notification and replies: "Thanks Ayesha! See you next week 🌱"

### Story B: A new farmer joins

1. Faiz owns a small dairy farm. He goes to MarketLink and clicks Register → I'm a Farmer. He fills in his stall name "Meadow Dairy", contact info, and creates an account.
2. His account is marked PENDING. He tries to log in and sees a message: "Awaiting admin approval."
3. The admin gets a notification. She opens the farmers management page, sees Faiz's application, verifies his details, and clicks **Approve**.
4. Faiz gets a notification: "Your account was approved." He can now log in fully, set up his stall page, add markets he attends, and list products.

### Story C: The admin runs the platform

1. Every morning, the admin opens the dashboard and checks 6 numbers: total customers, active farmers, markets, orders, revenue, and pending farmer applications.
2. She sees 2 farmers are pending. She reviews them and approves both.
3. She notices a customer left an offensive review. She removes it via the Moderation page.
4. She wants to promote a new market opening this weekend. She goes to Announcements, writes a message, targets "Everyone", and broadcasts. All 100+ users get a notification.

---

## 4. The Main Things That Make MarketLink Special

### It's honest
- **No online payment.** You pay in cash at pickup. This means no processing fees, and every rupee goes to the farmer.
- **No delivery.** You pick up in person. This means fresh produce (no cold-chain issues) and you meet the person who grew your food.

### It's convenient
- **Pre-orders.** No more "sold out by 10am" heartbreak.
- **Interactive map.** Every market and stall is pinned. You can see directions right in the app.
- **Favorites and reorder.** Loved last week's bread? One tap to reorder it.
- **Notifications.** No need to keep checking — the app tells you when your order is accepted, ready, etc.

### It's fair
- **Farmers are verified.** Admin approval keeps out fake stalls.
- **Reviews are public.** Everyone sees the same reviews, and farmers can respond publicly.
- **Announcements are transparent.** Platform news reaches everyone equally.

### It's respectful of the market rhythm
- **Weekly operating days.** The app doesn't pretend a market is open 24/7.
- **Pickup time slots.** Farmers can space out pickups so their stall isn't chaotic at 9am.
- **Order cutoff.** Farmers can require orders finalized by 8pm the night before, so they know how much to harvest.

---

## 5. How the App Was Built (30-second technical summary)

*Skip this if you want — but if a judge asks:*

- **Frontend + Backend:** Next.js 15 (a modern React framework)
- **Language:** TypeScript (safer JavaScript)
- **Styling:** Tailwind CSS with a custom color palette we hand-picked (warm cream + harvest green + terracotta) so the app has personality
- **Database:** Neon PostgreSQL (a serverless SQL database)
- **Authentication:** Custom JWT tokens with encrypted cookies — no third-party service, we control it end-to-end
- **Maps:** OpenStreetMap + Leaflet (completely free, no API key needed)
- **Image uploads:** Cloudinary (industry standard)
- **Charts:** Recharts (for the farmer + admin analytics)
- **Animation:** Framer Motion (for smooth page transitions)
- **Hosting:** Vercel (deployed live at marketlink-zeta.vercel.app)
- **Source code:** Public on GitHub, ~30 pages of custom code across ~90 files

**No AI was used to build the core logic.** We used AI as a coding assistant, like a smart pair-programmer, but every design decision, every screen layout, every database table, and every piece of business logic was thought through and written by us.

---

## 6. Try It Yourself

**Live app:** https://marketlink-zeta.vercel.app

**Test accounts** (for the judge to explore each role):

| Role | Email | Password |
|------|-------|----------|
| Customer | `customer@marketlink.com` | `Customer@123` |
| Farmer | `roshan@marketlink.com` | `Farmer@123` |
| Admin | `admin@marketlink.com` | `Admin@12345` |

**Where to click first if you're...**
- **...a customer:** Go to Explore → click a tomato → Add to basket → Checkout. See the whole journey.
- **...a farmer:** Log in as Roshan → look at Orders (real orders!) → Insights (real charts!) → Products (add a new one).
- **...an admin:** Log in as Admin → Farmers page (see one pending!) → Reports (see the whole platform).

---

## 7. What's Next (If This Were a Real Business)

We built the full core platform in this competition timeframe. If we were to keep going:

- **Push notifications** on mobile browsers
- **Multi-language support** (Urdu first)
- **Delivery option** for customers who can't come to the market
- **Loyalty program** — earn points on every pickup
- **Farmer subscriptions** — subscribe to a weekly veg-box from your favorite grower
- **Real-time chat** between customer and farmer for specific requests

---

## The One-Sentence Summary

**MarketLink is the digital front door of your local farmers market — you plan your Saturday from the couch, the farmer plans their harvest from the field, and everyone wins.**

---

*Made with 🌿 by Team MarketLink for TechWiz 7 · 2026*
