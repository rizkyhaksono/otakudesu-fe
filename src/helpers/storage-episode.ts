export const saveEpisode = (episode: any) => {
  const episodeList = JSON.parse(localStorage.getItem("last_watched") ?? "[]");
  const isExist = episodeList.some(
    (e: any) =>
      e.id === episode.id &&
      e.title === episode.title &&
      e.poster === episode.poster &&
      e.episode === episode.episode,
  );

  if (!isExist) {
    episodeList.push(episode);
    localStorage.setItem("last_watched", JSON.stringify(episodeList));
  }

  return episodeList;
};

export const updateEpisode = (fullEpisode: any, router: string) => {
  const episodeList = JSON.parse(localStorage.getItem("last_watched") ?? "[]");
  const isExist = episodeList.some((e: any) => e.router === router);

  if (isExist) {
    const newEpisodeList = episodeList.map((e: any) =>
      e.router === router ? { ...e, episode: fullEpisode } : e,
    );
    localStorage.setItem("last_watched", JSON.stringify(newEpisodeList));
    return newEpisodeList;
  }

  return episodeList;
};

export const deleteAllEpisode = () => {
  localStorage.removeItem("last_watched");
};

export const getSavedEpisode = () => {
  try {
    if (typeof window === "undefined") return [];
    if (!localStorage.getItem("last_watched")) return [];

    const episodeList = JSON.parse(
      localStorage.getItem("last_watched") ?? "[]",
    );
    return episodeList;
  } catch (error) {
    return [];
  }
};
