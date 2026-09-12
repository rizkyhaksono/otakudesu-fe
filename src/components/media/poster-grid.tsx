import { cn } from "@/lib/utils";

/**
 * Responsive poster listing. Leftover columns stay transparent — painting the
 * container with `bg-border` turned a short last row into a gray slab.
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
        // No container `bg-border`: leftover columns must stay transparent.
        "stagger",
        "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7",
        className,
      )}
    >
      {children}
    </div>
  );
}
