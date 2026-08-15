import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { getNews } from "@/services/news";
import PageShell from "@/components/media/page-shell";
import EmptyState from "@/components/media/empty-state";
import JsonLd from "@/components/seo/json-ld";
import { absoluteUrl, localeAlternates } from "@/lib/site";
import { formatNewsDate } from "@/lib/date";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Berita Anime Terbaru",
  description:
    "Kabar terbaru dari dunia anime dan manga: pengumuman adaptasi, jadwal tayang, staf produksi dan rilis industri.",
  alternates: { canonical: "/berita", languages: localeAlternates("/berita") },
};

export default async function BeritaPage() {
  const items = await getNews();

  return (
    <PageShell
      title="Berita Anime"
      description="Dibaca langsung di sini, sumbernya Anime News Network."
      crumbs={[
        { label: "Beranda", href: "/" },
        { label: "Berita", href: "/berita" },
      ]}
      wide
    >
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Berita anime terbaru",
          url: absoluteUrl("/berita"),
          hasPart: items.slice(0, 30).map((item) => ({
            "@type": "NewsArticle",
            headline: item.title,
            url: item.link,
            datePublished: item.published_at ?? undefined,
          })),
        }}
      />

      {items.length ? (
        <ul className="grid gap-px border bg-border md:grid-cols-2 [&>*]:bg-background">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={`/berita/${item.id}`}
                className="hover:bg-accent group flex h-full flex-col gap-2 p-4 transition-colors"
              >
                <span className="text-muted-foreground flex items-center gap-2 font-mono text-[0.65rem] uppercase">
                  {item.category ? <span className="text-primary">{item.category}</span> : null}
                  {item.published_at ? (
                    <time dateTime={item.published_at}>
                      {formatNewsDate(item.published_at)}
                    </time>
                  ) : null}
                </span>

                <span className="group-hover:text-primary flex items-start gap-2 font-semibold text-balance">
                  {item.title}
                  <ArrowRight
                    className="text-muted-foreground mt-1 size-3.5 shrink-0 transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </span>

                {item.summary ? (
                  <span className="text-muted-foreground line-clamp-2 text-sm">{item.summary}</span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title="Berita belum tersedia"
          description="Sumber berita sedang tidak bisa dihubungi. Coba lagi nanti."
          action={{ href: "/", label: "Kembali ke beranda" }}
        />
      )}
    </PageShell>
  );
}
