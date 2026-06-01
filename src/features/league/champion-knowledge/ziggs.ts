import type { LeagueChampionKnowledgeProfile } from "./types";

export const ziggsCombatProfile = {
  profileQuality: "draft",
  abilities: {
    Q: "Bouncing Bomb",
    W: "Satchel Charge",
    E: "Hexplosive Minefield",
    R: "Mega Inferno Bomb",
  },
  archetype: ["artillery mage", "poke", "waveclear", "siege"],
  primaryWinCondition: [
    "Use long-range waveclear and poke to control lane, then convert pressure into turret and objective setups.",
  ],
  dangerAbilities: ["Q Bouncing Bomb poke", "W Satchel Charge displacement and turret execute", "R Mega Inferno Bomb long-range burst"],
  dangerProfile: {
    dangerousWhen: [
      "He can poke from outside the enemy's engage range.",
      "W is available to disengage or execute a low turret.",
      "R can finish low-health targets or impact a grouped fight.",
    ],
    mustRespect: [
      "His waveclear makes roaming against him costly.",
      "W is his main self-peel and turret pressure tool.",
      "E controls choke points and punishes predictable paths.",
    ],
  },
  commonWeaknesses: [
    "Immobile and vulnerable when W is down.",
    "Skillshot reliant.",
    "Can be punished by hard engage that reaches through his poke range.",
  ],
  damageType: "magic",
  hardCrowdControl: ["W Satchel Charge displacement"],
  id: "Ziggs",
  importantAbilityNotes: [
    "Q is his main poke tool.",
    "W can knock enemies away, reposition Ziggs, and execute turrets.",
    "E controls zones and slows enemies crossing it.",
    "R gives long-range area damage.",
  ],
  lanePlan: {
    avoids: [
      "Standing close enough for engage while poking.",
      "Using W carelessly when enemy dive threat exists.",
      "Following roams through unsafe fog instead of pushing wave.",
    ],
    idealLaneState:
      "A long-range lane where Ziggs clears waves, chips health and turret plates, and forces enemies to walk through poke.",
    wants: [
      "Wave states he can clear from range.",
      "Objective setups where poke lands first.",
      "Turrets low enough for W execute pressure.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "medium",
    lanePressure: "high",
    preferredGameState: [
      "Long-range poke lanes.",
      "Siege and objective setups.",
      "Waveclear states that deny enemy roam timings.",
    ],
    scalingPriority: "medium",
    winLaneBy: [
      "Keeping enemies low with repeated poke.",
      "Denying roam value through fast waveclear.",
      "Turning lane pressure into turret damage.",
    ],
  },
  majorPowerSpikes: [
    "Level 6 Mega Inferno Bomb.",
    "First completed mage poke item.",
  ],
  matchupPreferences: {
    strongInto: [
      "Short-range champions who must walk through poke.",
      "Lanes where waveclear prevents enemy roams.",
      "Siege games around turret pressure.",
    ],
    weakInto: [
      "Hard engage that reaches him when W is down.",
      "Mobile assassins that dodge Q and force close range.",
      "Sustain-heavy lanes that ignore poke.",
    ],
  },
  mobilityLevel: "low",
  name: "Ziggs",
  offMetaRoles: [],
      powerSpikes: {
      major: [
        {
          timing: "Level 6",
          reason: "Level 6 Mega Inferno Bomb",
          changesGameplay: "Level 6 adds cross-map and objective fight damage",
          playerAction: "Track R availability and use the window for verified all-ins, picks, roams, or defensive resets rather than forcing blind.",
          enemyResponse: "Respect Ziggs's R window, hold key defensive tools for the commit, and punish after R is spent.",
        },
        {
          timing: "First completed mage poke item",
          reason: "First completed mage poke item",
          changesGameplay: "W cooldown is important because it is both safety and turret pressure",
          playerAction: "After the item, pressure waves and trades more confidently while still tracking the enemy's main answer.",
          enemyResponse: "Do not treat pre-item trades as still safe once Ziggs's first item threshold is completed.",
        },
      ],
    },
  primaryRoles: ["mid"],
  secondaryRoles: ["adc"],
  primaryTradingPattern:
    "Poke with Q from range, use E to control approach paths, and save W for disengage unless a turret execute is safe.",
  punishProfile: {
    canPunish: [
      "Enemies walking through E or repeated Q zones.",
      "Slow pushes where he can clear safely.",
      "Low turrets with W execute pressure.",
    ],
    strugglesToPunish: [
      "Mobile champions who dodge poke and reach him.",
      "Sustain lanes that outlast his mana and poke.",
    ],
  },
  shields: [],
  softCrowdControl: ["E Hexplosive Minefield slow"],
  stealthOrInvisibility: null,
  sustain: [],
  trading: {
    badTradeConditions: [
      "W is unavailable against engage threat.",
      "The enemy is already inside his poke range.",
      "He is low on mana and cannot maintain waveclear.",
    ],
    goodTradeConditions: [
      "He can poke from outside engage range.",
      "E controls the enemy approach path.",
      "The wave or turret state rewards long-range pressure.",
    ],
    primaryPattern:
      "Maintain distance, poke through Q and E, and preserve W as the emergency answer to hard engage.",
  },
  punishWindows: [
    "If Ziggs uses W, he is much easier to engage on.",
    "Mobile champions can punish missed Q windows.",
    "Low mana makes his waveclear and lane control much weaker.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
