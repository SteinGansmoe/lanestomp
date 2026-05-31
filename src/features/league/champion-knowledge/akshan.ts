import type { LeagueChampionKnowledgeProfile } from "./types";

export const akshanCombatProfile = {
    profileQuality: "draft",
    abilities: {
      Q: "Avengerang",
      W: "Going Rogue",
      E: "Heroic Swing",
      R: "Comeuppance",
    },
    archetype: ["marksman", "roam", "lane bully"],
    primaryWinCondition: ["Use E Heroic Swing to punish overextensions and create roam opportunities."],
    dangerAbilities: ["E Paddle Star", "R Comeuppance"],
    dangerProfile: {
      dangerousWhen: ["E Paddle Star", "R Comeuppance"],
      mustRespect: [
            "W Going Rogue is camouflage and roaming utility, not a direct combat spell.",
            "Heroic Swing is his main mobility and commit tool.",
            "He should not be described as a crowd-control champion.",
          ],
    },
    commonWeaknesses: [
      "Short range for a marksman makes positioning risky.",
      "Heroic Swing can be interrupted or punished if used forward.",
      "Falls behind if early pressure does not convert.",
    ],
    damageType: "physical",
    hardCrowdControl: [],
    id: "Akshan",
    importantAbilityNotes: [
      "W Going Rogue is camouflage and roaming utility, not a direct combat spell.",
      "Heroic Swing is his main mobility and commit tool.",
      "He should not be described as a crowd-control champion.",
    ],
    lanePlan: {
      avoids: [
            "Short range for a marksman makes positioning risky.",
            "Heroic Swing can be interrupted or punished if used forward.",
            "Falls behind if early pressure does not convert.",
          ],
      idealLaneState: "Ranged AD lane bully who pressures short trades, early push, and side movement.",
      wants: ["Use E Heroic Swing to punish overextensions and create roam opportunities."],
    },
    laneIdentity:
      {
      earlyGameAgency: "high",
      scalingPriority: "medium",
      lanePressure: "high",
      preferredGameState: ["Use E Heroic Swing to punish overextensions and create roam opportunities."],
      winLaneBy: ["Use E Heroic Swing to punish overextensions and create roam opportunities."],
    },
    majorPowerSpikes: [
      "Level 2 access to Q plus E or W utility.",
      "Level 6 Comeuppance.",
      "First completed AD marksman item.",
    ],
    matchupPreferences: {
      strongInto: [],
      weakInto: [],
    },
    mobilityLevel: "high",
    name: "Akshan",
    offMetaRoles: [],
    powerSpikes: {
      major: [
            "Level 2 access to Q plus E or W utility.",
            "Level 6 Comeuppance.",
            "First completed AD marksman item.",
          ],
      notes: [],
    },
    primaryRoles: ["mid"],
    secondaryRoles: [],
    primaryTradingPattern:
      "Use autos and Avengerang for short ranged pressure, then reposition with Heroic Swing.",
    punishProfile: {
      canPunish: [],
      strugglesToPunish: [
            "Short range for a marksman makes positioning risky.",
            "Heroic Swing can be interrupted or punished if used forward.",
            "Falls behind if early pressure does not convert.",
          ],
    },
    shields: [],
    softCrowdControl: [],
    stealthOrInvisibility: "W Going Rogue grants camouflage outside direct combat.",
    sustain: [],
    trading: {
      badTradeConditions: [
        "After Akshan uses E to engage, if he misses or is interrupted he can be punished hard.",
      ],
      goodTradeConditions: [],
      primaryPattern: "Use autos and Avengerang for short ranged pressure, then reposition with Heroic Swing.",
    },
    punishWindows: [
  "After Akshan uses E to engage, if he misses or is interrupted he can be punished hard.",
]
  } satisfies LeagueChampionKnowledgeProfile;
