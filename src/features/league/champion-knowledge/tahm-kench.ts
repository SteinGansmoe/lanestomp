import type { LeagueChampionKnowledgeProfile } from "./types";

export const tahmKenchCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "medium",
  abilities: { Q: "Tongue Lash", W: "Abyssal Dive", E: "Thick Skin", R: "Devour" },
  archetype: ["tank", "pick", "sustain shield", "protector"],
  primaryWinCondition: [
    "Win short melee trades with (Q) and passive stacks, absorb damage with (E), and use (R) to isolate enemies or protect allies.",
  ],
  dangerAbilities: ["(Q) slow/stun with stacks", "(W) knockup", "(R) devour"],
  dangerProfile: {
    dangerousWhen: [
      "Passive stacks are close to three.",
      "(Q) can stun at three stacks.",
      "(R) can remove a target from the fight.",
    ],
    mustRespect: [
      "His durability makes small trades hard to finish.",
      "Stacks change whether (Q) is only a slow or a stun.",
      "(R) gives both pick and protection value.",
    ],
  },
  commonWeaknesses: [
    "Low waveclear.",
    "Can be kited.",
    "Needs repeated contact for passive stack threat.",
  ],
  damageType: "magic",
  hardCrowdControl: ["Stacked (Q) stun", "(W) knockup", "(R) devour"],
  id: "TahmKench",
  importantAbilityNotes: [
    "Passive stacks enable stun and devour threat.",
    "(Q) slows and can stun at max stacks.",
    "(E) stores gray health for shielding/healing.",
    "(R) devours enemy or ally depending on target.",
  ],
  lanePlan: {
    avoids: [
      "Letting enemies kite before stacks build.",
      "Using (W) where it is easy to dodge.",
      "Fighting without (E) gray health value.",
    ],
    idealLaneState:
      "A short top lane trade pattern where Tahm can build passive stacks, land (Q), and absorb retaliation with (E).",
    wants: [
      "Melee contact.",
      "Repeated short trades.",
      "Targets that cannot leave before three stacks.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "medium",
    lanePressure: "medium",
    preferredGameState: [
      "Short melee trades.",
      "Front-line peel fights.",
      "Pick skirmishes around (R).",
    ],
    scalingPriority: "medium",
    winLaneBy: [
      "Building passive stacks.",
      "Landing stacked (Q).",
      "Using (E) to absorb return damage.",
    ],
  },
  majorPowerSpikes: ["Level 6 (R).", "First tank item.", "Front-line teamfight durability."],
  matchupPreferences: {
    strongInto: [
      "Melee champions with low disengage.",
      "Burst patterns absorbed by (E).",
      "Teams needing a protected carry.",
    ],
    weakInto: ["Ranged poke.", "High mobility champions.", "Waveclear lanes that avoid trades."],
  },
  mobilityLevel: "low",
  name: "Tahm Kench",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "Level 6",
        reason: "(R) adds devour pick or protection",
        changesGameplay: "Tahm can isolate enemies or save allies from lethal commits.",
        playerAction: "Use (R) for decisive target control rather than low-value damage.",
        enemyResponse: "Avoid three-stack states and track devour cooldown.",
      },
      {
        timing: "First tank item",
        reason: "Durability improves gray-health trades",
        changesGameplay: "He can absorb more damage before shielding with (E).",
        playerAction: "Take short trades and convert stack threat into lane control.",
        enemyResponse: "Kite and avoid repeated contact.",
      },
    ],
  },
  primaryRoles: ["support", "top"],
  primaryTradingPattern:
    "Build passive stacks through short trades, land (Q) to slow or stun, and use (E) after absorbing meaningful damage.",
  punishProfile: {
    canPunish: [
      "Melee targets at high passive stacks.",
      "Enemies who burst into (E).",
      "Targets caught by (R).",
    ],
    strugglesToPunish: ["Ranged champions.", "Enemies that disengage before stacks."],
  },
  secondaryRoles: [],
  shields: ["(E) gray health shield"],
  softCrowdControl: ["(Q) slow"],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "survive",
    preferredGameLength: "medium",
    scalingProfile: "mid",
    winMethod: ["durable trades", "target devour", "front-line protection"],
  },
  sustain: ["(E) gray health healing"],
  trading: {
    badTradeConditions: [
      "Passive stacks fall off.",
      "(E) has no gray health value.",
      "The enemy can kite outside (Q).",
    ],
    goodTradeConditions: [
      "He can build three stacks.",
      "(Q) is lined up.",
      "Enemy burst can be converted into (E).",
    ],
    primaryPattern:
      "Stack first, threaten tongue stun or devour second, and use durability to make trades inefficient for the opponent.",
  },
  punishWindows: [
    "When passive stacks are gone, his threat resets.",
    "If (W) misses, engage is weak.",
    "Ranged champions can punish his low waveclear.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
