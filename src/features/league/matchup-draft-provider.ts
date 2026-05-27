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
      `- ${championBName} can threaten lethal when engage or burst tools are ready.`,
      `- Avoid all-in windows after ${championAName} spends mobility or defensive crowd control.`,
      "- Treat jungle fog and missing summoners as forced caution.",
    ].join("\n"),
    early_game: [
      "- Keep the wave in a lane state that allows short trades.",
      `- Let ${championAName} establish safe spacing before forcing pressure.`,
      "- Preserve health before the first meaningful level breakpoint.",
    ].join("\n"),
    itemization_notes: [
      `- Adapt around ${championBName}'s main damage profile.`,
      "- Choose sustain only if repeated poke controls lane access.",
      "- Choose defensive tools when burst or crowd control decides fights.",
    ].join("\n"),
    overview: [
      `- ${championAName} vs ${championBName} in ${roleLabel} is a review-ready draft.`,
      "- Identify which champion controls lane tempo first.",
      "- Replace these placeholder notes before publishing.",
    ].join("\n"),
    power_spikes: [
      "- Review level, ultimate, and first-item timing for both champions.",
      `- Slow down around ${championBName}'s first major item or ultimate spike.`,
      `- Push harder when ${championAName}'s own breakpoint comes online.`,
    ].join("\n"),
    trading_pattern: [
      `- Keep ${championAName}'s trades short until the matchup pattern is confirmed.`,
      `- Disengage before ${championBName}'s main follow-up lands.`,
      "- Extend only after the opponent misses their main answer.",
    ].join("\n"),
    win_conditions: [
      `- Turn ${championAName}'s stable lane into objective access.`,
      "- Convert safe pressure into roam windows or teamfight setup.",
      `- Deny ${championBName} the fights that start on their terms.`,
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
