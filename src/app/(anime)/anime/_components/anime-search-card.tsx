import { Card, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import Typography from "@/components/ui/typography";
import { TiltCard } from "@/components/ui/tilt-card";

export default function AnimeSearchCard({
  anime,
}: Readonly<{
  anime: any;
}>) {
  if (!anime || anime === undefined || anime.length === 0) {
    return <div className="text-center">Anime not found!</div>;
  }

  return (
    <div className="mb-2 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5">
      {anime?.map((data: any) => (
        <TiltCard key={data?.title} maxRotation={15} perspective={1000} scale={1.03}>
          <Link href={`/anime/${data.slug}`}>
            <Card className="group h-full items-center overflow-hidden rounded-md border-border/70 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:border-accent/50 hover:shadow-md">
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={data.poster}
                  alt={data.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  fill
                  sizes="(max-width: 640px) 45vw, (max-width: 768px) 33vw, 20vw"
                  unoptimized
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Play overlay for hover effect */}
                <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center opacity-0 mix-blend-plus-lighter transition-opacity duration-300 group-hover:opacity-100">
                  <div className="rounded-full border border-white/40 bg-white/20 p-3 backdrop-blur-sm">
                    <svg
                      className="ml-1 h-8 w-8 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex-1 space-y-1 px-4 pb-4">
                <CardTitle className="line-clamp-2 text-base transition-colors group-hover:text-primary sm:text-lg">
                  {data.title}
                </CardTitle>
                <div className="flex gap-2 pt-1 text-xs font-medium text-muted-foreground">
                  {data?.status && <span>{data.status}</span>}
                  {data?.status && data?.rating && <span>•</span>}
                  {data?.rating && <span className="text-accent">★ {data.rating}</span>}
                </div>
                <div className="flex flex-wrap gap-1 pt-3">
                  {data?.genres?.slice(0, 3).map((genre: any) => (
                    <span
                      key={genre?.slug}
                      className="inline-block rounded-full bg-secondary/80 px-2 py-0.5 text-[10px] font-bold uppercase text-secondary-foreground backdrop-blur-sm"
                    >
                      {genre?.name}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          </Link>
        </TiltCard>
      ))}
    </div>
  );
}
