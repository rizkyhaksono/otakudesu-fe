import Image from "next/image";
import { BookOpen, Clapperboard, Play, Radio, Tv } from "lucide-react";
import type { MediaKind } from "@/lib/storage";

const ICON: Record<MediaKind, typeof Play> = {
  anime: Play,
  comic: BookOpen,
  movie: Clapperboard,
  tv: Tv,
  radio: Radio,
};

/**
 * Thumbnail for a history or bookmark entry.
 *
 * Radio stations have no artwork and plenty of TV channels have no logo, so the
 * poster slot used to render as a bare grey rectangle — which reads as a broken
 * image rather than a deliberate one. The fallback draws the domain icon over
 * the title's initials, so an entry without a picture still looks finished.
 */
export default function EntryThumb({
  kind,
  poster,
  title,
  sizes = "160px",
}: {
  kind: MediaKind;
  poster: string | null | undefined;
  title: string;
  sizes?: string;
}) {
  if (poster) {
    return (
      <Image
        src={poster}
        alt=""
        fill
        sizes={sizes}
        className="object-cover transition group-hover:brightness-110"
        unoptimized={kind === "radio" || kind === "tv"}
      />
    );
  }

  const Icon = ICON[kind];
  const initials = title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <span className="bg-muted text-muted-foreground absolute inset-0 flex flex-col items-center justify-center gap-1.5">
      <Icon className="size-6 opacity-70" aria-hidden />
      <span className="font-display text-lg leading-none font-extrabold tracking-tight opacity-40">
        {initials}
      </span>
    </span>
  );
}
