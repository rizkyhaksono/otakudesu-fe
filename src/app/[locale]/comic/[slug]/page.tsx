import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { metaDescription } from "@/lib/seo";
import { BookOpen } from "lucide-react";
import { getComic } from "@/services/comic";
import PageShell from "@/components/media/page-shell";
import { dictionaryFor } from "@/lib/i18n/server";
import PosterCard from "@/components/media/poster-card";
import PosterGrid from "@/components/media/poster-grid";
import Section from "@/components/media/section";
import JsonLd from "@/components/seo/json-ld";
import RecordView from "@/components/history/record-view";
import BookmarkButton from "@/components/history/bookmark-button";
import ChapterList from "@/components/comic/chapter-list";
import { Button } from "@/components/ui/button";
import { absoluteUrl, localeAlternates } from "@/lib/site";

export const revalidate = 1800;

type Props = { params: Promise<{ slug: string; locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const t = dictionaryFor(locale);
  const comic = await getComic(slug);
  if (!comic) return { title: t.crumbs.comic, robots: { index: false, follow: false } };

  const description = metaDescription(
    comic.synopsis,
    `Baca ${comic.title} bahasa Indonesia, update chapter terbaru dan gambar berkualitas.`,
  );

  return {
    title: comic.title ?? slug,
    description,
    alternates: { canonical: `/comic/${slug}`, languages: localeAlternates(`/comic/${slug}`) },
    openGraph: {
      type: "book",
      title: comic.title ?? slug,
      description,
      url: absoluteUrl(`/comic/${slug}`),
      images: comic.poster ? [{ url: comic.poster }] : undefined,
    },
  };
}

export default async function ComicDetailPage({ params }: Props) {
  const { slug, locale } = await params;
  const t = dictionaryFor(locale);
  const comic = await getComic(slug);
  if (!comic) notFound();

  const firstChapter = comic.chapters.at(-1) ?? comic.first_chapter;
  const latestChapter = comic.chapters.at(0);

  const facts = [
    ["Tipe", comic.type],
    ["Status", comic.status],
    ["Penulis", comic.author],
    ["Artis", comic.artist],
    ["Tahun", comic.release_year?.toString()],
    ["Dibaca", comic.views_count?.toLocaleString("id-ID")],
    ["Peringkat", comic.rank ? `#${comic.rank}` : null],
    ["Chapter", comic.chapters.length ? String(comic.chapters.length) : null],
  ].filter(([, value]) => Boolean(value)) as [string, string][];

  return (
    <PageShell
      title={comic.title ?? slug}
      crumbs={[
        { label: t.crumbs.home, href: "/" },
        { label: t.crumbs.comic, href: "/comic" },
        { label: comic.title ?? slug, href: `/comic/${slug}` },
      ]}
      wide
    >
      <RecordView
        kind="comic"
        id={`comic:${slug}`}
        title={comic.title ?? slug}
        href={`/comic/${slug}`}
        poster={comic.poster}
        progress={latestChapter?.title ?? null}
      />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Book",
          name: comic.title,
          image: comic.poster,
          description: comic.synopsis,
          url: absoluteUrl(`/comic/${slug}`),
          inLanguage: "id-ID",
          bookFormat: "https://schema.org/GraphicNovel",
          author: comic.author ? { "@type": "Person", name: comic.author } : undefined,
          genre: comic.genres.map((genre) => genre.name),
          numberOfPages: undefined,
          aggregateRating: comic.rating
            ? {
                "@type": "AggregateRating",
                ratingValue: comic.rating,
                bestRating: "10",
                ratingCount: comic.total_raters ?? 1,
              }
            : undefined,
        }}
      />

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <div>
          <div className="bg-muted relative aspect-[2/3] border">
            {comic.poster ? (
              <Image
                src={comic.poster}
                alt={comic.title ?? ""}
                fill
                sizes="240px"
                priority
                className="object-cover"
              />
            ) : null}
          </div>

          <div className="mt-3 flex flex-col gap-2">
            {firstChapter?.chapter_number !== null && firstChapter?.chapter_number !== undefined ? (
              <Button asChild className="w-full gap-2">
                <Link href={`/comic/${slug}/chapter/${firstChapter.chapter_number}`}>
                  <BookOpen className="size-4" aria-hidden />
                  Baca dari awal
                </Link>
              </Button>
            ) : null}
            {latestChapter?.chapter_number !== null && latestChapter?.chapter_number !== undefined ? (
              <Button asChild variant="outline" className="w-full">
                <Link href={`/comic/${slug}/chapter/${latestChapter.chapter_number}`}>
                  Chapter terbaru
                </Link>
              </Button>
            ) : null}
            <BookmarkButton
              kind="comic"
              id={`comic:${slug}`}
              title={comic.title ?? slug}
              href={`/comic/${slug}`}
              poster={comic.poster}
            />
          </div>
        </div>

        <div className="min-w-0">
          {comic.rating ? (
            <p className="mb-3 flex items-baseline gap-2">
              <span className="font-mono text-3xl leading-none font-medium tabular-nums">
                {comic.rating.toFixed(1)}
              </span>
              <span className="text-muted-foreground font-mono text-xs uppercase">
                / 10 · {comic.total_raters ?? 0} penilai
              </span>
            </p>
          ) : null}

          {comic.genres.length ? (
            <ul className="mb-4 flex flex-wrap gap-1.5">
              {comic.genres.map((genre) => (
                <li key={genre.slug}>
                  {/* Clickable, like the anime genres — a dead-end chip on a
                      detail page is a missed navigation path for readers and
                      crawlers alike. */}
                  <Link
                    href={`/comic/browse?genre=${genre.slug}`}
                    className="chip press hover:border-primary hover:text-primary"
                  >
                    {genre.icon ? <span aria-hidden>{genre.icon}</span> : null}
                    {genre.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}

          <dl className="grid grid-cols-2 gap-px border bg-border sm:grid-cols-4 [&>*]:bg-background">
            {facts.map(([label, value]) => (
              <div key={label} className="p-3">
                <dt className="eyebrow">{label}</dt>
                <dd className="mt-1 text-sm font-medium break-words">{value}</dd>
              </div>
            ))}
          </dl>

          {comic.synopsis ? (
            <div className="mt-6">
              <h2 className="eyebrow">Sinopsis</h2>
              <p className="mt-2 text-sm leading-relaxed whitespace-pre-line">{comic.synopsis}</p>
            </div>
          ) : null}
        </div>
      </div>

      {comic.chapters.length ? (
        <Section
          title={t.pages.comic.chapters}
          eyebrow={`${comic.chapters.length}`}
        >
          <ChapterList slug={slug} chapters={comic.chapters} />
        </Section>
      ) : null}

      {comic.related.length ? (
        <Section title={t.pages.comic.similar} eyebrow={t.pages.comic.similarEyebrow}>
          <PosterGrid>
            {comic.related.map((item) => (
              <PosterCard
                key={item.slug}
                href={`/comic/${item.slug}`}
                title={item.title ?? "Tanpa judul"}
                poster={item.poster}
                badge={item.type}
              />
            ))}
          </PosterGrid>
        </Section>
      ) : null}
    </PageShell>
  );
}
