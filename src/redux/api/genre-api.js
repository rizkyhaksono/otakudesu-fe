import { baseApi } from "../axios-base-query";

export const genreApi = baseApi.enhanceEndpoints({}).injectEndpoints({
  endpoints(builder) {
    return {
      getGenres: builder.query({
        query: () => ({
          url: `/genre`,
          method: "GET",
        }),
      }),
      getGenresBySlug: builder.query({
        query: (slug) => ({
          url: `/genre/${slug}`,
          method: "GET",
        }),
      }),
    };
  },
});

export const { useGetGenresQuery, useGetGenresBySlugQuery } = genreApi;
