import { baseAnimeApi } from "@/redux/axios-base-query";

export const genreApi = baseAnimeApi.enhanceEndpoints({}).injectEndpoints({
  endpoints(builder) {
    return {
      getGenres: builder.query({
        query: () => ({
          url: `/genre`,
          method: "GET",
        }),
      }),
      getGenreSlug: builder.query({
        query: ({ slug, page }) => ({
          url: `/genre/${slug}?page=${page}`,
          method: "GET",
        }),
      }),
    };
  },
});

export const { useGetGenresQuery, useGetGenreSlugQuery } = genreApi;
