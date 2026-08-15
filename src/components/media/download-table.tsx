import type { DownloadGroup } from "@/types/api";

/**
 * Download links laid out as a real table: one row per resolution, providers as
 * flat blocks. The API has always returned this data; it was previously dumped
 * as an undifferentiated list.
 */
export default function DownloadTable({
  title,
  groups,
}: {
  title: string;
  groups: DownloadGroup[];
}) {
  const usable = groups.filter((group) => group.urls.length > 0);
  if (!usable.length) return null;

  return (
    <div>
      <h3 className="eyebrow mb-2">{title}</h3>
      <div className="grid gap-px border bg-border [&>*]:bg-background">
        {usable.map((group, index) => (
          <div
            key={`${group.resolution}-${index}`}
            className="flex flex-wrap items-center gap-x-4 gap-y-2 p-3"
          >
            <span className="w-20 shrink-0 font-mono text-xs font-medium tabular-nums uppercase">
              {group.resolution?.trim() || "—"}
            </span>
            {group.file_size ? (
              <span className="text-muted-foreground w-20 shrink-0 font-mono text-xs tabular-nums">
                {group.file_size}
              </span>
            ) : null}
            <ul className="flex flex-wrap gap-1.5">
              {group.urls.map((link) => (
                <li key={`${link.provider}-${link.url}`}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="hover:bg-accent border px-2 py-1 text-xs transition-colors"
                  >
                    {link.provider?.trim() || "Link"}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
