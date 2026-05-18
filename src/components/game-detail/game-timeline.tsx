import { ArrowRight, CalendarClock, CircleDot, Gift, Sparkles } from "lucide-react";

import {
  DetailActionLink,
  DetailEmptyState,
  DetailSection,
} from "@/src/components/game-detail/shared";
import type { GameEvent } from "@/src/features";
import { formatSeasonDate } from "@/src/lib/season";

const eventStyles: Record<GameEvent["type"], string> = {
  event: "border-amber-400/50 bg-amber-500/15 text-amber-200",
  patch: "border-emerald-400/50 bg-emerald-500/15 text-emerald-200",
  "season-end": "border-rose-400/50 bg-rose-500/15 text-rose-200",
  "season-start": "border-violet-400/50 bg-violet-500/15 text-violet-200",
};

const eventIcons = {
  event: Gift,
  patch: Sparkles,
  "season-end": CircleDot,
  "season-start": CalendarClock,
};

export function GameTimeline({ events }: { events: GameEvent[] }) {
  return (
    <DetailSection
      action={
        <DetailActionLink href="#">
          View full calendar
          <ArrowRight className="size-4" aria-hidden="true" />
        </DetailActionLink>
      }
      title="Upcoming timeline"
    >
      {events.length > 0 ? (
        <div className="relative flex flex-col gap-0 md:grid md:grid-cols-4 md:gap-0">
          <div
            className="absolute left-0 right-0 top-4 hidden h-1 rounded-full bg-slate-600/70 md:block"
            aria-hidden="true"
          />
          {events.map((event) => {
            const Icon = eventIcons[event.type];

            return (
              <article className="relative pb-10 md:min-h-36 md:pb-0 md:pr-8" key={event.id}>
                <div className="absolute left-0 top-0 z-10 flex size-9 items-center justify-center rounded-full bg-[#10182b] md:static">
                  <div
                    className={`flex size-9 items-center justify-center rounded-full border ${eventStyles[event.type]}`}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </div>
                </div>
                <div
                  className="absolute bottom-0 left-[17px] top-10 w-px bg-slate-600/70 md:block"
                  aria-hidden="true"
                />
                <div className="ml-14 rounded-lg border border-white/10 bg-white/[0.03] p-4 md:ml-8 md:mt-7 md:border-0 md:bg-transparent md:p-0">
                  <p className="text-sm text-zinc-400">
                    {formatSeasonDate(event.startDate)}
                  </p>
                  <h3 className="mt-2 font-semibold text-white">
                    {event.title}
                  </h3>
                  {event.description ? (
                    <p className="mt-2 text-sm leading-5 text-zinc-400">
                      {event.description}
                    </p>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <DetailEmptyState message="No timeline events have been scheduled for this game yet." />
      )}
    </DetailSection>
  );
}
