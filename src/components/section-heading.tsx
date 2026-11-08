export function SectionHeading({
  title,
  subtitle,
  icon,
  tone,
}: {
  title: string;
  subtitle?: string;
  icon?: string;
  tone?: "up" | "down";
}) {
  return (
    <div className="section-heading">
      <div>
        <h2>
          {icon && <span className={`heading-icon ${tone ? `movement-${tone}` : ""}`}>{icon}</span>}
          {title}
        </h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </div>
  );
}
