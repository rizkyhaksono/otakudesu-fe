import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { metaDescription } from "@/lib/seo";
import { Download, Play } from "lucide-react";
import { getAnime } from "@/services/anime";
import PageShell from "@/components/media/page-shell";
import PosterCard from "@/components/media/poster-card";
import PosterGrid from "@/components/media/poster-grid";
import Section from "@/components/media/section";
import JsonLd from "@/components/seo/json-ld";
import RecordView from "@/components/history/record-view";
import BookmarkButton from "@/components/history/bookmark-button";
import { Button } from "@/components/ui/button";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 1800;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const anime = await getAnime(slug);

  // Metadata comes from the real payload, not from prettifying the slug —
  // that is the difference between a useful search result and a generic one.
  if (!anime) return { title: "Anime tidak ditemukan", robots: { index: false, follow: false } };

  const description = metaDescription(
    anime.synopsis,
    `Nonton ${anime.title} subtitle Indonesia, lengkap semua episode — sinopsis, daftar episode dan link download.`,
  );

  return {
    title: anime.title,
    description,
    alternates: { canonical: `/anime/${slug}` },
    openGraph: {
      type: "video.tv_show",
      title: anime.title,
      description,
      url: absoluteUrl(`/anime/${slug}`),
      images: anime.poster ? [{ url: anime.poster, alt: anime.title ?? "" }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: anime.title,
      description,
      images: anime.poster ? [anime.poster] : undefined,
    },
  };
}

export default async function AnimeDetailPage({ params }: Props) {
  const { slug } = await params;
  const anime = await getAnime(slug);

  // Real 404 status, not a client-side soft 404 served with 200.
  if (!anime) notFound();

  const firstEpisode = anime.episode_lists.at(-1);
  const latestEpisode = anime.episode_lists.at(0);

  const facts = [
    ["Tipe", anime.type],
    ["Status", anime.status],
    ["Episode", anime.episode_count],
    ["Durasi", anime.duration],
    ["Rilis", anime.release_date],
    ["Studio", anime.studio],
    ["Produser", anime.produser],
    ["Judul Jepang", anime.japanese_title],
  ].filter(([, value]) => Boolean(value)) as [string, string][];

  return (
    <PageShell
      title={anime.title ?? slug}
      crumbs={[
        { label: "Beranda", href: "/" },
        { label: "Anime", href: "/anime-list" },
        { label: anime.title ?? slug, href: `/anime/${slug}` },
      ]}
      wide
    >
      <RecordView
        kind="anime"
        id={`anime:${slug}`}
        title={anime.title ?? slug}
        href={`/anime/${slug}`}
        poster={anime.poster}
        progress={latestEpisode?.episode ?? null}
      />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "TVSeries",
          name: anime.title,
          alternateName: anime.japanese_title,
          image: anime.poster,
          description: anime.synopsis,
          url: absoluteUrl(`/anime/${slug}`),
          inLanguage: "id-ID",
          numberOfEpisodes: Number.parseInt(anime.episode_count ?? "", 10) || undefined,
          genre: anime.genres.map((genre) => genre.name).filter(Boolean),
          productionCompany: anime.studio ? { "@type": "Organization", name: anime.studio } : undefined,
          aggregateRating: anime.rating
            ? { "@type": "AggregateRating", ratingValue: anime.rating, bestRating: "10", ratingCount: 1 }
            : undefined,
        }}
      />

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <div>
          <div className="bg-muted relative aspect-[2/3] border">
            {anime.poster ? (
              <Image
                src={anime.poster}
                alt={anime.title ?? ""}
                fill
                sizes="260px"
                priority
                className="object-cover"
              />
            ) : null}
          </div>

          <div className="mt-3 flex flex-col gap-2">
            {firstEpisode?.episode_number !== undefined ? (
              <Button asChild className="w-full gap-2">
                <Link href={`/anime/${slug}/episodes/${firstEpisode.episode_number}`}>
                  <Play className="size-4" aria-hidden />
                  Tonton episode pertama
                </Link>
              </Button>
            ) : null}
            <BookmarkButton
              kind="anime"
              id={`anime:${slug}`}
              title={anime.title ?? slug}
              href={`/anime/${slug}`}
              poster={anime.poster}
            />
            {anime.batch?.slug ? (
              <Button asChild variant="outline" className="w-full gap-2">
                <Link href={`/batch/${anime.batch.slug}`}>
                  <Download className="size-4" aria-hidden />
                  Batch download
                </Link>
              </Button>
            ) : null}
          </div>
        </div>

        <div className="min-w-0">
          {anime.rating ? (
            <p className="mb-3 flex items-baseline gap-2">
              <span className="font-mono text-3xl leading-none font-medium tabular-nums">
                {anime.rating}
              </span>
              <span className="text-muted-foreground font-mono text-xs uppercase">/ 10</span>
            </p>
          ) : null}

          {anime.genres.length ? (
            <ul className="mb-4 flex flex-wrap gap-1.5">
              {anime.genres.map((genre) => (
                <li key={genre.slug}>
                  <Link href={`/genres/${genre.slug}`} className="chip hover:bg-accent">
                    {genre.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}

          <dl className="grid grid-cols-2 gap-px border bg-border sm:grid-cols-4 [&>*]:bg-background">
            {facts.map(([label, value]) => (
              <div key={label} className="p-3">
                <dt className="eyebrow">{label}</dt>
                <dd className="mt-1 text-sm font-medium break-words">{value}</dd>
              </div>
            ))}
          </dl>

          {anime.synopsis ? (
            <div className="mt-6">
              <h2 className="eyebrow">Sinopsis</h2>
              <p className="mt-2 text-sm leading-relaxed whitespace-pre-line">{anime.synopsis}</p>
            </div>
          ) : null}
        </div>
      </div>

      {anime.episode_lists.length ? (
        <Section title="Daftar episode" eyebrow={`${anime.episode_lists.length} episode`}>
          <ul className="grid grid-cols-2 gap-px border bg-border sm:grid-cols-3 lg:grid-cols-4 [&>*]:bg-background">
            {anime.episode_lists.map((episode) => (
              <li key={episode.slug}>
                <Link
                  href={
                    episode.episode_number !== undefined
                      ? `/anime/${slug}/episodes/${episode.episode_number}`
                      : `/anime/${slug}`
                  }
                  className="hover:bg-accent flex items-center gap-3 p-3 transition-colors"
                >
                  <span className="text-muted-foreground w-10 shrink-0 font-mono text-xs tabular-nums">
                    {episode.episode_number !== undefined
                      ? String(episode.episode_number).padStart(2, "0")
                      : "—"}
                  </span>
                  <span className="line-clamp-1 text-sm">{episode.episode}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {anime.recommendations.length ? (
        <Section title="Rekomendasi" eyebrow="Mirip dengan ini">
          <PosterGrid>
            {anime.recommendations.map((item) => (
              <PosterCard
                key={item.slug}
                href={`/anime/${item.slug}`}
                title={item.title ?? "Tanpa judul"}
                poster={item.poster}
              />
            ))}
          </PosterGrid>
        </Section>
      ) : null}
    </PageShell>
  );
}
