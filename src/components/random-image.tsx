"use client";

import Image from "next/image";
import { useState } from "react";
import { generateRandomNumber } from "@/lib/random-number";
import RandomImageProps from "@/types/random-image";

export default function RandomImage({ pageName }: RandomImageProps) {
  const [randomNumber] = useState(generateRandomNumber);

  return (
    <div className="relative">
      <Image
        src={`https://source.unsplash.com/random/1800x${randomNumber}/?japan`}
        priority
        alt="Image Home"
        width={1000}
        height={1000}
        className="object-cover object-center xl:h-96 xl:w-full"
      />
      <div className="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 transform text-center text-foreground">
        <p className="font-semibold max-[640px]:text-2xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
          {pageName}
        </p>
      </div>
    </div>
  );
}
