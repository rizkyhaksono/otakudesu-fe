import { notFound } from "next/navigation";
import { FEATURES } from "@/lib/site";

/**
 * Movies are off on the public deployment (`NEXT_PUBLIC_ENABLE_MOVIE`). This
 * one gate turns every `/movie/**` route into a real 404 instead of a page
 * that fetches and renders nothing.
 */
export default function MovieLayout({ children }: { children: React.ReactNode }) {
  if (!FEATURES.movie) notFound();
  return children;
}
