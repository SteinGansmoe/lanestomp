import type { LeagueChampionKnowledgeProfile } from "./champion-knowledge";

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
  championAProfile?: LeagueChampionKnowledgeProfile | null;
  championAName: string;
  championBProfile?: LeagueChampionKnowledgeProfile | null;
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
  championAProfile,
  championAName,
  championBProfile,
  championBName,
  role,
}: LeagueMatchupDraftPromptInput): LeagueMatchupDraftPrompt {
  const roleLabel = role === "adc" ? "ADC" : role;
  const sourceNotes = adminNotes?.trim() || "No admin notes supplied.";
  const championAContext = formatChampionKnowledgeForPrompt(
    championAName,
    championAProfile
  );
  const championBContext = formatChampionKnowledgeForPrompt(
    championBName,
    championBProfile
  );

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
      "Treat supplied champion profiles as factual constraints. If model memory conflicts with the profiles, follow the profiles.",
      "Do not invent crowd control, stealth, sustain, shields, damage type, or power spikes that are absent from the supplied profiles.",
      "Mention uncertainty briefly only when matchup advice may vary by patch, skill bracket, build, or lane state.",
      "Avoid vague phrases like play safe, look for trades, or scale unless you name the exact timing, resource state, cooldown, or enemy mistake that creates the decision.",
      "Avoid awkward AI wording such as extended melee range, sustained poke after recall, or generic lane dominance.",
    ].join("\n"),
    userPrompt: [
      `Matchup: ${championAName} vs ${championBName}`,
      `Role: ${roleLabel}`,
      `Admin notes or source context: ${sourceNotes}`,
      "",
      "Structured champion profiles:",
      `Champion A profile:\n${championAContext}`,
      `Champion B profile:\n${championBContext}`,
      "",
      "Write JSON for these exact keys: overview, early_game, trading_pattern, power_spikes, danger_windows, itemization_notes, win_conditions.",
      "Each value must be a newline-separated bullet list.",
      "Use 1-3 bullets per key, never more.",
      "Each bullet must be one short actionable sentence.",
      "Start every bullet with '- '.",
      "Do not use paragraphs.",
      "Do not repeat wave control, spacing, or cooldown tracking across sections unless that concept is uniquely relevant to the section.",
      "If a concept belongs in one section, do not restate it elsewhere.",
      "Use the structured champion profiles to decide damage type, crowd control, mobility, sustain, shields, stealth, trading patterns, lane identity, and real spikes.",
      "Only reference abilities, crowd control, shields, sustain, stealth, or power spikes that appear in the profiles or admin notes.",
      "If a champion profile says a champion has no hard crowd control, do not describe that champion as having hard crowd control.",
      "If a champion profile is missing, avoid specific ability claims for that champion unless supplied by admin notes.",
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
      "- Do not invent crowd control, sustain, shields, stealth, or a combat use for utility-only abilities.",
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

function formatChampionKnowledgeForPrompt(
  championName: string,
  profile?: LeagueChampionKnowledgeProfile | null
) {
  if (!profile) {
    return [
      `name: ${championName}`,
      "profile_status: missing",
      "constraint: Avoid specific ability, crowd control, sustain, shield, stealth, item, or spike claims unless admin notes provide them.",
    ].join("\n");
  }

  return [
    `name: ${profile.name}`,
    `primary_roles: ${formatList(profile.primaryRoles)}`,
    `damage_type: ${profile.damageType}`,
    `archetype: ${formatList(profile.archetype)}`,
    `mobility_level: ${profile.mobilityLevel}`,
    `hard_crowd_control: ${formatList(profile.hardCrowdControl)}`,
    `soft_crowd_control: ${formatList(profile.softCrowdControl)}`,
    `stealth_or_invisibility: ${profile.stealthOrInvisibility ?? "none"}`,
    `sustain: ${formatList(profile.sustain)}`,
    `shields: ${formatList(profile.shields)}`,
    `primary_trading_pattern: ${profile.primaryTradingPattern}`,
    `lane_identity: ${profile.laneIdentity}`,
    `major_power_spikes: ${formatList(profile.majorPowerSpikes)}`,
    `important_ability_notes: ${formatList(profile.importantAbilityNotes)}`,
    `common_weaknesses: ${formatList(profile.commonWeaknesses)}`,
  ].join("\n");
}

function formatList(values: readonly string[]) {
  return values.length > 0 ? values.join("; ") : "none";
}
