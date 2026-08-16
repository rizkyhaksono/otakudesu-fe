import type { Metadata } from "next";
import { searchAnime } from "@/services/anime";
import PageShell from "@/components/media/page-shell";
import { getDictionary } from "@/lib/i18n/server";
import PosterCard from "@/components/media/poster-card";
import PosterGrid from "@/components/media/poster-grid";
import EmptyState from "@/components/media/empty-state";
import SearchForm from "@/components/search/search-form";

export const revalidate = 300;

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const [{ t }, { q }] = await Promise.all([getDictionary(params), searchParams]);
  const query = q?.trim();

  return {
    title: query ? `${t.crumbs.search} “${query}”` : t.pages.search.title,
    description: query
      ? `${t.common.resultsFor} “${query}”.`
      : t.pages.search.title,
    // Search result pages should not compete with real content in the index.
    robots: { index: false, follow: true },
  };
}

export default async function SearchPage({ params, searchParams }: Props) {
  const [{ t }, search] = await Promise.all([getDictionary(params), searchParams]);
  const query = search.q?.trim() ?? "";
  const results = query ? await searchAnime(query) : [];

  return (
    <PageShell
      title={t.pages.search.title}
      crumbs={[
        { label: t.crumbs.home, href: "/" },
        { label: t.crumbs.search, href: "/search" },
      ]}
      wide
    >
      <SearchForm action="/search" placeholder={t.pages.search.placeholder} defaultValue={query} />

      {query ? (
        <div className="mt-6">
          <p className="text-muted-foreground mb-3 font-mono text-xs uppercase">
            {results.length} {t.common.resultsFor} “{query}”
          </p>

          {results.length ? (
            <PosterGrid>
              {results.map((item, index) => (
                <PosterCard
                  key={item.slug}
                  href={`/anime/${item.slug}`}
                  title={item.title ?? t.common.untitled}
                  poster={item.poster}
                  badge={item.status}
                  rating={item.rating}
                  priority={index < 7}
                />
              ))}
            </PosterGrid>
          ) : (
            <EmptyState
              title={t.pages.search.emptyTitle}
              description={t.pages.search.emptyBody}
              action={{ href: "/genres", label: t.crumbs.genres }}
            />
          )}
        </div>
      ) : (
        <p className="text-muted-foreground mt-6 text-sm">Ketik judul lalu tekan Enter.</p>
      )}
    </PageShell>
  );
}
