import { baseAnimeApi } from "@/redux/axios-base-query";

export const onGoingAnimeApi = baseAnimeApi.enhanceEndpoints({}).injectEndpoints({
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
