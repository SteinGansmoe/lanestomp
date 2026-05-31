import type { LeagueChampionKnowledgeProfile } from "./types";

export const katarinaCombatProfile = {
  profileQuality: "draft",
  abilities: {
    Q: "Bouncing Blade",
    W: "Preparation",
    E: "Shunpo",
    R: "Death Lotus",
  },
  archetype: ["assassin", "reset", "roam", "skirmisher"],
  primaryWinCondition: [
    "Find dagger reset windows in skirmishes and snowball fights through takedown resets.",
  ],
  dangerAbilities: ["E Shunpo mobility", "R Death Lotus channel", "Passive Voracity resets"],
  dangerProfile: {
    dangerousWhen: [
      "Daggers are positioned near the enemy or escape paths.",
      "Crowd control has been used and R can channel safely.",
      "A takedown reset lets her chain mobility and damage.",
    ],
    mustRespect: [
      "Her daggers define where the burst will happen.",
      "E resets around daggers and takedowns.",
      "R is dangerous but can be interrupted by crowd control.",
    ],
  },
  commonWeaknesses: [
    "Weak wave control and vulnerable early lane.",
    "Reliant on enemy mistakes, dagger setup, and resets.",
    "Crowd control can stop her ultimate and reset chain.",
  ],
  damageType: "mixed",
  hardCrowdControl: [],
  id: "Katarina",
  importantAbilityNotes: [
    "Q creates a dagger landing spot for follow-up.",
    "W drops a dagger and gives movement speed.",
    "E is targeted mobility and reset-based repositioning.",
    "R is a channel that can be interrupted.",
  ],
  lanePlan: {
    avoids: [
      "Forcing trades without dagger setup.",
      "Channeling R into available crowd control.",
      "Staying trapped under wave pressure without roam options.",
    ],
    idealLaneState:
      "A volatile lane where Katarina can preserve health, punish cooldowns, and leave for skirmishes when the wave allows.",
    wants: [
      "Enemy cooldowns spent before she jumps in.",
      "Dagger positions that threaten both damage and escape.",
      "River or side skirmishes where resets are possible.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "low",
    lanePressure: "low",
    preferredGameState: [
      "Chaotic skirmishes with low-health targets.",
      "Roam timers after the enemy wave is handled.",
      "Fights where key crowd control is already used.",
    ],
    scalingPriority: "medium",
    winLaneBy: [
      "Surviving early lane without bleeding too much health.",
      "Punishing missed cooldowns with dagger trades.",
      "Turning skirmishes into reset chains.",
    ],
  },
  majorPowerSpikes: [
    "Level 3 full basic ability access.",
    "Level 6 Death Lotus.",
    "First completed burst item.",
  ],
  matchupPreferences: {
    strongInto: [
      "Low crowd control teams that cannot interrupt R.",
      "Squishy champions who misposition near daggers.",
      "Skirmish-heavy games with reset opportunities.",
    ],
    weakInto: [
      "Reliable crowd control held for her engage.",
      "Strong waveclear that pins her in lane.",
      "Champions who can punish her before dagger setup.",
    ],
  },
  mobilityLevel: "very_high",
  name: "Katarina",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      "Level 3 full basic ability access.",
      "Level 6 Death Lotus.",
      "First completed burst item.",
    ],
    notes: [
      "Level 6 adds major all-in threat if crowd control is unavailable.",
      "Her strongest spikes often come from skirmish kills and item acceleration.",
    ],
  },
  primaryRoles: ["mid"],
  secondaryRoles: [],
  primaryTradingPattern:
    "Set daggers with Q or W, wait for enemy cooldowns, then use E to take short burst trades or commit only when resets are realistic.",
  punishProfile: {
    canPunish: [
      "Enemies standing near daggers.",
      "Used crowd control or mobility cooldowns.",
      "Low-health targets in river fights.",
    ],
    strugglesToPunish: [
      "Champions who hold crowd control for her jump.",
      "Lanes that shove safely and deny roams.",
    ],
  },
  shields: [],
  softCrowdControl: [],
  stealthOrInvisibility: null,
  sustain: [],
  trading: {
    badTradeConditions: [
      "No dagger is positioned for damage or escape.",
      "Enemy crowd control can interrupt R.",
      "The wave is too large to jump forward safely.",
    ],
    goodTradeConditions: [
      "The enemy has used crowd control or mobility.",
      "A dagger is positioned behind or beside the target.",
      "A skirmish has low-health targets for resets.",
    ],
    primaryPattern:
      "Trade around dagger placement, use E carefully, and commit fully only when crowd control is down or resets are likely.",
  },
  punishWindows: [
    "If Katarina uses E forward without a reset path, she is easier to punish.",
    "If R is interrupted, her all-in loses much of its threat.",
    "Early wave pressure can deny her roam pattern.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
