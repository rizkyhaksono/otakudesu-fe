import { baseMovieBoxApi } from "@/redux/axios-base-query";

export const movieBoxApi = baseMovieBoxApi.enhanceEndpoints({}).injectEndpoints({
  endpoints(builder) {
    return {
      getMovieBoxDetail: builder.query({
        query: (subjectId: string) => ({ url: `/detail?subjectId=${subjectId}`, method: "GET" }),
      }),
      getMovieBoxSources: builder.query({
        query: (subjectId: string) => ({ url: `/sources?subjectId=${subjectId}`, method: "GET" }),
      }),
      getMovieBoxHome: builder.query({ query: () => ({ url: `/home`, method: "GET" }) }),
      getMovieBoxSearch: builder.query({
        query: (keyword: string) => ({ url: `/search?keyword=${keyword}`, method: "GET" }),
      }),
    };
  },
});

export const {
  useGetMovieBoxDetailQuery,
  useGetMovieBoxSourcesQuery,
  useGetMovieBoxHomeQuery,
  useGetMovieBoxSearchQuery,
} = movieBoxApi;
