import type { LeagueChampionKnowledgeProfile } from "./types";

export const auroraCombatProfile = {
    profileQuality: "draft",
    abilities: {
      Q: "Twofold Hex",
      W: "Across the Veil",
      E: "The Weirding",
      R: "Between Worlds",
    },
    archetype: ["mobile mage", "assassin", "pick", "burst"],
    primaryWinCondition: [""],
    dangerAbilities: [""],
    dangerProfile: {
      dangerousWhen: [""],
      mustRespect: [
            "Aurora's kit is designed around mobility and burst, with a focus on picking off targets and snowballing leads.",
          ],
    },
    commonWeaknesses: [
      "Aurora has relativley low range, if she is poked out of lane she can struggle to farm and find picks.",
      "The E animation is quite long, easily dodgable.",
    ],
    damageType: "magic",
    hardCrowdControl: [""],
    id: "Aurora",
    importantAbilityNotes: [
      "Aurora's kit is designed around mobility and burst, with a focus on picking off targets and snowballing leads.",
    ],
    lanePlan: {
      avoids: [
            "Aurora has relativley low range, if she is poked out of lane she can struggle to farm and find picks.",
            "The E animation is quite long, easily dodgable.",
          ],
      idealLaneState: "Mobile mage assassin who looks for picks and burst windows.",
      wants: [""],
    },
    laneIdentity:
      {
      earlyGameAgency: "low",
      scalingPriority: "high",
      lanePressure: "medium",
      preferredGameState: [""],
      winLaneBy: [""],
    },
    majorPowerSpikes: [
        "Level 3 full basic ability access.",
        "Level 6 ultimate for high mobility and burst.",
        "First completed AP burst item.",
    ],
    matchupPreferences: {
      strongInto: [],
      weakInto: [],
    },
    mobilityLevel: "medium",
    name: "Aurora",
    offMetaRoles: [],
    powerSpikes: {
      major: [
              "Level 3 full basic ability access.",
              "Level 6 ultimate for high mobility and burst.",
              "First completed AP burst item.",
          ],
      notes: [],
    },
    primaryRoles: ["mid"],
    secondaryRoles: ["top"],
    primaryTradingPattern:
      "Cast Q, immediately follow up with E for repositioning and damage, reactivate Q again.",
    punishProfile: {
      canPunish: [],
      strugglesToPunish: [
            "Aurora has relativley low range, if she is poked out of lane she can struggle to farm and find picks.",
            "The E animation is quite long, easily dodgable.",
          ],
    },
    shields: [],
    softCrowdControl: ["E slow"],
    stealthOrInvisibility: "W gives a brief burst of movement speed and invisibility, allowing Aurora to dodge skillshots and reposition in fights.",
    sustain: [""],
    trading: {
      badTradeConditions: [
            "After Aurora uses W, she has no quick escape tool.",
            "E is quite easy to dodge, trade back if you can avoid it."
      ],
      goodTradeConditions: [],
      primaryPattern: "Cast Q, immediately follow up with E for repositioning and damage, reactivate Q again.",
    },
    punishWindows: [
      "After Aurora uses W, she has no quick escape tool.",
      "E is quite easy to dodge, trade back if you can avoid it."
]
  } satisfies LeagueChampionKnowledgeProfile;
