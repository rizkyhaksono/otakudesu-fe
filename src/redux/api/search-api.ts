import { baseApi } from "../axios-base-query";

export const searchApi = baseApi.enhanceEndpoints({}).injectEndpoints({
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