import { getProducts, type Product } from "@/lib/api";
import { formatBengaliNumber, formatUnit, getPriceMovement } from "@/lib/format";
import { ApiErrorToast } from "@/components/api-error-toast";

export async function PriceTicker() {
  let products: Product[];

  try {
    products = await getProducts();
  } catch (error) {
    return (
      <div className="price-ticker ticker-unavailable" role="status">
        <ApiErrorToast
          message={
            error instanceof Error ? error.message : "বাজারদর লোড করা যায়নি।"
          }
        />
        {error instanceof Error
          ? `আজকের বাজারদর লোড করা যাচ্ছে না: ${error.message}`
          : "আজকের বাজারদর লোড করা যাচ্ছে না।"}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="price-ticker ticker-unavailable" role="status">
        আজকের বাজারদরের তথ্য এখনো পাওয়া যায়নি।
      </div>
    );
  }

  const items = [...products, ...products];

  return (
    <div aria-label="আজকের বাজারদরের সংক্ষিপ্ত তালিকা" className="price-ticker">
      <div className="ticker-track">
        {items.map((product, index) => {
          const movement = getPriceMovement(product.change);
          return (
            <span
              aria-hidden={index >= products.length}
              className={`ticker-item movement-${movement.label}`}
              key={`${product.id}-${index}`}
            >
              <span>{product.image}</span>
              <strong>{product.nameBn}</strong>
              <span>
                {formatBengaliNumber(product.today)} টাকা/{formatUnit(product.unit)}
              </span>
              <span className="ticker-change">
                {movement.arrow} {formatBengaliNumber(movement.percent, 1)}%
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
