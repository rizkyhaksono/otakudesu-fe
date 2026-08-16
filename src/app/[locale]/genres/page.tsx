import Link from "next/link";
import type { Metadata } from "next";
import { localeAlternates } from "@/lib/site";
import { getGenres } from "@/services/anime";
import PageShell from "@/components/media/page-shell";
import { getDictionary } from "@/lib/i18n/server";
import EmptyState from "@/components/media/empty-state";

export const revalidate = 86_400;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { t } = await getDictionary(params);

  return {
    title: t.pages.genres.title,
    description: t.pages.genres.description,
    alternates: { canonical: "/genres", languages: localeAlternates("/genres") },
  };
}

export default async function GenresPage({ params }: Props) {
  const { t } = await getDictionary(params);
  const genres = await getGenres();

  return (
    <PageShell
      title={t.pages.genres.title}
      description={t.pages.genres.description}
      crumbs={[
        { label: t.crumbs.home, href: "/" },
        { label: t.crumbs.genres, href: "/genres" },
      ]}
    >
      {genres.length ? (
        <ul className="grid grid-cols-2 gap-px border bg-border sm:grid-cols-3 lg:grid-cols-4 [&>*]:bg-background">
          {genres.map((genre) => (
            <li key={genre.slug}>
              <Link
                href={`/genres/${genre.slug}`}
                className="hover:bg-accent hover:text-primary block px-4 py-3 text-sm font-medium transition-colors"
              >
                {genre.name}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title={t.pages.genres.emptyTitle} action={{ href: "/", label: t.common.back }} />
      )}
    </PageShell>
  );
}
