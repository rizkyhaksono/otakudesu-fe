import type { Metadata } from "next";
import PageShell from "@/components/media/page-shell";
import BookmarkList from "@/components/history/bookmark-list";

export const metadata: Metadata = {
  title: "Bookmark",
  description: "Judul yang kamu simpan, tersimpan di perangkat ini.",
  robots: { index: false, follow: false },
};

export default function BookmarkPage() {
  return (
    <PageShell
      title="Bookmark"
      description="Tersimpan lokal di browser ini — tanpa akun, tanpa server."
      crumbs={[
        { label: "Beranda", href: "/" },
        { label: "Bookmark", href: "/bookmark" },
      ]}
      wide
    >
      <BookmarkList />
    </PageShell>
  );
}
