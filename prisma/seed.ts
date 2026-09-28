import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding MarketLink database…");

  // Clear existing (careful — deletes all data)
  await prisma.notification.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.review.deleteMany();
  await prisma.product.deleteMany();
  await prisma.farmerMarketLink.deleteMany();
  await prisma.category.deleteMany();
  await prisma.market.deleteMany();
  await prisma.farmerProfile.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.user.deleteMany();

  // ============ CATEGORIES ============
  const categories = await Promise.all(
    [
      { name: "Vegetables", slug: "vegetables", icon: "🥬", sortOrder: 1 },
      { name: "Fruits", slug: "fruits", icon: "🍎", sortOrder: 2 },
      { name: "Herbs", slug: "herbs", icon: "🌿", sortOrder: 3 },
      { name: "Dairy", slug: "dairy", icon: "🥛", sortOrder: 4 },
      { name: "Eggs", slug: "eggs", icon: "🥚", sortOrder: 5 },
      { name: "Baked goods", slug: "baked-goods", icon: "🥖", sortOrder: 6 },
      { name: "Honey & preserves", slug: "honey-preserves", icon: "🍯", sortOrder: 7 },
      { name: "Grains & pulses", slug: "grains-pulses", icon: "🌾", sortOrder: 8 },
    ].map((c) => prisma.category.create({ data: c }))
  );

  // ============ USERS ============
  const adminPass = await bcrypt.hash(process.env.ADMIN_PASSWORD || "Admin@12345", 10);
  const admin = await prisma.user.create({
    data: {
      name: "Admin",
      email: process.env.ADMIN_EMAIL || "admin@marketlink.com",
      passwordHash: adminPass,
      phone: "+92 300 0000000",
      role: "ADMIN", status: "ACTIVE",
    },
  });

  // Sample customer
  const customerPass = await bcrypt.hash("Customer@123", 10);
  const customer = await prisma.user.create({
    data: {
      name: "Ayesha Malik", email: "customer@marketlink.com",
      passwordHash: customerPass, phone: "+92 321 1234567",
      address: "House 12, Clifton Block 4, Karachi",
      role: "CUSTOMER", status: "ACTIVE",
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      name: "Sara Ahmed", email: "sara@marketlink.com",
      passwordHash: customerPass, phone: "+92 333 2233445",
      address: "House 5, Gulberg III, Lahore",
      role: "CUSTOMER", status: "ACTIVE",
    },
  });

  const customer3 = await prisma.user.create({
    data: {
      name: "Bilal Hussain", email: "bilal@marketlink.com",
      passwordHash: customerPass, phone: "+92 345 5566778",
      address: "Apartment 4B, F-10 Islamabad",
      role: "CUSTOMER", status: "ACTIVE",
    },
  });

  // ============ MARKETS ============
  const markets = await Promise.all([
    prisma.market.create({
      data: {
        name: "Green Valley Farmers Market",
        address: "Sea View Road, Clifton Block 5",
        city: "Karachi",
        operatingDays: ["SAT", "SUN"],
        startTime: "07:00", endTime: "13:00",
        latitude: 24.8138, longitude: 67.0284,
        imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80",
        description: "The city's original weekend market, hosting over 40 regional growers under a canopy of banyan trees. Live music from 10am.",
      },
    }),
    prisma.market.create({
      data: {
        name: "Harbour Front Market",
        address: "Beach Avenue, DHA Phase 8",
        city: "Karachi",
        operatingDays: ["WED", "SAT"],
        startTime: "08:00", endTime: "14:00",
        latitude: 24.7935, longitude: 67.0715,
        imageUrl: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1200&q=80",
        description: "Coastal market specializing in seafood, dairy, and stone fruit. Espresso bar on-site.",
      },
    }),
    prisma.market.create({
      data: {
        name: "Old Town Grower's Square",
        address: "Main Boulevard, Gulberg III",
        city: "Lahore",
        operatingDays: ["FRI", "SUN"],
        startTime: "06:30", endTime: "12:30",
        latitude: 31.5204, longitude: 74.3587,
        imageUrl: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=1200&q=80",
        description: "Historic square lined with heritage farms — famous for heirloom pomegranates and citrus.",
      },
    }),
    prisma.market.create({
      data: {
        name: "Riverside Organic Bazaar",
        address: "Riverwalk, F-9 Park",
        city: "Islamabad",
        operatingDays: ["SAT"],
        startTime: "07:00", endTime: "12:00",
        latitude: 33.6844, longitude: 73.0479,
        imageUrl: "https://images.unsplash.com/photo-1595475207225-428b62bda831?w=1200&q=80",
        description: "Strictly certified-organic. All stalls are carbon-audited and single-farm sourced.",
      },
    }),
    prisma.market.create({
      data: {
        name: "Farmhouse Collective",
        address: "Airport Road, Cantt",
        city: "Karachi",
        operatingDays: ["TUE", "THU"],
        startTime: "16:00", endTime: "20:00",
        latitude: 24.8938, longitude: 67.1815,
        imageUrl: "https://images.unsplash.com/photo-1601599963565-b7f49deae0d2?w=1200&q=80",
        description: "Weekday evening market for the after-work crowd. Ready-cook meal kits and craft breads.",
      },
    }),
    prisma.market.create({
      data: {
        name: "Hilltop Weekly",
        address: "Model Town Link Road",
        city: "Lahore",
        operatingDays: ["SUN"],
        startTime: "07:00", endTime: "11:00",
        latitude: 31.4823, longitude: 74.3232,
        imageUrl: "https://images.unsplash.com/photo-1518843875459-f738682238a6?w=1200&q=80",
        description: "Sunday-only market with a rotating chef corner. Best for baked goods and honey.",
      },
    }),
  ]);

  // ============ FARMERS ============
  const farmerData = [
    { name: "Roshan Khan", email: "roshan@marketlink.com", stallName: "Roshan Family Farm", city: "Karachi", lat: 24.8135, lng: 67.028, days: ["SAT", "SUN"], markets: [0, 1] },
    { name: "Meenakshi Devi", email: "meenakshi@marketlink.com", stallName: "Kitchen Garden Co.", city: "Karachi", lat: 24.7938, lng: 67.072, days: ["WED", "SAT"], markets: [1] },
    { name: "Faiz Ahmad", email: "faiz@marketlink.com", stallName: "Meadow Dairy", city: "Karachi", lat: 24.892, lng: 67.181, days: ["TUE", "THU", "SAT"], markets: [0, 4] },
    { name: "Nadia Iqbal", email: "nadia@marketlink.com", stallName: "Copper Oven Bakery", city: "Karachi", lat: 24.814, lng: 67.029, days: ["SAT", "SUN"], markets: [0, 5] },
    { name: "Karim Sattar", email: "karim@marketlink.com", stallName: "Sunrise Poultry", city: "Karachi", lat: 24.79, lng: 67.07, days: ["WED", "SAT"], markets: [1] },
    { name: "Priya Sharma", email: "priya@marketlink.com", stallName: "Root & Row", city: "Lahore", lat: 31.5205, lng: 74.359, days: ["FRI", "SUN"], markets: [2, 5] },
    { name: "Zaheer Butt", email: "zaheer@marketlink.com", stallName: "Butt Organic Orchard", city: "Lahore", lat: 31.5, lng: 74.35, days: ["FRI", "SUN"], markets: [2] },
    { name: "Sadia Rehman", email: "sadia@marketlink.com", stallName: "Sadia's Herb Patch", city: "Islamabad", lat: 33.685, lng: 73.048, days: ["SAT"], markets: [3] },
    { name: "Umer Farooq", email: "umer@marketlink.com", stallName: "Highland Honey", city: "Islamabad", lat: 33.684, lng: 73.047, days: ["SAT"], markets: [3] },
    { name: "Ayla Chaudhry", email: "ayla@marketlink.com", stallName: "Chaudhry Preserves", city: "Karachi", lat: 24.815, lng: 67.03, days: ["SAT", "SUN"], markets: [0, 4] },
  ];

  const farmerProfiles: any[] = [];
  const farmerPass = await bcrypt.hash("Farmer@123", 10);
  for (const f of farmerData) {
    const user = await prisma.user.create({
      data: {
        name: f.name, email: f.email, passwordHash: farmerPass,
        phone: "+92 " + Math.floor(300 + Math.random() * 50) + " " + Math.floor(1000000 + Math.random() * 9000000),
        address: `${f.city}, Pakistan`,
        role: "FARMER", status: "ACTIVE",
        farmerProfile: {
          create: {
            stallName: f.stallName,
            bio: `A ${["family-run", "three-generation", "young", "organic"][Math.floor(Math.random() * 4)]} stall bringing you the freshest seasonal produce from our farm on the outskirts of ${f.city}.`,
            operatingDays: f.days,
            pickupWindowStart: "08:00",
            pickupWindowEnd: "13:00",
            orderCutoffHours: 12,
            latitude: f.lat, longitude: f.lng,
            mapAddress: `${f.stallName} · ${markets[f.markets[0]].name}`,
          },
        },
      },
      include: { farmerProfile: true },
    });
    farmerProfiles.push({ user, profile: user.farmerProfile!, marketIds: f.markets.map((i) => markets[i].id) });
  }

  // Additional pending farmer for admin approval demo
  await prisma.user.create({
    data: {
      name: "Test Pending", email: "pending@marketlink.com", passwordHash: farmerPass,
      phone: "+92 300 9999999", address: "Karachi",
      role: "FARMER", status: "PENDING",
      farmerProfile: { create: { stallName: "Awaiting Approval Farm", operatingDays: ["SAT"] } },
    },
  });

  // Link farmers to markets
  for (const fp of farmerProfiles) {
    for (const mid of fp.marketIds) {
      await prisma.farmerMarketLink.create({
        data: {
          farmerId: fp.profile.id,
          marketId: mid,
          stallNumber: `${String.fromCharCode(65 + Math.floor(Math.random() * 5))}${Math.floor(Math.random() * 20) + 1}`,
        },
      });
    }
  }

  // ============ PRODUCTS ============
  const productPool = [
    { name: "Heirloom tomatoes", cat: "Vegetables", price: 320, unit: "kg", img: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&q=80", stock: 25 },
    { name: "Cherry tomatoes", cat: "Vegetables", price: 240, unit: "kg", img: "https://images.unsplash.com/photo-1546470427-227df8ade82c?w=600&q=80", stock: 30 },
    { name: "Fresh basil bunch", cat: "Herbs", price: 90, unit: "bunch", img: "https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=600&q=80", stock: 18 },
    { name: "Baby spinach", cat: "Vegetables", price: 140, unit: "bunch", img: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&q=80", stock: 22 },
    { name: "Wild rocket", cat: "Herbs", price: 110, unit: "bunch", img: "https://images.unsplash.com/photo-1633380110125-f6e685676160?w=600&q=80", stock: 15 },
    { name: "Farm butter (500g)", cat: "Dairy", price: 720, unit: "pack", img: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&q=80", stock: 12 },
    { name: "Whole milk (1L)", cat: "Dairy", price: 220, unit: "bottle", img: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&q=80", stock: 40 },
    { name: "Sourdough loaf", cat: "Baked goods", price: 480, unit: "loaf", img: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=600&q=80", stock: 20 },
    { name: "Country white bread", cat: "Baked goods", price: 320, unit: "loaf", img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80", stock: 24 },
    { name: "Cage-free eggs (dozen)", cat: "Eggs", price: 380, unit: "dozen", img: "https://images.unsplash.com/photo-1569288052389-dac9b0ac9efd?w=600&q=80", stock: 28 },
    { name: "Baby carrots", cat: "Vegetables", price: 180, unit: "kg", img: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&q=80", stock: 32 },
    { name: "Purple carrots", cat: "Vegetables", price: 220, unit: "kg", img: "https://images.unsplash.com/photo-1571680322279-a226e6a4cc2a?w=600&q=80", stock: 14 },
    { name: "Meyer lemons", cat: "Fruits", price: 260, unit: "kg", img: "https://images.unsplash.com/photo-1587496679742-bad83b268cf2?w=600&q=80", stock: 26 },
    { name: "Strawberries (500g)", cat: "Fruits", price: 380, unit: "pack", img: "https://images.unsplash.com/photo-1587393855524-087f83d95bc9?w=600&q=80", stock: 20 },
    { name: "Pomegranates", cat: "Fruits", price: 340, unit: "kg", img: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=600&q=80", stock: 18 },
    { name: "Kinnows (bag of 12)", cat: "Fruits", price: 280, unit: "pack", img: "https://images.unsplash.com/photo-1547514701-42782101795e?w=600&q=80", stock: 16 },
    { name: "Wildflower honey (500g)", cat: "Honey & preserves", price: 620, unit: "bottle", img: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80", stock: 15 },
    { name: "Apricot jam (250g)", cat: "Honey & preserves", price: 340, unit: "bottle", img: "https://images.unsplash.com/photo-1622140061-96a3ba86b3d0?w=600&q=80", stock: 20 },
    { name: "Farm cheddar (200g)", cat: "Dairy", price: 480, unit: "pack", img: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=600&q=80", stock: 10 },
    { name: "Fresh yogurt (500g)", cat: "Dairy", price: 260, unit: "pack", img: "https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=600&q=80", stock: 25 },
    { name: "Coriander bunch", cat: "Herbs", price: 60, unit: "bunch", img: "https://images.unsplash.com/photo-1600231915711-42841dad920c?w=600&q=80", stock: 30 },
    { name: "Mint bunch", cat: "Herbs", price: 60, unit: "bunch", img: "https://images.unsplash.com/photo-1628614221795-586ef4d92e79?w=600&q=80", stock: 30 },
    { name: "Green chickpeas", cat: "Grains & pulses", price: 200, unit: "kg", img: "https://images.unsplash.com/photo-1615485500834-bc10199bc727?w=600&q=80", stock: 20 },
    { name: "Red lentils", cat: "Grains & pulses", price: 340, unit: "kg", img: "https://images.unsplash.com/photo-1601035283842-dfe4c65f57e0?w=600&q=80", stock: 18 },
    { name: "Bell peppers mix", cat: "Vegetables", price: 260, unit: "kg", img: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=600&q=80", stock: 22 },
    { name: "Cucumbers", cat: "Vegetables", price: 140, unit: "kg", img: "https://images.unsplash.com/photo-1568584711271-6c929fb49b60?w=600&q=80", stock: 30 },
    { name: "Butternut squash", cat: "Vegetables", price: 200, unit: "kg", img: "https://images.unsplash.com/photo-1570586437263-ab629fccc818?w=600&q=80", stock: 12 },
    { name: "Zucchini", cat: "Vegetables", price: 220, unit: "kg", img: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80", stock: 18 },
    { name: "Cinnamon rolls (pack of 6)", cat: "Baked goods", price: 540, unit: "pack", img: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=600&q=80", stock: 12 },
    { name: "Duck eggs (dozen)", cat: "Eggs", price: 620, unit: "dozen", img: "https://images.unsplash.com/photo-1489761486274-a2c2f6e64f6a?w=600&q=80", stock: 8 },
    { name: "Beetroot", cat: "Vegetables", price: 160, unit: "kg", img: "https://images.unsplash.com/photo-1593105544559-ecb03bf76f82?w=600&q=80", stock: 20 },
    { name: "Sweet corn", cat: "Vegetables", price: 60, unit: "piece", img: "https://images.unsplash.com/photo-1601593768799-76d3fa26bbaa?w=600&q=80", stock: 45 },
    { name: "Sun-dried figs", cat: "Fruits", price: 720, unit: "pack", img: "https://images.unsplash.com/photo-1601379329542-31c59a0d0916?w=600&q=80", stock: 10 },
    { name: "Wildberry compote (250g)", cat: "Honey & preserves", price: 420, unit: "bottle", img: "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=600&q=80", stock: 12 },
    { name: "Buckwheat flour (1kg)", cat: "Grains & pulses", price: 380, unit: "pack", img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80", stock: 15 },
  ];

  const products: any[] = [];
  let pIdx = 0;
  for (const fp of farmerProfiles) {
    const productsForFarmer = Math.floor(3 + Math.random() * 4);
    for (let i = 0; i < productsForFarmer; i++) {
      const p = productPool[pIdx % productPool.length]; pIdx++;
      const catId = categories.find((c) => c.name === p.cat)!.id;
      const product = await prisma.product.create({
        data: {
          farmerId: fp.profile.id, categoryId: catId,
          name: p.name, description: `${p.name} sourced from ${fp.profile.stallName}. Grown with love in ${fp.user.address}.`,
          price: p.price + Math.floor(Math.random() * 40 - 20),
          unit: p.unit, stock: p.stock, imageUrl: p.img,
          isAvailable: true, isRecurring: Math.random() > 0.4,
          totalSold: Math.floor(Math.random() * 100),
        },
      });
      products.push(product);
    }
  }

  // ============ ORDERS ============
  const statuses: any[] = ["PLACED", "ACCEPTED", "READY", "COMPLETED", "COMPLETED", "COMPLETED", "CANCELLED"];
  for (let i = 0; i < 25; i++) {
    const c = [customer, customer2, customer3][Math.floor(Math.random() * 3)];
    const fp = farmerProfiles[Math.floor(Math.random() * farmerProfiles.length)];
    const farmerProducts = products.filter((p) => p.farmerId === fp.profile.id);
    if (!farmerProducts.length) continue;
    const numItems = Math.floor(1 + Math.random() * 3);
    const items: any[] = [];
    let total = 0;
    for (let j = 0; j < numItems; j++) {
      const p = farmerProducts[Math.floor(Math.random() * farmerProducts.length)];
      if (items.find((x) => x.productId === p.id)) continue;
      const qty = Math.floor(1 + Math.random() * 3);
      const subtotal = Number(p.price) * qty;
      items.push({ productId: p.id, productName: p.name, quantity: qty, priceAtPurchase: p.price, subtotal });
      total += subtotal;
    }
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const daysAgo = Math.floor(Math.random() * 20);
    await prisma.order.create({
      data: {
        customerId: c.id, farmerId: fp.profile.id, marketId: fp.marketIds[0],
        status,
        pickupDate: new Date(Date.now() + (Math.random() > 0.3 ? 1 : -1) * 24 * 3600 * 1000),
        pickupSlot: ["08:00-09:00", "09:00-10:00", "10:00-11:00", "11:00-12:00"][Math.floor(Math.random() * 4)],
        totalAmount: total, notes: Math.random() > 0.7 ? "Please pack in eco bags." : null,
        createdAt: new Date(Date.now() - daysAgo * 24 * 3600 * 1000),
        items: { create: items },
      },
    });
  }

  // ============ REVIEWS ============
  const reviewComments = [
    "Absolutely delicious! The best I've had in years. Will be back every week.",
    "Fresh, well-priced, and the farmer was super friendly at pickup.",
    "Perfectly ripe. Highly recommend for salads and quick snacks.",
    "Quality was outstanding. Loved that they came in reusable packaging.",
    "Delivered on the promise — farm-fresh really means fresh here.",
    "Great value for money. My family really enjoyed the taste.",
    "Beautiful produce, gorgeous colors and flavors. Standing ovation.",
    "The stall was easy to find and pickup was seamless. Loved it.",
  ];
  for (let i = 0; i < 30; i++) {
    const c = [customer, customer2, customer3][Math.floor(Math.random() * 3)];
    const isFarmer = Math.random() > 0.5;
    if (isFarmer) {
      const fp = farmerProfiles[Math.floor(Math.random() * farmerProfiles.length)];
      await prisma.review.create({
        data: {
          customerId: c.id, targetType: "FARMER", targetId: fp.profile.id,
          rating: 3 + Math.floor(Math.random() * 3),
          comment: reviewComments[Math.floor(Math.random() * reviewComments.length)],
        },
      }).catch(() => {});
    } else {
      const p = products[Math.floor(Math.random() * products.length)];
      await prisma.review.create({
        data: {
          customerId: c.id, targetType: "PRODUCT", targetId: p.id,
          rating: 3 + Math.floor(Math.random() * 3),
          comment: reviewComments[Math.floor(Math.random() * reviewComments.length)],
        },
      }).catch(() => {});
    }
  }

  // Update aggregates
  for (const fp of farmerProfiles) {
    const revs = await prisma.review.findMany({ where: { targetType: "FARMER", targetId: fp.profile.id }, select: { rating: true } });
    if (revs.length) {
      await prisma.farmerProfile.update({
        where: { id: fp.profile.id },
        data: { averageRating: revs.reduce((s, r) => s + r.rating, 0) / revs.length, totalReviews: revs.length },
      });
    }
  }
  for (const p of products) {
    const revs = await prisma.review.findMany({ where: { targetType: "PRODUCT", targetId: p.id }, select: { rating: true } });
    if (revs.length) {
      await prisma.product.update({
        where: { id: p.id },
        data: { averageRating: revs.reduce((s, r) => s + r.rating, 0) / revs.length, totalReviews: revs.length },
      });
    }
  }

  // ============ FAVORITES ============
  for (let i = 0; i < 15; i++) {
    const c = [customer, customer2, customer3][Math.floor(Math.random() * 3)];
    const isFarmer = Math.random() > 0.5;
    const targetType: any = isFarmer ? "FARMER" : "PRODUCT";
    const targetId = isFarmer
      ? farmerProfiles[Math.floor(Math.random() * farmerProfiles.length)].profile.id
      : products[Math.floor(Math.random() * products.length)].id;
    await prisma.favorite.create({ data: { userId: c.id, targetType, targetId } }).catch(() => {});
  }

  // ============ ANNOUNCEMENTS ============
  await prisma.announcement.create({
    data: {
      createdBy: admin.id,
      title: "Welcome to MarketLink 🌿",
      body: "We're launching in six cities this season with over 100 farmers. Explore the markets tab to discover local growers near you!",
      audience: "ALL",
      isPinned: true,
    },
  });

  console.log("✅ Seed complete:");
  console.log(`  · ${categories.length} categories`);
  console.log(`  · ${markets.length} markets`);
  console.log(`  · ${farmerProfiles.length} farmers (+ 1 pending)`);
  console.log(`  · ${products.length} products`);
  console.log(`  · 3 customers`);
  console.log(`  · 1 admin`);
  console.log("");
  console.log("🔐 Login credentials:");
  console.log(`  · Admin:    ${process.env.ADMIN_EMAIL || "admin@marketlink.com"} / ${process.env.ADMIN_PASSWORD || "Admin@12345"}`);
  console.log(`  · Customer: customer@marketlink.com / Customer@123`);
  console.log(`  · Farmer:   roshan@marketlink.com / Farmer@123`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
