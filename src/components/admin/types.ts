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

export type AdminData = {
  games: AdminGame[];
  resources: AdminResource[];
  seasons: AdminSeason[];
  timelineEvents: AdminTimelineEvent[];
};

export type AdminSection =
  | "community"
  | "games"
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

export type FormStatus = {
  error: string | null;
  isLoading: boolean;
  success: string | null;
};
