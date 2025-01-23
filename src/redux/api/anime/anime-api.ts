import { baseAnimeApi } from "@/redux/axios-base-query";

export const animeApi = baseAnimeApi.enhanceEndpoints({}).injectEndpoints({
  endpoints(builder) {
    return {
      getAnime: builder.query({
        query: (slug) => ({
          url: `/anime/${slug}`,
        }),
      }),
    };
  },
});

export const { useGetAnimeQuery } = animeApi;
