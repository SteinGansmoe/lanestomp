import type { LeagueChampionKnowledgeProfile } from "./types";

export const xerathCombatProfile = {
    archetype: ["artillery mage", "poke", "siege"],
    primaryWinCondition: ["Use Q and W to control space and poke, can have decent map pressure post level 6 due to his ultimate."],
    dangerAbilities: ["E Shocking Orb stun"],
    commonWeaknesses: [
      "Immobile and vulnerable to flank or all-in pressure.",
      "Skillshot reliant.",
      "Struggles when enemies dodge poke and force close fights.",
      "Becomes incredibly strong after 2 items are completed."
    ],
    damageType: "magic",
    hardCrowdControl: ["E Shocking Orb stun"],
    id: "Xerath",
    importantAbilityNotes: [
      "E is his key self-peel tool.",
      "R gives long-range level 6 follow-up.",
      "Positioning is crucial for maximizing his damage potential and survival.",
    ],
    laneIdentity:
      "Long-range artillery mage who wins through poke, waveclear, and spacing.",
    majorPowerSpikes: [
      "Level 3 full basic ability access.",
      "Level 6 Rite of the Arcane.",
      "First completed mana/AP item.",
    ],
    mobilityLevel: "none",
    name: "Xerath",
    offMetaRoles: [],
    primaryRoles: ["support"],
    secondaryRoles: ["mid"],
    primaryTradingPattern:
      "Q for long range poke, use W for slow to hit Q easier, and hold E defensively or use if you're guaranteed to hit.",
    shields: [],
    softCrowdControl: ["W Eye of Destruction slow"],
    stealthOrInvisibility: null,
    sustain: [],
    punishWindows: [
  "If Xerath uses E and misses he has to play back.",
  "When charging his Q."
]
  } satisfies LeagueChampionKnowledgeProfile;
