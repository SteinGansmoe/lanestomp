import "server-only";

import {
  buildLeagueMatchupDraftPrompt,
  createMatchupDraftSchema,
  matchupDraftSchema,
  matchupDraftSectionKeys,
  type LeagueRole,
  type MatchupDraftSectionKey,
  type MatchupDraftSections,
} from "./matchup-draft-prompt";
import type { LeagueChampionKnowledgeProfile } from "./champion-knowledge/types";

export type LeagueMatchupDraftProvider = "openai" | "placeholder";

export type GenerateLeagueMatchupDraftContentInput = {
  adminNotes: string | null;
  championAProfile?: LeagueChampionKnowledgeProfile | null;
  championAName: string;
  championBProfile?: LeagueChampionKnowledgeProfile | null;
  championBName: string;
  existingSections?: Partial<MatchupDraftSections> | null;
  role: LeagueRole;
};

export type GenerateLeagueMatchupDraftSectionContentInput =
  GenerateLeagueMatchupDraftContentInput & {
    sectionKey: MatchupDraftSectionKey;
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

export type GenerateLeagueMatchupDraftSectionContentResult =
  | {
      content: string;
      ok: true;
      profileWarning?: string;
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

export async function generateLeagueMatchupDraftSectionContent(
  input: GenerateLeagueMatchupDraftSectionContentInput
): Promise<GenerateLeagueMatchupDraftSectionContentResult> {
  const profileWarning = getMissingChampionProfileWarning(input);

  if (!openaiApiKey) {
    return {
      content: generateDraftWithPlaceholderProvider(input)[input.sectionKey],
      ok: true,
      profileWarning,
      provider: "placeholder",
    };
  }

  const openaiResult = await generateDraftSectionWithOpenAIProvider(input);

  if (openaiResult.ok) {
    return {
      ...openaiResult,
      profileWarning,
    };
  }

  return {
    content: generateDraftWithPlaceholderProvider(input)[input.sectionKey],
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
  existingSections,
  role,
}: GenerateLeagueMatchupDraftContentInput): Promise<GenerateLeagueMatchupDraftContentResult> {
  const prompt = buildLeagueMatchupDraftPrompt({
    adminNotes,
    enemyChampionProfile: championBProfile,
    enemyChampionName: championBName,
    existingSections,
    playerChampionProfile: championAProfile,
    playerChampionName: championAName,
    role,
  });
  const responseResult = await requestOpenAIDraft({
    prompt,
    schema: matchupDraftSchema,
    schemaName: "league_matchup_draft",
  });

  if (!responseResult.ok) {
    return responseResult;
  }

  const draft = parseDraftSections(responseResult.outputText);

  if (!draft) {
    return {
      error: "AI provider returned draft content in an unexpected format.",
      ok: false,
    };
  }

  return {
    draft: normalizeDraftAbilityReferences({
      draft,
      enemyChampionName: championBName,
      enemyChampionProfile: championBProfile,
      playerChampionName: championAName,
      playerChampionProfile: championAProfile,
    }),
    ok: true,
    provider: "openai",
  };
}

async function generateDraftSectionWithOpenAIProvider({
  adminNotes,
  championAProfile,
  championAName,
  championBProfile,
  championBName,
  existingSections,
  role,
  sectionKey,
}: GenerateLeagueMatchupDraftSectionContentInput): Promise<GenerateLeagueMatchupDraftSectionContentResult> {
  const prompt = buildLeagueMatchupDraftPrompt({
    adminNotes,
    enemyChampionProfile: championBProfile,
    enemyChampionName: championBName,
    existingSections,
    playerChampionProfile: championAProfile,
    playerChampionName: championAName,
    role,
    targetSection: sectionKey,
  });
  const responseResult = await requestOpenAIDraft({
    prompt,
    schema: createMatchupDraftSchema([sectionKey]),
    schemaName: "league_matchup_draft_section",
  });

  if (!responseResult.ok) {
    return responseResult;
  }

  const section = parseDraftSection(responseResult.outputText, sectionKey);

  if (!section) {
    return {
      error: "AI provider returned draft card content in an unexpected format.",
      ok: false,
    };
  }

  return {
    content: normalizeSectionAbilityReferences(
      section,
      {
        championName: championAName,
        profile: championAProfile,
      },
      {
        championName: championBName,
        profile: championBProfile,
      }
    ),
    ok: true,
    provider: "openai",
  };
}

async function requestOpenAIDraft({
  prompt,
  schema,
  schemaName,
}: {
  prompt: ReturnType<typeof buildLeagueMatchupDraftPrompt>;
  schema: object;
  schemaName: string;
}): Promise<
  | {
      ok: true;
      outputText: string;
    }
  | {
      error: string;
      ok: false;
    }
> {
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
            name: schemaName,
            schema,
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

  return {
    ok: true,
    outputText,
  };
}

function generateDraftWithPlaceholderProvider({
  championAName: playerChampionName,
  championBName: enemyChampionName,
  role,
}: GenerateLeagueMatchupDraftContentInput): MatchupDraftSections {
  const roleLabel = role === "adc" ? "ADC" : role;

  return {
    danger_windows: [
      `- ${enemyChampionName} can threaten lethal when engage or burst tools are ready.`,
      `- Avoid all-in windows after ${playerChampionName} spends mobility or defensive crowd control.`,
      "- Treat jungle fog and missing summoners as forced caution.",
    ].join("\n"),
    early_game: [
      "- Keep the wave in a lane state that allows short trades.",
      `- Let ${playerChampionName} establish safe spacing before forcing pressure.`,
      "- Preserve health before the first meaningful level breakpoint.",
    ].join("\n"),
    overview: [
      `- Review the non-obvious ${roleLabel} matchup identity before publishing.`,
      `- Include defensive adaptation against ${enemyChampionName} here only if it changes the lane plan.`,
      "- Keep broad notes out of this section unless they add real matchup context.",
    ].join("\n"),
    power_spikes: [
      "- List only real level, ultimate, first-item, or major cooldown breakpoints.",
      `- Slow down only when ${enemyChampionName} reaches a verified spike.`,
      `- Push harder only when ${playerChampionName}'s own breakpoint is verified.`,
    ].join("\n"),
    trading_pattern: [
      `- Keep ${playerChampionName}'s trades short until the matchup pattern is confirmed.`,
      `- Disengage before ${enemyChampionName}'s main follow-up lands.`,
      "- Extend only after the opponent misses their main answer.",
    ].join("\n"),
    win_conditions: [
      `- Turn ${playerChampionName}'s stable lane into objective access.`,
      "- Convert safe pressure into roam windows or teamfight setup.",
      `- Deny ${enemyChampionName} the fights that start on their terms.`,
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

function parseDraftSection(
  outputText: string,
  sectionKey: MatchupDraftSectionKey
) {
  try {
    const parsed = JSON.parse(outputText) as Partial<
      Record<MatchupDraftSectionKey, unknown>
    >;
    const section = parsed[sectionKey];

    if (typeof section === "string" && section.trim()) {
      return normalizeDraftSection(section);
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

function normalizeDraftAbilityReferences({
  draft,
  enemyChampionName,
  enemyChampionProfile,
  playerChampionName,
  playerChampionProfile,
}: {
  draft: MatchupDraftSections;
  enemyChampionName: string;
  enemyChampionProfile?: LeagueChampionKnowledgeProfile | null;
  playerChampionName: string;
  playerChampionProfile?: LeagueChampionKnowledgeProfile | null;
}) {
  return Object.fromEntries(
    matchupDraftSectionKeys.map((key) => [
      key,
      normalizeSectionAbilityReferences(
        draft[key],
        {
          championName: playerChampionName,
          profile: playerChampionProfile,
        },
        {
          championName: enemyChampionName,
          profile: enemyChampionProfile,
        }
      ),
    ])
  ) as MatchupDraftSections;
}

function normalizeSectionAbilityReferences(
  section: string,
  ...champions: Array<{
    championName: string;
    profile?: LeagueChampionKnowledgeProfile | null;
  }>
) {
  return champions.reduce((currentSection, champion) => {
    const abilities = champion.profile?.abilities;

    if (!abilities) {
      return currentSection;
    }

    return (Object.entries(abilities) as Array<[
      keyof typeof abilities,
      string,
    ]>).reduce((currentText, [abilityKey, abilityName]) => {
      const replacement = `(${abilityKey})`;
      const aliases = [
        `${champion.championName}'s (${champion.championName}'s (${abilityKey}))`,
        `${champion.championName}'s ${champion.championName}'s (${abilityKey})`,
        `${champion.championName} ${champion.championName}'s (${abilityKey})`,
        `${champion.championName}'s (${abilityKey}) ${abilityName}`,
        `${champion.championName} (${abilityKey}) ${abilityName}`,
        `${champion.championName}'s ${abilityKey}`,
        `${champion.championName} ${abilityKey}`,
        `((${abilityKey}))`,
        `(${abilityKey}) ${abilityName}`,
        `${abilityKey} ${abilityName}`,
        abilityName,
        `(${abilityKey})`,
      ];

      const nextText = replaceBareAbilityKey(
        aliases.reduce(
          (nextText, alias) =>
            replaceAbilityAlias(
              replaceChampionOwnedAbilityAlias(
                nextText,
                champion.championName,
                alias,
                replacement
              ),
              alias,
              replacement
            ),
          currentText
        ),
        abilityKey,
        replacement
      );

      return normalizeAbilityOwnerReferences(
        nextText,
        champion.championName,
        abilityKey
      );
    }, currentSection);
  }, section);
}

function replaceChampionOwnedAbilityAlias(
  text: string,
  championName: string,
  alias: string,
  replacement: string
) {
  return replaceAbilityAlias(
    text,
    `${championName}'s ${alias}`,
    replacement
  ).replace(
    getAbilityAliasPattern(`${championName} ${alias}`),
    `$1${replacement}`
  );
}

function replaceAbilityAlias(text: string, alias: string, replacement: string) {
  return text.replace(getAbilityAliasPattern(alias), `$1${replacement}`);
}

function replaceBareAbilityKey(
  text: string,
  abilityKey: string,
  replacement: string
) {
  return text.replace(
    getBareAbilityKeyPattern(abilityKey),
    `$1${replacement}`
  );
}

function normalizeAbilityOwnerReferences(
  text: string,
  championName: string,
  abilityKey: string
) {
  return text
    .replace(
      getAbilityAliasPattern(
        `${championName}'s (${championName}'s (${abilityKey}))`
      ),
      `$1(${abilityKey})`
    )
    .replace(
      getAbilityAliasPattern(`${championName}'s ${championName}'s (${abilityKey})`),
      `$1(${abilityKey})`
    )
    .replace(
      getAbilityAliasPattern(`${championName} ${championName}'s (${abilityKey})`),
      `$1${championName} (${abilityKey})`
    )
    .replace(
      getAbilityAliasPattern(`${championName}'s (${abilityKey})`),
      `$1(${abilityKey})`
    )
    .replace(getAbilityAliasPattern(`${championName} (${abilityKey})`), `$1(${abilityKey})`)
    .replace(getAbilityAliasPattern(`((${abilityKey}))`), `$1(${abilityKey})`)
    .replace(getAbilityAliasPattern(`(${abilityKey}) (${abilityKey})`), `$1(${abilityKey})`);
}

function getAbilityAliasPattern(alias: string) {
  return new RegExp(`(^|[^A-Za-z0-9])${escapeRegex(alias)}(?![A-Za-z0-9])`, "gi");
}

function getBareAbilityKeyPattern(abilityKey: string) {
  return new RegExp(
    `(^|[^A-Za-z0-9(])${escapeRegex(abilityKey)}(?![A-Za-z0-9)])`,
    "gi"
  );
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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
