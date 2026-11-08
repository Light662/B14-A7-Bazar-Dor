export interface MarketPrice {
  market: string;
  division: string;
  min: number;
  max: number;
}

export interface Product {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
  markets: MarketPrice[];
}

export interface Category {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
}

const API_BASES = [
  "https://openapi.programming-hero.com/api/bazardor",
  "https://api.api-store.workers.dev/api/bazardor",
  "https://api.abcz.workers.dev/api/bazardor",
];

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function getJson<T>(path: string): Promise<T> {
  let lastError: Error | undefined;

  for (const base of API_BASES) {
    try {
      const response = await fetch(`${base}${path}`, {
        next: { revalidate: 300 },
      });

      if (!response.ok) {
        throw new ApiError(
          `The data service returned HTTP ${response.status} for ${path}.`,
          response.status,
        );
      }

      return (await response.json()) as T;
    } catch (error) {
      lastError =
        error instanceof Error ? error : new Error("Unknown API request error.");
    }
  }

  throw new ApiError(
    `Could not load market data after trying all API servers. ${lastError?.message ?? ""}`,
    lastError instanceof ApiError ? lastError.status : undefined,
  );
}

export function getProducts(): Promise<Product[]> {
  return getJson<Product[]>("/products");
}

export function getProductsByCategory(slug: string): Promise<Product[]> {
  return getJson<Product[]>(`/products?category=${encodeURIComponent(slug)}`);
}

export function getProductBySlug(slug: string): Promise<Product | null> {
  return getJson<Product[]>(
    `/products?slug=${encodeURIComponent(slug)}`,
  ).then((products) => products[0] ?? null);
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  try {
    return await getJson<Category>(`/categories/${encodeURIComponent(slug)}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export function getCategories(): Promise<Category[]> {
  return getJson<Category[]>("/categories");
}

export function getMarketPriceSummary(markets: MarketPrice[]) {
  const prices = markets.flatMap((market) => [market.min, market.max]);

  if (prices.length === 0) {
    return null;
  }

  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
    average:
      markets.reduce((total, market) => total + (market.min + market.max) / 2, 0) /
      markets.length,
  };
}
