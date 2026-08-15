import Link from "next/link";
import type { Metadata } from "next";
import { Radio } from "lucide-react";
import { getRadioStations, getRadioTags } from "@/services/radio";
import PageShell from "@/components/media/page-shell";
import EmptyState from "@/components/media/empty-state";
import Pager from "@/components/media/pager";
import JsonLd from "@/components/seo/json-ld";
import { absoluteUrl, localeAlternates } from "@/lib/site";
import { cn } from "@/lib/utils";

export const revalidate = 21_600;

const PER_PAGE = 60;

type Props = { searchParams: Promise<{ tag?: string; q?: string; page?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { tag, page } = await searchParams;

  return {
    title: tag ? `Radio Indonesia — ${tag}` : "Radio Indonesia Online",
    description:
      "Dengarkan radio Indonesia streaming online gratis: pop, dangdut, rock, berita dan stasiun daerah, langsung dari browser.",
    alternates: { canonical: "/radio", languages: localeAlternates("/radio") },
    // Filtered and paged views are navigation, not content worth indexing
    // separately — the same rule the TV listing follows.
    robots: tag || page ? { index: false, follow: true } : undefined,
  };
}

export default async function RadioPage({ searchParams }: Props) {
  const { tag, q, page } = await searchParams;
  const [{ stations, total }, tags] = await Promise.all([
    getRadioStations({ tag, q }),
    getRadioTags(),
  ]);

  const current = Math.max(1, Number(page) || 1);
  const last = Math.max(1, Math.ceil(stations.length / PER_PAGE));
  const visible = stations.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const pageHref = (next: number) => {
    const params = new URLSearchParams();
    if (tag) params.set("tag", tag);
    if (q) params.set("q", q);
    if (next > 1) params.set("page", String(next));
    const query = params.toString();
    return `/radio${query ? `?${query}` : ""}`;
  };

  return (
    <PageShell
      title="Radio Indonesia"
      description={total ? `${total} stasiun dengan siaran aktif.` : undefined}
      crumbs={[
        { label: "Beranda", href: "/" },
        { label: "Radio", href: "/radio" },
      ]}
      wide
    >
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Stasiun radio Indonesia",
          url: absoluteUrl("/radio"),
          numberOfItems: visible.length,
          itemListElement: visible.slice(0, 50).map((station, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: station.name,
            url: absoluteUrl(`/radio/${station.id}`),
          })),
        }}
      />

      <nav
        aria-label="Kategori"
        className="mb-5 flex flex-wrap gap-px border bg-border [&>*]:bg-background"
      >
        <Link
          href="/radio"
          className={cn(
            "px-3 py-2 font-mono text-xs uppercase transition-colors",
            !tag ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-accent",
          )}
        >
          Semua
        </Link>
        {tags.map((item) => (
          <Link
            key={item.slug}
            href={`/radio?tag=${encodeURIComponent(item.slug)}`}
            className={cn(
              "px-3 py-2 font-mono text-xs uppercase transition-colors",
              tag === item.slug
                ? "bg-primary text-primary-foreground font-semibold"
                : "hover:bg-accent",
            )}
          >
            {item.slug} <span className="opacity-60">{item.count}</span>
          </Link>
        ))}
      </nav>

      {visible.length ? (
        <>
          <ul className="grid grid-cols-1 gap-px border bg-border sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 [&>*]:bg-background">
            {visible.map((station) => (
              <li key={station.id}>
                <Link
                  href={`/radio/${station.id}`}
                  className="hover:bg-accent group flex h-full items-center gap-3 p-3 transition-colors"
                >
                  <span className="bg-muted text-muted-foreground flex size-12 shrink-0 items-center justify-center border">
                    <Radio className="size-5" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="group-hover:text-primary block truncate text-sm font-semibold">
                      {station.name}
                    </span>
                    <span className="text-muted-foreground block truncate font-mono text-[0.65rem] uppercase">
                      {[station.state, station.tags.slice(0, 2).join(" · ")]
                        .filter(Boolean)
                        .join(" — ") || "radio"}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <Pager current={current} last={last} href={pageHref} />
        </>
      ) : (
        <EmptyState
          title="Tidak ada stasiun"
          description="Coba kategori lain."
          action={{ href: "/radio", label: "Lihat semua stasiun" }}
        />
      )}
    </PageShell>
  );
}
