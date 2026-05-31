import type { LeagueChampionKnowledgeProfile } from "./types";

export const luxCombatProfile = {
    profileQuality: "draft",
    abilities: {
      Q: "Light Binding",
      W: "Prismatic Barrier",
      E: "Lucent Singularity",
      R: "Final Spark",
    },
    archetype: ["artillery mage", "pick", "poke", "burst"],
    primaryWinCondition: [],
    dangerAbilities: [],
    dangerProfile: {
      dangerousWhen: [],
      mustRespect: [
            "Light Binding is her key defensive and pick tool.",
            "Prismatic Barrier shields allies and herself.",
            "Q + E + R does significant damage.",
          ],
    },
    commonWeaknesses: [
      "If Q is used recklessly, she can be punished.",
      "Skillshot reliant.",
      "Can be all-inned if she loses range control.",
    ],
    damageType: "magic",
    hardCrowdControl: ["Q Light Binding root"],
    id: "Lux",
    importantAbilityNotes: [
      "Light Binding is her key defensive and pick tool.",
      "Prismatic Barrier shields allies and herself.",
      "Q + E + R does significant damage.",
    ],
    lanePlan: {
      avoids: [
            "If Q is used recklessly, she can be punished.",
            "Skillshot reliant.",
            "Can be all-inned if she loses range control.",
          ],
      idealLaneState: "Long-range mage who controls lane with poke, binding threat, and waveclear.",
      wants: [],
    },
    laneIdentity:
      {
      earlyGameAgency: "high",
      scalingPriority: "medium",
      lanePressure: "high",
      preferredGameState: [],
      winLaneBy: [],
    },
    majorPowerSpikes: [
      "Level 3 full basic ability access.",
      "Level 6 Final Spark.",
      "First completed mage item.",
    ],
    matchupPreferences: {
      strongInto: [],
      weakInto: [],
    },
    mobilityLevel: "none",
    name: "Lux",
    offMetaRoles: [],
    powerSpikes: {
      major: [
            "Level 3 full basic ability access.",
            "Level 6 Final Spark.",
            "First completed mage item.",
          ],
      notes: [],
    },
    primaryRoles: ["support"],
    secondaryRoles: ["mid"],
    primaryTradingPattern:
      "Poke with Lucent Singularity and punish oversteps with Light Binding into burst.",
    punishProfile: {
      canPunish: [],
      strugglesToPunish: [
            "If Q is used recklessly, she can be punished.",
            "Skillshot reliant.",
            "Can be all-inned if she loses range control.",
          ],
    },
    shields: ["W Prismatic Barrier"],
    softCrowdControl: ["E Lucent Singularity slow"],
    stealthOrInvisibility: null,
    sustain: [],
    trading: {
      badTradeConditions: [
        "If Lux misses Q she can be punished.",
        "Skillshot reliant champions like Lux can be punished by dodging their key abilities and forcing them into unfavorable trades."
      ],
      goodTradeConditions: [],
      primaryPattern: "Poke with Lucent Singularity and punish oversteps with Light Binding into burst.",
    },
    punishWindows: [
  "If Lux misses Q she can be punished.",
  "Skillshot reliant champions like Lux can be punished by dodging their key abilities and forcing them into unfavorable trades."
]
  } satisfies LeagueChampionKnowledgeProfile;
