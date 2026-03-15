import { Card, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import Typography from "@/components/ui/typography";
import { TiltCard } from "@/components/ui/tilt-card";

export default function AnimeSearchCard({
  anime
}: Readonly<{
  anime: any
}>) {
  if (!anime || anime === undefined || anime.length === 0) {
    return <div className="text-center">Anime not found!</div>;
  }

  return (
    <div className="grid gap-2 max-[640px]:grid-cols-2 max-[400px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 mb-2">
      {anime?.map((data: any) => (
        <TiltCard key={data?.title} maxRotation={15} perspective={1000} scale={1.03}>
          <Link href={`/anime/${data.slug}`}>
            <Card className="items-center rounded-md transition-all duration-300 hover:border-accent/50 hover:shadow-md h-full overflow-hidden group border-border/70 bg-card/60 backdrop-blur-sm">
              <div className="relative overflow-hidden aspect-[3/4]">
                <Image
                  src={data.poster}
                  alt={data.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  fill
                  sizes="(max-width: 640px) 45vw, (max-width: 768px) 33vw, 20vw"
                  unoptimized
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                
                {/* Play overlay for hover effect */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 mix-blend-plus-lighter z-10 pointer-events-none">
                    <div className="rounded-full bg-white/20 p-3 backdrop-blur-sm border border-white/40">
                      <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path></svg>
                    </div>
                </div>
              </div>
              <div className="mt-4 flex-1 space-y-1 px-4 pb-4">
                <CardTitle className="text-lg line-clamp-1 transition-colors group-hover:text-primary">{data.title}</CardTitle>
                <div className="flex gap-2 text-xs text-muted-foreground pt-1 font-medium">
                  {data?.status && <span>{data.status}</span>}
                  {data?.status && data?.rating && <span>•</span>}
                  {data?.rating && <span className="text-accent">★ {data.rating}</span>}
                </div>
                <div className="flex flex-wrap gap-1 pt-3">
                  {data?.genres?.slice(0, 3).map((genre: any) => (
                    <span key={genre?.slug} className="bg-secondary/80 text-secondary-foreground text-[10px] uppercase font-bold px-2 py-0.5 rounded-full inline-block backdrop-blur-sm">
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
