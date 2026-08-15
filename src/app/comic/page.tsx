import type { Metadata } from "next";
import { getComicHome } from "@/services/comic";
import PageShell from "@/components/media/page-shell";
import PosterCard from "@/components/media/poster-card";
import PosterGrid from "@/components/media/poster-grid";
import Section from "@/components/media/section";
import EmptyState from "@/components/media/empty-state";
import type { ComicSummary } from "@/types/api";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Baca Komik — Manga, Manhwa & Manhua",
  description:
    "Baca manga, manhwa dan manhua bahasa Indonesia gratis. Update chapter terbaru setiap hari.",
  alternates: { canonical: "/comic" },
};

function toCard(item: ComicSummary) {
  return (
    <PosterCard
      key={item.slug}
      href={`/comic/${item.slug}`}
      title={item.title ?? "Tanpa judul"}
      poster={item.poster}
      badge={item.type}
      meta={item.latest_chapter?.title}
      rating={item.rating?.toFixed(1)}
    />
  );
}

export default async function ComicHomePage() {
  const home = await getComicHome();
  const hasAny =
    home.latest_manga.length + home.popular_manga.length + home.latest_novels.length > 0;

  return (
    <PageShell
      title="Komik"
      description="Manga, manhwa, manhua dan novel — update terbaru."
      crumbs={[
        { label: "Beranda", href: "/" },
        { label: "Komik", href: "/comic" },
      ]}
      wide
    >
      {!hasAny ? (
        <EmptyState
          title="Sumber komik sedang tidak tersedia"
          description="Coba lagi beberapa saat lagi."
          action={{ href: "/", label: "Kembali ke beranda" }}
        />
      ) : null}

      {home.latest_manga.length ? (
        <Section title="Update terbaru" eyebrow="Manga">
          <PosterGrid>{home.latest_manga.map(toCard)}</PosterGrid>
        </Section>
      ) : null}

      {home.popular_manga.length ? (
        <Section title="Populer" eyebrow="Paling banyak dibaca">
          <PosterGrid>{home.popular_manga.map(toCard)}</PosterGrid>
        </Section>
      ) : null}

      {home.trending_manga.length ? (
        <Section title="Sedang tren" eyebrow="Naik daun">
          <PosterGrid>{home.trending_manga.map(toCard)}</PosterGrid>
        </Section>
      ) : null}

      {home.latest_novels.length ? (
        <Section title="Novel terbaru" eyebrow="Light novel">
          <PosterGrid>{home.latest_novels.map(toCard)}</PosterGrid>
        </Section>
      ) : null}
    </PageShell>
  );
}
