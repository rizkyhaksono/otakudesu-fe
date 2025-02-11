import { baseMovieApi } from "@/redux/axios-base-query";

export const movieHomeApi = baseMovieApi.enhanceEndpoints({}).injectEndpoints({
  endpoints(builder) {
    return {
      getMovieHome: builder.query({
        query: () => ({
          url: `/home`,
          method: "GET"
        })
      })
    }
  }
})

export const { useGetMovieHomeQuery } = movieHomeApi;