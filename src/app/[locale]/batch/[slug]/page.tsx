import type { Metadata } from "next";
import { localeAlternates } from "@/lib/site";
import { notFound } from "next/navigation";
import { getBatch } from "@/services/anime";
import PageShell from "@/components/media/page-shell";
import { dictionaryFor } from "@/lib/i18n/server";
import DownloadTable from "@/components/media/download-table";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string; locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const t = dictionaryFor(locale);
  const batch = await getBatch(slug);
  if (!batch) return { title: t.crumbs.batch, robots: { index: false, follow: false } };

  return {
    title: batch.batch ?? t.pages.animeDetail.batchDownload,
    description: `${batch.batch ?? slug} — ${t.pages.batch.description}`,
    alternates: { canonical: `/batch/${slug}`, languages: localeAlternates(`/batch/${slug}`) },
  };
}

/**
 * The batch endpoint has existed in the API from the start but never had a page.
 */
export default async function BatchPage({ params }: Props) {
  const { slug, locale } = await params;
  const t = dictionaryFor(locale);
  const batch = await getBatch(slug);
  if (!batch) notFound();

  return (
    <PageShell
      title={batch.batch ?? "Batch download"}
      description={t.pages.batch.description}
      crumbs={[
        { label: t.crumbs.home, href: "/" },
        { label: t.crumbs.batch, href: `/batch/${slug}` },
      ]}
    >
      <DownloadTable title={t.pages.batch.pack} groups={batch.download_urls} />
    </PageShell>
  );
}
