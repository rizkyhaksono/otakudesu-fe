import BaseLayout from "@/components/layout/base-layout";
import GenresList from "@/app/genres/components/genre-list";
import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Genres | Otakudesu",
  description: "Genres Page Otakudesu. Build by Rizky Haksono",
};

export default function GenrePage() {
  return (
    <BaseLayout>
      <div className="container mx-auto px-4 py-10 max-[640px]:text-center sm:max-w-xl md:max-w-full md:px-24 lg:max-w-screen-xl">
        <div className="max-w-2xl sm:mx-auto sm:max-w-xl sm:text-center md:max-w-2xl">
          <h2 className="mb-6 font-sans text-3xl font-bold tracking-tight text-foreground sm:text-4xl sm:leading-none">
            Discover Your{" "}
            <span className="leading-12 bg-gradient-to-r from-lime-500 to-cyan-500 bg-clip-text text-transparent">
              &nbsp;Anime Genres
            </span>
          </h2>
          <p className="text-base text-foreground md:text-lg">
            Explore the vast realm of anime genres, be it the excitement of
            action, the magical allure of fantasy, the heartwarming embrace of
            romance, or the delightful charm of slice-of-life. Your anime
            journey commences wherever your passions lead!
          </p>
        </div>
      </div>
      <GenresList />
    </BaseLayout>
  );
}
