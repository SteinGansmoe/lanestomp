import type { LeagueChampionKnowledgeProfile } from "./types";

export const sylasCombatProfile = {
    archetype: ["skirmisher", "bruiser mage", "assassin"],
    primaryWinCondition: ["Use E Abscond / Abduct to engage or threaten, then look for extended trades with W Kingslayer and stolen ultimates."],
    dangerAbilities: ["E Abduct knockup/stun on hit"],
    commonWeaknesses: [
      "Can be punished when Kingslayer or Abscond / Abduct is down.",
      "Melee range makes early lane risky into poke.",
      "Ultimate value depends on enemy ultimates.",
    ],
    damageType: "magic",
    hardCrowdControl: ["E Abduct knockup/stun on hit"],
    id: "Sylas",
    importantAbilityNotes: [
      "Kingslayer is his main combat heal.",
      "Hijack depends on available enemy ultimates.",
      "Abscond / Abduct is his main engage and escape pattern.",
    ],
    laneIdentity:
      "Melee AP skirmisher who looks for extended trades and strong stolen ultimate windows.",
    majorPowerSpikes: [
      "Level 3 full basic ability access.",
      "Level 6 Hijack if valuable ultimates are available.",
      "First completed AP skirmish item.",
    ],
    mobilityLevel: "high",
    name: "Sylas",
    offMetaRoles: ["top", "jungle"],
    primaryRoles: ["mid"],
    secondaryRoles: [],
    primaryTradingPattern:
      "Use E to enter or threaten, trade with passive autos and Kingslayer, then disengage if cooldowns are down.",
    shields: [],
    softCrowdControl: ["Q Chain Lash slow"],
    stealthOrInvisibility: null,
    sustain: ["W Kingslayer heal"],
    punishWindows: [
  "If Sylas uses E to engage and misses, he can be punished hard.",
  "An early healing cut item can significantly reduce his sustain in trades.",
  "Being shoved under turret is not ideal for Sylas as his waveclear is not the best and he can be punished by enemy laner."
]
  } satisfies LeagueChampionKnowledgeProfile;
