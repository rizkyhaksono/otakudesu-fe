import Link from "next/link";
import type { Metadata } from "next";
import { localeAlternates } from "@/lib/site";
import { getGenres } from "@/services/anime";
import PageShell from "@/components/media/page-shell";
import EmptyState from "@/components/media/empty-state";

export const revalidate = 86_400;

export const metadata: Metadata = {
  title: "Genre Anime",
  description: "Jelajahi anime berdasarkan genre — action, romance, isekai, dan lainnya.",
  alternates: { canonical: "/genres", languages: localeAlternates("/genres") },
};

export default async function GenresPage() {
  const genres = await getGenres();

  return (
    <PageShell
      title="Genre"
      description="Pilih genre untuk melihat semua anime di dalamnya."
      crumbs={[
        { label: "Beranda", href: "/" },
        { label: "Genre", href: "/genres" },
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
        <EmptyState title="Genre belum tersedia" action={{ href: "/", label: "Kembali" }} />
      )}
    </PageShell>
  );
}
