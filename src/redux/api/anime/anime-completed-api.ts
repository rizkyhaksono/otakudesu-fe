import { baseAnimeApi } from "@/redux/axios-base-query";

export const completeAnimeApi = baseAnimeApi.enhanceEndpoints({}).injectEndpoints({
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