import { baseApi } from "../axios-base-query"

export const episodeApi = baseApi.enhanceEndpoints({}).injectEndpoints({
  endpoints(builder) {
    return {
      getEpisode: builder.query({
        query: ({ slug, episode }) => ({
          url: `/anime/${slug}/episodes/${episode}`,
        }),
      }),
    }
  },
})

export const { useGetEpisodeQuery } = episodeApi
