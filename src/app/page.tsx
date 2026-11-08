import Image from "next/image";
import Link from "next/link";
import { ApiMessage } from "@/components/api-message";
import { ProductCard } from "@/components/product-card";
import { ProductGrid } from "@/components/product-grid";
import { SectionHeading } from "@/components/section-heading";
import { getCategories, getProducts, type Product } from "@/lib/api";
import { formatBengaliNumber } from "@/lib/format";

export default async function HomePage() {
  const [productsResult, categoriesResult] = await Promise.allSettled([
    getProducts(),
    getCategories(),
  ]);

  if (productsResult.status === "rejected") {
    return (
      <main className="page-main content-width">
        <ApiMessage
          message={
            productsResult.reason instanceof Error
              ? productsResult.reason.message
              : "দয়া করে কিছুক্ষণ পরে আবার চেষ্টা করুন।"
          }
        />
      </main>
    );
  }

  const products: Product[] = productsResult.value;
  const categories =
    categoriesResult.status === "fulfilled" ? categoriesResult.value : [];
  const risers = products
    .filter((product) => product.change.dir === "up")
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, 6);
  const fallers = products
    .filter((product) => product.change.dir === "down")
    .sort((a, b) => a.change.pct - b.change.pct)
    .slice(0, 6);

  return (
    <main className="page-main">
      <div className="content-width home-content">
        <section className="hero">
          <div className="hero-copy">
            <span className="date-pill">আজকের বাজারদর</span>
            <h1>আজকের বাজারের দাম এক নজরে</h1>
            <p>চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম জানুন।</p>
            <Link className="button button-primary" href="#সব-পণ্য">
              সব পণ্য দেখুন
            </Link>
          </div>
          <div className="hero-art">
            <Image
              alt="তাজা বাজারের পণ্যে ভরা ঝুড়ি"
              className="hero-image"
              fill
              priority
              sizes="(max-width: 760px) 80vw, 315px"
              src="/bazar-hero.png"
            />
          </div>
        </section>

        <section className="content-section">
          <SectionHeading
            icon="▲"
            title="আজ দাম বেড়েছে"
            tone="up"
            subtitle="গতকালের তুলনায় যেসব পণ্যের দাম বেড়েছে"
          />
          <div className="product-grid">
            {risers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section className="content-section">
          <SectionHeading
            icon="▼"
            title="আজ দাম কমেছে"
            tone="down"
            subtitle="গতকালের তুলনায় যেসব পণ্যের দাম কমেছে"
          />
          <div className="product-grid">
            {fallers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section className="content-section all-products" id="সব-পণ্য">
          <div className="section-heading">
            <div>
              <h2>সব পণ্য</h2>
              <p>
                মোট {formatBengaliNumber(products.length)}টি পণ্যের আজকের বাজারদর
              </p>
            </div>
          </div>
          <ProductGrid
            categories={categories}
            products={products}
            showFilters
          />
        </section>
      </div>
    </main>
  );
}
