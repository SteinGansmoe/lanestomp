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
      "Every section must serve a distinct gameplay purpose and avoid repeating advice from another section.",
      "Keep the output fast to scan during champion select or loading screen.",
      "Use direct League player language with concrete matchup decisions.",
      "Never claim winrates, exact patch facts, item/stat changes, or matchup certainty unless supplied by admin notes.",
      "Mention uncertainty briefly only when matchup advice may vary by patch, skill bracket, build, or lane state.",
      "Avoid vague phrases like play safe, look for trades, or scale unless you name the exact timing, resource state, cooldown, or enemy mistake that creates the decision.",
      "Avoid awkward AI wording such as extended melee range, sustained poke after recall, or generic lane dominance.",
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
      "Do not repeat wave control, spacing, or cooldown tracking across sections unless that concept is uniquely relevant to the section.",
      "If a concept belongs in one section, do not restate it elsewhere.",
      "Use natural League terms such as wave on your side, punish cooldowns, avoid all-in windows, short trades, spacing, roam timers, freeze, crash, slow push, and reset only when they fit the role and lane.",
      "Avoid top-lane-only concepts unless the selected role and champions clearly make them relevant.",
      "",
      "Quality bar example:",
      "- Respect Akali while Twilight Shroud is available.",
      "- Trade harder when Shroud is down or she spends energy on the wave.",
      "",
      "Section requirements:",
      "overview: Give only 2-3 high-level matchup identity truths. No detailed trading, item, spike, or danger-window advice.",
      "early_game: Cover lane positioning, early trading, and wave placement before first item or major level spikes. Keep it lane-specific, not matchup-wide.",
      "trading_pattern: Explain exact trade timing, engage/disengage logic, and cooldown punish windows.",
      "power_spikes: List only level spikes, ultimate unlocks, item spikes, and important cooldown breakpoints.",
      "power_spikes: Never mention recalls, mana refreshes, generic sustain, or general lane tempo here.",
      "danger_windows: List moments where the opponent can realistically threaten lethal trades, all-ins, ganks, dives, or forced summoners.",
      "itemization_notes: Give practical matchup adaptation only. Avoid generic item dumps or full builds.",
      "win_conditions: Explain how this champion wins lane or game in practical terms, without repeating early lane instructions.",
      "",
      "Avoid generic output:",
      "- Do not say play safe unless you explain what cooldown, wave state, or enemy spike requires caution.",
      "- Do not say look for trades unless you explain what enemy cooldown, resource state, or positioning mistake creates the trade.",
      "- Do not say scale into late game unless you explain how the player survives lane and what later condition improves.",
    ].join("\n"),
  };
}
