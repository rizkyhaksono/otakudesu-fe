import { NextResponse } from "next/server";
import { omniSearch } from "@/services/search";

/**
 * Same reason as `/api/mirror`: `API_BASE_URL` never ships to the browser, so
 * the omnibox calls this same-origin route instead of the backend directly.
 */
export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";

  if (!query || query.length > 100) {
    return NextResponse.json({ error: "Invalid query" }, { status: 400 });
  }

  const data = await omniSearch(query);
  return NextResponse.json(
    { data },
    { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120" } },
  );
}
