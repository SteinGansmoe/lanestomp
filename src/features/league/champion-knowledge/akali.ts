import type { LeagueChampionKnowledgeProfile } from "./types";

export const akaliCombatProfile = {
    profileQuality: "draft",
    abilities: {
      Q: "Five Point Strike",
      W: "Twilight Shroud",
      E: "Shuriken Flip",
      R: "Perfect Execution",
    },
    archetype: ["assassin", "skirmisher", "burst"],
    primaryWinCondition: ["Use W Twilight Shroud to create safe windows for extended trades and all-ins."],
    dangerAbilities: ["W Twilight Shroud, E Shuriken Flip"],
    dangerProfile: {
      dangerousWhen: ["W Twilight Shroud, E Shuriken Flip"],
      mustRespect: [
            "Twilight Shroud is not a level 6 spike.",
            "Twilight Shroud creates her safest trading window.",
            "Shuriken Flip recast is a major commit point.",
          ],
    },
    commonWeaknesses: [
      "Can be punished when Twilight Shroud is down.",
      "Early waveclear can be exploitable by ranged mids.",
      "Needs energy and ability access to extend trades.",
    ],
    damageType: "magic",
    hardCrowdControl: [],
    id: "Akali",
    importantAbilityNotes: [
      "Twilight Shroud is not a level 6 spike.",
      "Twilight Shroud creates her safest trading window.",
      "Shuriken Flip recast is a major commit point.",
    ],
    lanePlan: {
      avoids: [
            "Can be punished when Twilight Shroud is down.",
            "Early waveclear can be exploitable by ranged mids.",
            "Needs energy and ability access to extend trades.",
          ],
      idealLaneState: "Melee AP assassin who gives ground early, becomes stronger after level 3.",
      wants: ["Use W Twilight Shroud to create safe windows for extended trades and all-ins."],
    },
    laneIdentity:
      {
      earlyGameAgency: "high",
      scalingPriority: "medium",
      lanePressure: "high",
      preferredGameState: ["Use W Twilight Shroud to create safe windows for extended trades and all-ins."],
      winLaneBy: ["Use W Twilight Shroud to create safe windows for extended trades and all-ins."],
    },
    majorPowerSpikes: [
      "Level 3 full basic ability access.",
      "Level 6 Perfect Execution.",
      "First completed AP assassin item.",
    ],
    matchupPreferences: {
      strongInto: [],
      weakInto: [],
    },
    mobilityLevel: "very_high",
    name: "Akali",
    offMetaRoles: [],
    powerSpikes: {
      major: [
            "Level 3 full basic ability access.",
            "Level 6 Perfect Execution.",
            "First completed AP assassin item.",
          ],
      notes: [],
    },
    primaryRoles: ["mid"],
    secondaryRoles: ["top"],
    primaryTradingPattern:
      "Look for Q poke into passive autos, then commit harder with Shroud or E when the opponent is exposed.",
    punishProfile: {
      canPunish: [],
      strugglesToPunish: [
            "Can be punished when Twilight Shroud is down.",
            "Early waveclear can be exploitable by ranged mids.",
            "Needs energy and ability access to extend trades.",
          ],
    },
    shields: [],
    softCrowdControl: ["Short slow on Q hit"],
    stealthOrInvisibility: "W Twilight Shroud obscures Akali and enables trades.",
    sustain: [],
    trading: {
      badTradeConditions: [
        "When Akali uses W, if the opponent can step out of the shroud or wait it out, she can be punished hard.",
      ],
      goodTradeConditions: [],
      primaryPattern: "Look for Q poke into passive autos, then commit harder with Shroud or E when the opponent is exposed.",
    },
    punishWindows: [
  "When Akali uses W, if the opponent can step out of the shroud or wait it out, she can be punished hard.",
]
  } satisfies LeagueChampionKnowledgeProfile;
