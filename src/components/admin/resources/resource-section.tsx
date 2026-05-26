import type { FormEvent } from "react";
import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { groupAdminItemsByGame } from "../helpers";
import { AdminGroupedListCard } from "../shared/admin-grouped-list-card";
import type { AdminGame, AdminResource, FormStatus, ResourceFormState } from "../types";
import { ResourceForm, ResourceFormCard } from "./resource-form";

export function AdminResourcesSection({
  createForm,
  createStatus,
  editForm,
  editStatus,
  editingResourceId,
  gameNamesById,
  games,
  mode = "resources",
  onCancelEdit,
  onCreateChange,
  onCreateSubmit,
  onDelete,
  onEditChange,
  onEditSubmit,
  onStartEdit,
  resources,
}: {
  createForm: ResourceFormState;
  createStatus: FormStatus;
  editForm: ResourceFormState;
  editStatus: FormStatus;
  editingResourceId: string | null;
  gameNamesById: Map<string, string>;
  games: AdminGame[];
  mode?: "community" | "resources";
  onCancelEdit: () => void;
  onCreateChange: (form: ResourceFormState) => void;
  onCreateSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onDelete: (resource: AdminResource) => void;
  onEditChange: (form: ResourceFormState) => void;
  onEditSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onStartEdit: (resource: AdminResource) => void;
  resources: AdminResource[];
}) {
  const resourceGroups = groupAdminItemsByGame(
    resources,
    games,
    gameNamesById
  );
  const copy =
    mode === "community" ?
      {
        createTitle: "Create community link",
        editTitle: "Edit community link",
        emptyMessage: "No community links found.",
        listTitle: "Community links",
        selectMessage: "Select a community link below to edit it.",
        submitLabel: "Create community link",
      }
    : {
        createTitle: "Create resource",
        editTitle: "Edit resource",
        emptyMessage: "No resources found.",
        listTitle: "Resources",
        selectMessage: "Select a resource below to edit it.",
        submitLabel: "Create resource",
      };

  return (
    <>
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <ResourceFormCard
          form={createForm}
          games={games}
          onChange={onCreateChange}
          onSubmit={onCreateSubmit}
          status={createStatus}
          submitLabel={copy.submitLabel}
          title={copy.createTitle}
          mode={mode}
        />

        <Card className="border-white/10 bg-[#10182b]/90 text-white shadow-xl shadow-black/15">
          <CardHeader>
            <CardTitle className="font-mono text-xl">
              {copy.editTitle}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {editingResourceId ? (
              <ResourceForm
                form={editForm}
                games={games}
                mode={mode}
                onCancel={onCancelEdit}
                onChange={onEditChange}
                onSubmit={onEditSubmit}
                status={editStatus}
                submitLabel="Save changes"
              />
            ) : (
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6 text-sm text-zinc-400">
                {copy.selectMessage}
                {editStatus.success ? (
                  <p className="mt-3 text-emerald-200">{editStatus.success}</p>
                ) : null}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AdminGroupedListCard
        emptyMessage={copy.emptyMessage}
        groups={resourceGroups.map((group) => ({
          children: (
            <ul className="space-y-3 p-4">
              {group.items.map((resource) => (
                <li
                  className="rounded-lg border border-white/10 bg-white/[0.03] p-4"
                  key={resource.id}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">
                        {resource.title}
                      </p>
                      <p className="mt-1 text-sm text-zinc-400">
                        {mode === "resources" ?
                          `${resource.group_title ?? "Ungrouped"} / ${resource.icon}`
                        : `${resource.label} / ${resource.icon}`}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`rounded-md border px-2 py-1 text-xs ${
                          resource.is_active
                            ? "border-emerald-300/20 bg-emerald-500/10 text-emerald-100"
                            : "border-white/10 bg-white/5 text-zinc-400"
                        }`}
                      >
                        {resource.is_active ? "Active" : "Hidden"}
                      </span>
                      <span className="font-mono text-xs text-zinc-500">
                        Order {resource.sort_order}
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 font-mono text-xs text-zinc-500">
                    {resource.url}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Button
                      className="border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
                      onClick={() => onStartEdit(resource)}
                      size="sm"
                      type="button"
                      variant="ghost"
                    >
                      <Pencil className="size-3.5" aria-hidden="true" />
                      Edit
                    </Button>
                    <Button
                      className="border-rose-300/20 bg-rose-500/10 text-rose-100 hover:bg-rose-500/20"
                      onClick={() => onDelete(resource)}
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
        storageKey={`seasontracker.admin.${mode}.collapsedGroups`}
        title={copy.listTitle}
      />
    </>
  );
}
