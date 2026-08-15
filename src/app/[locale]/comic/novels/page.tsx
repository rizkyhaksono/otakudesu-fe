import type { Metadata } from "next";
import { localeAlternates } from "@/lib/site";
import { notFound } from "next/navigation";
import { browseNovels } from "@/services/comic";
import PageShell from "@/components/media/page-shell";
import PosterCard from "@/components/media/poster-card";
import PosterGrid from "@/components/media/poster-grid";
import Pager from "@/components/media/pager";
import EmptyState from "@/components/media/empty-state";
import SearchForm from "@/components/search/search-form";

export const revalidate = 1800;

type Props = { searchParams: Promise<{ page?: string; q?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { page, q } = await searchParams;
  const number = Number.parseInt(page ?? "1", 10) || 1;

  return {
    title: q ? `Cari novel “${q}”` : number > 1 ? `Novel — Halaman ${number}` : "Baca Novel",
    description:
      "Katalog light novel dan web novel bahasa Indonesia, update bab terbaru setiap hari.",
    alternates: { canonical: "/comic/novels", languages: localeAlternates("/comic/novels") },
    robots: q || number > 1 ? { index: false, follow: true } : undefined,
  };
}

export default async function NovelsPage({ searchParams }: Props) {
  const { page, q } = await searchParams;
  const number = Number.parseInt(page ?? "1", 10) || 1;
  if (number < 1) notFound();

  const data = await browseNovels({ page: number, q });

  const buildHref = (target: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (target > 1) params.set("page", String(target));
    const query = params.toString();
    return `/comic/novels${query ? `?${query}` : ""}`;
  };

  return (
    <PageShell
      title="Novel"
      description={
        data.pagination.total
          ? `${data.pagination.total.toLocaleString("id-ID")} judul terindeks.`
          : undefined
      }
      crumbs={[
        { label: "Beranda", href: "/" },
        { label: "Komik", href: "/comic" },
        { label: "Novel", href: "/comic/novels" },
      ]}
      wide
    >
      <div className="mb-6 max-w-md">
        <SearchForm action="/comic/novels" placeholder="Cari judul novel…" defaultValue={q} />
      </div>

      {data.comics.length ? (
        <>
          <PosterGrid>
            {data.comics.map((item, index) => (
              <PosterCard
                key={item.slug}
                href={`/comic/${item.slug}`}
                title={item.title ?? "Tanpa judul"}
                poster={item.poster}
                badge={item.type}
                meta={item.latest_chapter?.title}
                rating={item.rating ? item.rating.toFixed(1) : null}
                priority={index < 7}
              />
            ))}
          </PosterGrid>
          <Pager
            current={data.pagination.current_page}
            last={data.pagination.last_page}
            href={buildHref}
          />
        </>
      ) : (
        <EmptyState title="Tidak ada novel yang cocok" action={{ href: "/comic/novels", label: "Reset" }} />
      )}
    </PageShell>
  );
}
