import type { Metadata } from "next";
import { localeAlternates } from "@/lib/site";
import { notFound } from "next/navigation";
import { browseNovels } from "@/services/comic";
import PageShell from "@/components/media/page-shell";
import PosterCard from "@/components/media/poster-card";
import PosterGrid from "@/components/media/poster-grid";
import Pager from "@/components/media/pager";
import EmptyState from "@/components/media/empty-state";
import SearchForm from "@/components/search/search-form";
import { getDictionary } from "@/lib/i18n/server";

export const revalidate = 1800;

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string; q?: string }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const [{ t }, { page, q }] = await Promise.all([getDictionary(params), searchParams]);
  const number = Number.parseInt(page ?? "1", 10) || 1;

  return {
    title: q
      ? `${t.crumbs.search} “${q}”`
      : number > 1
        ? `${t.pages.comicNovels.title} — ${t.common.page} ${number}`
        : t.pages.comicNovels.title,
    description: t.pages.comic.novelsEyebrow,
    alternates: { canonical: "/comic/novels", languages: localeAlternates("/comic/novels") },
    robots: q || number > 1 ? { index: false, follow: true } : undefined,
  };
}

export default async function NovelsPage({ params, searchParams }: Props) {
  const [{ t, locale }, { page, q }] = await Promise.all([getDictionary(params), searchParams]);
  const number = Number.parseInt(page ?? "1", 10) || 1;
  if (number < 1) notFound();

  const data = await browseNovels({ page: number, q });

  const buildHref = (target: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (target > 1) params.set("page", String(target));
    const query = params.toString();
    return `/comic/novels${query ? `?${query}` : ""}`;
  };

  return (
    <PageShell
      title={t.pages.comicNovels.title}
      description={
        data.pagination.total
          ? `${data.pagination.total.toLocaleString(locale)} ${t.pages.comicBrowse.indexed}`
          : undefined
      }
      crumbs={[
        { label: t.crumbs.home, href: "/" },
        { label: t.crumbs.comic, href: "/comic" },
        { label: t.crumbs.novels, href: "/comic/novels" },
      ]}
      wide
    >
      <div className="mb-6 max-w-md">
        <SearchForm
          action="/comic/novels"
          placeholder={t.pages.comicNovels.searchPlaceholder}
          defaultValue={q}
        />
      </div>

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
          title={t.pages.comicNovels.emptyTitle}
          action={{ href: "/comic/novels", label: t.pages.comicNovels.reset }}
        />
      )}
    </PageShell>
  );
}
