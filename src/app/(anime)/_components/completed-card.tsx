import { CompletedAnimeProps } from "@/types/completed-anime";
import AnimeCardSection from "./anime-card-section";
import Typography from "@/components/ui/typography";

export default function CompletedCard({
  animeHeader,
  animeData,
  seeAllLink,
}: Readonly<{
  animeData: CompletedAnimeProps[] | null | undefined;
  seeAllLink: string | null | undefined;
  animeHeader: string | null | undefined;
}>) {
  return (
    <AnimeCardSection
      animeData={animeData}
      animeHeader={animeHeader}
      seeAllLink={seeAllLink}
      renderMeta={(anime) => (
        <>
          <Typography.P className="pt-2 text-sm font-medium text-foreground/90 underline decoration-accent/70 underline-offset-4">
            Total Episode {anime.episode_count}
          </Typography.P>
          <Typography.P className="text-sm">Rating: {anime.rating}</Typography.P>
          <Typography.P className="text-sm">
            Last Release Date: {anime.last_release_date}
          </Typography.P>
        </>
      )}
    />
  );
}
