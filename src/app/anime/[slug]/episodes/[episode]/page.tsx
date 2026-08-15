import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight, List } from "lucide-react";
import { getAnime, getEpisode, getEpisodeMirror, getMuseFallback } from "@/services/anime";
import PageShell from "@/components/media/page-shell";
import DownloadTable from "@/components/media/download-table";
import EpisodePlayer from "@/components/anime/episode-player";
import EpisodePicker from "@/components/anime/episode-picker";
import RecordView from "@/components/history/record-view";
import JsonLd from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 600;

type Props = { params: Promise<{ slug: string; episode: string }> };

function parseEpisode(value: string): number {
  const episode = Number.parseInt(value, 10);
  return Number.isInteger(episode) && episode >= 0 ? episode : NaN;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, episode } = await params;
  const number = parseEpisode(episode);
  if (Number.isNaN(number)) return { robots: { index: false, follow: false } };

  const anime = await getAnime(slug);
  if (!anime) return { title: "Episode tidak ditemukan", robots: { index: false, follow: false } };

  const title = `${anime.title} Episode ${number}`;
  const description = `Nonton ${anime.title} episode ${number} subtitle Indonesia, kualitas HD, plus link download.`;

  return {
    title,
    description,
    alternates: { canonical: `/anime/${slug}/episodes/${number}` },
    openGraph: {
      type: "video.episode",
      title,
      description,
      url: absoluteUrl(`/anime/${slug}/episodes/${number}`),
      images: anime.poster ? [{ url: anime.poster }] : undefined,
    },
  };
}

export default async function EpisodePage({ params }: Props) {
  const { slug, episode } = await params;
  const number = parseEpisode(episode);
  if (Number.isNaN(number)) notFound();

  const [anime, data] = await Promise.all([getAnime(slug), getEpisode(slug, number)]);
  if (!anime || !data) notFound();

  const episodes = anime.episode_lists;
  const currentIndex = episodes.findIndex((item) => item.episode_number === number);
  const mirrors = data.mirrors ?? [];

  /*
   * Resolve a source server-side so the player is filled on first paint.
   *
   * Walks the list rather than taking mirrors[0]: several providers publish
   * `frame-ancestors` that exclude us, and they are frequently first, so
   * "first mirror" and "first mirror that can actually play" are not the same
   * thing. Capped so a bad episode cannot fan out into a dozen upstream calls.
   */
  // Official fallback, resolved in parallel with everything else.
  const muse = await getMuseFallback(anime.title ?? slug);

  let initialSrc: string | null = data.stream_url ?? null;
  if (!initialSrc) {
    for (const candidate of mirrors.slice(0, 4)) {
      const resolved = await getEpisodeMirror(candidate.content);
      if (resolved?.url && resolved.embeddable) {
        initialSrc = resolved.url;
        break;
      }
    }
  }

  const previous = currentIndex >= 0 ? episodes[currentIndex + 1] : undefined;
  const next = currentIndex > 0 ? episodes[currentIndex - 1] : undefined;

  return (
    <PageShell
      title={data.episode || `${anime.title} Episode ${number}`}
      crumbs={[
        { label: "Beranda", href: "/" },
        { label: anime.title ?? slug, href: `/anime/${slug}` },
        { label: `Episode ${number}`, href: `/anime/${slug}/episodes/${number}` },
      ]}
      wide
    >
      <RecordView
        kind="anime"
        id={`anime:${slug}`}
        title={anime.title ?? slug}
        href={`/anime/${slug}/episodes/${number}`}
        poster={anime.poster}
        progress={`Episode ${number}`}
        part={number}
      />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "TVEpisode",
          name: data.episode,
          episodeNumber: number,
          url: absoluteUrl(`/anime/${slug}/episodes/${number}`),
          image: anime.poster,
          inLanguage: "id-ID",
          partOfSeries: {
            "@type": "TVSeries",
            name: anime.title,
            url: absoluteUrl(`/anime/${slug}`),
          },
        }}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="min-w-0">
          <EpisodePlayer
            title={data.episode || "Pemutar"}
            initialSrc={initialSrc}
            mirrors={mirrors}
            muse={muse}
          />

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Button asChild variant="outline" size="sm" disabled={!previous} className="gap-1">
              {previous?.episode_number !== undefined ? (
                <Link href={`/anime/${slug}/episodes/${previous.episode_number}`}>
                  <ChevronLeft className="size-4" aria-hidden />
                  Sebelumnya
                </Link>
              ) : (
                <span>
                  <ChevronLeft className="size-4" aria-hidden />
                  Sebelumnya
                </span>
              )}
            </Button>

            <Button asChild variant="outline" size="sm" className="gap-1">
              <Link href={`/anime/${slug}`}>
                <List className="size-4" aria-hidden />
                Semua episode
              </Link>
            </Button>

            <Button asChild variant="outline" size="sm" disabled={!next} className="gap-1">
              {next?.episode_number !== undefined ? (
                <Link href={`/anime/${slug}/episodes/${next.episode_number}`}>
                  Berikutnya
                  <ChevronRight className="size-4" aria-hidden />
                </Link>
              ) : (
                <span>
                  Berikutnya
                  <ChevronRight className="size-4" aria-hidden />
                </span>
              )}
            </Button>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <DownloadTable title="Download MP4" groups={data.download_urls.mp4} />
            <DownloadTable title="Download MKV" groups={data.download_urls.mkv} />
          </div>
        </div>

        <aside>
          <EpisodePicker slug={slug} episodes={episodes} current={number} />
        </aside>
      </div>
    </PageShell>
  );
}
