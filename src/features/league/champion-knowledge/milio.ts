import type { LeagueChampionKnowledgeProfile } from "./types";

export const milioCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "medium",
  abilities: { Q: "Ultra Mega Fire Kick", W: "Cozy Campfire", E: "Warm Hugs", R: "Breath of Life" },
  archetype: ["support", "enchanter", "peel", "range amplifier"],
  primaryWinCondition: [
    "Extend ADC range and protect carries with shields, peel, and cleanse while keeping fights at safe spacing.",
  ],
  dangerAbilities: ["(W) range zone", "(E) shields", "(R) cleanse"],
  dangerProfile: {
    dangerousWhen: [
      "His ADC can hit through (W).",
      "Enemy engage relies on crowd control.",
      "Level 6 cleanse denies all-in setups.",
  ],
    mustRespect: [
      "Range extension changes ADC trade windows.",
      "(Q) is his key anti-engage tool.",
      "(R) can cleanse layered CC if timed before burst finishes.",
  ],
  },
  commonWeaknesses: [
    "Low kill pressure alone.",
    "Vulnerable if (Q) is wasted.",
    "Can be overwhelmed by repeated engage after shields are gone.",
  ],
  damageType: "magic",
  hardCrowdControl: ["(Q) knockback"],
  id: "Milio",
  importantAbilityNotes: [
    "Range extension changes ADC trade windows.",
    "(Q) is his key anti-engage tool.",
    "(R) can cleanse layered CC if timed before burst finishes.",
  ],
  lanePlan: {
    avoids: [
      "Using (Q) for poke when engage is available.",
      "Fighting outside (W).",
      "Letting enemy support control brush for free.",
  ],
    idealLaneState: "A spacing lane where Milio keeps his ADC at max range, shields short trades, and saves (Q) for engage denial.",
    wants: [
      "Scaling ADC protected.",
      "Long auto trade windows.",
      "Enemies relying on CC engage.",
  ],
  },
  laneIdentity: {
    earlyGameAgency: "medium",
    lanePressure: "medium",
    preferredGameState: [
      "Protected scaling lanes.",
      "Anti-engage fights.",
      "Front-to-back DPS windows.",
  ],
    scalingPriority: "high",
    winLaneBy: [
      "Extending ADC auto range.",
      "Shielding key trades.",
      "Cleansing engage at level 6.",
  ],
  },
  majorPowerSpikes: ["Level 2 shield plus peel.", "Level 3 range zone.", "Level 6 Breath of Life cleanse."],
  matchupPreferences: {
    strongInto: [
      "CC engage lanes.",
      "Scaling carry lanes.",
      "Short-range ADCs who need range help.",
  ],
    weakInto: [
      "Heavy poke that outranges him.",
      "Repeated engage after (Q).",
      "Roam supports that abandon lane pressure.",
  ],
  },
  mobilityLevel: "low",
  name: "Milio",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "Level 2",
        reason: "Level 2 shield plus peel.",
        changesGameplay: "The first real bot-lane interaction changes once this support can pair two early abilities.",
        playerAction: "Track the level 2 race and only contest the wave if the ADC can follow the support's threat.",
        enemyResponse: "Respect the level 2 timer and back up before the support reaches the wave first.",
      },
      {
        timing: "Level 3",
        reason: "Level 3 range zone.",
        changesGameplay: "The full basic kit unlocks the support's main trade, peel, or poke pattern.",
        playerAction: "Use the complete kit around brush control, ADC follow-up, and the enemy support's key cooldown.",
        enemyResponse: "Punish the support after their main cooldown is spent or when the wave blocks their angle.",
      },
      {
        timing: "Level 6",
        reason: "Level 6 Breath of Life cleanse.",
        changesGameplay: "The ultimate changes all-in, peel, roam, or objective threat for the bot lane.",
        playerAction: "Use level 6 around confirmed ADC follow-up, river setup, or defensive reset value.",
        enemyResponse: "Track the ultimate cooldown and avoid giving a clean engage or counter-engage angle.",
      },
    ],
  },
  primaryRoles: ["support"],
  secondaryRoles: [],
  primaryTradingPattern: "Stand behind the ADC, extend range with (W), shield trade windows, and hold (Q) for enemy engage.",
  punishProfile: {
    canPunish: [
      "Divers after they commit.",
      "Short-range lanes walking into range-extended autos.",
      "CC all-ins at level 6.",
  ],
    strugglesToPunish: [
      "Poke lanes outside his range.",
      "Brush control he cannot contest.",
      "Fights after (Q) is down.",
  ],
  },
  shields: ["(E) shield"],
  softCrowdControl: [],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "survive",
    preferredGameLength: "long",
    scalingProfile: "late",
    winMethod: ["Extending ADC auto range.", "Shielding key trades.", "Cleansing engage at level 6."],
  },
  supportSynergy: {
    excellentWith: ["Lucian", "Caitlyn", "KogMaw"],
    goodWith: ["Jinx", "Aphelios", "Zeri"],
    strugglesWith: ["Samira", "Nilah", "Kalista"],
    notes: [
      "Lucian, Caitlyn, KogMaw convert Milio's strongest lane pattern especially well.",
      "Jinx, Aphelios, Zeri fit Milio when the lane can play around the same tempo window.",
      "Samira, Nilah, Kalista can struggle with Milio when they need a different lane pace or protection pattern.",
  ],
  },
  sustain: ["(W) healing.", "(R) cleanse and healing."],
  trading: {
    badTradeConditions: [
      "(Q) is down.",
      "(W) is misplaced.",
      "(R) cannot cleanse the key CC in time.",
  ],
    goodTradeConditions: [
      "ADC can free-hit in (W).",
      "Enemy engage is predictable.",
      "Shields are ready for the trade.",
  ],
    primaryPattern: "Stand behind the ADC, extend range with (W), shield trade windows, and hold (Q) for enemy engage.",
  },
  punishWindows: [
    "Bait (Q) before engaging.",
    "Fight after (W) expires.",
    "Force multiple CC waves after (R).",
  ],
} satisfies LeagueChampionKnowledgeProfile;
