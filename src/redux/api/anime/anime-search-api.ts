import { baseAnimeApi } from "@/redux/axios-base-query";

export const searchApi = baseAnimeApi.enhanceEndpoints({}).injectEndpoints({
  endpoints(builder) {
    return {
      getSearch: builder.query({
        query: (search) => ({
          url: `/search/${search}`,
        }),
      })
    }
  }
})

export const { useGetSearchQuery } = searchApi;