import BaseLayout from "@/components/base-layout";
import Image from "next/image";
import GenresList from "@/components/genre-list";
import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Genres | Otakudesu",
  description: "Genres Page Otakudesu. Build by Rizky Haksono",
};

export default function GenrePage() {
  return (
    <>
      <BaseLayout>
        <div className="relative">
          <Image src={"/home.jpg"} alt="Image Anime" width={2000} height={300} className="xl:w-full xl:h-96 object-cover object-center" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center w-full">
            <p className="font-semibold xl:text-5xl lg:text-4xl md:text-3xl sm:text-2xl max-[640px]:text-2xl text-foreground">Genres Page</p>
          </div>
        </div>

        <div className="container mx-auto">
          <div className="mt-10">
            <GenresList />
          </div>
        </div>
      </BaseLayout>
    </>
  );
}
