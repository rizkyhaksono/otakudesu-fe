"use client";

import { useGetComicChapterQuery } from "@/redux/api/comic/comic-chapter-api";
import { usePathname, notFound } from "next/navigation";
import SkeletonCard from "@/components/layout/skeleton-card";
import Image from "next/image";

export default function ComicChapterDetail() {
  const pathname = usePathname()
  const slug = pathname.split("/").pop()

  const { data: chapterData, error: chapterError, isLoading } = useGetComicChapterQuery(slug as string)

  if (isLoading) return <SkeletonCard />
  if (chapterError) return <>Error fetching data...</>
  if (chapterData?.data === undefined) return notFound()

  return (
    <div className="container mx-auto max-w-2xl">
      <div className="flex flex-col">
        {chapterData.data.image.map((imgSrc: string, index: number) => (
          <Image
            key={imgSrc + index}
            src={imgSrc}
            alt={`Page ${index + 1}`}
            width={2000}
            height={2000}
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        ))}
      </div>
    </div>
  )
}