import Link from "next/link";
import { NAV, SITE } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t">
      <div className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-lg font-extrabold tracking-tight uppercase">
              {SITE.name}
            </p>
            <p className="text-muted-foreground mt-2 max-w-xs text-sm">{SITE.description}</p>
          </div>

          <div>
            <p className="eyebrow">Jelajahi</p>
            <ul className="mt-3 space-y-1.5">
              {NAV.slice(1, 6).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow">Lainnya</p>
            <ul className="mt-3 space-y-1.5">
              {NAV.slice(6).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/bookmark" className="text-muted-foreground hover:text-foreground text-sm">
                  Bookmark
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="eyebrow">Proyek</p>
            <ul className="mt-3 space-y-1.5">
              <li>
                <a
                  href={SITE.github}
                  className="text-muted-foreground hover:text-foreground text-sm"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Kode sumber
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/rizkyhaksono/otakudesu-be"
                  className="text-muted-foreground hover:text-foreground text-sm"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  API publik
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-muted-foreground mt-10 border-t pt-6 text-xs">
          <p>
            Situs ini adalah indeks dan agregator. Tidak ada media yang disimpan di server ini —
            semua konten milik pemiliknya masing-masing.
          </p>
          <p className="mt-2">
            © {new Date().getFullYear()} {SITE.name} · Open source, MIT
          </p>
        </div>
      </div>
    </footer>
  );
}
