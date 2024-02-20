"use client";

import { useGetGenresBySlugQuery } from "@/redux/api/genre-api";
import { usePathname } from "next/navigation";

export default function GenreSlug() {
  const pathname = usePathname();
  const pathPath = pathname.split("/");
  const slugPath = pathPath[2];
  console.log(slugPath);

  const { data: dataGenreSlug } = useGetGenresBySlugQuery(slugPath);

  return (
    <>
      <div>{dataGenreSlug}</div>
    </>
  );
}
