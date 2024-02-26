"use client"

import Image from "next/image"
import { useState } from "react"
import { generateRandomNumber } from "@/lib/random-number"
import RandomImageProps from "@/types/random-image"

export default function RandomImage({ pageName }: RandomImageProps) {
  const [randomNumber] = useState(generateRandomNumber)

  return (
    <>
      <div className="relative">
        <Image src={`https://source.unsplash.com/random/1800x${randomNumber}/?japan`} priority alt="Image Home" width={1000} height={1000} className="xl:w-full xl:h-96 object-cover object-center" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-foreground text-center w-full">
          <p className="font-semibold xl:text-5xl lg:text-4xl md:text-3xl sm:text-2xl max-[640px]:text-2xl">{pageName}</p>
        </div>
      </div>
    </>
  )
}
