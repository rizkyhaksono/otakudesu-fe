"use client";

import { useEffect, useState } from "react";

export default function AnimeSlug() {
  const [animeData, setAnimeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://otakudesube.natee.my.id/api/anime/op");

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        setAnimeData(data);
      } catch (error) {
        setError(error instanceof Error ? error : new Error("Unknown error occurred"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <>
      <div>
        {/* Render your components using animeData */}
        {animeData && <div>{/* Your rendering logic with animeData */}</div>}
      </div>
    </>
  );
}
