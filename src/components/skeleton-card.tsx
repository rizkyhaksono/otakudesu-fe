import { Skeleton } from "./ui/skeleton";

export default function SkeletonCard() {
  return (
    <div className="container mx-auto mt-10 flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[400px]" />
        <Skeleton className="h-4 w-[300px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}
