import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getTvCategories, getTvChannels } from "@/services/tv";
import PageShell from "@/components/media/page-shell";
import EmptyState from "@/components/media/empty-state";
import JsonLd from "@/components/seo/json-ld";
import { absoluteUrl, localeAlternates } from "@/lib/site";
import { cn } from "@/lib/utils";
import { getDictionary } from "@/lib/i18n/server";

export const revalidate = 21_600;

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; q?: string }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const [{ t }, { category }] = await Promise.all([getDictionary(params), searchParams]);

  return {
    title: category ? `${t.pages.tv.title} — ${category}` : t.pages.tv.title,
    description: t.tour.moreBody,
    alternates: { canonical: "/tv", languages: localeAlternates("/tv") },
    robots: category ? { index: false, follow: true } : undefined,
  };
}

export default async function TvPage({ params, searchParams }: Props) {
  const [{ t }, { category, q }] = await Promise.all([getDictionary(params), searchParams]);
  const [{ channels, total }, categories] = await Promise.all([
    getTvChannels({ category, q }),
    getTvCategories(),
  ]);

  return (
    <PageShell
      title={t.pages.tv.title}
      description={total ? `${total} ${t.pages.tv.channels}` : undefined}
      crumbs={[
        { label: t.crumbs.home, href: "/" },
        { label: t.crumbs.tv, href: "/tv" },
      ]}
      wide
    >
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: t.pages.tv.title,
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

      <nav aria-label={t.pages.tv.categories} className="mb-5 flex flex-wrap gap-px border bg-border">
        <Link
          href="/tv"
          className={cn(
            "px-3 py-2 font-mono text-xs uppercase transition-colors",
            !category
              ? "bg-primary text-primary-foreground font-semibold"
              : "bg-background hover:bg-accent",
          )}
        >
          {t.pages.tv.all}
        </Link>
        {categories.map((item) => (
          <Link
            key={item.slug}
            href={`/tv?category=${item.slug}`}
            className={cn(
              "px-3 py-2 font-mono text-xs uppercase transition-colors",
              category === item.slug
                ? "bg-primary text-primary-foreground font-semibold"
                : "bg-background hover:bg-accent",
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
                    {channel.categories.join(" · ") || t.pages.tv.all}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title={t.pages.tv.emptyTitle}
          description={t.pages.tv.emptyBody}
          action={{ href: "/tv", label: t.pages.tv.seeAll }}
        />
      )}
    </PageShell>
  );
}
