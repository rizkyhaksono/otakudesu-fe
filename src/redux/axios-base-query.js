import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseAnimeApi = createApi({
  reducerPath: "animeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BASE_ANIME_API_URL}`,
  }),
  endpoints: () => ({}),
});

export const baseComicApi = createApi({
  reducerPath: "comicApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BASE_COMIC_API_URL}`
  }),
  endpoints: () => ({}),
});

export const baseMovieApi = createApi({
  reducerPath: "movieApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BASE_MOVIE_API_URL}`
  }),
  endpoints: () => ({}),
});
