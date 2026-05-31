export type AdminGame = {
  created_at: string;
  description: string | null;
  icon_url: string | null;
  id: string;
  name: string;
  slug: string;
};

export type AdminSeason = {
  description: string | null;
  ends_at: string;
  game_id: string;
  id: string;
  name: string;
  slug: string;
  starts_at: string;
};

export type AdminResource = {
  game_id: string;
  group_title: string | null;
  icon: string;
  id: string;
  is_active: boolean;
  label: string;
  section: "community" | "resources";
  sort_order: number;
  title: string;
  url: string;
};

export type AdminTimelineEvent = {
  description: string | null;
  event_date: string;
  event_type: string;
  game_id: string;
  id: string;
  is_pinned: boolean;
  season_id: string | null;
  title: string;
};

export type AdminLeagueChampion = {
  id: string;
  image_url: string;
  name: string;
  title: string;
};

export type AdminLeagueMatchup = {
  admin_notes: string | null;
  champion_a_id: string;
  champion_b_id: string;
  confidence_level: string | null;
  danger_windows: string | null;
  difficulty_rating: number | null;
  early_game: string | null;
  generated_at: string | null;
  generation_status: "draft" | "reviewed";
  id: number;
  overview: string | null;
  power_spikes: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
  role: "mid" | "top" | "jungle" | "adc" | "support";
  trading_pattern: string | null;
  updated_at: string | null;
  win_conditions: string | null;
};

export type LeagueMatchupBatchPlanItem = {
  championAId: string;
  championBId: string;
  existingMatchupId: number | null;
  role: AdminLeagueMatchup["role"];
};

export type LeagueMatchupQueueItemResult =
  | {
      matchupId: number;
      ok: true;
      profileWarning?: string;
      skipped?: boolean;
    }
  | {
      error: string;
      ok: false;
    };

export type AdminData = {
  games: AdminGame[];
  leagueChampions: AdminLeagueChampion[];
  leagueMatchups: AdminLeagueMatchup[];
  resources: AdminResource[];
  seasons: AdminSeason[];
  timelineEvents: AdminTimelineEvent[];
};

export type AdminSection =
  | "community"
  | "games"
  | "league-matchups"
  | "overview"
  | "resources"
  | "seasons"
  | "timeline";

export type ResourceFormState = {
  game_id: string;
  group_title: string;
  icon: string;
  id: string;
  is_active: boolean;
  label: string;
  section: "community" | "resources";
  sort_order: string;
  title: string;
  url: string;
};

export type GameFormState = {
  description: string;
  icon_url: string;
  id: string;
  name: string;
  slug: string;
};

export type SeasonFormState = {
  description: string;
  ends_at: string;
  game_id: string;
  name: string;
  slug: string;
  starts_at: string;
};

export type TimelineEventFormState = {
  description: string;
  event_date: string;
  event_type: string;
  game_id: string;
  is_pinned: boolean;
  season_id: string;
  title: string;
};

export type LeagueMatchupFormState = {
  admin_notes: string;
  champion_a_id: string;
  champion_b_id: string;
  confidence_level: string;
  danger_windows: string;
  difficulty_rating: string;
  early_game: string;
  overview: string;
  power_spikes: string;
  role: "mid" | "top" | "jungle" | "adc" | "support";
  trading_pattern: string;
  win_conditions: string;
};

export type FormStatus = {
  error: string | null;
  isLoading: boolean;
  success: string | null;
};
