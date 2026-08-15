import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="border p-10 text-center">
      <p className="font-display text-lg font-bold tracking-tight uppercase">{title}</p>
      {description ? (
        <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm">{description}</p>
      ) : null}
      {action ? (
        <Button asChild variant="outline" className="mt-5">
          <Link href={action.href}>{action.label}</Link>
        </Button>
      ) : null}
    </div>
  );
}
