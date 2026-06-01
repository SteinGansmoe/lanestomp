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
    strategicIdentity: {
      laneGoal: "teamfight",
      scalingProfile: "mid",
      preferredGameLength: "medium",
      winMethod: ["mobile skirmishes", "teamfight disruption", "flank pressure"],
    },
    powerSpikes: {
      major: [
        {
          timing: "Level 6",
          reason: "Level 6 ultimate for high mobility and burst",
          changesGameplay: "Aurora's ultimate becomes available, so the matchup shifts around whether the commit, pick, roam, or escape threat is ready.",
          playerAction: "Track R availability and use the window for verified all-ins, picks, roams, or defensive resets rather than forcing blind.",
          enemyResponse: "Respect Aurora's R window, hold key defensive tools for the commit, and punish after R is spent.",
        },
        {
          timing: "First completed AP burst item",
          reason: "First completed AP burst item",
          changesGameplay: "Aurora's damage, wave control, or trade reliability improves enough that earlier neutral trades can become losing trades.",
          playerAction: "After the item, pressure waves and trades more confidently while still tracking the enemy's main answer.",
          enemyResponse: "Do not treat pre-item trades as still safe once Aurora's first item threshold is completed.",
        },
      ],
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
