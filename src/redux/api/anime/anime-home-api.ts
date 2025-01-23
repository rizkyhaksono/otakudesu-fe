import { baseAnimeApi } from "@/redux/axios-base-query";

export const homeApi = baseAnimeApi.enhanceEndpoints({}).injectEndpoints({
  endpoints(builder) {
    return {
      getHome: builder.query({
        query: () => ({
          url: `/home`,
          method: "GET",
        }),
      }),
    };
  },
});

export const { useGetHomeQuery } = homeApi;
