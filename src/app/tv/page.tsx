import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getTvCategories, getTvChannels } from "@/services/tv";
import PageShell from "@/components/media/page-shell";
import EmptyState from "@/components/media/empty-state";
import JsonLd from "@/components/seo/json-ld";
import { absoluteUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

export const revalidate = 21_600;

type Props = { searchParams: Promise<{ category?: string; q?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { category } = await searchParams;

  return {
    title: category ? `TV Indonesia — ${category}` : "TV Indonesia Live Streaming",
    description:
      "Nonton siaran TV Indonesia gratis: berita, olahraga, hiburan dan channel daerah, langsung dari browser.",
    alternates: { canonical: "/tv" },
    robots: category ? { index: false, follow: true } : undefined,
  };
}

export default async function TvPage({ searchParams }: Props) {
  const { category, q } = await searchParams;
  const [{ channels, total }, categories] = await Promise.all([
    getTvChannels({ category, q }),
    getTvCategories(),
  ]);

  return (
    <PageShell
      title="TV Indonesia"
      description={total ? `${total} channel dengan siaran aktif.` : undefined}
      crumbs={[
        { label: "Beranda", href: "/" },
        { label: "TV Live", href: "/tv" },
      ]}
      wide
    >
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Channel TV Indonesia",
          url: absoluteUrl("/tv"),
          numberOfItems: channels.length,
          itemListElement: channels.slice(0, 50).map((channel, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: channel.name,
            url: absoluteUrl(`/tv/${channel.id}`),
          })),
        }}
      />

      <nav aria-label="Kategori" className="mb-5 flex flex-wrap gap-px border bg-border [&>*]:bg-background">
        <Link
          href="/tv"
          className={cn(
            "px-3 py-2 font-mono text-xs uppercase transition-colors",
            !category ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-accent",
          )}
        >
          Semua
        </Link>
        {categories.map((item) => (
          <Link
            key={item.slug}
            href={`/tv?category=${item.slug}`}
            className={cn(
              "px-3 py-2 font-mono text-xs uppercase transition-colors",
              category === item.slug
                ? "bg-primary text-primary-foreground font-semibold"
                : "hover:bg-accent",
            )}
          >
            {item.slug} <span className="opacity-60">{item.count}</span>
          </Link>
        ))}
      </nav>

      {channels.length ? (
        <ul className="grid grid-cols-2 gap-px border bg-border sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 [&>*]:bg-background">
          {channels.map((channel) => (
            <li key={channel.id}>
              <Link
                href={`/tv/${channel.id}`}
                className="hover:bg-accent group flex h-full items-center gap-3 p-3 transition-colors"
              >
                <span className="bg-muted relative size-12 shrink-0 border">
                  {channel.logo ? (
                    <Image
                      src={channel.logo}
                      alt=""
                      fill
                      sizes="48px"
                      className="object-contain p-1"
                      unoptimized
                    />
                  ) : null}
                </span>
                <span className="min-w-0">
                  <span className="group-hover:text-primary block truncate text-sm font-semibold">
                    {channel.name}
                  </span>
                  <span className="text-muted-foreground block truncate font-mono text-[0.65rem] uppercase">
                    {channel.categories.join(" · ") || "umum"}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title="Tidak ada channel"
          description="Coba kategori lain."
          action={{ href: "/tv", label: "Lihat semua channel" }}
        />
      )}
    </PageShell>
  );
}
