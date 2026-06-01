import type { LeagueChampionKnowledgeProfile } from "./types";

export const lissandraCombatProfile = {
  profileQuality: "draft",
  abilities: {
    Q: "Ice Shard",
    W: "Ring of Frost",
    E: "Glacial Path",
    R: "Frozen Tomb",
  },
  archetype: ["control mage", "engage", "anti-assassin", "lockdown"],
  primaryWinCondition: [
    "Control short-range threats with layered crowd control and create reliable gank or teamfight setup.",
  ],
  dangerAbilities: ["W Ring of Frost root", "R Frozen Tomb stun or self-stasis", "E Glacial Path engage"],
  dangerProfile: {
    dangerousWhen: [
      "E can threaten a flank or long engage angle.",
      "R is available to lock down an enemy carry or deny an all-in.",
      "She has jungle help and can chain W and R crowd control.",
    ],
    mustRespect: [
      "R can be used offensively on enemies or defensively on herself.",
      "W punishes melee champions that commit into her.",
      "E has a visible travel path and can be punished if predicted.",
    ],
  },
  commonWeaknesses: [
    "Lower sustained damage than many control mages.",
    "Can be outranged and poked before she engages.",
    "Much less threatening when R is down.",
  ],
  damageType: "magic",
  hardCrowdControl: ["W Ring of Frost root", "R Frozen Tomb stun"],
  id: "Lissandra",
  importantAbilityNotes: [
    "Q is her main wave and poke tool.",
    "W roots nearby enemies and protects her from melee commits.",
    "E creates long engage or escape paths.",
    "R is her defining lockdown and self-peel spell.",
  ],
  lanePlan: {
    avoids: [
      "Taking long poke trades against higher range.",
      "Using E forward without follow-up.",
      "Forcing fights while R is unavailable.",
    ],
    idealLaneState:
      "A controlled mid wave where Lissandra can farm with Q, hold W for commits, and threaten E plus R setup.",
    wants: [
      "Enemy assassins or divers entering W range.",
      "Jungle or team follow-up for her CC chain.",
      "Flank angles where E creates reliable engage.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "medium",
    lanePressure: "medium",
    preferredGameState: [
      "Coordinated skirmishes with allied follow-up.",
      "Short-range enemies forced to commit into her crowd control.",
      "Teamfights where one locked target decides the fight.",
    ],
    scalingPriority: "medium",
    winLaneBy: [
      "Neutralizing enemy all-ins with W and R.",
      "Setting up ganks and roams with reliable lockdown.",
      "Creating engage angles from fog or flank positions.",
    ],
  },
  majorPowerSpikes: [
    "Level 6 Frozen Tomb.",
    "First completed AP or utility item.",
  ],
  matchupPreferences: {
    strongInto: [
      "Assassins and divers that must enter her W and R range.",
      "Teams that need one carry locked down.",
      "Lanes with jungle follow-up for her setup.",
    ],
    weakInto: [
      "Long-range poke mages that avoid her engage.",
      "Champions that can cleanse or deny her CC chain.",
      "High sustained damage after her cooldowns are spent.",
    ],
  },
  mobilityLevel: "medium",
  name: "Lissandra",
  offMetaRoles: [],
      strategicIdentity: {
        laneGoal: "teamfight",
        scalingProfile: "mid",
        preferredGameLength: "medium",
        winMethod: ["reliable engage", "pick setup", "carry lockdown"],
      },
      powerSpikes: {
      major: [
        {
          timing: "Level 6",
          reason: "Level 6 Frozen Tomb",
          changesGameplay: "Level 6 is her biggest lane threat increase",
          playerAction: "Track R availability and use the window for verified all-ins, picks, roams, or defensive resets rather than forcing blind.",
          enemyResponse: "Respect Lissandra's R window, hold key defensive tools for the commit, and punish after R is spent.",
        },
        {
          timing: "First completed AP or utility item",
          reason: "First completed AP or utility item",
          changesGameplay: "Her power is often in reliability and setup rather than raw damage",
          playerAction: "After the item, pressure waves and trades more confidently while still tracking the enemy's main answer.",
          enemyResponse: "Do not treat pre-item trades as still safe once Lissandra's first item threshold is completed.",
        },
      ],
    },
  primaryRoles: ["mid"],
  secondaryRoles: [],
  primaryTradingPattern:
    "Use Q for wave and poke, hold W for enemy commits, and use E plus R only when follow-up or a clear lockdown target exists.",
  punishProfile: {
    canPunish: [
      "Melee champions entering W range.",
      "Immobile targets when R and allies are ready.",
      "Enemies who ignore her E flank path.",
    ],
    strugglesToPunish: [
      "Long-range champions who never enter engage range.",
      "Enemies who can disengage after her cooldowns are spent.",
    ],
  },
  shields: [],
  softCrowdControl: ["Q Ice Shard slow"],
  stealthOrInvisibility: null,
  sustain: [],
  trading: {
    badTradeConditions: [
      "R is unavailable and the enemy can all-in.",
      "She is being outranged without E access.",
      "No ally can follow up on her engage.",
    ],
    goodTradeConditions: [
      "The enemy enters W range.",
      "R can lock the target for follow-up.",
      "E creates a safe flank or escape path.",
    ],
    primaryPattern:
      "Control the wave with Q, punish close-range commits with W, and save E plus R for decisive setup.",
  },
  punishWindows: [
    "If Lissandra uses E forward and cannot recast safely, she can be punished.",
    "If R is down, assassins and divers can pressure her harder.",
    "Long-range poke can chip her before she finds engage range.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
