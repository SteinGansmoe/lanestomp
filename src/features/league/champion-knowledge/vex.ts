import type { LeagueChampionKnowledgeProfile } from "./types";

export const vexCombatProfile = {
    profileQuality: "draft",
    abilities: {
      Q: "Mistral Bolt",
      W: "Personal Space",
      E: "Looming Darkness",
      R: "Shadow Surge",
    },
    archetype: ["anti-dash mage", "burst", "control"],
    primaryWinCondition: ["Utilize her passive to win trades in lane."],
    dangerAbilities: ["Passive Doom fear"],
    dangerProfile: {
      dangerousWhen: ["Passive Doom fear"],
      mustRespect: [
            "Using her passive correctly is key to winning lane.",
            "R is her level 6 engage/reset tool.",
            "She is strongest into champions that dash often.",
          ],
    },
    commonWeaknesses: [
      "Immobile outside ultimate reset windows.",
      "Fear timing can be baited or forced out.",
      "Can be outranged by artillery mages.",
    ],
    damageType: "magic",
    hardCrowdControl: ["Passive Doom fear"],
    id: "Vex",
    importantAbilityNotes: [
      "Using her passive correctly is key to winning lane.",
      "R is her level 6 engage/reset tool.",
      "She is strongest into champions that dash often.",
    ],
    lanePlan: {
      avoids: [
            "Immobile outside ultimate reset windows.",
            "Fear timing can be baited or forced out.",
            "Can be outranged by artillery mages.",
          ],
      idealLaneState: "Anti-mobility burst mage who controls dash champions with fear windows.",
      wants: ["Utilize her passive to win trades in lane."],
    },
    laneIdentity:
      {
      earlyGameAgency: "high",
      scalingPriority: "medium",
      lanePressure: "high",
      preferredGameState: ["Utilize her passive to win trades in lane."],
      winLaneBy: ["Utilize her passive to win trades in lane."],
    },
    majorPowerSpikes: [
      "Level 6 Shadow Surge.",
      "First completed AP burst item.",
    ],
    matchupPreferences: {
      strongInto: [],
      weakInto: [],
    },
    mobilityLevel: "medium",
    name: "Vex",
    offMetaRoles: [],
    powerSpikes: {
      major: [
            "Level 6 Shadow Surge.",
            "First completed AP burst item.",
          ],
      notes: [],
    },
    primaryRoles: ["mid"],
    secondaryRoles: [],
    primaryTradingPattern:
      "Use passive fear to win trades and easily proc electrocute.",
    punishProfile: {
      canPunish: [],
      strugglesToPunish: [
            "Immobile outside ultimate reset windows.",
            "Fear timing can be baited or forced out.",
            "Can be outranged by artillery mages.",
          ],
    },
    shields: ["W Personal Space shield"],
    softCrowdControl: ["E Looming Darkness slow"],
    stealthOrInvisibility: null,
    sustain: [],
    trading: {
      badTradeConditions: [
        "If Vex fails to land her fear, she can be all-inned.",
        "While her R is down she has no way to reset."
      ],
      goodTradeConditions: [],
      primaryPattern: "Use passive fear to win trades and easily proc electrocute.",
    },
    punishWindows: [
  "If Vex fails to land her fear, she can be all-inned.",
  "While her R is down she has no way to reset."
]
  } satisfies LeagueChampionKnowledgeProfile;
