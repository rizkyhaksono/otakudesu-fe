import type { Metadata } from "next";
import { localeAlternates } from "@/lib/site";
import { notFound } from "next/navigation";
import { getOngoingAnime } from "@/services/anime";
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
    title: `${t.pages.ongoing.title}${suffix}`,
    description: `${t.pages.ongoing.description}${suffix}`,
    alternates: { canonical: `/ongoing-anime/${page}`, languages: localeAlternates(`/ongoing-anime/${page}`) },
    robots: page > 1 ? { index: false, follow: true } : undefined,
  };
}

export default async function OngoingPage({ params }: Props) {
  const { page: raw, locale } = await params;
  const page = parsePage(raw);
  if (Number.isNaN(page)) notFound();

  const t = dictionaryFor(locale);

  const { ongoingAnimeData, paginationData } = await getOngoingAnime(page);
  if (!ongoingAnimeData.length && page > 1) notFound();

  return (
    <PageShell
      title={t.pages.ongoing.title}
      description={t.pages.ongoing.description}
      crumbs={[
        { label: t.crumbs.home, href: "/" },
        { label: t.crumbs.ongoing, href: "/ongoing-anime/1" },
      ]}
      wide
    >
      {ongoingAnimeData.length ? (
        <PosterGrid>
          {ongoingAnimeData.map((item, index) => (
            <PosterCard
              key={item.slug}
              href={`/anime/${item.slug}`}
              title={item.title ?? t.common.untitled}
              poster={item.poster}
              badge={item.current_episode?.replace(/episode/i, "Eps")}
              meta={item.release_day}
              accent="ongoing"
              priority={index < 7}
            />
          ))}
        </PosterGrid>
      ) : (
        <EmptyState
          title={t.pages.ongoing.emptyTitle}
          description={t.pages.ongoing.emptyBody}
          action={{ href: "/", label: t.pages.news.backHome }}
        />
      )}

      {paginationData ? (
        <Pager
          current={paginationData.current_page}
          last={paginationData.last_visible_page}
          href={(target) => `/ongoing-anime/${target}`}
        />
      ) : null}
    </PageShell>
  );
}
