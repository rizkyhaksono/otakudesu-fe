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
import Typography from "@/components/ui/typography";

export interface HeroCarouselItem {
  id: string;
  title: string;
  image: string;
  url: string;
  badge?: string;
  tags?: string[];
  description?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
}

export default function SharedHeroCarousel({
  items,
}: Readonly<{ items?: HeroCarouselItem[] | null }>) {
  const plugin = React.useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));

  if (!items || items.length === 0) return null;

  // Render top 5 items for the hero banner
  const heroItems = items.slice(0, 5);

  return (
    <section className="relative w-full max-w-full overflow-hidden">
      <div className="w-full">
        <Carousel
          plugins={[plugin.current]}
          className="group w-full"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          opts={{
            loop: true,
          }}
        >
          <CarouselContent className="ml-0">
            {heroItems.map((item, index) => (
              <CarouselItem key={item.id || index} className="border-0 pl-0">
                <div className="relative h-[65vh] max-h-[700px] min-h-[450px] w-full overflow-hidden bg-background">
                  {/* Background Image */}
                  <div className="absolute inset-0 z-10 bg-background/20 dark:bg-background/40" />
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover object-center opacity-80 mix-blend-normal dark:mix-blend-screen"
                    priority={index === 0}
                  />
                  {/* Gradient: Darker on the left and bottom for classic Crunchyroll style */}
                  <div className="absolute inset-0 z-20 bg-gradient-to-t from-background/95 via-background/60 to-transparent sm:bg-gradient-to-r sm:from-background/95 sm:via-background/70 sm:to-transparent" />

                  {/* Content Overlay */}
                  <div className="absolute inset-0 z-30 flex flex-col justify-end p-6 sm:w-3/4 sm:justify-center sm:p-12 md:w-2/3 md:p-16 lg:w-1/2 lg:p-24 2xl:px-32">
                    <div className="space-y-4 duration-700 animate-in fade-in slide-in-from-bottom-8">
                      {item.badge && (
                        <span className="inline-block rounded-md bg-primary/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary ring-1 ring-inset ring-primary/30 backdrop-blur-md">
                          {item.badge}
                        </span>
                      )}

                      <Typography.H1 className="line-clamp-2 max-w-2xl text-3xl font-extrabold tracking-tight text-foreground drop-shadow-md sm:text-4xl md:text-5xl lg:text-6xl">
                        {item.title}
                      </Typography.H1>

                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-foreground/90 drop-shadow-sm">
                          {item.tags.map((tag, i) => (
                            <span key={i} className="flex items-center gap-1">
                              {i > 0 && (
                                <span className="mr-2 h-1.5 w-1.5 rounded-full bg-accent/80" />
                              )}
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <p className="line-clamp-3 max-w-xl text-sm font-medium leading-relaxed text-foreground/80 drop-shadow-sm sm:text-base md:line-clamp-4">
                        {item.description ||
                          "Catch the latest adventures and thrilling titles. Join the community to stay updated with the newest releases."}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 pt-4">
                        <Link href={item.url}>
                          <button className="group flex items-center justify-center gap-2 rounded-sm bg-primary px-8 py-3.5 font-bold text-primary-foreground shadow-lg transition-all hover:scale-105 hover:bg-primary/90 active:scale-95">
                            <FaPlay className="text-sm transition-transform group-hover:translate-x-1" />
                            <span className="text-sm uppercase tracking-wide">
                              {item.primaryButtonText || "Watch Now"}
                            </span>
                          </button>
                        </Link>
                        <Link href={item.url}>
                          <button className="flex items-center justify-center gap-2 rounded-sm bg-secondary/70 px-6 py-3.5 font-semibold text-foreground shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:bg-secondary/90 active:scale-95">
                            <FaInfoCircle className="text-xl opacity-90" />
                            <span className="text-sm uppercase tracking-wide">
                              {item.secondaryButtonText || "Details"}
                            </span>
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:block">
            <CarouselPrevious className="left-6 h-14 w-14 scale-125 border-none bg-background/40 backdrop-blur-md transition-all hover:bg-background/80 hover:text-primary" />
            <CarouselNext className="right-6 h-14 w-14 scale-125 border-none bg-background/40 backdrop-blur-md transition-all hover:bg-background/80 hover:text-primary" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
