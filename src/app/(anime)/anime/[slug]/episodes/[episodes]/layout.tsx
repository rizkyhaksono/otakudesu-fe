import { Metadata } from "next";

type Params = Promise<{ slug: string; episodes: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug, episodes } = await params;

  const formattedTitle = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    title: `Watch ${formattedTitle} Episode ${episodes} | Otakudesu`,
    description: `Anime Watch Page for ${formattedTitle} Episode ${episodes} | Otakudesu. Build by Rizky Haksono`,
  };
}

export default function AnimeEpisodeLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
