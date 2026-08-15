import type { Metadata } from "next";
import { searchMovies } from "@/services/movie";
import PageShell from "@/components/media/page-shell";
import PosterCard from "@/components/media/poster-card";
import PosterGrid from "@/components/media/poster-grid";
import EmptyState from "@/components/media/empty-state";
import SearchForm from "@/components/search/search-form";

export const revalidate = 300;

type Props = { searchParams: Promise<{ q?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const query = (await searchParams).q?.trim();
  return {
    title: query ? `Cari film “${query}”` : "Cari Film & Serial",
    description: query ? `Hasil pencarian film dan serial untuk “${query}”.` : undefined,
    robots: { index: false, follow: true },
  };
}

export default async function MovieSearchPage({ searchParams }: Props) {
  const query = (await searchParams).q?.trim() ?? "";
  const data = query ? await searchMovies(query) : { page: 1, total_pages: 0, results: [] };

  return (
    <PageShell
      title="Cari Film & Serial"
      crumbs={[
        { label: "Beranda", href: "/" },
        { label: "Film", href: "/movie" },
        { label: "Cari", href: "/movie/search" },
      ]}
      wide
    >
      <SearchForm action="/movie/search" placeholder="Judul film atau serial…" defaultValue={query} />

      {query ? (
        <div className="mt-6">
          <p className="text-muted-foreground mb-3 font-mono text-xs uppercase">
            {data.results.length} hasil untuk “{query}”
          </p>
          {data.results.length ? (
            <PosterGrid>
              {data.results.map((item, index) => (
                <PosterCard
                  key={`${item.media_type}-${item.id}`}
                  href={item.media_type === "tv" ? `/movie/tv/${item.id}` : `/movie/${item.id}`}
                  title={item.title ?? "Tanpa judul"}
                  poster={item.poster}
                  badge={item.media_type === "tv" ? "Serial" : "Film"}
                  rating={item.rating ? item.rating.toFixed(1) : null}
                  meta={item.release_year ? String(item.release_year) : null}
                  priority={index < 7}
                />
              ))}
            </PosterGrid>
          ) : (
            <EmptyState title="Tidak ada hasil" action={{ href: "/movie", label: "Kembali" }} />
          )}
        </div>
      ) : (
        <p className="text-muted-foreground mt-6 text-sm">Ketik judul lalu tekan Enter.</p>
      )}
    </PageShell>
  );
}
