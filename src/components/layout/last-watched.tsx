"use client";

import { getSavedEpisode, deleteAllEpisode } from "@/helpers/storage-episode";
import { Card, CardDescription, CardHeader } from "../ui/card";
import Image from "next/image";
import Link from "next/link";
import { subtitle, title } from "./primitives";
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

export default function LastWatched() {
  const lastWatched = getSavedEpisode();

  const handleDeleteAllEpisode = () => {
    deleteAllEpisode();
    toast("Episode has been deleted", {
      description: "Refresh the page to see the changes.",
      action: {
        label: "Refresh",
        onClick: () => {
          if (typeof window !== "undefined") {
            window.location.reload();
          }
        },
      },
    });
  };

  return (
    <Card>
      <CardHeader className={title({ className: "text-center", size: "xl" })}>
        Last Watched
      </CardHeader>
      <ScrollArea className="w-full whitespace-nowrap rounded-md border">
        <div
          className={`${lastWatched.length > 0 ? "flex w-max space-x-4 p-4" : "py-4 text-center"}`}
        >
          {lastWatched.length > 0 ? (
            lastWatched.map((episode: any) => (
              <Link
                key={episode.router}
                href={episode.episode}
                className="flex flex-col items-center"
              >
                <Image
                  src={episode.poster}
                  className="rounded-lg object-cover"
                  width={200}
                  height={100}
                  loading="lazy"
                  alt="Poster Last Watched"
                />
                <CardDescription className={subtitle({ className: "mt-3" })}>
                  {episode.title}
                </CardDescription>
              </Link>
            ))
          ) : (
            <>No episode watched yet</>
          )}
        </div>
        <ScrollBar orientation="horizontal" />
        <AlertDialog>
          <AlertDialogTrigger className="mx-2 my-4 flex justify-end">
            <Button variant="outline">Clear Last Watch</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
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
      </ScrollArea>
    </Card>
  );
}
