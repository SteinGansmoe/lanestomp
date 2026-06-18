import type { LeagueChampionKnowledgeProfile } from "./types";

export const namiCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "medium",
  abilities: { Q: "Aqua Prison", W: "Ebb and Flow", E: "Tidecaller's Blessing", R: "Tidal Wave" },
  archetype: ["support", "enchanter", "poke", "pick"],
  primaryWinCondition: [
    "Win short trades with (W) and empowered ADC autos, then use bubble or Tidal Wave to turn poke into all-ins.",
  ],
  dangerAbilities: ["(Q) bubble", "(E) empowered trade", "(R) engage/disengage"],
  dangerProfile: {
    dangerousWhen: [
      "Her ADC can use (E) immediately.",
      "Enemy movement is slowed or predictable.",
      "Level 6 wave can start or stop an all-in.",
    ],
    mustRespect: [
      "(E) can create burst windows before her CC lands.",
      "Bubble is strongest after slows or allied setup.",
      "(W) trade bounce can decide lane sustain.",
    ],
  },
  commonWeaknesses: [
    "Bubble is slow and punishable if missed.",
    "Squishy into hard engage.",
    "Mana can be strained by constant (W) trades.",
  ],
  damageType: "magic",
  hardCrowdControl: ["(Q) bubble", "(R) knockup"],
  id: "Nami",
  importantAbilityNotes: [
    "(E) can create burst windows before her CC lands.",
    "Bubble is strongest after slows or allied setup.",
    "(W) trade bounce can decide lane sustain.",
  ],
  lanePlan: {
    avoids: [
      "Raw bubble fishing.",
      "Standing forward after (W).",
      "Letting hard engage start before she can slow.",
    ],
    idealLaneState:
      "A trading lane where Nami buffs ADC poke, sustains return damage, and holds bubble for slowed or committed targets.",
    wants: ["ADC burst trades.", "Enemy slowed by (E) or (R).", "Short sustain trades."],
  },
  laneIdentity: {
    earlyGameAgency: "high",
    lanePressure: "medium",
    preferredGameState: [
      "Short trade lanes.",
      "Poke into bubble setup.",
      "Level 6 engage or disengage.",
    ],
    scalingPriority: "medium",
    winLaneBy: ["Buffing ADC autos.", "Landing bubble after slows.", "Winning sustain trades."],
  },
  majorPowerSpikes: ["Level 2 (E)+(W) trades.", "Level 3 bubble setup.", "Level 6 Tidal Wave."],
  matchupPreferences: {
    strongInto: ["Short-range ADCs.", "Low-sustain lanes.", "Bot lanes vulnerable to slows."],
    weakInto: [
      "Hard engage if bubble misses.",
      "Long-range artillery poke.",
      "All-ins that ignore sustain.",
    ],
  },
  mobilityLevel: "low",
  name: "Nami",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "Level 2",
        reason: "Level 2 (E)+(W) trades.",
        changesGameplay:
          "The first real bot-lane interaction changes once this support can pair two early abilities.",
        playerAction:
          "Track the level 2 race and only contest the wave if the ADC can follow the support's threat.",
        enemyResponse:
          "Respect the level 2 timer and back up before the support reaches the wave first.",
      },
      {
        timing: "Level 3",
        reason: "Level 3 bubble setup.",
        changesGameplay:
          "The full basic kit unlocks the support's main trade, peel, or poke pattern.",
        playerAction:
          "Use the complete kit around brush control, ADC follow-up, and the enemy support's key cooldown.",
        enemyResponse:
          "Punish the support after their main cooldown is spent or when the wave blocks their angle.",
      },
      {
        timing: "Level 6",
        reason: "Level 6 Tidal Wave.",
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
    "Buff ADC trades with (E), bounce (W) for health advantage, and bubble targets after slows or commits.",
  punishProfile: {
    canPunish: [
      "ADCs stepping up for CS into empowered autos.",
      "Supports who use engage into bubble range.",
      "Grouped lanes hit by (R).",
    ],
    strugglesToPunish: [
      "Targets with dashes ready.",
      "Long-range poke outside (W).",
      "Engage after bubble misses.",
    ],
  },
  shields: [],
  softCrowdControl: ["(E) slow", "(R) slow"],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "survive",
    preferredGameLength: "medium",
    scalingProfile: "mid",
    winMethod: ["Buffing ADC autos.", "Landing bubble after slows.", "Winning sustain trades."],
  },
  supportSynergy: {
    excellentWith: ["Lucian", "Draven", "Ezreal"],
    goodWith: ["Caitlyn", "Varus", "Kaisa"],
    strugglesWith: ["KogMaw", "Smolder", "Aphelios"],
    notes: [
      "Lucian, Draven, Ezreal convert Nami's strongest lane pattern especially well.",
      "Caitlyn, Varus, Kaisa fit Nami when the lane can play around the same tempo window.",
      "KogMaw, Smolder, Aphelios can struggle with Nami when they need a different lane pace or protection pattern.",
    ],
  },
  sustain: ["(W) healing."],
  trading: {
    badTradeConditions: [
      "(Q) misses.",
      "(E) is used with no ADC hit window.",
      "Enemy engage is already on top of her.",
    ],
    goodTradeConditions: [
      "ADC can instantly use (E).",
      "Enemy is slowed.",
      "Wave state allows a short trade then reset.",
    ],
    primaryPattern:
      "Buff ADC trades with (E), bounce (W) for health advantage, and bubble targets after slows or commits.",
  },
  punishWindows: [
    "Engage after bubble misses.",
    "Force long trades after her cooldowns.",
    "Outrange her (W) sustain loop.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
