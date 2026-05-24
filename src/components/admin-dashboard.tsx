"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Database,
  LockKeyhole,
  LogOut,
  Pencil,
  Plus,
  Save,
  X,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { supabase } from "@/src/lib/supabase";

type AdminGame = {
  created_at: string;
  id: string;
  name: string;
  slug: string;
};

type AdminSeason = {
  description: string | null;
  ends_at: string;
  game_id: string;
  id: string;
  name: string;
  slug: string;
  starts_at: string;
};

type AdminData = {
  games: AdminGame[];
  seasons: AdminSeason[];
};

type SeasonFormState = {
  description: string;
  ends_at: string;
  game_id: string;
  name: string;
  slug: string;
  starts_at: string;
};

type SessionResult = Awaited<ReturnType<NonNullable<typeof supabase>["auth"]["getSession"]>>;

const sessionCheckTimeoutMs = 2_000;
const emptySeasonForm: SeasonFormState = {
  description: "",
  ends_at: "",
  game_id: "",
  name: "",
  slug: "",
  starts_at: "",
};

export function AdminDashboard() {
  const [adminData, setAdminData] = useState<AdminData>({
    games: [],
    seasons: [],
  });
  const [createForm, setCreateForm] = useState<SeasonFormState>(emptySeasonForm);
  const [createStatus, setCreateStatus] = useState<{
    error: string | null;
    isLoading: boolean;
    success: string | null;
  }>({ error: null, isLoading: false, success: null });
  const [editForm, setEditForm] = useState<SeasonFormState>(emptySeasonForm);
  const [editingSeasonId, setEditingSeasonId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<{
    error: string | null;
    isLoading: boolean;
    success: string | null;
  }>({ error: null, isLoading: false, success: null });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    let redirectTimeoutId: number | undefined;

    async function loadAdminData() {
      redirectTimeoutId = window.setTimeout(() => {
        window.location.replace("/login");
      }, sessionCheckTimeoutMs + 1_000);

      if (!supabase) {
        window.clearTimeout(redirectTimeoutId);
        setError("Supabase is not configured.");
        setIsLoading(false);
        return;
      }

      const { data: sessionData, error: sessionError } =
        await getSessionWithTimeout();
      const sessionUser = sessionData.session?.user ?? null;

      if (!isMounted) {
        window.clearTimeout(redirectTimeoutId);
        return;
      }

      if (sessionError || !sessionUser) {
        window.location.replace("/login");
        return;
      }

      window.clearTimeout(redirectTimeoutId);

      setUser(sessionUser);

      const [gamesResult, seasonsResult] = await Promise.all([
        supabase
          .from("games")
          .select("id, name, slug, created_at")
          .order("name", { ascending: true }),
        supabase
          .from("seasons")
          .select("id, game_id, name, slug, starts_at, ends_at, description")
          .order("starts_at", { ascending: true }),
      ]);

      if (!isMounted) {
        return;
      }

      if (gamesResult.error || seasonsResult.error) {
        setError(
          gamesResult.error?.message ??
            seasonsResult.error?.message ??
            "Could not load admin data."
        );
        setIsLoading(false);
        return;
      }

      setAdminData({
        games: (gamesResult.data ?? []) as AdminGame[],
        seasons: (seasonsResult.data ?? []) as AdminSeason[],
      });
      setIsLoading(false);
    }

    loadAdminData();

    return () => {
      isMounted = false;
      window.clearTimeout(redirectTimeoutId);
    };
  }, [router]);

  const gameNamesById = useMemo(
    () =>
      new Map(adminData.games.map((game) => [game.id, game.name] as const)),
    [adminData.games]
  );

  async function reloadAdminData() {
    if (!supabase) {
      setError("Supabase is not configured.");
      return false;
    }

    const [gamesResult, seasonsResult] = await Promise.all([
      supabase
        .from("games")
        .select("id, name, slug, created_at")
        .order("name", { ascending: true }),
      supabase
        .from("seasons")
        .select("id, game_id, name, slug, starts_at, ends_at, description")
        .order("starts_at", { ascending: true }),
    ]);

    if (gamesResult.error || seasonsResult.error) {
      setError(
        gamesResult.error?.message ??
          seasonsResult.error?.message ??
          "Could not load admin data."
      );
      return false;
    }

    setAdminData({
      games: (gamesResult.data ?? []) as AdminGame[],
      seasons: (seasonsResult.data ?? []) as AdminSeason[],
    });
    return true;
  }

  function getSeasonFormError(form: SeasonFormState) {
    if (!form.game_id || !form.name || !form.slug || !form.starts_at) {
      return "Game, name, slug, and start date are required.";
    }

    return null;
  }

  function getSeasonPayload(form: SeasonFormState) {
    return {
      description: form.description.trim() || null,
      ends_at: toIsoDateTime(form.ends_at || form.starts_at),
      game_id: form.game_id,
      name: form.name.trim(),
      slug: form.slug.trim(),
      starts_at: toIsoDateTime(form.starts_at),
    };
  }

  async function handleCreateSeason(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) {
      setCreateStatus({
        error: "Supabase is not configured.",
        isLoading: false,
        success: null,
      });
      return;
    }

    const validationError = getSeasonFormError(createForm);

    if (validationError) {
      setCreateStatus({
        error: validationError,
        isLoading: false,
        success: null,
      });
      return;
    }

    setCreateStatus({ error: null, isLoading: true, success: null });

    const payload = getSeasonPayload(createForm);
    const { error: createError } = await supabase.from("seasons").insert({
      id: `${payload.game_id}-${payload.slug}`,
      ...payload,
    });

    if (createError) {
      setCreateStatus({
        error: createError.message,
        isLoading: false,
        success: null,
      });
      return;
    }

    await reloadAdminData();
    setCreateForm({ ...emptySeasonForm, game_id: createForm.game_id });
    setCreateStatus({
      error: null,
      isLoading: false,
      success: "Season created.",
    });
  }

  function startEditingSeason(season: AdminSeason) {
    setEditingSeasonId(season.id);
    setEditStatus({ error: null, isLoading: false, success: null });
    setEditForm({
      description: season.description ?? "",
      ends_at: toDateTimeLocalValue(season.ends_at),
      game_id: season.game_id,
      name: season.name,
      slug: season.slug,
      starts_at: toDateTimeLocalValue(season.starts_at),
    });
  }

  function stopEditingSeason() {
    setEditingSeasonId(null);
    setEditForm(emptySeasonForm);
    setEditStatus({ error: null, isLoading: false, success: null });
  }

  async function handleUpdateSeason(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase || !editingSeasonId) {
      return;
    }

    const validationError = getSeasonFormError(editForm);

    if (validationError) {
      setEditStatus({
        error: validationError,
        isLoading: false,
        success: null,
      });
      return;
    }

    setEditStatus({ error: null, isLoading: true, success: null });

    const { error: updateError } = await supabase
      .from("seasons")
      .update(getSeasonPayload(editForm))
      .eq("id", editingSeasonId);

    if (updateError) {
      setEditStatus({
        error: updateError.message,
        isLoading: false,
        success: null,
      });
      return;
    }

    await reloadAdminData();
    setEditingSeasonId(null);
    setEditStatus({
      error: null,
      isLoading: false,
      success: "Season updated.",
    });
  }

  async function handleSignOut() {
    if (supabase) {
      await supabase.auth.signOut();
    }

    router.replace("/login");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#050b18] px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-10">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            className="inline-flex items-center gap-2 text-sm text-violet-300 hover:text-violet-200"
            href="/"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to dashboard
          </Link>

          <Button
            className="border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
            onClick={handleSignOut}
            type="button"
            variant="ghost"
          >
            <LogOut className="size-4" aria-hidden="true" />
            Sign out
          </Button>
        </div>

        <div>
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-lg bg-violet-500/20 text-violet-100 ring-1 ring-violet-300/20">
              <LockKeyhole className="size-6" aria-hidden="true" />
            </div>
            <div>
              <h1 className="font-mono text-3xl font-semibold tracking-normal text-white sm:text-4xl">
                Admin dashboard
              </h1>
              <p className="mt-1 text-sm text-zinc-400">
                {user?.email ?? "Checking admin session..."}
              </p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <Card className="border-white/10 bg-[#10182b]/90 p-8 text-center text-zinc-300">
            Loading admin data from Supabase...
          </Card>
        ) : null}

        {error && !isLoading ? (
          <Card className="border-rose-400/20 bg-[#10182b]/90 p-8 text-rose-100">
            {error}
          </Card>
        ) : null}

        {!isLoading && !error ? (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <AdminStatCard
                label="Games"
                value={adminData.games.length}
              />
              <AdminStatCard
                label="Seasons"
                value={adminData.seasons.length}
              />
            </div>

            <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
              <SeasonFormCard
                form={createForm}
                games={adminData.games}
                onChange={setCreateForm}
                onSubmit={handleCreateSeason}
                status={createStatus}
                submitLabel="Create season"
                title="Create season"
              />

              <Card className="border-white/10 bg-[#10182b]/90 text-white shadow-xl shadow-black/15">
                <CardHeader>
                  <CardTitle className="font-mono text-xl">
                    Edit season
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {editingSeasonId ? (
                    <SeasonForm
                      form={editForm}
                      games={adminData.games}
                      onCancel={stopEditingSeason}
                      onChange={setEditForm}
                      onSubmit={handleUpdateSeason}
                      status={editStatus}
                      submitLabel="Save changes"
                    />
                  ) : (
                    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6 text-sm text-zinc-400">
                      Select a season below to edit its schedule details.
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

            <div className="grid gap-6 xl:grid-cols-2">
              <AdminListCard title="Games">
                {adminData.games.map((game) => (
                  <li
                    className="rounded-lg border border-white/10 bg-white/[0.03] p-4"
                    key={game.id}
                  >
                    <p className="font-semibold text-white">{game.name}</p>
                    <p className="mt-1 font-mono text-xs text-zinc-500">
                      {game.slug}
                    </p>
                  </li>
                ))}
              </AdminListCard>

              <AdminListCard title="Seasons">
                {adminData.seasons.map((season) => (
                  <li
                    className="rounded-lg border border-white/10 bg-white/[0.03] p-4"
                    key={season.id}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-white">
                          {season.name}
                        </p>
                        <p className="mt-1 text-sm text-zinc-400">
                          {gameNamesById.get(season.game_id) ??
                            season.game_id}
                        </p>
                      </div>
                      <p className="font-mono text-xs text-zinc-500">
                        {formatDate(season.starts_at)} -{" "}
                        {formatDate(season.ends_at)}
                      </p>
                    </div>
                    <Button
                      className="mt-4 border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
                      onClick={() => startEditingSeason(season)}
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
            </div>
          </>
        ) : null}
      </section>
    </main>
  );
}

function getSessionWithTimeout(): Promise<SessionResult> {
  if (!supabase) {
    return Promise.resolve({
      data: { session: null },
      error: null,
    });
  }

  return Promise.race([
    supabase.auth.getSession(),
    new Promise<SessionResult>((resolve) => {
      window.setTimeout(() => {
        resolve({
          data: { session: null },
          error: null,
        });
      }, sessionCheckTimeoutMs);
    }),
  ]);
}

function AdminStatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card className="border-white/10 bg-[#10182b]/90 p-5 text-white shadow-xl shadow-black/15">
      <div className="flex items-center gap-4">
        <div className="flex size-11 items-center justify-center rounded-lg bg-sky-500/15 text-sky-200 ring-1 ring-sky-300/20">
          <Database className="size-5" aria-hidden="true" />
        </div>
        <div>
          <p className="font-mono text-3xl font-semibold">{value}</p>
          <p className="text-sm text-zinc-400">{label}</p>
        </div>
      </div>
    </Card>
  );
}

function AdminListCard({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <Card className="border-white/10 bg-[#10182b]/90 text-white shadow-xl shadow-black/15">
      <CardHeader>
        <CardTitle className="font-mono text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">{children}</ul>
      </CardContent>
    </Card>
  );
}

function SeasonFormCard({
  form,
  games,
  onChange,
  onSubmit,
  status,
  submitLabel,
  title,
}: {
  form: SeasonFormState;
  games: AdminGame[];
  onChange: (form: SeasonFormState) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  status: { error: string | null; isLoading: boolean; success: string | null };
  submitLabel: string;
  title: string;
}) {
  return (
    <Card className="border-white/10 bg-[#10182b]/90 text-white shadow-xl shadow-black/15">
      <CardHeader>
        <CardTitle className="font-mono text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <SeasonForm
          form={form}
          games={games}
          onChange={onChange}
          onSubmit={onSubmit}
          status={status}
          submitLabel={submitLabel}
        />
      </CardContent>
    </Card>
  );
}

function SeasonForm({
  form,
  games,
  onCancel,
  onChange,
  onSubmit,
  status,
  submitLabel,
}: {
  form: SeasonFormState;
  games: AdminGame[];
  onCancel?: () => void;
  onChange: (form: SeasonFormState) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  status: { error: string | null; isLoading: boolean; success: string | null };
  submitLabel: string;
}) {
  const SubmitIcon = submitLabel.startsWith("Save") ? Save : Plus;

  function updateField(field: keyof SeasonFormState, value: string) {
    onChange({
      ...form,
      [field]: value,
    });
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <label className="block space-y-2">
        <span className="text-sm text-zinc-300">Game</span>
        <select
          className={fieldClassName}
          disabled={status.isLoading}
          onChange={(event) => updateField("game_id", event.target.value)}
          required
          value={form.game_id}
        >
          <option className={selectOptionClassName} value="">
            Select game
          </option>
          {games.map((game) => (
            <option
              className={selectOptionClassName}
              key={game.id}
              value={game.id}
            >
              {game.name}
            </option>
          ))}
        </select>
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm text-zinc-300">Name</span>
          <Input
            className="h-11 border-white/10 bg-white/5 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-violet-400/70 focus-visible:ring-violet-400/20"
            disabled={status.isLoading}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="Season 14"
            required
            value={form.name}
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm text-zinc-300">Slug</span>
          <Input
            className="h-11 border-white/10 bg-white/5 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-violet-400/70 focus-visible:ring-violet-400/20"
            disabled={status.isLoading}
            onChange={(event) => updateField("slug", event.target.value)}
            placeholder="season-14"
            required
            value={form.slug}
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm text-zinc-300">Starts at</span>
          <Input
            className="h-11 border-white/10 bg-white/5 text-zinc-100 focus-visible:border-violet-400/70 focus-visible:ring-violet-400/20"
            disabled={status.isLoading}
            onChange={(event) => updateField("starts_at", event.target.value)}
            required
            type="datetime-local"
            value={form.starts_at}
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm text-zinc-300">Ends at</span>
          <Input
            className="h-11 border-white/10 bg-white/5 text-zinc-100 focus-visible:border-violet-400/70 focus-visible:ring-violet-400/20"
            disabled={status.isLoading}
            onChange={(event) => updateField("ends_at", event.target.value)}
            type="datetime-local"
            value={form.ends_at}
          />
        </label>
      </div>

      <label className="block space-y-2">
        <span className="text-sm text-zinc-300">Description</span>
        <textarea
          className={`${fieldClassName} min-h-24 resize-y py-2`}
          disabled={status.isLoading}
          onChange={(event) => updateField("description", event.target.value)}
          placeholder="Optional season notes"
          value={form.description}
        />
      </label>

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

      <div className="flex flex-wrap gap-3">
        <Button
          className="h-10 bg-violet-500/80 px-4 text-white hover:bg-violet-500"
          disabled={status.isLoading}
          type="submit"
        >
          <SubmitIcon className="size-4" aria-hidden="true" />
          {status.isLoading ? "Saving..." : submitLabel}
        </Button>

        {onCancel ? (
          <Button
            className="h-10 border-white/10 bg-white/5 px-4 text-zinc-100 hover:bg-white/10"
            disabled={status.isLoading}
            onClick={onCancel}
            type="button"
            variant="ghost"
          >
            <X className="size-4" aria-hidden="true" />
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  );
}

const fieldClassName =
  "w-full rounded-lg border border-white/10 bg-[#111a2c] px-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-500 focus-visible:border-violet-400/70 focus-visible:ring-3 focus-visible:ring-violet-400/20 disabled:cursor-not-allowed disabled:opacity-50";
const selectOptionClassName = "bg-[#10182b] text-zinc-100";

function formatDate(value: string) {
  return value.slice(0, 10);
}

function toDateTimeLocalValue(value: string) {
  return value.slice(0, 16);
}

function toIsoDateTime(value: string) {
  return new Date(value).toISOString();
}
