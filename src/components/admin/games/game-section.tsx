import type { FormEvent } from "react";
import { Pencil } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { AdminListCard } from "../shared/admin-list-card";
import type { AdminGame, FormStatus, GameFormState } from "../types";
import { GameForm, GameFormCard } from "./game-form";

export function AdminGamesSection({
  createForm,
  createStatus,
  editForm,
  editStatus,
  editingGameId,
  games,
  onCancelEdit,
  onCreateChange,
  onCreateSubmit,
  onEditChange,
  onEditSubmit,
  onStartEdit,
}: {
  createForm: GameFormState;
  createStatus: FormStatus;
  editForm: GameFormState;
  editStatus: FormStatus;
  editingGameId: string | null;
  games: AdminGame[];
  onCancelEdit: () => void;
  onCreateChange: (form: GameFormState) => void;
  onCreateSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onEditChange: (form: GameFormState) => void;
  onEditSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onStartEdit: (game: AdminGame) => void;
}) {
  return (
    <>
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <GameFormCard
          form={createForm}
          onChange={onCreateChange}
          onSubmit={onCreateSubmit}
          status={createStatus}
          submitLabel="Create game"
          title="Create game"
        />

        <Card className="border-white/10 bg-[#10182b]/90 text-white shadow-xl shadow-black/15">
          <CardHeader>
            <CardTitle className="font-mono text-xl">Edit game</CardTitle>
          </CardHeader>
          <CardContent>
            {editingGameId ? (
              <GameForm
                form={editForm}
                onCancel={onCancelEdit}
                onChange={onEditChange}
                onSubmit={onEditSubmit}
                status={editStatus}
                submitLabel="Save changes"
              />
            ) : (
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6 text-sm text-zinc-400">
                Select a game below to edit its details.
                {editStatus.success ? (
                  <p className="mt-3 text-emerald-200">
                    {editStatus.success}
                  </p>
                ) : null}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AdminListCard title="Games">
        {games.map((game) => (
          <li
            className="rounded-lg border border-white/10 bg-white/[0.03] p-4"
            key={game.id}
          >
            <p className="font-semibold text-white">{game.name}</p>
            <p className="mt-1 font-mono text-xs text-zinc-500">{game.slug}</p>
            {game.description ? (
              <p className="mt-3 text-sm text-zinc-400">{game.description}</p>
            ) : null}
            {game.icon_url ? (
              <p className="mt-2 truncate font-mono text-xs text-zinc-500">
                {game.icon_url}
              </p>
            ) : null}
            <Button
              className="mt-4 border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
              onClick={() => onStartEdit(game)}
              size="sm"
              type="button"
              variant="ghost"
            >
              <Pencil className="size-3.5" aria-hidden="true" />
              Edit
            </Button>
          </li>
        ))}
      </AdminListCard>
    </>
  );
}
