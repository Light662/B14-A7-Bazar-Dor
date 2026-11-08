export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div aria-label="পণ্য লোড হচ্ছে" className="product-grid" role="status">
      {Array.from({ length: count }, (_, index) => (
        <div className="product-skeleton" key={index}>
          <span />
          <span />
          <span />
        </div>
      ))}
    </div>
  );
}
