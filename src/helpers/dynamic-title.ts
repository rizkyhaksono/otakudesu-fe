import { useEffect } from "react";

export const useDynamicTitle = (loading: boolean, episodeTitle?: string) => {
  useEffect(() => {
    document.title = loading
      ? "Loading... | Otakudesu"
      : `${episodeTitle} | Otakudesu`;

    return () => {
      document.title = "Otakudesu";
    };
  }, [loading, episodeTitle]);
};
