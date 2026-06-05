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
      allowFallback?: boolean;
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
      allowFallback?: boolean;
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
    const placeholderResult = generateValidatedPlaceholderDraft(input);

    if (!placeholderResult.ok) {
      return placeholderResult;
    }

    return {
      draft: placeholderResult.draft,
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

  if (openaiResult.allowFallback === false) {
    return {
      error: openaiResult.error,
      ok: false,
    };
  }

  const placeholderResult = generateValidatedPlaceholderDraft(input);

  if (!placeholderResult.ok) {
    return placeholderResult;
  }

  return {
    draft: placeholderResult.draft,
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
    const placeholderResult = generateValidatedPlaceholderSection(input);

    if (!placeholderResult.ok) {
      return placeholderResult;
    }

    return {
      content: placeholderResult.content,
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

  if (openaiResult.allowFallback === false) {
    return {
      error: openaiResult.error,
      ok: false,
    };
  }

  const placeholderResult = generateValidatedPlaceholderSection(input);

  if (!placeholderResult.ok) {
    return placeholderResult;
  }

  return {
    content: placeholderResult.content,
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

function generateValidatedPlaceholderDraft(
  input: GenerateLeagueMatchupDraftContentInput
):
  | {
      draft: MatchupDraftSections;
      ok: true;
    }
  | {
      error: string;
      ok: false;
    } {
  const draft = generateDraftWithPlaceholderProvider(input);
  const promptLeakage = findPromptLeakageInDraft(draft);

  if (promptLeakage.length > 0) {
    logPromptLeakageRejection({
      input,
      provider: "placeholder",
      rejectedSections: promptLeakage,
    });

    return {
      error: formatPromptLeakageError(promptLeakage),
      ok: false,
    };
  }

  return {
    draft,
    ok: true,
  };
}

function generateValidatedPlaceholderSection(
  input: GenerateLeagueMatchupDraftSectionContentInput
):
  | {
      content: string;
      ok: true;
    }
  | {
      error: string;
      ok: false;
    } {
  const content = generateDraftWithPlaceholderProvider(input)[input.sectionKey];
  const promptLeakage = findPromptLeakageInSection(input.sectionKey, content);

  if (promptLeakage) {
    logPromptLeakageRejection({
      input,
      provider: "placeholder",
      rejectedSections: [promptLeakage],
    });

    return {
      error: formatPromptLeakageError([promptLeakage]),
      ok: false,
    };
  }

  return {
    content,
    ok: true,
  };
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
      allowFallback: true,
      error: "AI provider returned draft content in an unexpected format.",
      ok: false,
    };
  }

  const normalizedDraft = normalizeDraftAbilityReferences({
    draft,
    enemyChampionName: championBName,
    enemyChampionProfile: championBProfile,
    playerChampionName: championAName,
    playerChampionProfile: championAProfile,
  });
  const promptLeakage = findPromptLeakageInDraft(normalizedDraft);

  if (promptLeakage.length > 0) {
    logPromptLeakageRejection({
      input: {
        adminNotes,
        championAName,
        championAProfile,
        championBName,
        championBProfile,
        existingSections,
        role,
      },
      provider: "openai",
      rejectedSections: promptLeakage,
    });

    return {
      allowFallback: false,
      error: formatPromptLeakageError(promptLeakage),
      ok: false,
    };
  }

  return {
    draft: normalizedDraft,
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
      allowFallback: true,
      error: "AI provider returned draft card content in an unexpected format.",
      ok: false,
    };
  }

  const normalizedSection = normalizeSectionAbilityReferences(
    section,
    {
      championName: championAName,
      profile: championAProfile,
    },
    {
      championName: championBName,
      profile: championBProfile,
    }
  );
  const promptLeakage = findPromptLeakageInSection(sectionKey, normalizedSection);

  if (promptLeakage) {
    logPromptLeakageRejection({
      input: {
        adminNotes,
        championAName,
        championAProfile,
        championBName,
        championBProfile,
        existingSections,
        role,
        sectionKey,
      },
      provider: "openai",
      rejectedSections: [promptLeakage],
    });

    return {
      allowFallback: false,
      error: formatPromptLeakageError([promptLeakage]),
      ok: false,
    };
  }

  return {
    content: normalizedSection,
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
      allowFallback?: boolean;
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
      allowFallback: true,
      error: "AI provider could not be reached.",
      ok: false,
    };
  }

  if (!response.ok) {
    const errorBody = await readOpenAIError(response);

    return {
      allowFallback: true,
      error: `AI provider failed: ${errorBody}`,
      ok: false,
    };
  }

  let responseBody: OpenAIResponseBody;

  try {
    responseBody = (await response.json()) as OpenAIResponseBody;
  } catch {
    return {
      allowFallback: true,
      error: "AI provider returned an unreadable response.",
      ok: false,
    };
  }

  if (responseBody.error?.message) {
    return {
      allowFallback: true,
      error: `AI provider failed: ${responseBody.error.message}`,
      ok: false,
    };
  }

  const outputText = getOpenAIOutputText(responseBody);

  if (!outputText) {
    return {
      allowFallback: true,
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
  if (role === "jungle") {
    return {
      danger_windows: [
        `- Respect ${enemyChampionName}'s strongest invade, river, or objective fight timing before walking into fog.`,
        `- Avoid isolated jungle fights after ${playerChampionName} spends mobility, Smite, or defensive cooldowns.`,
        "- Treat missing lane priority around Scuttle, dragon, Void Grubs, or Herald as a forced caution window.",
      ].join("\n"),
      early_game: [
        "- Choose the first clear around lane priority and the enemy jungler's level 3 threat.",
        `- Path ${playerChampionName} toward the first river move only when nearby lanes can collapse first.`,
        "- Cross-map camps or gank opposite side instead of flipping a bad Scuttle fight.",
      ].join("\n"),
      overview: [
        `- Identify whether ${playerChampionName} should invade, full clear, contest river, trade objectives, or deny ${enemyChampionName}'s scaling window.`,
        "- Play early pathing around lane priority before flipping Scuttle, invade, dragon, or Void Grubs fights.",
        `- Deny ${enemyChampionName}'s setup by tracking camps and trading sides when direct fights are bad.`,
      ].join("\n"),
      power_spikes: [
        `- Slow the game down when ${enemyChampionName} reaches a real level, ultimate, item, objective, or dueling breakpoint.`,
        `- Push tempo when ${playerChampionName}'s clear speed, dueling, gank, or objective setup becomes stronger.`,
        "- Re-check river fights after first recall, level 6, and first major item because the matchup can flip.",
      ].join("\n"),
      trading_pattern: [
        `- Build ${playerChampionName}'s jungle plan around first clear, river control, and whether the first Scuttle is contestable.`,
        `- Invade ${enemyChampionName} only when nearby lanes can move or the enemy jungler is tracked on the opposite side.`,
        "- Convert tempo leads into Void Grubs, dragon, Herald, counter-jungle camps, or scaling denial.",
      ].join("\n"),
      win_conditions: [
        `- Turn ${playerChampionName}'s jungle tempo into objective access and repeatable gank pressure.`,
        `- Deny ${enemyChampionName} the clears, objective setups, or scaling windows that let them play on their terms.`,
        "- Use cross-map trades when direct river fights are not favorable.",
      ].join("\n"),
    };
  }

  return {
    danger_windows: [
      `- ${enemyChampionName} can threaten lethal when engage or burst tools are ready.`,
      `- Avoid all-in windows after ${playerChampionName} spends mobility or defensive crowd control.`,
      "- Treat jungle fog and missing summoners as forced caution.",
    ].join("\n"),
    early_game: [
      "- Hold the wave in a lane state that allows short trades.",
      `- Let ${playerChampionName} establish safe spacing before forcing pressure.`,
      "- Preserve health before the first meaningful level breakpoint.",
    ].join("\n"),
    overview: [
      `- Identify whether ${playerChampionName} should pressure lane, deny free farm, or wait for a safer cooldown window into ${enemyChampionName}.`,
      `- Adapt spacing and wave state around ${enemyChampionName}'s main threat instead of giving a free all-in.`,
      `- Turn ${playerChampionName}'s best lane pattern into CS denial, priority, roam timing, or objective access.`,
    ].join("\n"),
    power_spikes: [
      `- Respect ${enemyChampionName}'s real level, ultimate, first-item, or major cooldown breakpoint before forcing trades.`,
      `- Push harder when ${playerChampionName}'s own level, item, or cooldown breakpoint creates a better trade window.`,
      "- Reassess trades after recalls and level 6 because the lane threat can flip quickly.",
    ].join("\n"),
    trading_pattern: [
      `- Trade in short windows until ${playerChampionName}'s matchup pattern is clear.`,
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

const promptLeakagePatterns = [
  {
    label: "review",
    pattern: /\breview(?:ed|ing)?\b/i,
  },
  {
    label: "list only",
    pattern: /\blist only\b/i,
  },
  {
    label: "keep",
    pattern: /\bkeep\b/i,
  },
  {
    label: "before publishing",
    pattern: /\bbefore publishing\b/i,
  },
  {
    label: "verified",
    pattern: /\bverified\b/i,
  },
  {
    label: "output",
    pattern: /\boutput\b/i,
  },
  {
    label: "instruction",
    pattern: /\binstructions?\b/i,
  },
  {
    label: "json",
    pattern: /\bjson\b/i,
  },
  {
    label: "schema",
    pattern: /\bschema\b/i,
  },
  {
    label: "section",
    pattern: /\bsections?\b/i,
  },
  {
    label: "bullet",
    pattern: /\bbullets?\b/i,
  },
  {
    label: "admin",
    pattern: /\badmins?\b/i,
  },
  {
    label: "publishing",
    pattern: /\bpublishing\b/i,
  },
  {
    label: "return",
    pattern: /\breturn\b/i,
  },
  {
    label: "rewrite",
    pattern: /\brewrite\b/i,
  },
  {
    label: "source profile",
    pattern: /\bsource profile\b/i,
  },
  {
    label: "supplied profile",
    pattern: /\bsupplied profile\b/i,
  },
] as const;

type PromptLeakageSectionRejection = {
  phrases: string[];
  sample: string;
  sectionKey: MatchupDraftSectionKey;
};

function findPromptLeakageInDraft(draft: MatchupDraftSections) {
  return matchupDraftSectionKeys
    .map((sectionKey) => findPromptLeakageInSection(sectionKey, draft[sectionKey]))
    .filter((rejection): rejection is PromptLeakageSectionRejection =>
      Boolean(rejection)
    );
}

function findPromptLeakageInSection(
  sectionKey: MatchupDraftSectionKey,
  content: string
): PromptLeakageSectionRejection | null {
  const phrases = promptLeakagePatterns
    .filter(({ pattern }) => pattern.test(content))
    .map(({ label }) => label);

  if (phrases.length === 0) {
    return null;
  }

  return {
    phrases,
    sample: getPromptLeakageSample(content, phrases),
    sectionKey,
  };
}

function getPromptLeakageSample(content: string, phrases: string[]) {
  const matchingLine =
    content
      .split("\n")
      .find((line) =>
        promptLeakagePatterns.some(
          ({ label, pattern }) => phrases.includes(label) && pattern.test(line)
        )
      ) ?? content;

  return matchingLine.trim().slice(0, 180);
}

function formatPromptLeakageError(
  rejectedSections: PromptLeakageSectionRejection[]
) {
  const sectionList = rejectedSections
    .map(({ phrases, sectionKey }) => `${sectionKey} (${phrases.join(", ")})`)
    .join("; ");

  return `Generated matchup draft was rejected because it contained prompt-like language: ${sectionList}. Regenerate the draft.`;
}

function logPromptLeakageRejection({
  input,
  provider,
  rejectedSections,
}: {
  input:
    | GenerateLeagueMatchupDraftContentInput
    | GenerateLeagueMatchupDraftSectionContentInput;
  provider: LeagueMatchupDraftProvider;
  rejectedSections: PromptLeakageSectionRejection[];
}) {
  console.warn("Rejected League matchup draft prompt leakage", {
    enemyChampion: input.championBName,
    playerChampion: input.championAName,
    provider,
    rejectedSections: rejectedSections.map(({ phrases, sample, sectionKey }) => ({
      phrases,
      sample,
      sectionKey,
    })),
    role: input.role,
  });
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
