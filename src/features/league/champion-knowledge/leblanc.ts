import type { LeagueChampionKnowledgeProfile } from "./types";

export const leblancCombatProfile = {
    profileQuality: "draft",
    abilities: {
      Q: "Sigil of Malice",
      W: "Distortion",
      E: "Ethereal Chains",
      R: "Mimic",
    },
    archetype: ["assassin", "poke", "mobility", "burst"],
    primaryWinCondition: ["Can be very hard to deal with in lane for other champions."],
    dangerAbilities: [],
    dangerProfile: {
      dangerousWhen: [],
      mustRespect: [
            "Distortion is both her main damage pattern and mobility.",
            "Ethereal Chains root is delayed and can be broken by distance.",
            "Mimic repeats a basic ability after level 6.",
          ],
    },
    commonWeaknesses: [
      "Has low waveclear, if enemy pushes her she ends up farming under tower.",
      "Can be punished if her return pad is controlled.",
      "Needs clean ability chains to convert pressure.",
    ],
    damageType: "magic",
    hardCrowdControl: ["E Ethereal Chains root after tether completes"],
    id: "Leblanc",
    importantAbilityNotes: [
      "Distortion is both her main damage pattern and mobility.",
      "Ethereal Chains root is delayed and can be broken by distance.",
      "Mimic repeats a basic ability after level 6.",
    ],
    lanePlan: {
      avoids: [
            "Has low waveclear, if enemy pushes her she ends up farming under tower.",
            "Can be punished if her return pad is controlled.",
            "Needs clean ability chains to convert pressure.",
          ],
      idealLaneState: "Mobile AP assassin who pressures with burst trades and punishes poor spacing.",
      wants: ["Can be very hard to deal with in lane for other champions."],
    },
    laneIdentity:
      {
      earlyGameAgency: "low",
      scalingPriority: "high",
      lanePressure: "medium",
      preferredGameState: ["Can be very hard to deal with in lane for other champions."],
      winLaneBy: ["Can be very hard to deal with in lane for other champions."],
    },
    majorPowerSpikes: [
      "Level 2 burst with Q plus W or E.",
      "Level 6 Mimic.",
      "First completed AP burst item.",
    ],
    matchupPreferences: {
      strongInto: [],
      weakInto: [],
    },
    mobilityLevel: "very_high",
    name: "LeBlanc",
    offMetaRoles: [],
    powerSpikes: {
      major: [
            "Level 2 burst with Q plus W or E.",
            "Level 6 Mimic.",
            "First completed AP burst item.",
          ],
      notes: [],
    },
    primaryRoles: ["mid"],
    secondaryRoles: [],
    primaryTradingPattern:
      "Use W Distortion for burst and repositioning, then threaten E Chains if the opponent cannot answer.",
    punishProfile: {
      canPunish: [],
      strugglesToPunish: [
            "Has low waveclear, if enemy pushes her she ends up farming under tower.",
            "Can be punished if her return pad is controlled.",
            "Needs clean ability chains to convert pressure.",
          ],
    },
    shields: [],
    softCrowdControl: [],
    stealthOrInvisibility: "Passive Mirror Image briefly makes her harder to identify at low health.",
    sustain: [],
    trading: {
      badTradeConditions: [
        "If LeBlanc uses W to engage and misses, she can be punished hard.",
        "Leblanc has very low waveclear, she can be pushed under tower and can easily be poked down, forcing her out of lane or into unfavorable trades if she tries to contest the push."
      ],
      goodTradeConditions: [],
      primaryPattern: "Use W Distortion for burst and repositioning, then threaten E Chains if the opponent cannot answer.",
    },
    punishWindows: [
  "If LeBlanc uses W to engage and misses, she can be punished hard.",
  "Leblanc has very low waveclear, she can be pushed under tower and can easily be poked down, forcing her out of lane or into unfavorable trades if she tries to contest the push."
]
  } satisfies LeagueChampionKnowledgeProfile;
