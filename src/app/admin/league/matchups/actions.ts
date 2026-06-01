"use server";

import { createClient } from "@supabase/supabase-js";

import type { AdminLeagueMatchup } from "@/src/components/admin/types";
import {
  generateLeagueMatchupDraftContent,
  generateLeagueMatchupDraftSectionContent,
  type LeagueMatchupDraftProvider,
} from "@/src/features/league/matchup-draft-provider";
import {
  type MatchupDraftSectionKey,
  type MatchupDraftSections,
} from "@/src/features/league/matchup-draft-prompt";
import { getChampionCombatProfile } from "@/src/features/league/champion-knowledge";

type GenerateDraftInput = {
  accessToken: string;
  matchupId: number;
};

type GenerateDraftSectionInput = GenerateDraftInput & {
  sectionKey: MatchupDraftSectionKey;
};

type DeleteDraftInput = GenerateDraftInput;

type GenerateDraftResult =
  | {
      draft: MatchupDraftSections;
      matchup: SavedMatchupDraftRow;
      ok: true;
      profileWarning?: string;
      provider: LeagueMatchupDraftProvider;
      providerWarning?: string;
    }
  | {
      error: string;
      ok: false;
    };

type GenerateDraftSectionResult =
  | {
      content: string;
      matchup: SavedMatchupDraftRow;
      ok: true;
      profileWarning?: string;
      provider: LeagueMatchupDraftProvider;
      providerWarning?: string;
      sectionKey: MatchupDraftSectionKey;
    }
  | {
      error: string;
      ok: false;
    };

type DeleteDraftResult =
  | {
      matchup: SavedMatchupDraftRow;
      ok: true;
    }
  | {
      error: string;
      ok: false;
    };

type MatchupRow = {
  admin_notes: string | null;
  champion_a_id: string;
  champion_b_id: string;
  confidence_level: string | null;
  danger_windows: string | null;
  early_game: string | null;
  overview: string | null;
  power_spikes: string | null;
  role: AdminLeagueMatchup["role"];
  trading_pattern: string | null;
  win_conditions: string | null;
};

type SavedMatchupDraftRow = MatchupDraftSections & {
  generated_at: string | null;
  generation_status: AdminLeagueMatchup["generation_status"];
  reviewed_at: string | null;
  reviewed_by: string | null;
};

type ChampionRow = {
  id: string;
  name: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const savedMatchupDraftSelect = [
  "danger_windows",
  "early_game",
  "generated_at",
  "generation_status",
  "overview",
  "power_spikes",
  "reviewed_at",
  "reviewed_by",
  "trading_pattern",
  "win_conditions",
].join(", ");

export async function generateLeagueMatchupDraft({
  accessToken,
  matchupId,
}: GenerateDraftInput): Promise<GenerateDraftResult> {
  const authResult = await getAuthorizedSupabaseClient(
    accessToken,
    "generate matchup drafts"
  );

  if (!authResult.ok) {
    return authResult;
  }

  const { supabase } = authResult;
  const { data: matchup, error: matchupError } = await supabase
    .from("league_matchups")
    .select(
      "admin_notes, champion_a_id, champion_b_id, confidence_level, danger_windows, early_game, overview, power_spikes, role, trading_pattern, win_conditions"
    )
    .eq("id", matchupId)
    .maybeSingle<MatchupRow>();

  if (matchupError || !matchup) {
    return {
      error: matchupError?.message ?? "League matchup could not be found.",
      ok: false,
    };
  }

  const { data: champions, error: championsError } = await supabase
    .from("league_champions")
    .select("id, name")
    .in("id", [matchup.champion_a_id, matchup.champion_b_id]);

  if (championsError) {
    return {
      error: championsError.message,
      ok: false,
    };
  }

  const championNamesById = new Map(
    ((champions ?? []) as ChampionRow[]).map((champion) => [
      champion.id,
      champion.name,
    ])
  );
  const championAName =
    championNamesById.get(matchup.champion_a_id) ?? matchup.champion_a_id;
  const championBName =
    championNamesById.get(matchup.champion_b_id) ?? matchup.champion_b_id;
  const championAProfile = getChampionCombatProfile(
    matchup.champion_a_id
  );
  const championBProfile = getChampionCombatProfile(
    matchup.champion_b_id
  );
  const providerResult = await generateLeagueMatchupDraftContent({
    adminNotes: matchup.admin_notes,
    championAProfile,
    championAName,
    championBProfile,
    championBName,
    existingSections: getDraftFromMatchupRow(matchup),
    role: matchup.role,
  });

  if (!providerResult.ok) {
    return providerResult;
  }

  const { draft, provider } = providerResult;
  const generatedAt = new Date().toISOString();
  const adminNotes = appendGenerationNote(
    matchup.admin_notes,
    getGenerationNote(
      provider,
      generatedAt,
      providerResult.providerWarning,
      providerResult.profileWarning
    )
  );
  const confidenceLevel =
    providerResult.profileWarning ? "low" : matchup.confidence_level;

  const { data: savedMatchup, error: updateError } = await supabase
    .from("league_matchups")
    .update({
      confidence_level: confidenceLevel,
      danger_windows: draft.danger_windows,
      early_game: draft.early_game,
      overview: draft.overview,
      power_spikes: draft.power_spikes,
      trading_pattern: draft.trading_pattern,
      win_conditions: draft.win_conditions,
      admin_notes: adminNotes,
      generated_at: generatedAt,
      generation_status: "draft",
      reviewed_at: null,
      reviewed_by: null,
    })
    .eq("id", matchupId)
    .select(savedMatchupDraftSelect)
    .maybeSingle<SavedMatchupDraftRow>();

  if (updateError || !savedMatchup) {
    return {
      error: updateError?.message ?? "Generated draft could not be saved.",
      ok: false,
    };
  }

  return {
    draft: getDraftFromSavedMatchup(savedMatchup),
    matchup: savedMatchup,
    ok: true,
    profileWarning: providerResult.profileWarning,
    provider,
    providerWarning: providerResult.providerWarning,
  };
}

export async function generateLeagueMatchupDraftSection({
  accessToken,
  matchupId,
  sectionKey,
}: GenerateDraftSectionInput): Promise<GenerateDraftSectionResult> {
  const authResult = await getAuthorizedSupabaseClient(
    accessToken,
    "generate matchup draft cards"
  );

  if (!authResult.ok) {
    return authResult;
  }

  const { supabase } = authResult;
  const { data: matchup, error: matchupError } = await supabase
    .from("league_matchups")
    .select(
      "admin_notes, champion_a_id, champion_b_id, confidence_level, danger_windows, early_game, overview, power_spikes, role, trading_pattern, win_conditions"
    )
    .eq("id", matchupId)
    .maybeSingle<MatchupRow>();

  if (matchupError || !matchup) {
    return {
      error: matchupError?.message ?? "League matchup could not be found.",
      ok: false,
    };
  }

  const { data: champions, error: championsError } = await supabase
    .from("league_champions")
    .select("id, name")
    .in("id", [matchup.champion_a_id, matchup.champion_b_id]);

  if (championsError) {
    return {
      error: championsError.message,
      ok: false,
    };
  }

  const championNamesById = new Map(
    ((champions ?? []) as ChampionRow[]).map((champion) => [
      champion.id,
      champion.name,
    ])
  );
  const championAName =
    championNamesById.get(matchup.champion_a_id) ?? matchup.champion_a_id;
  const championBName =
    championNamesById.get(matchup.champion_b_id) ?? matchup.champion_b_id;
  const providerResult = await generateLeagueMatchupDraftSectionContent({
    adminNotes: matchup.admin_notes,
    championAProfile: getChampionCombatProfile(matchup.champion_a_id),
    championAName,
    championBProfile: getChampionCombatProfile(matchup.champion_b_id),
    championBName,
    existingSections: getDraftFromMatchupRow(matchup),
    role: matchup.role,
    sectionKey,
  });

  if (!providerResult.ok) {
    return providerResult;
  }

  const generatedAt = new Date().toISOString();
  const confidenceLevel =
    providerResult.profileWarning ? "low" : matchup.confidence_level;

  const { data: savedMatchup, error: updateError } = await supabase
    .from("league_matchups")
    .update({
      [sectionKey]: providerResult.content,
      confidence_level: confidenceLevel,
      generated_at: generatedAt,
      generation_status: "draft",
      reviewed_at: null,
      reviewed_by: null,
    })
    .eq("id", matchupId)
    .select(savedMatchupDraftSelect)
    .maybeSingle<SavedMatchupDraftRow>();

  if (updateError || !savedMatchup) {
    return {
      error: updateError?.message ?? "Generated draft card could not be saved.",
      ok: false,
    };
  }

  return {
    content: providerResult.content,
    matchup: savedMatchup,
    ok: true,
    profileWarning: providerResult.profileWarning,
    provider: providerResult.provider,
    providerWarning: providerResult.providerWarning,
    sectionKey,
  };
}

export async function deleteLeagueMatchupDraft({
  accessToken,
  matchupId,
}: DeleteDraftInput): Promise<DeleteDraftResult> {
  const authResult = await getAuthorizedSupabaseClient(
    accessToken,
    "delete matchup drafts"
  );

  if (!authResult.ok) {
    return authResult;
  }

  const { supabase } = authResult;
  const { data: savedMatchup, error: updateError } = await supabase
    .from("league_matchups")
    .update({
      danger_windows: null,
      early_game: null,
      generated_at: null,
      generation_status: "draft",
      overview: null,
      power_spikes: null,
      reviewed_at: null,
      reviewed_by: null,
      trading_pattern: null,
      win_conditions: null,
    })
    .eq("id", matchupId)
    .select(savedMatchupDraftSelect)
    .maybeSingle<SavedMatchupDraftRow>();

  if (updateError || !savedMatchup) {
    return {
      error: updateError?.message ?? "Generated draft could not be deleted.",
      ok: false,
    };
  }

  return {
    matchup: savedMatchup,
    ok: true,
  };
}

async function getAuthorizedSupabaseClient(
  accessToken: string,
  actionLabel: string
) {
  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      error: "Supabase is not configured.",
      ok: false as const,
    };
  }

  if (!accessToken) {
    return {
      error: "Admin session is not ready.",
      ok: false as const,
    };
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });

  const { data: userData, error: userError } = await supabase.auth.getUser(
    accessToken
  );
  const user = userData.user;

  if (userError || !user) {
    return {
      error: "Admin session could not be verified.",
      ok: false as const,
    };
  }

  const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin", {
    user_id: user.id,
  });

  if (adminError || !isAdmin) {
    return {
      error: `Only admins can ${actionLabel}.`,
      ok: false as const,
    };
  }

  return {
    ok: true as const,
    supabase,
  };
}

function getDraftFromSavedMatchup(
  matchup: SavedMatchupDraftRow
): MatchupDraftSections {
  return {
    danger_windows: matchup.danger_windows,
    early_game: matchup.early_game,
    overview: matchup.overview,
    power_spikes: matchup.power_spikes,
    trading_pattern: matchup.trading_pattern,
    win_conditions: matchup.win_conditions,
  };
}

function getDraftFromMatchupRow(matchup: MatchupRow): MatchupDraftSections {
  return {
    danger_windows: matchup.danger_windows ?? "",
    early_game: matchup.early_game ?? "",
    overview: matchup.overview ?? "",
    power_spikes: matchup.power_spikes ?? "",
    trading_pattern: matchup.trading_pattern ?? "",
    win_conditions: matchup.win_conditions ?? "",
  };
}

function appendGenerationNote(currentNotes: string | null, nextNote: string) {
  const trimmedNotes = currentNotes?.trim();

  return trimmedNotes ? `${trimmedNotes}\n\n${nextNote}` : nextNote;
}

function getGenerationNote(
  provider: LeagueMatchupDraftProvider,
  generatedAt: string,
  providerWarning?: string,
  profileWarning?: string
) {
  const profileNote = profileWarning ? ` ${profileWarning}` : "";

  if (provider === "openai") {
    return `AI draft generated ${generatedAt}.${profileNote} Review and edit before publishing.`;
  }

  if (providerWarning) {
    return `Placeholder draft generated ${generatedAt} after AI provider failure: ${providerWarning}.${profileNote} Review and edit before publishing.`;
  }

  return `Placeholder draft generated ${generatedAt} because OPENAI_API_KEY is not configured.${profileNote} Review and edit before publishing.`;
}
