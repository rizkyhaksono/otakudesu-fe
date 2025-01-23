import { baseAnimeApi } from "@/redux/axios-base-query";

export const movieApi = baseAnimeApi.enhanceEndpoints({}).injectEndpoints({
  endpoints(builder) {
    return {
      getMovie: builder.query({
        query: ({ slug }) => ({
          url: `/anime/${slug}/episodes`,
        }),
      })
    }
  }
});

export const { useGetMovieQuery } = movieApi;