import Link from "next/link";
import type { Product } from "@/lib/api";
import {
  formatBengaliNumber,
  formatPrice,
  formatUnit,
  getPriceMovement,
} from "@/lib/format";

export function ProductCard({ product }: { product: Product }) {
  const movement = getPriceMovement(product.change);

  return (
    <Link className="product-card" href={`/product/${product.slug}`}>
      <div className="product-card-top">
        <span aria-hidden="true" className="product-icon">
          {product.image || product.categoryIcon}
        </span>
        <span className="product-title">
          <strong>{product.nameBn}</strong>
          <span>প্রতি {formatUnit(product.unit)}</span>
        </span>
      </div>
      <div className="product-card-bottom">
        <span className="product-price">
          <span>আজকের দাম</span>
          <strong>{formatPrice(product.today)}</strong>
        </span>
        <span className={`price-badge movement-${movement.label}`}>
          <span>{movement.arrow}</span>
          {formatBengaliNumber(movement.percent, 1)}%
        </span>
      </div>
    </Link>
  );
}
