import { baseMovieApi, baseMovieBoxApi } from "@/redux/axios-base-query";

export const movieGenreApi = baseMovieBoxApi.enhanceEndpoints({}).injectEndpoints({
  endpoints(builder) {
    return {
      getMovieGenres: builder.query({ query: () => ({ url: `/genre`, method: "GET" }) }),
      getMovieGenreSlug: builder.query({
        query: ({ slug, page }: { slug: string; page: string | number }) => ({
          url: `/genre/${slug}?page=${page}`,
          method: "GET",
        }),
      }),
    };
  },
});

export const { useGetMovieGenresQuery, useGetMovieGenreSlugQuery } = movieGenreApi;
