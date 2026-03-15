"use client";

import { useGetHomeQuery } from "@/redux/api/anime/anime-home-api";
import OngoingCard from "./ongoing-card";
import CompletedCard from "./completed-card";
import LastWatched from "./last-watched";
import SharedHeroCarousel, { HeroCarouselItem } from "@/components/layout/shared-hero-carousel";

export default function HomeCard() {
  const { data: dataHome, error: errorHome } = useGetHomeQuery({});
  if (errorHome) return <>Error fetching...</>;

  const heroItems: HeroCarouselItem[] =
    dataHome?.data?.ongoing_anime?.slice(0, 5).map((anime: any) => ({
      id: anime.slug,
      title: anime.title,
      image: anime.poster,
      url: `/anime/${anime.slug}`,
      badge: "New Episode",
      tags: [anime.release_day, `Ep ${anime.current_episode}`],
      description:
        "Catch the latest adventures and thrilling episodes. Join the community to watch ad-free and stay updated with the newest anime releases straight from Japan.",
    })) || [];

  return (
    <div className="mb-10 flex w-full flex-col">
      {heroItems.length > 0 && <SharedHeroCarousel items={heroItems} />}
      <div className="container mx-auto mt-10 space-y-6 px-4" id="started">
        <div className="duration-500 animate-in fade-in slide-in-from-bottom-4">
          <LastWatched />
        </div>

        <div className="delay-100 duration-500 animate-in fade-in slide-in-from-bottom-4 fill-mode-both">
          <OngoingCard
            animeData={dataHome?.data?.ongoing_anime}
            animeHeader="On Going Anime"
            seeAllLink="ongoing-anime"
          />
        </div>

        <div className="delay-200 duration-500 animate-in fade-in slide-in-from-bottom-4 fill-mode-both">
          <CompletedCard
            animeData={dataHome?.data?.complete_anime}
            animeHeader="Completed Anime"
            seeAllLink="completed-anime"
          />
        </div>
      </div>
    </div>
  );
}
