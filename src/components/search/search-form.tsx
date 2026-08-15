import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/**
 * A plain GET form — no client JavaScript, no `useSearchParams`, and it works
 * with the browser back button and with JS disabled.
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
        <span className="hidden sm:inline">Cari</span>
      </Button>
    </form>
  );
}
