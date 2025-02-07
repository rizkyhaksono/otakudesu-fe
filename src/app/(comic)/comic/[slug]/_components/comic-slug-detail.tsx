"use client";

import { useGetComicDetailQuery } from "@/redux/api/comic/comic-detail-api";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import SkeletonCard from "@/components/layout/skeleton-card";
import Typography from "@/components/ui/typography";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ComicSlugDetail() {
  const pathname = usePathname()
  const slug = pathname.split("/").pop()

  const { data: comicData, error: comicError, isLoading } = useGetComicDetailQuery(slug as string)

  console.log(comicData)

  return (
    <div>

    </div>
  )
}