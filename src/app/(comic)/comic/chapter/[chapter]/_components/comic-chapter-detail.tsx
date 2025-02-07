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
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex flex-col gap-4">
        {chapterData.data.image.map((imgSrc: string, index: number) => (
          <Image
            key={imgSrc + index}
            src={imgSrc}
            alt={`Page ${index + 1}`}
            width={1000}
            height={1400}
            className="w-full h-auto object-cover rounded-lg"
            loading="lazy"
          />
        ))}
      </div>
    </div>
  )
}