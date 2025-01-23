import { baseComicApi } from "@/redux/axios-base-query";

export const comicHomeApi = baseComicApi.enhanceEndpoints({}).injectEndpoints({
  endpoints(builder) {
    return {
      getComicHome: builder.query({
        query: () => ({
          url: `/home`,
          method: "GET"
        })
      })
    }
  }
})

export const { useGetComicHomeQuery } = comicHomeApi;