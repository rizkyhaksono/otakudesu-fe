import * as React from "react";
import BaseLayout from "@/components/base-layout";
import HomeCard from "@/components/home-card";
import Image from "next/image";
import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Home | Otakudesu",
  description: "Home Page Otakudesu. Build by Rizky Haksono",
};

export default function Home() {
  return (
    <>
      <BaseLayout>
        <div className="relative">
          <Image src={"/home.jpg"} priority alt="Image Anime" width={2000} height={300} className="xl:w-full xl:h-96 object-cover object-center" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center w-full">
            <p className="font-semibold xl:text-5xl lg:text-4xl md:text-3xl sm:text-2xl max-[640px]:text-2xl text-foreground">Home Page</p>
          </div>
        </div>

        <div className="container mx-auto">
          <div className="mt-10">
            <HomeCard />
          </div>
        </div>
      </BaseLayout>
    </>
  );
}
