import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductsExplorer } from "@/components/products/ProductsExplorer";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const user = await getCurrentUser().catch(() => null);
  let products: any[] = [];
  let categories: any[] = [];
  try {
    [products, categories] = await Promise.all([
      prisma.product.findMany({
        where: { isAvailable: true, isSoldOut: false, farmer: { user: { status: "ACTIVE" } } },
        include: {
          category: true,
          farmer: {
            include: { user: { select: { name: true, status: true } } },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    ]);
  } catch {}

  return (
    <div className="min-h-screen">
      <Navbar user={user ? { name: user.name, role: user.role } : null} />
      <section className="pt-12 pb-8">
        <div className="mx-auto max-w-7xl px-6">
          <h1 className="serif-heading text-5xl text-ink-900">Fresh this week</h1>
          <p className="mt-3 max-w-2xl text-ink-600">Every product listed is harvested locally and available for pickup within days.</p>
        </div>
      </section>
      <ProductsExplorer
        products={JSON.parse(JSON.stringify(products))}
        categories={JSON.parse(JSON.stringify(categories))}
      />
      <Footer />
    </div>
  );
}
