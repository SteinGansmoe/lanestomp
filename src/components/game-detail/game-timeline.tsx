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
  const hasManyEvents = orderedEvents.length > 5;
  const timelineStyle =
    hasManyEvents ? undefined : {
        gridTemplateColumns: `repeat(${orderedEvents.length}, minmax(0, 1fr))`,
      };

  return (
    <DetailSection title="Upcoming timeline">
      {events.length > 0 ? (
        <div
          className={`relative ${
            hasManyEvents ?
              "grid gap-5 md:grid-cols-2 md:gap-x-8"
            : "grid gap-0 md:gap-4"
          }`}
          style={timelineStyle}
        >
          <div
            className="absolute bottom-3 left-[17px] top-3 w-px bg-slate-600/70 md:hidden"
            aria-hidden="true"
          />
          {!hasManyEvents ? (
            <div
              className="absolute left-[17px] right-0 top-11 hidden h-px bg-slate-600/70 md:block"
              aria-hidden="true"
            />
          ) : null}
          {orderedEvents.map((event) => {
            const Icon = eventIcons[event.type];

            return (
              <article
                className={`relative grid grid-cols-[auto_1fr] gap-3 pb-7 last:pb-0 ${
                  hasManyEvents ?
                    "md:pb-2"
                  : "md:block md:min-h-36 md:pb-0 md:pr-4"
                }`}
                key={event.id}
              >
                <div
                  className={`relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full border bg-[#10182b] ${eventStyles[event.type]}`}
                >
                  <Icon className="size-4" aria-hidden="true" />
                </div>
                {!hasManyEvents ? (
                  <div
                    className="absolute left-[17px] top-9 hidden h-8 w-px bg-slate-600/70 md:block"
                    aria-hidden="true"
                  />
                ) : null}
                <div
                  className={`min-w-0 ${
                    hasManyEvents ?
                      "rounded-lg border border-white/10 bg-white/[0.03] p-3"
                    : "md:ml-8 md:mt-8 md:pl-3"
                  }`}
                >
                  <p className="font-mono text-xs uppercase tracking-normal text-zinc-500">
                    {formatSeasonDate(event.startDate)}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="mt-1 font-semibold text-white">
                      {event.title}
                    </h3>
                    <span
                      className={`rounded-md border px-2 py-1 text-xs ${eventStyles[event.type]}`}
                    >
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
