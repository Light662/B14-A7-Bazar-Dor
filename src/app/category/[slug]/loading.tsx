import { SkeletonGrid } from "@/components/skeleton-grid";

export default function CategoryLoading() {
  return (
    <main aria-busy="true" className="page-main content-width">
      <div className="loading-category-skeleton" />
      <div className="loading-title-skeleton" />
      <SkeletonGrid count={6} />
    </main>
  );
}
