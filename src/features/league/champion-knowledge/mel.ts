import type { LeagueChampionKnowledgeProfile } from "./types";

export const melCombatProfile = {
  profileQuality: "draft",
  abilities: {
    Q: "Radiant Volley",
    W: "Rebuttal",
    E: "Solar Snare",
    R: "Golden Eclipse",
  },
  archetype: ["mage", "poke", "reflect", "burst"],
  primaryWinCondition: [
    "Poke and mark enemies from range, use Rebuttal to deny key projectiles, then finish marked targets with R.",
  ],
  dangerAbilities: ["W Rebuttal projectile reflect", "E Solar Snare root", "R Golden Eclipse global mark detonation"],
  dangerProfile: {
    dangerousWhen: [
      "Enemies are marked and low enough for R to finish.",
      "W is available into projectile-heavy trades.",
      "E can root a target for follow-up poke.",
    ],
    mustRespect: [
      "W can turn important projectile spells back against the caster.",
      "E gives her pick setup but is avoidable.",
      "R depends on existing marks and is not a normal lane poke spell.",
    ],
  },
  commonWeaknesses: [
    "Vulnerable when W is unavailable.",
    "Can be punished by direct engage that is not projectile-reliant.",
    "Needs clean spell hits before R becomes threatening.",
  ],
  damageType: "magic",
  hardCrowdControl: ["E Solar Snare root"],
  id: "Mel",
  importantAbilityNotes: [
    "Q is her main poke and mark application tool.",
    "W is a powerful defensive reflect against projectiles.",
    "E roots and helps set up further damage.",
    "R detonates marks and should be evaluated around marked targets.",
  ],
  lanePlan: {
    avoids: [
      "Spending W before the enemy's key projectile threat.",
      "Standing in engage range after missing E.",
      "Using R without meaningful marks or lethal pressure.",
    ],
    idealLaneState:
      "A ranged lane where Mel can poke safely, hold W for key projectile trades, and build mark pressure before committing.",
    wants: [
      "Projectile matchups where W can swing trades.",
      "Root setups from E into Q follow-up.",
      "Low-health marked targets for R cleanup.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "medium",
    lanePressure: "medium",
    preferredGameState: [
      "Ranged poke lanes with room to kite.",
      "Projectile-heavy matchups where Rebuttal has high value.",
      "Fights where targets are marked before her final commit.",
    ],
    scalingPriority: "medium",
    winLaneBy: [
      "Winning projectile trades through W timing.",
      "Landing E to set up poke and mark pressure.",
      "Using R only when marks and health thresholds make it valuable.",
    ],
  },
  majorPowerSpikes: [
    "Level 3 full basic ability access.",
    "Level 6 Golden Eclipse.",
    "First completed mage item.",
  ],
  matchupPreferences: {
    strongInto: [
      "Projectile-reliant mages she can punish with W.",
      "Immobile targets that struggle to dodge E.",
      "Poke lanes where she can fight at range.",
    ],
    weakInto: [
      "Hard engage that bypasses projectile reflection.",
      "Champions who can bait W and re-engage.",
      "Long-range pressure that outranges her setup.",
    ],
  },
  mobilityLevel: "low",
  name: "Mel",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      "Level 3 full basic ability access.",
      "Level 6 Golden Eclipse.",
      "First completed mage item.",
    ],
    notes: [
      "W timing can decide trades more than raw damage.",
      "R is strongest after she has already marked and chipped targets.",
    ],
  },
  primaryRoles: ["mid"],
  secondaryRoles: [],
  primaryTradingPattern:
    "Poke with Q, hold W for important projectile trades, and use E to root targets before committing more damage.",
  punishProfile: {
    canPunish: [
      "Projectile spells cast into W.",
      "Immobile targets rooted by E.",
      "Marked low-health enemies with R.",
    ],
    strugglesToPunish: [
      "Non-projectile engage that reaches her directly.",
      "Champions who wait out W before using key spells.",
    ],
  },
  shields: [],
  softCrowdControl: [],
  stealthOrInvisibility: null,
  sustain: [],
  trading: {
    badTradeConditions: [
      "W is down against projectile burst.",
      "E misses and the enemy can engage.",
      "No marks are present for meaningful R pressure.",
    ],
    goodTradeConditions: [
      "The enemy commits a key projectile into W.",
      "E lands and gives time for Q follow-up.",
      "Targets are marked and low enough for R to matter.",
    ],
    primaryPattern:
      "Use ranged poke to create marks, protect key moments with W, and avoid overcommitting before E or R has real value.",
  },
  punishWindows: [
    "If Mel uses W early, projectile champions can punish the cooldown.",
    "If E misses, she has limited peel against direct engage.",
    "R is low value when targets are unmarked or healthy.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
