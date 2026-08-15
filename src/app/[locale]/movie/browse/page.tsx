import Link from "next/link";
import type { Metadata } from "next";
import { localeAlternates } from "@/lib/site";
import { notFound } from "next/navigation";
import { listMovies, type MovieCategory } from "@/services/movie";
import PageShell from "@/components/media/page-shell";
import PosterCard from "@/components/media/poster-card";
import PosterGrid from "@/components/media/poster-grid";
import Pager from "@/components/media/pager";
import EmptyState from "@/components/media/empty-state";
import { isBackendReachable } from "@/lib/api";
import BackendDown from "@/components/media/backend-down";
import { cn } from "@/lib/utils";

export const revalidate = 3600;

const CATEGORIES: { value: MovieCategory; label: string; title: string }[] = [
  { value: "trending", label: "Tren", title: "Sedang Tren" },
  { value: "popular", label: "Film populer", title: "Film Populer" },
  { value: "top-rated", label: "Film rating tertinggi", title: "Film Rating Tertinggi" },
  { value: "tv", label: "Serial populer", title: "Serial Populer" },
  { value: "tv-top-rated", label: "Serial rating tertinggi", title: "Serial Rating Tertinggi" },
];

type Props = { searchParams: Promise<{ category?: string; page?: string }> };

function resolve(value?: string) {
  return CATEGORIES.find((entry) => entry.value === value) ?? CATEGORIES[0]!;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { category, page } = await searchParams;
  const active = resolve(category);
  const number = Number.parseInt(page ?? "1", 10) || 1;

  return {
    title: number > 1 ? `${active.title} — Halaman ${number}` : active.title,
    description: `Daftar ${active.title.toLowerCase()} lengkap dengan sinopsis, rating dan pemutar.`,
    alternates: { canonical: `/movie/browse?category=${active.value}`, languages: localeAlternates(`/movie/browse?category=${active.value}`) },
    robots: number > 1 ? { index: false, follow: true } : undefined,
  };
}

export default async function MovieBrowsePage({ searchParams }: Props) {
  const { category, page } = await searchParams;
  const active = resolve(category);
  const number = Number.parseInt(page ?? "1", 10) || 1;
  if (number < 1) notFound();

  const data = await listMovies(active.value, number);
  const empty = data.results.length === 0;
  const backendUp = empty ? await isBackendReachable() : true;

  const buildHref = (target: number) =>
    `/movie/browse?category=${active.value}${target > 1 ? `&page=${target}` : ""}`;

  return (
    <PageShell
      title={active.title}
      description="Data dari TMDB, pemutar dari beberapa server."
      crumbs={[
        { label: "Beranda", href: "/" },
        { label: "Film", href: "/movie" },
        { label: active.label, href: `/movie/browse?category=${active.value}` },
      ]}
      wide
    >
      <nav aria-label="Kategori" className="mb-6 flex flex-wrap gap-px bg-border [&>*]:bg-background">
        {CATEGORIES.map((entry) => (
          <Link
            key={entry.value}
            href={`/movie/browse?category=${entry.value}`}
            className={cn(
              "press px-3 py-1.5 font-mono text-xs uppercase",
              entry.value === active.value
                ? "bg-primary text-primary-foreground font-semibold"
                : "hover:bg-accent",
            )}
          >
            {entry.label}
          </Link>
        ))}
      </nav>

      {empty && !backendUp ? <BackendDown /> : null}

      {empty && backendUp ? (
        <EmptyState
          title="Belum ada data"
          description="Backend berjalan, tapi TMDB_ACCESS_TOKEN belum diisi."
          action={{ href: "/", label: "Kembali ke beranda" }}
        />
      ) : null}

      {data.results.length ? (
        <>
          <PosterGrid>
            {data.results.map((item, index) => (
              <PosterCard
                key={`${item.media_type}-${item.id}`}
                href={item.media_type === "tv" ? `/movie/tv/${item.id}` : `/movie/${item.id}`}
                title={item.title ?? "Tanpa judul"}
                poster={item.poster}
                badge={item.media_type === "tv" ? "Serial" : "Film"}
                rating={item.rating ? item.rating.toFixed(1) : null}
                meta={item.release_year ? String(item.release_year) : null}
                priority={index < 7}
              />
            ))}
          </PosterGrid>
          <Pager current={data.page} last={data.total_pages} href={buildHref} />
        </>
      ) : null}
    </PageShell>
  );
}
