import Link from "next/link";
import type { Metadata } from "next";
import { localeAlternates } from "@/lib/site";
import { getComicGenres } from "@/services/comic";
import PageShell from "@/components/media/page-shell";
import { getDictionary } from "@/lib/i18n/server";
import EmptyState from "@/components/media/empty-state";

export const revalidate = 86_400;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { t } = await getDictionary(params);

  return {
    title: t.pages.comicGenres.title,
    description: t.pages.comicGenres.description,
    alternates: { canonical: "/comic/genres", languages: localeAlternates("/comic/genres") },
  };
}

export default async function ComicGenresPage({ params }: Props) {
  const { t } = await getDictionary(params);
  const genres = await getComicGenres();

  return (
    <PageShell
      title={t.pages.comicGenres.title}
      description={t.pages.comicGenres.description}
      crumbs={[
        { label: t.crumbs.home, href: "/" },
        { label: t.crumbs.comic, href: "/comic" },
        { label: t.crumbs.genres, href: "/comic/genres" },
      ]}
    >
      {genres.length ? (
        <ul className="grid-hairline grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {genres.map((genre) => (
            <li key={genre.slug}>
              <Link
                href={`/comic/browse?genre=${genre.slug}`}
                className="press hover:bg-accent hover:text-primary flex items-center gap-2 px-4 py-3 text-sm font-medium"
              >
                {genre.icon ? <span aria-hidden>{genre.icon}</span> : null}
                {genre.name}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title={t.pages.comicGenres.emptyTitle} action={{ href: "/comic", label: t.common.back }} />
      )}
    </PageShell>
  );
}
