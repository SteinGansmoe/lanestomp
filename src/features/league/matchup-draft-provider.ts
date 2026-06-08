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
const openaiMaxGenerationAttempts = 2;

export async function generateLeagueMatchupDraftContent(
  input: GenerateLeagueMatchupDraftContentInput,
): Promise<GenerateLeagueMatchupDraftContentResult> {
  const profileWarning = getMissingChampionProfileWarning(input);

  if (!openaiApiKey) {
    return {
      error:
        "AI provider is not configured. OPENAI_API_KEY is required before matchup drafts can be generated.",
      ok: false,
    };
  }

  let openaiResult: GenerateLeagueMatchupDraftContentResult | null = null;

  for (let attempt = 1; attempt <= openaiMaxGenerationAttempts; attempt += 1) {
    openaiResult = await generateDraftWithOpenAIProvider(input);

    if (openaiResult.ok) {
      logOpenAIRetrySuccess({
        attempt,
        championAName: input.championAName,
        championBName: input.championBName,
        role: input.role,
      });

      return {
        ...openaiResult,
        profileWarning,
      };
    }

    logOpenAIRetryFailure({
      attempt,
      championAName: input.championAName,
      championBName: input.championBName,
      error: openaiResult.error,
      role: input.role,
    });
  }

  return {
    error: formatOpenAIAttemptFailure(
      openaiResult?.error ?? "AI provider did not return a result.",
    ),
    ok: false,
  };
}

export async function generateLeagueMatchupDraftSectionContent(
  input: GenerateLeagueMatchupDraftSectionContentInput,
): Promise<GenerateLeagueMatchupDraftSectionContentResult> {
  const profileWarning = getMissingChampionProfileWarning(input);

  if (!openaiApiKey) {
    return {
      error:
        "AI provider is not configured. OPENAI_API_KEY is required before matchup draft cards can be generated.",
      ok: false,
    };
  }

  let openaiResult: GenerateLeagueMatchupDraftSectionContentResult | null = null;

  for (let attempt = 1; attempt <= openaiMaxGenerationAttempts; attempt += 1) {
    openaiResult = await generateDraftSectionWithOpenAIProvider(input);

    if (openaiResult.ok) {
      logOpenAIRetrySuccess({
        attempt,
        championAName: input.championAName,
        championBName: input.championBName,
        role: input.role,
        sectionKey: input.sectionKey,
      });

      return {
        ...openaiResult,
        profileWarning,
      };
    }

    logOpenAIRetryFailure({
      attempt,
      championAName: input.championAName,
      championBName: input.championBName,
      error: openaiResult.error,
      role: input.role,
      sectionKey: input.sectionKey,
    });
  }

  return {
    error: formatOpenAIAttemptFailure(
      openaiResult?.error ?? "AI provider did not return a result.",
    ),
    ok: false,
  };
}

function formatOpenAIAttemptFailure(error: string) {
  return `AI generation failed after ${openaiMaxGenerationAttempts} attempts. Last error: ${error}`;
}

function logOpenAIRetryFailure({
  attempt,
  championAName,
  championBName,
  error,
  role,
  sectionKey,
}: {
  attempt: number;
  championAName: string;
  championBName: string;
  error: string;
  role: LeagueRole;
  sectionKey?: MatchupDraftSectionKey;
}) {
  console.warn("League matchup generation attempt failed", {
    attempt,
    championAName,
    championBName,
    error,
    nextAttempt: attempt < openaiMaxGenerationAttempts ? attempt + 1 : null,
    role,
    sectionKey: sectionKey ?? null,
  });
}

function logOpenAIRetrySuccess({
  attempt,
  championAName,
  championBName,
  role,
  sectionKey,
}: {
  attempt: number;
  championAName: string;
  championBName: string;
  role: LeagueRole;
  sectionKey?: MatchupDraftSectionKey;
}) {
  if (attempt === 1) {
    return;
  }

  console.info("League matchup generation retry succeeded", {
    attempt,
    championAName,
    championBName,
    role,
    sectionKey: sectionKey ?? null,
  });
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
    " and ",
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

  const supportFarmingLanguage =
    role === "support" ? findSupportFarmingLanguageInDraft(normalizedDraft) : [];

  if (supportFarmingLanguage.length > 0) {
    logSupportFarmingLanguageRejection({
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
      rejectedSections: supportFarmingLanguage,
    });

    const rewriteResult = await rewriteSupportDraftWithoutFarmingLanguage(
      {
        adminNotes,
        championAName,
        championAProfile,
        championBName,
        championBProfile,
        existingSections,
        role,
      },
      normalizedDraft,
      supportFarmingLanguage,
    );

    if (rewriteResult.ok) {
      logSupportFarmingLanguageRewriteSuccess({
        championAName,
        championBName,
        role,
      });

      return rewriteResult;
    }

    logSupportFarmingLanguageRewriteFailure({
      championAName,
      championBName,
      error: rewriteResult.error,
      role,
    });

    return {
      allowFallback: false,
      error: rewriteResult.error,
      ok: false,
    };
  }

  const promptLanguageWarnings = findPromptLanguageWarningsInDraft(normalizedDraft);

  if (promptLanguageWarnings.length > 0) {
    logPromptLanguageWarnings({
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
      warnings: promptLanguageWarnings,
    });
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
    },
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

  const supportFarmingLanguage =
    role === "support"
      ? findSupportFarmingLanguageInSection(sectionKey, normalizedSection)
      : null;

  if (supportFarmingLanguage) {
    logSupportFarmingLanguageRejection({
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
      rejectedSections: [supportFarmingLanguage],
    });

    const rewriteResult = await rewriteSupportDraftSectionWithoutFarmingLanguage(
      {
        adminNotes,
        championAName,
        championAProfile,
        championBName,
        championBProfile,
        existingSections,
        role,
        sectionKey,
      },
      normalizedSection,
      [supportFarmingLanguage],
    );

    if (rewriteResult.ok) {
      logSupportFarmingLanguageRewriteSuccess({
        championAName,
        championBName,
        role,
        sectionKey,
      });

      return rewriteResult;
    }

    logSupportFarmingLanguageRewriteFailure({
      championAName,
      championBName,
      error: rewriteResult.error,
      role,
      sectionKey,
    });

    return {
      allowFallback: false,
      error: rewriteResult.error,
      ok: false,
    };
  }

  const promptLanguageWarning = findPromptLanguageWarningsInSection(sectionKey, normalizedSection);

  if (promptLanguageWarning) {
    logPromptLanguageWarnings({
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
      warnings: [promptLanguageWarning],
    });
  }

  return {
    content: normalizedSection,
    ok: true,
    provider: "openai",
  };
}

async function rewriteSupportDraftWithoutFarmingLanguage(
  input: GenerateLeagueMatchupDraftContentInput,
  rejectedDraft: MatchupDraftSections,
  rejectedSections: PromptLeakageSectionRejection[],
): Promise<GenerateLeagueMatchupDraftContentResult> {
  const prompt = buildLeagueMatchupDraftPrompt({
    adminNotes: buildSupportFarmingRewriteAdminNotes(input.adminNotes, rejectedSections),
    enemyChampionProfile: input.championBProfile,
    enemyChampionName: input.championBName,
    existingSections: rejectedDraft,
    playerChampionProfile: input.championAProfile,
    playerChampionName: input.championAName,
    role: input.role,
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
      allowFallback: false,
      error: "AI provider returned rewritten draft content in an unexpected format.",
      ok: false,
    };
  }

  const normalizedDraft = normalizeDraftAbilityReferences({
    draft,
    enemyChampionName: input.championBName,
    enemyChampionProfile: input.championBProfile,
    playerChampionName: input.championAName,
    playerChampionProfile: input.championAProfile,
  });
  const promptLeakage = findPromptLeakageInDraft(normalizedDraft);

  if (promptLeakage.length > 0) {
    logPromptLeakageRejection({
      input,
      provider: "openai",
      rejectedSections: promptLeakage,
    });

    return {
      allowFallback: false,
      error: formatPromptLeakageError(promptLeakage),
      ok: false,
    };
  }

  const supportFarmingLanguage = findSupportFarmingLanguageInDraft(normalizedDraft);

  if (supportFarmingLanguage.length > 0) {
    logSupportFarmingLanguageRejection({
      input,
      provider: "openai",
      rejectedSections: supportFarmingLanguage,
    });

    return {
      allowFallback: false,
      error: formatSupportFarmingLanguageError(supportFarmingLanguage),
      ok: false,
    };
  }

  const promptLanguageWarnings = findPromptLanguageWarningsInDraft(normalizedDraft);

  if (promptLanguageWarnings.length > 0) {
    logPromptLanguageWarnings({
      input,
      provider: "openai",
      warnings: promptLanguageWarnings,
    });
  }

  return {
    draft: normalizedDraft,
    ok: true,
    provider: "openai",
  };
}

async function rewriteSupportDraftSectionWithoutFarmingLanguage(
  input: GenerateLeagueMatchupDraftSectionContentInput,
  rejectedSection: string,
  rejectedSections: PromptLeakageSectionRejection[],
): Promise<GenerateLeagueMatchupDraftSectionContentResult> {
  const prompt = buildLeagueMatchupDraftPrompt({
    adminNotes: buildSupportFarmingRewriteAdminNotes(input.adminNotes, rejectedSections),
    enemyChampionProfile: input.championBProfile,
    enemyChampionName: input.championBName,
    existingSections: {
      ...(input.existingSections ?? {}),
      [input.sectionKey]: rejectedSection,
    },
    playerChampionProfile: input.championAProfile,
    playerChampionName: input.championAName,
    role: input.role,
    targetSection: input.sectionKey,
  });
  const responseResult = await requestOpenAIDraft({
    prompt,
    schema: createMatchupDraftSchema([input.sectionKey]),
    schemaName: "league_matchup_draft_section",
  });

  if (!responseResult.ok) {
    return responseResult;
  }

  const section = parseDraftSection(responseResult.outputText, input.sectionKey);

  if (!section) {
    return {
      allowFallback: false,
      error: "AI provider returned rewritten draft card content in an unexpected format.",
      ok: false,
    };
  }

  const normalizedSection = normalizeSectionAbilityReferences(
    section,
    {
      championName: input.championAName,
      profile: input.championAProfile,
    },
    {
      championName: input.championBName,
      profile: input.championBProfile,
    },
  );
  const promptLeakage = findPromptLeakageInSection(input.sectionKey, normalizedSection);

  if (promptLeakage) {
    logPromptLeakageRejection({
      input,
      provider: "openai",
      rejectedSections: [promptLeakage],
    });

    return {
      allowFallback: false,
      error: formatPromptLeakageError([promptLeakage]),
      ok: false,
    };
  }

  const supportFarmingLanguage = findSupportFarmingLanguageInSection(
    input.sectionKey,
    normalizedSection,
  );

  if (supportFarmingLanguage) {
    logSupportFarmingLanguageRejection({
      input,
      provider: "openai",
      rejectedSections: [supportFarmingLanguage],
    });

    return {
      allowFallback: false,
      error: formatSupportFarmingLanguageError([supportFarmingLanguage]),
      ok: false,
    };
  }

  const promptLanguageWarning = findPromptLanguageWarningsInSection(
    input.sectionKey,
    normalizedSection,
  );

  if (promptLanguageWarning) {
    logPromptLanguageWarnings({
      input,
      provider: "openai",
      warnings: [promptLanguageWarning],
    });
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
    const parsed = JSON.parse(outputText) as Partial<Record<MatchupDraftSectionKey, unknown>>;

    if (
      matchupDraftSectionKeys.every((key) => typeof parsed[key] === "string" && parsed[key].trim())
    ) {
      return Object.fromEntries(
        matchupDraftSectionKeys.map((key) => [
          key,
          normalizeDraftSection(parsed[key]?.toString() ?? ""),
        ]),
      ) as MatchupDraftSections;
    }
  } catch {
    return null;
  }

  return null;
}

function parseDraftSection(outputText: string, sectionKey: MatchupDraftSectionKey) {
  try {
    const parsed = JSON.parse(outputText) as Partial<Record<MatchupDraftSectionKey, unknown>>;
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

type PromptLeakagePattern = {
  label: string;
  pattern: RegExp;
  sectionKeys?: readonly MatchupDraftSectionKey[];
};

const promptLeakagePatterns: readonly PromptLeakagePattern[] = [
  {
    label: "review prompt opening",
    pattern: /(^|\n)-\s*review\b/i,
  },
  {
    label: "analyze prompt opening",
    pattern: /(^|\n)-\s*analy[sz]e\b/i,
  },
  {
    label: "re-check prompt opening",
    pattern: /(^|\n)-\s*re-?check\b/i,
  },
  {
    label: "list-only fallback wording",
    pattern: /\blist only\b/i,
  },
  {
    label: "keep broad notes fallback wording",
    pattern: /\bkeep broad notes\b/i,
  },
  {
    label: "before publishing prompt wording",
    pattern: /\bbefore publishing\b/i,
  },
  {
    label: "generated matchup prompt wording",
    pattern: /\bgenerated (?:matchup|draft|card)\b/i,
  },
  {
    label: "instruction prompt wording",
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
    label: "admin review prompt wording",
    pattern: /\badmin(?:s|[-\s]+review)?\b/i,
  },
  {
    label: "the output should prompt wording",
    pattern: /\bthe output should\b/i,
  },
  {
    label: "avoid generic prompt wording",
    pattern: /\bavoid generic\b/i,
  },
  {
    label: "writer-facing do-not wording",
    pattern: /(^|\n)-\s*do not\s+(?:write|echo|return|include|use the phrases?|start|say)\b/i,
  },
  {
    label: "returned bullet/value prompt wording",
    pattern: /\breturn(?:ed)? (?:bullet|value|json|section|output)\b/i,
  },
  {
    label: "prompt/source profile wording",
    pattern: /\b(?:prompt|source profile|supplied profile)\b/i,
  },
];

const promptLanguageWarningPatterns: readonly PromptLeakagePattern[] = [
  {
    label: "instruction-like bullet opening",
    pattern: /(^|\n)-\s*(identify|build|choose|respect|treat|explain|list|keep|convert)\b/i,
  },
  {
    label: "generic cross-map phrasing",
    pattern: /\bcross-map trades?\s+when\s+direct\s+river\s+fights\b/i,
  },
  {
    label: "soft power-spike process wording",
    pattern: /(^|\n)-\s*(re-?evaluate|reassess|monitor|watch for|remember to|consider)\b/i,
    sectionKeys: ["power_spikes"],
  },
  {
    label: "soft power-spike flip language",
    pattern: /\b(matchup\s+can\s+flip|can\s+flip\s+quickly)\b/i,
    sectionKeys: ["power_spikes"],
  },
  {
    label: "soft power-spike recall timing",
    pattern: /\b(first recall|after recalls?)\b/i,
    sectionKeys: ["power_spikes"],
  },
  {
    label: "soft generic power-spike placeholder",
    pattern: /\b(real level|slow the game down|push tempo when|level,\s*ultimate,\s*item)\b/i,
    sectionKeys: ["power_spikes"],
  },
];

const supportFarmingLanguagePatterns: readonly PromptLeakagePattern[] = [
  {
    label: "support farming language",
    pattern:
      /\b(?:CS|farm(?:s|ed|ing)?|free farm|deny farm|last[-\s]?hit(?:s|ting)?|last hitting)\b/i,
  },
];

type PromptLeakageSectionRejection = {
  phrases: string[];
  sample: string;
  sectionKey: MatchupDraftSectionKey;
};

type PromptLanguageSectionWarning = PromptLeakageSectionRejection;

function findPromptLeakageInDraft(draft: MatchupDraftSections) {
  return matchupDraftSectionKeys
    .map((sectionKey) => findPromptLeakageInSection(sectionKey, draft[sectionKey]))
    .filter((rejection): rejection is PromptLeakageSectionRejection => Boolean(rejection));
}

function findPromptLeakageInSection(
  sectionKey: MatchupDraftSectionKey,
  content: string,
): PromptLeakageSectionRejection | null {
  return findPromptPatternMatch(sectionKey, content, promptLeakagePatterns);
}

function findPromptLanguageWarningsInDraft(draft: MatchupDraftSections) {
  return matchupDraftSectionKeys
    .map((sectionKey) => findPromptLanguageWarningsInSection(sectionKey, draft[sectionKey]))
    .filter((warning): warning is PromptLanguageSectionWarning => Boolean(warning));
}

function findPromptLanguageWarningsInSection(
  sectionKey: MatchupDraftSectionKey,
  content: string,
): PromptLanguageSectionWarning | null {
  return findPromptPatternMatch(sectionKey, content, promptLanguageWarningPatterns);
}

function findSupportFarmingLanguageInDraft(draft: MatchupDraftSections) {
  return matchupDraftSectionKeys
    .map((sectionKey) => findSupportFarmingLanguageInSection(sectionKey, draft[sectionKey]))
    .filter((rejection): rejection is PromptLeakageSectionRejection => Boolean(rejection));
}

function findSupportFarmingLanguageInSection(
  sectionKey: MatchupDraftSectionKey,
  content: string,
): PromptLeakageSectionRejection | null {
  return findPromptPatternMatch(sectionKey, content, supportFarmingLanguagePatterns);
}

function findPromptPatternMatch(
  sectionKey: MatchupDraftSectionKey,
  content: string,
  patterns: readonly PromptLeakagePattern[],
) {
  const phrases = patterns
    .filter(
      ({ pattern, sectionKeys }) =>
        (!sectionKeys || sectionKeys.includes(sectionKey)) && pattern.test(content),
    )
    .map(({ label }) => label);

  if (phrases.length === 0) {
    return null;
  }

  return {
    phrases,
    sample: getPromptPatternSample(sectionKey, content, phrases, patterns),
    sectionKey,
  };
}

function getPromptPatternSample(
  sectionKey: MatchupDraftSectionKey,
  content: string,
  phrases: string[],
  patterns: readonly PromptLeakagePattern[],
) {
  const matchingLine =
    content
      .split("\n")
      .find((line) =>
        patterns.some(
          ({ label, pattern, sectionKeys }) =>
            phrases.includes(label) &&
            (!sectionKeys || sectionKeys.includes(sectionKey)) &&
            pattern.test(line),
        ),
      ) ?? content;

  return matchingLine.trim().slice(0, 180);
}

function formatPromptLeakageError(rejectedSections: PromptLeakageSectionRejection[]) {
  const sectionList = rejectedSections
    .map(({ phrases, sectionKey }) => `${sectionKey} (${phrases.join(", ")})`)
    .join("; ");

  return `Generated matchup draft was rejected because it contained prompt-like or instruction-style language: ${sectionList}. Regenerate the draft.`;
}

function formatSupportFarmingLanguageError(rejectedSections: PromptLeakageSectionRejection[]) {
  const sectionList = rejectedSections
    .map(({ phrases, sample, sectionKey }) =>
      `${sectionKey} (${phrases.join(", ")}; rejected bullet: ${sample})`,
    )
    .join("; ");

  return `Generated support matchup draft was rejected because it contained CS, farming, or last-hit language: ${sectionList}. Regenerate the draft.`;
}

function buildSupportFarmingRewriteAdminNotes(
  adminNotes: string | null,
  rejectedSections: PromptLeakageSectionRejection[],
) {
  const rejectedBullets = rejectedSections
    .map(
      ({ phrases, sample, sectionKey }) =>
        `- ${sectionKey} (${phrases.join(", ")}): ${sample}`,
    )
    .join("\n");

  return [
    adminNotes?.trim(),
    "Support rewrite retry: the previous output used invalid support economy wording.",
    "Rewrite the affected card text without any CS, farming, farm, free farm, deny farm, last-hit, or last hitting language.",
    "Use ADC access, enemy ADC denial, engage angles, brush control, hook pressure, roam windows, vision control, peel windows, follow-up timing, wave state for ADC safety, and objective setup.",
    `Rejected bullets and reasons:\n${rejectedBullets}`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

function logPromptLeakageRejection({
  input,
  provider,
  rejectedSections,
}: {
  input: GenerateLeagueMatchupDraftContentInput | GenerateLeagueMatchupDraftSectionContentInput;
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

function logSupportFarmingLanguageRejection({
  input,
  provider,
  rejectedSections,
}: {
  input: GenerateLeagueMatchupDraftContentInput | GenerateLeagueMatchupDraftSectionContentInput;
  provider: LeagueMatchupDraftProvider;
  rejectedSections: PromptLeakageSectionRejection[];
}) {
  console.warn("Rejected support matchup draft farming language", {
    enemyChampion: input.championBName,
    playerChampion: input.championAName,
    provider,
    rejectedSections: rejectedSections.map(({ phrases, sample, sectionKey }) => ({
      reason: phrases.join(", "),
      rejectedBullet: sample,
      sectionKey,
    })),
    role: input.role,
  });
}

function logSupportFarmingLanguageRewriteFailure({
  championAName,
  championBName,
  error,
  role,
  sectionKey,
}: {
  championAName: string;
  championBName: string;
  error: string;
  role: LeagueRole;
  sectionKey?: MatchupDraftSectionKey;
}) {
  console.warn("Support matchup farming-language rewrite failed", {
    championAName,
    championBName,
    error,
    role,
    sectionKey: sectionKey ?? null,
  });
}

function logSupportFarmingLanguageRewriteSuccess({
  championAName,
  championBName,
  role,
  sectionKey,
}: {
  championAName: string;
  championBName: string;
  role: LeagueRole;
  sectionKey?: MatchupDraftSectionKey;
}) {
  console.info("Support matchup farming-language rewrite succeeded", {
    championAName,
    championBName,
    role,
    sectionKey: sectionKey ?? null,
  });
}

function logPromptLanguageWarnings({
  input,
  provider,
  warnings,
}: {
  input: GenerateLeagueMatchupDraftContentInput | GenerateLeagueMatchupDraftSectionContentInput;
  provider: LeagueMatchupDraftProvider;
  warnings: PromptLanguageSectionWarning[];
}) {
  console.warn("League matchup draft prompt-language warning", {
    enemyChampion: input.championBName,
    playerChampion: input.championAName,
    provider,
    role: input.role,
    warnings: warnings.map(({ phrases, sample, sectionKey }) => ({
      phrases,
      sample,
      sectionKey,
    })),
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
        },
      ),
    ]),
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

    return (Object.entries(abilities) as Array<[keyof typeof abilities, string]>).reduce(
      (currentText, [abilityKey, abilityName]) => {
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
                  replacement,
                ),
                alias,
                replacement,
              ),
            currentText,
          ),
          abilityKey,
          replacement,
        );

        return normalizeAbilityOwnerReferences(nextText, champion.championName, abilityKey);
      },
      currentSection,
    );
  }, section);
}

function replaceChampionOwnedAbilityAlias(
  text: string,
  championName: string,
  alias: string,
  replacement: string,
) {
  return replaceAbilityAlias(text, `${championName}'s ${alias}`, replacement).replace(
    getAbilityAliasPattern(`${championName} ${alias}`),
    `$1${replacement}`,
  );
}

function replaceAbilityAlias(text: string, alias: string, replacement: string) {
  return text.replace(getAbilityAliasPattern(alias), `$1${replacement}`);
}

function replaceBareAbilityKey(text: string, abilityKey: string, replacement: string) {
  return text.replace(getBareAbilityKeyPattern(abilityKey), `$1${replacement}`);
}

function normalizeAbilityOwnerReferences(text: string, championName: string, abilityKey: string) {
  return text
    .replace(
      getAbilityAliasPattern(`${championName}'s (${championName}'s (${abilityKey}))`),
      `$1(${abilityKey})`,
    )
    .replace(
      getAbilityAliasPattern(`${championName}'s ${championName}'s (${abilityKey})`),
      `$1(${abilityKey})`,
    )
    .replace(
      getAbilityAliasPattern(`${championName} ${championName}'s (${abilityKey})`),
      `$1${championName} (${abilityKey})`,
    )
    .replace(getAbilityAliasPattern(`${championName}'s (${abilityKey})`), `$1(${abilityKey})`)
    .replace(getAbilityAliasPattern(`${championName} (${abilityKey})`), `$1(${abilityKey})`)
    .replace(getAbilityAliasPattern(`((${abilityKey}))`), `$1(${abilityKey})`)
    .replace(getAbilityAliasPattern(`(${abilityKey}) (${abilityKey})`), `$1(${abilityKey})`);
}

function getAbilityAliasPattern(alias: string) {
  return new RegExp(`(^|[^A-Za-z0-9])${escapeRegex(alias)}(?![A-Za-z0-9])`, "gi");
}

function getBareAbilityKeyPattern(abilityKey: string) {
  return new RegExp(`(^|[^A-Za-z0-9(])${escapeRegex(abilityKey)}(?![A-Za-z0-9)])`, "gi");
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
