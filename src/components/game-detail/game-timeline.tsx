import { CalendarClock, CircleDot, Gift, Pin, Sparkles } from "lucide-react";

import {
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
  const orderedEvents = [...events].sort((left, right) => {
    const pinnedOrder = Number(right.isFeatured) - Number(left.isFeatured);

    if (pinnedOrder !== 0) {
      return pinnedOrder;
    }

    return left.startDate.localeCompare(right.startDate);
  });

  return (
    <DetailSection title="Upcoming timeline">
      {events.length > 0 ? (
        <div className="grid gap-3">
          {orderedEvents.map((event) => {
            const Icon = eventIcons[event.type];

            return (
              <article
                className="grid gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-4 sm:grid-cols-[auto_1fr] sm:items-start"
                key={event.id}
              >
                <div className="flex items-center gap-3 sm:block">
                  <div
                    className={`flex size-9 shrink-0 items-center justify-center rounded-full border ${eventStyles[event.type]}`}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </div>
                  <p className="font-mono text-xs uppercase tracking-normal text-zinc-500 sm:mt-2 sm:text-center">
                    {formatSeasonDate(event.startDate)}
                  </p>
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-white">{event.title}</h3>
                    <span className={`rounded-md border px-2 py-1 text-xs ${eventStyles[event.type]}`}>
                      {event.type.replace("-", " ")}
                    </span>
                    {event.isFeatured ? (
                      <span className="inline-flex items-center gap-1 rounded-md border border-violet-300/20 bg-violet-500/10 px-2 py-1 text-xs text-violet-100">
                        <Pin className="size-3" aria-hidden="true" />
                        Pinned
                      </span>
                    ) : null}
                  </div>
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
