/**
 * Shown when the API itself cannot be reached, as opposed to a domain simply
 * having no data. The distinction matters: one is fixed by starting a service,
 * the other by setting a token.
 */
export default function BackendDown() {
  return (
    <div className="border p-8 text-center sm:p-12">
      <p className="eyebrow text-destructive">Backend tidak merespons</p>
      <h2 className="font-display mt-2 text-xl font-extrabold tracking-tight uppercase sm:text-2xl">
        Tidak bisa terhubung ke API
      </h2>
      <p className="text-muted-foreground mx-auto mt-3 max-w-md text-sm">
        Frontend berjalan, tapi backend-nya belum hidup. Jalankan servis API lebih dulu, lalu muat
        ulang halaman ini.
      </p>
      <pre className="bg-muted mx-auto mt-4 max-w-md overflow-x-auto border p-3 text-left font-mono text-xs">
        cd otakudesu-be{"\n"}bun run start
      </pre>
      <p className="text-muted-foreground mt-3 font-mono text-xs">
        Default: http://localhost:3000 · atur lewat API_BASE_URL
      </p>
    </div>
  );
}
