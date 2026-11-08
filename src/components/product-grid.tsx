"use client";

import { useMemo, useState } from "react";
import type { Category, Product } from "@/lib/api";
import { parseLocalizedNumber } from "@/lib/format";
import { ProductCard } from "@/components/product-card";

type SortOrder = "default" | "ascending" | "descending";

export function ProductGrid({
  products,
  showFilters = false,
  categories = [],
}: {
  products: Product[];
  showFilters?: boolean;
  categories?: Category[];
}) {
  const [sortOrder, setSortOrder] = useState<SortOrder>("default");
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const visibleProducts = useMemo(() => {
    const filtered = products.filter(
      (product) =>
        (selectedCategory === "all" || product.category === selectedCategory) &&
        product.nameBn
          .toLocaleLowerCase()
          .includes(query.trim().toLocaleLowerCase()),
    );

    if (sortOrder === "ascending") {
      return [...filtered].sort(
        (a, b) => parseLocalizedNumber(a.today) - parseLocalizedNumber(b.today),
      );
    }
    if (sortOrder === "descending") {
      return [...filtered].sort(
        (a, b) => parseLocalizedNumber(b.today) - parseLocalizedNumber(a.today),
      );
    }
    return filtered;
  }, [products, query, selectedCategory, sortOrder]);

  return (
    <>
      {showFilters && (
        <>
          <div className="product-toolbar">
            <label className="search-field">
              <span aria-hidden="true">⌕</span>
              <input
                onChange={(event) => setQuery(event.target.value)}
                placeholder="পণ্যের নাম লিখুন…"
                value={query}
              />
            </label>
            <span className="product-count">
              মোট {new Intl.NumberFormat("bn-BD").format(visibleProducts.length)}টি
              পণ্য দেখানো হচ্ছে
            </span>
            <label className="sort-field">
              <span>সাজান</span>
              <select
                onChange={(event) => setSortOrder(event.target.value as SortOrder)}
                value={sortOrder}
              >
                <option value="default">ডিফল্ট</option>
                <option value="ascending">দাম: কম থেকে বেশি</option>
                <option value="descending">দাম: বেশি থেকে কম</option>
              </select>
            </label>
          </div>
          {categories.length > 0 && (
            <div aria-label="ক্যাটাগরি অনুযায়ী পণ্য দেখুন" className="filter-chips">
              <button
                aria-pressed={selectedCategory === "all"}
                className={selectedCategory === "all" ? "filter-chip active" : "filter-chip"}
                onClick={() => setSelectedCategory("all")}
                type="button"
              >
                সব
              </button>
              {categories.map((category) => (
                <button
                  aria-pressed={selectedCategory === category.slug}
                  className={
                    selectedCategory === category.slug
                      ? "filter-chip active"
                      : "filter-chip"
                  }
                  key={category.slug}
                  onClick={() => setSelectedCategory(category.slug)}
                  type="button"
                >
                  <span>{category.icon}</span>
                  {category.nameBn}
                </button>
              ))}
            </div>
          )}
        </>
      )}
      {visibleProducts.length > 0 ? (
        <div className="product-grid">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="empty-state">এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি।</div>
      )}
    </>
  );
}
