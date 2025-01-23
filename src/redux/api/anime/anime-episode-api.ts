import { baseAnimeApi } from "@/redux/axios-base-query";

export const episodeApi = baseAnimeApi.enhanceEndpoints({}).injectEndpoints({
  endpoints(builder) {
    return {
      getEpisode: builder.query({
        query: ({ slug, episode }) => ({
          url: `/anime/${slug}/episodes/${episode}`,
        }),
      }),
    };
  },
});

export const { useGetEpisodeQuery } = episodeApi;
