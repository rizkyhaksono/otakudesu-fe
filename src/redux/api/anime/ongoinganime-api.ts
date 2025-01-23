import { baseApi } from "../../axios-base-query";

export const onGoingAnimeApi = baseApi.enhanceEndpoints({}).injectEndpoints({
  endpoints(builder) {
    return {
      getOnGoingAnime: builder.query({
        query: ({ page }) => ({
          url: `/ongoing-anime/${page}`,
          method: "GET",
        }),
      }),
    };
  },
});

export const { useGetOnGoingAnimeQuery } = onGoingAnimeApi;
