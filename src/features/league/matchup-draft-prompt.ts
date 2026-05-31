import type { LeagueChampionKnowledgeProfile } from "./champion-knowledge/types";

export type LeagueRole = "mid" | "top" | "jungle" | "adc" | "support";

export const matchupDraftSectionKeys = [
  "overview",
  "early_game",
  "trading_pattern",
  "power_spikes",
  "danger_windows",
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
  enemyChampionProfile?: LeagueChampionKnowledgeProfile | null;
  enemyChampionName: string;
  playerChampionProfile?: LeagueChampionKnowledgeProfile | null;
  playerChampionName: string;
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
  enemyChampionProfile,
  enemyChampionName,
  playerChampionProfile,
  playerChampionName,
  role,
}: LeagueMatchupDraftPromptInput): LeagueMatchupDraftPrompt {
  const roleLabel = role === "adc" ? "ADC" : role;
  const sourceNotes = adminNotes?.trim() || "No admin notes supplied.";
  const playerChampionContext = formatChampionKnowledgeForPrompt(
    playerChampionName,
    playerChampionProfile
  );
  const enemyChampionContext = formatChampionKnowledgeForPrompt(
    enemyChampionName,
    enemyChampionProfile
  );

  return {
    systemPrompt: [
      "You write League of Legends matchup draft notes for LaneTips admins.",
      "The output is a coach for the player champion only, not neutral matchup analysis.",
      "Never switch perspective or write advice that helps the enemy pilot their champion.",
      "Use enemy champion facts only to explain threats, respect windows, or punish windows for the player champion.",
      "If a fact describes an enemy weakness, frame it as what the player champion can do with that window.",
      "Return compact, matchup-specific coaching bullets, not long-form articles.",
      "Use at most 3 bullets per section.",
      "Every section must serve a distinct gameplay purpose and avoid repeating advice from another section.",
      "Keep the output fast to scan during champion select or loading screen.",
      "Use direct League player language with concrete matchup decisions.",
      "Prefer correct, limited advice over filling every section with weak guesses.",
      "Never claim winrates, exact patch facts, item/stat changes, or matchup certainty unless supplied by admin notes.",
      "Do not invent ability timing, cooldown interactions, item recommendations, or lane dynamics.",
      "Treat supplied champion combat profiles as the source of truth. If model memory conflicts with the profiles, follow the profiles.",
      "Use danger abilities, primary win conditions, punish windows, damage type, class, and trading pattern from the profiles before relying on assumptions.",
      "Do not invent crowd control, stealth, sustain, shields, damage type, or power spikes that are absent from the supplied profiles.",
      "Do not recommend items that conflict with the champion damage type, class, role, or supplied profile facts.",
      "Mention uncertainty briefly only when matchup advice may vary by patch, skill bracket, build, or lane state.",
      "Avoid vague phrases like play safe, look for trades, or scale unless you name the exact timing, resource state, cooldown, or enemy mistake that creates the decision.",
      "Avoid awkward AI wording such as extended melee range, sustained poke after recall, or generic lane dominance.",
    ].join("\n"),
    userPrompt: [
      `Player champion: ${playerChampionName}`,
      `Enemy champion: ${enemyChampionName}`,
      `Matchup direction: ${playerChampionName} into ${enemyChampionName}`,
      `Role: ${roleLabel}`,
      `Admin notes or source context: ${sourceNotes}`,
      "",
      "Structured champion profiles:",
      `Player champion combat profile:\n${playerChampionContext}`,
      `Enemy champion combat profile:\n${enemyChampionContext}`,
      "",
      "Write JSON for these exact keys: overview, early_game, trading_pattern, power_spikes, danger_windows, win_conditions.",
      "Each value must be a newline-separated bullet list.",
      "Use 1-3 bullets per key, never more.",
      "Each bullet must be one short actionable sentence.",
      "Start every bullet with '- '.",
      "Do not use paragraphs.",
      `Every bullet must directly help a player piloting ${playerChampionName} against ${enemyChampionName}.`,
      `Never write from ${enemyChampionName}'s point of view or tell ${enemyChampionName} what to do.`,
      `When using ${enemyChampionName}'s weaknesses or punish windows, translate them into concrete ${playerChampionName} actions.`,
      `When mentioning ${enemyChampionName}'s strengths, phrase them as respect windows, spacing rules, or lane-state choices for ${playerChampionName}.`,
      "Do not repeat wave control, spacing, or cooldown tracking across sections unless that concept is uniquely relevant to the section.",
      "If a concept belongs in one section, do not restate it elsewhere.",
      "Use the structured champion profiles to decide damage type, crowd control, mobility, sustain, shields, stealth, trading patterns, lane identity, and real spikes.",
      "When structured lanePlan, trading, matchupPreferences, dangerProfile, punishProfile, or powerSpikes fields are supplied, treat them as higher priority than the older summary fields.",
      `Compare ${playerChampionName}'s lanePlan.wants against ${enemyChampionName}'s lanePlan.wants and explain what ${playerChampionName} must deny.`,
      `Compare ${playerChampionName}'s punishProfile.canPunish against ${enemyChampionName}'s dangerProfile.mustRespect and trading.badTradeConditions.`,
      `Compare ${enemyChampionName}'s punishProfile.canPunish and dangerProfile.dangerousWhen against ${playerChampionName}'s trading.badTradeConditions.`,
      "Use primary win conditions, danger abilities, and punish windows as matchup facts for all-ins, spacing, cooldown punish, and danger window advice.",
      "Prefer supplied profile facts over model assumptions, especially for champion abilities, item direction, and class-specific build advice.",
      "Only reference abilities, crowd control, shields, sustain, stealth, or power spikes that appear in the profiles or admin notes.",
      "If a champion profile says a champion has no hard crowd control, do not describe that champion as having hard crowd control.",
      "If a champion profile is missing, avoid specific ability claims for that champion unless supplied by admin notes.",
      "If either profile is missing, keep the draft more conservative and lower-confidence instead of inventing details.",
      "Use natural League terms such as wave on your side, punish cooldowns, avoid all-in windows, short trades, spacing, roam timers, freeze, crash, slow push, and reset only when they fit the role and lane.",
      "Avoid top-lane-only concepts unless the selected role and champions clearly make them relevant.",
      "For mid lane, avoid long-freeze advice; use keep the wave on your side, crash, reset, roam timer, or punish roam only when the lane state supports it.",
      "If defensive adaptation matters, include it briefly in overview as a matchup need rather than naming full items or builds.",
      "",
      "Perspective examples:",
      `- Bad: ${enemyChampionName} is exposed when a key defensive cooldown is down.`,
      `- Better: When ${enemyChampionName}'s key defensive cooldown is down, ${playerChampionName} can step forward for a short trade or wave pressure.`,
      `- Bad: ${enemyChampionName} wants to farm safely and scale.`,
      `- Better: Expect ${enemyChampionName} to avoid early trades; ${playerChampionName} should pressure the wave without giving a free all-in window.`,
      `- Bad: ${playerChampionName} wins by landing crowd control and snowballing through roams.`,
      `- Better: ${playerChampionName}'s win condition is to deny ${enemyChampionName} a calm scaling lane by using verified cooldown or wave windows.`,
      "",
      "Section requirements:",
      `overview: Use 1-2 bullets from ${playerChampionName}'s point of view only; state the matchup identity and the main thing ${playerChampionName} must manage.`,
      `overview: Mention defensive adaptation here only when it materially changes how ${playerChampionName} should play the matchup.`,
      `early_game: Cover what ${playerChampionName} should do in the first waves and levels 1-6, including wave position and real punish windows.`,
      `trading_pattern: Explain how ${playerChampionName} should trade, which ${enemyChampionName} cooldowns or resource states matter, and when to disengage.`,
      `power_spikes: List ${playerChampionName}'s real spikes and ${enemyChampionName}'s real spikes that ${playerChampionName} must respect.`,
      "power_spikes: Never mention recalls, mana refreshes, Lost Chapter sustain, generic tempo, or non-spike ability unlocks here.",
      `danger_windows: List only moments where ${playerChampionName} is actually in danger from lethal trades, all-ins, ganks, dives, or forced summoners.`,
      "danger_windows: If the enemy roams and the player cannot follow, say to hard push, take plates, ping danger, or punish the roam; do not frame the roam itself as direct lane danger.",
      `win_conditions: Explain concrete ways ${playerChampionName} can win this matchup, without repeating early lane instructions or coaching ${enemyChampionName}.`,
      "",
      "Negative examples to avoid:",
      "- Do not say play safe unless you explain what cooldown, wave state, or enemy spike requires caution.",
      "- Do not say look for trades unless you explain what enemy cooldown, resource state, or positioning mistake creates the trade.",
      "- Do not say scale into late game unless you explain how the player survives lane and what later condition improves.",
      `- Do not write any bullet that is mainly useful for a ${enemyChampionName} player.`,
      "- Do not recommend Morellonomicon just because the enemy has minor healing.",
      "- Do not recommend AD items to AP champions, including Hexdrinker for a mage.",
      "- Do not invent ability timing or claim an ability spike that is not real.",
      "- Do not invent crowd control, sustain, shields, stealth, or a combat use for utility-only abilities.",
      "- Do not say Twilight Shroud is Akali's level 6 spike.",
      "- Do not treat Lost Chapter sustain or recall timing as a power spike.",
      "- Do not claim Ahri E cooldown reduction as a core spike.",
      "",
      "Final validation before returning JSON:",
      `- Does every bullet directly help ${playerChampionName} into ${enemyChampionName}?`,
      `- Is any bullet written for ${enemyChampionName}? If yes, rewrite or remove it.`,
      `- Are ${enemyChampionName}'s weaknesses framed as ${playerChampionName} actions?`,
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
      "combat_profile_status: missing",
      "constraint: Avoid specific ability, crowd control, sustain, shield, stealth, item, or spike claims unless admin notes provide them.",
    ].join("\n");
  }

  return [
    `name: ${profile.name}`,
    "profile_status: supplied",
    "combat_profile_status: supplied",
    `primary_roles: ${formatList(profile.primaryRoles)}`,
    `secondary_roles: ${formatList(profile.secondaryRoles)}`,
    `off_meta_roles: ${formatList(profile.offMetaRoles)}`,
    `damage_type: ${profile.damageType}`,
    `archetype: ${formatList(profile.archetype)}`,
    `mobility_level: ${profile.mobilityLevel}`,
    `hard_crowd_control: ${formatList(profile.hardCrowdControl)}`,
    `soft_crowd_control: ${formatList(profile.softCrowdControl)}`,
    `danger_abilities: ${formatList(profile.dangerAbilities)}`,
    `stealth_or_invisibility: ${profile.stealthOrInvisibility ?? "none"}`,
    `sustain: ${formatList(profile.sustain)}`,
    `shields: ${formatList(profile.shields)}`,
    `lane_plan.wants: ${formatOptionalList(profile.lanePlan?.wants)}`,
    `lane_plan.avoids: ${formatOptionalList(profile.lanePlan?.avoids)}`,
    `lane_plan.ideal_lane_state: ${
      profile.lanePlan?.idealLaneState ?? "not supplied"
    }`,
    `trading.primary_pattern: ${
      profile.trading?.primaryPattern ?? "not supplied"
    }`,
    `trading.good_trade_conditions: ${formatOptionalList(
      profile.trading?.goodTradeConditions
    )}`,
    `trading.bad_trade_conditions: ${formatOptionalList(
      profile.trading?.badTradeConditions
    )}`,
    `matchup_preferences.strong_into: ${formatOptionalList(
      profile.matchupPreferences?.strongInto
    )}`,
    `matchup_preferences.weak_into: ${formatOptionalList(
      profile.matchupPreferences?.weakInto
    )}`,
    `danger_profile.dangerous_when: ${formatOptionalList(
      profile.dangerProfile?.dangerousWhen
    )}`,
    `danger_profile.must_respect: ${formatOptionalList(
      profile.dangerProfile?.mustRespect
    )}`,
    `punish_profile.can_punish: ${formatOptionalList(
      profile.punishProfile?.canPunish
    )}`,
    `punish_profile.struggles_to_punish: ${formatOptionalList(
      profile.punishProfile?.strugglesToPunish
    )}`,
    `power_spikes.major: ${formatOptionalList(profile.powerSpikes?.major)}`,
    `power_spikes.notes: ${formatOptionalList(profile.powerSpikes?.notes)}`,
    `primary_trading_pattern: ${profile.primaryTradingPattern}`,
    `primary_win_conditions: ${formatList(profile.primaryWinCondition)}`,
    `punish_windows: ${formatList(profile.punishWindows)}`,
    `lane_identity: ${profile.laneIdentity}`,
    `major_power_spikes: ${formatList(profile.majorPowerSpikes)}`,
    `important_ability_notes: ${formatList(profile.importantAbilityNotes)}`,
    `common_weaknesses: ${formatList(profile.commonWeaknesses)}`,
  ].join("\n");
}

function formatList(values: readonly string[]) {
  return values.length > 0 ? values.join("; ") : "none";
}

function formatOptionalList(values?: readonly string[]) {
  return values && values.length > 0 ? formatList(values) : "not supplied";
}
