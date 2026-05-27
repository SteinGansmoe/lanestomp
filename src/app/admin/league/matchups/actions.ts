"use server";

import { createClient } from "@supabase/supabase-js";

import type { AdminLeagueMatchup } from "@/src/components/admin/types";
import {
  generateLeagueMatchupDraftContent,
  type LeagueMatchupDraftProvider,
} from "@/src/features/league/matchup-draft-provider";
import {
  type MatchupDraftSections,
} from "@/src/features/league/matchup-draft-prompt";

type GenerateDraftInput = {
  accessToken: string;
  matchupId: number;
};

type GenerateDraftResult =
  | {
      draft: MatchupDraftSections;
      ok: true;
      provider: LeagueMatchupDraftProvider;
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
  const providerResult = await generateLeagueMatchupDraftContent({
    adminNotes: matchup.admin_notes,
    championAName,
    championBName,
    role: matchup.role,
  });

  if (!providerResult.ok) {
    return providerResult;
  }

  const { draft, provider } = providerResult;
  const generatedAt = new Date().toISOString();
  const adminNotes = appendGenerationNote(
    matchup.admin_notes,
    `${provider === "openai" ? "AI" : "Placeholder"} draft generated ${generatedAt}. Review and edit before publishing.`
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
    provider,
  };
}

function appendGenerationNote(currentNotes: string | null, nextNote: string) {
  const trimmedNotes = currentNotes?.trim();

  return trimmedNotes ? `${trimmedNotes}\n\n${nextNote}` : nextNote;
}
