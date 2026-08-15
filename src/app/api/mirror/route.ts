import { NextResponse } from "next/server";
import { getEpisodeMirror } from "@/services/anime";

export const revalidate = 600;

/**
 * Thin proxy so the client can resolve a mirror without knowing the backend.
 *
 * `API_BASE_URL` is server-only by design — it never ships to the browser — so
 * the switcher in the episode player calls this instead. The token is passed
 * through untouched; the backend is what validates it.
 */
export async function GET(request: Request) {
  const content = new URL(request.url).searchParams.get("content");

  if (!content || content.length > 512) {
    return NextResponse.json({ error: "Invalid mirror token" }, { status: 400 });
  }

  const data = await getEpisodeMirror(content);

  if (!data) {
    return NextResponse.json({ error: "Mirror unavailable" }, { status: 502 });
  }

  return NextResponse.json(
    { data },
    { headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600" } },
  );
}
