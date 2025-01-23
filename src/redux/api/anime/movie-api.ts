import { baseApi } from "../../axios-base-query";

export const movieApi = baseApi.enhanceEndpoints({}).injectEndpoints({
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