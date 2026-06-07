import type { LeagueChampionKnowledgeProfile } from "./types";

export const kayleCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "medium",
  abilities: {
    Q: "Radiant Blast",
    W: "Celestial Blessing",
    E: "Starfire Spellblade",
    R: "Divine Judgment",
  },
  archetype: ["scaling carry", "late-game DPS", "invulnerability", "side-lane"],
  primaryWinCondition: [
    "Survive weak early levels, reach range and item thresholds, and become a late-game side-lane and teamfight DPS threat.",
  ],
  dangerAbilities: ["(R) invulnerability", "Level scaling range", "(Q) slow and resistance shred"],
  dangerProfile: {
    dangerousWhen: [
      "She reaches level and item thresholds without falling behind.",
      "(R) can deny lethal burst or enable a committed carry.",
      "Her ranged attacks let her control later side-lane trades.",
    ],
    mustRespect: [
      "Early pressure matters because a passive lane favors Kayle.",
      "Level breakpoints change her range and wave threat.",
      "(R) makes burst timing unreliable.",
    ],
  },
  commonWeaknesses: [
    "Very weak early lane.",
    "Low early agency.",
    "Punishable before range, items, and (R) are available.",
  ],
  damageType: "mixed",
  hardCrowdControl: [],
  id: "Kayle",
  importantAbilityNotes: [
    "(Q) slows and reduces resistances.",
    "(W) heals and speeds allies.",
    "(E) empowers attacks and executes low-health targets.",
    "(R) grants temporary invulnerability and later area damage.",
  ],
  lanePlan: {
    avoids: [
      "Taking early extended trades.",
      "Giving up too much health before scaling thresholds.",
      "Using (R) too late after lethal damage has already landed.",
    ],
    idealLaneState:
      "A defensive top lane where Kayle catches waves near her side, secures CS, and reaches level breakpoints without giving kills.",
    wants: [
      "CS access under low pressure.",
      "Time to reach range and item thresholds.",
      "Front-to-back fights after scaling.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "low",
    lanePressure: "low",
    preferredGameState: [
      "Passive lanes that reach levels.",
      "Side-lane farm after range unlocks.",
      "Late-game teamfights where she free-hits.",
    ],
    scalingPriority: "very_high",
    winLaneBy: [
      "Avoiding early deaths.",
      "Using (Q) and (W) to survive pressure.",
      "Reaching late-game DPS thresholds.",
    ],
  },
  majorPowerSpikes: [
    "Level 6 ranged form and (R).",
    "Level scaling thresholds.",
    "Late-game item DPS.",
  ],
  matchupPreferences: {
    strongInto: [
      "Low-pressure tanks.",
      "Scaling games that let her reach levels.",
      "Teams that cannot reach her in late fights.",
    ],
    weakInto: [
      "Early lane bullies.",
      "Freeze and dive pressure.",
      "Hard engage before she can safely DPS.",
    ],
  },
  mobilityLevel: "low",
  name: "Kayle",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "Level 6",
        reason: "Kayle gains ranged attacks and (R)",
        changesGameplay: "She can farm and trade more safely than before.",
        playerAction: "Stabilize lane and use (R) to deny decisive burst.",
        enemyResponse: "Punish before level 6 or bait (R) before all-in.",
      },
      {
        timing: "Late-game DPS threshold",
        reason: "Items and level scaling turn her into a carry",
        changesGameplay: "She becomes a major side-lane and teamfight threat.",
        playerAction: "Protect uptime and fight front-to-back.",
        enemyResponse: "Force fights before she free-hits.",
      },
    ],
  },
  primaryRoles: ["top"],
  primaryTradingPattern:
    "Avoid early trades, farm with (Q) and (E), then scale into ranged DPS while preserving (R) for lethal burst or committed fights.",
  punishProfile: {
    canPunish: [
      "Low-pressure lanes that let her scale.",
      "Enemies who waste engage into (R).",
      "Late-game targets who cannot reach her.",
    ],
    strugglesToPunish: [
      "Early bullies.",
      "Wave freezes and dives.",
      "Long-range engage before she scales.",
    ],
  },
  secondaryRoles: [],
  shields: [],
  softCrowdControl: ["(Q) slow"],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "scale",
    preferredGameLength: "long",
    scalingProfile: "late",
    winMethod: ["level scaling", "late DPS", "invulnerability timing"],
  },
  sustain: ["(W) heal"],
  trading: {
    badTradeConditions: [
      "Pre-6 melee form is forced into trades.",
      "(R) is down.",
      "The wave is frozen far from safety.",
    ],
    goodTradeConditions: [
      "She has reached range thresholds.",
      "The enemy's engage is down.",
      "(R) can deny burst.",
    ],
    primaryPattern:
      "Concede early pressure when needed, survive to range and item spikes, then take longer DPS trades with (R) available.",
  },
  punishWindows: [
    "Before level 6, Kayle is highly punishable.",
    "When (R) is down, burst is more reliable.",
    "Freezing away from her tower delays scaling.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
