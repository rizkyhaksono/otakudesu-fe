import { baseComicApi } from "@/redux/axios-base-query";

export const comicDetailApi = baseComicApi.enhanceEndpoints({}).injectEndpoints({
  endpoints(builder) {
    return {
      getComicDetail: builder.query({
        query: (slug: string) => ({
          url: `/comic/${slug}`,
          method: "GET"
        })
      })
    }
  }
})

export const { useGetComicDetailQuery } = comicDetailApi;