"use client";

import { useGetGenresQuery } from "@/redux/api/genre-api";

import { useEffect } from "react";

export default function GenresList() {
  const { data: dataAja, error: errorGenres, isLoading: loadingGenres } = useGetGenresQuery(arguments);

  useEffect(() => {
    console.log(dataAja);
  });

  return <></>;
}
