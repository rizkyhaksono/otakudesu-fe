"use client";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="id">
      <body
        style={{
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          background: "#0d0d10",
          color: "#f5f5f7",
          padding: "4rem 1.5rem",
        }}
      >
        <h1 style={{ fontSize: "2rem", margin: 0 }}>Terjadi kesalahan fatal</h1>
        <p style={{ color: "#a1a1aa" }}>Muat ulang halaman untuk mencoba lagi.</p>
        <button
          onClick={reset}
          style={{
            marginTop: "1.5rem",
            padding: "0.6rem 1.2rem",
            background: "#f97316",
            color: "#0d0d10",
            border: 0,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Coba lagi
        </button>
      </body>
    </html>
  );
}
