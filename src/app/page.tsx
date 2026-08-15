import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getAnimeHome } from "@/services/anime";
import { getComicHome } from "@/services/comic";
import { getMovieHome } from "@/services/movie";
import { getTvChannels } from "@/services/tv";
import PosterCard from "@/components/media/poster-card";
import Rail from "@/components/media/rail";
import Hero, { type HeroSlide } from "@/components/media/hero";
import ContinueRail from "@/components/history/continue-rail";
import JsonLd from "@/components/seo/json-ld";
import { SITE } from "@/lib/site";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  title: `${SITE.name} — ${SITE.tagline}`,
  description: SITE.description,
  alternates: { canonical: "/" },
};

/** Poster width inside a rail. Fixed so every row scrolls in even steps. */
const CARD = "w-[42vw] shrink-0 snap-start sm:w-[30vw] md:w-[22vw] lg:w-[16vw] xl:w-[13vw]";
const RAIL_SIZES = "(min-width: 1280px) 13vw, (min-width: 1024px) 16vw, (min-width: 768px) 22vw, (min-width: 640px) 30vw, 42vw";

export default async function HomePage() {
  // Four independent domains, one render pass. A failure in any one of them
  // degrades that row only — the services already return empty on error.
  const [anime, comic, movie, tv] = await Promise.all([
    getAnimeHome(),
    getComicHome(),
    getMovieHome(),
    getTvChannels(),
  ]);

  // The hero mixes domains so the front page shows what the site actually is.
  const heroSlides: HeroSlide[] = [
    ...anime.ongoing_anime.slice(0, 3).map((item) => ({
      href: `/anime/${item.slug}`,
      title: item.title ?? "Tanpa judul",
      poster: item.poster ?? null,
      backdrop: null,
      kind: "Anime",
      meta: [item.current_episode, item.release_day].filter(Boolean).join(" · ") || null,
      synopsis: null,
    })),
    ...movie.trending.slice(0, 2).map((item) => ({
      href: item.media_type === "tv" ? `/movie/tv/${item.id}` : `/movie/${item.id}`,
      title: item.title ?? "Tanpa judul",
      poster: item.poster ?? null,
      // TMDB is the one source with proper wide artwork — use it when present.
      backdrop: item.backdrop ?? null,
      kind: item.media_type === "tv" ? "Serial" : "Film",
      meta: [item.release_year, item.rating ? `★ ${item.rating.toFixed(1)}` : null]
        .filter(Boolean)
        .join(" · ") || null,
      synopsis: item.overview ?? null,
    })),
    ...comic.latest_manga.slice(0, 1).map((item) => ({
      href: `/comic/${item.slug}`,
      title: item.title ?? "Tanpa judul",
      poster: item.poster ?? null,
      backdrop: null,
      kind: "Komik",
      meta: [item.type, item.latest_chapter?.title].filter(Boolean).join(" · ") || null,
      synopsis: item.synopsis ?? null,
    })),
  ];

  return (
    <div className="pb-16">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE.name,
          url: absoluteUrl("/"),
          inLanguage: SITE.lang,
          potentialAction: {
            "@type": "SearchAction",
            target: `${absoluteUrl("/search")}?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        }}
      />

      <Hero slides={heroSlides} />

      <div className="mx-auto max-w-[1600px] px-4 sm:px-6">
        <ContinueRail />

        <Shelf
          title="Anime sedang tayang"
          eyebrow="Update terbaru"
          href="/ongoing-anime/1"
        >
          {anime.ongoing_anime.slice(0, 18).map((item, index) => (
            <div key={item.slug} className={CARD}>
              <PosterCard
                href={`/anime/${item.slug}`}
                title={item.title ?? "Tanpa judul"}
                poster={item.poster}
                badge={item.current_episode}
                accent="ongoing"
                meta={item.release_day}
                sizes={RAIL_SIZES}
                priority={index < 6}
              />
            </div>
          ))}
        </Shelf>

        <Shelf title="Anime tamat" eyebrow="Selesai tayang" href="/completed-anime/1">
          {anime.complete_anime.slice(0, 18).map((item) => (
            <div key={item.slug} className={CARD}>
              <PosterCard
                href={`/anime/${item.slug}`}
                title={item.title ?? "Tanpa judul"}
                poster={item.poster}
                badge={item.episode_count ? `${item.episode_count} eps` : null}
                accent="completed"
                rating={item.rating}
                sizes={RAIL_SIZES}
              />
            </div>
          ))}
        </Shelf>

        {comic.latest_manga.length ? (
          <Shelf title="Komik terbaru" eyebrow="Manga · Manhwa · Manhua" href="/comic">
            {comic.latest_manga.concat(comic.popular_manga).slice(0, 18).map((item) => (
              <div key={`${item.slug}-comic`} className={CARD}>
                <PosterCard
                  href={`/comic/${item.slug}`}
                  title={item.title ?? "Tanpa judul"}
                  poster={item.poster}
                  badge={item.type}
                  meta={item.latest_chapter?.title}
                  rating={item.rating ? item.rating.toFixed(1) : null}
                  sizes={RAIL_SIZES}
                />
              </div>
            ))}
          </Shelf>
        ) : null}

        {movie.trending.length ? (
          <Shelf title="Film & serial populer" eyebrow="Sedang tren" href="/movie">
            {movie.trending.concat(movie.popular_movies).slice(0, 18).map((item) => (
              <div key={`${item.media_type}-${item.id}`} className={CARD}>
                <PosterCard
                  href={item.media_type === "tv" ? `/movie/tv/${item.id}` : `/movie/${item.id}`}
                  title={item.title ?? "Tanpa judul"}
                  poster={item.poster}
                  badge={item.media_type === "tv" ? "Serial" : "Film"}
                  rating={item.rating ? item.rating.toFixed(1) : null}
                  meta={item.release_year ? String(item.release_year) : null}
                  sizes={RAIL_SIZES}
                />
              </div>
            ))}
          </Shelf>
        ) : null}

        {tv.channels.length ? (
          <Shelf title="TV Indonesia" eyebrow={`${tv.total} channel live`} href="/tv">
            {tv.channels.slice(0, 20).map((channel) => (
              <Link
                key={channel.id}
                href={`/tv/${channel.id}`}
                className="press hover:border-primary group w-40 shrink-0 snap-start border p-3 sm:w-44"
              >
                <span className="bg-muted relative block aspect-video w-full">
                  {channel.logo ? (
                    <Image
                      src={channel.logo}
                      alt=""
                      fill
                      sizes="176px"
                      className="object-contain p-2"
                      unoptimized
                    />
                  ) : null}
                </span>
                <span className="group-hover:text-primary mt-2 block truncate text-sm font-semibold">
                  {channel.name}
                </span>
                <span className="text-primary flex items-center gap-1.5 font-mono text-[0.65rem] uppercase">
                  <span className="bg-primary size-1.5 animate-pulse" aria-hidden />
                  Live
                </span>
              </Link>
            ))}
          </Shelf>
        ) : null}
      </div>
    </div>
  );
}

/** Section heading + horizontal rail, the repeating unit of this page. */
function Shelf({
  title,
  eyebrow,
  href,
  children,
}: {
  title: string;
  eyebrow?: string;
  href?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <div>
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h2 className="font-display text-xl leading-none font-extrabold tracking-tight uppercase sm:text-2xl">
            {title}
          </h2>
        </div>
        {href ? (
          <Link
            href={href}
            className="text-muted-foreground hover:text-primary press shrink-0 font-mono text-xs uppercase"
          >
            Lihat semua →
          </Link>
        ) : null}
      </div>
      <Rail>{children}</Rail>
    </section>
  );
}
