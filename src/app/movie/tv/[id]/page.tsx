import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { metaDescription } from "@/lib/seo";
import { getSeason, getSeries, getSeriesSources } from "@/services/movie";
import PageShell from "@/components/media/page-shell";
import EmbedPlayer from "@/components/movie/embed-player";
import SeasonPicker from "@/components/movie/season-picker";
import { MovieCast, MovieFacts } from "@/components/movie/detail-body";
import RecordView from "@/components/history/record-view";
import BookmarkButton from "@/components/history/bookmark-button";
import JsonLd from "@/components/seo/json-ld";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ s?: string; e?: string }>;
};

function parseId(value: string): number {
  const id = Number.parseInt(value, 10);
  return Number.isInteger(id) && id > 0 ? id : NaN;
}

function parseNumber(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = parseId((await params).id);
  if (Number.isNaN(id)) return { robots: { index: false, follow: false } };

  const series = await getSeries(id);
  if (!series) return { title: "Serial tidak ditemukan", robots: { index: false, follow: false } };

  const description = metaDescription(
    series.overview,
    `Nonton serial ${series.title} subtitle Indonesia — semua musim dan episode.`,
  );

  return {
    title: series.title ?? `Serial ${id}`,
    description,
    alternates: { canonical: `/movie/tv/${id}` },
    openGraph: {
      type: "video.tv_show",
      title: series.title ?? undefined,
      description,
      url: absoluteUrl(`/movie/tv/${id}`),
      images: series.backdrop ? [{ url: series.backdrop }] : undefined,
    },
  };
}

export default async function SeriesDetailPage({ params, searchParams }: Props) {
  const id = parseId((await params).id);
  if (Number.isNaN(id)) notFound();

  const query = await searchParams;
  const series = await getSeries(id);
  if (!series) notFound();

  const firstSeason = series.seasons[0]?.season_number ?? 1;
  const season = parseNumber(query.s, firstSeason);
  const episode = parseNumber(query.e, 1);

  const [seasonData, sources] = await Promise.all([
    getSeason(id, season),
    getSeriesSources(id, season, episode),
  ]);

  const currentEpisode = seasonData?.episodes.find((item) => item.episode_number === episode);

  return (
    <PageShell
      title={series.title ?? `Serial ${id}`}
      description={series.tagline ?? undefined}
      crumbs={[
        { label: "Beranda", href: "/" },
        { label: "Film", href: "/movie" },
        { label: series.title ?? String(id), href: `/movie/tv/${id}` },
      ]}
      wide
    >
      <RecordView
        kind="movie"
        id={`series:${id}`}
        title={series.title ?? `Serial ${id}`}
        href={`/movie/tv/${id}?s=${season}&e=${episode}`}
        poster={series.poster}
        progress={`S${season}·E${episode}`}
      />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "TVSeries",
          name: series.title,
          image: series.poster,
          description: series.overview,
          url: absoluteUrl(`/movie/tv/${id}`),
          genre: series.genres.map((genre) => genre.name),
          numberOfSeasons: series.seasons.length || undefined,
          actor: series.cast.slice(0, 8).map((person) => ({ "@type": "Person", name: person.name })),
          aggregateRating: series.rating
            ? {
                "@type": "AggregateRating",
                ratingValue: series.rating,
                bestRating: "10",
                ratingCount: series.vote_count ?? 1,
              }
            : undefined,
        }}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="min-w-0">
          <EmbedPlayer
            sources={sources?.sources ?? []}
            title={`${series.title} S${season}E${episode}`}
          />

          <p className="text-muted-foreground mt-3 font-mono text-xs uppercase">
            Musim {season} · Episode {episode}
            {currentEpisode?.name ? ` — ${currentEpisode.name}` : ""}
          </p>

          {currentEpisode?.overview ? (
            <p className="mt-2 text-sm leading-relaxed">{currentEpisode.overview}</p>
          ) : null}

          <div className="mt-6">
            <MovieFacts detail={series} />
          </div>

          {series.overview ? (
            <div className="mt-6">
              <h2 className="eyebrow">Sinopsis</h2>
              <p className="mt-2 text-sm leading-relaxed">{series.overview}</p>
            </div>
          ) : null}

          <MovieCast detail={series} />
        </div>

        <aside className="space-y-3">
          <div className="bg-muted relative aspect-[2/3] border">
            {series.poster ? (
              <Image
                src={series.poster}
                alt={series.title ?? ""}
                fill
                sizes="300px"
                priority
                className="object-cover"
              />
            ) : null}
          </div>

          <BookmarkButton
            kind="movie"
            id={`series:${id}`}
            title={series.title ?? `Serial ${id}`}
            href={`/movie/tv/${id}`}
            poster={series.poster}
          />

          {series.seasons.length ? (
            <SeasonPicker
              id={id}
              seasons={series.seasons}
              episodes={seasonData?.episodes ?? []}
              currentSeason={season}
              currentEpisode={episode}
            />
          ) : null}
        </aside>
      </div>
    </PageShell>
  );
}
