import type { LeagueChampionKnowledgeProfile } from "./types";

export const quinnCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "medium",
  abilities: { Q: "Blinding Assault", W: "Heightened Senses", E: "Vault", R: "Behind Enemy Lines" },
  archetype: ["ranged lane bully", "roamer", "marksman", "side-lane pick"],
  primaryWinCondition: [
    "Use ranged pressure and (E) spacing to win lane, then convert (R) mobility into roams, picks, and side-lane pressure.",
  ],
  dangerAbilities: ["(E) disengage", "(Q) blind", "(R) roam speed"],
  dangerProfile: {
    dangerousWhen: [
      "Melee champions must last-hit under her range.",
      "(E) cancels or creates spacing against engage.",
      "(R) lets her leave lane and punish the map.",
    ],
    mustRespect: [
      "Her lane pressure is ranged and tempo-based.",
      "Blind reduces auto-attack trade-back.",
      "Roams are part of her win condition, not a side note.",
    ],
  },
  commonWeaknesses: [
    "Fragile if caught.",
    "Weak in grouped front-to-back fights.",
    "Can be punished when (E) is down.",
  ],
  damageType: "physical",
  hardCrowdControl: [],
  id: "Quinn",
  importantAbilityNotes: [
    "(Q) blinds and damages.",
    "(W) reveals and grants attack speed after marks.",
    "(E) vaults off a target and interrupts some approaches.",
    "(R) gives high out-of-combat map mobility.",
  ],
  lanePlan: {
    avoids: [
      "Using (E) casually into engage lanes.",
      "Staying in lane when roam windows are stronger.",
      "Front-to-back grouping where she cannot flank or pick.",
    ],
    idealLaneState:
      "A ranged top lane where Quinn harasses melee last-hits, keeps (E) for engage, and crashes waves to roam with (R).",
    wants: [
      "Melee targets she can poke.",
      "Wave crashes before roams.",
      "Isolated targets vulnerable to blind and burst.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "high",
    lanePressure: "high",
    preferredGameState: [
      "Ranged bully lanes.",
      "Roam windows after crashes.",
      "Side-lane pick play.",
    ],
    scalingPriority: "medium",
    winLaneBy: [
      "Denying farm with range.",
      "Spacing engage with (E).",
      "Creating map pressure with (R).",
    ],
  },
  majorPowerSpikes: [
    "Level 6 (R) roaming.",
    "First marksman damage item.",
    "Side-lane pick windows.",
  ],
  matchupPreferences: {
    strongInto: [
      "Low mobility melee champions.",
      "Auto attackers affected by blind.",
      "Teams vulnerable to side pressure.",
    ],
    weakInto: [
      "Reliable gap close after (E).",
      "Hard engage and burst.",
      "Compositions that force grouped fights.",
    ],
  },
  mobilityLevel: "high",
  name: "Quinn",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "Level 6",
        reason: "(R) unlocks high-speed roams",
        changesGameplay: "Quinn can turn lane push into map pressure quickly.",
        playerAction: "Crash waves and move first instead of idling in lane.",
        enemyResponse: "Ping roams and punish missed waves or failed moves.",
      },
      {
        timing: "First damage item",
        reason: "Ranged trades and pick burst become stronger",
        changesGameplay: "Short harass can turn into kill pressure.",
        playerAction: "Pressure isolated targets while keeping (E) for escape.",
        enemyResponse: "Force her (E) before engaging.",
      },
    ],
  },
  primaryRoles: ["top"],
  primaryTradingPattern:
    "Harass with ranged autos and (Q), hold (E) for enemy engage, and use wave crashes to roam with (R).",
  punishProfile: {
    canPunish: [
      "Melee last-hits.",
      "Auto attackers during blind.",
      "Side-lane targets caught alone.",
    ],
    strugglesToPunish: ["Hard engage after (E).", "Durable tanks that absorb poke."],
  },
  secondaryRoles: [],
  shields: [],
  softCrowdControl: ["(E) slow"],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "snowball",
    preferredGameLength: "medium",
    scalingProfile: "early",
    winMethod: ["ranged lane pressure", "roams", "side-lane picks"],
  },
  sustain: [],
  trading: {
    badTradeConditions: [
      "(E) is down.",
      "The enemy can force grouped fights.",
      "She cannot maintain range.",
    ],
    goodTradeConditions: [
      "The enemy must walk up for farm.",
      "(Q) blind denies return autos.",
      "A wave crash gives roam timing.",
    ],
    primaryPattern:
      "Win through range and tempo, not extended melee fights; poke, disengage, crash, roam.",
  },
  punishWindows: [
    "After (E), engage is more reliable.",
    "If roams fail, she loses wave control and map pressure.",
    "Grouped fights reduce her pick value.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
