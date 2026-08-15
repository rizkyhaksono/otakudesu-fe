import type { Metadata } from "next";
import { localeAlternates } from "@/lib/site";
import { notFound } from "next/navigation";
import { getAnimeByGenre } from "@/services/anime";
import PageShell from "@/components/media/page-shell";
import PosterCard from "@/components/media/poster-card";
import PosterGrid from "@/components/media/poster-grid";
import Pager from "@/components/media/pager";
import EmptyState from "@/components/media/empty-state";

export const revalidate = 1800;

type Props = { params: Promise<{ slug: string; page: string }> };

const pretty = (slug: string) =>
  slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, page } = await params;
  const number = Number.parseInt(page, 10);
  const name = pretty(slug);
  const suffix = number > 1 ? ` — Halaman ${number}` : "";

  return {
    title: `Anime ${name}${suffix}`,
    description: `Daftar anime genre ${name} subtitle Indonesia, lengkap dengan rating dan sinopsis.`,
    alternates: { canonical: `/genres/${slug}/page/${number}`, languages: localeAlternates(`/genres/${slug}/page/${number}`) },
    robots: number > 1 ? { index: false, follow: true } : undefined,
  };
}

export default async function GenrePagedPage({ params }: Props) {
  const { slug, page } = await params;
  const number = Number.parseInt(page, 10);
  if (!Number.isInteger(number) || number < 1) notFound();

  const data = await getAnimeByGenre(slug, number);
  if (!data) notFound();

  const name = pretty(slug);

  return (
    <PageShell
      title={`Genre ${name}`}
      crumbs={[
        { label: "Beranda", href: "/" },
        { label: "Genre", href: "/genres" },
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
              title={item.title ?? "Tanpa judul"}
              poster={item.poster}
              badge={item.episode_count ? `${item.episode_count} eps` : null}
              rating={item.rating}
              meta={item.studio}
              priority={index < 7}
            />
          ))}
        </PosterGrid>
      ) : (
        <EmptyState
          title="Tidak ada anime di genre ini"
          action={{ href: "/genres", label: "Lihat genre lain" }}
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
