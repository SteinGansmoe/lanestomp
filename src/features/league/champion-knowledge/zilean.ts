import type { LeagueChampionKnowledgeProfile } from "./types";

export const zileanCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "medium",
  abilities: { Q: "Time Bomb", W: "Rewind", E: "Time Warp", R: "Chronoshift" },
  archetype: ["support", "utility mage", "speed", "revive"],
  primaryWinCondition: [
    "Control lane with bomb threat and speed manipulation, then deny burst or dives with Chronoshift.",
  ],
  dangerAbilities: ["Double bomb stun", "(E) speed/slow", "(R) revive"],
  dangerProfile: {
    dangerousWhen: [
      "He can land double bombs on wave or CC setup.",
      "His ADC can use speed to trade or kite.",
      "Level 6 makes burst all-ins unreliable.",
  ],
    mustRespect: [
      "Zilean changes movement speed more than lane damage.",
      "Revive forces enemies to hold burst or swap targets.",
      "Double bomb is strong but setup dependent.",
  ],
  },
  commonWeaknesses: [
    "Weak direct lane pressure if bombs miss.",
    "Squishy into hooks.",
    "Needs ADC coordination to use speed well.",
  ],
  damageType: "magic",
  hardCrowdControl: ["Double (Q) stun"],
  id: "Zilean",
  importantAbilityNotes: [
    "Zilean changes movement speed more than lane damage.",
    "Revive forces enemies to hold burst or swap targets.",
    "Double bomb is strong but setup dependent.",
  ],
  lanePlan: {
    avoids: [
      "Throwing single bombs with no purpose.",
      "Using (R) too late.",
      "Standing near hook range.",
  ],
    idealLaneState: "A utility lane where Zilean controls bomb zones, speeds ADC trades, and saves revive for the enemy's committed burst.",
    wants: [
      "ADC that uses speed well.",
      "Enemy burst to deny.",
      "Wave states that hold bomb zones.",
  ],
  },
  laneIdentity: {
    earlyGameAgency: "medium",
    lanePressure: "medium",
    preferredGameState: [
      "Scaling utility lanes.",
      "Anti-burst fights.",
      "Kiting fights.",
  ],
    scalingPriority: "high",
    winLaneBy: [
      "Landing double bomb.",
      "Speeding ADC windows.",
      "Reviving the focused carry.",
  ],
  },
  majorPowerSpikes: ["Level 2 bomb plus speed.", "Level 3 Rewind double-bomb threat.", "Level 6 Chronoshift."],
  matchupPreferences: {
    strongInto: [
      "Burst lanes.",
      "Immobile ADCs needing speed.",
      "Teams that dive one target.",
  ],
    weakInto: [
      "Hard engage before level 6.",
      "Long-range poke.",
      "Lanes that dodge bombs and punish cooldowns.",
  ],
  },
  mobilityLevel: "low",
  name: "Zilean",
  offMetaRoles: ["top"],
  powerSpikes: {
    major: [
      {
        timing: "Level 2",
        reason: "Level 2 bomb plus speed.",
        changesGameplay: "The first real bot-lane interaction changes once this support can pair two early abilities.",
        playerAction: "Track the level 2 race and only contest the wave if the ADC can follow the support's threat.",
        enemyResponse: "Respect the level 2 timer and back up before the support reaches the wave first.",
      },
      {
        timing: "Level 3",
        reason: "Level 3 Rewind double-bomb threat.",
        changesGameplay: "The full basic kit unlocks the support's main trade, peel, or poke pattern.",
        playerAction: "Use the complete kit around brush control, ADC follow-up, and the enemy support's key cooldown.",
        enemyResponse: "Punish the support after their main cooldown is spent or when the wave blocks their angle.",
      },
      {
        timing: "Level 6",
        reason: "Level 6 Chronoshift.",
        changesGameplay: "The ultimate changes all-in, peel, roam, or objective threat for the bot lane.",
        playerAction: "Use level 6 around confirmed ADC follow-up, river setup, or defensive reset value.",
        enemyResponse: "Track the ultimate cooldown and avoid giving a clean engage or counter-engage angle.",
      },
    ],
  },
  primaryRoles: ["support"],
  secondaryRoles: ["mid"],
  primaryTradingPattern: "Set bombs on the wave or slowed targets, use speed to control trade distance, and hold (R) for real lethal damage.",
  punishProfile: {
    canPunish: [
      "Divers committing onto his ADC.",
      "Targets slowed by (E).",
      "Enemies standing in minion bomb zones.",
  ],
    strugglesToPunish: [
      "Mobile targets dodging bombs.",
      "Poke outside his range.",
      "Multiple threats that bait revive.",
  ],
  },
  shields: [],
  softCrowdControl: ["(E) slow"],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "control",
    preferredGameLength: "long",
    scalingProfile: "late",
    winMethod: ["Landing double bomb.", "Speeding ADC windows.", "Reviving the focused carry."],
  },
  supportSynergy: {
    excellentWith: ["Jinx", "KogMaw", "Twitch"],
    goodWith: ["Vayne", "Zeri", "Smolder"],
    strugglesWith: ["Draven", "Samira", "Kalista"],
    notes: [
      "Jinx, KogMaw, Twitch convert Zilean's strongest lane pattern especially well.",
      "Vayne, Zeri, Smolder fit Zilean when the lane can play around the same tempo window.",
      "Draven, Samira, Kalista can struggle with Zilean when they need a different lane pace or protection pattern.",
  ],
  },
  sustain: [],
  trading: {
    badTradeConditions: [
      "Bombs miss.",
      "(R) is down.",
      "He uses speed with no trade or escape purpose.",
  ],
    goodTradeConditions: [
      "ADC can kite with (E).",
      "Enemy burst is predictable.",
      "Double bomb can be set through wave.",
  ],
    primaryPattern: "Set bombs on the wave or slowed targets, use speed to control trade distance, and hold (R) for real lethal damage.",
  },
  punishWindows: [
    "Bait revive then disengage.",
    "Engage before level 6.",
    "Spread away from bomb targets.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
