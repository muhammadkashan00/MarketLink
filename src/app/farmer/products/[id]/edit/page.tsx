import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/farmer/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return null;
  const product = await prisma.product.findUnique({ where: { id }, include: { farmer: true } }).catch(() => null);
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } }).catch(() => []);
  if (!product || product.farmer.userId !== user.id) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="serif-heading text-4xl text-ink-900">Edit product</h1>
      <div className="mt-8">
        <ProductForm
          categories={JSON.parse(JSON.stringify(categories))}
          product={{
            id: product.id,
            name: product.name,
            description: product.description || "",
            categoryId: product.categoryId,
            price: Number(product.price),
            unit: product.unit,
            stock: product.stock,
            imageUrl: product.imageUrl || "",
            isRecurring: product.isRecurring,
            isAvailable: product.isAvailable,
            isSoldOut: product.isSoldOut,
          }}
        />
      </div>
    </div>
  );
}
