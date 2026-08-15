import type { Metadata } from "next";
import { getMovieHome } from "@/services/movie";
import PageShell from "@/components/media/page-shell";
import PosterCard from "@/components/media/poster-card";
import PosterGrid from "@/components/media/poster-grid";
import Section from "@/components/media/section";
import EmptyState from "@/components/media/empty-state";
import SearchForm from "@/components/search/search-form";
import type { MovieSummary } from "@/types/api";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Film & Serial",
  description:
    "Nonton film dan serial TV terbaru dengan metadata lengkap — sinopsis, pemeran, rating dan trailer.",
  alternates: { canonical: "/movie" },
};

function toCard(item: MovieSummary) {
  const href = item.media_type === "tv" ? `/movie/tv/${item.id}` : `/movie/${item.id}`;
  return (
    <PosterCard
      key={`${item.media_type}-${item.id}`}
      href={href}
      title={item.title ?? "Tanpa judul"}
      poster={item.poster}
      badge={item.media_type === "tv" ? "Serial" : "Film"}
      rating={item.rating ? item.rating.toFixed(1) : null}
      meta={item.release_year ? String(item.release_year) : null}
    />
  );
}

export default async function MovieHomePage() {
  const home = await getMovieHome();
  const empty =
    home.trending.length + home.popular_movies.length + home.popular_tv.length === 0;

  return (
    <PageShell
      title="Film & Serial"
      description="Data dari TMDB, pemutar dari beberapa server."
      crumbs={[
        { label: "Beranda", href: "/" },
        { label: "Film", href: "/movie" },
      ]}
      wide
      actions={
        <div className="w-full sm:w-80">
          <SearchForm action="/movie/search" placeholder="Cari film atau serial…" />
        </div>
      }
    >
      {empty ? (
        <EmptyState
          title="Sumber film belum dikonfigurasi"
          description="Isi TMDB_ACCESS_TOKEN di backend untuk mengaktifkan bagian ini."
          action={{ href: "/", label: "Kembali ke beranda" }}
        />
      ) : null}

      {home.trending.length ? (
        <Section title="Sedang tren" eyebrow="Minggu ini">
          <PosterGrid>{home.trending.map(toCard)}</PosterGrid>
        </Section>
      ) : null}

      {home.popular_movies.length ? (
        <Section title="Film populer" eyebrow="Movie">
          <PosterGrid>{home.popular_movies.map(toCard)}</PosterGrid>
        </Section>
      ) : null}

      {home.popular_tv.length ? (
        <Section title="Serial populer" eyebrow="TV series">
          <PosterGrid>{home.popular_tv.map(toCard)}</PosterGrid>
        </Section>
      ) : null}
    </PageShell>
  );
}
