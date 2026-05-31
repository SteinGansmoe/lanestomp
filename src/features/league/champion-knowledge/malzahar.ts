import type { LeagueChampionKnowledgeProfile } from "./types";

export const malzaharCombatProfile = {
    profileQuality: "draft",
    abilities: {
      Q: "Call of the Void",
      W: "Void Swarm",
      E: "Malefic Visions",
      R: "Nether Grasp",
    },
    archetype: ["control mage", "anti-carry", "push"],
    primaryWinCondition: ["Keep midlane pushed permanently, eventually allowing Malzahar to have presence around the map."],
    dangerAbilities: ["R Nether Grasp suppression"],
    dangerProfile: {
      dangerousWhen: ["R Nether Grasp suppression"],
      mustRespect: [
            "Passive Void Shift is a spell shield, not sustain.",
            "Nether Grasp is his level 6 point-and-click lockdown.",
            "Voidlings help push but are vulnerable to area damage.",
          ],
    },
    commonWeaknesses: [
      "He can be punished in the early levels by someone who can counter his push.",
      "Predictable lane pattern.",
      "Ultimate channel can be interrupted by external crowd control.",
    ],
    damageType: "magic",
    hardCrowdControl: ["R Nether Grasp suppression", "Q Call of the Void silence"],
    id: "Malzahar",
    importantAbilityNotes: [
      "Passive Void Shift is a spell shield, not sustain.",
      "Nether Grasp is his level 6 point-and-click lockdown.",
      "Voidlings help push but are vulnerable to area damage.",
    ],
    lanePlan: {
      avoids: [
            "He can be punished in the early levels by someone who can counter his push.",
            "Predictable lane pattern.",
            "Ultimate channel can be interrupted by external crowd control.",
          ],
      idealLaneState: "Push-focused control mage who neutralizes lane and threatens level 6 lockdown.",
      wants: ["Keep midlane pushed permanently, eventually allowing Malzahar to have presence around the map."],
    },
    laneIdentity:
      {
      earlyGameAgency: "medium",
      scalingPriority: "medium",
      lanePressure: "medium",
      preferredGameState: ["Keep midlane pushed permanently, eventually allowing Malzahar to have presence around the map."],
      winLaneBy: ["Keep midlane pushed permanently, eventually allowing Malzahar to have presence around the map."],
    },
    majorPowerSpikes: [
      "Level 3 full basic ability access.",
      "Level 6 Nether Grasp.",
      "First completed mana/AP item.",
    ],
    matchupPreferences: {
      strongInto: [],
      weakInto: [],
    },
    mobilityLevel: "none",
    name: "Malzahar",
    offMetaRoles: [],
    powerSpikes: {
      major: [
            "Level 3 full basic ability access.",
            "Level 6 Nether Grasp.",
            "First completed mana/AP item.",
          ],
      notes: [],
    },
    primaryRoles: ["mid"],
    secondaryRoles: ["top"],
    primaryTradingPattern:
      "Push with Malefic Visions and Voidlings, then threaten silence or ultimate when the enemy steps forward.",
    punishProfile: {
      canPunish: [],
      strugglesToPunish: [
            "He can be punished in the early levels by someone who can counter his push.",
            "Predictable lane pattern.",
            "Ultimate channel can be interrupted by external crowd control.",
          ],
    },
    shields: ["Passive Void Shift spell shield"],
    softCrowdControl: [],
    stealthOrInvisibility: null,
    sustain: [],
    trading: {
      badTradeConditions: [
        "Early levels Malzahar can be pushed under tower if enemy focus on killing Voidlings as they spawn",
        "If Malzahar cannot maintain lane pressure, he does not have the tools to counter the push early."
      ],
      goodTradeConditions: [],
      primaryPattern: "Push with Malefic Visions and Voidlings, then threaten silence or ultimate when the enemy steps forward.",
    },
    punishWindows: [
  "Early levels Malzahar can be pushed under tower if enemy focus on killing Voidlings as they spawn",
  "If Malzahar cannot maintain lane pressure, he does not have the tools to counter the push early."
]
  } satisfies LeagueChampionKnowledgeProfile;
