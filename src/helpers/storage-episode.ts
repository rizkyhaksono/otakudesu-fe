const MAX_WATCHED_ITEMS = 24;

type WatchedEpisode = {
  episode: string;
  poster: string;
  title: string;
  router: string;
  watchedAt?: number;
};

const readEpisodes = (): WatchedEpisode[] => {
  try {
    if (typeof window === "undefined") return [];
    return JSON.parse(localStorage.getItem("last_watched") ?? "[]");
  } catch {
    return [];
  }
};

const writeEpisodes = (episodes: WatchedEpisode[]) => {
  localStorage.setItem("last_watched", JSON.stringify(episodes.slice(0, MAX_WATCHED_ITEMS)));
};

export const saveEpisode = (episode: WatchedEpisode) => {
  const episodeList = readEpisodes();
  const now = Date.now();

  const normalized: WatchedEpisode = {
    ...episode,
    watchedAt: now,
  };

  const filtered = episodeList.filter((e) => e.router !== episode.router);
  const newEpisodeList = [normalized, ...filtered];

  writeEpisodes(newEpisodeList);
  return newEpisodeList;
};

export const updateEpisode = (fullEpisode: string, router: string) => {
  const episodeList = readEpisodes();
  const now = Date.now();

  const updatedList = episodeList.map((e) =>
    e.router === router ? { ...e, episode: fullEpisode, watchedAt: now } : e
  );

  const active = updatedList.find((e) => e.router === router);
  if (!active) return episodeList;

  const reordered = [active, ...updatedList.filter((e) => e.router !== router)];
  writeEpisodes(reordered);
  return reordered;
};

export const deleteAllEpisode = () => {
  localStorage.removeItem("last_watched");
};

export const getSavedEpisode = () => {
  try {
    if (typeof window === "undefined") return [];
    if (!localStorage.getItem("last_watched")) return [];

    const episodeList = readEpisodes();
    return episodeList
      .map((item, index) => ({
        ...item,
        watchedAt: item.watchedAt ?? Date.now() - index,
      }))
      .sort((a, b) => (b.watchedAt ?? 0) - (a.watchedAt ?? 0));
  } catch {
    return [];
  }
};
