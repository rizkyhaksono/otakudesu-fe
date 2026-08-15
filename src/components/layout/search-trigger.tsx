"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
  CommandGroup,
} from "@/components/ui/command";

const TARGETS = [
  { label: "Cari anime", href: (q: string) => `/search?q=${encodeURIComponent(q)}` },
  { label: "Cari film & serial", href: (q: string) => `/movie/search?q=${encodeURIComponent(q)}` },
] as const;

export default function SearchTrigger() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="size-9"
        aria-label="Cari"
        onClick={() => setOpen(true)}
      >
        <Search className="size-4" aria-hidden />
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen} title="Pencarian">
        <CommandInput
          placeholder="Ketik judul lalu pilih tujuan…"
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {query.trim() ? (
            <CommandGroup heading="Cari">
              {TARGETS.map((target) => (
                <CommandItem
                  key={target.label}
                  value={`${target.label} ${query}`}
                  onSelect={() => go(target.href(query.trim()))}
                >
                  {target.label}: <span className="ml-1 font-medium">{query}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : (
            <CommandEmpty>Ketik untuk mulai mencari.</CommandEmpty>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
