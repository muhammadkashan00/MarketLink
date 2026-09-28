import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/farmer/ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } }).catch(() => []);
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="serif-heading text-4xl text-ink-900">Add product</h1>
      <p className="mt-1 text-ink-600">List what you're bringing to market this week.</p>
      <div className="mt-8">
        <ProductForm categories={JSON.parse(JSON.stringify(categories))} />
      </div>
    </div>
  );
}
