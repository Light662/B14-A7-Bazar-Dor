"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Category } from "@/lib/api";

export function CategoryNavigation({
  categories,
}: {
  categories: Category[];
}) {
  const pathname = usePathname();

  return (
    <nav aria-label="পণ্যের ক্যাটাগরি" className="content-width category-nav-inner">
      {categories.map((category) => {
        const href = `/category/${category.slug}`;
        const isCurrent = pathname === href;
        return (
          <Link
            aria-current={isCurrent ? "page" : undefined}
            className="nav-chip"
            href={href}
            key={category.slug}
          >
            <span>{category.icon}</span>
            {category.nameBn}
          </Link>
        );
      })}
    </nav>
  );
}
