import { NextResponse } from "next/server";
import { isLocale } from "@/lib/i18n/dictionaries";
import { LOCALE_COOKIE } from "@/lib/i18n/server";

/** Persist the chosen UI language. One year, same-site, no JS-readable secret. */
export async function POST(request: Request) {
  const { locale } = (await request.json().catch(() => ({}))) as { locale?: unknown };

  if (!isLocale(locale)) {
    return NextResponse.json({ error: "Unsupported locale" }, { status: 400 });
  }

  const response = NextResponse.json({ data: { locale } });
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return response;
}
