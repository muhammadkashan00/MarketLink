import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CategoriesManager } from "@/components/admin/CategoriesManager";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { sortOrder: "asc" },
  }).catch(() => []);
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="serif-heading text-4xl text-ink-900">Product categories</h1>
        <p className="mt-1 text-ink-600">Curate the taxonomy customers browse by.</p>
      </div>
      <CategoriesManager categories={JSON.parse(JSON.stringify(categories))} />
    </div>
  );
}
