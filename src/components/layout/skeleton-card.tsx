import { Skeleton } from "../ui/skeleton";

export default function SkeletonCard() {
  const skeletonIds = ["a", "b", "c", "d", "e"];

  return (
    <div className="mx-2 my-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {skeletonIds.map((id, index) => (
        <div
          key={id}
          className="overflow-hidden rounded-lg border border-border/60 bg-card/80 p-3"
          style={{ animationDelay: `${index * 80}ms` }}
        >
          <div
            className="h-40 w-full animate-shimmer rounded-md [background-size:400%_100%] sm:h-64 lg:h-72"
            style={{
              background:
                "linear-gradient(105deg, hsl(var(--muted)) 40%, hsl(var(--muted-foreground)/0.08) 50%, hsl(var(--muted)) 60%)",
            }}
          />
          <div className="mt-4 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
