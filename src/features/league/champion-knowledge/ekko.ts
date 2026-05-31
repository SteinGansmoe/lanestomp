import type { LeagueChampionKnowledgeProfile } from "./types";

export const ekkoCombatProfile = {
    profileQuality: "draft",
    abilities: {
      Q: "Timewinder",
      W: "Parallel Convergence",
      E: "Phase Dive",
      R: "Chronobreak",
    },
    archetype: ["assassin", "skirmisher", "scaling", "burst"],
    primaryWinCondition: ["Short trades with Q and E, a well-times W stun can turn a fight in his favor, and R can be used to dodge key damage or reset fights."],
    dangerAbilities: ["W Parallel Convergence stun", "E Phase Dive", "R Chronobreak"],
    dangerProfile: {
      dangerousWhen: ["W Parallel Convergence stun", "E Phase Dive", "R Chronobreak"],
      mustRespect: [
            "Parallel Convergence is delayed and requires setup.",
            "Chronobreak is his level 6 safety and burst reset.",
            "Phase Dive is his main trading mobility.",
          ],
    },
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
    lanePlan: {
      avoids: [
            "Alot of CC champions will interrupt his setup.",
            "Can be pressured before level 6.",
            "Needs items to shine.",
          ],
      idealLaneState: "Scaling AP assassin who wants short trades, wave access, and explosive all-ins after setup.",
      wants: ["Short trades with Q and E, a well-times W stun can turn a fight in his favor, and R can be used to dodge key damage or reset fights."],
    },
    laneIdentity:
      {
      earlyGameAgency: "low",
      scalingPriority: "high",
      lanePressure: "low",
      preferredGameState: ["Short trades with Q and E, a well-times W stun can turn a fight in his favor, and R can be used to dodge key damage or reset fights."],
      winLaneBy: ["Short trades with Q and E, a well-times W stun can turn a fight in his favor, and R can be used to dodge key damage or reset fights."],
    },
    majorPowerSpikes: [
      "Level 3 unlocks Ekko's Q-W-E trade pattern with dash access and stun threat.",
      "Level 6 Chronobreak.",
      "First completed AP burst item.",
    ],
    matchupPreferences: {
      strongInto: [],
      weakInto: [],
    },
    mobilityLevel: "high",
    name: "Ekko",
    offMetaRoles: [],
    powerSpikes: {
      major: [
            "Level 3 unlocks Ekko's Q-W-E trade pattern with dash access and stun threat.",
            "Level 6 Chronobreak.",
            "First completed AP burst item.",
          ],
      notes: [],
    },
    primaryRoles: ["jungle"],
    secondaryRoles: ["mid"],
    primaryTradingPattern:
      "Use Timewinder and Phase Dive for quick burst, then disengage after proccing passive for movement speed to back off.",
    punishProfile: {
      canPunish: [],
      strugglesToPunish: [
            "Alot of CC champions will interrupt his setup.",
            "Can be pressured before level 6.",
            "Needs items to shine.",
          ],
    },
    shields: ["W Parallel Convergence shield if Ekko enters the zone"],
    softCrowdControl: ["Q Timewinder slow"],
    stealthOrInvisibility: null,
    sustain: ["R Chronobreak heal on cast."],
    trading: {
      badTradeConditions: [
        "W takes a while to activate, and if it misses he will take return damage in trades.",
        "If Ekko engages with E but misses with Q, he will often lose out in trades.",
        "Before level 6 Ekko is much easier to kill"
      ],
      goodTradeConditions: [],
      primaryPattern: "Use Timewinder and Phase Dive for quick burst, then disengage after proccing passive for movement speed to back off.",
    },
    punishWindows: [
  "W takes a while to activate, and if it misses he will take return damage in trades.",
  "If Ekko engages with E but misses with Q, he will often lose out in trades.",
  "Before level 6 Ekko is much easier to kill"
]
  } satisfies LeagueChampionKnowledgeProfile;
