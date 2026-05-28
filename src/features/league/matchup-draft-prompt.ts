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
      "You write League of Legends matchup draft notes for LaneTips admins.",
      "Return compact, matchup-specific coaching bullets, not long-form articles.",
      "Use at most 3 bullets per section.",
      "Every section must serve a distinct gameplay purpose and avoid repeating advice from another section.",
      "Keep the output fast to scan during champion select or loading screen.",
      "Use direct League player language with concrete matchup decisions.",
      "Prefer correct, limited advice over filling every section with weak guesses.",
      "Never claim winrates, exact patch facts, item/stat changes, or matchup certainty unless supplied by admin notes.",
      "Do not invent ability timing, cooldown interactions, item recommendations, or lane dynamics.",
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
      "Use 1-3 bullets per key, never more.",
      "Each bullet must be one short actionable sentence.",
      "Start every bullet with '- '.",
      "Do not use paragraphs.",
      "Do not repeat wave control, spacing, or cooldown tracking across sections unless that concept is uniquely relevant to the section.",
      "If a concept belongs in one section, do not restate it elsewhere.",
      "Use natural League terms such as wave on your side, punish cooldowns, avoid all-in windows, short trades, spacing, roam timers, freeze, crash, slow push, and reset only when they fit the role and lane.",
      "Avoid top-lane-only concepts unless the selected role and champions clearly make them relevant.",
      "For mid lane, avoid long-freeze advice; use keep the wave on your side, crash, reset, roam timer, or punish roam only when the lane state supports it.",
      "If you are unsure whether a specific item is realistic for the selected champion, describe the defensive or offensive need instead of naming the item.",
      "",
      "Quality bar examples:",
      "- Hold Charm for Akali E recast or when she commits forward.",
      "- Back away when Akali uses Shroud; that is her trading window.",
      "- If Akali roams and Ahri cannot follow, hard push, ping danger, and punish with plates.",
      "",
      "Section requirements:",
      "overview: Use 1-2 bullets only if you can add a non-obvious matchup identity truth; never restate champion names, role, or advice covered below.",
      "early_game: Cover first waves, levels 1-6, wave position, and real punish windows. Avoid contradicting champion threat windows.",
      "trading_pattern: Explain exact interaction rules, ability timing examples, engage/disengage logic, and cooldown punish windows.",
      "power_spikes: List only real spikes such as level 2/3 ability access, level 6 ultimate, first completed items, and major cooldown or item breakpoints.",
      "power_spikes: Never mention recalls, mana refreshes, Lost Chapter sustain, generic tempo, or non-spike ability unlocks here.",
      "danger_windows: List moments where the player is actually in danger from lethal trades, all-ins, ganks, dives, or forced summoners.",
      "danger_windows: If the enemy roams and the player cannot follow, say to hard push, take plates, ping danger, or punish the roam; do not frame the roam itself as direct lane danger.",
      "itemization_notes: Give practical matchup adaptation only. Avoid generic item dumps or full builds.",
      "itemization_notes: Into AP assassins, mention early magic resist, Mercs, or Banshee's only when behind, dying, or facing multiple AP threats.",
      "win_conditions: Explain how this champion wins lane or game in practical terms, without repeating early lane instructions.",
      "",
      "Negative examples to avoid:",
      "- Do not say play safe unless you explain what cooldown, wave state, or enemy spike requires caution.",
      "- Do not say look for trades unless you explain what enemy cooldown, resource state, or positioning mistake creates the trade.",
      "- Do not say scale into late game unless you explain how the player survives lane and what later condition improves.",
      "- Do not recommend Morellonomicon just because the enemy has minor healing.",
      "- Do not recommend AD items to AP champions, including Hexdrinker for a mage.",
      "- Do not invent ability timing or claim an ability spike that is not real.",
      "- Do not say Twilight Shroud is Akali's level 6 spike.",
      "- Do not treat Lost Chapter sustain or recall timing as a power spike.",
      "- Do not claim Ahri E cooldown reduction as a core spike.",
      "",
      "Final validation before returning JSON:",
      "- Is this advice actually true for this role?",
      "- Is each power_spikes bullet a real power spike?",
      "- Is each named item realistic for this champion?",
      "- Can a player use this in champion select within 15-20 seconds?",
    ].join("\n"),
  };
}
