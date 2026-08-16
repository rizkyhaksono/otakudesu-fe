import { NextResponse } from "next/server";
import { apiBaseUrl } from "@/lib/api";

export const dynamic = "force-dynamic";

/**
 * Proxies to the backend's reverse image search. GET forwards a remote image
 * URL; POST forwards an upload's raw bytes. Neither path stores anything —
 * this route exists only because `API_BASE_URL` is server-only.
 */
export async function GET(request: Request) {
  const url = new URL(request.url).searchParams.get("url");
  if (!url) return NextResponse.json({ error: "Missing url" }, { status: 400 });

  const upstream = await fetch(
    `${apiBaseUrl()}/api/v1/anime/identify?url=${encodeURIComponent(url)}`,
    { cache: "no-store", signal: AbortSignal.timeout(25_000) },
  );
  const body = await upstream.text();
  return new NextResponse(body, {
    status: upstream.status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.startsWith("image/")) {
    return NextResponse.json({ error: "File must be an image" }, { status: 400 });
  }

  const bytes = await request.arrayBuffer();
  if (bytes.byteLength > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "Image too large (max 10 MB)" }, { status: 400 });
  }

  const upstream = await fetch(`${apiBaseUrl()}/api/v1/anime/identify`, {
    method: "POST",
    body: bytes,
    headers: { "Content-Type": contentType },
    cache: "no-store",
    signal: AbortSignal.timeout(25_000),
  });
  const body = await upstream.text();
  return new NextResponse(body, {
    status: upstream.status,
    headers: { "Content-Type": "application/json" },
  });
}
