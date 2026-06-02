import type { FormEvent } from "react";
import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { formatDate, groupAdminItemsByGame } from "../helpers";
import { AdminGroupedListCard } from "../shared/admin-grouped-list-card";
import type { AdminGame, AdminSeason, FormStatus, SeasonFormState } from "../types";
import { SeasonForm, SeasonFormCard } from "./season-form";

export function AdminSeasonsSection({
  createForm,
  createStatus,
  editForm,
  editStatus,
  editingSeasonId,
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
}: {
  createForm: SeasonFormState;
  createStatus: FormStatus;
  editForm: SeasonFormState;
  editStatus: FormStatus;
  editingSeasonId: string | null;
  gameNamesById: Map<string, string>;
  games: AdminGame[];
  onCancelEdit: () => void;
  onCreateChange: (form: SeasonFormState) => void;
  onCreateSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onDelete: (season: AdminSeason) => void;
  onEditChange: (form: SeasonFormState) => void;
  onEditSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onStartEdit: (season: AdminSeason) => void;
  seasons: AdminSeason[];
}) {
  const seasonGroups = groupAdminItemsByGame(seasons, games, gameNamesById);

  return (
    <>
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <SeasonFormCard
          form={createForm}
          games={games}
          onChange={onCreateChange}
          onSubmit={onCreateSubmit}
          status={createStatus}
          submitLabel="Create season"
          title="Create season"
        />

        <Card className="border-white/10 bg-[#10182b]/90 text-white shadow-xl shadow-black/15">
          <CardHeader>
            <CardTitle className="font-mono text-xl">Edit season</CardTitle>
          </CardHeader>
          <CardContent>
            {editingSeasonId ? (
              <SeasonForm
                form={editForm}
                games={games}
                onCancel={onCancelEdit}
                onChange={onEditChange}
                onSubmit={onEditSubmit}
                status={editStatus}
                submitLabel="Save changes"
              />
            ) : (
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6 text-sm text-zinc-400">
                Select a season below to edit its schedule details.
                {editStatus.error ? (
                  <p className="mt-3 rounded-md border border-rose-400/20 bg-rose-500/10 p-3 text-rose-100">
                    {editStatus.error}
                  </p>
                ) : null}
                {editStatus.success ? (
                  <p className="mt-3 text-emerald-200">{editStatus.success}</p>
                ) : null}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AdminGroupedListCard
        emptyMessage="No seasons found."
        groups={seasonGroups.map((group) => ({
          children: (
            <ul className="space-y-3 p-4">
              {group.items.map((season) => (
                <li
                  className="rounded-lg border border-white/10 bg-white/[0.03] p-4"
                  key={season.id}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{season.name}</p>
                      <p className="mt-1 font-mono text-xs text-zinc-500">
                        {season.slug}
                      </p>
                    </div>
                    <p className="font-mono text-xs text-zinc-500">
                      {formatDate(season.starts_at)} -{" "}
                      {formatDate(season.ends_at)}
                    </p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Button
                      className="border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
                      onClick={() => onStartEdit(season)}
                      size="sm"
                      type="button"
                      variant="ghost"
                    >
                      <Pencil className="size-3.5" aria-hidden="true" />
                      Edit
                    </Button>
                    <Button
                      className="border-rose-300/20 bg-rose-500/10 text-rose-100 hover:bg-rose-500/20"
                      onClick={() => onDelete(season)}
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
        storageKey="lanestomp.admin.seasons.collapsedGroups"
        title="Seasons"
      />
    </>
  );
}
