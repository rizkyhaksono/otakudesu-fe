import { api } from "@/lib/api";
import type { MirrorStatus } from "@/types/api";

/**
 * Short revalidate on purpose: the whole point of this endpoint is catching a
 * domain rotation quickly, and it is one small JSON document.
 */
export const getShinigamiStatus = () =>
  api<MirrorStatus>("/api/v1/comic/shinigami", { revalidate: 1800 });
