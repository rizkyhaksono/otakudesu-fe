import { Skeleton } from "@/components/ui/skeleton";

/** `loading.tsx` body for a poster + facts detail page (anime, comic, movie). */
export default function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6">
      <Skeleton className="h-3 w-40" />
      <div className="mt-3 mb-6 border-b pb-4">
        <Skeleton className="h-8 w-96 max-w-full" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <div>
          <Skeleton className="aspect-[2/3] w-full" />
          <Skeleton className="mt-3 h-10 w-full" />
          <Skeleton className="mt-2 h-10 w-full" />
        </div>
        <div className="min-w-0">
          <Skeleton className="mb-4 h-8 w-24" />
          <div className="mb-4 flex flex-wrap gap-1.5">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="h-6 w-16" />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-px border bg-border sm:grid-cols-4 [&>*]:bg-background">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="p-3">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="mt-1.5 h-4 w-20" />
              </div>
            ))}
          </div>
          <Skeleton className="mt-6 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-2/3" />
        </div>
      </div>
    </div>
  );
}
