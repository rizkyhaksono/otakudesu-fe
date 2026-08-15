import Link from "next/link";
import type { Metadata } from "next";
import { getComicGenres } from "@/services/comic";
import PageShell from "@/components/media/page-shell";
import EmptyState from "@/components/media/empty-state";

export const revalidate = 86_400;

export const metadata: Metadata = {
  title: "Genre Komik",
  description: "Jelajahi manga, manhwa dan manhua berdasarkan genre.",
  alternates: { canonical: "/comic/genres" },
};

export default async function ComicGenresPage() {
  const genres = await getComicGenres();

  return (
    <PageShell
      title="Genre Komik"
      description="Pilih genre untuk melihat seluruh judulnya."
      crumbs={[
        { label: "Beranda", href: "/" },
        { label: "Komik", href: "/comic" },
        { label: "Genre", href: "/comic/genres" },
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
        <EmptyState title="Genre belum tersedia" action={{ href: "/comic", label: "Kembali" }} />
      )}
    </PageShell>
  );
}
