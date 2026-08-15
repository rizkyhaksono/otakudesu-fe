import Link from "next/link";
import JsonLd from "@/components/seo/json-ld";
import { absoluteUrl } from "@/lib/site";

export type Crumb = { label: string; href: string };

/**
 * Page frame plus a BreadcrumbList. Emitting the crumbs as both visible markup
 * and structured data is what gets the hierarchy into search results.
 */
export default function PageShell({
  title,
  description,
  crumbs = [],
  actions,
  children,
  wide = false,
}: {
  title: string;
  description?: string;
  crumbs?: Crumb[];
  actions?: React.ReactNode;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={`mx-auto px-4 py-6 sm:px-6 ${wide ? "max-w-[1600px]" : "max-w-6xl"}`}>
      {crumbs.length ? (
        <>
          <nav aria-label="Breadcrumb" className="mb-3">
            <ol className="text-muted-foreground flex flex-wrap items-center gap-1.5 font-mono text-xs">
              {crumbs.map((crumb, index) => (
                <li key={crumb.href} className="flex items-center gap-1.5">
                  {index > 0 ? <span aria-hidden>/</span> : null}
                  <Link href={crumb.href} className="hover:text-foreground">
                    {crumb.label}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: crumbs.map((crumb, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: crumb.label,
                item: absoluteUrl(crumb.href),
              })),
            }}
          />
        </>
      ) : null}

      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b pb-4">
        <div className="min-w-0">
          <h1 className="animate-rise font-display text-2xl font-extrabold tracking-tight uppercase sm:text-3xl">
            {title}
          </h1>
          {description ? (
            <p className="text-muted-foreground mt-1 max-w-2xl text-sm">{description}</p>
          ) : null}
        </div>
        {actions}
      </div>

      {children}
    </div>
  );
}
