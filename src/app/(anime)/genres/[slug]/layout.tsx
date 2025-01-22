import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Genre Anime | Otakudesu",
  description: "Genre Anime Page Otakudesu. Build by Rizky Haksono",
};

export default function GenreSlugLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
