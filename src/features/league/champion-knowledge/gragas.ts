import type { LeagueChampionKnowledgeProfile } from "./types";

export const gragasCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "high",
  abilities: { Q: "Barrel Roll", W: "Drunken Rage", E: "Body Slam", R: "Explosive Cask" },
  archetype: ["AP bruiser", "disengage", "burst setup", "flex pick"],
  primaryWinCondition: [
    "Control short trades with passive sustain and (W), punish oversteps with (E), and use (R) to disengage or isolate targets.",
  ],
  dangerAbilities: ["(E) stun", "(R) displacement", "(Q) slow"],
  dangerProfile: {
    dangerousWhen: [
      "(E) can connect from fog or short range.",
      "(R) can knock a target into his team or interrupt an engage.",
      "Passive sustain lets him repeat short trades.",
    ],
    mustRespect: [
      "(E) is both engage and escape.",
      "(R) can break normal front-to-back spacing.",
      "Short trades favor him when passive and (W) are available.",
    ],
  },
  commonWeaknesses: [
    "Mana and cooldown dependent.",
    "Can be punished after missed (E).",
    "Lower sustained damage than true duelists.",
  ],
  damageType: "magic",
  hardCrowdControl: ["(E) stun", "(R) displacement"],
  id: "Gragas",
  importantAbilityNotes: [
    "(Q) zones and slows.",
    "(W) reduces damage and empowers the next attack.",
    "(E) stuns and is refunded if it hits.",
    "(R) displaces enemies and can disengage or isolate.",
  ],
  lanePlan: {
    avoids: [
      "Using (E) into a losing wave.",
      "Taking long fights after burst rotation.",
      "Wasting passive sustain on low-value trades.",
    ],
    idealLaneState:
      "A controlled lane where Gragas can take short burst trades, heal with passive, and hold (E) for engage denial.",
    wants: [
      "Short trades around passive.",
      "Enemy dashes or commits he can interrupt with (E).",
      "Teamfight angles for (R).",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "medium",
    lanePressure: "medium",
    preferredGameState: [
      "Short trades.",
      "Skirmishes where (E) interrupts movement.",
      "Teamfights where (R) disrupts carries or divers.",
    ],
    scalingPriority: "medium",
    winLaneBy: [
      "Trading around passive sustain.",
      "Landing (E) into burst.",
      "Using (R) to deny enemy all-ins.",
    ],
  },
  majorPowerSpikes: ["Level 3 short trade pattern.", "Level 6 (R).", "First AP or tank item."],
  matchupPreferences: {
    strongInto: [
      "Dive champions he can interrupt.",
      "Short-trade lanes.",
      "Compositions vulnerable to displacement.",
    ],
    weakInto: [
      "Sustained duelists.",
      "Long-range poke that denies (E).",
      "Champions who punish missed (E).",
    ],
  },
  mobilityLevel: "medium",
  name: "Gragas",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "Level 6",
        reason: "(R) unlocks displacement and pick/disengage threat",
        changesGameplay: "Gragas can end enemy engages or knock targets into lethal positions.",
        playerAction: "Use (R) to isolate a target or protect yourself from committed engage.",
        enemyResponse: "Respect cask angles and punish after it is spent.",
      },
      {
        timing: "First AP or tank item",
        reason: "His burst or durability becomes reliable enough for repeated short trades",
        changesGameplay: "He can choose between lane kill pressure and front-line utility.",
        playerAction:
          "Trade around your build's strength and avoid fights that require what you did not buy.",
        enemyResponse: "Force longer fights if he built burst, or kite if he built tank.",
      },
    ],
    minor: [
      {
        timing: "Level 3",
        reason: "Full basic kit gives poke, damage reduction, stun, and sustain",
        changesGameplay: "Gragas can perform a complete short trade rotation.",
        playerAction: "Use (E) only when the wave and passive sustain make the trade favorable.",
        enemyResponse: "Bait (E) before committing.",
      },
    ],
  },
  primaryRoles: ["jungle", "top"],
  primaryTradingPattern:
    "Use (Q) to slow or zone, prepare (W), then (E) for a short burst trade before disengaging through passive sustain.",
  punishProfile: {
    canPunish: [
      "Enemies who dash into (E).",
      "Targets displaced by (R).",
      "Champions that cannot extend after his burst trade.",
    ],
    strugglesToPunish: ["High sustained damage duelists.", "Enemies who bait (E) and re-engage."],
  },
  secondaryRoles: [],
  shields: [],
  softCrowdControl: ["(Q) slow"],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "control",
    preferredGameLength: "medium",
    scalingProfile: "mid",
    winMethod: ["short trades", "engage denial", "disruptive teamfighting"],
  },
  sustain: ["Passive healing"],
  trading: {
    badTradeConditions: [
      "(E) misses.",
      "Passive is unavailable.",
      "The enemy can extend after his burst rotation.",
    ],
    goodTradeConditions: [
      "The enemy commits into (E).",
      "(W) is prepared before contact.",
      "(R) can disengage or isolate.",
    ],
    primaryPattern:
      "Take compact trades with (W) and (E), use passive to reset health, and avoid sustained duels after cooldowns are spent.",
  },
  punishWindows: [
    "After (E) misses, he loses both engage and escape.",
    "When passive is on cooldown, repeated trades hurt more.",
    "Before level 6, he has less displacement safety.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
