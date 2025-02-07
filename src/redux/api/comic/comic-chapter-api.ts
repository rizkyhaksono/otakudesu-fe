import { baseComicApi } from "@/redux/axios-base-query";

export const comicChapterApi = baseComicApi.enhanceEndpoints({}).injectEndpoints({
  endpoints(builder) {
    return {
      getComicChapter: builder.query({
        query: (slug: string) => ({
          url: `/comic/chapter/${slug}`,
          method: "GET"
        })
      })
    }
  }
})

export const { useGetComicChapterQuery } = comicChapterApi