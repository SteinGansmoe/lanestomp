import type { AdminData, GameFormState, ResourceFormState, SeasonFormState } from "./types";

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
  icon: "forum",
  id: "",
  is_active: true,
  label: "",
  sort_order: "0",
  title: "",
  url: "",
};

export const emptyAdminData: AdminData = {
  games: [],
  resources: [],
  seasons: [],
};

export const missingResourcesTableMessage =
  "Community resources are not set up in Supabase yet. Apply the game_resources migration to enable the Resources admin page.";

export const fieldClassName =
  "w-full rounded-lg border border-white/10 bg-[#111a2c] px-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-500 focus-visible:border-violet-400/70 focus-visible:ring-3 focus-visible:ring-violet-400/20 disabled:cursor-not-allowed disabled:opacity-50";
export const selectOptionClassName = "bg-[#10182b] text-zinc-100";
