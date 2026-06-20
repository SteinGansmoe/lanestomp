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
  generation_status: "draft" | "failed" | "reviewed";
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

export type LeagueCounterPickType = "best_counter" | "countered_by";
export type LeagueCounterPickStatus = "draft" | "reviewed";
export type LeagueCounterPickBuildPath = Record<string, unknown>;

export type LeagueCounterPick = {
  behind_build_path: LeagueCounterPickBuildPath | null;
  champion_id: string;
  common_build_vs: LeagueCounterPickBuildPath | null;
  counter_champion_id: string;
  counter_strength: string | null;
  counter_type: LeagueCounterPickType;
  created_at: string;
  games: number | null;
  generation_status: LeagueCounterPickStatus;
  id: number;
  patch: string | null;
  rank_filter: string | null;
  region: string | null;
  reason: string | null;
  role: AdminLeagueMatchup["role"];
  updated_at: string;
  win_rate: number | null;
};

export type AdminLeagueMatchupFeedback = {
  card_type: string;
  created_at: string;
  enemy_champion: string;
  feedback_type: "helpful" | "not_helpful" | "report_issue";
  id: number;
  lane: AdminLeagueMatchup["role"];
  matchup_id: number;
  message: string | null;
  player_champion: string;
  reason:
    | "ability_formatting_issue"
    | "incorrect_advice"
    | "missing_information"
    | "other"
    | "too_generic"
    | "wrong_champion_perspective"
    | null;
  status: "dismissed" | "open" | "resolved" | "reviewing";
  updated_at: string;
  user_id: string | null;
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
  leagueCounterPicks: LeagueCounterPick[];
  leagueFeedback: AdminLeagueMatchupFeedback[];
  leagueMatchups: AdminLeagueMatchup[];
  resources: AdminResource[];
  seasons: AdminSeason[];
  timelineEvents: AdminTimelineEvent[];
};

export type AdminSection =
  | "community"
  | "league-counter-picks"
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
