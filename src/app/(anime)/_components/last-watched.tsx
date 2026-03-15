"use client";

import { getSavedEpisode, deleteAllEpisode } from "@/helpers/storage-episode";
import { Card, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
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
};

export default function LastWatched() {
  const lastWatched = getSavedEpisode() as WatchedEpisode[];
  const router = useRouter();

  const handleDeleteAllEpisode = () => {
    toast.promise(
      new Promise<void>((resolve) => {
        deleteAllEpisode();
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
                <Button variant="destructive" className="transition duration-300 hover:-translate-y-0.5">
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
                  <AlertDialogAction onClick={handleDeleteAllEpisode}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}