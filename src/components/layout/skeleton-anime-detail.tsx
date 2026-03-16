import { Skeleton } from "../ui/skeleton";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Separator } from "../ui/separator";

const shimmerStyle = {
  background:
    "linear-gradient(105deg, hsl(var(--muted)) 40%, hsl(var(--muted-foreground)/0.08) 50%, hsl(var(--muted)) 60%)",
};

export default function SkeletonAnimeDetail() {
  return (
    <div className="container mx-auto mt-6 px-4 pb-12">
      <Card className="overflow-hidden border-border/60">
        <CardHeader className="pb-2">
          <Skeleton className="h-7 w-2/3 sm:w-1/3" />
        </CardHeader>

        <CardContent>
          {/* Hero section: poster + info */}
          <div className="flex flex-col gap-6 md:flex-row">
            {/* Poster shimmer */}
            <div className="flex-shrink-0">
              <div
                className="animate-shimmer h-72 w-full rounded-xl sm:h-80 md:h-96 md:w-60 lg:w-72 [background-size:400%_100%]"
                style={shimmerStyle}
              />
            </div>

            {/* Info block */}
            <div className="flex flex-1 flex-col gap-3">
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>

              <Separator />

              {/* Badge row: Rating / Type / Status */}
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {["w-20", "w-16", "w-24"].map((w) => (
                  <div key={w} className="flex items-center gap-2">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className={`h-6 ${w} rounded-full`} />
                  </div>
                ))}
              </div>

              {/* Genre badges */}
              <div className="flex flex-wrap items-center gap-1">
                <Skeleton className="h-4 w-14" />
                {["w-16", "w-20", "w-14", "w-18"].map((w) => (
                  <Skeleton key={w} className={`h-6 ${w} rounded-full`} />
                ))}
              </div>
            </div>
          </div>

          {/* Episode grid */}
          <div className="mt-6">
            <Skeleton className="mb-3 h-5 w-24" />
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-full rounded-lg" />
              ))}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Recommendations section */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-5 w-1 rounded-full bg-primary" />
              <Skeleton className="h-5 w-32" />
            </div>
            <div className="grid gap-3 max-[640px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5">
              {["a", "b", "c", "d", "e"].map((id) => (
                <div
                  key={id}
                  className="overflow-hidden rounded-lg border border-border/60 bg-card/90"
                >
                  <div
                    className="animate-shimmer w-full rounded-t-sm max-[640px]:h-36 sm:h-52 md:h-48 lg:h-52 [background-size:400%_100%]"
                    style={shimmerStyle}
                  />
                  <div className="space-y-1 px-3 py-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
