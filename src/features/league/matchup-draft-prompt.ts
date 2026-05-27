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
      "Return practical, matchup-specific gameplay advice, not generic coaching.",
      "Every section must explain concrete conditions: cooldowns, punish windows, danger windows, trading patterns, power spikes, and item or rune adaptation.",
      "Never claim winrates, exact patch facts, item/stat changes, or matchup certainty unless supplied by admin notes.",
      "Mention uncertainty where matchup advice may vary by patch, skill bracket, build, or lane state.",
      "Avoid vague phrases like play safe, look for trades, or scale into late game unless you explain the exact condition that makes the advice useful.",
    ].join("\n"),
    userPrompt: [
      `Matchup: ${championAName} vs ${championBName}`,
      `Role: ${roleLabel}`,
      `Admin notes or source context: ${sourceNotes}`,
      "",
      "Write JSON for these exact keys: overview, early_game, trading_pattern, power_spikes, danger_windows, itemization_notes, win_conditions.",
      "Use 1-3 concise sentences per key. Each sentence should help a player make a decision in lane or around a fight.",
      "",
      "Quality bar example:",
      "Respect Akali when Twilight Shroud is available. Trade more aggressively when Shroud is down or when she has spent energy clearing wave.",
      "",
      "Section requirements:",
      "overview: Explain the core matchup plan and the highest-priority thing to track.",
      "early_game: Describe first-wave or early-lane priorities, including spacing, wave state, or ability cooldown conditions.",
      "trading_pattern: Explain when short trades, extended trades, all-ins, or disengage patterns are good or risky.",
      "power_spikes: Identify level, ultimate, first-item, or cooldown-based spike ideas without inventing patch-specific numbers.",
      "danger_windows: Call out what makes the opponent dangerous and what conditions should change the player's behavior.",
      "itemization_notes: Suggest adaptive item or rune priorities by damage type, sustain, crowd control, burst, or scaling pressure without naming patch-sensitive stats as facts.",
      "win_conditions: Explain how to convert the matchup into lane control, map pressure, teamfight value, or side-lane value with specific conditions.",
      "",
      "Avoid generic output:",
      "- Do not say play safe unless you explain what cooldown, wave state, or enemy spike requires caution.",
      "- Do not say look for trades unless you explain what enemy cooldown, resource state, or positioning mistake creates the trade.",
      "- Do not say scale into late game unless you explain how the player survives lane and what later condition improves.",
    ].join("\n"),
  };
}
