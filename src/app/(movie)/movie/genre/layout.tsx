import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Movie Genres | Otakudesu",
  description:
    "Explore movies by genre. Find action, drama, comedy, thriller, and more. Built by Rizky Haksono",
};

export default function MovieGenreLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
