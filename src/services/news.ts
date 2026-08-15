import { apiOr } from "@/lib/api";
import type { NewsItem } from "@/types/api";

export const getNews = () => apiOr<NewsItem[]>("/api/v1/news", [], { revalidate: 1800 });
