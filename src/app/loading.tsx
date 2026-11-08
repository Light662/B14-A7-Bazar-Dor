import { SkeletonGrid } from "@/components/skeleton-grid";

export default function Loading() {
  return (
    <main aria-busy="true" className="page-main content-width">
      <div className="loading-title-skeleton" />
      <SkeletonGrid count={9} />
    </main>
  );
}
