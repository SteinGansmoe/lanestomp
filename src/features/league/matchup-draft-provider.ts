import "server-only";

import {
  buildLeagueMatchupDraftPrompt,
  matchupDraftSchema,
  matchupDraftSectionKeys,
  type LeagueRole,
  type MatchupDraftSectionKey,
  type MatchupDraftSections,
} from "./matchup-draft-prompt";
import type { LeagueChampionKnowledgeProfile } from "./champion-knowledge";

export type LeagueMatchupDraftProvider = "openai" | "placeholder";

export type GenerateLeagueMatchupDraftContentInput = {
  adminNotes: string | null;
  championAProfile?: LeagueChampionKnowledgeProfile | null;
  championAName: string;
  championBProfile?: LeagueChampionKnowledgeProfile | null;
  championBName: string;
  role: LeagueRole;
};

export type GenerateLeagueMatchupDraftContentResult =
  | {
      draft: MatchupDraftSections;
      ok: true;
      provider: LeagueMatchupDraftProvider;
      profileWarning?: string;
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
  const profileWarning = getMissingChampionProfileWarning(input);

  if (!openaiApiKey) {
    return {
      draft: generateDraftWithPlaceholderProvider(input),
      ok: true,
      profileWarning,
      provider: "placeholder",
    };
  }

  const openaiResult = await generateDraftWithOpenAIProvider(input);

  if (openaiResult.ok) {
    return {
      ...openaiResult,
      profileWarning,
    };
  }

  return {
    draft: generateDraftWithPlaceholderProvider(input),
    ok: true,
    profileWarning,
    provider: "placeholder",
    providerWarning: openaiResult.error,
  };
}

function getMissingChampionProfileWarning({
  championAProfile,
  championAName,
  championBProfile,
  championBName,
}: GenerateLeagueMatchupDraftContentInput) {
  const missingProfiles = [
    !championAProfile ? championAName : null,
    !championBProfile ? championBName : null,
  ].filter(Boolean);

  if (missingProfiles.length === 0) {
    return undefined;
  }

  return `Missing combat profile for ${missingProfiles.join(
    " and "
  )}; generated draft should be reviewed as lower confidence.`;
}

async function generateDraftWithOpenAIProvider({
  adminNotes,
  championAProfile,
  championAName,
  championBProfile,
  championBName,
  role,
}: GenerateLeagueMatchupDraftContentInput): Promise<GenerateLeagueMatchupDraftContentResult> {
  const prompt = buildLeagueMatchupDraftPrompt({
    adminNotes,
    championAProfile,
    championAName,
    championBProfile,
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
        max_output_tokens: 800,
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
    overview: [
      `- Review the non-obvious ${roleLabel} matchup identity before publishing.`,
      `- Include defensive adaptation against ${championBName} here only if it changes the lane plan.`,
      "- Keep broad notes out of this section unless they add real matchup context.",
    ].join("\n"),
    power_spikes: [
      "- List only real level, ultimate, first-item, or major cooldown breakpoints.",
      `- Slow down only when ${championBName} reaches a verified spike.`,
      `- Push harder only when ${championAName}'s own breakpoint is verified.`,
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
          normalizeDraftSection(parsed[key]?.toString() ?? ""),
        ])
      ) as MatchupDraftSections;
    }
  } catch {
    return null;
  }

  return null;
}

function normalizeDraftSection(section: string) {
  return section
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 3)
    .join("\n");
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
