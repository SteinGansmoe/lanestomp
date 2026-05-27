import "server-only";

import {
  buildLeagueMatchupDraftPrompt,
  matchupDraftSchema,
  matchupDraftSectionKeys,
  type LeagueRole,
  type MatchupDraftSectionKey,
  type MatchupDraftSections,
} from "./matchup-draft-prompt";

export type LeagueMatchupDraftProvider = "openai" | "placeholder";

export type GenerateLeagueMatchupDraftContentInput = {
  adminNotes: string | null;
  championAName: string;
  championBName: string;
  role: LeagueRole;
};

export type GenerateLeagueMatchupDraftContentResult =
  | {
      draft: MatchupDraftSections;
      ok: true;
      provider: LeagueMatchupDraftProvider;
    }
  | {
      error: string;
      ok: false;
    };

const openaiApiKey = process.env.OPENAI_API_KEY;
const openaiMatchupModel = "gpt-4.1-mini";

export async function generateLeagueMatchupDraftContent(
  input: GenerateLeagueMatchupDraftContentInput
): Promise<GenerateLeagueMatchupDraftContentResult> {
  if (!openaiApiKey) {
    return {
      draft: generateDraftWithPlaceholderProvider(input),
      ok: true,
      provider: "placeholder",
    };
  }

  return generateDraftWithOpenAIProvider(input);
}

async function generateDraftWithOpenAIProvider({
  adminNotes,
  championAName,
  championBName,
  role,
}: GenerateLeagueMatchupDraftContentInput): Promise<GenerateLeagueMatchupDraftContentResult> {
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
}: GenerateLeagueMatchupDraftContentInput): MatchupDraftSections {
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
