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
        {
          timing: "Level 6",
          reason: "Level 6 Shadow Surge",
          changesGameplay: "Vex's ultimate becomes available, so the matchup shifts around whether the commit, pick, roam, or escape threat is ready.",
          playerAction: "Track R availability and use the window for verified all-ins, picks, roams, or defensive resets rather than forcing blind.",
          enemyResponse: "Respect Vex's R window, hold key defensive tools for the commit, and punish after R is spent.",
        },
        {
          timing: "First completed AP burst item",
          reason: "First completed AP burst item",
          changesGameplay: "Vex's damage, wave control, or trade reliability improves enough that earlier neutral trades can become losing trades.",
          playerAction: "After the item, pressure waves and trades more confidently while still tracking the enemy's main answer.",
          enemyResponse: "Do not treat pre-item trades as still safe once Vex's first item threshold is completed.",
        },
      ],
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
