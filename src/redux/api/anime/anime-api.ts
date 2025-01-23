import { baseApi } from "../../axios-base-query";

export const animeApi = baseApi.enhanceEndpoints({}).injectEndpoints({
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
