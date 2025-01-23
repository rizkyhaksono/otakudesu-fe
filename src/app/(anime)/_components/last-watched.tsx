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

export default function LastWatched() {
  const lastWatched = getSavedEpisode();
  const router = useRouter();

  const handleDeleteAllEpisode = () => {
    toast.promise(
      new Promise<void>((resolve) => {
        deleteAllEpisode();
        resolve();
      }), {
      loading: "Deleting...",
      success: "Episodes have been deleted",
      error: "Failed to delete episodes",
      finally: () => router.refresh(),
    })
  };

  return (
    <Card className="border-none">
      <CardHeader className="text-center text-xl font-bold">
        Last Watched
      </CardHeader>
      <ScrollArea className="max-[465px]:w-[330px] max-[565px]:w-[400px] max-[665px]:w-[500px] max-[765px]:w-[600px] max-[865px]:w-[700px] max-[970px]:w-[800px] max-[1060px]:w-[900px] max-[1160px]:w-[1000px] max-[1300px]:w-[1100px] whitespace-nowrap">
        <div className={`${lastWatched.length > 0 ? "flex space-x-2" : "py-4 text-center"}`}>
          {lastWatched.length > 0 ? (
            lastWatched.map((episode: any) => (
              <Card
                key={episode.router}
                className="items-center duration-300 hover:bg-muted/40"
              >
                <Link href={episode.episode}>
                  <Image
                    src={episode.poster}
                    className="rounded-t-lg object-cover max-[640px]:h-40 max-[640px]:w-full sm:h-80 sm:w-full md:h-72 md:w-64 lg:h-72 lg:w-72 xl:h-96 xl:w-full"
                    width={200}
                    height={100}
                    loading="lazy"
                    alt="Poster Last Watched"
                  />
                </Link>
                <ScrollArea className="w-60 p-2">
                  <Typography.P className="text-center">{episode.title}</Typography.P>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </Card>
            ))
          ) : (
            <Typography.P>No episode watched yet</Typography.P>
          )}
        </div>
        <ScrollBar orientation="horizontal" />
        <div className="mx-2 my-4 flex justify-start">
          {lastWatched.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
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