import type {
  AdminData,
  GameFormState,
  LeagueMatchupFormState,
  ResourceFormState,
  SeasonFormState,
  TimelineEventFormState,
} from "./types";

export const sessionCheckTimeoutMs = 2_000;

export const emptyGameForm: GameFormState = {
  description: "",
  icon_url: "",
  id: "",
  name: "",
  slug: "",
};

export const emptySeasonForm: SeasonFormState = {
  description: "",
  ends_at: "",
  game_id: "",
  name: "",
  slug: "",
  starts_at: "",
};

export const emptyResourceForm: ResourceFormState = {
  game_id: "",
  group_title: "",
  icon: "builds",
  id: "",
  is_active: true,
  label: "",
  section: "resources",
  sort_order: "0",
  title: "",
  url: "",
};

export const emptyTimelineEventForm: TimelineEventFormState = {
  description: "",
  event_date: "",
  event_type: "event",
  game_id: "",
  is_pinned: false,
  season_id: "",
  title: "",
};

export const emptyLeagueMatchupForm: LeagueMatchupFormState = {
  admin_notes: "",
  champion_a_id: "",
  champion_b_id: "",
  confidence_level: "",
  danger_windows: "",
  difficulty_rating: "",
  early_game: "",
  overview: "",
  power_spikes: "",
  role: "mid",
  trading_pattern: "",
  win_conditions: "",
};

export const emptyAdminData: AdminData = {
  games: [],
  leagueChampions: [],
  leagueMatchups: [],
  resources: [],
  seasons: [],
  timelineEvents: [],
};

export const missingResourcesTableMessage =
  "Game detail resources are not fully set up in Supabase yet. Apply the latest game_resources migration to enable the Resources and Community admin pages.";
export const missingTimelineEventsTableMessage =
  "Timeline events are not set up in Supabase yet. Apply the timeline_events migration to enable the Timeline admin page.";
export const missingLeagueMatchupsTableMessage =
  "League matchup management is not fully set up in Supabase yet. Apply the latest league_matchups migration to enable this admin page.";

export const fieldClassName =
  "w-full rounded-lg border border-white/10 bg-[#111a2c] px-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-500 focus-visible:border-violet-400/70 focus-visible:ring-3 focus-visible:ring-violet-400/20 disabled:cursor-not-allowed disabled:opacity-50";
export const selectOptionClassName = "bg-[#10182b] text-zinc-100";
