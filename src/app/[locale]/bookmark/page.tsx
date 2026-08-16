import type { Metadata } from "next";
import PageShell from "@/components/media/page-shell";
import { getDictionary } from "@/lib/i18n/server";
import BookmarkList from "@/components/history/bookmark-list";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { t } = await getDictionary(params);

  return {
    title: t.pages.bookmark.title,
    description: t.pages.bookmark.description,
    robots: { index: false, follow: false },
  };
}

export default async function BookmarkPage({ params }: Props) {
  const { t } = await getDictionary(params);

  return (
    <PageShell
      title={t.pages.bookmark.title}
      description={t.pages.bookmark.description}
      crumbs={[
        { label: t.crumbs.home, href: "/" },
        { label: t.crumbs.bookmark, href: "/bookmark" },
      ]}
      wide
    >
      <BookmarkList />
    </PageShell>
  );
}
