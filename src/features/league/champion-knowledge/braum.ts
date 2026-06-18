import type { LeagueChampionKnowledgeProfile } from "./types";

export const braumCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "medium",
  abilities: { Q: "Winter's Bite", W: "Stand Behind Me", E: "Unbreakable", R: "Glacial Fissure" },
  archetype: ["support", "warden", "peel", "tank"],
  primaryWinCondition: [
    "Protect his ADC with (E), turn extended trades through passive stacks, and punish dives with layered slows and knockups.",
  ],
  dangerAbilities: ["Passive stun", "(E) projectile block", "(R) disengage or engage"],
  dangerProfile: {
    dangerousWhen: [
      "His ADC can quickly stack passive.",
      "He stands between poke and his ADC.",
      "(R) can split an engage path.",
    ],
    mustRespect: [
      "Fast-attacking ADCs make his passive much stronger.",
      "(E) can deny key poke or ultimates.",
      "(W) lets him reposition to protect allies.",
    ],
  },
  commonWeaknesses: [
    "Low engage range without ally setup.",
    "Can be poked if (E) is wasted.",
    "Struggles when his ADC cannot help stack passive.",
  ],
  damageType: "magic",
  hardCrowdControl: ["Passive stun", "(R) knockup"],
  id: "Braum",
  importantAbilityNotes: [
    "Fast-attacking ADCs make his passive much stronger.",
    "(E) can deny key poke or ultimates.",
    "(W) lets him reposition to protect allies.",
  ],
  lanePlan: {
    avoids: [
      "Chasing without passive stacks.",
      "Using (E) for low-value poke.",
      "Being separated from his ADC.",
    ],
    idealLaneState:
      "A controlled lane where Braum can stand near his ADC, block key spells, and punish enemies who commit into passive stacks.",
    wants: [
      "ADC close enough to stack passive.",
      "Enemy engage into his shield.",
      "Short skirmishes around minion waves.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "medium",
    lanePressure: "medium",
    preferredGameState: [
      "Anti-engage lanes.",
      "Extended trades.",
      "Front-to-back fights where projectiles matter.",
    ],
    scalingPriority: "medium",
    winLaneBy: [
      "Blocking key spells.",
      "Stacking passive quickly.",
      "Counter-engaging enemy all-ins.",
    ],
  },
  majorPowerSpikes: [
    "Level 2 (Q)+passive threat.",
    "Level 3 adds full peel with (E).",
    "Level 6 (R) adds lane engage and disengage.",
  ],
  matchupPreferences: {
    strongInto: ["Projectile poke.", "Dive supports.", "ADCs that must walk forward into passive."],
    weakInto: [
      "Sustain poke lanes.",
      "Long-range mages outside (Q).",
      "Lanes that ignore him and hit the ADC from range.",
    ],
  },
  mobilityLevel: "low",
  name: "Braum",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "Level 2",
        reason: "Level 2 (Q)+passive threat.",
        changesGameplay:
          "The first real bot-lane interaction changes once this support can pair two early abilities.",
        playerAction:
          "Track the level 2 race and only contest the wave if the ADC can follow the support's threat.",
        enemyResponse:
          "Respect the level 2 timer and back up before the support reaches the wave first.",
      },
      {
        timing: "Level 3",
        reason: "Level 3 adds full peel with (E).",
        changesGameplay:
          "The full basic kit unlocks the support's main trade, peel, or poke pattern.",
        playerAction:
          "Use the complete kit around brush control, ADC follow-up, and the enemy support's key cooldown.",
        enemyResponse:
          "Punish the support after their main cooldown is spent or when the wave blocks their angle.",
      },
      {
        timing: "Level 6",
        reason: "Level 6 (R) adds lane engage and disengage.",
        changesGameplay:
          "The ultimate changes all-in, peel, roam, or objective threat for the bot lane.",
        playerAction:
          "Use level 6 around confirmed ADC follow-up, river setup, or defensive reset value.",
        enemyResponse:
          "Track the ultimate cooldown and avoid giving a clean engage or counter-engage angle.",
      },
    ],
  },
  primaryRoles: ["support"],
  secondaryRoles: [],
  primaryTradingPattern:
    "Mark with (Q) or auto, let the ADC stack passive, and use (E) to block the enemy's strongest return damage.",
  punishProfile: {
    canPunish: [
      "Divers entering his ADC.",
      "ADCs walking up after passive is marked.",
      "Projectile ultimates aimed through him.",
    ],
    strugglesToPunish: [
      "Long-range poke outside (Q).",
      "Enemies who disengage before passive stacks.",
    ],
  },
  shields: ["(E) projectile block"],
  softCrowdControl: ["(Q) slow"],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "survive",
    preferredGameLength: "medium",
    scalingProfile: "mid",
    winMethod: [
      "Blocking key spells.",
      "Stacking passive quickly.",
      "Counter-engaging enemy all-ins.",
    ],
  },
  supportSynergy: {
    excellentWith: ["Lucian", "Ashe", "Kalista"],
    goodWith: ["KogMaw", "Jinx", "Vayne"],
    strugglesWith: ["Ezreal", "Ziggs", "Smolder"],
    notes: [
      "Fast-hit ADCs stack Braum passive quickly.",
      "Immobile hypercarries value his projectile block and peel.",
      "Long-range low-commit ADCs can struggle to help finish passive stuns.",
    ],
  },
  sustain: [],
  trading: {
    badTradeConditions: [
      "His ADC cannot stack passive.",
      "(E) is down.",
      "The enemy can kite outside (Q).",
    ],
    goodTradeConditions: [
      "Passive is marked.",
      "Enemy damage is projectile based.",
      "His ADC can free-hit during peel.",
    ],
    primaryPattern:
      "Mark with (Q) or auto, let the ADC stack passive, and use (E) to block the enemy's strongest return damage.",
  },
  punishWindows: [
    "Bait out (E) before committing key spells.",
    "Poke him when he cannot stand by his ADC.",
    "Disengage before passive reaches four stacks.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
