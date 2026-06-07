"use client";

import { type FormEvent, useEffect, useMemo, useState, ViewTransition } from "react";
import { LockKeyhole } from "lucide-react";
import type { User } from "@supabase/supabase-js";

import { BackButton } from "@/src/components/back-button";
import { AdminNavigation } from "./admin-nav";
import { AdminOverview } from "./admin-overview";
import {
  emptyAdminData,
  emptyGameForm,
  emptyLeagueMatchupForm,
  emptyResourceForm,
  emptySeasonForm,
  emptyTimelineEventForm,
  missingLeagueMatchupsTableMessage,
  missingLeagueFeedbackTableMessage,
  missingResourcesTableMessage,
  missingTimelineEventsTableMessage,
  sessionCheckTimeoutMs,
} from "./constants";
import {
  isMissingLeagueMatchupsTableError,
  isMissingLeagueFeedbackTableError,
  isMissingGameResourcesTableError,
  isMissingTimelineEventsTableError,
  toDateTimeLocalValue,
  toIsoDateTime,
  toSlug,
} from "./helpers";
import { AdminGamesSection } from "./games/game-section";
import { AdminLeagueMatchupsSection } from "./league/league-matchup-section";
import { AdminResourcesSection } from "./resources/resource-section";
import { AdminSeasonsSection } from "./seasons/season-section";
import { AdminTimelineSection } from "./timeline/timeline-section";
import type {
  AdminData,
  AdminGame,
  AdminLeagueChampion,
  AdminLeagueMatchupFeedback,
  AdminLeagueMatchup,
  AdminResource,
  AdminSeason,
  AdminSection,
  AdminTimelineEvent,
  GameFormState,
  LeagueMatchupBatchPlanItem,
  LeagueMatchupFormState,
  LeagueMatchupQueueItemResult,
  ResourceFormState,
  SeasonFormState,
  TimelineEventFormState,
} from "./types";
import {
  deleteLeagueMatchupDraft,
  generateLeagueMatchupDraft,
} from "@/src/app/admin/league/matchups/actions";
import { SiteHeader } from "@/src/components/site-header";
import { Card } from "@/src/components/ui/card";
import { getChampionCombatProfile } from "@/src/features/league/champion-knowledge";
import {
  calculateLeagueMatchupConfidence,
  getLeagueMatchupConfidenceSourceFromNotes,
} from "@/src/features/league/matchup-confidence";
import { isAdminUser } from "@/src/lib/admin";
import { fetchUserProfile, getProfileDisplayName, type UserProfile } from "@/src/lib/profile";
import { supabase } from "@/src/lib/supabase";

type SessionResult = Awaited<ReturnType<NonNullable<typeof supabase>["auth"]["getSession"]>>;

const adminDataPageSize = 1000;
const leagueMatchupSelect = [
  "id",
  "champion_a_id",
  "champion_b_id",
  "role",
  "difficulty_rating",
  "confidence_level",
  "generation_status",
  "generated_at",
  "reviewed_at",
  "reviewed_by",
  "updated_at",
].join(", ");
const leagueMatchupDetailSelect = [
  leagueMatchupSelect,
  "admin_notes",
  "danger_windows",
  "early_game",
  "overview",
  "power_spikes",
  "trading_pattern",
  "win_conditions",
].join(", ");
const leagueMatchupRoleConflictTarget = "champion_a_id,champion_b_id,role";
const leagueFeedbackSelect = [
  "id",
  "matchup_id",
  "player_champion",
  "enemy_champion",
  "lane",
  "card_type",
  "feedback_type",
  "reason",
  "message",
  "user_id",
  "status",
  "created_at",
  "updated_at",
].join(", ");

function AdminDashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex gap-2 overflow-hidden rounded-lg border border-white/10 bg-[#10182b]/90 p-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div className="h-10 min-w-28 rounded-md bg-white/[0.04]" key={index} />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card
            className="h-28 border-white/10 bg-[#10182b]/90 shadow-xl shadow-black/15"
            key={index}
          />
        ))}
      </div>

      <section className="space-y-5">
        <div className="space-y-3">
          <div className="h-8 w-32 rounded bg-white/10" />
          <div className="h-4 w-full max-w-2xl rounded bg-white/5" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card
              className="h-40 border-white/10 bg-[#10182b]/90 shadow-xl shadow-black/15"
              key={index}
            />
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div className="space-y-3">
          <div className="h-8 w-28 rounded bg-white/10" />
          <div className="h-4 w-full max-w-xl rounded bg-white/5" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <Card
              className="h-36 border-white/10 bg-[#10182b]/90 shadow-xl shadow-black/15"
              key={index}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

let cachedAdminData: AdminData | null = null;
let cachedAdminProfile: UserProfile | null = null;
let cachedAdminUser: User | null = null;

export function AdminDashboard({ section }: { section: AdminSection }) {
  const [adminData, setAdminData] = useState<AdminData>(() => cachedAdminData ?? emptyAdminData);
  const [createResourceForm, setCreateResourceForm] =
    useState<ResourceFormState>(emptyResourceForm);
  const [createResourceStatus, setCreateResourceStatus] = useState<{
    error: string | null;
    isLoading: boolean;
    success: string | null;
  }>({ error: null, isLoading: false, success: null });
  const [createGameForm, setCreateGameForm] = useState<GameFormState>(emptyGameForm);
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
  const [editGameForm, setEditGameForm] = useState<GameFormState>(emptyGameForm);
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
  const [editResourceForm, setEditResourceForm] = useState<ResourceFormState>(emptyResourceForm);
  const [editingResourceId, setEditingResourceId] = useState<string | null>(null);
  const [editResourceStatus, setEditResourceStatus] = useState<{
    error: string | null;
    isLoading: boolean;
    success: string | null;
  }>({ error: null, isLoading: false, success: null });
  const [createTimelineForm, setCreateTimelineForm] =
    useState<TimelineEventFormState>(emptyTimelineEventForm);
  const [createTimelineStatus, setCreateTimelineStatus] = useState<{
    error: string | null;
    isLoading: boolean;
    success: string | null;
  }>({ error: null, isLoading: false, success: null });
  const [createLeagueMatchupForm, setCreateLeagueMatchupForm] =
    useState<LeagueMatchupFormState>(emptyLeagueMatchupForm);
  const [createLeagueMatchupStatus, setCreateLeagueMatchupStatus] = useState<{
    error: string | null;
    isLoading: boolean;
    success: string | null;
  }>({ error: null, isLoading: false, success: null });
  const [editTimelineForm, setEditTimelineForm] =
    useState<TimelineEventFormState>(emptyTimelineEventForm);
  const [editingTimelineEventId, setEditingTimelineEventId] = useState<string | null>(null);
  const [editTimelineStatus, setEditTimelineStatus] = useState<{
    error: string | null;
    isLoading: boolean;
    success: string | null;
  }>({ error: null, isLoading: false, success: null });
  const [editLeagueMatchupForm, setEditLeagueMatchupForm] =
    useState<LeagueMatchupFormState>(emptyLeagueMatchupForm);
  const [editingLeagueMatchupId, setEditingLeagueMatchupId] = useState<number | null>(null);
  const [editLeagueMatchupStatus, setEditLeagueMatchupStatus] = useState<{
    error: string | null;
    isLoading: boolean;
    success: string | null;
  }>({ error: null, isLoading: false, success: null });
  const [generatingLeagueMatchupId, setGeneratingLeagueMatchupId] = useState<number | null>(null);
  const [deletingLeagueMatchupDraftId, setDeletingLeagueMatchupDraftId] = useState<number | null>(
    null,
  );
  const [batchLeagueMatchupStatus, setBatchLeagueMatchupStatus] = useState<{
    error: string | null;
    isLoading: boolean;
    success: string | null;
  }>({ error: null, isLoading: false, success: null });
  const [batchLeagueMatchupProgress, setBatchLeagueMatchupProgress] = useState<{
    current: number;
    label: string;
    total: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(() => !cachedAdminData);
  const [profile, setProfile] = useState<UserProfile | null>(() => cachedAdminProfile);
  const [resourcesSetupMessage, setResourcesSetupMessage] = useState<string | null>(null);
  const [timelineSetupMessage, setTimelineSetupMessage] = useState<string | null>(null);
  const [leagueMatchupsSetupMessage, setLeagueMatchupsSetupMessage] = useState<string | null>(null);
  const [leagueFeedbackSetupMessage, setLeagueFeedbackSetupMessage] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(() => cachedAdminUser);
  const pageTitle =
    section === "games"
      ? "Game management"
      : section === "community"
        ? "Community management"
        : section === "league-matchups"
          ? "League matchup management"
          : section === "resources"
            ? "Resource management"
            : section === "seasons"
              ? "Season management"
              : section === "timeline"
                ? "Timeline management"
                : "Admin dashboard";
  const editableLinkSection = section === "community" ? "community" : "resources";

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

      const { data: sessionData, error: sessionError } = await getSessionWithTimeout();
      const sessionUser = sessionData.session?.user ?? null;

      if (!isMounted) {
        window.clearTimeout(redirectTimeoutId);
        return;
      }

      if (sessionError || !sessionUser) {
        window.location.replace("/login");
        return;
      }

      const hasAdminAccess = await isAdminUser(sessionUser);

      if (!isMounted) {
        window.clearTimeout(redirectTimeoutId);
        return;
      }

      if (!hasAdminAccess) {
        cachedAdminData = null;
        cachedAdminProfile = null;
        cachedAdminUser = null;
        window.location.replace("/");
        return;
      }

      window.clearTimeout(redirectTimeoutId);

      cachedAdminUser = sessionUser;
      setUser(sessionUser);
      const profileResult = await fetchUserProfile(sessionUser.id);

      if (!isMounted) {
        window.clearTimeout(redirectTimeoutId);
        return;
      }

      cachedAdminProfile = profileResult.data;
      setProfile(profileResult.data);

      const [
        gamesResult,
        resourcesResult,
        seasonsResult,
        timelineResult,
        leagueChampionsResult,
        leagueMatchupsResult,
        leagueFeedbackResult,
      ] = await Promise.all([
        supabase
          .from("games")
          .select("id, name, slug, description, icon_url, created_at")
          .order("name", { ascending: true }),
        supabase
          .from("game_resources")
          .select(
            "id, game_id, title, label, url, icon, sort_order, is_active, section, group_title",
          )
          .order("game_id", { ascending: true })
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: true }),
        supabase
          .from("seasons")
          .select("id, game_id, name, slug, starts_at, ends_at, description")
          .order("starts_at", { ascending: true }),
        supabase
          .from("timeline_events")
          .select("id, game_id, season_id, title, description, event_date, event_type, is_pinned")
          .order("game_id", { ascending: true })
          .order("is_pinned", { ascending: false })
          .order("event_date", { ascending: true })
          .order("created_at", { ascending: true }),
        supabase
          .from("league_champions")
          .select("id, name, title, image_url")
          .order("name", { ascending: true }),
        fetchAllLeagueMatchups(),
        fetchAllLeagueFeedback(),
      ]);

      if (!isMounted) {
        return;
      }

      const isMissingResourcesTable = isMissingGameResourcesTableError(resourcesResult.error);
      const isMissingTimelineTable = isMissingTimelineEventsTableError(timelineResult.error);
      const isMissingLeagueMatchupsTable = isMissingLeagueMatchupsTableError(
        leagueMatchupsResult.error,
      );
      const isMissingLeagueFeedbackTable = isMissingLeagueFeedbackTableError(
        leagueFeedbackResult.error,
      );

      if (
        gamesResult.error ||
        leagueChampionsResult.error ||
        seasonsResult.error ||
        (resourcesResult.error && !isMissingResourcesTable) ||
        (timelineResult.error && !isMissingTimelineTable) ||
        (leagueMatchupsResult.error && !isMissingLeagueMatchupsTable) ||
        (leagueFeedbackResult.error && !isMissingLeagueFeedbackTable)
      ) {
        setError(
          gamesResult.error?.message ??
            leagueChampionsResult.error?.message ??
            seasonsResult.error?.message ??
            (!isMissingResourcesTable ? resourcesResult.error?.message : null) ??
            (!isMissingTimelineTable ? timelineResult.error?.message : null) ??
            (!isMissingLeagueMatchupsTable ? leagueMatchupsResult.error?.message : null) ??
            (!isMissingLeagueFeedbackTable ? leagueFeedbackResult.error?.message : null) ??
            "Could not load admin data.",
        );
        setIsLoading(false);
        return;
      }

      setResourcesSetupMessage(isMissingResourcesTable ? missingResourcesTableMessage : null);
      setTimelineSetupMessage(isMissingTimelineTable ? missingTimelineEventsTableMessage : null);
      setLeagueMatchupsSetupMessage(
        isMissingLeagueMatchupsTable ? missingLeagueMatchupsTableMessage : null,
      );
      setLeagueFeedbackSetupMessage(
        isMissingLeagueFeedbackTable ? missingLeagueFeedbackTableMessage : null,
      );

      const nextAdminData = {
        games: (gamesResult.data ?? []) as AdminGame[],
        leagueChampions: (leagueChampionsResult.data ?? []) as AdminLeagueChampion[],
        leagueFeedback: isMissingLeagueFeedbackTable
          ? []
          : ((leagueFeedbackResult.data ?? []) as unknown as AdminLeagueMatchupFeedback[]),
        leagueMatchups: isMissingLeagueMatchupsTable
          ? []
          : ((leagueMatchupsResult.data ?? []) as AdminLeagueMatchup[]),
        resources: isMissingResourcesTable ? [] : ((resourcesResult.data ?? []) as AdminResource[]),
        seasons: (seasonsResult.data ?? []) as AdminSeason[],
        timelineEvents: isMissingTimelineTable
          ? []
          : ((timelineResult.data ?? []) as AdminTimelineEvent[]),
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
  }, []);

  const gameNamesById = useMemo(
    () => new Map(adminData.games.map((game) => [game.id, game.name] as const)),
    [adminData.games],
  );
  const resourcesRows = useMemo(
    () =>
      adminData.resources.filter((resource) => (resource.section ?? "community") === "resources"),
    [adminData.resources],
  );
  const communityRows = useMemo(
    () =>
      adminData.resources.filter((resource) => (resource.section ?? "community") === "community"),
    [adminData.resources],
  );
  const reviewedLeagueMatchupsCount = useMemo(
    () =>
      adminData.leagueMatchups.filter((matchup) => matchup.generation_status === "reviewed").length,
    [adminData.leagueMatchups],
  );
  const draftLeagueMatchupsCount = adminData.leagueMatchups.length - reviewedLeagueMatchupsCount;
  const normalizedCreateResourceForm = normalizeResourceFormForSection(
    createResourceForm,
    editableLinkSection,
  );
  const normalizedEditResourceForm = normalizeResourceFormForSection(
    editResourceForm,
    editableLinkSection,
  );

  async function reloadAdminData() {
    if (!supabase) {
      setError("Supabase is not configured.");
      return false;
    }

    const [
      gamesResult,
      resourcesResult,
      seasonsResult,
      timelineResult,
      leagueChampionsResult,
      leagueMatchupsResult,
      leagueFeedbackResult,
    ] = await Promise.all([
      supabase
        .from("games")
        .select("id, name, slug, description, icon_url, created_at")
        .order("name", { ascending: true }),
      supabase
        .from("game_resources")
        .select("id, game_id, title, label, url, icon, sort_order, is_active, section, group_title")
        .order("game_id", { ascending: true })
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }),
      supabase
        .from("seasons")
        .select("id, game_id, name, slug, starts_at, ends_at, description")
        .order("starts_at", { ascending: true }),
      supabase
        .from("timeline_events")
        .select("id, game_id, season_id, title, description, event_date, event_type, is_pinned")
        .order("game_id", { ascending: true })
        .order("is_pinned", { ascending: false })
        .order("event_date", { ascending: true })
        .order("created_at", { ascending: true }),
      supabase
        .from("league_champions")
        .select("id, name, title, image_url")
        .order("name", { ascending: true }),
      fetchAllLeagueMatchups(),
      fetchAllLeagueFeedback(),
    ]);

    const isMissingResourcesTable = isMissingGameResourcesTableError(resourcesResult.error);
    const isMissingTimelineTable = isMissingTimelineEventsTableError(timelineResult.error);
    const isMissingLeagueMatchupsTable = isMissingLeagueMatchupsTableError(
      leagueMatchupsResult.error,
    );
    const isMissingLeagueFeedbackTable = isMissingLeagueFeedbackTableError(
      leagueFeedbackResult.error,
    );

    if (
      gamesResult.error ||
      leagueChampionsResult.error ||
      seasonsResult.error ||
      (resourcesResult.error && !isMissingResourcesTable) ||
      (timelineResult.error && !isMissingTimelineTable) ||
      (leagueMatchupsResult.error && !isMissingLeagueMatchupsTable) ||
      (leagueFeedbackResult.error && !isMissingLeagueFeedbackTable)
    ) {
      setError(
        gamesResult.error?.message ??
          leagueChampionsResult.error?.message ??
          seasonsResult.error?.message ??
          (!isMissingResourcesTable ? resourcesResult.error?.message : null) ??
          (!isMissingTimelineTable ? timelineResult.error?.message : null) ??
          (!isMissingLeagueMatchupsTable ? leagueMatchupsResult.error?.message : null) ??
          (!isMissingLeagueFeedbackTable ? leagueFeedbackResult.error?.message : null) ??
          "Could not load admin data.",
      );
      return false;
    }

    setResourcesSetupMessage(isMissingResourcesTable ? missingResourcesTableMessage : null);
    setTimelineSetupMessage(isMissingTimelineTable ? missingTimelineEventsTableMessage : null);
    setLeagueMatchupsSetupMessage(
      isMissingLeagueMatchupsTable ? missingLeagueMatchupsTableMessage : null,
    );
    setLeagueFeedbackSetupMessage(
      isMissingLeagueFeedbackTable ? missingLeagueFeedbackTableMessage : null,
    );

    const nextAdminData = {
      games: (gamesResult.data ?? []) as AdminGame[],
      leagueChampions: (leagueChampionsResult.data ?? []) as AdminLeagueChampion[],
      leagueFeedback: isMissingLeagueFeedbackTable
        ? []
        : ((leagueFeedbackResult.data ?? []) as unknown as AdminLeagueMatchupFeedback[]),
      leagueMatchups: isMissingLeagueMatchupsTable
        ? []
        : ((leagueMatchupsResult.data ?? []) as AdminLeagueMatchup[]),
      resources: isMissingResourcesTable ? [] : ((resourcesResult.data ?? []) as AdminResource[]),
      seasons: (seasonsResult.data ?? []) as AdminSeason[],
      timelineEvents: isMissingTimelineTable
        ? []
        : ((timelineResult.data ?? []) as AdminTimelineEvent[]),
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

    if (form.section === "resources" && !form.group_title.trim()) {
      return "Resource group is required.";
    }

    return null;
  }

  function getResourcePayload(form: ResourceFormState) {
    return {
      game_id: form.game_id,
      group_title: form.section === "resources" ? form.group_title.trim() : null,
      icon: form.icon,
      id: form.id.trim(),
      is_active: form.is_active,
      label: form.label.trim(),
      section: form.section,
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

    const nextCreateResourceForm = {
      ...normalizeResourceFormForSection(createResourceForm, editableLinkSection),
    };
    const validationError = getResourceFormError(nextCreateResourceForm);

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
      .insert(getResourcePayload(nextCreateResourceForm));

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
      game_id: nextCreateResourceForm.game_id,
      icon: editableLinkSection === "community" ? "forum" : "builds",
      section: editableLinkSection,
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
      group_title: resource.group_title ?? "",
      icon: resource.icon,
      id: resource.id,
      is_active: resource.is_active,
      label: resource.label,
      section: resource.section ?? "community",
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

    const nextEditResourceForm = normalizeResourceFormForSection(
      editResourceForm,
      editableLinkSection,
    );
    const validationError = getResourceFormError(nextEditResourceForm);

    if (validationError) {
      setEditResourceStatus({
        error: validationError,
        isLoading: false,
        success: null,
      });
      return;
    }

    setEditResourceStatus({ error: null, isLoading: true, success: null });

    const payload = getResourcePayload(nextEditResourceForm);
    const { error: updateError } = await supabase
      .from("game_resources")
      .update({
        game_id: payload.game_id,
        group_title: payload.group_title,
        icon: payload.icon,
        is_active: payload.is_active,
        label: payload.label,
        section: payload.section,
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
    if (!supabase || !window.confirm(`Delete "${resource.title}" from game resources?`)) {
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

  function getTimelineFormError(form: TimelineEventFormState) {
    if (!form.game_id || !form.title.trim() || !form.event_date) {
      return "Game, title, and event date are required.";
    }

    return null;
  }

  function getTimelineEventPayload(form: TimelineEventFormState) {
    return {
      description: form.description.trim() || null,
      event_date: toIsoDateTime(form.event_date),
      event_type: form.event_type,
      game_id: form.game_id,
      is_pinned: form.is_pinned,
      season_id: form.season_id || null,
      title: form.title.trim(),
    };
  }

  function getTimelineEventId(form: TimelineEventFormState) {
    const datePart = form.event_date.slice(0, 10) || "event";
    const titlePart = toSlug(form.title) || "event";

    return `${form.game_id}-${datePart}-${titlePart}`;
  }

  async function handleCreateTimelineEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) {
      setCreateTimelineStatus({
        error: "Supabase is not configured.",
        isLoading: false,
        success: null,
      });
      return;
    }

    const validationError = getTimelineFormError(createTimelineForm);

    if (validationError) {
      setCreateTimelineStatus({
        error: validationError,
        isLoading: false,
        success: null,
      });
      return;
    }

    setCreateTimelineStatus({ error: null, isLoading: true, success: null });

    const { error: createError } = await supabase.from("timeline_events").insert({
      id: getTimelineEventId(createTimelineForm),
      ...getTimelineEventPayload(createTimelineForm),
    });

    if (createError) {
      setCreateTimelineStatus({
        error: createError.message,
        isLoading: false,
        success: null,
      });
      return;
    }

    await reloadAdminData();
    setCreateTimelineForm({
      ...emptyTimelineEventForm,
      game_id: createTimelineForm.game_id,
    });
    setCreateTimelineStatus({
      error: null,
      isLoading: false,
      success: "Timeline event created.",
    });
  }

  function startEditingTimelineEvent(event: AdminTimelineEvent) {
    setEditingTimelineEventId(event.id);
    setEditTimelineStatus({ error: null, isLoading: false, success: null });
    setEditTimelineForm({
      description: event.description ?? "",
      event_date: toDateTimeLocalValue(event.event_date),
      event_type: event.event_type,
      game_id: event.game_id,
      is_pinned: event.is_pinned,
      season_id: event.season_id ?? "",
      title: event.title,
    });
  }

  function stopEditingTimelineEvent() {
    setEditingTimelineEventId(null);
    setEditTimelineForm(emptyTimelineEventForm);
    setEditTimelineStatus({ error: null, isLoading: false, success: null });
  }

  async function handleUpdateTimelineEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase || !editingTimelineEventId) {
      return;
    }

    const validationError = getTimelineFormError(editTimelineForm);

    if (validationError) {
      setEditTimelineStatus({
        error: validationError,
        isLoading: false,
        success: null,
      });
      return;
    }

    setEditTimelineStatus({ error: null, isLoading: true, success: null });

    const { error: updateError } = await supabase
      .from("timeline_events")
      .update(getTimelineEventPayload(editTimelineForm))
      .eq("id", editingTimelineEventId);

    if (updateError) {
      setEditTimelineStatus({
        error: updateError.message,
        isLoading: false,
        success: null,
      });
      return;
    }

    await reloadAdminData();
    setEditingTimelineEventId(null);
    setEditTimelineStatus({
      error: null,
      isLoading: false,
      success: "Timeline event updated.",
    });
  }

  async function handleDeleteTimelineEvent(event: AdminTimelineEvent) {
    if (!supabase || !window.confirm(`Delete "${event.title}" from timeline events?`)) {
      return;
    }

    setEditTimelineStatus({ error: null, isLoading: true, success: null });

    const { error: deleteError } = await supabase
      .from("timeline_events")
      .delete()
      .eq("id", event.id);

    if (deleteError) {
      setEditTimelineStatus({
        error: deleteError.message,
        isLoading: false,
        success: null,
      });
      return;
    }

    if (editingTimelineEventId === event.id) {
      setEditingTimelineEventId(null);
      setEditTimelineForm(emptyTimelineEventForm);
    }

    await reloadAdminData();
    setEditTimelineStatus({
      error: null,
      isLoading: false,
      success: "Timeline event deleted.",
    });
  }

  function getLeagueMatchupFormError(form: LeagueMatchupFormState) {
    if (!form.champion_a_id || !form.champion_b_id || !form.role) {
      return "Champion A, champion B, and role are required.";
    }

    if (form.champion_a_id === form.champion_b_id) {
      return "Champion A and Champion B must be different.";
    }

    const difficultyRating = form.difficulty_rating.trim();

    if (difficultyRating) {
      const parsedRating = Number.parseInt(difficultyRating, 10);

      if (Number.isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
        return "Difficulty rating must be between 1 and 5.";
      }
    }

    return null;
  }

  function getLeagueMatchupPayload(form: LeagueMatchupFormState) {
    const difficultyRating = form.difficulty_rating.trim();

    return {
      admin_notes: form.admin_notes.trim() || null,
      champion_a_id: form.champion_a_id,
      champion_b_id: form.champion_b_id,
      confidence_level: form.confidence_level.trim() || null,
      danger_windows: form.danger_windows.trim() || null,
      difficulty_rating: difficultyRating ? Number.parseInt(difficultyRating, 10) : null,
      early_game: form.early_game.trim() || null,
      overview: form.overview.trim() || null,
      power_spikes: form.power_spikes.trim() || null,
      role: form.role,
      trading_pattern: form.trading_pattern.trim() || null,
      win_conditions: form.win_conditions.trim() || null,
    };
  }

  async function handleCreateLeagueMatchup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) {
      setCreateLeagueMatchupStatus({
        error: "Supabase is not configured.",
        isLoading: false,
        success: null,
      });
      return;
    }

    const validationError = getLeagueMatchupFormError(createLeagueMatchupForm);

    if (validationError) {
      setCreateLeagueMatchupStatus({
        error: validationError,
        isLoading: false,
        success: null,
      });
      return;
    }

    setCreateLeagueMatchupStatus({
      error: null,
      isLoading: true,
      success: null,
    });

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    const accessToken = sessionData.session?.access_token;

    if (sessionError || !accessToken) {
      setCreateLeagueMatchupStatus({
        error: sessionError?.message ?? "Admin session is not ready.",
        isLoading: false,
        success: null,
      });
      return;
    }

    const { data: existingMatchup, error: existingMatchupError } = await supabase
      .from("league_matchups")
      .select(leagueMatchupSelect)
      .eq("champion_a_id", createLeagueMatchupForm.champion_a_id)
      .eq("champion_b_id", createLeagueMatchupForm.champion_b_id)
      .eq("role", createLeagueMatchupForm.role)
      .maybeSingle<AdminLeagueMatchup>();

    if (existingMatchupError) {
      setCreateLeagueMatchupStatus({
        error: existingMatchupError.message,
        isLoading: false,
        success: null,
      });
      return;
    }

    if (existingMatchup && hasSavedLeagueMatchupDraftContent(existingMatchup)) {
      setCreateLeagueMatchupStatus({
        error:
          "This matchup already has saved guidance. Use the existing matchup row to regenerate or edit it.",
        isLoading: false,
        success: null,
      });
      return;
    }

    let matchupId = existingMatchup?.id ?? null;

    if (!matchupId) {
      const { data: createdMatchup, error: createError } = await supabase
        .from("league_matchups")
        .upsert(
          {
            champion_a_id: createLeagueMatchupForm.champion_a_id,
            champion_b_id: createLeagueMatchupForm.champion_b_id,
            role: createLeagueMatchupForm.role,
          },
          { onConflict: leagueMatchupRoleConflictTarget },
        )
        .select("id")
        .single<{ id: number }>();

      if (createError || !createdMatchup) {
        setCreateLeagueMatchupStatus({
          error: createError?.message ?? "League matchup could not be created.",
          isLoading: false,
          success: null,
        });
        return;
      }

      matchupId = createdMatchup.id;
    }

    setGeneratingLeagueMatchupId(matchupId);

    const result = await generateLeagueMatchupDraft({
      accessToken,
      matchupId,
    });

    if (!result.ok) {
      setGeneratingLeagueMatchupId(null);
      setCreateLeagueMatchupStatus({
        error: result.error,
        isLoading: false,
        success: null,
      });
      await reloadAdminData();
      return;
    }

    await reloadAdminData();
    setGeneratingLeagueMatchupId(null);
    setCreateLeagueMatchupForm({
      ...emptyLeagueMatchupForm,
      champion_a_id: createLeagueMatchupForm.champion_a_id,
      role: createLeagueMatchupForm.role,
    });
    setCreateLeagueMatchupStatus({
      error: null,
      isLoading: false,
      success: result.profileWarning
        ? `League matchup draft generated and saved with lower confidence. ${result.profileWarning}`
        : "League matchup draft generated and saved. Review before publishing.",
    });
  }

  async function startEditingLeagueMatchup(matchup: AdminLeagueMatchup) {
    setEditingLeagueMatchupId(matchup.id);
    setEditLeagueMatchupStatus({ error: null, isLoading: true, success: null });
    setEditLeagueMatchupForm({
      admin_notes: matchup.admin_notes ?? "",
      champion_a_id: matchup.champion_a_id,
      champion_b_id: matchup.champion_b_id,
      confidence_level: matchup.confidence_level ?? "",
      danger_windows: matchup.danger_windows ?? "",
      difficulty_rating: matchup.difficulty_rating ? String(matchup.difficulty_rating) : "",
      early_game: matchup.early_game ?? "",
      overview: matchup.overview ?? "",
      power_spikes: matchup.power_spikes ?? "",
      role: matchup.role,
      trading_pattern: matchup.trading_pattern ?? "",
      win_conditions: matchup.win_conditions ?? "",
    });

    if (!supabase) {
      setEditLeagueMatchupStatus({
        error: "Supabase is not configured.",
        isLoading: false,
        success: null,
      });
      return;
    }

    const { data, error } = await supabase
      .from("league_matchups")
      .select(leagueMatchupDetailSelect)
      .eq("id", matchup.id)
      .single<AdminLeagueMatchup>();

    if (error || !data) {
      setEditLeagueMatchupStatus({
        error: error?.message ?? "League matchup details could not be loaded.",
        isLoading: false,
        success: null,
      });
      return;
    }

    setEditLeagueMatchupForm({
      admin_notes: data.admin_notes ?? "",
      champion_a_id: data.champion_a_id,
      champion_b_id: data.champion_b_id,
      confidence_level: data.confidence_level ?? "",
      danger_windows: data.danger_windows ?? "",
      difficulty_rating: data.difficulty_rating ? String(data.difficulty_rating) : "",
      early_game: data.early_game ?? "",
      overview: data.overview ?? "",
      power_spikes: data.power_spikes ?? "",
      role: data.role,
      trading_pattern: data.trading_pattern ?? "",
      win_conditions: data.win_conditions ?? "",
    });
    setEditLeagueMatchupStatus({ error: null, isLoading: false, success: null });
  }

  function stopEditingLeagueMatchup() {
    setEditingLeagueMatchupId(null);
    setEditLeagueMatchupForm(emptyLeagueMatchupForm);
    setEditLeagueMatchupStatus({ error: null, isLoading: false, success: null });
  }

  async function handleUpdateLeagueMatchup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase || !editingLeagueMatchupId) {
      return;
    }

    const validationError = getLeagueMatchupFormError(editLeagueMatchupForm);

    if (validationError) {
      setEditLeagueMatchupStatus({
        error: validationError,
        isLoading: false,
        success: null,
      });
      return;
    }

    setEditLeagueMatchupStatus({ error: null, isLoading: true, success: null });

    const { error: updateError } = await supabase
      .from("league_matchups")
      .update(getLeagueMatchupPayload(editLeagueMatchupForm))
      .eq("id", editingLeagueMatchupId);

    if (updateError) {
      setEditLeagueMatchupStatus({
        error: updateError.message,
        isLoading: false,
        success: null,
      });
      return;
    }

    await reloadAdminData();
    setEditingLeagueMatchupId(null);
    setEditLeagueMatchupStatus({
      error: null,
      isLoading: false,
      success: "League matchup updated.",
    });
  }

  async function handleMarkLeagueMatchupReviewed(matchup: AdminLeagueMatchup) {
    if (!supabase) {
      setEditLeagueMatchupStatus({
        error: "Supabase is not configured.",
        isLoading: false,
        success: null,
      });
      return;
    }

    if (!user) {
      setEditLeagueMatchupStatus({
        error: "Admin session is not ready.",
        isLoading: false,
        success: null,
      });
      return;
    }

    setEditLeagueMatchupStatus({ error: null, isLoading: true, success: null });

    const { data: matchupDetails, error: matchupDetailsError } = await supabase
      .from("league_matchups")
      .select(leagueMatchupDetailSelect)
      .eq("id", matchup.id)
      .single<AdminLeagueMatchup>();

    if (matchupDetailsError || !matchupDetails) {
      setEditLeagueMatchupStatus({
        error: matchupDetailsError?.message ?? "League matchup details could not be loaded.",
        isLoading: false,
        success: null,
      });
      return;
    }

    const confidence = calculateAdminLeagueMatchupConfidence({
      ...matchupDetails,
      generation_status: "reviewed",
    });
    const { error: reviewError } = await supabase
      .from("league_matchups")
      .update({
        confidence_level: confidence.level,
        generation_status: "reviewed",
        reviewed_at: new Date().toISOString(),
        reviewed_by: user.id,
      })
      .eq("id", matchup.id);

    if (reviewError) {
      setEditLeagueMatchupStatus({
        error: reviewError.message,
        isLoading: false,
        success: null,
      });
      return;
    }

    logLeagueMatchupConfidenceCalculation(matchup.id, confidence);
    await reloadAdminData();
    setEditLeagueMatchupStatus({
      error: null,
      isLoading: false,
      success: "League matchup marked as reviewed.",
    });
  }

  async function handleMarkLeagueMatchupsReviewedForChampion(
    championName: string,
    matchupIds: number[],
  ) {
    const uniqueMatchupIds = Array.from(new Set(matchupIds));

    if (uniqueMatchupIds.length === 0) {
      return;
    }

    if (
      !window.confirm(
        `Approve all ${uniqueMatchupIds.length} draft matchup${
          uniqueMatchupIds.length === 1 ? "" : "s"
        } for ${championName}? These drafts will be marked as reviewed and published.`,
      )
    ) {
      return;
    }

    if (!supabase) {
      setEditLeagueMatchupStatus({
        error: "Supabase is not configured.",
        isLoading: false,
        success: null,
      });
      return;
    }

    if (!user) {
      setEditLeagueMatchupStatus({
        error: "Admin session is not ready.",
        isLoading: false,
        success: null,
      });
      return;
    }

    setEditLeagueMatchupStatus({ error: null, isLoading: true, success: null });
    const supabaseClient = supabase;

    const { data: draftMatchups, error: draftMatchupsError } = await supabaseClient
      .from("league_matchups")
      .select(leagueMatchupDetailSelect)
      .in("id", uniqueMatchupIds)
      .eq("generation_status", "draft");

    if (draftMatchupsError) {
      setEditLeagueMatchupStatus({
        error: draftMatchupsError.message,
        isLoading: false,
        success: null,
      });
      return;
    }

    const reviewedAt = new Date().toISOString();
    const reviewResults = await Promise.all(
      ((draftMatchups ?? []) as unknown as AdminLeagueMatchup[]).map((draftMatchup) => {
        const confidence = calculateAdminLeagueMatchupConfidence({
          ...draftMatchup,
          generation_status: "reviewed",
        });

        logLeagueMatchupConfidenceCalculation(draftMatchup.id, confidence);

        return supabaseClient
          .from("league_matchups")
          .update({
            confidence_level: confidence.level,
            generation_status: "reviewed",
            reviewed_at: reviewedAt,
            reviewed_by: user.id,
          })
          .eq("id", draftMatchup.id)
          .eq("generation_status", "draft");
      }),
    );
    const failedReview = reviewResults.find((result) => result.error);

    if (failedReview?.error) {
      setEditLeagueMatchupStatus({
        error: failedReview.error.message,
        isLoading: false,
        success: null,
      });
      await reloadAdminData();
      return;
    }

    await reloadAdminData();
    setEditLeagueMatchupStatus({
      error: null,
      isLoading: false,
      success: `${draftMatchups?.length ?? 0} ${championName} draft matchup${
        draftMatchups?.length === 1 ? "" : "s"
      } marked as reviewed.`,
    });
  }

  async function handleUpdateLeagueFeedbackStatus(
    feedback: AdminLeagueMatchupFeedback,
    status: AdminLeagueMatchupFeedback["status"],
  ) {
    if (!supabase) {
      setEditLeagueMatchupStatus({
        error: "Supabase is not configured.",
        isLoading: false,
        success: null,
      });
      return;
    }

    setEditLeagueMatchupStatus({ error: null, isLoading: true, success: null });

    const { error: updateError } = await supabase
      .from("matchup_feedback")
      .update({ status })
      .eq("id", feedback.id);

    if (updateError) {
      setEditLeagueMatchupStatus({
        error: updateError.message,
        isLoading: false,
        success: null,
      });
      return;
    }

    await reloadAdminData();
    setEditLeagueMatchupStatus({
      error: null,
      isLoading: false,
      success: `Feedback marked as ${status}.`,
    });
  }

  async function handleGenerateLeagueMatchupDraft(matchup: AdminLeagueMatchup) {
    if (!supabase) {
      setEditLeagueMatchupStatus({
        error: "Supabase is not configured.",
        isLoading: false,
        success: null,
      });
      return;
    }

    setGeneratingLeagueMatchupId(matchup.id);
    setEditLeagueMatchupStatus({
      error: null,
      isLoading: true,
      success: null,
    });

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    const accessToken = sessionData.session?.access_token;

    if (sessionError || !accessToken) {
      setGeneratingLeagueMatchupId(null);
      setEditLeagueMatchupStatus({
        error: sessionError?.message ?? "Admin session is not ready.",
        isLoading: false,
        success: null,
      });
      return;
    }

    const result = await generateLeagueMatchupDraft({
      accessToken,
      matchupId: matchup.id,
    });

    if (!result.ok) {
      setGeneratingLeagueMatchupId(null);
      setEditLeagueMatchupStatus({
        error: result.error,
        isLoading: false,
        success: null,
      });
      return;
    }

    await reloadAdminData();

    if (editingLeagueMatchupId === matchup.id) {
      setEditLeagueMatchupForm({
        ...editLeagueMatchupForm,
        ...normalizeDraftForForm(result.draft),
      });
    }

    setGeneratingLeagueMatchupId(null);
    setEditLeagueMatchupStatus({
      error: null,
      isLoading: false,
      success: result.profileWarning
        ? `League matchup draft generated and saved with lower confidence. ${result.profileWarning}`
        : "League matchup draft generated and saved. Review before publishing.",
    });
  }

  async function handleDeleteLeagueMatchupDraft(matchup: AdminLeagueMatchup) {
    const matchupLabel = getLeagueMatchupLabel(matchup, adminData.leagueChampions);

    if (
      !window.confirm(
        `Delete the saved AI draft for ${matchupLabel}? The matchup row and admin notes will remain.`,
      )
    ) {
      return;
    }

    if (!supabase) {
      setEditLeagueMatchupStatus({
        error: "Supabase is not configured.",
        isLoading: false,
        success: null,
      });
      return;
    }

    setDeletingLeagueMatchupDraftId(matchup.id);
    setEditLeagueMatchupStatus({
      error: null,
      isLoading: true,
      success: null,
    });

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    const accessToken = sessionData.session?.access_token;

    if (sessionError || !accessToken) {
      setDeletingLeagueMatchupDraftId(null);
      setEditLeagueMatchupStatus({
        error: sessionError?.message ?? "Admin session is not ready.",
        isLoading: false,
        success: null,
      });
      return;
    }

    const result = await deleteLeagueMatchupDraft({
      accessToken,
      matchupId: matchup.id,
    });

    if (!result.ok) {
      setDeletingLeagueMatchupDraftId(null);
      setEditLeagueMatchupStatus({
        error: result.error,
        isLoading: false,
        success: null,
      });
      return;
    }

    await reloadAdminData();

    if (editingLeagueMatchupId === matchup.id) {
      setEditLeagueMatchupForm({
        ...editLeagueMatchupForm,
        ...normalizeDraftForForm({
          danger_windows: "",
          early_game: "",
          overview: "",
          power_spikes: "",
          trading_pattern: "",
          win_conditions: "",
        }),
      });
    }

    setDeletingLeagueMatchupDraftId(null);
    setEditLeagueMatchupStatus({
      error: null,
      isLoading: false,
      success: "League matchup draft deleted.",
    });
  }

  async function handleGenerateLeagueMatchupBatch(items: LeagueMatchupBatchPlanItem[]) {
    if (!supabase) {
      setBatchLeagueMatchupStatus({
        error: "Supabase is not configured.",
        isLoading: false,
        success: null,
      });
      return;
    }

    if (items.length === 0) {
      setBatchLeagueMatchupStatus({
        error: "Select at least one matchup to generate.",
        isLoading: false,
        success: null,
      });
      return;
    }

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    const accessToken = sessionData.session?.access_token;

    if (sessionError || !accessToken) {
      setBatchLeagueMatchupStatus({
        error: sessionError?.message ?? "Admin session is not ready.",
        isLoading: false,
        success: null,
      });
      return;
    }

    setBatchLeagueMatchupStatus({
      error: null,
      isLoading: true,
      success: null,
    });
    setBatchLeagueMatchupProgress({
      current: 0,
      label: "Preparing batch",
      total: items.length,
    });

    let generatedCount = 0;
    let profileWarningCount = 0;

    for (const [index, item] of items.entries()) {
      const matchupLabel = getLeagueMatchupPlanLabel(item, adminData.leagueChampions);
      setBatchLeagueMatchupProgress({
        current: index,
        label: `Generating ${matchupLabel}`,
        total: items.length,
      });

      let matchupId = item.existingMatchupId;

      if (!matchupId) {
        const { data: createdMatchup, error: createError } = await supabase
          .from("league_matchups")
          .upsert(
            {
              champion_a_id: item.championAId,
              champion_b_id: item.championBId,
              role: item.role,
            },
            { onConflict: leagueMatchupRoleConflictTarget },
          )
          .select("id")
          .single<{ id: number }>();

        if (createError || !createdMatchup) {
          setBatchLeagueMatchupStatus({
            error: createError?.message ?? `Could not create ${matchupLabel}.`,
            isLoading: false,
            success: null,
          });
          setBatchLeagueMatchupProgress(null);
          await reloadAdminData();
          return;
        }

        matchupId = createdMatchup.id;
      }

      const result = await generateLeagueMatchupDraft({
        accessToken,
        matchupId,
      });

      if (!result.ok) {
        setBatchLeagueMatchupStatus({
          error: result.error,
          isLoading: false,
          success: null,
        });
        setBatchLeagueMatchupProgress(null);
        await reloadAdminData();
        return;
      }

      generatedCount += 1;
      if (result.profileWarning) {
        profileWarningCount += 1;
      }
      setBatchLeagueMatchupProgress({
        current: index + 1,
        label: `Generated ${matchupLabel}`,
        total: items.length,
      });
    }

    await reloadAdminData();
    setBatchLeagueMatchupProgress(null);
    setBatchLeagueMatchupStatus({
      error: null,
      isLoading: false,
      success: `${generatedCount} matchup draft${
        generatedCount === 1 ? "" : "s"
      } generated and saved.${
        profileWarningCount > 0
          ? ` ${profileWarningCount} used lower confidence because a combat profile was missing.`
          : " Review before publishing."
      }`,
    });
  }

  async function handleGenerateLeagueMatchupQueueItem(
    item: LeagueMatchupBatchPlanItem,
  ): Promise<LeagueMatchupQueueItemResult> {
    if (!supabase) {
      return {
        error: "Supabase is not configured.",
        ok: false,
      };
    }

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    const accessToken = sessionData.session?.access_token;

    if (sessionError || !accessToken) {
      return {
        error: sessionError?.message ?? "Admin session is not ready.",
        ok: false,
      };
    }

    const matchupLabel = getLeagueMatchupPlanLabel(item, adminData.leagueChampions);
    let matchupId = item.existingMatchupId;

    if (!matchupId) {
      const { data: existingMatchup, error: existingMatchupError } = await supabase
        .from("league_matchups")
        .select(leagueMatchupSelect)
        .eq("champion_a_id", item.championAId)
        .eq("champion_b_id", item.championBId)
        .eq("role", item.role)
        .maybeSingle<AdminLeagueMatchup>();

      if (existingMatchupError) {
        return {
          error: `Could not verify existing row for ${matchupLabel}: ${existingMatchupError.message}`,
          ok: false,
        };
      }

      matchupId = existingMatchup?.id ?? null;

      if (existingMatchup && hasSavedLeagueMatchupDraftContent(existingMatchup)) {
        const refreshOk = await reloadAdminData();

        return {
          matchupId: existingMatchup.id,
          ok: true,
          profileWarning: refreshOk
            ? undefined
            : "Existing saved draft was confirmed, but the admin list could not refresh.",
          skipped: true,
        };
      }
    }

    if (!matchupId) {
      const { data: createdMatchup, error: createError } = await supabase
        .from("league_matchups")
        .upsert(
          {
            champion_a_id: item.championAId,
            champion_b_id: item.championBId,
            role: item.role,
          },
          { onConflict: leagueMatchupRoleConflictTarget },
        )
        .select(leagueMatchupSelect)
        .single<AdminLeagueMatchup>();

      if (createError || !createdMatchup) {
        return {
          error: createError?.message ?? `Could not create matchup row for ${matchupLabel}.`,
          ok: false,
        };
      }

      matchupId = createdMatchup.id;
    }

    const result = await generateLeagueMatchupDraft({
      accessToken,
      matchupId,
    });

    if (!result.ok) {
      return {
        error: `Could not save generated draft for ${matchupLabel}: ${result.error}`,
        ok: false,
      };
    }

    const { data: savedMatchup, error: savedMatchupError } = await supabase
      .from("league_matchups")
      .select(leagueMatchupSelect)
      .eq("id", matchupId)
      .maybeSingle<AdminLeagueMatchup>();

    if (savedMatchupError || !savedMatchup) {
      return {
        error:
          savedMatchupError?.message ??
          `Generated draft for ${matchupLabel} could not be verified after save.`,
        ok: false,
      };
    }

    if (!hasSavedLeagueMatchupDraftContent(savedMatchup)) {
      return {
        error: `Generated draft for ${matchupLabel} saved without matchup guidance content.`,
        ok: false,
      };
    }

    const refreshOk = await reloadAdminData();
    const refreshWarning = refreshOk
      ? undefined
      : "Draft saved, but the admin matchup list could not refresh.";
    const profileWarning = [result.profileWarning, refreshWarning].filter(Boolean).join(" ");

    return {
      matchupId,
      ok: true,
      profileWarning: profileWarning || undefined,
    };
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

  async function handleDeleteSeason(season: AdminSeason) {
    if (!supabase || !window.confirm(`Delete "${season.name}" from seasons?`)) {
      return;
    }

    setEditStatus({ error: null, isLoading: true, success: null });

    const { error: deleteError } = await supabase.from("seasons").delete().eq("id", season.id);

    if (deleteError) {
      setEditStatus({
        error: deleteError.message,
        isLoading: false,
        success: null,
      });
      return;
    }

    if (editingSeasonId === season.id) {
      setEditingSeasonId(null);
      setEditForm(emptySeasonForm);
    }

    await reloadAdminData();
    setEditStatus({
      error: null,
      isLoading: false,
      success: "Season deleted.",
    });
  }

  return (
    <main className="min-h-screen bg-[#050b18] px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-6">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 lg:ml-72 lg:max-w-[calc(100%-18rem)]">
        <SiteHeader />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <BackButton href="/" label="Back to dashboard" />
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
                {user ? getProfileDisplayName(user, profile) : "Checking admin session..."}
              </p>
            </div>
          </div>
        </div>

        {isLoading ? <AdminDashboardSkeleton /> : null}

        {error && !isLoading ? (
          <Card className="border-rose-400/20 bg-[#10182b]/90 p-8 text-rose-100">{error}</Card>
        ) : null}

        {!isLoading && !error ? (
          <>
            <AdminNavigation activeSection={section} />

            {resourcesSetupMessage ? (
              <Card className="border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-100">
                {resourcesSetupMessage}
              </Card>
            ) : null}

            {timelineSetupMessage ? (
              <Card className="border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-100">
                {timelineSetupMessage}
              </Card>
            ) : null}

            {leagueMatchupsSetupMessage ? (
              <Card className="border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-100">
                {leagueMatchupsSetupMessage}
              </Card>
            ) : null}

            {leagueFeedbackSetupMessage ? (
              <Card className="border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-100">
                {leagueFeedbackSetupMessage}
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
                    communityContentCount={communityRows.length}
                    gamesCount={adminData.games.length}
                    leagueChampionsCount={adminData.leagueChampions.length}
                    leagueDraftMatchupsCount={draftLeagueMatchupsCount}
                    leagueMatchupsCount={adminData.leagueMatchups.length}
                    leagueReviewedMatchupsCount={reviewedLeagueMatchupsCount}
                    resourcesCount={resourcesRows.length}
                    seasonsCount={adminData.seasons.length}
                    timelineEventsCount={adminData.timelineEvents.length}
                  />
                ) : null}

                {section === "resources" || section === "community" ? (
                  <AdminResourcesSection
                    createForm={normalizedCreateResourceForm}
                    createStatus={createResourceStatus}
                    editForm={normalizedEditResourceForm}
                    editStatus={editResourceStatus}
                    editingResourceId={editingResourceId}
                    gameNamesById={gameNamesById}
                    games={adminData.games}
                    mode={editableLinkSection}
                    onCancelEdit={stopEditingResource}
                    onCreateChange={setCreateResourceForm}
                    onCreateSubmit={handleCreateResource}
                    onDelete={handleDeleteResource}
                    onEditChange={setEditResourceForm}
                    onEditSubmit={handleUpdateResource}
                    onStartEdit={startEditingResource}
                    resources={editableLinkSection === "community" ? communityRows : resourcesRows}
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
                    onDelete={handleDeleteSeason}
                    onEditChange={setEditForm}
                    onEditSubmit={handleUpdateSeason}
                    onStartEdit={startEditingSeason}
                    seasons={adminData.seasons}
                  />
                ) : null}

                {section === "timeline" ? (
                  <AdminTimelineSection
                    createForm={createTimelineForm}
                    createStatus={createTimelineStatus}
                    editForm={editTimelineForm}
                    editStatus={editTimelineStatus}
                    editingEventId={editingTimelineEventId}
                    gameNamesById={gameNamesById}
                    games={adminData.games}
                    onCancelEdit={stopEditingTimelineEvent}
                    onCreateChange={setCreateTimelineForm}
                    onCreateSubmit={handleCreateTimelineEvent}
                    onDelete={handleDeleteTimelineEvent}
                    onEditChange={setEditTimelineForm}
                    onEditSubmit={handleUpdateTimelineEvent}
                    onStartEdit={startEditingTimelineEvent}
                    seasons={adminData.seasons}
                    timelineEvents={adminData.timelineEvents}
                  />
                ) : null}

                {section === "league-matchups" ? (
                  <AdminLeagueMatchupsSection
                    champions={adminData.leagueChampions}
                    createForm={createLeagueMatchupForm}
                    createStatus={createLeagueMatchupStatus}
                    editForm={editLeagueMatchupForm}
                    editStatus={editLeagueMatchupStatus}
                    editingMatchupId={editingLeagueMatchupId}
                    deletingDraftMatchupId={deletingLeagueMatchupDraftId}
                    batchProgress={batchLeagueMatchupProgress}
                    batchStatus={batchLeagueMatchupStatus}
                    matchups={adminData.leagueMatchups}
                    feedback={adminData.leagueFeedback}
                    onCancelEdit={stopEditingLeagueMatchup}
                    onCreateChange={setCreateLeagueMatchupForm}
                    onCreateSubmit={handleCreateLeagueMatchup}
                    onEditChange={setEditLeagueMatchupForm}
                    onEditSubmit={handleUpdateLeagueMatchup}
                    onDeleteDraft={handleDeleteLeagueMatchupDraft}
                    onGenerateBatch={handleGenerateLeagueMatchupBatch}
                    onGenerateDraft={handleGenerateLeagueMatchupDraft}
                    onGenerateQueueItem={handleGenerateLeagueMatchupQueueItem}
                    onRefresh={reloadAdminData}
                    onMarkReviewed={handleMarkLeagueMatchupReviewed}
                    onMarkReviewedForChampion={handleMarkLeagueMatchupsReviewedForChampion}
                    onUpdateFeedbackStatus={handleUpdateLeagueFeedbackStatus}
                    onStartEdit={startEditingLeagueMatchup}
                    generatingMatchupId={generatingLeagueMatchupId}
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

async function fetchAllLeagueMatchups() {
  if (!supabase) {
    return {
      data: null,
      error: { message: "Supabase is not configured." },
    };
  }

  const rows: AdminLeagueMatchup[] = [];

  for (let page = 0; ; page += 1) {
    const from = page * adminDataPageSize;
    const to = from + adminDataPageSize - 1;
    const { data, error } = await supabase
      .from("league_matchups")
      .select(leagueMatchupSelect)
      .order("champion_a_id", { ascending: true })
      .order("champion_b_id", { ascending: true })
      .order("role", { ascending: true })
      .range(from, to);

    if (error) {
      return { data: null, error };
    }

    const pageRows = (data ?? []) as unknown as AdminLeagueMatchup[];

    rows.push(...pageRows);

    if (pageRows.length < adminDataPageSize) {
      return { data: rows, error: null };
    }
  }
}

async function fetchAllLeagueFeedback() {
  if (!supabase) {
    return {
      data: null,
      error: { message: "Supabase is not configured." },
    };
  }

  const { data, error } = await supabase
    .from("matchup_feedback")
    .select(leagueFeedbackSelect)
    .order("created_at", { ascending: false })
    .limit(1000);

  return { data, error };
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

function normalizeResourceFormForSection(
  form: ResourceFormState,
  section: ResourceFormState["section"],
): ResourceFormState {
  const iconOptions =
    section === "community"
      ? ["discord", "forum", "reddit", "social", "video"]
      : ["builds", "official", "patch-notes", "stats", "tier-list", "tools", "trade", "wiki"];

  return {
    ...form,
    group_title: section === "community" ? "" : form.group_title,
    icon: iconOptions.includes(form.icon) ? form.icon : iconOptions[0],
    section,
  };
}

function normalizeDraftForForm(
  draft: Pick<
    AdminLeagueMatchup,
    | "danger_windows"
    | "early_game"
    | "overview"
    | "power_spikes"
    | "trading_pattern"
    | "win_conditions"
  >,
): Pick<
  LeagueMatchupFormState,
  | "danger_windows"
  | "early_game"
  | "overview"
  | "power_spikes"
  | "trading_pattern"
  | "win_conditions"
> {
  return {
    danger_windows: draft.danger_windows ?? "",
    early_game: draft.early_game ?? "",
    overview: draft.overview ?? "",
    power_spikes: draft.power_spikes ?? "",
    trading_pattern: draft.trading_pattern ?? "",
    win_conditions: draft.win_conditions ?? "",
  };
}

function getDraftSectionsFromAdminLeagueMatchup(
  matchup: Pick<
    AdminLeagueMatchup,
    | "danger_windows"
    | "early_game"
    | "overview"
    | "power_spikes"
    | "trading_pattern"
    | "win_conditions"
  >,
) {
  return normalizeDraftForForm(matchup);
}

function calculateAdminLeagueMatchupConfidence(matchup: AdminLeagueMatchup) {
  return calculateLeagueMatchupConfidence({
    championAName: matchup.champion_a_id,
    championAProfile: getChampionCombatProfile(matchup.champion_a_id),
    championBName: matchup.champion_b_id,
    championBProfile: getChampionCombatProfile(matchup.champion_b_id),
    draft: getDraftSectionsFromAdminLeagueMatchup(matchup),
    generationSource: getLeagueMatchupConfidenceSourceFromNotes(matchup.admin_notes),
    generationStatus: matchup.generation_status,
  });
}

function logLeagueMatchupConfidenceCalculation(
  matchupId: number,
  confidence: ReturnType<typeof calculateLeagueMatchupConfidence>,
) {
  console.info("League matchup confidence calculation", {
    confidence: confidence.level,
    matchupId,
    reasons: confidence.reasons,
  });
}

function hasSavedLeagueMatchupDraftContent(
  matchup: Pick<
    AdminLeagueMatchup,
    | "generated_at"
    | "generation_status"
    | "danger_windows"
    | "early_game"
    | "overview"
    | "power_spikes"
    | "trading_pattern"
    | "win_conditions"
  >,
) {
  return (
    Boolean(matchup.generated_at) ||
    matchup.generation_status === "reviewed" ||
    [
      matchup.overview,
      matchup.early_game,
      matchup.trading_pattern,
      matchup.power_spikes,
      matchup.danger_windows,
      matchup.win_conditions,
    ].some((value) => Boolean(value?.trim()))
  );
}

function getLeagueMatchupPlanLabel(
  item: LeagueMatchupBatchPlanItem,
  champions: AdminLeagueChampion[],
) {
  const championNamesById = new Map(
    champions.map((champion) => [champion.id, champion.name] as const),
  );

  return `${
    championNamesById.get(item.championAId) ?? item.championAId
  } vs ${championNamesById.get(item.championBId) ?? item.championBId} (${getAdminLeagueRoleLabel(
    item.role,
  )})`;
}

function getLeagueMatchupLabel(matchup: AdminLeagueMatchup, champions: AdminLeagueChampion[]) {
  const championNamesById = new Map(
    champions.map((champion) => [champion.id, champion.name] as const),
  );

  return `${
    championNamesById.get(matchup.champion_a_id) ?? matchup.champion_a_id
  } vs ${championNamesById.get(matchup.champion_b_id) ?? matchup.champion_b_id}`;
}

function getAdminLeagueRoleLabel(role: AdminLeagueMatchup["role"]) {
  return role === "adc" ? "ADC" : role.charAt(0).toUpperCase() + role.slice(1);
}
