import type { LeagueChampionKnowledgeProfile } from "./types";

export const yasuoCombatProfile = {
    profileQuality: "draft",
    abilities: {
      Q: "Steel Tempest",
      W: "Wind Wall",
      E: "Sweeping Blade",
      R: "Last Breath",
    },
    archetype: ["skirmisher", "melee carry", "mobility", "skirmisher"],
    primaryWinCondition: ["Use Q and E to create mobility and control space, wants to fight close to minions."],
    dangerAbilities: ["Second Q tornado knockup, R Last Breath follow-up on airborne targets"],
    dangerProfile: {
      dangerousWhen: ["Second Q tornado knockup, R Last Breath follow-up on airborne targets"],
      mustRespect: [
            "E requires targets and cannot freely dash without them.",
            "W blocks many projectiles but not all abilities.",
            "R requires an airborne target.",
          ],
    },
    commonWeaknesses: [
      "Needs minion waves or targets for mobility.",
      "Vulnerable when Wind Wall and passive shield are down.",
      "Can be punished by controlled wave states and point-and-click CC.",
    ],
    damageType: "physical",
    hardCrowdControl: ["Q tornado knockup", "R Last Breath follow-up on airborne targets"],
    id: "Yasuo",
    importantAbilityNotes: [
      "E requires targets and cannot freely dash without them.",
      "W blocks many projectiles but not all abilities.",
      "R requires an airborne target.",
    ],
    lanePlan: {
      avoids: [
            "Needs minion waves or targets for mobility.",
            "Vulnerable when Wind Wall and passive shield are down.",
            "Can be punished by controlled wave states and point-and-click CC.",
          ],
      idealLaneState: "Melee AD skirmisher who uses waves for mobility, short trades, and all-ins off knockups.",
      wants: ["Use Q and E to create mobility and control space, wants to fight close to minions."],
    },
    laneIdentity:
      {
      earlyGameAgency: "medium",
      scalingPriority: "medium",
      lanePressure: "medium",
      preferredGameState: ["Use Q and E to create mobility and control space, wants to fight close to minions."],
      winLaneBy: ["Use Q and E to create mobility and control space, wants to fight close to minions."],
    },
    majorPowerSpikes: [
      "Level 2 access to Q plus E mobility.",
      "Level 6 R if knockup access exists.",
      "First completed item.",
    ],
    matchupPreferences: {
      strongInto: [],
      weakInto: [],
    },
    mobilityLevel: "very_high",
    name: "Yasuo",
    offMetaRoles: ["adc"],
    powerSpikes: {
      major: [
            "Level 2 access to Q plus E mobility.",
            "Level 6 R if knockup access exists.",
            "First completed item.",
          ],
      notes: [],
    },
    primaryRoles: ["mid"],
    secondaryRoles: ["top"],
    primaryTradingPattern:
      "Stack Q, dash through wave targets, use W against key projectiles, and commit on knockup threat.",
    punishProfile: {
      canPunish: [],
      strugglesToPunish: [
            "Needs minion waves or targets for mobility.",
            "Vulnerable when Wind Wall and passive shield are down.",
            "Can be punished by controlled wave states and point-and-click CC.",
          ],
    },
    shields: ["Passive Way of the Wanderer flow shield"],
    softCrowdControl: [],
    stealthOrInvisibility: null,
    sustain: [],
    trading: {
      badTradeConditions: [
        "When W is down, Yasuo has no real way of dodging.",
        "When there isnt a minion wave to E back and forth from."
      ],
      goodTradeConditions: [],
      primaryPattern: "Stack Q, dash through wave targets, use W against key projectiles, and commit on knockup threat.",
    },
    punishWindows: [
  "When W is down, Yasuo has no real way of dodging.",
  "When there isnt a minion wave to E back and forth from."
]
  } satisfies LeagueChampionKnowledgeProfile;
