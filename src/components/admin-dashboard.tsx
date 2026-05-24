"use client";

import {
  type FormEvent,
  useEffect,
  useMemo,
  useState,
  ViewTransition,
} from "react";
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
  Trash2,
  X,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { supabase } from "@/src/lib/supabase";

type AdminGame = {
  created_at: string;
  description: string | null;
  icon_url: string | null;
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

type AdminResource = {
  game_id: string;
  icon: string;
  id: string;
  is_active: boolean;
  label: string;
  sort_order: number;
  title: string;
  url: string;
};

type AdminData = {
  games: AdminGame[];
  resources: AdminResource[];
  seasons: AdminSeason[];
};

type AdminSection = "games" | "overview" | "resources" | "seasons";

type ResourceFormState = {
  game_id: string;
  icon: string;
  id: string;
  is_active: boolean;
  label: string;
  sort_order: string;
  title: string;
  url: string;
};

type GameFormState = {
  description: string;
  icon_url: string;
  id: string;
  name: string;
  slug: string;
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
const emptyGameForm: GameFormState = {
  description: "",
  icon_url: "",
  id: "",
  name: "",
  slug: "",
};
const emptySeasonForm: SeasonFormState = {
  description: "",
  ends_at: "",
  game_id: "",
  name: "",
  slug: "",
  starts_at: "",
};
const emptyResourceForm: ResourceFormState = {
  game_id: "",
  icon: "forum",
  id: "",
  is_active: true,
  label: "",
  sort_order: "0",
  title: "",
  url: "",
};
const emptyAdminData: AdminData = {
  games: [],
  resources: [],
  seasons: [],
};
const missingResourcesTableMessage =
  "Community resources are not set up in Supabase yet. Apply the game_resources migration to enable the Resources admin page.";

let cachedAdminData: AdminData | null = null;
let cachedAdminUser: User | null = null;

export function AdminDashboard({ section }: { section: AdminSection }) {
  const [adminData, setAdminData] = useState<AdminData>(
    () => cachedAdminData ?? emptyAdminData
  );
  const [createResourceForm, setCreateResourceForm] =
    useState<ResourceFormState>(emptyResourceForm);
  const [createResourceStatus, setCreateResourceStatus] = useState<{
    error: string | null;
    isLoading: boolean;
    success: string | null;
  }>({ error: null, isLoading: false, success: null });
  const [createGameForm, setCreateGameForm] =
    useState<GameFormState>(emptyGameForm);
  const [createGameStatus, setCreateGameStatus] = useState<{
    error: string | null;
    isLoading: boolean;
    success: string | null;
  }>({ error: null, isLoading: false, success: null });
  const [createForm, setCreateForm] = useState<SeasonFormState>(emptySeasonForm);
  const [createStatus, setCreateStatus] = useState<{
    error: string | null;
    isLoading: boolean;
    success: string | null;
  }>({ error: null, isLoading: false, success: null });
  const [editGameForm, setEditGameForm] =
    useState<GameFormState>(emptyGameForm);
  const [editingGameId, setEditingGameId] = useState<string | null>(null);
  const [editGameStatus, setEditGameStatus] = useState<{
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
  const [editResourceForm, setEditResourceForm] =
    useState<ResourceFormState>(emptyResourceForm);
  const [editingResourceId, setEditingResourceId] = useState<string | null>(
    null
  );
  const [editResourceStatus, setEditResourceStatus] = useState<{
    error: string | null;
    isLoading: boolean;
    success: string | null;
  }>({ error: null, isLoading: false, success: null });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(() => !cachedAdminData);
  const [resourcesSetupMessage, setResourcesSetupMessage] = useState<
    string | null
  >(null);
  const [user, setUser] = useState<User | null>(() => cachedAdminUser);
  const router = useRouter();
  const pageTitle =
    section === "games" ? "Game management"
    : section === "resources" ? "Resource management"
    : section === "seasons" ? "Season management"
    : "Admin dashboard";

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

      cachedAdminUser = sessionUser;
      setUser(sessionUser);

      const [gamesResult, resourcesResult, seasonsResult] = await Promise.all([
        supabase
          .from("games")
          .select("id, name, slug, description, icon_url, created_at")
          .order("name", { ascending: true }),
        supabase
          .from("game_resources")
          .select(
            "id, game_id, title, label, url, icon, sort_order, is_active"
          )
          .order("game_id", { ascending: true })
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: true }),
        supabase
          .from("seasons")
          .select("id, game_id, name, slug, starts_at, ends_at, description")
          .order("starts_at", { ascending: true }),
      ]);

      if (!isMounted) {
        return;
      }

      const isMissingResourcesTable = isMissingGameResourcesTableError(
        resourcesResult.error
      );

      if (
        gamesResult.error ||
        seasonsResult.error ||
        (resourcesResult.error && !isMissingResourcesTable)
      ) {
        setError(
          gamesResult.error?.message ??
            seasonsResult.error?.message ??
            resourcesResult.error?.message ??
            "Could not load admin data."
        );
        setIsLoading(false);
        return;
      }

      setResourcesSetupMessage(
        isMissingResourcesTable ? missingResourcesTableMessage : null
      );

      const nextAdminData = {
        games: (gamesResult.data ?? []) as AdminGame[],
        resources: isMissingResourcesTable
          ? []
          : ((resourcesResult.data ?? []) as AdminResource[]),
        seasons: (seasonsResult.data ?? []) as AdminSeason[],
      };

      cachedAdminData = nextAdminData;
      setAdminData(nextAdminData);
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

    const [gamesResult, resourcesResult, seasonsResult] = await Promise.all([
      supabase
        .from("games")
        .select("id, name, slug, description, icon_url, created_at")
        .order("name", { ascending: true }),
      supabase
        .from("game_resources")
        .select(
          "id, game_id, title, label, url, icon, sort_order, is_active"
        )
        .order("game_id", { ascending: true })
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }),
      supabase
        .from("seasons")
        .select("id, game_id, name, slug, starts_at, ends_at, description")
        .order("starts_at", { ascending: true }),
    ]);

    const isMissingResourcesTable = isMissingGameResourcesTableError(
      resourcesResult.error
    );

    if (
      gamesResult.error ||
      seasonsResult.error ||
      (resourcesResult.error && !isMissingResourcesTable)
    ) {
      setError(
        gamesResult.error?.message ??
          seasonsResult.error?.message ??
          resourcesResult.error?.message ??
          "Could not load admin data."
      );
      return false;
    }

    setResourcesSetupMessage(
      isMissingResourcesTable ? missingResourcesTableMessage : null
    );

    const nextAdminData = {
      games: (gamesResult.data ?? []) as AdminGame[],
      resources: isMissingResourcesTable
        ? []
        : ((resourcesResult.data ?? []) as AdminResource[]),
      seasons: (seasonsResult.data ?? []) as AdminSeason[],
    };

    cachedAdminData = nextAdminData;
    setAdminData(nextAdminData);
    return true;
  }

  function getResourceFormError(form: ResourceFormState) {
    if (
      !form.id.trim() ||
      !form.game_id ||
      !form.title.trim() ||
      !form.label.trim() ||
      !form.url.trim()
    ) {
      return "ID, game, title, label, and URL are required.";
    }

    return null;
  }

  function getResourcePayload(form: ResourceFormState) {
    return {
      game_id: form.game_id,
      icon: form.icon,
      id: form.id.trim(),
      is_active: form.is_active,
      label: form.label.trim(),
      sort_order: Number.parseInt(form.sort_order, 10) || 0,
      title: form.title.trim(),
      url: form.url.trim(),
    };
  }

  async function handleCreateResource(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) {
      setCreateResourceStatus({
        error: "Supabase is not configured.",
        isLoading: false,
        success: null,
      });
      return;
    }

    const validationError = getResourceFormError(createResourceForm);

    if (validationError) {
      setCreateResourceStatus({
        error: validationError,
        isLoading: false,
        success: null,
      });
      return;
    }

    setCreateResourceStatus({
      error: null,
      isLoading: true,
      success: null,
    });

    const { error: createError } = await supabase
      .from("game_resources")
      .insert(getResourcePayload(createResourceForm));

    if (createError) {
      setCreateResourceStatus({
        error: createError.message,
        isLoading: false,
        success: null,
      });
      return;
    }

    await reloadAdminData();
    setCreateResourceForm({
      ...emptyResourceForm,
      game_id: createResourceForm.game_id,
    });
    setCreateResourceStatus({
      error: null,
      isLoading: false,
      success: "Resource created.",
    });
  }

  function startEditingResource(resource: AdminResource) {
    setEditingResourceId(resource.id);
    setEditResourceStatus({ error: null, isLoading: false, success: null });
    setEditResourceForm({
      game_id: resource.game_id,
      icon: resource.icon,
      id: resource.id,
      is_active: resource.is_active,
      label: resource.label,
      sort_order: String(resource.sort_order),
      title: resource.title,
      url: resource.url,
    });
  }

  function stopEditingResource() {
    setEditingResourceId(null);
    setEditResourceForm(emptyResourceForm);
    setEditResourceStatus({ error: null, isLoading: false, success: null });
  }

  async function handleUpdateResource(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase || !editingResourceId) {
      return;
    }

    const validationError = getResourceFormError(editResourceForm);

    if (validationError) {
      setEditResourceStatus({
        error: validationError,
        isLoading: false,
        success: null,
      });
      return;
    }

    setEditResourceStatus({ error: null, isLoading: true, success: null });

    const payload = getResourcePayload(editResourceForm);
    const { error: updateError } = await supabase
      .from("game_resources")
      .update({
        game_id: payload.game_id,
        icon: payload.icon,
        is_active: payload.is_active,
        label: payload.label,
        sort_order: payload.sort_order,
        title: payload.title,
        url: payload.url,
      })
      .eq("id", editingResourceId);

    if (updateError) {
      setEditResourceStatus({
        error: updateError.message,
        isLoading: false,
        success: null,
      });
      return;
    }

    await reloadAdminData();
    setEditingResourceId(null);
    setEditResourceStatus({
      error: null,
      isLoading: false,
      success: "Resource updated.",
    });
  }

  async function handleDeleteResource(resource: AdminResource) {
    if (
      !supabase ||
      !window.confirm(`Delete "${resource.title}" from game resources?`)
    ) {
      return;
    }

    setEditResourceStatus({ error: null, isLoading: true, success: null });

    const { error: deleteError } = await supabase
      .from("game_resources")
      .delete()
      .eq("id", resource.id);

    if (deleteError) {
      setEditResourceStatus({
        error: deleteError.message,
        isLoading: false,
        success: null,
      });
      return;
    }

    if (editingResourceId === resource.id) {
      setEditingResourceId(null);
      setEditResourceForm(emptyResourceForm);
    }

    await reloadAdminData();
    setEditResourceStatus({
      error: null,
      isLoading: false,
      success: "Resource deleted.",
    });
  }

  function getGameFormError(form: GameFormState) {
    if (!form.id || !form.name || !form.slug) {
      return "Game ID, name, and slug are required.";
    }

    return null;
  }

  function getGamePayload(form: GameFormState) {
    return {
      description: form.description.trim() || null,
      icon_url: form.icon_url.trim() || null,
      id: form.id.trim(),
      name: form.name.trim(),
      slug: form.slug.trim(),
    };
  }

  async function handleCreateGame(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) {
      setCreateGameStatus({
        error: "Supabase is not configured.",
        isLoading: false,
        success: null,
      });
      return;
    }

    const validationError = getGameFormError(createGameForm);

    if (validationError) {
      setCreateGameStatus({
        error: validationError,
        isLoading: false,
        success: null,
      });
      return;
    }

    setCreateGameStatus({ error: null, isLoading: true, success: null });

    const { error: createError } = await supabase
      .from("games")
      .insert(getGamePayload(createGameForm));

    if (createError) {
      setCreateGameStatus({
        error: createError.message,
        isLoading: false,
        success: null,
      });
      return;
    }

    await reloadAdminData();
    setCreateGameForm(emptyGameForm);
    setCreateGameStatus({
      error: null,
      isLoading: false,
      success: "Game created.",
    });
  }

  function startEditingGame(game: AdminGame) {
    setEditingGameId(game.id);
    setEditGameStatus({ error: null, isLoading: false, success: null });
    setEditGameForm({
      description: game.description ?? "",
      icon_url: game.icon_url ?? "",
      id: game.id,
      name: game.name,
      slug: game.slug,
    });
  }

  function stopEditingGame() {
    setEditingGameId(null);
    setEditGameForm(emptyGameForm);
    setEditGameStatus({ error: null, isLoading: false, success: null });
  }

  async function handleUpdateGame(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase || !editingGameId) {
      return;
    }

    const validationError = getGameFormError(editGameForm);

    if (validationError) {
      setEditGameStatus({
        error: validationError,
        isLoading: false,
        success: null,
      });
      return;
    }

    setEditGameStatus({ error: null, isLoading: true, success: null });

    const payload = getGamePayload(editGameForm);
    const { error: updateError } = await supabase
      .from("games")
      .update({
        description: payload.description,
        icon_url: payload.icon_url,
        name: payload.name,
        slug: payload.slug,
      })
      .eq("id", editingGameId);

    if (updateError) {
      setEditGameStatus({
        error: updateError.message,
        isLoading: false,
        success: null,
      });
      return;
    }

    await reloadAdminData();
    setEditingGameId(null);
    setEditGameStatus({
      error: null,
      isLoading: false,
      success: "Game updated.",
    });
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

    cachedAdminData = null;
    cachedAdminUser = null;
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
                {pageTitle}
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
            <AdminNavigation activeSection={section} />

            {resourcesSetupMessage ? (
              <Card className="border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-100">
                {resourcesSetupMessage}
              </Card>
            ) : null}

            <ViewTransition
              key={section}
              name="admin-section-content"
              enter={{
                "admin-section": "admin-section-enter",
                default: "none",
              }}
              exit={{
                "admin-section": "admin-section-exit",
                default: "none",
              }}
              default="none"
            >
              <div className="contents">
                {section === "overview" ? (
                  <AdminOverview
                    gamesCount={adminData.games.length}
                    resourcesCount={adminData.resources.length}
                    seasonsCount={adminData.seasons.length}
                  />
                ) : null}

                {section === "resources" ? (
                  <AdminResourcesSection
                    createForm={createResourceForm}
                    createStatus={createResourceStatus}
                    editForm={editResourceForm}
                    editStatus={editResourceStatus}
                    editingResourceId={editingResourceId}
                    gameNamesById={gameNamesById}
                    games={adminData.games}
                    onCancelEdit={stopEditingResource}
                    onCreateChange={setCreateResourceForm}
                    onCreateSubmit={handleCreateResource}
                    onDelete={handleDeleteResource}
                    onEditChange={setEditResourceForm}
                    onEditSubmit={handleUpdateResource}
                    onStartEdit={startEditingResource}
                    resources={adminData.resources}
                  />
                ) : null}

                {section === "games" ? (
                  <AdminGamesSection
                    createForm={createGameForm}
                    createStatus={createGameStatus}
                    editForm={editGameForm}
                    editStatus={editGameStatus}
                    editingGameId={editingGameId}
                    games={adminData.games}
                    onCancelEdit={stopEditingGame}
                    onCreateChange={setCreateGameForm}
                    onCreateSubmit={handleCreateGame}
                    onEditChange={setEditGameForm}
                    onEditSubmit={handleUpdateGame}
                    onStartEdit={startEditingGame}
                  />
                ) : null}

                {section === "seasons" ? (
                  <AdminSeasonsSection
                    createForm={createForm}
                    createStatus={createStatus}
                    editForm={editForm}
                    editStatus={editStatus}
                    editingSeasonId={editingSeasonId}
                    gameNamesById={gameNamesById}
                    games={adminData.games}
                    onCancelEdit={stopEditingSeason}
                    onCreateChange={setCreateForm}
                    onCreateSubmit={handleCreateSeason}
                    onEditChange={setEditForm}
                    onEditSubmit={handleUpdateSeason}
                    onStartEdit={startEditingSeason}
                    seasons={adminData.seasons}
                  />
                ) : null}
              </div>
            </ViewTransition>
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

function AdminNavigation({ activeSection }: { activeSection: AdminSection }) {
  return (
    <nav className="flex flex-wrap gap-3" aria-label="Admin sections">
      {[
        { href: "/admin", label: "Overview", section: "overview" },
        { href: "/admin/games", label: "Games", section: "games" },
        { href: "/admin/seasons", label: "Seasons", section: "seasons" },
        { href: "/admin/resources", label: "Resources", section: "resources" },
      ].map((item) => {
        const isActive = item.section === activeSection;

        return (
          <Link
            className={`rounded-md border px-4 py-2 text-sm transition ${
              isActive
                ? "border-violet-300/30 bg-violet-500/30 text-violet-100"
                : "border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
            }`}
            href={item.href}
            key={item.href}
            transitionTypes={["admin-section"]}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function AdminOverview({
  gamesCount,
  resourcesCount,
  seasonsCount,
}: {
  gamesCount: number;
  resourcesCount: number;
  seasonsCount: number;
}) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        <AdminStatCard label="Games" value={gamesCount} />
        <AdminStatCard label="Seasons" value={seasonsCount} />
        <AdminStatCard label="Resources" value={resourcesCount} />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <AdminSectionCard
          count={gamesCount}
          href="/admin/games"
          label="Manage games"
          summary="Create and edit game names, slugs, descriptions, and icons."
        />
        <AdminSectionCard
          count={seasonsCount}
          href="/admin/seasons"
          label="Manage seasons"
          summary="Create and edit season schedules, slugs, and descriptions."
        />
        <AdminSectionCard
          count={resourcesCount}
          href="/admin/resources"
          label="Manage resources"
          summary="Create and edit game detail community resource cards."
        />
      </div>
    </>
  );
}

function AdminSectionCard({
  count,
  href,
  label,
  summary,
}: {
  count: number;
  href: string;
  label: string;
  summary: string;
}) {
  return (
    <Card className="border-white/10 bg-[#10182b]/90 p-5 text-white shadow-xl shadow-black/15">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xl font-semibold">{label}</p>
          <p className="mt-2 text-sm leading-6 text-zinc-400">{summary}</p>
        </div>
        <p className="font-mono text-3xl font-semibold text-violet-100">
          {count}
        </p>
      </div>
      <Button
        asChild
        className="mt-5 border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
        variant="ghost"
      >
        <Link href={href} transitionTypes={["admin-section"]}>
          <Pencil className="size-3.5" aria-hidden="true" />
          Open section
        </Link>
      </Button>
    </Card>
  );
}

function AdminResourcesSection({
  createForm,
  createStatus,
  editForm,
  editStatus,
  editingResourceId,
  gameNamesById,
  games,
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
  createStatus: {
    error: string | null;
    isLoading: boolean;
    success: string | null;
  };
  editForm: ResourceFormState;
  editStatus: { error: string | null; isLoading: boolean; success: string | null };
  editingResourceId: string | null;
  gameNamesById: Map<string, string>;
  games: AdminGame[];
  onCancelEdit: () => void;
  onCreateChange: (form: ResourceFormState) => void;
  onCreateSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onDelete: (resource: AdminResource) => void;
  onEditChange: (form: ResourceFormState) => void;
  onEditSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onStartEdit: (resource: AdminResource) => void;
  resources: AdminResource[];
}) {
  return (
    <>
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <ResourceFormCard
          form={createForm}
          games={games}
          onChange={onCreateChange}
          onSubmit={onCreateSubmit}
          status={createStatus}
          submitLabel="Create resource"
          title="Create resource"
        />

        <Card className="border-white/10 bg-[#10182b]/90 text-white shadow-xl shadow-black/15">
          <CardHeader>
            <CardTitle className="font-mono text-xl">Edit resource</CardTitle>
          </CardHeader>
          <CardContent>
            {editingResourceId ? (
              <ResourceForm
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
                Select a resource below to edit it.
                {editStatus.success ? (
                  <p className="mt-3 text-emerald-200">{editStatus.success}</p>
                ) : null}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AdminListCard title="Resources">
        {resources.map((resource) => (
          <li
            className="rounded-lg border border-white/10 bg-white/[0.03] p-4"
            key={resource.id}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-white">{resource.title}</p>
                <p className="mt-1 text-sm text-zinc-400">
                  {gameNamesById.get(resource.game_id) ?? resource.game_id}
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
              {resource.label} / {resource.icon} - {resource.url}
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
      </AdminListCard>
    </>
  );
}

function AdminGamesSection({
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
  createStatus: {
    error: string | null;
    isLoading: boolean;
    success: string | null;
  };
  editForm: GameFormState;
  editStatus: { error: string | null; isLoading: boolean; success: string | null };
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

function AdminSeasonsSection({
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
  onEditChange,
  onEditSubmit,
  onStartEdit,
  seasons,
}: {
  createForm: SeasonFormState;
  createStatus: {
    error: string | null;
    isLoading: boolean;
    success: string | null;
  };
  editForm: SeasonFormState;
  editStatus: { error: string | null; isLoading: boolean; success: string | null };
  editingSeasonId: string | null;
  gameNamesById: Map<string, string>;
  games: AdminGame[];
  onCancelEdit: () => void;
  onCreateChange: (form: SeasonFormState) => void;
  onCreateSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onEditChange: (form: SeasonFormState) => void;
  onEditSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onStartEdit: (season: AdminSeason) => void;
  seasons: AdminSeason[];
}) {
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
                {editStatus.success ? (
                  <p className="mt-3 text-emerald-200">{editStatus.success}</p>
                ) : null}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AdminListCard title="Seasons">
        {seasons.map((season) => (
          <li
            className="rounded-lg border border-white/10 bg-white/[0.03] p-4"
            key={season.id}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-white">{season.name}</p>
                <p className="mt-1 text-sm text-zinc-400">
                  {gameNamesById.get(season.game_id) ?? season.game_id}
                </p>
              </div>
              <p className="font-mono text-xs text-zinc-500">
                {formatDate(season.starts_at)} - {formatDate(season.ends_at)}
              </p>
            </div>
            <Button
              className="mt-4 border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
              onClick={() => onStartEdit(season)}
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

function ResourceFormCard({
  form,
  games,
  onChange,
  onSubmit,
  status,
  submitLabel,
  title,
}: {
  form: ResourceFormState;
  games: AdminGame[];
  onChange: (form: ResourceFormState) => void;
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
        <ResourceForm
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

function ResourceForm({
  form,
  games,
  onCancel,
  onChange,
  onSubmit,
  status,
  submitLabel,
}: {
  form: ResourceFormState;
  games: AdminGame[];
  onCancel?: () => void;
  onChange: (form: ResourceFormState) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  status: { error: string | null; isLoading: boolean; success: string | null };
  submitLabel: string;
}) {
  const SubmitIcon = submitLabel.startsWith("Save") ? Save : Plus;

  function updateField(
    field: keyof ResourceFormState,
    value: boolean | string
  ) {
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

      <label className="block space-y-2">
        <span className="text-sm text-zinc-300">Resource ID</span>
        <Input
          className="h-11 border-white/10 bg-white/5 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-violet-400/70 focus-visible:ring-violet-400/20"
          disabled={status.isLoading || Boolean(onCancel)}
          onChange={(event) => updateField("id", event.target.value)}
          placeholder="diablo-4-official-forums"
          required
          value={form.id}
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm text-zinc-300">Title</span>
        <Input
          className="h-11 border-white/10 bg-white/5 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-violet-400/70 focus-visible:ring-violet-400/20"
          disabled={status.isLoading}
          onChange={(event) => updateField("title", event.target.value)}
          placeholder="Official Forums"
          required
          value={form.title}
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm text-zinc-300">Label</span>
          <Input
            className="h-11 border-white/10 bg-white/5 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-violet-400/70 focus-visible:ring-violet-400/20"
            disabled={status.isLoading}
            onChange={(event) => updateField("label", event.target.value)}
            placeholder="Forum"
            required
            value={form.label}
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm text-zinc-300">Icon</span>
          <select
            className={fieldClassName}
            disabled={status.isLoading}
            onChange={(event) => updateField("icon", event.target.value)}
            value={form.icon}
          >
            {["discord", "forum", "reddit", "social", "video"].map((icon) => (
              <option className={selectOptionClassName} key={icon} value={icon}>
                {icon}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block space-y-2">
        <span className="text-sm text-zinc-300">URL</span>
        <Input
          className="h-11 border-white/10 bg-white/5 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-violet-400/70 focus-visible:ring-violet-400/20"
          disabled={status.isLoading}
          onChange={(event) => updateField("url", event.target.value)}
          placeholder="https://example.com"
          required
          value={form.url}
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm text-zinc-300">Sort order</span>
          <Input
            className="h-11 border-white/10 bg-white/5 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-violet-400/70 focus-visible:ring-violet-400/20"
            disabled={status.isLoading}
            onChange={(event) => updateField("sort_order", event.target.value)}
            type="number"
            value={form.sort_order}
          />
        </label>

        <label className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-300">
          <input
            checked={form.is_active}
            className="size-4 accent-violet-500"
            disabled={status.isLoading}
            onChange={(event) =>
              updateField("is_active", event.target.checked)
            }
            type="checkbox"
          />
          Active on game detail page
        </label>
      </div>

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

function GameFormCard({
  form,
  onChange,
  onSubmit,
  status,
  submitLabel,
  title,
}: {
  form: GameFormState;
  onChange: (form: GameFormState) => void;
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
        <GameForm
          form={form}
          onChange={onChange}
          onSubmit={onSubmit}
          status={status}
          submitLabel={submitLabel}
        />
      </CardContent>
    </Card>
  );
}

function GameForm({
  form,
  onCancel,
  onChange,
  onSubmit,
  status,
  submitLabel,
}: {
  form: GameFormState;
  onCancel?: () => void;
  onChange: (form: GameFormState) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  status: { error: string | null; isLoading: boolean; success: string | null };
  submitLabel: string;
}) {
  const SubmitIcon = submitLabel.startsWith("Save") ? Save : Plus;

  function updateField(field: keyof GameFormState, value: string) {
    onChange({
      ...form,
      [field]: value,
    });
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm text-zinc-300">Game ID</span>
          <Input
            className="h-11 border-white/10 bg-white/5 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-violet-400/70 focus-visible:ring-violet-400/20"
            disabled={status.isLoading || Boolean(onCancel)}
            onChange={(event) => updateField("id", event.target.value)}
            placeholder="diablo-4"
            required
            value={form.id}
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm text-zinc-300">Slug</span>
          <Input
            className="h-11 border-white/10 bg-white/5 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-violet-400/70 focus-visible:ring-violet-400/20"
            disabled={status.isLoading}
            onChange={(event) => updateField("slug", event.target.value)}
            placeholder="diablo-4"
            required
            value={form.slug}
          />
        </label>
      </div>

      <label className="block space-y-2">
        <span className="text-sm text-zinc-300">Name</span>
        <Input
          className="h-11 border-white/10 bg-white/5 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-violet-400/70 focus-visible:ring-violet-400/20"
          disabled={status.isLoading}
          onChange={(event) => updateField("name", event.target.value)}
          placeholder="Diablo IV"
          required
          value={form.name}
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm text-zinc-300">Icon URL</span>
        <Input
          className="h-11 border-white/10 bg-white/5 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-violet-400/70 focus-visible:ring-violet-400/20"
          disabled={status.isLoading}
          onChange={(event) => updateField("icon_url", event.target.value)}
          placeholder="/images/d4-icon.jpg"
          value={form.icon_url}
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm text-zinc-300">Description</span>
        <textarea
          className={`${fieldClassName} min-h-24 resize-y py-2`}
          disabled={status.isLoading}
          onChange={(event) => updateField("description", event.target.value)}
          placeholder="Optional game description"
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

function isMissingGameResourcesTableError(
  error: { code?: string; message?: string } | null
) {
  return (
    error?.code === "PGRST205" ||
    Boolean(
      error?.message?.includes("game_resources") &&
        error.message.includes("schema cache")
    )
  );
}

function formatDate(value: string) {
  return value.slice(0, 10);
}

function toDateTimeLocalValue(value: string) {
  return value.slice(0, 16);
}

function toIsoDateTime(value: string) {
  return new Date(value).toISOString();
}
