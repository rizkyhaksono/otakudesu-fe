import { Skeleton } from "../ui/skeleton";

export default function SkeletonCard() {
  const skeletonIds = ["a", "b", "c", "d", "e"];

  return (
    <div className="mx-2 my-8 grid gap-4 max-[640px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
      {skeletonIds.map((id, index) => (
        <div
          key={id}
          className="overflow-hidden rounded-lg border border-border/60 bg-card/80 p-3"
          style={{ animationDelay: `${index * 80}ms` }}
        >
          <Skeleton className="animate-shimmer h-40 w-full rounded-md sm:h-64 lg:h-72" />
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
