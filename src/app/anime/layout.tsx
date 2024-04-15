import BaseLayout from "@/components/layout/base-layout";
import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Search Anime | Otakudesu",
  description: "Anime Page Otakudesu. Build by Rizky Haksono",
};

export default function AnimeSearchLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <BaseLayout>{children}</BaseLayout>;
}
