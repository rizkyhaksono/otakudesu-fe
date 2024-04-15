import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Watch Anime | Otakudesu",
  description: "Anime Page Otakudesu. Build by Rizky Haksono",
};

export default function AnimeEpisodeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
