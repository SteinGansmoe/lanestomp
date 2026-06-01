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
        {
          timing: "Level 6",
          reason: "Level 6 Final Spark",
          changesGameplay: "Lux's ultimate becomes available, so the matchup shifts around whether the commit, pick, roam, or escape threat is ready.",
          playerAction: "Track R availability and use the window for verified all-ins, picks, roams, or defensive resets rather than forcing blind.",
          enemyResponse: "Respect Lux's R window, hold key defensive tools for the commit, and punish after R is spent.",
        },
        {
          timing: "First completed mage item",
          reason: "First completed mage item",
          changesGameplay: "Lux's damage, wave control, or trade reliability improves enough that earlier neutral trades can become losing trades.",
          playerAction: "After the item, pressure waves and trades more confidently while still tracking the enemy's main answer.",
          enemyResponse: "Do not treat pre-item trades as still safe once Lux's first item threshold is completed.",
        },
      ],
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
