import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Squared-off OG card that matches the site's editorial look. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0d0d10",
          color: "#f5f5f7",
          padding: 72,
          border: "16px solid #f97316",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 8, textTransform: "uppercase" }}>
          {SITE.tagline}
        </div>
        <div style={{ display: "flex", fontSize: 108, fontWeight: 800, lineHeight: 1.02 }}>
          {SITE.name}
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#a1a1aa" }}>
          Anime · Komik · Film · TV Indonesia
        </div>
      </div>
    ),
    size,
  );
}
