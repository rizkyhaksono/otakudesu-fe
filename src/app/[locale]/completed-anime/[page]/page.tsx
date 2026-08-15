import type { Metadata } from "next";
import { localeAlternates } from "@/lib/site";
import { notFound } from "next/navigation";
import { getCompleteAnime } from "@/services/anime";
import PageShell from "@/components/media/page-shell";
import PosterCard from "@/components/media/poster-card";
import PosterGrid from "@/components/media/poster-grid";
import Pager from "@/components/media/pager";
import EmptyState from "@/components/media/empty-state";

export const revalidate = 300;

type Props = { params: Promise<{ page: string }> };

function parsePage(value: string): number {
  const page = Number.parseInt(value, 10);
  return Number.isInteger(page) && page > 0 ? page : NaN;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = parsePage((await params).page);
  if (Number.isNaN(page)) return {};

  const suffix = page > 1 ? ` — Halaman ${page}` : "";
  return {
    title: `Anime Selesai Tayang${suffix}`,
    description: `Kumpulan anime yang sudah tamat dan lengkap semua episodenya, subtitle Indonesia.${suffix}`,
    alternates: { canonical: `/completed-anime/${page}`, languages: localeAlternates(`/completed-anime/${page}`) },
    robots: page > 1 ? { index: false, follow: true } : undefined,
  };
}

export default async function CompletedPage({ params }: Props) {
  const page = parsePage((await params).page);
  if (Number.isNaN(page)) notFound();

  const { completeAnimeData, paginationData } = await getCompleteAnime(page);
  if (!completeAnimeData.length && page > 1) notFound();

  return (
    <PageShell
      title="Anime Selesai"
      description="Anime yang sudah tamat — semua episode tersedia."
      crumbs={[
        { label: "Beranda", href: "/" },
        { label: "Selesai", href: "/completed-anime/1" },
      ]}
      wide
    >
      {completeAnimeData.length ? (
        <PosterGrid>
          {completeAnimeData.map((item, index) => (
            <PosterCard
              key={item.slug}
              href={`/anime/${item.slug}`}
              title={item.title ?? "Tanpa judul"}
              poster={item.poster}
              badge={item.episode_count ? `${item.episode_count} eps` : null}
              rating={item.rating}
              meta={item.last_release_date}
              accent="completed"
              priority={index < 7}
            />
          ))}
        </PosterGrid>
      ) : (
        <EmptyState title="Belum ada data" action={{ href: "/", label: "Kembali ke beranda" }} />
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
