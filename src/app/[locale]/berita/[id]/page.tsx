import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { getNews, getNewsArticle } from "@/services/news";
import PageShell from "@/components/media/page-shell";
import ArticleBody from "@/components/news/article-body";
import JsonLd from "@/components/seo/json-ld";
import { absoluteUrl, localeAlternates } from "@/lib/site";
import { formatNewsDate } from "@/lib/date";

export const revalidate = 86_400;

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const article = await getNewsArticle(id);
  if (!article) return { title: "Berita tidak ditemukan", robots: { index: false, follow: false } };

  const description = article.intro ?? article.summary ?? undefined;

  return {
    title: article.title,
    description,
    alternates: {
      canonical: `/berita/${id}`,
      languages: localeAlternates(`/berita/${id}`),
    },
    openGraph: {
      type: "article",
      title: article.title,
      description,
      url: absoluteUrl(`/berita/${id}`),
      publishedTime: article.published_at ?? undefined,
      images: article.image ? [{ url: article.image }] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { id } = await params;
  const article = await getNewsArticle(id);
  if (!article) notFound();

  const related = (await getNews({ limit: 8 })).filter((item) => item.id !== id).slice(0, 6);

  return (
    <PageShell
      title={article.title}
      description={article.intro ?? undefined}
      crumbs={[
        { label: "Beranda", href: "/" },
        { label: "Berita", href: "/berita" },
        { label: article.title, href: `/berita/${id}` },
      ]}
    >
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          headline: article.title,
          description: article.intro ?? article.summary ?? undefined,
          image: article.image ?? undefined,
          datePublished: article.published_at ?? undefined,
          url: absoluteUrl(`/berita/${id}`),
          // The original is the authoritative copy; say so explicitly.
          isBasedOn: article.link,
          publisher: { "@type": "Organization", name: article.source.name, url: article.source.url },
        }}
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_260px]">
        <article className="min-w-0">
          <p className="text-muted-foreground mb-4 flex flex-wrap items-center gap-2 font-mono text-[0.7rem] uppercase">
            {article.category ? <span className="text-primary">{article.category}</span> : null}
            {article.published_at ? (
              <time dateTime={article.published_at}>{formatNewsDate(article.published_at)}</time>
            ) : null}
          </p>

          {article.image ? (
            <figure className="bg-muted relative mb-6 aspect-video border">
              <Image
                src={article.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 720px, 100vw"
                priority
                className="object-cover"
                unoptimized
              />
            </figure>
          ) : null}

          {article.blocks.length ? (
            <ArticleBody blocks={article.blocks} />
          ) : (
            <p className="text-muted-foreground text-sm">
              Isi artikel tidak bisa dimuat. Baca versi lengkapnya di {article.source.name}.
            </p>
          )}

          {/* Attribution is not a footnote here — the reporting is theirs. */}
          <div className="mt-8 border p-4">
            <p className="eyebrow">Sumber</p>
            <p className="mt-2 text-sm">
              Artikel ini ditulis dan diterbitkan oleh{" "}
              <a
                href={article.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-semibold"
              >
                {article.source.name}
              </a>
              . Natee hanya menampilkannya di sini agar kamu tidak perlu berpindah situs.
            </p>
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="press hover:bg-accent mt-3 inline-flex items-center gap-2 border px-3 py-2 font-mono text-xs uppercase"
            >
              Buka artikel asli
              <ExternalLink className="size-3.5" aria-hidden />
            </a>
          </div>
        </article>

        {related.length ? (
          <aside>
            <div className="border">
              <p className="eyebrow border-b p-3">Berita lain</p>
              <ul>
                {related.map((item) => (
                  <li key={item.id} className="border-b last:border-b-0">
                    <Link
                      href={`/berita/${item.id}`}
                      className="hover:bg-accent block p-3 text-sm transition-colors"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        ) : null}
      </div>
    </PageShell>
  );
}
