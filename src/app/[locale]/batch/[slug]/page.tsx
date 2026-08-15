import type { Metadata } from "next";
import { localeAlternates } from "@/lib/site";
import { notFound } from "next/navigation";
import { getBatch } from "@/services/anime";
import PageShell from "@/components/media/page-shell";
import DownloadTable from "@/components/media/download-table";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const batch = await getBatch(slug);
  if (!batch) return { title: "Batch tidak ditemukan", robots: { index: false, follow: false } };

  return {
    title: batch.batch ?? "Batch download",
    description: `Link batch download lengkap untuk ${batch.batch ?? slug}, berbagai resolusi dan provider.`,
    alternates: { canonical: `/batch/${slug}`, languages: localeAlternates(`/batch/${slug}`) },
  };
}

/**
 * The batch endpoint has existed in the API from the start but never had a page.
 */
export default async function BatchPage({ params }: Props) {
  const { slug } = await params;
  const batch = await getBatch(slug);
  if (!batch) notFound();

  return (
    <PageShell
      title={batch.batch ?? "Batch download"}
      description="Semua episode dalam satu paket unduhan."
      crumbs={[
        { label: "Beranda", href: "/" },
        { label: "Batch", href: `/batch/${slug}` },
      ]}
    >
      <DownloadTable title="Paket download" groups={batch.download_urls} />
    </PageShell>
  );
}
