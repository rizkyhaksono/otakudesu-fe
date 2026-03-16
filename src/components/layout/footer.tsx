import Link from "next/link";
import { FaBolt } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa";

const animeLinks = [
  { label: "Home", href: "/" },
  { label: "Search Anime", href: "/anime" },
  { label: "Genres", href: "/genres" },
  { label: "Schedules", href: "/schedules" },
  { label: "Ongoing", href: "/ongoing-anime/1" },
  { label: "Completed", href: "/completed-anime/1" },
];

const contentLinks = [
  { label: "Movies", href: "/movie" },
  { label: "Search Movie", href: "/movie/search" },
  { label: "Comics", href: "/comic" },
];

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-border/60 bg-card/40">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-2 md:col-span-1">
            <Link href="/" className="mb-3 flex items-center gap-2">
              <FaBolt className="text-xl text-accent" />
              <span className="text-lg font-bold tracking-tight">OtakuDesu</span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              The best place to watch anime, read comics, and discover movies online.
            </p>
          </div>

          {/* Anime links */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground">
              Anime
            </h4>
            <ul className="space-y-2">
              {animeLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Movie & Comic links */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground">
              Movie & Comic
            </h4>
            <ul className="space-y-2">
              {contentLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social / About */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground">
              About
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://github.com/rizkyhaksono/otakudesu-fe"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-accent"
                >
                  <FaGithub className="text-base" />
                  GitHub
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-border/40 pt-6 text-center text-xs text-muted-foreground">
          Built by{" "}
          <Link
            href="https://github.com/rizkyhaksono"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-foreground underline underline-offset-4"
          >
            rizkyhaksono
          </Link>
          . Source code on{" "}
          <Link
            href="https://github.com/rizkyhaksono/otakudesu-fe"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-foreground underline underline-offset-4"
          >
            GitHub
          </Link>
          .
        </div>
      </div>
    </footer>
  );
}
