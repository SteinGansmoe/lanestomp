import type { LeagueChampionKnowledgeProfile } from "./types";

export const fizzCombatProfile = {
    archetype: ["assassin", "burst", "skirmisher"],
    primaryWinCondition: ["Short trades until target is in kill range."],
    dangerAbilities: [],
    commonWeaknesses: [
      "If enemy team is very tanky, Fizz might not be able to secure kills.",
      "Have to be very careful before level 3, give up minions to not lose hp.",
      "Is a melee champion.",
    ],
    damageType: "magic",
    hardCrowdControl: ["R Chum the Waters knockup"],
    id: "Fizz",
    importantAbilityNotes: [
      "E Playful / Trickster is his main dodge, engage, and escape tool.",
      "R Chum the Waters creates his level 6 kill threat.",
      "He has no reliable hard CC before ultimate.",
    ],
    laneIdentity:
      "Melee AP assassin who survives early pressure and looks for level 6 burst windows.",
    majorPowerSpikes: [
      "Level 3 full basic ability access.",
      "Level 6 Chum the Waters.",
      "First completed AP assassin item.",
    ],
    mobilityLevel: "high",
    name: "Fizz",
    offMetaRoles: [],
    primaryRoles: ["mid"],
    secondaryRoles: ["jungle"],
    primaryTradingPattern:
      "Dash in for burst, use Playful / Trickster to dodge the key answer, then exit or finish.",
    shields: [],
    softCrowdControl: ["E Playful / Trickster slow"],
    stealthOrInvisibility: null,
    sustain: [],
    punishWindows: [
  "If Fizz uses E recklessly, he will struggle.",
  "Before Fizz turns level 3 he is very weak, if he steps up attack him"
]
  } satisfies LeagueChampionKnowledgeProfile;
