"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaPlay, FaInfoCircle } from "react-icons/fa";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { OnGoingAnimeProps } from "@/types/ongoing-anime";
import Typography from "@/components/ui/typography";

export default function HeroCarousel({ data }: Readonly<{ data?: OnGoingAnimeProps[] | null }>) {
  const plugin = React.useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));

  if (!data || data.length === 0) return null;

  // Render top 5 items for the hero banner
  const heroItems = data.slice(0, 5);

  return (
    <section className="relative w-full max-w-[100vw] overflow-hidden pt-4 sm:pt-6">
      <div className="mx-auto w-full max-w-[1600px] px-2 sm:px-6 lg:px-8">
        <Carousel
          plugins={[plugin.current]}
          className="w-full"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          opts={{
            loop: true,
          }}
        >
          <CarouselContent>
            {heroItems.map((anime, index) => (
              <CarouselItem key={anime.slug || index}>
                <div className="relative h-[60vh] max-h-[600px] min-h-[400px] w-full overflow-hidden rounded-xl bg-background sm:rounded-2xl xl:rounded-3xl">
                  {/* Background Image */}
                  <Image
                    src={anime.poster}
                    alt={anime.title}
                    fill
                    className="object-cover object-top opacity-40 dark:opacity-80 dark:mix-blend-screen"
                    priority={index === 0}
                  />
                  {/* Gradient to make text readable */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent sm:bg-gradient-to-r sm:from-background/90 sm:via-background/60 sm:to-transparent" />

                  {/* Content Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 sm:w-2/3 sm:justify-center sm:p-10 md:p-14 lg:w-1/2 lg:p-20">
                    <div className="space-y-4 duration-700 animate-in fade-in slide-in-from-bottom-8">
                      <span className="inline-block rounded-md bg-primary/20 px-3 py-1 text-xs font-semibold tracking-wider text-primary ring-1 ring-inset ring-primary/30 backdrop-blur-md">
                        NEW EPISODE
                      </span>

                      <Typography.H1 className="line-clamp-3 max-w-2xl text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
                        {anime.title}
                      </Typography.H1>

                      <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-foreground/80">
                        <span className="flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-accent" />
                          {anime.release_day}
                        </span>
                        <span>Ep {anime.current_episode}</span>
                      </div>

                      <p className="line-clamp-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base md:line-clamp-4">
                        Catch the latest adventures and thrilling episodes. Join the community to
                        watch ad-free and stay updated with the newest anime releases straight from
                        Japan.
                      </p>

                      <div className="flex flex-wrap items-center gap-3 pt-4">
                        <Link href={`/anime/${anime.slug}`}>
                          <button className="group flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 font-bold text-primary-foreground transition-all hover:scale-105 hover:bg-primary/90 active:scale-95">
                            <FaPlay className="text-sm transition-transform group-hover:translate-x-1" />
                            <span>Watch Now</span>
                          </button>
                        </Link>
                        <Link href={`/anime/${anime.slug}`}>
                          <button className="flex items-center justify-center gap-2 rounded-md bg-secondary/80 px-6 py-3 font-semibold text-foreground backdrop-blur-md transition-all hover:scale-105 hover:bg-secondary active:scale-95">
                            <FaInfoCircle className="text-lg opacity-80" />
                            <span>Details</span>
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden sm:block">
            <CarouselPrevious className="left-4 h-12 w-12 border-none bg-background/50 backdrop-blur-md hover:bg-background/80" />
            <CarouselNext className="right-4 h-12 w-12 border-none bg-background/50 backdrop-blur-md hover:bg-background/80" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
