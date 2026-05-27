"use server";

import { createClient } from "@supabase/supabase-js";

import type { AdminLeagueMatchup } from "@/src/components/admin/types";
import {
  buildLeagueMatchupDraftPrompt,
  matchupDraftSchema,
  matchupDraftSectionKeys,
  type MatchupDraftSectionKey,
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
      provider: "openai" | "placeholder";
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
const openaiApiKey = process.env.OPENAI_API_KEY;
const openaiMatchupModel = process.env.OPENAI_MATCHUP_MODEL ?? "gpt-4.1-mini";

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
  const providerResult = await generateDraft({
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

async function generateDraft({
  adminNotes,
  championAName,
  championBName,
  role,
}: {
  adminNotes: string | null;
  championAName: string;
  championBName: string;
  role: AdminLeagueMatchup["role"];
}): Promise<GenerateDraftResult> {
  if (!openaiApiKey) {
    return {
      draft: generateDraftWithPlaceholderProvider({
        championAName,
        championBName,
        role,
      }),
      ok: true,
      provider: "placeholder",
    };
  }

  return generateDraftWithOpenAIProvider({
    adminNotes,
    championAName,
    championBName,
    role,
  });
}

async function generateDraftWithOpenAIProvider({
  adminNotes,
  championAName,
  championBName,
  role,
}: {
  adminNotes: string | null;
  championAName: string;
  championBName: string;
  role: AdminLeagueMatchup["role"];
}): Promise<GenerateDraftResult> {
  const prompt = buildLeagueMatchupDraftPrompt({
    adminNotes,
    championAName,
    championBName,
    role,
  });
  let response: Response;

  try {
    response = await fetch("https://api.openai.com/v1/responses", {
      body: JSON.stringify({
        input: [
          {
            content: prompt.systemPrompt,
            role: "system",
          },
          {
            content: prompt.userPrompt,
            role: "user",
          },
        ],
        max_output_tokens: 1200,
        model: openaiMatchupModel,
        store: false,
        temperature: 0.4,
        text: {
          format: {
            name: "league_matchup_draft",
            schema: matchupDraftSchema,
            strict: true,
            type: "json_schema",
          },
        },
      }),
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    });
  } catch {
    return {
      error: "AI provider could not be reached.",
      ok: false,
    };
  }

  if (!response.ok) {
    const errorBody = await readOpenAIError(response);

    return {
      error: `AI provider failed: ${errorBody}`,
      ok: false,
    };
  }

  let responseBody: OpenAIResponseBody;

  try {
    responseBody = (await response.json()) as OpenAIResponseBody;
  } catch {
    return {
      error: "AI provider returned an unreadable response.",
      ok: false,
    };
  }

  if (responseBody.error?.message) {
    return {
      error: `AI provider failed: ${responseBody.error.message}`,
      ok: false,
    };
  }

  const outputText = getOpenAIOutputText(responseBody);

  if (!outputText) {
    return {
      error: "AI provider returned no draft content.",
      ok: false,
    };
  }

  const draft = parseDraftSections(outputText);

  if (!draft) {
    return {
      error: "AI provider returned draft content in an unexpected format.",
      ok: false,
    };
  }

  return {
    draft,
    ok: true,
    provider: "openai",
  };
}

function generateDraftWithPlaceholderProvider({
  championAName,
  championBName,
  role,
}: {
  championAName: string;
  championBName: string;
  role: AdminLeagueMatchup["role"];
}): MatchupDraftSections {
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

async function readOpenAIError(response: Response) {
  const fallbackMessage = `${response.status} ${response.statusText}`.trim();

  try {
    const body = (await response.json()) as {
      error?: {
        message?: string;
      };
    };

    return body.error?.message ?? fallbackMessage;
  } catch {
    return fallbackMessage;
  }
}

function getOpenAIOutputText(responseBody: OpenAIResponseBody) {
  if (responseBody.output_text) {
    return responseBody.output_text;
  }

  for (const output of responseBody.output ?? []) {
    for (const content of output.content ?? []) {
      if (content.type === "output_text" && content.text) {
        return content.text;
      }
    }
  }

  return null;
}

function parseDraftSections(outputText: string): MatchupDraftSections | null {
  try {
    const parsed = JSON.parse(outputText) as Partial<
      Record<MatchupDraftSectionKey, unknown>
    >;

    if (
      matchupDraftSectionKeys.every(
        (key) => typeof parsed[key] === "string" && parsed[key].trim()
      )
    ) {
      return Object.fromEntries(
        matchupDraftSectionKeys.map((key) => [
          key,
          parsed[key]?.toString().trim(),
        ])
      ) as MatchupDraftSections;
    }
  } catch {
    return null;
  }

  return null;
}

function appendGenerationNote(currentNotes: string | null, nextNote: string) {
  const trimmedNotes = currentNotes?.trim();

  return trimmedNotes ? `${trimmedNotes}\n\n${nextNote}` : nextNote;
}

type OpenAIResponseBody = {
  error?: {
    message?: string;
  };
  output?: Array<{
    content?: Array<{
      text?: string;
      type?: string;
    }>;
  }>;
  output_text?: string;
};
