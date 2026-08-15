import { cn } from "@/lib/utils";

/**
 * Hairline grid: cells share one border so a listing reads as a single dense
 * table instead of a set of floating cards.
 */
export default function PosterGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        // Cards settle in sequence rather than all appearing at once.
        "stagger",
        "grid grid-cols-2 gap-px border sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7",
        "bg-border [&>*]:bg-background",
        className,
      )}
    >
      {children}
    </div>
  );
}
