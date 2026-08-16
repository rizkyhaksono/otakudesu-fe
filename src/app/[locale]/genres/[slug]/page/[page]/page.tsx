import type { Metadata } from "next";
import { localeAlternates } from "@/lib/site";
import { notFound } from "next/navigation";
import { getAnimeByGenre } from "@/services/anime";
import PageShell from "@/components/media/page-shell";
import { dictionaryFor } from "@/lib/i18n/server";
import PosterCard from "@/components/media/poster-card";
import PosterGrid from "@/components/media/poster-grid";
import Pager from "@/components/media/pager";
import EmptyState from "@/components/media/empty-state";

export const revalidate = 1800;

type Props = { params: Promise<{ slug: string; page: string; locale: string }> };

const pretty = (slug: string) =>
  slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, page, locale } = await params;
  const t = dictionaryFor(locale);
  const number = Number.parseInt(page, 10);
  const name = pretty(slug);
  const suffix = number > 1 ? ` — ${t.common.page} ${number}` : "";

  return {
    title: `${t.crumbs.anime} ${name}${suffix}`,
    description: `${t.crumbs.anime} · ${name}. ${t.pages.genres.description}`,
    alternates: { canonical: `/genres/${slug}/page/${number}`, languages: localeAlternates(`/genres/${slug}/page/${number}`) },
    robots: number > 1 ? { index: false, follow: true } : undefined,
  };
}

export default async function GenrePagedPage({ params }: Props) {
  const { slug, page, locale } = await params;
  const t = dictionaryFor(locale);
  const number = Number.parseInt(page, 10);
  if (!Number.isInteger(number) || number < 1) notFound();

  const data = await getAnimeByGenre(slug, number);
  if (!data) notFound();

  const name = pretty(slug);

  return (
    <PageShell
      title={`${t.crumbs.genres} ${name}`}
      crumbs={[
        { label: t.crumbs.home, href: "/" },
        { label: t.crumbs.genres, href: "/genres" },
        { label: name, href: `/genres/${slug}` },
      ]}
      wide
    >
      {data.anime.length ? (
        <PosterGrid>
          {data.anime.map((item, index) => (
            <PosterCard
              key={item.slug}
              href={`/anime/${item.slug}`}
              title={item.title ?? t.common.untitled}
              poster={item.poster}
              badge={item.episode_count ? `${item.episode_count} ${t.common.episodesShort}` : null}
              rating={item.rating}
              meta={item.studio}
              priority={index < 7}
            />
          ))}
        </PosterGrid>
      ) : (
        <EmptyState
          title={t.pages.genres.emptyInGenre}
          action={{ href: "/genres", label: t.pages.genres.otherGenres }}
        />
      )}

      {data.pagination ? (
        <Pager
          current={data.pagination.current_page}
          last={data.pagination.last_visible_page}
          href={(target) => `/genres/${slug}/page/${target}`}
        />
      ) : null}
    </PageShell>
  );
}
