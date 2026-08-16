import { Skeleton } from "@/components/ui/skeleton";

/**
 * A generic `loading.tsx` body: a fake title bar plus a poster grid, shaped
 * like `PageShell` + `PosterGrid` so the layout does not jump once the real
 * content swaps in.
 */
export default function GridSkeleton({ count = 14 }: { count?: number }) {
  return (
    <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6">
      <Skeleton className="h-3 w-32" />
      <div className="mt-3 mb-6 border-b pb-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="mt-2 h-4 w-80" />
      </div>

      <div className="grid grid-cols-2 gap-px border bg-border sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 [&>*]:bg-background">
        {Array.from({ length: count }, (_, index) => (
          <div key={index} className="p-2">
            <Skeleton className="aspect-[2/3] w-full" />
            <Skeleton className="mt-2 h-3 w-3/4" />
            <Skeleton className="mt-1 h-3 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
