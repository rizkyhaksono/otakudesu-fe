import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExternalLink, Radio } from "lucide-react";
import { getRadioStation, getRadioStations } from "@/services/radio";
import PageShell from "@/components/media/page-shell";
import RadioPlayer from "@/components/radio/radio-player";
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
  const station = await getRadioStation(id);
  if (!station) return { title: t.pages.radio.emptyTitle, robots: { index: false, follow: false } };

  const title = `${station.name} — ${t.pages.radio.liveBroadcast}`;
  const description = `${station.name}${station.state ? ` · ${station.state}` : ""} — ${
    t.pages.radio.liveBroadcast
  }.`;

  return {
    title,
    description,
    alternates: { canonical: `/radio/${id}`, languages: localeAlternates(`/radio/${id}`) },
    openGraph: { type: "website", title, description, url: absoluteUrl(`/radio/${id}`) },
  };
}

export default async function RadioStationPage({ params }: Props) {
  const { id, locale } = await params;
  const t = dictionaryFor(locale);
  const station = await getRadioStation(id);
  if (!station) notFound();

  const related = (await getRadioStations({ tag: station.tags[0] })).stations
    .filter((item) => item.id !== station.id)
    .slice(0, 10);

  const facts = [
    [t.pages.radio.region, station.state],
    [t.pages.radio.language, station.language],
    [t.pages.radio.codec, station.codec],
    [t.pages.radio.bitrate, station.bitrate ? `${station.bitrate} kbps` : null],
  ].filter(([, value]) => Boolean(value)) as [string, string][];

  return (
    <PageShell
      title={station.name}
      description={t.pages.radio.liveBroadcast}
      crumbs={[
        { label: t.crumbs.home, href: "/" },
        { label: t.crumbs.radio, href: "/radio" },
        { label: station.name, href: `/radio/${id}` },
      ]}
      wide
    >
      <RecordView
        kind="radio"
        id={`radio:${id}`}
        title={station.name}
        href={`/radio/${id}`}
        poster={station.favicon}
        progress={t.pages.tv.live}
      />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "RadioStation",
          name: station.name,
          url: absoluteUrl(`/radio/${id}`),
          sameAs: station.homepage ?? undefined,
          areaServed: station.state ?? "ID",
          inLanguage: station.language ?? "id-ID",
        }}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="min-w-0">
          <RadioPlayer
            direct={station.direct}
            proxyUrl={station.proxy_url}
            apiBase={apiBaseUrl()}
            stationName={station.name}
          />

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

          {station.tags.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {station.tags.map((item) => (
                <Link key={item} href={`/radio?tag=${encodeURIComponent(item)}`} className="chip">
                  {item}
                </Link>
              ))}
            </div>
          ) : null}
        </div>

        <aside className="space-y-4">
          <div className="flex items-center gap-3 border p-3">
            <span className="bg-muted text-muted-foreground flex size-14 shrink-0 items-center justify-center border">
              <Radio className="size-6" aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block truncate font-semibold">{station.name}</span>
              <span className="text-muted-foreground block truncate font-mono text-[0.7rem] uppercase">
                {station.state ?? t.pages.radio.title}
              </span>
            </span>
          </div>

          <BookmarkButton
            kind="radio"
            id={`radio:${id}`}
            title={station.name}
            href={`/radio/${id}`}
            poster={station.favicon}
          />

          {station.homepage ? (
            <a
              href={station.homepage}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="hover:bg-accent flex items-center justify-between gap-2 border p-3 text-sm transition-colors"
            >
              {t.pages.radio.officialSite}
              <ExternalLink className="size-4 shrink-0" aria-hidden />
            </a>
          ) : null}

          {related.length ? (
            <div className="border">
              <p className="eyebrow border-b p-3">{t.pages.radio.otherStations}</p>
              <ul>
                {related.map((item) => (
                  <li key={item.id} className="border-b last:border-b-0">
                    <Link
                      href={`/radio/${item.id}`}
                      className="hover:bg-accent block truncate px-3 py-2 text-sm transition-colors"
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
