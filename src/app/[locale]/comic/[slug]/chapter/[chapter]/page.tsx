import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getComicChapter } from "@/services/comic";
import ComicReader from "@/components/comic/comic-reader";
import RecordView from "@/components/history/record-view";
import JsonLd from "@/components/seo/json-ld";
import { absoluteUrl, localeAlternates } from "@/lib/site";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string; chapter: string }> };

function parseChapter(value: string): number {
  const chapter = Number.parseFloat(value);
  return Number.isFinite(chapter) && chapter >= 0 ? chapter : NaN;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, chapter } = await params;
  const number = parseChapter(chapter);
  if (Number.isNaN(number)) return { robots: { index: false, follow: false } };

  const data = await getComicChapter(slug, number);
  if (!data) return { title: "Chapter tidak ditemukan", robots: { index: false, follow: false } };

  const title = `${data.comic.title ?? slug} — ${data.title ?? `Chapter ${number}`}`;

  return {
    title,
    description: `Baca ${data.comic.title ?? slug} chapter ${number} bahasa Indonesia, kualitas gambar jernih.`,
    alternates: { canonical: `/comic/${slug}/chapter/${number}`, languages: localeAlternates(`/comic/${slug}/chapter/${number}`) },
    openGraph: {
      type: "article",
      title,
      url: absoluteUrl(`/comic/${slug}/chapter/${number}`),
      images: data.comic.poster ? [{ url: data.comic.poster }] : undefined,
    },
  };
}

export default async function ComicChapterPage({ params }: Props) {
  const { slug, chapter } = await params;
  const number = parseChapter(chapter);
  if (Number.isNaN(number)) notFound();

  const data = await getComicChapter(slug, number);
  if (!data || !data.images.length) notFound();

  return (
    <>
      <RecordView
        kind="comic"
        id={`comic:${slug}`}
        part={number}
        title={data.comic.title ?? slug}
        href={`/comic/${slug}/chapter/${number}`}
        poster={data.comic.poster}
        progress={data.title ?? `Chapter ${number}`}
      />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Chapter",
          name: data.title,
          position: number,
          url: absoluteUrl(`/comic/${slug}/chapter/${number}`),
          inLanguage: "id-ID",
          isPartOf: {
            "@type": "Book",
            name: data.comic.title,
            url: absoluteUrl(`/comic/${slug}`),
          },
        }}
      />

      <ComicReader slug={slug} chapter={data} />
    </>
  );
}
