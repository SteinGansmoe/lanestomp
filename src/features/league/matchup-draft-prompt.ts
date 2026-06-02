import type {
  LeagueChampionKnowledgeProfile,
  LeagueChampionPowerSpike,
} from "./champion-knowledge/types";

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

export const matchupDraftSectionLabels = {
  danger_windows: "Danger windows",
  early_game: "Early game",
  overview: "Overview",
  power_spikes: "Power spikes",
  trading_pattern: "Trading pattern",
  win_conditions: "Win conditions",
} as const satisfies Record<MatchupDraftSectionKey, string>;

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

export function createMatchupDraftSchema(
  sectionKeys: readonly MatchupDraftSectionKey[] = matchupDraftSectionKeys
) {
  return {
    type: "object",
    additionalProperties: false,
    properties: Object.fromEntries(
      sectionKeys.map((key) => [
        key,
        {
          type: "string",
        },
      ])
    ),
    required: sectionKeys,
  };
}

export type LeagueMatchupDraftPromptInput = {
  adminNotes: string | null;
  enemyChampionProfile?: LeagueChampionKnowledgeProfile | null;
  enemyChampionName: string;
  existingSections?: Partial<MatchupDraftSections> | null;
  playerChampionProfile?: LeagueChampionKnowledgeProfile | null;
  playerChampionName: string;
  role: LeagueRole;
  targetSection?: MatchupDraftSectionKey | null;
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
  existingSections,
  playerChampionProfile,
  playerChampionName,
  role,
  targetSection,
}: LeagueMatchupDraftPromptInput): LeagueMatchupDraftPrompt {
  const roleLabel = role === "adc" ? "ADC" : role;
  const outputKeys = targetSection ? [targetSection] : matchupDraftSectionKeys;
  const sourceNotes = adminNotes?.trim() || "No admin notes supplied.";
  const existingSectionContext = formatExistingSections(existingSections);
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
      "You write League of Legends matchup draft notes for LaneStomp admins.",
      `Champion A is always ${playerChampionName}, the player champion.`,
      `Champion B is always ${enemyChampionName}, the opponent.`,
      `Every generated bullet must answer: what should ${playerChampionName} do?`,
      "The output is a coach for Champion A only, not neutral matchup analysis.",
      "Never switch perspective or write advice that helps Champion B pilot their champion.",
      "Use Champion B facts only to explain threats, respect windows, or punish windows for Champion A.",
      "If a fact describes a Champion B weakness, frame it as how Champion A should exploit that window.",
      "Return compact, matchup-specific coaching bullets, not long-form articles.",
      "Use at most 3 bullets per section.",
      "Every section must serve a distinct gameplay purpose and avoid repeating advice from another section.",
      "Keep the output fast to scan during champion select or loading screen.",
      "Use direct League player language with concrete matchup decisions.",
      "Prefer correct, limited advice over filling every section with weak guesses.",
      "Never claim winrates, exact patch facts, item/stat changes, or matchup certainty unless supplied by admin notes.",
      "Do not invent ability timing, cooldown interactions, item recommendations, or lane dynamics.",
      "Treat supplied champion combat profiles as the source of truth. If model memory conflicts with the profiles, follow the profiles.",
      "Draft-quality profiles may be incomplete. Use supplied fields when present, and avoid specific claims when a field says not supplied.",
      "Use the ability map to understand abilities, but keep user-facing ability references short.",
      "Use only (Q), (W), (E), or (R) for mapped ability references in generated bullets.",
      "Avoid ability names entirely when a mapped hotkey is available.",
      "Do not prepend champion names to abilities unless the champion name is needed elsewhere in the sentence for clarity.",
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
      `Champion A: ${playerChampionName} (player)`,
      `Champion B: ${enemyChampionName} (opponent)`,
      `Matchup direction: ${playerChampionName} into ${enemyChampionName}`,
      `Role: ${roleLabel}`,
      `Admin notes or source context: ${sourceNotes}`,
      "",
      "Structured champion profiles:",
      `Player champion combat profile:\n${playerChampionContext}`,
      `Enemy champion combat profile:\n${enemyChampionContext}`,
      "",
      `Existing matchup context:\n${existingSectionContext}`,
      "",
      targetSection
        ? `Regenerate only the ${matchupDraftSectionLabels[targetSection]} card. Preserve the intent of the other existing cards as context, but do not rewrite them.`
        : "Regenerate the full matchup draft.",
      `Write JSON for these exact keys: ${outputKeys.join(", ")}.`,
      "Each value must be a newline-separated bullet list.",
      "Use 1-3 bullets per key, never more.",
      "Each bullet must be one short actionable sentence.",
      "Start every bullet with '- '.",
      "Do not use paragraphs.",
      `Every bullet must directly help a player piloting Champion A (${playerChampionName}) against Champion B (${enemyChampionName}).`,
      `Every bullet must be actionable coaching for ${playerChampionName}; it should name what ${playerChampionName} should do, avoid, respect, punish, trade around, or play toward.`,
      `Never write from ${enemyChampionName}'s point of view or tell ${enemyChampionName} what to do.`,
      `When using ${enemyChampionName}'s weaknesses or punish windows, translate them into concrete ${playerChampionName} actions.`,
      `When mentioning ${enemyChampionName}'s strengths, phrase them as respect windows, spacing rules, or lane-state choices for ${playerChampionName}.`,
      `Never leave ${enemyChampionName}'s weakness as a neutral observation; explain how ${playerChampionName} should exploit it.`,
      `If ${playerChampionName} following a bullet would not increase their chance of winning, rewrite or discard that bullet.`,
      "Do not repeat wave control, spacing, or cooldown tracking across sections unless that concept is uniquely relevant to the section.",
      "If a concept belongs in one section, do not restate it elsewhere.",
      "Use the structured champion profiles to decide damage type, crowd control, mobility, sustain, shields, stealth, trading patterns, lane identity, and real spikes.",
      "When structured lanePlan, laneIdentity, strategicIdentity, trading, matchupPreferences, dangerProfile, punishProfile, or powerSpikes fields are supplied, treat them as higher priority than the older summary fields.",
      "Use strategicIdentity to infer high-level matchup identities such as snowball vs scale, roam vs scale, control vs roam, teamfight vs splitpush, or lane pressure vs scaling carry.",
      "Do not name a matchup identity unless it follows from the supplied strategicIdentity fields.",
      "Power spike objects include timing, reason, changesGameplay, playerAction, and sometimes enemyResponse.",
      "Do not echo power spike timing by itself; explain what changes in lane, who becomes more dangerous, and what the player should do differently.",
      "If a structured field is not supplied, fall back to the older summary field for that topic. If neither is supplied, keep the advice conservative and avoid invented details.",
      "Use laneIdentity to reason about who controls early lane pace, who wants time to scale, who wants lane pressure, and who benefits from a passive lane state.",
      "Use strategicIdentity to reason about each champion's lane goal, scaling curve, preferred game length, and general win method.",
      `Compare ${playerChampionName}'s lanePlan.wants against ${enemyChampionName}'s lanePlan.wants and explain what ${playerChampionName} must deny.`,
      `Compare ${playerChampionName}'s laneIdentity against ${enemyChampionName}'s laneIdentity before writing overview, early_game, trading_pattern, or win_conditions.`,
      `Compare ${playerChampionName}'s strategicIdentity against ${enemyChampionName}'s strategicIdentity before writing overview or win_conditions.`,
      `Compare ${playerChampionName}'s punishProfile.canPunish against ${enemyChampionName}'s dangerProfile.mustRespect and trading.badTradeConditions.`,
      `Compare ${enemyChampionName}'s punishProfile.canPunish and dangerProfile.dangerousWhen against ${playerChampionName}'s trading.badTradeConditions.`,
      "Use primary win conditions, danger abilities, and punish windows as matchup facts for all-ins, spacing, cooldown punish, and danger window advice.",
      "Prefer supplied profile facts over model assumptions, especially for champion abilities, item direction, and class-specific build advice.",
      "Only reference abilities, crowd control, shields, sustain, stealth, or power spikes that appear in the profiles or admin notes.",
      "If a champion profile says a champion has no hard crowd control, do not describe that champion as having hard crowd control.",
      "If a champion profile is missing, avoid specific ability claims for that champion unless supplied by admin notes.",
      "If either profile is missing, keep the draft more conservative and lower-confidence instead of inventing details.",
      "Use natural League terms such as wave on your side, punish cooldowns, avoid all-in windows, short trades, spacing, roam timers, freeze, crash, slow push, and reset only when they fit the role and lane.",
      "Use the ability_map as the canonical ability name source for reasoning, not as the default display format.",
      "Apply short ability references consistently in overview, early_game, trading_pattern, power_spikes, danger_windows, and win_conditions.",
      `If source profile text names a mapped ${playerChampionName} ability, shorten it to (Q), (W), (E), or (R) in the returned JSON.`,
      `If source profile text names a mapped ${enemyChampionName} ability, shorten it to (Q), (W), (E), or (R) in the returned JSON.`,
      "Avoid top-lane-only concepts unless the selected role and champions clearly make them relevant.",
      "For mid lane, avoid long-freeze advice; use keep the wave on your side, crash, reset, roam timer, or punish roam only when the lane state supports it.",
      "If defensive adaptation matters, include it briefly in overview as a matchup need rather than naming full items or builds.",
      "",
      "Perspective examples:",
      "- Bad: Use (Q) Orb of Deception and (W) Fox-Fire for short trades.",
      "- Better: Use (Q) and (W) for short trades.",
      "- Bad: Respect Syndra's (E) Scatter the Weak cooldown.",
      "- Better: Respect Syndra's (E) stun threat.",
      "- Bad: Ahri is vulnerable when (R) Spirit Rush is unavailable.",
      "- Better: Ahri is vulnerable when (R) is unavailable.",
      "- Bad: Hold Charm until Syndra commits.",
      "- Better: Hold (E) until Syndra commits.",
      "- Bad: Respect Scatter the Weak.",
      "- Better: Respect (E).",
      "- Bad: Kassadin is weak before level 6.",
      "- Better: Pressure Kassadin aggressively before level 6 while he lacks mobility and reliable escape tools.",
      "- Bad: Veigar is exposed when Event Horizon is down.",
      "- Better: When Veigar misses (E), step forward to pressure trades or force him away from the wave.",
      `- Bad: ${enemyChampionName} is exposed when a key defensive cooldown is down.`,
      `- Better: When ${enemyChampionName}'s key defensive cooldown is down, ${playerChampionName} can step forward for a short trade or wave pressure.`,
      `- Bad: ${enemyChampionName} wants to farm safely and scale.`,
      `- Better: Expect ${enemyChampionName} to avoid early trades; ${playerChampionName} should pressure the wave without giving a free all-in window.`,
      `- Bad: ${playerChampionName} wins by landing crowd control and snowballing through roams.`,
      `- Better: ${playerChampionName}'s win condition is to deny ${enemyChampionName} a calm scaling lane by using verified cooldown or wave windows.`,
      "",
      "Section requirements:",
      `overview: Use 1-2 bullets from ${playerChampionName}'s point of view only; state the matchup identity and the main thing ${playerChampionName} must manage.`,
      `overview: Use laneIdentity to explain whether ${playerChampionName} should pressure, deny scaling, or avoid giving ${enemyChampionName} a passive lane.`,
      `overview: Use strategicIdentity to summarize whether this is snowball vs scale, roam vs control, control vs teamfight, or another supplied-profile identity.`,
      `overview: Mention defensive adaptation here only when it materially changes how ${playerChampionName} should play the matchup.`,
      `early_game: Cover what ${playerChampionName} should do in the first waves and levels 1-6 based on who has earlyGameAgency and lanePressure.`,
      `early_game: Focus on how ${playerChampionName} should approach levels 1-6; never describe ${enemyChampionName}'s early plan unless it changes ${playerChampionName}'s action.`,
      `trading_pattern: Explain how ${playerChampionName} should trade, which ${enemyChampionName} cooldowns or resource states matter, and how lane initiative changes those trades.`,
      `trading_pattern: Never explain how ${enemyChampionName} should trade; translate ${enemyChampionName}'s mistakes into ${playerChampionName}'s punish actions.`,
      `power_spikes: List ${playerChampionName}'s real spikes and ${enemyChampionName}'s real spikes that ${playerChampionName} must respect.`,
      "power_spikes: Use power_spikes.major as the source for the card; use power_spikes.minor only as context for early_game or trading_pattern when it changes lane behavior.",
      "power_spikes: For player champion spikes, use playerAction as the recommended action and enemyResponse as what the opponent must respect.",
      "power_spikes: For enemy champion spikes, translate enemy playerAction and enemyResponse into what the player must respect or punish.",
      "power_spikes: Never mention recalls, mana refreshes, Lost Chapter sustain, generic tempo, or non-spike ability unlocks here.",
      `danger_windows: List only moments where ${playerChampionName} is actually in danger from lethal trades, all-ins, ganks, dives, or forced summoners.`,
      `danger_windows: Describe ${enemyChampionName}'s threat windows, ${playerChampionName}'s vulnerability windows, and matchup swing moments that require caution from ${playerChampionName}.`,
      `danger_windows: Never describe ${enemyChampionName}'s vulnerability windows here; move those to trading_pattern or win_conditions as ${playerChampionName} punish opportunities.`,
      "danger_windows: If the enemy roams and the player cannot follow, say to hard push, take plates, ping danger, or punish the roam; do not frame the roam itself as direct lane danger.",
      `win_conditions: Explain concrete ways ${playerChampionName} can win this matchup by using lane agency, denying scaling, reaching the preferred game state, or executing strategicIdentity.winMethod.`,
      `win_conditions: Never describe how ${enemyChampionName} wins; only explain how ${playerChampionName} increases their chance of winning.`,
      "",
      "Negative examples to avoid:",
      "- Do not say play safe unless you explain what cooldown, wave state, or enemy spike requires caution.",
      "- Do not say look for trades unless you explain what enemy cooldown, resource state, or positioning mistake creates the trade.",
      "- Do not say scale into late game unless you explain how the player survives lane and what later condition improves.",
      `- Do not write any bullet that is mainly useful for a ${enemyChampionName} player.`,
      "- Do not recommend Morellonomicon just because the enemy has minor healing.",
      "- Do not recommend AD items to AP champions, including Hexdrinker for a mage.",
      "- Do not invent ability timing or claim an ability spike that is not real.",
      "- Do not mention level 3 merely because a champion has all basic abilities; only mention level 3 if the supplied profile says it significantly changes threat, trading, or all-in access.",
      "- Do not invent crowd control, sustain, shields, stealth, or a combat use for utility-only abilities.",
      "- Do not write repeated long formats like (Q) Orb of Deception or (E) Scatter the Weak in generated card text.",
      "- Do not write long ability names when (Q), (W), (E), or (R) is available.",
      `- Do not write ${playerChampionName}'s ${playerChampionName} (Q), ${playerChampionName}'s ${playerChampionName} (W), ${enemyChampionName}'s ${enemyChampionName} (E), or repeated champion names.`,
      `- Do not write ${playerChampionName} Q, ${playerChampionName} W, ${playerChampionName} E, or ${playerChampionName} R; use (Q), (W), (E), or (R).`,
      `- Do not write ${enemyChampionName}'s (Q), ${enemyChampionName}'s (W), ${enemyChampionName}'s (E), or ${enemyChampionName}'s (R) unless the champion name is needed for sentence clarity.`,
      `- Do not write ${enemyChampionName}'s (Q) followed by the ability name; use only (Q).`,
      "- Do not say Twilight Shroud is Akali's level 6 spike.",
      "- Do not treat Lost Chapter sustain or recall timing as a power spike.",
      "- Do not claim Ahri E cooldown reduction as a core spike.",
      "",
      "Final validation before returning JSON:",
      `- Does every bullet directly help ${playerChampionName} into ${enemyChampionName}?`,
      `- If ${playerChampionName} followed this bullet, would it increase their chance of winning?`,
      `- Is any bullet written for ${enemyChampionName}? If yes, rewrite or remove it.`,
      `- Are ${enemyChampionName}'s weaknesses framed as ${playerChampionName} actions?`,
      `- Did danger_windows avoid describing ${enemyChampionName}'s vulnerability windows?`,
      "- Are ability references short enough for champion select?",
      "- Did mapped abilities use only (Q), (W), (E), or (R)?",
      "- Did the draft avoid ability names and repeated champion-owned ability phrases?",
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
    `profile_quality: ${profile.profileQuality}`,
    `ability_map: ${formatAbilityMap(profile.abilities)}`,
    `primary_roles: ${formatOptionalList(profile.primaryRoles)}`,
    `secondary_roles: ${formatOptionalList(profile.secondaryRoles)}`,
    `off_meta_roles: ${formatOptionalList(profile.offMetaRoles)}`,
    `damage_type: ${profile.damageType ?? "not supplied"}`,
    `archetype: ${formatOptionalList(profile.archetype)}`,
    `mobility_level: ${profile.mobilityLevel ?? "not supplied"}`,
    `hard_crowd_control: ${formatOptionalList(profile.hardCrowdControl)}`,
    `soft_crowd_control: ${formatOptionalList(profile.softCrowdControl)}`,
    `danger_abilities: ${formatOptionalList(profile.dangerAbilities)}`,
    `stealth_or_invisibility: ${formatOptionalText(
      profile.stealthOrInvisibility,
      "none"
    )}`,
    `sustain: ${formatOptionalList(profile.sustain)}`,
    `shields: ${formatOptionalList(profile.shields)}`,
    `lane_plan.wants: ${formatOptionalList(profile.lanePlan?.wants)}`,
    `lane_plan.avoids: ${formatOptionalList(profile.lanePlan?.avoids)}`,
    `lane_plan.ideal_lane_state: ${
      profile.lanePlan?.idealLaneState ?? "not supplied"
    }`,
    `lane_identity.early_game_agency: ${formatLaneIdentityField(
      profile.laneIdentity,
      "earlyGameAgency"
    )}`,
    `lane_identity.scaling_priority: ${formatLaneIdentityField(
      profile.laneIdentity,
      "scalingPriority"
    )}`,
    `lane_identity.lane_pressure: ${formatLaneIdentityField(
      profile.laneIdentity,
      "lanePressure"
    )}`,
    `lane_identity.preferred_game_state: ${formatLaneIdentityList(
      profile.laneIdentity,
      "preferredGameState"
    )}`,
    `lane_identity.win_lane_by: ${formatLaneIdentityList(
      profile.laneIdentity,
      "winLaneBy"
    )}`,
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
    `power_spikes.major: ${formatPowerSpikes(profile.powerSpikes?.major)}`,
    `power_spikes.minor: ${formatPowerSpikes(profile.powerSpikes?.minor)}`,
    `strategic_identity.lane_goal: ${
      profile.strategicIdentity?.laneGoal ?? "not supplied"
    }`,
    `strategic_identity.scaling_profile: ${
      profile.strategicIdentity?.scalingProfile ?? "not supplied"
    }`,
    `strategic_identity.preferred_game_length: ${
      profile.strategicIdentity?.preferredGameLength ?? "not supplied"
    }`,
    `strategic_identity.win_method: ${formatOptionalList(
      profile.strategicIdentity?.winMethod
    )}`,
    `primary_trading_pattern: ${
      profile.primaryTradingPattern ?? "not supplied"
    }`,
    `primary_win_conditions: ${formatOptionalList(profile.primaryWinCondition)}`,
    `punish_windows: ${formatOptionalList(profile.punishWindows)}`,
    `lane_identity_summary: ${formatLaneIdentitySummary(
      profile.laneIdentity
    )}`,
    `major_power_spikes: ${formatOptionalList(profile.majorPowerSpikes)}`,
    `important_ability_notes: ${formatOptionalList(
      profile.importantAbilityNotes
    )}`,
    `common_weaknesses: ${formatOptionalList(profile.commonWeaknesses)}`,
  ].join("\n");
}

function formatList(values: readonly string[]) {
  return values.length > 0 ? values.join("; ") : "none";
}

function formatOptionalList(values?: readonly string[]) {
  return values && values.length > 0 ? formatList(values) : "not supplied";
}

function formatExistingSections(
  existingSections?: Partial<MatchupDraftSections> | null
) {
  if (!existingSections) {
    return "not supplied";
  }

  const lines = matchupDraftSectionKeys.map((key) => {
    const value = existingSections[key]?.trim();

    return `${key}: ${value || "not supplied"}`;
  });

  return lines.join("\n");
}

function formatPowerSpikes(spikes?: readonly LeagueChampionPowerSpike[]) {
  if (!spikes || spikes.length === 0) {
    return "not supplied";
  }

  return spikes
    .map((spike) =>
      [
        `timing=${spike.timing}`,
        `reason=${spike.reason}`,
        `changes_gameplay=${spike.changesGameplay}`,
        `player_action=${spike.playerAction}`,
        `enemy_response=${spike.enemyResponse ?? "not supplied"}`,
      ].join(" | ")
    )
    .join("; ");
}

function formatAbilityMap(
  abilities: LeagueChampionKnowledgeProfile["abilities"]
) {
  if (!abilities) {
    return "not supplied";
  }

  return [
    `Q=${abilities.Q}`,
    `W=${abilities.W}`,
    `E=${abilities.E}`,
    `R=${abilities.R}`,
  ].join("; ");
}

function formatOptionalText(
  value: string | null | undefined,
  nullFallback = "not supplied"
) {
  if (value === undefined) {
    return "not supplied";
  }

  return value ?? nullFallback;
}

function formatLaneIdentityField(
  laneIdentity: LeagueChampionKnowledgeProfile["laneIdentity"],
  field: "earlyGameAgency" | "lanePressure" | "scalingPriority"
) {
  if (!laneIdentity || typeof laneIdentity === "string") {
    return "not supplied";
  }

  return laneIdentity[field];
}

function formatLaneIdentityList(
  laneIdentity: LeagueChampionKnowledgeProfile["laneIdentity"],
  field: "preferredGameState" | "winLaneBy"
) {
  if (!laneIdentity || typeof laneIdentity === "string") {
    return "not supplied";
  }

  return formatOptionalList(laneIdentity[field]);
}

function formatLaneIdentitySummary(
  laneIdentity: LeagueChampionKnowledgeProfile["laneIdentity"]
) {
  if (!laneIdentity) {
    return "not supplied";
  }

  if (typeof laneIdentity === "string") {
    return laneIdentity;
  }

  return [
    `early agency ${laneIdentity.earlyGameAgency}`,
    `scaling ${laneIdentity.scalingPriority}`,
    `lane pressure ${laneIdentity.lanePressure}`,
  ].join("; ");
}
