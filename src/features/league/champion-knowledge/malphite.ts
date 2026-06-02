import type { LeagueChampionKnowledgeProfile } from "./types";

export const malphiteCombatProfile = {
  profileQuality: "draft",
  abilities: {
    Q: "Seismic Shard",
    W: "Thunderclap",
    E: "Ground Slam",
    R: "Unstoppable Force",
  },
  archetype: ["tank", "anti-physical", "teamfight engage", "poke"],
  primaryWinCondition: [
    "Survive lane, blunt physical damage through armor and attack-speed reduction, then win fights with decisive (R) engage.",
  ],
  dangerAbilities: ["(R) engage", "(E) attack speed slow", "(Q) slow"],
  dangerProfile: {
    dangerousWhen: [
      "(R) is available and multiple targets can be hit.",
      "He has armor against physical damage lanes.",
      "(E) reduces auto-attack champions' trade output.",
    ],
    mustRespect: [
      "Level 6 turns passive lanes into sudden engage threat.",
      "Armor stacking makes physical trades worse over time.",
      "(R) is more valuable in grouped fights than small lane trades.",
    ],
  },
  commonWeaknesses: [
    "Weak into sustained magic damage or lanes that ignore armor.",
    "Limited kill pressure before level 6.",
    "Predictable when (R) is the main engage tool.",
  ],
  damageType: "magic",
  hardCrowdControl: ["(R) knockup"],
  id: "Malphite",
  importantAbilityNotes: [
    "(Q) pokes and steals movement speed.",
    "(W) empowers attacks and increases armor.",
    "(E) reduces attack speed.",
    "(R) is a long-range unstoppable knockup engage.",
  ],
  lanePlan: {
    avoids: [
      "Taking extended trades before armor and cooldowns matter.",
      "Wasting mana on low-value (Q) poke.",
      "Using (R) without follow-up or objective payoff.",
    ],
    idealLaneState:
      "A stable top lane where Malphite preserves health and mana, farms safely, and keeps enough control to threaten level 6 engage or teamfight setup.",
    wants: [
      "Physical damage lanes he can armor-stack against.",
      "Auto attackers affected by (E).",
      "Grouped fights where (R) decides the engage.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "low",
    lanePressure: "low",
    preferredGameState: [
      "Stable lanes against physical damage.",
      "Grouped fights after level 6.",
      "Teamfight setups where his engage is decisive.",
    ],
    scalingPriority: "high",
    winLaneBy: [
      "Surviving early pressure.",
      "Neutralizing physical damage with armor.",
      "Using (R) to create winning fights.",
    ],
  },
  majorPowerSpikes: ["Level 6 (R).", "First armor item into physical lanes.", "Grouped mid-game fights."],
  matchupPreferences: {
    strongInto: [
      "Physical auto attackers.",
      "Squishy targets vulnerable to (R).",
      "Compositions that group into engage.",
    ],
    weakInto: [
      "Magic damage duelists.",
      "Sustain lanes that ignore his poke.",
      "Splitpushers he cannot punish before 6.",
    ],
  },
  mobilityLevel: "low",
  name: "Malphite",
  offMetaRoles: ["mid", "support"],
  powerSpikes: {
    major: [
      {
        timing: "Level 6",
        reason: "(R) unlocks long-range engage",
        changesGameplay: "Malphite can threaten lethal gank setup or teamfight initiation even from a passive lane.",
        playerAction: "Use (R) for guaranteed kill setup or objective fights rather than low-value poke follow-up.",
        enemyResponse: "Respect flash or fog angles once Malphite has (R).",
      },
      {
        timing: "First armor item",
        reason: "Physical lanes become much easier to blunt",
        changesGameplay: "Auto attackers and AD bruisers lose trade efficiency.",
        playerAction: "Take safer trades into physical champions and preserve mana for meaningful windows.",
        enemyResponse: "Avoid extended physical trades and pressure before armor stacks.",
      },
    ],
  },
  primaryRoles: ["top"],
  primaryTradingPattern:
    "Use measured (Q) poke, reduce auto-based return damage with (E), and prioritize survival until (R) creates fight-winning engage.",
  punishProfile: {
    canPunish: [
      "Physical champions taking armor-reduced trades.",
      "Auto attackers after (E).",
      "Grouped targets once (R) is available.",
    ],
    strugglesToPunish: [
      "Magic damage lanes with sustain.",
      "Champions that splitpush away from his teamfight value.",
    ],
  },
  secondaryRoles: [],
  shields: ["Passive shield"],
  softCrowdControl: ["(Q) slow", "(E) attack speed slow"],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "teamfight",
    preferredGameLength: "medium",
    scalingProfile: "mid",
    winMethod: ["survive lane", "armor tanking", "teamfight engage"],
  },
  sustain: [],
  trading: {
    badTradeConditions: [
      "Low mana.",
      "Passive shield is down before poke starts.",
      "Enemy magic damage can ignore his armor plan.",
    ],
    goodTradeConditions: [
      "Passive shield is up.",
      "The enemy is physical or auto-attack reliant.",
      "(R) creates guaranteed follow-up.",
    ],
    primaryPattern:
      "Take low-risk poke or defensive trades, avoid overcommitting before level 6, and use (R) as the real swing tool.",
  },
  punishWindows: [
    "Before level 6, Malphite has limited hard engage.",
    "When passive shield is down, poke is more effective.",
    "If (R) is down, his threat is far lower.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
