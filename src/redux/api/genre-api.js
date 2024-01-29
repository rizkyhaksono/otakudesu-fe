import { baseApi } from "../axios-base-query";

export const genreApi = baseApi.enhanceEndpoints({}).injectEndpoints({
  endpoints(builder) {
    return {
      getGenres: builder.query({
        query: () => ({
          url: `/genre`,
          method: "GET",
        }),
      }),
    };
  },
});

export const { useGetGenresQuery } = genreApi;
