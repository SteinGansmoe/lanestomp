import type { FormEvent } from "react";
import { Pencil, Pin, Trash2 } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { formatDate, groupAdminItemsByGame } from "../helpers";
import { AdminGroupedListCard } from "../shared/admin-grouped-list-card";
import type {
  AdminGame,
  AdminSeason,
  AdminTimelineEvent,
  FormStatus,
  TimelineEventFormState,
} from "../types";
import { TimelineEventForm, TimelineEventFormCard } from "./timeline-event-form";

export function AdminTimelineSection({
  createForm,
  createStatus,
  editForm,
  editStatus,
  editingEventId,
  gameNamesById,
  games,
  onCancelEdit,
  onCreateChange,
  onCreateSubmit,
  onDelete,
  onEditChange,
  onEditSubmit,
  onStartEdit,
  seasons,
  timelineEvents,
}: {
  createForm: TimelineEventFormState;
  createStatus: FormStatus;
  editForm: TimelineEventFormState;
  editStatus: FormStatus;
  editingEventId: string | null;
  gameNamesById: Map<string, string>;
  games: AdminGame[];
  onCancelEdit: () => void;
  onCreateChange: (form: TimelineEventFormState) => void;
  onCreateSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onDelete: (event: AdminTimelineEvent) => void;
  onEditChange: (form: TimelineEventFormState) => void;
  onEditSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onStartEdit: (event: AdminTimelineEvent) => void;
  seasons: AdminSeason[];
  timelineEvents: AdminTimelineEvent[];
}) {
  const seasonNamesById = new Map(seasons.map((season) => [season.id, season.name] as const));
  const eventGroups = groupAdminItemsByGame(timelineEvents, games, gameNamesById);

  return (
    <>
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <TimelineEventFormCard
          form={createForm}
          games={games}
          onChange={onCreateChange}
          onSubmit={onCreateSubmit}
          seasons={seasons}
          status={createStatus}
          submitLabel="Create event"
          title="Create timeline event"
        />

        <Card className="border-white/10 bg-[#10182b]/90 text-white shadow-xl shadow-black/15">
          <CardHeader>
            <CardTitle className="font-mono text-xl">Edit event</CardTitle>
          </CardHeader>
          <CardContent>
            {editingEventId ? (
              <TimelineEventForm
                form={editForm}
                games={games}
                onCancel={onCancelEdit}
                onChange={onEditChange}
                onSubmit={onEditSubmit}
                seasons={seasons}
                status={editStatus}
                submitLabel="Save changes"
              />
            ) : (
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6 text-sm text-zinc-400">
                Select a timeline event below to edit it.
                {editStatus.success ? (
                  <p className="mt-3 text-emerald-200">{editStatus.success}</p>
                ) : null}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AdminGroupedListCard
        emptyMessage="No timeline events found."
        groups={eventGroups.map((group) => ({
          children: (
            <ul className="space-y-3 p-4">
              {group.items.map((event) => (
                <li
                  className="rounded-lg border border-white/10 bg-white/[0.03] p-4"
                  key={event.id}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-white">{event.title}</p>
                        {event.is_pinned ? (
                          <span className="inline-flex items-center gap-1 rounded-md border border-violet-300/20 bg-violet-500/10 px-2 py-1 text-xs text-violet-100">
                            <Pin className="size-3" aria-hidden="true" />
                            Pinned
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 text-sm text-zinc-400">
                        {event.event_type}
                        {event.season_id
                          ? ` / ${seasonNamesById.get(event.season_id) ?? event.season_id}`
                          : ""}
                      </p>
                    </div>
                    <p className="font-mono text-xs text-zinc-500">
                      {formatDate(event.event_date)}
                    </p>
                  </div>
                  {event.description ? (
                    <p className="mt-3 text-sm leading-5 text-zinc-400">{event.description}</p>
                  ) : null}
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Button
                      className="border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
                      onClick={() => onStartEdit(event)}
                      size="sm"
                      type="button"
                      variant="ghost"
                    >
                      <Pencil className="size-3.5" aria-hidden="true" />
                      Edit
                    </Button>
                    <Button
                      className="border-rose-300/20 bg-rose-500/10 text-rose-100 hover:bg-rose-500/20"
                      onClick={() => onDelete(event)}
                      size="sm"
                      type="button"
                      variant="ghost"
                    >
                      <Trash2 className="size-3.5" aria-hidden="true" />
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ),
          count: group.items.length,
          id: group.gameId,
          title: group.gameName,
        }))}
        storageKey="lanestomp.admin.timeline.collapsedGroups"
        title="Timeline events"
      />
    </>
  );
}
