"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { NAV_FLAT, SITE } from "@/lib/site";

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="size-9 lg:hidden" aria-label="Buka menu">
          <Menu className="size-4" aria-hidden />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72">
        <SheetHeader>
          <SheetTitle className="font-display text-left text-lg font-extrabold uppercase">
            {SITE.name}
          </SheetTitle>
        </SheetHeader>
        <nav aria-label="Menu seluler" className="mt-2 border-t">
          <ul>
            {NAV_FLAT.map((item) => (
              <li key={item.href} className="border-b">
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="hover:bg-accent block px-4 py-3 text-sm font-medium"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
