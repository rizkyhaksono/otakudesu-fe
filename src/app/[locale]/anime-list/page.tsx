import Link from "next/link";
import type { Metadata } from "next";
import { localeAlternates } from "@/lib/site";
import { getAnimeList } from "@/services/anime";
import PageShell from "@/components/media/page-shell";
import { getDictionary } from "@/lib/i18n/server";
import EmptyState from "@/components/media/empty-state";

export const revalidate = 86_400;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { t } = await getDictionary(params);

  return {
    title: t.pages.animeList.title,
    description: t.pages.animeList.description,
    alternates: { canonical: "/anime-list", languages: localeAlternates("/anime-list") },
  };
}

/**
 * The A–Z directory. Beyond being useful, this is the strongest internal
 * linking surface on the site — one page that links the entire catalogue,
 * which is exactly what a crawler needs to discover every detail page.
 */
export default async function AnimeListPage({ params }: Props) {
  const { t, locale } = await getDictionary(params);
  const groups = await getAnimeList();
  const total = groups.reduce((sum, group) => sum + group.anime_list.length, 0);

  return (
    <PageShell
      title={t.pages.animeList.title}
      description={total ? `${total.toLocaleString(locale)} ${t.pages.comicBrowse.indexed}` : undefined}
      crumbs={[
        { label: t.crumbs.home, href: "/" },
        { label: t.crumbs.directory, href: "/anime-list" },
      ]}
      wide
    >
      {groups.length ? (
        <>
          <nav aria-label={t.crumbs.directory} className="mb-6 flex flex-wrap gap-px border bg-border [&>*]:bg-background">
            {groups.map((group) => (
              <a
                key={group.letter}
                href={`#huruf-${encodeURIComponent(group.letter)}`}
                className="hover:bg-accent flex size-9 items-center justify-center font-mono text-xs font-medium uppercase transition-colors"
              >
                {group.letter}
              </a>
            ))}
          </nav>

          <div className="space-y-8">
            {groups.map((group) => (
              <section key={group.letter} id={`huruf-${encodeURIComponent(group.letter)}`}>
                <h2 className="font-display bg-foreground text-background inline-block px-2 py-0.5 text-lg font-extrabold uppercase">
                  {group.letter}
                </h2>
                <ul className="mt-2 grid gap-px border bg-border sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 [&>*]:bg-background">
                  {group.anime_list.map((anime) => (
                    <li key={anime.slug}>
                      <Link
                        href={`/anime/${anime.slug}`}
                        className="hover:bg-accent hover:text-primary block px-3 py-2 text-sm transition-colors"
                      >
                        {anime.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </>
      ) : (
        <EmptyState title={t.pages.animeList.emptyTitle} action={{ href: "/", label: t.common.back }} />
      )}
    </PageShell>
  );
}
