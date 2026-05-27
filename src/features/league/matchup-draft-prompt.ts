export type LeagueRole = "mid" | "top" | "jungle" | "adc" | "support";

export const matchupDraftSectionKeys = [
  "overview",
  "early_game",
  "trading_pattern",
  "power_spikes",
  "danger_windows",
  "itemization_notes",
  "win_conditions",
] as const;

export type MatchupDraftSectionKey = (typeof matchupDraftSectionKeys)[number];

export type MatchupDraftSections = Record<MatchupDraftSectionKey, string>;

export const matchupDraftSchema = {
  type: "object",
  additionalProperties: false,
  properties: Object.fromEntries(
    matchupDraftSectionKeys.map((key) => [
      key,
      {
        type: "string",
      },
    ])
  ),
  required: matchupDraftSectionKeys,
};

export type LeagueMatchupDraftPromptInput = {
  adminNotes: string | null;
  championAName: string;
  championBName: string;
  role: LeagueRole;
};

export type LeagueMatchupDraftPrompt = {
  systemPrompt: string;
  userPrompt: string;
};

// This builder is the provider-facing prompt contract for League draft generation.
// Keep it independent from the OpenAI call so future provider swaps reuse the same quality bar.
export function buildLeagueMatchupDraftPrompt({
  adminNotes,
  championAName,
  championBName,
  role,
}: LeagueMatchupDraftPromptInput): LeagueMatchupDraftPrompt {
  const roleLabel = role === "adc" ? "ADC" : role;
  const sourceNotes = adminNotes?.trim() || "No admin notes supplied.";

  return {
    systemPrompt: [
      "You write League of Legends matchup draft notes for SeasonTracker admins.",
      "Return compact, matchup-specific coaching bullets, not long-form articles.",
      "Every section must prioritize concrete conditions: cooldown windows, punish opportunities, lane control, trading timing, power spikes, and item or rune adaptation.",
      "Keep the output fast to scan during champion select or loading screen.",
      "Avoid repeating the same idea across sections.",
      "Never claim winrates, exact patch facts, item/stat changes, or matchup certainty unless supplied by admin notes.",
      "Mention uncertainty briefly only when matchup advice may vary by patch, skill bracket, build, or lane state.",
      "Avoid vague phrases like play safe, look for trades, or scale unless you name the exact cooldown, wave state, resource state, or enemy mistake that creates the decision.",
    ].join("\n"),
    userPrompt: [
      `Matchup: ${championAName} vs ${championBName}`,
      `Role: ${roleLabel}`,
      `Admin notes or source context: ${sourceNotes}`,
      "",
      "Write JSON for these exact keys: overview, early_game, trading_pattern, power_spikes, danger_windows, itemization_notes, win_conditions.",
      "Each value must be a newline-separated bullet list.",
      "Use 2-4 bullets per key. Use 5 bullets only when admin notes demand extra detail.",
      "Each bullet must be one short actionable sentence.",
      "Start every bullet with '- '.",
      "Do not use paragraphs.",
      "",
      "Quality bar example:",
      "- Respect Akali while Twilight Shroud is available.",
      "- Trade harder when Shroud is down or she spends energy on the wave.",
      "",
      "Section requirements:",
      "overview: State the core plan and the single highest-priority thing to track.",
      "early_game: Cover first-wave control, spacing, and early cooldown conditions.",
      "trading_pattern: Name when short trades, extended trades, all-ins, or disengages are favored.",
      "power_spikes: Identify level, ultimate, first-item, or cooldown-based timing ideas without inventing patch-specific numbers.",
      "danger_windows: Call out what makes the opponent dangerous and what condition should change the player's behavior.",
      "itemization_notes: Suggest adaptive item or rune priorities by damage type, sustain, crowd control, burst, or scaling pressure without patch-sensitive stat claims.",
      "win_conditions: Explain how to convert the matchup into lane control, map pressure, teamfight value, or side-lane value.",
      "",
      "Avoid generic output:",
      "- Do not say play safe unless you explain what cooldown, wave state, or enemy spike requires caution.",
      "- Do not say look for trades unless you explain what enemy cooldown, resource state, or positioning mistake creates the trade.",
      "- Do not say scale into late game unless you explain how the player survives lane and what later condition improves.",
    ].join("\n"),
  };
}
