import type { LeagueChampionKnowledgeProfile } from "./types";

export const leblancCombatProfile = {
    archetype: ["assassin", "poke", "mobility", "burst"],
    primaryWinCondition: ["Can be very hard to deal with in lane for other champions."],
    dangerAbilities: [],
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
    laneIdentity:
      "Mobile AP assassin who pressures with burst trades and punishes poor spacing.",
    majorPowerSpikes: [
      "Level 2 burst with Q plus W or E.",
      "Level 6 Mimic.",
      "First completed AP burst item.",
    ],
    mobilityLevel: "very_high",
    name: "LeBlanc",
    offMetaRoles: [],
    primaryRoles: ["mid"],
    secondaryRoles: [],
    primaryTradingPattern:
      "Use W Distortion for burst and repositioning, then threaten E Chains if the opponent cannot answer.",
    shields: [],
    softCrowdControl: [],
    stealthOrInvisibility: "Passive Mirror Image briefly makes her harder to identify at low health.",
    sustain: [],
    punishWindows: [
  "If LeBlanc uses W to engage and misses, she can be punished hard.",
  "Leblanc has very low waveclear, she can be pushed under tower and can easily be poked down, forcing her out of lane or into unfavorable trades if she tries to contest the push."
]
  } satisfies LeagueChampionKnowledgeProfile;
