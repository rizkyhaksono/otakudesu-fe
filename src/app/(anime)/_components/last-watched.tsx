"use client";

import { getSavedEpisode, deleteAllEpisode } from "@/helpers/storage-episode";
import { Card, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useEffect, useMemo, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import Typography from "@/components/ui/typography";

type WatchedEpisode = {
  episode: string;
  poster: string;
  title: string;
  router: string;
  watchedAt?: number;
};

export default function LastWatched() {
  const [lastWatched, setLastWatched] = useState<WatchedEpisode[]>([]);
  const router = useRouter();

  useEffect(() => {
    const refreshEpisodes = () => {
      setLastWatched(getSavedEpisode() as WatchedEpisode[]);
    };

    refreshEpisodes();
    globalThis.addEventListener("focus", refreshEpisodes);
    globalThis.addEventListener("storage", refreshEpisodes);

    return () => {
      globalThis.removeEventListener("focus", refreshEpisodes);
      globalThis.removeEventListener("storage", refreshEpisodes);
    };
  }, []);

  const currentProgress = useMemo(() => {
    if (lastWatched.length === 0) return null;
    return lastWatched[0];
  }, [lastWatched]);

  const parseEpisodeNumber = (episodePath: string) => {
    const matched = /\/episodes\/(\d+)/.exec(episodePath);
    return matched?.[1] ?? "-";
  };

  const timeAgo = (timestamp?: number) => {
    if (!timestamp) return "Recently watched";

    const diff = Date.now() - timestamp;
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;

    if (diff < hour) return `${Math.max(1, Math.floor(diff / minute))}m ago`;
    if (diff < day) return `${Math.floor(diff / hour)}h ago`;
    return `${Math.floor(diff / day)}d ago`;
  };

  const handleDeleteAllEpisode = () => {
    toast.promise(
      new Promise<void>((resolve) => {
        deleteAllEpisode();
        setLastWatched([]);
        resolve();
      }),
      {
        loading: "Deleting...",
        success: "Episodes have been deleted",
        error: "Failed to delete episodes",
        finally: () => router.refresh(),
      }
    );
  };

  return (
    <Card className="overflow-hidden border border-border/70 bg-card/90 shadow-sm backdrop-blur-sm">
      <CardHeader className="items-center text-center">
        <Typography.H3 className="text-4xl tracking-wide">Last Watched</Typography.H3>
        <span className="mt-2 h-1 w-20 rounded-full bg-primary" />
      </CardHeader>

      {currentProgress && (
        <div className="mx-4 mb-3 rounded-lg border border-border/70 bg-background/60 px-3 py-2">
          <Typography.P className="text-xs uppercase tracking-wide text-muted-foreground">
            Continue Watching
          </Typography.P>
          <Link
            href={currentProgress.episode}
            className="mt-1 block text-sm font-semibold hover:text-primary"
          >
            {currentProgress.title}
          </Link>
          <Typography.P className="mt-0.5 text-xs text-muted-foreground">
            Episode {parseEpisodeNumber(currentProgress.episode)} •{" "}
            {timeAgo(currentProgress.watchedAt)}
          </Typography.P>
        </div>
      )}

      <ScrollArea className="w-full whitespace-nowrap px-4 pb-2">
        <div className={lastWatched.length > 0 ? "flex gap-3 pb-2" : "py-4 text-center"}>
          {lastWatched.length > 0 ? (
            lastWatched.map((episode, index) => (
              <Card
                key={episode.router}
                className="group min-w-[190px] max-w-[210px] overflow-hidden border border-border/70 bg-background/70 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-md"
                style={{ animationDelay: `${Math.min(index * 70, 490)}ms` }}
              >
                <Link href={episode.episode}>
                  <Image
                    src={episode.poster}
                    className="h-56 w-full rounded-t-lg object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                    width={200}
                    height={100}
                    loading="lazy"
                    alt="Poster Last Watched"
                  />
                </Link>
                <ScrollArea className="w-full px-3 py-2">
                  <Typography.P className="line-clamp-2 text-center text-sm font-medium leading-6">
                    {episode.title}
                  </Typography.P>
                  <Typography.P className="text-center text-xs text-muted-foreground">
                    Ep {parseEpisodeNumber(episode.episode)} • {timeAgo(episode.watchedAt)}
                  </Typography.P>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </Card>
            ))
          ) : (
            <Typography.P className="w-full py-6 text-center text-muted-foreground">
              No episode watched yet
            </Typography.P>
          )}
        </div>

        <ScrollBar orientation="horizontal" />
        <div className="my-4 flex justify-start pb-2">
          {lastWatched.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="transition duration-300 hover:-translate-y-0.5"
                >
                  Delete All
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will delete all episodes you have watched.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAllEpisode}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
