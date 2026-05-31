import type { LeagueChampionKnowledgeProfile } from "./types";

export const oriannaCombatProfile = {
    archetype: ["control mage", "teamfight", "scaling"],
    primaryWinCondition: ["Control the lane with ball placement and create opportunities for teamfighting."],
    dangerAbilities: ["R Command: Shockwave displacement"],
    commonWeaknesses: [
      "Immobile and vulnerable to direct all-ins.",
      "Needs ball position to threaten or defend.",
      "Can be pressured before enough mana and AP.",
    ],
    damageType: "magic",
    hardCrowdControl: ["R Command: Shockwave displacement"],
    id: "Orianna",
    importantAbilityNotes: [
      "Ball position controls her threat zone.",
      "Command: Protect gives a shield.",
      "Shockwave is her level 6 teamfight spike.",
    ],
    laneIdentity:
      "Control mage who wins through spacing, ball control, wave management, and teamfight setup.",
    majorPowerSpikes: [
      "Level 3 full basic ability access.",
      "Level 6 Command: Shockwave.",
      "First completed mage item.",
    ],
    mobilityLevel: "none",
    name: "Orianna",
    offMetaRoles: [],
    primaryRoles: ["mid"],
    secondaryRoles: [],
    primaryTradingPattern:
      "Use ball placement to zone and poke, then shield or speed herself through return trades.",
    shields: ["E Command: Protect"],
    softCrowdControl: ["W Command: Dissonance slow/speed zone"],
    stealthOrInvisibility: null,
    sustain: [],
    punishWindows: [
  "Punish early while Q has a longer cooldown.",
  "She can be punished if she uses her abilities recklessly."
]
  } satisfies LeagueChampionKnowledgeProfile;
