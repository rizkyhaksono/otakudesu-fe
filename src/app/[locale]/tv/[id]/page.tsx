import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTvChannel, getTvChannels } from "@/services/tv";
import PageShell from "@/components/media/page-shell";
import HlsPlayer from "@/components/tv/hls-player";
import RecordView from "@/components/history/record-view";
import BookmarkButton from "@/components/history/bookmark-button";
import JsonLd from "@/components/seo/json-ld";
import { apiBaseUrl } from "@/lib/api";
import { absoluteUrl, localeAlternates } from "@/lib/site";
import { dictionaryFor } from "@/lib/i18n/server";

export const revalidate = 21_600;

type Props = { params: Promise<{ id: string; locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, locale } = await params;
  const t = dictionaryFor(locale);
  const channel = await getTvChannel(id);
  if (!channel) return { title: t.pages.tv.emptyTitle, robots: { index: false, follow: false } };

  const title = `${channel.name} — ${t.pages.tv.liveBroadcast}`;
  const description = `${channel.name}${channel.network ? ` (${channel.network})` : ""} — ${
    t.pages.tv.liveBroadcast
  }.`;

  return {
    title,
    description,
    alternates: { canonical: `/tv/${id}`, languages: localeAlternates(`/tv/${id}`) },
    openGraph: {
      type: "video.other",
      title,
      description,
      url: absoluteUrl(`/tv/${id}`),
      images: channel.logo ? [{ url: channel.logo }] : undefined,
    },
  };
}

export default async function TvChannelPage({ params }: Props) {
  const { id, locale } = await params;
  const t = dictionaryFor(locale);
  const channel = await getTvChannel(id);
  if (!channel) notFound();

  const related = (await getTvChannels({ category: channel.categories[0] })).channels
    .filter((item) => item.id !== channel.id)
    .slice(0, 10);

  const facts = [
    [t.pages.tv.network, channel.network],
    [t.pages.tv.owners, channel.owners.join(", ") || null],
    [t.pages.tv.categories, channel.categories.join(", ") || null],
    [t.pages.tv.launched, channel.launched],
  ].filter(([, value]) => Boolean(value)) as [string, string][];

  return (
    <PageShell
      title={channel.name}
      description={t.pages.tv.liveBroadcast}
      crumbs={[
        { label: t.crumbs.home, href: "/" },
        { label: t.crumbs.tv, href: "/tv" },
        { label: channel.name, href: `/tv/${id}` },
      ]}
      wide
    >
      <RecordView
        kind="tv"
        id={`tv:${id}`}
        title={channel.name}
        href={`/tv/${id}`}
        poster={channel.logo}
        progress={t.pages.tv.live}
      />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BroadcastService",
          name: channel.name,
          url: absoluteUrl(`/tv/${id}`),
          inLanguage: "id-ID",
          areaServed: "ID",
          broadcastDisplayName: channel.name,
          logo: channel.logo,
          parentService: channel.network
            ? { "@type": "BroadcastService", name: channel.network }
            : undefined,
        }}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="min-w-0">
          <HlsPlayer streams={channel.streams} apiBase={apiBaseUrl()} channelName={channel.name} />

          {facts.length ? (
            <dl className="mt-6 grid grid-cols-2 gap-px border bg-border sm:grid-cols-4 [&>*]:bg-background">
              {facts.map(([label, value]) => (
                <div key={label} className="p-3">
                  <dt className="eyebrow">{label}</dt>
                  <dd className="mt-1 text-sm font-medium break-words">{value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>

        <aside className="space-y-4">
          <div className="flex items-center gap-3 border p-3">
            <span className="bg-muted relative size-14 shrink-0 border">
              {channel.logo ? (
                <Image
                  src={channel.logo}
                  alt=""
                  fill
                  sizes="56px"
                  className="object-contain p-1"
                  unoptimized
                />
              ) : null}
            </span>
            <span className="min-w-0">
              <span className="block truncate font-semibold">{channel.name}</span>
              <span className="text-primary flex items-center gap-1.5 font-mono text-[0.7rem] uppercase">
                <span className="bg-primary size-1.5 animate-pulse" aria-hidden />
                {t.pages.tv.live}
              </span>
            </span>
          </div>

          <BookmarkButton
            kind="tv"
            id={`tv:${id}`}
            title={channel.name}
            href={`/tv/${id}`}
            poster={channel.logo}
          />

          {related.length ? (
            <div className="border">
              <p className="eyebrow border-b p-3">{t.pages.tv.otherChannels}</p>
              <ul>
                {related.map((item) => (
                  <li key={item.id} className="border-b last:border-b-0">
                    <Link
                      href={`/tv/${item.id}`}
                      className="hover:bg-accent block px-3 py-2 text-sm transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>
      </div>
    </PageShell>
  );
}
