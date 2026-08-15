import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { metaDescription } from "@/lib/seo";
import { getMovie, getMovieSources } from "@/services/movie";
import PageShell from "@/components/media/page-shell";
import EmbedPlayer from "@/components/movie/embed-player";
import { MovieCast, MovieFacts } from "@/components/movie/detail-body";
import RecordView from "@/components/history/record-view";
import BookmarkButton from "@/components/history/bookmark-button";
import JsonLd from "@/components/seo/json-ld";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

type Props = { params: Promise<{ id: string }> };

function parseId(value: string): number {
  const id = Number.parseInt(value, 10);
  return Number.isInteger(id) && id > 0 ? id : NaN;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = parseId((await params).id);
  if (Number.isNaN(id)) return { robots: { index: false, follow: false } };

  const movie = await getMovie(id);
  if (!movie) return { title: "Film tidak ditemukan", robots: { index: false, follow: false } };

  const description = metaDescription(
    movie.overview,
    `Nonton ${movie.title} subtitle Indonesia — sinopsis, pemeran dan rating lengkap.`,
  );

  return {
    title: movie.title ?? `Film ${id}`,
    description,
    alternates: { canonical: `/movie/${id}` },
    openGraph: {
      type: "video.movie",
      title: movie.title ?? undefined,
      description,
      url: absoluteUrl(`/movie/${id}`),
      images: movie.backdrop ? [{ url: movie.backdrop }] : undefined,
    },
  };
}

export default async function MovieDetailPage({ params }: Props) {
  const id = parseId((await params).id);
  if (Number.isNaN(id)) notFound();

  const [movie, sources] = await Promise.all([getMovie(id), getMovieSources(id)]);
  if (!movie) notFound();

  return (
    <PageShell
      title={movie.title ?? `Film ${id}`}
      description={movie.tagline ?? undefined}
      crumbs={[
        { label: "Beranda", href: "/" },
        { label: "Film", href: "/movie" },
        { label: movie.title ?? String(id), href: `/movie/${id}` },
      ]}
      wide
    >
      <RecordView
        kind="movie"
        id={`movie:${id}`}
        title={movie.title ?? `Film ${id}`}
        href={`/movie/${id}`}
        poster={movie.poster}
      />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Movie",
          name: movie.title,
          image: movie.poster,
          description: movie.overview,
          datePublished: movie.release_date,
          url: absoluteUrl(`/movie/${id}`),
          genre: movie.genres.map((genre) => genre.name),
          director: movie.director ? { "@type": "Person", name: movie.director } : undefined,
          actor: movie.cast.slice(0, 8).map((person) => ({ "@type": "Person", name: person.name })),
          aggregateRating: movie.rating
            ? {
                "@type": "AggregateRating",
                ratingValue: movie.rating,
                bestRating: "10",
                ratingCount: movie.vote_count ?? 1,
              }
            : undefined,
        }}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
        <div className="min-w-0">
          <EmbedPlayer sources={sources?.sources ?? []} title={movie.title ?? ""} />

          <div className="mt-6">
            <MovieFacts detail={movie} />
          </div>

          {movie.overview ? (
            <div className="mt-6">
              <h2 className="eyebrow">Sinopsis</h2>
              <p className="mt-2 text-sm leading-relaxed">{movie.overview}</p>
            </div>
          ) : null}

          <MovieCast detail={movie} />
        </div>

        <aside>
          <div className="bg-muted relative aspect-[2/3] border">
            {movie.poster ? (
              <Image
                src={movie.poster}
                alt={movie.title ?? ""}
                fill
                sizes="260px"
                priority
                className="object-cover"
              />
            ) : null}
          </div>

          <div className="mt-3 flex flex-col gap-2">
            <BookmarkButton
              kind="movie"
              id={`movie:${id}`}
              title={movie.title ?? `Film ${id}`}
              href={`/movie/${id}`}
              poster={movie.poster}
            />
            {movie.trailer ? (
              <a
                href={movie.trailer}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:bg-accent border px-4 py-2 text-center text-sm font-medium transition-colors"
              >
                Tonton trailer
              </a>
            ) : null}
          </div>

          {movie.genres.length ? (
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {movie.genres.map((genre) => (
                <li key={genre.id} className="chip">
                  {genre.name}
                </li>
              ))}
            </ul>
          ) : null}
        </aside>
      </div>
    </PageShell>
  );
}
