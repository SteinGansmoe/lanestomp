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
      providerWarning?: string;
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

  const openaiResult = await generateDraftWithOpenAIProvider(input);

  if (openaiResult.ok) {
    return openaiResult;
  }

  return {
    draft: generateDraftWithPlaceholderProvider(input),
    ok: true,
    provider: "placeholder",
    providerWarning: openaiResult.error,
  };
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
        max_output_tokens: 900,
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
    danger_windows: [
      `- Respect ${championBName}'s key cooldowns before stepping forward.`,
      `- Back off if ${championAName} has already spent mobility, crowd control, or wave control.`,
      "- Re-enter when the main threat is down or the wave is safer.",
    ].join("\n"),
    early_game: [
      "- Identify who controls the first waves.",
      `- Avoid giving ${championBName} a clean early trade before the lane rhythm is clear.`,
      "- Use spacing and minion advantage before forcing trades.",
    ].join("\n"),
    itemization_notes: [
      `- Adapt around ${championBName}'s main damage profile.`,
      "- Prioritize survivability if lane tempo falls behind.",
      "- Choose sustain or defensive runes when trades become hard to reset.",
    ].join("\n"),
    overview: [
      `- Treat ${championAName} vs ${championBName} in ${roleLabel} as a review-ready draft.`,
      "- Track cooldowns and wave control before committing.",
      "- Replace these placeholder notes before publishing.",
    ].join("\n"),
    power_spikes: [
      "- Review level, item, and ultimate timing for both champions.",
      `- Slow down around ${championBName}'s first major spike.`,
      "- Regain tempo after important cooldowns are traded.",
    ].join("\n"),
    trading_pattern: [
      `- Keep ${championAName}'s trades short and intentional.`,
      `- Avoid ${championBName}'s preferred response pattern.`,
      "- Commit longer only with wave help, spacing advantage, or cooldown edge.",
    ].join("\n"),
    win_conditions: [
      "- Keep the lane state controlled.",
      `- Avoid unnecessary deaths during ${championBName}'s strongest windows.`,
      "- Convert stable pressure into map impact.",
    ].join("\n"),
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
