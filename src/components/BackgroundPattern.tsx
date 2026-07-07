import { useContent } from "@/lib/content";

export function ContentBackground({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { content } = useContent();
  const pattern = content.background?.pattern;
  const opacity = content.background?.opacity ?? 0.08;
  const color = content.background?.color || "var(--background)";

  if (!pattern) return <>{children}</>;

  return (
    <div className={`relative min-h-full ${className}`}>
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundColor: color,
          backgroundImage: `url(${pattern})`,
          backgroundRepeat: "repeat",
          backgroundSize: "auto",
          backgroundPosition: "top left",
          backgroundAttachment: "fixed",
          opacity: Math.max(0, Math.min(1, opacity)),
        }}
        aria-hidden="true"
      />
      <div className="relative">{children}</div>
    </div>
  );
}
