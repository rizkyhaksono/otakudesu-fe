import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Section({
  title,
  eyebrow,
  href,
  hrefLabel = "Lihat semua",
  children,
}: {
  title: string;
  eyebrow?: string;
  href?: string;
  hrefLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10 first:mt-0">
      <div className="mb-3 flex items-end justify-between gap-4 border-b pb-2">
        <div>
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h2 className="font-display text-xl font-extrabold tracking-tight uppercase sm:text-2xl">
            {title}
          </h2>
        </div>
        {href ? (
          <Link
            href={href}
            className="text-muted-foreground hover:text-primary flex shrink-0 items-center gap-1 pb-1 font-mono text-xs uppercase transition-colors"
          >
            {hrefLabel}
            <ArrowRight className="size-3" aria-hidden />
          </Link>
        ) : null}
      </div>
      {children}
    </section>
  );
}
