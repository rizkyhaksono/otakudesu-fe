import Image from "next/image";
import type { MovieDetail } from "@/types/api";

export function MovieFacts({ detail }: { detail: MovieDetail }) {
  const rows = (
    [
      ["Status", detail.status],
      ["Rilis", detail.release_date],
      ["Durasi", detail.runtime ? `${detail.runtime} menit` : null],
      ["Negara", detail.countries.join(", ") || null],
      ["Sutradara", detail.director],
      ["Rating", detail.rating ? `${detail.rating.toFixed(1)} / 10` : null],
    ] as [string, string | null][]
  ).filter(([, value]) => Boolean(value)) as [string, string][];

  if (!rows.length) return null;

  return (
    <dl className="grid grid-cols-2 gap-px border bg-border sm:grid-cols-3 [&>*]:bg-background">
      {rows.map(([label, value]) => (
        <div key={label} className="p-3">
          <dt className="eyebrow">{label}</dt>
          <dd className="mt-1 text-sm font-medium break-words">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function MovieCast({ detail }: { detail: MovieDetail }) {
  if (!detail.cast.length) return null;

  return (
    <section className="mt-8">
      <h2 className="eyebrow mb-3">Pemeran</h2>
      <ul className="scrollbar-thin flex gap-px overflow-x-auto border bg-border [&>*]:bg-background">
        {detail.cast.map((person) => (
          <li key={`${person.name}-${person.character}`} className="w-28 shrink-0 p-2">
            <div className="bg-muted relative aspect-[2/3] border">
              {person.profile ? (
                <Image src={person.profile} alt="" fill sizes="112px" className="object-cover" />
              ) : null}
            </div>
            <p className="mt-1.5 line-clamp-2 text-[0.75rem] leading-snug font-medium">
              {person.name}
            </p>
            {person.character ? (
              <p className="text-muted-foreground line-clamp-1 text-[0.68rem]">
                {person.character}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
