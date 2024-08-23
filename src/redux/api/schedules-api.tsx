import { baseApi } from "../axios-base-query";

export const schedulesApi = baseApi.enhanceEndpoints({}).injectEndpoints({
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