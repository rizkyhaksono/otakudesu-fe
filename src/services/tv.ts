import { api, apiOr } from "@/lib/api";
import type { TvCategory, TvChannel } from "@/types/api";

export const getTvChannels = (params: { category?: string; q?: string } = {}) => {
  const search = new URLSearchParams();
  if (params.category) search.set("category", params.category);
  if (params.q) search.set("q", params.q);
  const query = search.toString();

  return apiOr<{ total: number; channels: TvChannel[] }>(
    `/api/v1/tv/channels${query ? `?${query}` : ""}`,
    { total: 0, channels: [] },
    { revalidate: 21_600 },
  );
};

export const getTvChannel = (id: string) =>
  api<TvChannel>(`/api/v1/tv/channels/${id}`, { revalidate: 21_600 });

export const getTvCategories = () =>
  apiOr<TvCategory[]>("/api/v1/tv/categories", [], { revalidate: 21_600 });
