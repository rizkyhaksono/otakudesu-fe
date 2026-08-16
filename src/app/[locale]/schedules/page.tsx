import Link from "next/link";
import type { Metadata } from "next";
import { localeAlternates } from "@/lib/site";
import { getSchedule } from "@/services/anime";
import PageShell from "@/components/media/page-shell";
import EmptyState from "@/components/media/empty-state";
import { cn } from "@/lib/utils";
import { getDictionary } from "@/lib/i18n/server";

export const revalidate = 3600;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { t } = await getDictionary(params);

  return {
    title: t.pages.schedule.title,
    description: t.pages.schedule.description,
    alternates: { canonical: "/schedules", languages: localeAlternates("/schedules") },
  };
}

/*
 * Stays Indonesian in every locale: these are not labels, they are the keys
 * used to match today against `day.day` as the upstream spells it. The day
 * headings themselves are upstream data and are rendered as they arrive.
 */
const DAYS = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

export default async function SchedulesPage({ params }: Props) {
  const { t } = await getDictionary(params);
  const schedule = await getSchedule();
  const today = DAYS[new Date().getDay()];

  return (
    <PageShell
      title={t.pages.schedule.title}
      description={t.pages.schedule.description}
      crumbs={[
        { label: t.crumbs.home, href: "/" },
        { label: t.crumbs.schedule, href: "/schedules" },
      ]}
      wide
    >
      {schedule.length ? (
        <div className="grid gap-px border bg-border md:grid-cols-2 xl:grid-cols-4 [&>*]:bg-background">
          {schedule.map((day) => {
            const isToday = day.day.toLowerCase() === today?.toLowerCase();
            return (
              <section key={day.day}>
                <h2
                  className={cn(
                    "font-display flex items-baseline justify-between px-3 py-2 text-sm font-extrabold uppercase",
                    isToday ? "bg-primary text-primary-foreground" : "bg-muted",
                  )}
                >
                  {day.day}
                  <span className="font-mono text-[0.65rem] font-normal tabular-nums">
                    {isToday ? t.pages.schedule.today : `${day.anime_list.length}`}
                  </span>
                </h2>
                <ul className="divide-y">
                  {day.anime_list.map((anime) => (
                    <li key={`${day.day}-${anime.slug}`}>
                      <Link
                        href={`/anime/${anime.slug}`}
                        className="hover:bg-accent hover:text-primary block px-3 py-2 text-sm transition-colors"
                      >
                        {anime.anime_name}
                      </Link>
                    </li>
                  ))}
                  {!day.anime_list.length ? (
                    <li className="text-muted-foreground px-3 py-2 text-sm">Tidak ada rilis.</li>
                  ) : null}
                </ul>
              </section>
            );
          })}
        </div>
      ) : (
        <EmptyState title={t.pages.schedule.emptyTitle} action={{ href: "/", label: t.common.back }} />
      )}
    </PageShell>
  );
}
