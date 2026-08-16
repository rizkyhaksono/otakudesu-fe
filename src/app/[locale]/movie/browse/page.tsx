import Link from "next/link";
import type { Metadata } from "next";
import { localeAlternates } from "@/lib/site";
import { notFound } from "next/navigation";
import { listMovies, type MovieCategory } from "@/services/movie";
import PageShell from "@/components/media/page-shell";
import PosterCard from "@/components/media/poster-card";
import PosterGrid from "@/components/media/poster-grid";
import Pager from "@/components/media/pager";
import EmptyState from "@/components/media/empty-state";
import { isBackendReachable } from "@/lib/api";
import BackendDown from "@/components/media/backend-down";
import { cn } from "@/lib/utils";
import { getDictionary } from "@/lib/i18n/server";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export const revalidate = 3600;

/** The value is the URL contract; the label is looked up per locale. */
const CATEGORIES: { value: MovieCategory; key: keyof Dictionary["pages"]["movie"] }[] = [
  { value: "trending", key: "categoryTrending" },
  { value: "popular", key: "categoryPopularMovies" },
  { value: "top-rated", key: "categoryTopRatedMovies" },
  { value: "tv", key: "categoryPopularSeries" },
  { value: "tv-top-rated", key: "categoryTopRatedSeries" },
];

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; page?: string }>;
};

function resolve(value?: string) {
  return CATEGORIES.find((entry) => entry.value === value) ?? CATEGORIES[0]!;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const [{ t }, { category, page }] = await Promise.all([getDictionary(params), searchParams]);
  const active = resolve(category);
  const label = t.pages.movie[active.key];
  const number = Number.parseInt(page ?? "1", 10) || 1;

  return {
    title: number > 1 ? `${label} — ${t.common.page} ${number}` : label,
    description: t.pages.movie.description,
    alternates: { canonical: `/movie/browse?category=${active.value}`, languages: localeAlternates(`/movie/browse?category=${active.value}`) },
    robots: number > 1 ? { index: false, follow: true } : undefined,
  };
}

export default async function MovieBrowsePage({ params, searchParams }: Props) {
  const [{ t }, { category, page }] = await Promise.all([getDictionary(params), searchParams]);
  const active = resolve(category);
  const label = t.pages.movie[active.key];
  const number = Number.parseInt(page ?? "1", 10) || 1;
  if (number < 1) notFound();

  const data = await listMovies(active.value, number);
  const empty = data.results.length === 0;
  const backendUp = empty ? await isBackendReachable() : true;

  const buildHref = (target: number) =>
    `/movie/browse?category=${active.value}${target > 1 ? `&page=${target}` : ""}`;

  return (
    <PageShell
      title={label}
      description={t.pages.movie.description}
      crumbs={[
        { label: t.crumbs.home, href: "/" },
        { label: t.crumbs.movie, href: "/movie" },
        { label, href: `/movie/browse?category=${active.value}` },
      ]}
      wide
    >
      <nav aria-label={t.pages.tv.categories} className="mb-6 flex flex-wrap gap-px bg-border">
        {CATEGORIES.map((entry) => (
          <Link
            key={entry.value}
            href={`/movie/browse?category=${entry.value}`}
            className={cn(
              "press px-3 py-1.5 font-mono text-xs uppercase",
              entry.value === active.value
                ? "bg-primary text-primary-foreground font-semibold"
                : "bg-background hover:bg-accent",
            )}
          >
            {t.pages.movie[entry.key]}
          </Link>
        ))}
      </nav>

      {empty && !backendUp ? <BackendDown /> : null}

      {empty && backendUp ? (
        <EmptyState
          title={t.pages.movie.emptyTitle}
          description={t.pages.movie.emptyBody}
          action={{ href: "/", label: t.pages.news.backHome }}
        />
      ) : null}

      {data.results.length ? (
        <>
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
          <Pager current={data.page} last={data.total_pages} href={buildHref} />
        </>
      ) : null}
    </PageShell>
  );
}
