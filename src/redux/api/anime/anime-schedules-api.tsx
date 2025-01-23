import { baseAnimeApi } from "@/redux/axios-base-query";

export const schedulesApi = baseAnimeApi.enhanceEndpoints({}).injectEndpoints({
  endpoints(builder) {
    return {
      getSchedules: builder.query({
        query: () => ({
          url: `/schedule`,
        }),
      }),
    };
  },
});

export const { useGetSchedulesQuery } = schedulesApi;