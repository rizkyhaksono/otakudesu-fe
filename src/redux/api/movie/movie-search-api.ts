import { baseMovieApi } from "@/redux/axios-base-query";

export const movieSearchApi = baseMovieApi.enhanceEndpoints({}).injectEndpoints({
  endpoints(builder) {
    return {
      getMovieSearch: builder.query({
        query: (slug: string) => ({
          url: `/movie/search-movie/${slug}`,
          method: "GET"
        })
      })
    }
  }
})

export const { useGetMovieSearchQuery } = movieSearchApi;