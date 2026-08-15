import Link from "next/link";
import type { Metadata } from "next";
import { getAnimeHome } from "@/services/anime";
import { getComicHome } from "@/services/comic";
import { getTvChannels } from "@/services/tv";
import PosterCard from "@/components/media/poster-card";
import PosterGrid from "@/components/media/poster-grid";
import Section from "@/components/media/section";
import ContinueRail from "@/components/history/continue-rail";
import { SITE } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  title: `${SITE.name} — ${SITE.tagline}`,
  description: SITE.description,
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  // Fetched in parallel: three independent domains, one render pass.
  const [anime, comic, tv] = await Promise.all([
    getAnimeHome(),
    getComicHome(),
    getTvChannels(),
  ]);

  const ongoing = anime.ongoing_anime.slice(0, 14);
  const completed = anime.complete_anime.slice(0, 7);
  const comics = comic.latest_manga.slice(0, 7);
  const channels = tv.channels.slice(0, 12);

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6">
      <section className="border-b pb-8">
        <p className="eyebrow">{SITE.tagline}</p>
        <h1 className="font-display mt-2 max-w-4xl text-4xl leading-[0.95] font-extrabold tracking-tighter uppercase sm:text-6xl lg:text-7xl">
          Semua tontonan &amp; bacaan kamu, dalam satu tempat.
        </h1>
        <p className="text-muted-foreground mt-4 max-w-2xl text-sm sm:text-base">
          {SITE.description}
        </p>
        <div className="mt-6 flex flex-wrap gap-px border bg-border [&>*]:bg-background">
          {[
            { href: "/ongoing-anime/1", label: "Anime ongoing", value: anime.ongoing_anime.length },
            { href: "/comic", label: "Komik terbaru", value: comic.latest_manga.length },
            { href: "/tv", label: "Channel TV", value: tv.total },
            { href: "/movie", label: "Film & serial", value: "TMDB" },
          ].map((stat) => (
            <Link
              key={stat.href}
              href={stat.href}
              className="hover:bg-accent flex-1 basis-40 px-4 py-3 transition-colors"
            >
              <p className="font-mono text-2xl leading-none font-medium tabular-nums">
                {stat.value}
              </p>
              <p className="text-muted-foreground mt-1 text-xs uppercase">{stat.label}</p>
            </Link>
          ))}
        </div>
      </section>

      <ContinueRail />

      <Section title="Anime ongoing" eyebrow="Update terbaru" href="/ongoing-anime/1">
        <PosterGrid>
          {ongoing.map((item, index) => (
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
      </Section>

      <Section title="Anime selesai" eyebrow="Tamat" href="/completed-anime/1">
        <PosterGrid>
          {completed.map((item) => (
            <PosterCard
              key={item.slug}
              href={`/anime/${item.slug}`}
              title={item.title ?? "Tanpa judul"}
              poster={item.poster}
              badge={item.episode_count ? `${item.episode_count} eps` : null}
              rating={item.rating}
              accent="completed"
            />
          ))}
        </PosterGrid>
      </Section>

      {comics.length ? (
        <Section title="Komik terbaru" eyebrow="Manga · Manhwa · Manhua" href="/comic">
          <PosterGrid>
            {comics.map((item) => (
              <PosterCard
                key={item.slug}
                href={`/comic/${item.slug}`}
                title={item.title ?? "Tanpa judul"}
                poster={item.poster}
                badge={item.type}
                meta={item.latest_chapter?.title}
                rating={item.rating}
              />
            ))}
          </PosterGrid>
        </Section>
      ) : null}

      {channels.length ? (
        <Section title="TV Indonesia" eyebrow="Siaran langsung" href="/tv">
          <div className="grid grid-cols-2 gap-px border bg-border sm:grid-cols-3 lg:grid-cols-6 [&>*]:bg-background">
            {channels.map((channel) => (
              <Link
                key={channel.id}
                href={`/tv/${channel.id}`}
                className="hover:bg-accent flex items-center gap-3 p-3 transition-colors"
              >
                <span className="bg-primary size-1.5 shrink-0 animate-pulse" aria-hidden />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">{channel.name}</span>
                  <span className="text-muted-foreground block truncate font-mono text-[0.65rem] uppercase">
                    {channel.categories[0] ?? "umum"}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </Section>
      ) : null}
    </div>
  );
}
