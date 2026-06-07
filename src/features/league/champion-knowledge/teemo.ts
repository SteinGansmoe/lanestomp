import type { LeagueChampionKnowledgeProfile } from "./types";

export const teemoCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "medium",
  abilities: { Q: "Blinding Dart", W: "Move Quick", E: "Toxic Shot", R: "Noxious Trap" },
  archetype: ["ranged lane bully", "poison poke", "trap control", "anti-auto"],
  primaryWinCondition: [
    "Use ranged poison trades and (Q) blind to deny melee and auto attackers, then control side-lane paths with (R) traps.",
  ],
  dangerAbilities: ["(Q) blind", "(R) traps", "Ranged poison autos"],
  dangerProfile: {
    dangerousWhen: [
      "Auto attackers trade into (Q) blind.",
      "The lane or river is trapped with (R).",
      "Melee champions are forced to last-hit under poison poke.",
    ],
    mustRespect: [
      "Blind can invalidate auto-based burst.",
      "Trap control changes gank and side-lane paths.",
      "His lane pressure comes from repeated small trades.",
    ],
  },
  commonWeaknesses: [
    "Fragile if engaged on.",
    "Limited teamfight reliability.",
    "Weak when enemies clear traps and force all-ins.",
  ],
  damageType: "magic",
  hardCrowdControl: [],
  id: "Teemo",
  importantAbilityNotes: [
    "(Q) blinds basic attacks.",
    "(W) gives movement speed.",
    "(E) adds poison to attacks.",
    "(R) places slowing poison traps.",
  ],
  lanePlan: {
    avoids: [
      "Letting engage champions reach him with (Q) down.",
      "Standing in long all-in lanes without trap coverage.",
      "Grouping where trap setup is not useful.",
    ],
    idealLaneState:
      "A ranged top lane where Teemo chips with autos, blinds key auto trades, and controls brush or river with traps.",
    wants: [
      "Auto attackers to blind.",
      "Melee champions entering poke range.",
      "Trap setups before side-lane pressure.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "high",
    lanePressure: "high",
    preferredGameState: [
      "Ranged poke lanes.",
      "Side-lane trap control.",
      "Short trades into auto attackers.",
    ],
    scalingPriority: "medium",
    winLaneBy: ["Poison harass.", "Timing (Q) into key autos.", "Using (R) to control paths."],
  },
  majorPowerSpikes: ["Level 6 (R).", "First AP/on-hit item.", "Established trap network."],
  matchupPreferences: {
    strongInto: [
      "Auto-attack reliant melee champions.",
      "Low sustain lanes.",
      "Side-lane paths he can trap.",
    ],
    weakInto: ["Hard engage and burst.", "Long-range poke.", "Reliable trap sweep and waveclear."],
  },
  mobilityLevel: "medium",
  name: "Teemo",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "Level 6",
        reason: "(R) unlocks trap control",
        changesGameplay: "Teemo can protect side lanes and punish pathing.",
        playerAction: "Trap brush, river, and retreat paths before pressuring.",
        enemyResponse: "Sweep traps before ganking or chasing.",
      },
      {
        timing: "First damage item",
        reason: "Poison trades become harder to ignore",
        changesGameplay: "Repeated autos can create lethal chip damage.",
        playerAction: "Keep trades short and blind key return damage.",
        enemyResponse: "Force all-ins when (Q) is down.",
      },
    ],
  },
  primaryRoles: ["top"],
  primaryTradingPattern:
    "Use ranged poison autos for chip, save (Q) for the enemy's key auto damage, and use (R) traps to make side-lane movement unsafe.",
  punishProfile: {
    canPunish: ["Auto attackers during blind.", "Melee last-hits.", "Enemies walking into traps."],
    strugglesToPunish: ["Hard engage after (Q).", "Long-range champions."],
  },
  secondaryRoles: [],
  shields: [],
  softCrowdControl: ["(R) slow"],
  stealthOrInvisibility: "Passive camouflage after standing still.",
  strategicIdentity: {
    laneGoal: "control",
    preferredGameLength: "medium",
    scalingProfile: "mid",
    winMethod: ["ranged lane poke", "blind trades", "trap-based side control"],
  },
  sustain: [],
  trading: {
    badTradeConditions: [
      "(Q) is down into auto burst.",
      "Trap coverage is missing.",
      "The enemy can hard engage through poke.",
    ],
    goodTradeConditions: [
      "The enemy relies on autos.",
      "Melee champions must last-hit.",
      "Traps cover retreat paths.",
    ],
    primaryPattern:
      "Win with repeated short poison trades and blind timing, then make chase paths dangerous with traps.",
  },
  punishWindows: [
    "After (Q), auto attackers can trade back.",
    "Before level 6, gank path control is weaker.",
    "If traps are swept, side pressure is less safe.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
