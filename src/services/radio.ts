import { api, apiOr } from "@/lib/api";
import type { RadioStation, RadioTag } from "@/types/api";

export const getRadioStations = (params: { tag?: string; q?: string } = {}) => {
  const search = new URLSearchParams();
  if (params.tag) search.set("tag", params.tag);
  if (params.q) search.set("q", params.q);
  const query = search.toString();

  return apiOr<{ total: number; stations: RadioStation[] }>(
    `/api/v1/radio/stations${query ? `?${query}` : ""}`,
    { total: 0, stations: [] },
    { revalidate: 21_600 },
  );
};

export const getRadioStation = (id: string) =>
  api<RadioStation>(`/api/v1/radio/stations/${id}`, { revalidate: 21_600 });

export const getRadioTags = () => apiOr<RadioTag[]>("/api/v1/radio/tags", [], { revalidate: 21_600 });
