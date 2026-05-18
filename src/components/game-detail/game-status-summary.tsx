import { CalendarDays, Clock3, ShieldCheck, Sparkles } from "lucide-react";

import { Card } from "@/src/components/ui/card";
import type { GameEvent, Season } from "@/src/features";
import {
  formatSeasonDate,
  getRemainingTime,
  getSeasonProgress,
} from "@/src/lib/season";

export function GameStatusSummary({
  nextEvent,
  season,
}: {
  nextEvent?: Pick<GameEvent, "startDate" | "title">;
  season: Pick<Season, "endDate" | "startDate" | "title">;
}) {
  const progress = getSeasonProgress(season.startDate, season.endDate);

  const items = [
    {
      label: "Current season",
      value: season.title,
      detail: formatSeasonDate(season.startDate),
      icon: Sparkles,
      iconClassName: "bg-rose-500/15 text-rose-300",
    },
    {
      label: "Season progress",
      value: `${progress}%`,
      detail: `${getRemainingTime(season.endDate)} left`,
      icon: ShieldCheck,
      iconClassName: "bg-emerald-500/15 text-emerald-300",
      progress,
    },
    {
      label: "Next major update",
      value: nextEvent?.title ?? "No update scheduled",
      detail: nextEvent ? formatSeasonDate(nextEvent.startDate) : "Check back soon",
      icon: Clock3,
      iconClassName: "bg-sky-500/15 text-sky-300",
    },
    {
      label: "Season ends",
      value: formatSeasonDate(season.endDate),
      detail: `${getRemainingTime(season.endDate)} left`,
      icon: CalendarDays,
      iconClassName: "bg-violet-500/15 text-violet-300",
    },
  ];

  return (
    <Card className="grid gap-0 overflow-hidden border-white/10 bg-[#10182b]/90 p-0 text-white shadow-xl shadow-black/15 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <div
            className="min-w-0 border-white/10 p-5 md:border-l md:first:border-l-0"
            key={item.label}
          >
            <div className="flex items-start gap-4">
              <div
                className={`flex size-10 shrink-0 items-center justify-center rounded-md ${item.iconClassName}`}
              >
                <Icon className="size-5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-zinc-400">{item.label}</p>
                <p className="mt-2 font-mono text-lg font-semibold leading-snug text-white">
                  {item.value}
                </p>
                {typeof item.progress === "number" ? (
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-700/70">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-rose-400 to-pink-500"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                ) : null}
                <p className="mt-2 text-sm text-rose-300">{item.detail}</p>
              </div>
            </div>
          </div>
        );
      })}
    </Card>
  );
}
