import { notFound } from "next/navigation";
import { ApiMessage } from "@/components/api-message";
import { ProductGrid } from "@/components/product-grid";
import { SectionHeading } from "@/components/section-heading";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/api";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [category, productsResult] = await Promise.all([
    getCategoryBySlug(slug),
    getProductsByCategory(slug).then(
      (products) => ({ products, error: null }),
      (error: unknown) => ({ products: null, error }),
    ),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <main className="page-main content-width">
      <div className="category-heading surface-card">
        <span aria-hidden="true" className="category-hero-icon">
          {category.icon}
        </span>
        <div>
          <h1>{category.nameBn}</h1>
          <p>এই ক্যাটাগরির পণ্যের আজকের দাম ও পরিবর্তন</p>
        </div>
      </div>
      <section className="content-section category-products">
        <SectionHeading title="পণ্যের তালিকা" />
        {productsResult.products ? (
          <ProductGrid products={productsResult.products} showFilters />
        ) : (
          <ApiMessage
            message={
              productsResult.error instanceof Error
                ? productsResult.error.message
                : "ক্যাটাগরির পণ্য লোড করা যায়নি।"
            }
          />
        )}
      </section>
    </main>
  );
}
