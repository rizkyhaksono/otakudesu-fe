import { baseApi } from "../axios-base-query";

export const homeApi = baseApi.enhanceEndpoints({}).injectEndpoints({
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
