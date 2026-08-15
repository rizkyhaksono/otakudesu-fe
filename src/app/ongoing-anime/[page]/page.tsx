import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getOngoingAnime } from "@/services/anime";
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
    title: `Anime Ongoing${suffix}`,
    description: `Daftar anime yang sedang tayang dengan update episode terbaru, subtitle Indonesia.${suffix}`,
    alternates: { canonical: `/ongoing-anime/${page}` },
    robots: page > 1 ? { index: false, follow: true } : undefined,
  };
}

export default async function OngoingPage({ params }: Props) {
  const page = parsePage((await params).page);
  if (Number.isNaN(page)) notFound();

  const { ongoingAnimeData, paginationData } = await getOngoingAnime(page);
  if (!ongoingAnimeData.length && page > 1) notFound();

  return (
    <PageShell
      title="Anime Ongoing"
      description="Anime yang sedang tayang, diurutkan dari rilis terbaru."
      crumbs={[
        { label: "Beranda", href: "/" },
        { label: "Ongoing", href: "/ongoing-anime/1" },
      ]}
      wide
    >
      {ongoingAnimeData.length ? (
        <PosterGrid>
          {ongoingAnimeData.map((item, index) => (
            <PosterCard
              key={item.slug}
              href={`/anime/${item.slug}`}
              title={item.title ?? "Tanpa judul"}
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
          title="Belum ada data"
          description="Sumber sedang tidak mengembalikan daftar anime ongoing."
          action={{ href: "/", label: "Kembali ke beranda" }}
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
