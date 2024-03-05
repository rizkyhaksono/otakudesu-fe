import { baseApi } from "../axios-base-query"

export const completeAnimeApi = baseApi.enhanceEndpoints({}).injectEndpoints({
  endpoints(builder) {
    return {
      getCompleteAnime: builder.query({
        query: ({ page }) => ({
          url: `/complete-anime/${page}`,
          method: "GET"
        })
      })
    }
  }
})

export const { useGetCompleteAnimeQuery } = completeAnimeApi