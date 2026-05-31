import type { LeagueChampionKnowledgeProfile } from "./types";

export const vexCombatProfile = {
    archetype: ["anti-dash mage", "burst", "control"],
    primaryWinCondition: ["Utilize her passive to win trades in lane."],
    dangerAbilities: ["Passive Doom fear"],
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
    laneIdentity:
      "Anti-mobility burst mage who controls dash champions with fear windows.",
    majorPowerSpikes: [
      "Level 3 full basic ability access.",
      "Level 6 Shadow Surge.",
      "First completed AP burst item.",
    ],
    mobilityLevel: "medium",
    name: "Vex",
    offMetaRoles: [],
    primaryRoles: ["mid"],
    secondaryRoles: [],
    primaryTradingPattern:
      "Use passive fear to win trades and easily proc electrocute.",
    shields: ["W Personal Space shield"],
    softCrowdControl: ["E Looming Darkness slow"],
    stealthOrInvisibility: null,
    sustain: [],
    punishWindows: [
  "If Vex fails to land her fear, she can be all-inned.",
  "While her R is down she has no way to reset."
]
  } satisfies LeagueChampionKnowledgeProfile;
