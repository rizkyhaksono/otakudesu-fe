import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { slug: string, episodes: string } }): Promise<Metadata> {
  const formattedTitle = params.slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `Watch ${formattedTitle} Episode ${params.episodes} | Otakudesu`,
    description: `Anime Watch Page for ${formattedTitle} Episode ${params.episodes} | Otakudesu. Build by Rizky Haksono`,
  };
}

export default function AnimeEpisodeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
