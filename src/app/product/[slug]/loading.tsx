import { SkeletonGrid } from "@/components/skeleton-grid";

export default function ProductLoading() {
  return (
    <main aria-busy="true" className="page-main content-width">
      <div className="loading-category-skeleton" />
      <div className="loading-title-skeleton" />
      <SkeletonGrid count={3} />
    </main>
  );
}
