import type { Metadata } from "next";
import { localeAlternates } from "@/lib/site";
import { notFound } from "next/navigation";
import { getCompleteAnime } from "@/services/anime";
import PageShell from "@/components/media/page-shell";
import { dictionaryFor } from "@/lib/i18n/server";
import PosterCard from "@/components/media/poster-card";
import PosterGrid from "@/components/media/poster-grid";
import Pager from "@/components/media/pager";
import EmptyState from "@/components/media/empty-state";

export const revalidate = 300;

type Props = { params: Promise<{ page: string; locale: string }> };

function parsePage(value: string): number {
  const page = Number.parseInt(value, 10);
  return Number.isInteger(page) && page > 0 ? page : NaN;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { page: raw, locale } = await params;
  const page = parsePage(raw);
  if (Number.isNaN(page)) return {};

  const t = dictionaryFor(locale);
  const suffix = page > 1 ? ` — ${t.common.page} ${page}` : "";
  return {
    title: `${t.pages.completed.title}${suffix}`,
    description: `${t.pages.completed.description}${suffix}`,
    alternates: { canonical: `/completed-anime/${page}`, languages: localeAlternates(`/completed-anime/${page}`) },
    robots: page > 1 ? { index: false, follow: true } : undefined,
  };
}

export default async function CompletedPage({ params }: Props) {
  const { page: raw, locale } = await params;
  const page = parsePage(raw);
  if (Number.isNaN(page)) notFound();

  const t = dictionaryFor(locale);

  const { completeAnimeData, paginationData } = await getCompleteAnime(page);
  if (!completeAnimeData.length && page > 1) notFound();

  return (
    <PageShell
      title={t.pages.completed.title}
      description={t.pages.completed.description}
      crumbs={[
        { label: t.crumbs.home, href: "/" },
        { label: t.crumbs.completed, href: "/completed-anime/1" },
      ]}
      wide
    >
      {completeAnimeData.length ? (
        <PosterGrid>
          {completeAnimeData.map((item, index) => (
            <PosterCard
              key={item.slug}
              href={`/anime/${item.slug}`}
              title={item.title ?? t.common.untitled}
              poster={item.poster}
              badge={item.episode_count ? `${item.episode_count} ${t.common.episodesShort}` : null}
              rating={item.rating}
              meta={item.last_release_date}
              accent="completed"
              priority={index < 7}
            />
          ))}
        </PosterGrid>
      ) : (
        <EmptyState
          title={t.pages.completed.emptyTitle}
          description={t.pages.completed.emptyBody}
          action={{ href: "/", label: t.pages.news.backHome }}
        />
      )}

      {paginationData ? (
        <Pager
          current={paginationData.current_page}
          last={paginationData.last_visible_page}
          href={(target) => `/completed-anime/${target}`}
        />
      ) : null}
    </PageShell>
  );
}
