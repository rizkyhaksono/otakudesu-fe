import { OnGoingAnimeProps } from "@/types/ongoing-anime";
import AnimeCardSection from "./anime-card-section";
import Typography from "@/components/ui/typography";

export default function OngoingCard({
  animeHeader,
  animeData,
  seeAllLink,
}: Readonly<{
  animeData: OnGoingAnimeProps[] | null | undefined;
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
            Total {anime.current_episode}
          </Typography.P>
          <Typography.P className="text-sm">Release Day: {anime.release_day}</Typography.P>
          <Typography.P className="text-sm">Release Date: {anime.newest_release_date}</Typography.P>
        </>
      )}
    />
  );
}
