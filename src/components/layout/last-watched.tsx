"use client";

import { getSavedEpisode, deleteAllEpisode } from "@/helpers/storage-episode";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
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
    <>
      <CardHeader className={title({ className: "text-center", size: "xl" })}>
        Last Watched
      </CardHeader>
      <ScrollArea className="w-full whitespace-nowrap rounded-md border">
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
                    className="rounded-t-lg object-cover max-[640px]:h-52 max-[640px]:w-full sm:h-80 sm:w-full md:h-72 md:w-64 lg:h-72 lg:w-72 xl:h-96 xl:w-full"
                    width={200}
                    height={100}
                    loading="lazy"
                    alt="Poster Last Watched"
                  />
                </Link>
                <CardDescription
                  className={subtitle({
                    className: "my-3 text-center",
                  })}
                >
                  <ScrollArea>
                    <p className="w-60 p-2">{episode.title}</p>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </CardDescription>
              </Card>
            ))
          ) : (
            <>No episode watched yet</>
          )}
        </div>
        <ScrollBar orientation="horizontal" />
        <AlertDialog>
          <AlertDialogTrigger className="mx-2 my-4 flex justify-end">
            {lastWatched.length > 0 ? (
              <Button variant="secondary">Clear Last Watch</Button>
            ) : null}
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
    </>
  );
}
