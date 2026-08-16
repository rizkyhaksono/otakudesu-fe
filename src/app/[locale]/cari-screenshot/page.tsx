import type { Metadata } from "next";
import { localeAlternates } from "@/lib/site";
import { getDictionary } from "@/lib/i18n/server";
import PageShell from "@/components/media/page-shell";
import SceneSearch from "@/components/tools/scene-search";

export const revalidate = 86_400;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { t } = await getDictionary(params);

  return {
    title: t.pages.identify.title,
    description: t.pages.identify.description,
    alternates: {
      canonical: "/cari-screenshot",
      languages: localeAlternates("/cari-screenshot"),
    },
  };
}

export default async function IdentifyPage({ params }: Props) {
  const { t } = await getDictionary(params);

  return (
    <PageShell
      title={t.pages.identify.title}
      description={t.pages.identify.description}
      crumbs={[
        { label: t.crumbs.home, href: "/" },
        { label: t.pages.identify.title, href: "/cari-screenshot" },
      ]}
    >
      <div className="max-w-xl">
        <SceneSearch />
      </div>
    </PageShell>
  );
}
