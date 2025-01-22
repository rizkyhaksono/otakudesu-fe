import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Anime Detail | Otakudesu",
  description: "Anime Detail Page Otakudesu. Build by Rizky Haksono",
};

export default function AnimeSlug({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
