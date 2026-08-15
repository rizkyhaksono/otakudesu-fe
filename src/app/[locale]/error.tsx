"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-start px-4 py-24 sm:px-6">
      <p className="text-primary font-mono text-sm tracking-widest uppercase">Terjadi kesalahan</p>
      <h1 className="font-display mt-3 text-4xl leading-none font-extrabold tracking-tighter uppercase sm:text-6xl">
        Ada yang tidak beres
      </h1>
      <p className="text-muted-foreground mt-4 text-sm">
        Kemungkinan besar sumber datanya sedang bermasalah. Coba muat ulang sebentar lagi.
      </p>
      {error.digest ? (
        <p className="text-muted-foreground mt-2 font-mono text-xs">Kode: {error.digest}</p>
      ) : null}
      <div className="mt-8 flex flex-wrap gap-2">
        <Button onClick={reset}>Coba lagi</Button>
        <Button asChild variant="outline">
          <Link href="/">Kembali ke beranda</Link>
        </Button>
      </div>
    </div>
  );
}
