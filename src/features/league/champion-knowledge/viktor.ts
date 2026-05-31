import type { LeagueChampionKnowledgeProfile } from "./types";

export const viktorCombatProfile = {
    profileQuality: "draft",
    abilities: {
      Q: "Siphon Power",
      W: "Gravity Field",
      E: "Death Ray",
      R: "Chaos Storm",
    },
    archetype: ["control mage", "scaling", "zone control"],
    primaryWinCondition: ["Scale with item upgrades to control space and teamfights."],
    dangerAbilities: [],
    dangerProfile: {
      dangerousWhen: [],
      mustRespect: [
            "W is delayed zone control, not instant CC.",
            "Q gives a shield, and bonus movement speed when evolved.",
            "E is his main poke tool, it can hit twice when evolved and should not be missed in trades.",
            "R is his ultimate ability, providing a powerful area-of-effect damage.",
            "Viktor wants to scale and evolve all his abilities",
          ],
    },
    commonWeaknesses: [
      "Immobile and vulnerable to hard engage.",
      "Needs upgrades and items to fully control fights.",
      "Can be punished when W is down.",
    ],
    damageType: "magic",
    hardCrowdControl: ["W Gravity Field stun after delay"],
    id: "Viktor",
    importantAbilityNotes: [
      "W is delayed zone control, not instant CC.",
      "Q gives a shield, and bonus movement speed when evolved.",
      "E is his main poke tool, it can hit twice when evolved and should not be missed in trades.",
      "R is his ultimate ability, providing a powerful area-of-effect damage.",
      "Viktor wants to scale and evolve all his abilities",
    ],
    lanePlan: {
      avoids: [
            "Immobile and vulnerable to hard engage.",
            "Needs upgrades and items to fully control fights.",
            "Can be punished when W is down.",
          ],
      idealLaneState: "Scaling control mage who farms, pokes with laser, and controls choke points.",
      wants: ["Scale with item upgrades to control space and teamfights."],
    },
    laneIdentity:
      {
      earlyGameAgency: "low",
      scalingPriority: "high",
      lanePressure: "medium",
      preferredGameState: ["Scale with item upgrades to control space and teamfights."],
      winLaneBy: ["Scale with item upgrades to control space and teamfights."],
    },
    majorPowerSpikes: [
      "Level 3 full basic ability access.",
      "Level 6 Chaos Storm.",
      "First completed mage item and evolution progress.",
      "Can adapt to a more tankier build (Rod of Ages and Liandry's Torment) if enemy team has strong all-in or dive threats."
    ],
    matchupPreferences: {
      strongInto: [],
      weakInto: [],
    },
    mobilityLevel: "none",
    name: "Viktor",
    offMetaRoles: [],
    powerSpikes: {
      major: [
            "Level 3 full basic ability access.",
            "Level 6 Chaos Storm.",
            "First completed mage item and evolution progress.",
            "Can adapt to a more tankier build (Rod of Ages and Liandry's Torment) if enemy team has strong all-in or dive threats."
          ],
      notes: [],
    },
    primaryRoles: ["mid"],
    secondaryRoles: ["top"],
    primaryTradingPattern:
      "Trade with Death Ray and Siphon Power shield while keeping Gravity Field for disengage.",
    punishProfile: {
      canPunish: [],
      strugglesToPunish: [
            "Immobile and vulnerable to hard engage.",
            "Needs upgrades and items to fully control fights.",
            "Can be punished when W is down.",
          ],
    },
    shields: ["Q Siphon Power"],
    softCrowdControl: ["W Gravity Field slow before stun"],
    stealthOrInvisibility: null,
    sustain: [],
    trading: {
      badTradeConditions: [
        "If Viktor place W in a bad spot, he is vulnerable.",
        "If Viktor uses abilities on wave clear only he can be punished by enemy laner."
      ],
      goodTradeConditions: [],
      primaryPattern: "Trade with Death Ray and Siphon Power shield while keeping Gravity Field for disengage.",
    },
    punishWindows: [
  "If Viktor place W in a bad spot, he is vulnerable.",
  "If Viktor uses abilities on wave clear only he can be punished by enemy laner."
]
  } satisfies LeagueChampionKnowledgeProfile;
