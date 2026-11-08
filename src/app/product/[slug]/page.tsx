import Link from "next/link";
import { notFound } from "next/navigation";
import { ApiMessage } from "@/components/api-message";
import { getMarketPriceSummary, getProductBySlug } from "@/lib/api";
import { formatBengaliNumber, formatPrice, formatUnit } from "@/lib/format";
import { requireSession } from "@/lib/session";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let product;
  try {
    product = await getProductBySlug(slug);
  } catch (error) {
    return (
      <main className="page-main content-width">
        <ApiMessage
          message={
            error instanceof Error
              ? error.message
              : "পণ্যের তথ্য লোড করা যায়নি।"
          }
        />
      </main>
    );
  }

  if (!product) {
    notFound();
  }

  await requireSession(`/product/${slug}`);

  const summary = getMarketPriceSummary(product.markets);

  return (
    <main className="page-main content-width product-detail-page">
      <nav aria-label="Breadcrumb" className="breadcrumbs">
        <Link href="/">হোম</Link>
        <span aria-hidden="true">›</span>
        <Link href={`/category/${product.category}`}>{product.categoryNameBn}</Link>
        <span aria-hidden="true">›</span>
        <span aria-current="page">{product.nameBn}</span>
      </nav>
      <section className="product-detail-heading surface-card">
        <span aria-hidden="true" className="detail-product-icon">
          {product.image}
        </span>
        <div className="detail-product-copy">
          <h1>{product.nameBn}</h1>
          <p>প্রতি {formatUnit(product.unit)} · {product.categoryNameBn}</p>
          <p className="market-summary">
            {product.change.dir === "up"
              ? `গতকালের তুলনায় আজ দাম বেড়েছে · ${formatBengaliNumber(Math.abs(product.today - product.yesterday))} টাকা`
              : product.change.dir === "down"
                ? `গতকালের তুলনায় আজ দাম কমেছে · ${formatBengaliNumber(Math.abs(product.today - product.yesterday))} টাকা`
                : "গতকালের তুলনায় আজ দামে কোনো পরিবর্তন নেই"}
          </p>
        </div>
        <div className="today-price">
          <span>আজকের দাম</span>
          <strong>{formatBengaliNumber(product.today)}</strong>
          <span>টাকা / {formatUnit(product.unit)}</span>
          <span className={`price-badge movement-${product.change.dir}`}>
            {product.change.dir === "up"
              ? "▲"
              : product.change.dir === "down"
                ? "▼"
                : "•"}
            {" "}{formatBengaliNumber(Math.abs(product.change.pct), 1)}%
          </span>
        </div>
      </section>

      <section className="surface-card detail-section">
        <h2>দামের সারসংক্ষেপ</h2>
        {summary ? (
          <div className="summary-grid">
            <article className="summary-stat">
              <span>সর্বনিম্ন দাম</span>
              <strong>{formatPrice(summary.min)}</strong>
              <small>বাজারের সর্বনিম্ন তালিকাভুক্ত দাম</small>
            </article>
            <article className="summary-stat">
              <span>সর্বোচ্চ দাম</span>
              <strong>{formatPrice(summary.max)}</strong>
              <small>বাজারের সর্বোচ্চ তালিকাভুক্ত দাম</small>
            </article>
            <article className="summary-stat">
              <span>বাজার গড়</span>
              <strong>{formatPrice(summary.average)}</strong>
              <small>প্রতি বাজারের সর্বনিম্ন ও সর্বোচ্চের মধ্যবিন্দুর গড়</small>
            </article>
          </div>
        ) : (
          <p className="empty-state">দামের সারসংক্ষেপ পাওয়া যায়নি।</p>
        )}
      </section>

      <section className="surface-card detail-section">
        <h2>বাজারভিত্তিক আজকের দাম</h2>
        {product.markets.length ? (
          <div className="market-table-wrap">
            <table className="market-table">
              <thead>
                <tr>
                  <th>বাজার</th>
                  <th>বিভাগ</th>
                  <th>সর্বনিম্ন</th>
                  <th>সর্বাধিক</th>
                  <th>গড়*</th>
                </tr>
              </thead>
              <tbody>
                {product.markets.map((market) => (
                  <tr key={`${market.market}-${market.division}`}>
                    <td>{market.market}</td>
                    <td>{market.division}</td>
                    <td>{formatPrice(market.min)}</td>
                    <td>{formatPrice(market.max)}</td>
                    <td>{formatPrice((market.min + market.max) / 2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="empty-state">এই পণ্যের বাজারভিত্তিক তথ্য পাওয়া যায়নি।</p>
        )}
        <p className="table-note">
          * গড় প্রতিটি বাজারের সর্বনিম্ন ও সর্বোচ্চ দামের মধ্যবিন্দু থেকে হিসাব করা।
        </p>
      </section>
    </main>
  );
}
