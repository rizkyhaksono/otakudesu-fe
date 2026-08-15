import Image from "next/image";
import type { NewsBlock } from "@/types/api";

/**
 * Renders an article from typed blocks.
 *
 * The backend hands over `paragraph | heading | quote | image` rather than
 * HTML, so each one is rendered with our own markup. That is what lets a
 * third-party article appear on the page with no `dangerouslySetInnerHTML`
 * anywhere in the chain.
 */
export default function ArticleBody({ blocks }: { blocks: NewsBlock[] }) {
  return (
    <div className="max-w-[68ch] space-y-4">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading":
            return (
              <h2
                key={index}
                className="font-display mt-8 text-lg font-extrabold tracking-tight uppercase"
              >
                {block.text}
              </h2>
            );

          case "quote":
            return (
              <blockquote
                key={index}
                className="border-primary text-muted-foreground border-l-2 pl-4 text-sm italic"
              >
                {block.text}
              </blockquote>
            );

          case "image":
            return (
              <figure key={index} className="bg-muted relative aspect-video border">
                <Image
                  src={block.src}
                  alt={block.alt ?? ""}
                  fill
                  sizes="(min-width: 768px) 640px, 100vw"
                  className="object-contain"
                  unoptimized
                />
              </figure>
            );

          default:
            return (
              <p key={index} className="text-sm leading-relaxed">
                {block.text}
              </p>
            );
        }
      })}
    </div>
  );
}
