import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-start px-4 py-24 sm:px-6">
      <p className="text-primary font-mono text-sm tracking-widest uppercase">Error 404</p>
      <h1 className="font-display mt-3 text-5xl leading-none font-extrabold tracking-tighter uppercase sm:text-7xl">
        Halaman tidak ditemukan
      </h1>
      <p className="text-muted-foreground mt-4 text-sm">
        Tautannya mungkin salah, atau kontennya sudah dihapus dari sumber aslinya.
      </p>
      <div className="mt-8 flex flex-wrap gap-2">
        <Button asChild>
          <Link href="/">Kembali ke beranda</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/anime-list">Lihat daftar anime</Link>
        </Button>
      </div>
    </div>
  );
}
