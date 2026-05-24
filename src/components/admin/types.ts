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
  icon: string;
  id: string;
  is_active: boolean;
  label: string;
  sort_order: number;
  title: string;
  url: string;
};

export type AdminData = {
  games: AdminGame[];
  resources: AdminResource[];
  seasons: AdminSeason[];
};

export type AdminSection = "games" | "overview" | "resources" | "seasons";

export type ResourceFormState = {
  game_id: string;
  icon: string;
  id: string;
  is_active: boolean;
  label: string;
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

export type FormStatus = {
  error: string | null;
  isLoading: boolean;
  success: string | null;
};
