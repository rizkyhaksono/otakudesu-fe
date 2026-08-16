import type { Metadata } from "next";
import { searchMovies } from "@/services/movie";
import PageShell from "@/components/media/page-shell";
import PosterCard from "@/components/media/poster-card";
import PosterGrid from "@/components/media/poster-grid";
import EmptyState from "@/components/media/empty-state";
import SearchForm from "@/components/search/search-form";
import { getDictionary } from "@/lib/i18n/server";

export const revalidate = 300;

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const [{ t }, { q }] = await Promise.all([getDictionary(params), searchParams]);
  const query = q?.trim();

  return {
    title: query ? `${t.crumbs.search} “${query}”` : t.pages.movie.searchTitle,
    description: query ? `${t.common.resultsFor} “${query}”.` : undefined,
    robots: { index: false, follow: true },
  };
}

export default async function MovieSearchPage({ params, searchParams }: Props) {
  const [{ t }, search] = await Promise.all([getDictionary(params), searchParams]);
  const query = search.q?.trim() ?? "";
  const data = query ? await searchMovies(query) : { page: 1, total_pages: 0, results: [] };

  return (
    <PageShell
      title={t.pages.movie.searchTitle}
      crumbs={[
        { label: t.crumbs.home, href: "/" },
        { label: t.crumbs.movie, href: "/movie" },
        { label: t.crumbs.search, href: "/movie/search" },
      ]}
      wide
    >
      <SearchForm
        action="/movie/search"
        placeholder={t.pages.movie.searchInputPlaceholder}
        defaultValue={query}
      />

      {query ? (
        <div className="mt-6">
          <p className="text-muted-foreground mb-3 font-mono text-xs uppercase">
            {data.results.length} {t.common.resultsFor} “{query}”
          </p>
          {data.results.length ? (
            <PosterGrid>
              {data.results.map((item, index) => (
                <PosterCard
                  key={`${item.media_type}-${item.id}`}
                  href={item.media_type === "tv" ? `/movie/tv/${item.id}` : `/movie/${item.id}`}
                  title={item.title ?? t.common.untitled}
                  poster={item.poster}
                  badge={item.media_type === "tv" ? t.crumbs.tv : t.crumbs.movie}
                  rating={item.rating ? item.rating.toFixed(1) : null}
                  meta={item.release_year ? String(item.release_year) : null}
                  priority={index < 7}
                />
              ))}
            </PosterGrid>
          ) : (
            <EmptyState
              title={t.pages.movie.noResults}
              action={{ href: "/movie", label: t.common.back }}
            />
          )}
        </div>
      ) : (
        <p className="text-muted-foreground mt-6 text-sm">{t.pages.movie.searchInputPlaceholder}</p>
      )}
    </PageShell>
  );
}
