"use client";

import { type FormEvent, useEffect, useState } from "react";
import {
  ExternalLink,
  Link as LinkIcon,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { supabase } from "@/src/lib/supabase";

type PlanningLinkType =
  | "maxroll"
  | "mobalytics"
  | "other"
  | "reddit"
  | "youtube";

type PlanningLink = {
  board_id: string;
  id: string;
  label: string;
  sort_order: number;
  type: PlanningLinkType;
  url: string;
  user_id: string;
};

type LinkFormState = {
  label: string;
  sort_order: string;
  type: PlanningLinkType;
  url: string;
};

type Status = {
  error: string | null;
  isLoading: boolean;
  success: string | null;
};

const emptyLinkForm: LinkFormState = {
  label: "",
  sort_order: "0",
  type: "other",
  url: "",
};

const linkTypes = [
  "youtube",
  "maxroll",
  "mobalytics",
  "reddit",
  "other",
] satisfies PlanningLinkType[];

const fieldClassName =
  "w-full rounded-lg border border-white/10 bg-[#111a2c] px-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-500 focus-visible:border-violet-400/70 focus-visible:ring-3 focus-visible:ring-violet-400/20 disabled:cursor-not-allowed disabled:opacity-50";
const selectOptionClassName = "bg-[#10182b] text-zinc-100";

function toLinkForm(link: PlanningLink): LinkFormState {
  return {
    label: link.label,
    sort_order: String(link.sort_order),
    type: link.type,
    url: link.url,
  };
}

function toSortOrder(value: string) {
  const sortOrder = Number.parseInt(value, 10);

  return Number.isFinite(sortOrder) ? sortOrder : 0;
}

function toTypeLabel(type: PlanningLinkType) {
  if (type === "maxroll") {
    return "Maxroll";
  }

  if (type === "mobalytics") {
    return "Mobalytics";
  }

  if (type === "youtube") {
    return "YouTube";
  }

  return type.charAt(0).toUpperCase() + type.slice(1);
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown planning link error.";
}

export function PlanningLinksSection({
  boardId,
  userId,
}: {
  boardId: string;
  userId: string;
}) {
  const [createForm, setCreateForm] = useState<LinkFormState>(emptyLinkForm);
  const [editForm, setEditForm] = useState<LinkFormState>(emptyLinkForm);
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [links, setLinks] = useState<PlanningLink[]>([]);
  const [status, setStatus] = useState<Status>({
    error: null,
    isLoading: true,
    success: null,
  });

  useEffect(() => {
    let isMounted = true;

    async function loadLinks() {
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
          .from("planning_links")
          .select("id, board_id, user_id, label, url, type, sort_order")
          .eq("board_id", boardId)
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

        setLinks((data ?? []) as PlanningLink[]);
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

    loadLinks();

    return () => {
      isMounted = false;
    };
  }, [boardId]);

  function validateForm(form: LinkFormState) {
    if (!form.label.trim()) {
      return "Link label is required.";
    }

    if (!form.url.trim()) {
      return "Link URL is required.";
    }

    return null;
  }

  async function handleCreateLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) {
      return;
    }

    const validationError = validateForm(createForm);

    if (validationError) {
      setStatus({
        error: validationError,
        isLoading: false,
        success: null,
      });
      return;
    }

    setStatus({ error: null, isLoading: true, success: null });

    const { data, error } = await supabase
      .from("planning_links")
      .insert({
        board_id: boardId,
        label: createForm.label.trim(),
        sort_order: toSortOrder(createForm.sort_order),
        type: createForm.type,
        url: createForm.url.trim(),
        user_id: userId,
      })
      .select("id, board_id, user_id, label, url, type, sort_order")
      .single();

    if (error) {
      setStatus({
        error: error.message,
        isLoading: false,
        success: null,
      });
      return;
    }

    setCreateForm(emptyLinkForm);
    setLinks((current) =>
      [...current, data as PlanningLink].sort(
        (left, right) => left.sort_order - right.sort_order
      )
    );
    setStatus({
      error: null,
      isLoading: false,
      success: "Planning link added.",
    });
  }

  async function handleUpdateLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase || !editingLinkId) {
      return;
    }

    const validationError = validateForm(editForm);

    if (validationError) {
      setStatus({
        error: validationError,
        isLoading: false,
        success: null,
      });
      return;
    }

    setStatus({ error: null, isLoading: true, success: null });

    const { data, error } = await supabase
      .from("planning_links")
      .update({
        label: editForm.label.trim(),
        sort_order: toSortOrder(editForm.sort_order),
        type: editForm.type,
        url: editForm.url.trim(),
      })
      .eq("id", editingLinkId)
      .select("id, board_id, user_id, label, url, type, sort_order")
      .single();

    if (error) {
      setStatus({
        error: error.message,
        isLoading: false,
        success: null,
      });
      return;
    }

    setEditingLinkId(null);
    setEditForm(emptyLinkForm);
    setLinks((current) =>
      current
        .map((link) =>
          link.id === editingLinkId ? (data as PlanningLink) : link
        )
        .sort((left, right) => left.sort_order - right.sort_order)
    );
    setStatus({
      error: null,
      isLoading: false,
      success: "Planning link updated.",
    });
  }

  async function handleDeleteLink(link: PlanningLink) {
    if (!supabase) {
      return;
    }

    const confirmed = window.confirm(`Remove "${link.label}" from this board?`);

    if (!confirmed) {
      return;
    }

    setStatus({ error: null, isLoading: true, success: null });

    const { error } = await supabase
      .from("planning_links")
      .delete()
      .eq("id", link.id);

    if (error) {
      setStatus({
        error: error.message,
        isLoading: false,
        success: null,
      });
      return;
    }

    if (editingLinkId === link.id) {
      setEditingLinkId(null);
      setEditForm(emptyLinkForm);
    }

    setLinks((current) => current.filter((item) => item.id !== link.id));
    setStatus({
      error: null,
      isLoading: false,
      success: "Planning link removed.",
    });
  }

  function startEditing(link: PlanningLink) {
    setEditingLinkId(link.id);
    setEditForm(toLinkForm(link));
    setStatus({ error: null, isLoading: false, success: null });
  }

  return (
    <Card className="border-white/10 bg-[#10182b]/90 text-white shadow-xl shadow-black/20 ring-1 ring-white/5">
      <CardHeader>
        <div className="flex size-12 items-center justify-center rounded-lg bg-sky-500/15 text-sky-100 ring-1 ring-sky-300/20">
          <LinkIcon className="size-6" aria-hidden="true" />
        </div>
        <CardTitle className="font-mono text-2xl">Resource links</CardTitle>
        <p className="text-sm leading-6 text-zinc-400">
          Save build guides, videos, and useful resources for this season.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        <form
          className="grid gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.5fr)_10rem_7rem_auto]"
          onSubmit={handleCreateLink}
        >
          <LinkFormFields
            form={createForm}
            isLoading={status.isLoading}
            onChange={setCreateForm}
          />
          <Button
            className="h-10 self-end bg-violet-500/80 px-4 text-white hover:bg-violet-500"
            disabled={status.isLoading}
            type="submit"
          >
            <Plus className="size-4" aria-hidden="true" />
            Add
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

        <div className="space-y-2">
          {status.isLoading && links.length === 0 ? (
            <div className="space-y-2">
              <div className="h-16 rounded-lg bg-white/5" />
              <div className="h-16 rounded-lg bg-white/5" />
            </div>
          ) : links.length === 0 ? (
            <p className="rounded-lg border border-dashed border-white/10 bg-white/[0.02] px-4 py-5 text-sm text-zinc-400">
              No resource links saved yet.
            </p>
          ) : (
            links.map((link) =>
              editingLinkId === link.id ? (
                <form
                  className="grid gap-3 rounded-lg border border-violet-300/20 bg-violet-500/10 p-3 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.5fr)_10rem_7rem_auto_auto]"
                  key={link.id}
                  onSubmit={handleUpdateLink}
                >
                  <LinkFormFields
                    form={editForm}
                    isLoading={status.isLoading}
                    onChange={setEditForm}
                  />
                  <Button
                    className="h-10 self-end bg-violet-500/80 px-3 text-white hover:bg-violet-500"
                    disabled={status.isLoading}
                    type="submit"
                  >
                    <Save className="size-4" aria-hidden="true" />
                    Save
                  </Button>
                  <Button
                    className="h-10 self-end border-white/10 bg-white/5 px-3 text-zinc-100 hover:bg-white/10"
                    disabled={status.isLoading}
                    onClick={() => {
                      setEditingLinkId(null);
                      setEditForm(emptyLinkForm);
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
                  key={link.id}
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        className="truncate font-medium text-zinc-100 transition hover:text-violet-200"
                        href={link.url}
                        rel="noreferrer"
                        target="_blank"
                      >
                        {link.label}
                      </a>
                      <span className="rounded-md border border-sky-300/20 bg-sky-500/10 px-2 py-0.5 text-xs text-sky-100">
                        {toTypeLabel(link.type)}
                      </span>
                      <span className="font-mono text-xs text-zinc-500">
                        #{link.sort_order}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-sm text-zinc-500">
                      {link.url}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-2">
                    <Button
                      asChild
                      className="h-9 border-white/10 bg-white/5 px-3 text-zinc-100 hover:bg-white/10"
                      variant="ghost"
                    >
                      <a href={link.url} rel="noreferrer" target="_blank">
                        <ExternalLink className="size-4" aria-hidden="true" />
                        Open
                      </a>
                    </Button>
                    <Button
                      className="h-9 border-white/10 bg-white/5 px-3 text-zinc-100 hover:bg-white/10"
                      disabled={status.isLoading}
                      onClick={() => startEditing(link)}
                      type="button"
                      variant="ghost"
                    >
                      <Pencil className="size-4" aria-hidden="true" />
                      Edit
                    </Button>
                    <Button
                      className="h-9 border-rose-300/20 bg-rose-500/10 px-3 text-rose-100 hover:bg-rose-500/20"
                      disabled={status.isLoading}
                      onClick={() => handleDeleteLink(link)}
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
    </Card>
  );
}

function LinkFormFields({
  form,
  isLoading,
  onChange,
}: {
  form: LinkFormState;
  isLoading: boolean;
  onChange: (form: LinkFormState) => void;
}) {
  function updateField(field: keyof LinkFormState, value: string) {
    onChange({
      ...form,
      [field]: value,
    });
  }

  return (
    <>
      <label className="block space-y-2">
        <span className="text-sm text-zinc-300">Label</span>
        <Input
          className="h-10 border-white/10 bg-white/5 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-violet-400/70 focus-visible:ring-violet-400/20"
          disabled={isLoading}
          onChange={(event) => updateField("label", event.target.value)}
          placeholder="Build guide"
          required
          value={form.label}
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm text-zinc-300">URL</span>
        <Input
          className="h-10 border-white/10 bg-white/5 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-violet-400/70 focus-visible:ring-violet-400/20"
          disabled={isLoading}
          onChange={(event) => updateField("url", event.target.value)}
          placeholder="https://example.com"
          required
          type="url"
          value={form.url}
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm text-zinc-300">Type</span>
        <select
          className={`${fieldClassName} h-10`}
          disabled={isLoading}
          onChange={(event) => updateField("type", event.target.value)}
          value={form.type}
        >
          {linkTypes.map((type) => (
            <option className={selectOptionClassName} key={type} value={type}>
              {toTypeLabel(type)}
            </option>
          ))}
        </select>
      </label>

      <label className="block space-y-2">
        <span className="text-sm text-zinc-300">Order</span>
        <Input
          className="h-10 border-white/10 bg-white/5 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-violet-400/70 focus-visible:ring-violet-400/20"
          disabled={isLoading}
          onChange={(event) => updateField("sort_order", event.target.value)}
          type="number"
          value={form.sort_order}
        />
      </label>
    </>
  );
}
