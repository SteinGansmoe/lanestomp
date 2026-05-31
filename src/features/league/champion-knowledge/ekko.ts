import type { LeagueChampionKnowledgeProfile } from "./types";

export const ekkoCombatProfile = {
    archetype: ["assassin", "skirmisher", "scaling", "burst"],
    primaryWinCondition: ["Short trades with Q and E, a well-times W stun can turn a fight in his favor, and R can be used to dodge key damage or reset fights."],
    dangerAbilities: ["W Parallel Convergence stun", "E Phase Dive", "R Chronobreak"],
    commonWeaknesses: [
      "Alot of CC champions will interrupt his setup.",
      "Can be pressured before level 6.",
      "Needs items to shine.",
    ],
    damageType: "magic",
    hardCrowdControl: ["W Parallel Convergence stun"],
    id: "Ekko",
    importantAbilityNotes: [
      "Parallel Convergence is delayed and requires setup.",
      "Chronobreak is his level 6 safety and burst reset.",
      "Phase Dive is his main trading mobility.",
    ],
    laneIdentity:
      "Scaling AP assassin who wants short trades, wave access, and explosive all-ins after setup.",
    majorPowerSpikes: [
      "Level 3 full basic ability access.",
      "Level 6 Chronobreak.",
      "First completed AP burst item.",
    ],
    mobilityLevel: "high",
    name: "Ekko",
    offMetaRoles: [],
    primaryRoles: ["jungle"],
    secondaryRoles: ["mid"],
    primaryTradingPattern:
      "Use Timewinder and Phase Dive for quick burst, then disengage after proccing passive for movement speed to back off.",
    shields: ["W Parallel Convergence shield if Ekko enters the zone"],
    softCrowdControl: ["Q Timewinder slow"],
    stealthOrInvisibility: null,
    sustain: ["R Chronobreak heal on cast."],
    punishWindows: [
  "W takes a while to activate, and if it misses he will take return damage in trades.",
  "If Ekko engages with E but misses with Q, he will often lose out in trades.",
  "Before level 6 Ekko is much easier to kill"
]
  } satisfies LeagueChampionKnowledgeProfile;
