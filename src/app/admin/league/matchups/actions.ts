"use server";

import { createClient } from "@supabase/supabase-js";

import type { AdminLeagueMatchup } from "@/src/components/admin/types";

type GenerateDraftInput = {
  accessToken: string;
  matchupId: number;
};

type DraftSections = Pick<
  AdminLeagueMatchup,
  | "danger_windows"
  | "early_game"
  | "itemization_notes"
  | "overview"
  | "power_spikes"
  | "trading_pattern"
  | "win_conditions"
>;

type GenerateDraftResult =
  | {
      draft: DraftSections;
      ok: true;
      provider: "placeholder";
    }
  | {
      error: string;
      ok: false;
    };

type MatchupRow = {
  admin_notes: string | null;
  champion_a_id: string;
  champion_b_id: string;
  role: AdminLeagueMatchup["role"];
};

type ChampionRow = {
  id: string;
  name: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function generateLeagueMatchupDraft({
  accessToken,
  matchupId,
}: GenerateDraftInput): Promise<GenerateDraftResult> {
  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      error: "Supabase is not configured.",
      ok: false,
    };
  }

  if (!accessToken) {
    return {
      error: "Admin session is not ready.",
      ok: false,
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
      ok: false,
    };
  }

  const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin", {
    user_id: user.id,
  });

  if (adminError || !isAdmin) {
    return {
      error: "Only admins can generate matchup drafts.",
      ok: false,
    };
  }

  const { data: matchup, error: matchupError } = await supabase
    .from("league_matchups")
    .select("admin_notes, champion_a_id, champion_b_id, role")
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
  const draft = await generateDraftWithPlaceholderProvider({
    championAName,
    championBName,
    role: matchup.role,
  });
  const generatedAt = new Date().toISOString();
  const adminNotes = appendGenerationNote(
    matchup.admin_notes,
    `Placeholder draft generated ${generatedAt}. Review and edit before publishing.`
  );

  const { error: updateError } = await supabase
    .from("league_matchups")
    .update({
      ...draft,
      admin_notes: adminNotes,
      generated_at: generatedAt,
      generation_status: "draft",
      reviewed_at: null,
      reviewed_by: null,
    })
    .eq("id", matchupId);

  if (updateError) {
    return {
      error: updateError.message,
      ok: false,
    };
  }

  return {
    draft,
    ok: true,
    provider: "placeholder",
  };
}

async function generateDraftWithPlaceholderProvider({
  championAName,
  championBName,
  role,
}: {
  championAName: string;
  championBName: string;
  role: AdminLeagueMatchup["role"];
}): Promise<DraftSections> {
  const roleLabel = role === "adc" ? "ADC" : role;

  return {
    danger_windows: `${championBName} becomes most dangerous when their key cooldowns are available and ${championAName} has already used mobility, crowd control, or wave control tools. Track those windows before stepping forward.`,
    early_game: `Open the lane by identifying who controls the first waves. ${championAName} should avoid giving ${championBName} a clean early trade pattern until the matchup rhythm is confirmed.`,
    itemization_notes: `Start with conservative, role-appropriate items and adapt around ${championBName}'s main damage profile. Prioritize survivability if the matchup tempo starts falling behind.`,
    overview: `${championAName} versus ${championBName} in ${roleLabel} is a draft matchup guide generated from the structured SeasonTracker sections. Treat this as a review-ready starting point, not final published advice.`,
    power_spikes: `Review level, item, and ultimate timing for both champions. ${championAName} should play more deliberately around ${championBName}'s first major spike and look to regain tempo after cooldowns are traded.`,
    trading_pattern: `${championAName} wants short, intentional trades that avoid ${championBName}'s preferred response pattern. Use minion waves, spacing, and cooldown tracking before committing to extended fights.`,
    win_conditions: `${championAName}'s win condition is to keep the lane state controlled, avoid unnecessary deaths during ${championBName}'s strongest windows, and convert stable pressure into map impact.`,
  };
}

function appendGenerationNote(currentNotes: string | null, nextNote: string) {
  const trimmedNotes = currentNotes?.trim();

  return trimmedNotes ? `${trimmedNotes}\n\n${nextNote}` : nextNote;
}
