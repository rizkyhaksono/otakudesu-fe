import Link from "next/link";
import type { Metadata } from "next";
import { localeAlternates } from "@/lib/site";
import { getComicHome } from "@/services/comic";
import PageShell from "@/components/media/page-shell";
import PosterCard from "@/components/media/poster-card";
import PosterGrid from "@/components/media/poster-grid";
import Section from "@/components/media/section";
import EmptyState from "@/components/media/empty-state";
import { getDictionary } from "@/lib/i18n/server";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { ComicSummary } from "@/types/api";

export const revalidate = 300;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { t } = await getDictionary(params);

  return {
    title: t.pages.comic.title,
    description: t.pages.comic.description,
    alternates: { canonical: "/comic", languages: localeAlternates("/comic") },
  };
}

/** A mapper, not a component factory — the lint rule for the latter is right. */
function cards(items: ComicSummary[], t: Dictionary) {
  return items.map((item) => (
    <PosterCard
      key={item.slug}
      href={`/comic/${item.slug}`}
      title={item.title ?? t.common.untitled}
      poster={item.poster}
      badge={item.type}
      meta={item.latest_chapter?.title}
      rating={item.rating?.toFixed(1)}
    />
  ));
}

export default async function ComicHomePage({ params }: Props) {
  const { t } = await getDictionary(params);
  const home = await getComicHome();
  const hasAny =
    home.latest_manga.length + home.popular_manga.length + home.latest_novels.length > 0;

  return (
    <PageShell
      title={t.pages.comic.title}
      description={t.pages.comic.description}
      crumbs={[
        { label: t.crumbs.home, href: "/" },
        { label: t.crumbs.comic, href: "/comic" },
      ]}
      wide
      actions={
        <div className="flex gap-px bg-border [&>*]:bg-background">
          <Link href="/comic/browse" className="press hover:bg-accent px-3 py-2 text-sm font-medium">
            {t.nav.browse}
          </Link>
          <Link href="/comic/genres" className="press hover:bg-accent px-3 py-2 text-sm font-medium">
            {t.crumbs.genres}
          </Link>
        </div>
      }
    >
      {!hasAny ? (
        <EmptyState
          title={t.pages.comic.downTitle}
          description={t.pages.comic.downBody}
          action={{ href: "/", label: t.pages.news.backHome }}
        />
      ) : null}

      {home.latest_manga.length ? (
        <Section
          title={t.pages.comic.latest}
          eyebrow={t.pages.comic.latestEyebrow}
          href="/comic/browse?sort=latest"
        >
          <PosterGrid>{cards(home.latest_manga, t)}</PosterGrid>
        </Section>
      ) : null}

      {home.popular_manga.length ? (
        <Section
          title={t.pages.comic.popular}
          eyebrow={t.pages.comic.popularEyebrow}
          href="/comic/browse?sort=popular"
        >
          <PosterGrid>{cards(home.popular_manga, t)}</PosterGrid>
        </Section>
      ) : null}

      {home.trending_manga.length ? (
        <Section
          title={t.pages.comic.trending}
          eyebrow={t.pages.comic.trendingEyebrow}
          href="/comic/browse?sort=popular"
        >
          <PosterGrid>{cards(home.trending_manga, t)}</PosterGrid>
        </Section>
      ) : null}

      {home.latest_novels.length ? (
        <Section
          title={t.pages.comic.novels}
          eyebrow={t.pages.comic.novelsEyebrow}
          href="/comic/novels"
        >
          <PosterGrid>{cards(home.latest_novels, t)}</PosterGrid>
        </Section>
      ) : null}
    </PageShell>
  );
}
