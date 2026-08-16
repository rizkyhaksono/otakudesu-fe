import type { Metadata } from "next";
import { localeAlternates } from "@/lib/site";
import { getMovieHome } from "@/services/movie";
import { isBackendReachable } from "@/lib/api";
import BackendDown from "@/components/media/backend-down";
import PageShell from "@/components/media/page-shell";
import PosterCard from "@/components/media/poster-card";
import PosterGrid from "@/components/media/poster-grid";
import Section from "@/components/media/section";
import EmptyState from "@/components/media/empty-state";
import SearchForm from "@/components/search/search-form";
import { getDictionary } from "@/lib/i18n/server";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { MovieSummary } from "@/types/api";

export const revalidate = 3600;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { t } = await getDictionary(params);

  return {
    title: t.pages.movie.title,
    description: t.pages.movie.description,
    alternates: { canonical: "/movie", languages: localeAlternates("/movie") },
  };
}

/** A mapper, not a component factory — the lint rule for the latter is right. */
function cards(items: MovieSummary[], t: Dictionary) {
  return items.map((item) => (
    <PosterCard
      key={`${item.media_type}-${item.id}`}
      href={item.media_type === "tv" ? `/movie/tv/${item.id}` : `/movie/${item.id}`}
      title={item.title ?? "—"}
      poster={item.poster}
      badge={item.media_type === "tv" ? t.crumbs.tv : t.crumbs.movie}
      rating={item.rating ? item.rating.toFixed(1) : null}
      meta={item.release_year ? String(item.release_year) : null}
    />
  ));
}

export default async function MovieHomePage({ params }: Props) {
  const { t } = await getDictionary(params);
  const home = await getMovieHome();
  const empty =
    home.trending.length + home.popular_movies.length + home.popular_tv.length === 0;

  // Only pay for the health check when there is nothing to show — an empty
  // section has two very different causes and they need different advice.
  const backendUp = empty ? await isBackendReachable() : true;

  return (
    <PageShell
      title={t.pages.movie.title}
      description={t.pages.movie.description}
      crumbs={[
        { label: t.crumbs.home, href: "/" },
        { label: t.crumbs.movie, href: "/movie" },
      ]}
      wide
      actions={
        <div className="w-full sm:w-80">
          <SearchForm action="/movie/search" placeholder={t.pages.movie.searchPlaceholder} />
        </div>
      }
    >
      {empty && !backendUp ? <BackendDown /> : null}

      {empty && backendUp ? (
        <EmptyState
          title={t.pages.movie.notConfiguredTitle}
          description={t.pages.movie.notConfiguredBody}
          action={{ href: "/", label: t.pages.news.backHome }}
        />
      ) : null}

      {home.trending.length ? (
        <Section
          title={t.pages.movie.trending}
          eyebrow={t.pages.movie.trendingEyebrow}
          href="/movie/browse?category=trending"
        >
          <PosterGrid>{cards(home.trending, t)}</PosterGrid>
        </Section>
      ) : null}

      {home.popular_movies.length ? (
        <Section
          title={t.pages.movie.popularMovies}
          eyebrow={t.pages.movie.popularMoviesEyebrow}
          href="/movie/browse?category=popular"
        >
          <PosterGrid>{cards(home.popular_movies, t)}</PosterGrid>
        </Section>
      ) : null}

      {home.popular_tv.length ? (
        <Section
          title={t.pages.movie.popularSeries}
          eyebrow={t.pages.movie.popularSeriesEyebrow}
          href="/movie/browse?category=tv"
        >
          <PosterGrid>{cards(home.popular_tv, t)}</PosterGrid>
        </Section>
      ) : null}
    </PageShell>
  );
}
