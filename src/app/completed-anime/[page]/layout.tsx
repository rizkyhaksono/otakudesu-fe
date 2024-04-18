import BaseLayout from "@/components/layout/base-layout";
import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Completed Anime | Otakudesu",
  description: "Completed Anime Page Otakudesu. Build by Rizky Haksono",
};

export default function CompletedAnimeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <BaseLayout>{children}</BaseLayout>;
}
