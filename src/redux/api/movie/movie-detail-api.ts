import { baseMovieApi } from "@/redux/axios-base-query";

export const movieDetailApi = baseMovieApi.enhanceEndpoints({}).injectEndpoints({
  endpoints(builder) {
    return {
      getMovieDetail: builder.query({
        query: (slug: string) => ({
          url: `/movie/${slug}`,
          method: "GET"
        })
      })
    }
  }
})

export const { useGetMovieDetailQuery } = movieDetailApi;