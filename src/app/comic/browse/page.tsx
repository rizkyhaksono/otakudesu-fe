import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { browseComics } from "@/services/comic";
import PageShell from "@/components/media/page-shell";
import PosterCard from "@/components/media/poster-card";
import PosterGrid from "@/components/media/poster-grid";
import Pager from "@/components/media/pager";
import EmptyState from "@/components/media/empty-state";
import GenreFilter from "@/components/comic/genre-filter";

export const revalidate = 1800;

type Props = { searchParams: Promise<{ page?: string; genre?: string; q?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { page, genre, q } = await searchParams;
  const number = Number.parseInt(page ?? "1", 10) || 1;

  const title = q
    ? `Cari komik “${q}”`
    : genre
      ? `Komik ${genre.replace(/-/g, " ")}`
      : "Jelajahi Komik";

  return {
    title: number > 1 ? `${title} — Halaman ${number}` : title,
    description:
      "Katalog lengkap manga, manhwa dan manhua bahasa Indonesia — filter genre, cari judul, update tiap hari.",
    alternates: { canonical: "/comic/browse" },
    robots: q || number > 1 ? { index: false, follow: true } : undefined,
  };
}

export default async function ComicBrowsePage({ searchParams }: Props) {
  const { page, genre, q } = await searchParams;
  const number = Number.parseInt(page ?? "1", 10) || 1;
  if (number < 1) notFound();

  const data = await browseComics({ page: number, genre, q });

  const buildHref = (target: number) => {
    const params = new URLSearchParams();
    if (genre) params.set("genre", genre);
    if (q) params.set("q", q);
    if (target > 1) params.set("page", String(target));
    const query = params.toString();
    return `/comic/browse${query ? `?${query}` : ""}`;
  };

  return (
    <PageShell
      title="Jelajahi Komik"
      description={
        data.pagination.total
          ? `${data.pagination.total.toLocaleString("id-ID")} judul terindeks.`
          : undefined
      }
      crumbs={[
        { label: "Beranda", href: "/" },
        { label: "Komik", href: "/comic" },
        { label: "Jelajahi", href: "/comic/browse" },
      ]}
      wide
    >
      <GenreFilter genres={data.genres} active={genre} query={q} />

      {data.comics.length ? (
        <>
          <PosterGrid>
            {data.comics.map((item, index) => (
              <PosterCard
                key={item.slug}
                href={`/comic/${item.slug}`}
                title={item.title ?? "Tanpa judul"}
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
          title="Tidak ada komik yang cocok"
          description="Coba genre lain atau kata kunci yang berbeda."
          action={{ href: "/comic/browse", label: "Reset filter" }}
        />
      )}
    </PageShell>
  );
}
