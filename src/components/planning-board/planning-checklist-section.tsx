"use client";

import { type FormEvent, useEffect, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  Circle,
  ListChecks,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { CardContent } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { supabase } from "@/src/lib/supabase";
import { cn } from "@/src/lib/utils";

type ChecklistItem = {
  board_id: string;
  id: string;
  is_done: boolean;
  sort_order: number;
  title: string;
  user_id: string;
};

type Status = {
  error: string | null;
  isLoading: boolean;
  success: string | null;
};

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown checklist error.";
}

function sortItems(items: ChecklistItem[]) {
  return [...items].sort((left, right) => {
    if (left.is_done !== right.is_done) {
      return Number(left.is_done) - Number(right.is_done);
    }

    return left.sort_order - right.sort_order;
  });
}

export function PlanningChecklistSection({
  boardId,
  userId,
}: {
  boardId: string;
  userId: string;
}) {
  const [createTitle, setCreateTitle] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [status, setStatus] = useState<Status>({
    error: null,
    isLoading: true,
    success: null,
  });

  useEffect(() => {
    let isMounted = true;

    async function loadItems() {
      if (!supabase) {
        setStatus({
          error: "Supabase is not configured.",
          isLoading: false,
          success: null,
        });
        return;
      }

      setStatus({ error: null, isLoading: true, success: null });

      try {
        const { data, error } = await supabase
          .from("planning_checklist_items")
          .select("id, board_id, user_id, title, is_done, sort_order")
          .eq("board_id", boardId)
          .order("is_done", { ascending: true })
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: true });

        if (!isMounted) {
          return;
        }

        if (error) {
          setStatus({
            error: error.message,
            isLoading: false,
            success: null,
          });
          return;
        }

        setItems((data ?? []) as ChecklistItem[]);
        setStatus({ error: null, isLoading: false, success: null });
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setStatus({
          error: getErrorMessage(error),
          isLoading: false,
          success: null,
        });
      }
    }

    loadItems();

    return () => {
      isMounted = false;
    };
  }, [boardId]);

  async function handleCreateItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) {
      return;
    }

    const nextTitle = createTitle.trim();

    if (!nextTitle) {
      setStatus({
        error: "Checklist item text is required.",
        isLoading: false,
        success: null,
      });
      return;
    }

    setStatus({ error: null, isLoading: true, success: null });

    const { data, error } = await supabase
      .from("planning_checklist_items")
      .insert({
        board_id: boardId,
        is_done: false,
        sort_order: items.length,
        title: nextTitle,
        user_id: userId,
      })
      .select("id, board_id, user_id, title, is_done, sort_order")
      .single();

    if (error) {
      setStatus({
        error: error.message,
        isLoading: false,
        success: null,
      });
      return;
    }

    setCreateTitle("");
    setItems((current) => sortItems([...current, data as ChecklistItem]));
    setStatus({
      error: null,
      isLoading: false,
      success: "Checklist item added.",
    });
  }

  async function handleToggleItem(item: ChecklistItem) {
    if (!supabase) {
      return;
    }

    setStatus({ error: null, isLoading: true, success: null });

    const { data, error } = await supabase
      .from("planning_checklist_items")
      .update({ is_done: !item.is_done })
      .eq("id", item.id)
      .select("id, board_id, user_id, title, is_done, sort_order")
      .single();

    if (error) {
      setStatus({
        error: error.message,
        isLoading: false,
        success: null,
      });
      return;
    }

    setItems((current) =>
      sortItems(
        current.map((currentItem) =>
          currentItem.id === item.id ? (data as ChecklistItem) : currentItem
        )
      )
    );
    setStatus({
      error: null,
      isLoading: false,
      success: item.is_done ? "Checklist item reopened." : "Checklist item completed.",
    });
  }

  async function handleUpdateItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase || !editingItemId) {
      return;
    }

    const nextTitle = editTitle.trim();

    if (!nextTitle) {
      setStatus({
        error: "Checklist item text is required.",
        isLoading: false,
        success: null,
      });
      return;
    }

    setStatus({ error: null, isLoading: true, success: null });

    const { data, error } = await supabase
      .from("planning_checklist_items")
      .update({ title: nextTitle })
      .eq("id", editingItemId)
      .select("id, board_id, user_id, title, is_done, sort_order")
      .single();

    if (error) {
      setStatus({
        error: error.message,
        isLoading: false,
        success: null,
      });
      return;
    }

    setEditingItemId(null);
    setEditTitle("");
    setItems((current) =>
      sortItems(
        current.map((item) =>
          item.id === editingItemId ? (data as ChecklistItem) : item
        )
      )
    );
    setStatus({
      error: null,
      isLoading: false,
      success: "Checklist item updated.",
    });
  }

  async function handleDeleteItem(item: ChecklistItem) {
    if (!supabase) {
      return;
    }

    const confirmed = window.confirm(`Remove "${item.title}" from this checklist?`);

    if (!confirmed) {
      return;
    }

    setStatus({ error: null, isLoading: true, success: null });

    const { error } = await supabase
      .from("planning_checklist_items")
      .delete()
      .eq("id", item.id);

    if (error) {
      setStatus({
        error: error.message,
        isLoading: false,
        success: null,
      });
      return;
    }

    if (editingItemId === item.id) {
      setEditingItemId(null);
      setEditTitle("");
    }

    setItems((current) => current.filter((currentItem) => currentItem.id !== item.id));
    setStatus({
      error: null,
      isLoading: false,
      success: "Checklist item removed.",
    });
  }

  function startEditing(item: ChecklistItem) {
    setEditingItemId(item.id);
    setEditTitle(item.title);
    setStatus({ error: null, isLoading: false, success: null });
  }

  const completedCount = items.filter((item) => item.is_done).length;

  return (
    <details
      className="group rounded-xl border border-white/10 bg-[#10182b]/90 text-white shadow-xl shadow-black/20 ring-1 ring-white/5"
      open
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 marker:hidden sm:px-5 [&::-webkit-details-marker]:hidden">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-violet-500/15 text-violet-100 ring-1 ring-violet-300/20">
            <ListChecks className="size-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h2 className="font-mono text-xl font-semibold text-white">
              Launch checklist
            </h2>
            <p className="mt-1 text-sm leading-6 text-zinc-400">
              Track season prep tasks and mark them off as you get ready.
            </p>
          </div>
        </div>
        <ChevronDown
          className="size-5 shrink-0 text-zinc-500 transition group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <CardContent className="space-y-5 border-t border-white/10 pt-4">
        <form
          className="flex flex-col gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3 sm:flex-row sm:items-end"
          onSubmit={handleCreateItem}
        >
          <label className="block flex-1 space-y-2">
            <span className="text-sm text-zinc-300">Checklist item</span>
            <Input
              className="h-10 border-white/10 bg-white/5 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-violet-400/70 focus-visible:ring-violet-400/20"
              disabled={status.isLoading}
              onChange={(event) => setCreateTitle(event.target.value)}
              placeholder="Finish campaign prep"
              required
              value={createTitle}
            />
          </label>
          <Button
            className="h-10 bg-violet-500/80 px-4 text-white hover:bg-violet-500"
            disabled={status.isLoading}
            type="submit"
          >
            <Plus className="size-4" aria-hidden="true" />
            Add item
          </Button>
        </form>

        {status.error ? (
          <p className="rounded-md border border-rose-400/20 bg-rose-500/10 p-3 text-sm text-rose-100">
            {status.error}
          </p>
        ) : null}

        {status.success ? (
          <p className="rounded-md border border-emerald-400/20 bg-emerald-500/10 p-3 text-sm text-emerald-100">
            {status.success}
          </p>
        ) : null}

        <div className="flex items-center justify-between gap-3 text-sm">
          <p className="text-zinc-400">
            {items.length === 0
              ? "No launch prep tasks yet."
              : `${completedCount} of ${items.length} complete`}
          </p>
        </div>

        <div className="space-y-2">
          {status.isLoading && items.length === 0 ? (
            <div className="space-y-2">
              <div className="h-14 rounded-lg bg-white/5" />
              <div className="h-14 rounded-lg bg-white/5" />
            </div>
          ) : items.length === 0 ? (
            <p className="rounded-lg border border-dashed border-white/10 bg-white/[0.02] px-4 py-5 text-sm text-zinc-400">
              Add your first checklist item when you know what needs to happen
              before launch.
            </p>
          ) : (
            items.map((item) =>
              editingItemId === item.id ? (
                <form
                  className="flex flex-col gap-3 rounded-lg border border-violet-300/20 bg-violet-500/10 p-3 sm:flex-row sm:items-end"
                  key={item.id}
                  onSubmit={handleUpdateItem}
                >
                  <label className="block flex-1 space-y-2">
                    <span className="text-sm text-zinc-300">Item text</span>
                    <Input
                      className="h-10 border-white/10 bg-white/5 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-violet-400/70 focus-visible:ring-violet-400/20"
                      disabled={status.isLoading}
                      onChange={(event) => setEditTitle(event.target.value)}
                      required
                      value={editTitle}
                    />
                  </label>
                  <Button
                    className="h-10 bg-violet-500/80 px-3 text-white hover:bg-violet-500"
                    disabled={status.isLoading}
                    type="submit"
                  >
                    <Save className="size-4" aria-hidden="true" />
                    Save
                  </Button>
                  <Button
                    className="h-10 border-white/10 bg-white/5 px-3 text-zinc-100 hover:bg-white/10"
                    disabled={status.isLoading}
                    onClick={() => {
                      setEditingItemId(null);
                      setEditTitle("");
                    }}
                    type="button"
                    variant="ghost"
                  >
                    <X className="size-4" aria-hidden="true" />
                    Cancel
                  </Button>
                </form>
              ) : (
                <div
                  className="flex flex-col gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                  key={item.id}
                >
                  <button
                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                    disabled={status.isLoading}
                    onClick={() => handleToggleItem(item)}
                    type="button"
                  >
                    <span
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-md border transition",
                        item.is_done
                          ? "border-emerald-300/30 bg-emerald-500/15 text-emerald-100"
                          : "border-white/10 bg-white/5 text-zinc-400"
                      )}
                    >
                      {item.is_done ? (
                        <CheckCircle2 className="size-4" aria-hidden="true" />
                      ) : (
                        <Circle className="size-4" aria-hidden="true" />
                      )}
                    </span>
                    <span
                      className={cn(
                        "min-w-0 truncate text-sm text-zinc-100",
                        item.is_done ? "text-zinc-500 line-through" : ""
                      )}
                    >
                      {item.title}
                    </span>
                  </button>

                  <div className="flex shrink-0 flex-wrap gap-2">
                    <Button
                      className="h-9 border-white/10 bg-white/5 px-3 text-zinc-100 hover:bg-white/10"
                      disabled={status.isLoading}
                      onClick={() => startEditing(item)}
                      type="button"
                      variant="ghost"
                    >
                      <Pencil className="size-4" aria-hidden="true" />
                      Edit
                    </Button>
                    <Button
                      className="h-9 border-rose-300/20 bg-rose-500/10 px-3 text-rose-100 hover:bg-rose-500/20"
                      disabled={status.isLoading}
                      onClick={() => handleDeleteItem(item)}
                      type="button"
                      variant="ghost"
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                      Remove
                    </Button>
                  </div>
                </div>
              )
            )
          )}
        </div>
      </CardContent>
    </details>
  );
}
