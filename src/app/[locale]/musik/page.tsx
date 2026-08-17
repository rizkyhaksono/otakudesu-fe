import type { Metadata } from "next";
import { localeAlternates } from "@/lib/site";
import { getDictionary } from "@/lib/i18n/server";
import { getAnimeHome } from "@/services/anime";
import { getAnimeThemes } from "@/services/themes";
import PageShell from "@/components/media/page-shell";
import EmptyState from "@/components/media/empty-state";
import PlaylistPlayer, { type MusicTrack } from "@/components/music/playlist-player";

export const revalidate = 21_600;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { t } = await getDictionary(params);

  return {
    title: t.pages.music.title,
    description: t.pages.music.description,
    alternates: { canonical: "/musik", languages: localeAlternates("/musik") },
  };
}

/**
 * A cross-anime OP/ED playlist.
 *
 * There is no "browse all songs" endpoint on AnimeThemes.moe worth exposing
 * directly, so the seed list is titles we already know are currently
 * relevant — today's airing anime — and each is matched independently. A
 * title with no match (special, too new to be indexed, wrong-language name)
 * is silently dropped rather than breaking the page; a playlist assembled
 * from partial results is still a good playlist.
 */

/**
 * Round-robin merge by anime, so two songs from the same title never land
 * back to back — deterministic, unlike a random shuffle, which React's
 * purity rule for Server Components rejects inside a render function anyway.
 */
function interleaveByAnime(tracks: MusicTrack[]): MusicTrack[] {
  const groups = new Map<string, MusicTrack[]>();
  for (const track of tracks) {
    const key = track.href ?? track.subtitle;
    const group = groups.get(key) ?? [];
    group.push(track);
    groups.set(key, group);
  }

  const queues = [...groups.values()];
  const merged: MusicTrack[] = [];
  let remaining = tracks.length;
  let cursor = 0;

  while (remaining > 0) {
    const queue = queues[cursor % queues.length]!;
    const next = queue.shift();
    if (next) {
      merged.push(next);
      remaining--;
    }
    cursor++;
  }

  return merged;
}

export default async function MusicPage({ params }: Props) {
  const { t } = await getDictionary(params);
  const home = await getAnimeHome();

  const seedTitles = home.ongoing_anime
    .map((anime) => anime.title)
    .filter((title): title is string => Boolean(title))
    .slice(0, 16);

  const themeSets = await Promise.all(seedTitles.map((title) => getAnimeThemes(title)));

  const bySlug = new Map(home.ongoing_anime.map((anime) => [anime.title, anime.slug]));

  const tracks: MusicTrack[] = themeSets
    .flatMap((set, index) => {
      if (!set) return [];
      const slug = bySlug.get(seedTitles[index]!);
      return set.themes.slice(0, 2).map((theme) => ({
        id: `${set.matchedTitle}-${theme.id}`,
        title: theme.title ?? `${theme.type}${theme.sequence}`,
        subtitle: [set.matchedTitle, `${theme.type}${theme.sequence}`].join(" · "),
        audioUrl: theme.audioUrl!,
        cover: set.cover,
        href: slug ? `/anime/${slug}` : undefined,
      }));
    });

  const playlist = interleaveByAnime(tracks);

  return (
    <PageShell
      title={t.pages.music.title}
      description={t.pages.music.description}
      crumbs={[
        { label: t.crumbs.home, href: "/" },
        { label: t.pages.music.title, href: "/musik" },
      ]}
    >
      {playlist.length ? (
        <>
          <PlaylistPlayer tracks={playlist} />
          <p className="text-muted-foreground mt-4 font-mono text-[0.65rem] uppercase">
            {t.pages.music.poweredBy}
          </p>
        </>
      ) : (
        <EmptyState title={t.pages.music.emptyTitle} description={t.pages.music.emptyBody} />
      )}
    </PageShell>
  );
}
