import type { Metadata } from "next";
import { localeAlternates } from "@/lib/site";
import { notFound } from "next/navigation";
import { browseComics } from "@/services/comic";
import PageShell from "@/components/media/page-shell";
import PosterCard from "@/components/media/poster-card";
import PosterGrid from "@/components/media/poster-grid";
import Pager from "@/components/media/pager";
import EmptyState from "@/components/media/empty-state";
import CatalogueFilters from "@/components/comic/catalogue-filters";
import { getDictionary } from "@/lib/i18n/server";

export const revalidate = 1800;

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string; genre?: string; q?: string; type?: string; sort?: string }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const [{ t }, { page, genre, q }] = await Promise.all([getDictionary(params), searchParams]);
  const number = Number.parseInt(page ?? "1", 10) || 1;

  const title = q
    ? `${t.crumbs.search} “${q}”`
    : genre
      ? `${t.crumbs.comic} ${genre.replace(/-/g, " ")}`
      : t.pages.comicBrowse.title;

  return {
    title: number > 1 ? `${title} — ${t.common.page} ${number}` : title,
    description: t.pages.comic.description,
    alternates: { canonical: "/comic/browse", languages: localeAlternates("/comic/browse") },
    robots: q || number > 1 ? { index: false, follow: true } : undefined,
  };
}

export default async function ComicBrowsePage({ params, searchParams }: Props) {
  const [{ t, locale }, { page, genre, q, type, sort }] = await Promise.all([
    getDictionary(params),
    searchParams,
  ]);
  const number = Number.parseInt(page ?? "1", 10) || 1;
  if (number < 1) notFound();

  const data = await browseComics({ page: number, genre, q, type, sort });

  const buildHref = (target: number) => {
    const params = new URLSearchParams();
    if (genre) params.set("genre", genre);
    if (q) params.set("q", q);
    if (type) params.set("type", type);
    if (sort) params.set("sort", sort);
    if (target > 1) params.set("page", String(target));
    const query = params.toString();
    return `/comic/browse${query ? `?${query}` : ""}`;
  };

  return (
    <PageShell
      title={t.pages.comicBrowse.title}
      description={
        data.pagination.total
          ? `${data.pagination.total.toLocaleString(locale)} ${t.pages.comicBrowse.indexed}`
          : undefined
      }
      crumbs={[
        { label: t.crumbs.home, href: "/" },
        { label: t.crumbs.comic, href: "/comic" },
        { label: t.crumbs.browse, href: "/comic/browse" },
      ]}
      wide
    >
      <CatalogueFilters genres={data.genres} active={{ genre, type, sort, q }} />

      {data.comics.length ? (
        <>
          <PosterGrid>
            {data.comics.map((item, index) => (
              <PosterCard
                key={item.slug}
                href={`/comic/${item.slug}`}
                title={item.title ?? t.common.untitled}
                poster={item.poster}
                badge={item.type}
                meta={item.latest_chapter?.title}
                rating={item.rating ? item.rating.toFixed(1) : null}
                priority={index < 7}
              />
            ))}
          </PosterGrid>

          <Pager
            current={data.pagination.current_page}
            last={data.pagination.last_page}
            href={buildHref}
          />
        </>
      ) : (
        <EmptyState
          title={t.pages.comicBrowse.emptyTitle}
          description={t.pages.comicBrowse.emptyBody}
          action={{ href: "/comic/browse", label: t.pages.comicBrowse.reset }}
        />
      )}
    </PageShell>
  );
}
