"use client";

import { Search } from "lucide-react";
import { useI18n } from "@/lib/i18n/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/**
 * A plain GET form. It is a client component only to translate the button
 * label — there is no state and no fetch, so it still submits natively and
 * works with the back button and with JavaScript disabled.
 */
export default function SearchForm({
  action,
  placeholder,
  defaultValue = "",
  name = "q",
}: {
  action: string;
  placeholder: string;
  defaultValue?: string;
  name?: string;
}) {
  const { t } = useI18n();

  return (
    <form action={action} method="get" role="search" className="flex gap-px bg-border">
      <Input
        type="search"
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-10 flex-1 border-0"
        required
        maxLength={100}
      />
      <Button type="submit" className="h-10 gap-2 px-4">
        <Search className="size-4" aria-hidden />
        <span className="hidden sm:inline">{t.crumbs.search}</span>
      </Button>
    </form>
  );
}
