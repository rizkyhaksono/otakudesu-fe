import type { Metadata } from "next";
import { searchAnime } from "@/services/anime";
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
    title: query ? `Cari “${query}”` : "Cari Anime",
    description: query
      ? `Hasil pencarian anime untuk “${query}” dengan subtitle Indonesia.`
      : "Cari anime berdasarkan judul.",
    // Search result pages should not compete with real content in the index.
    robots: { index: false, follow: true },
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const query = (await searchParams).q?.trim() ?? "";
  const results = query ? await searchAnime(query) : [];

  return (
    <PageShell
      title="Cari Anime"
      crumbs={[
        { label: "Beranda", href: "/" },
        { label: "Cari", href: "/search" },
      ]}
      wide
    >
      <SearchForm action="/search" placeholder="Judul anime…" defaultValue={query} />

      {query ? (
        <div className="mt-6">
          <p className="text-muted-foreground mb-3 font-mono text-xs uppercase">
            {results.length} hasil untuk “{query}”
          </p>

          {results.length ? (
            <PosterGrid>
              {results.map((item, index) => (
                <PosterCard
                  key={item.slug}
                  href={`/anime/${item.slug}`}
                  title={item.title ?? "Tanpa judul"}
                  poster={item.poster}
                  badge={item.status}
                  rating={item.rating}
                  priority={index < 7}
                />
              ))}
            </PosterGrid>
          ) : (
            <EmptyState
              title="Tidak ada hasil"
              description="Coba kata kunci lain, atau jelajahi lewat genre."
              action={{ href: "/genres", label: "Lihat genre" }}
            />
          )}
        </div>
      ) : (
        <p className="text-muted-foreground mt-6 text-sm">Ketik judul lalu tekan Enter.</p>
      )}
    </PageShell>
  );
}
